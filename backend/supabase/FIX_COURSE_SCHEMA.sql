-- ============================================================================
-- FIX COURSE SCHEMA
-- Ensures base 'jobs' table exists before creating curriculum tables
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure 'jobs' table exists (Base dependency)
-- Using explicit uuid_generate_v4() for compatibility
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    description TEXT,
    source TEXT CHECK (source IN ('indeed', 'linkedin', 'glassdoor', 'manual')),
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add company column if it doesn't exist (safety check)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'company'
    ) THEN
        ALTER TABLE jobs ADD COLUMN company TEXT;
    END IF;
END $$;

-- Enable RLS on jobs if not already enabled
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 2. Create Course Curriculum Tables

-- Modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'text', -- text, video, quiz, assignment
  duration_minutes INT,
  sort_order INT DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_sort ON course_modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort ON course_lessons(module_id, sort_order);

-- RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Policies for Modules
DROP POLICY IF EXISTS "Anyone can view published modules" ON course_modules;
CREATE POLICY "Anyone can view published modules"
  ON course_modules FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage modules" ON course_modules;
CREATE POLICY "Admins can manage modules"
  ON course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'recruiter')
    )
  );

-- Policies for Lessons
DROP POLICY IF EXISTS "Anyone can view published lessons" ON course_lessons;
CREATE POLICY "Anyone can view published lessons"
  ON course_lessons FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage lessons" ON course_lessons;
CREATE POLICY "Admins can manage lessons"
  ON course_lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'recruiter')
    )
  );
