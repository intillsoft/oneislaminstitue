-- ============================================================================
-- Course Curriculum Schema: Modules & Lessons
-- Supports structured course content with ordering and descriptions
-- ============================================================================

-- Modules table (top-level groupings within a course)
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lessons table (individual items within a module)
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_sort ON course_modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort ON course_lessons(module_id, sort_order);

-- Row Level Security
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Everyone can read published modules & lessons
CREATE POLICY "Anyone can view published modules"
  ON course_modules FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view published lessons"
  ON course_lessons FOR SELECT
  USING (is_published = true);

-- Admins/instructors can manage modules & lessons
CREATE POLICY "Admins can manage modules"
  ON course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admins can manage lessons"
  ON course_lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'recruiter')
    )
  );
