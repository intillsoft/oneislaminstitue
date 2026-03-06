-- ============================================================================
-- COMPREHENSIVE COURSE STUDIO DATABASE REPAIR (V2)
-- Includes helper functions, schema alignment, and RLS repair.
-- ============================================================================

-- 1. Ensure the is_admin helper function exists (Required for RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
BEGIN
  RETURN (
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') IN ('admin', 'super_admin', 'super-admin')
    OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Ensure the 'jobs' table has all necessary columns
DO $$ 
BEGIN
    -- Core Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'company') THEN
        ALTER TABLE jobs ADD COLUMN company TEXT DEFAULT 'One Islam Institute';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'location') THEN
        ALTER TABLE jobs ADD COLUMN location TEXT DEFAULT 'Online';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_min') THEN
        ALTER TABLE jobs ADD COLUMN salary_min NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'price') THEN
        ALTER TABLE jobs ADD COLUMN price NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'job_type') THEN
        ALTER TABLE jobs ADD COLUMN job_type TEXT DEFAULT 'full-time';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'experience_level') THEN
        ALTER TABLE jobs ADD COLUMN experience_level TEXT DEFAULT 'foundational';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'industry') THEN
        ALTER TABLE jobs ADD COLUMN industry TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'subject_area') THEN
        ALTER TABLE jobs ADD COLUMN subject_area TEXT;
    END IF;

    -- Ownership & Tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_by') THEN
        ALTER TABLE jobs ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'instructor_id') THEN
        ALTER TABLE jobs ADD COLUMN instructor_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;

    -- Rich Metadata
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE jobs ADD COLUMN thumbnail_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'preview_video_url') THEN
        ALTER TABLE jobs ADD COLUMN preview_video_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'learning_outcomes') THEN
        ALTER TABLE jobs ADD COLUMN learning_outcomes TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'target_audience') THEN
        ALTER TABLE jobs ADD COLUMN target_audience TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'estimated_duration_hours') THEN
        ALTER TABLE jobs ADD COLUMN estimated_duration_hours INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'difficulty_rating') THEN
        ALTER TABLE jobs ADD COLUMN difficulty_rating DECIMAL(3,2) DEFAULT 0.0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'language') THEN
        ALTER TABLE jobs ADD COLUMN language TEXT DEFAULT 'English';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'instructor_bio') THEN
        ALTER TABLE jobs ADD COLUMN instructor_bio TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
        ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'total_lessons') THEN
        ALTER TABLE jobs ADD COLUMN total_lessons INT DEFAULT 0;
    END IF;
END $$;

-- 3. Repair RLS Policies for Course Management
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Drop all variants of the view/select policy to ensure a clean state
DROP POLICY IF EXISTS "Anyone can view active courses" ON jobs;
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can view all jobs" ON jobs;

CREATE POLICY "Anyone can view active courses" 
ON jobs FOR SELECT 
USING (
  COALESCE(status, 'active') IN ('active', 'published') 
  OR auth.uid() = created_by 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Instructors can insert courses" ON jobs;
CREATE POLICY "Instructors can insert courses" 
ON jobs FOR INSERT 
WITH CHECK (auth.uid() = created_by OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Instructors can update own courses" ON jobs;
CREATE POLICY "Instructors can update own courses" 
ON jobs FOR UPDATE 
USING (auth.uid() = created_by OR public.is_admin());

-- 4. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
