-- ============================================================================
-- Fix 403 Forbidden Error on course_modules INSERT
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Public select modules" ON public.course_modules;
DROP POLICY IF EXISTS "Auth insert modules" ON public.course_modules;
DROP POLICY IF EXISTS "Auth update modules" ON public.course_modules;
DROP POLICY IF EXISTS "Auth delete modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.course_modules;
DROP POLICY IF EXISTS "Anyone can view published modules" ON public.course_modules;
DROP POLICY IF EXISTS "Anyone can view modules" ON public.course_modules;

DROP POLICY IF EXISTS "Public select lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Auth insert lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Auth update lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Auth delete lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Anyone can view published lessons" ON public.course_lessons;

-- Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COURSE MODULES POLICIES
-- ============================================================================

-- SELECT: Anyone can read
CREATE POLICY "modules_select_all" 
  ON public.course_modules FOR SELECT 
  USING (true);

-- INSERT: Authenticated users (who are instructors/admins based on their role)
CREATE POLICY "modules_insert_authenticated" 
  ON public.course_modules FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'recruiter', 'instructor')
    )
  );

-- UPDATE: User can update if they're admin/instructor or owner
CREATE POLICY "modules_update_authenticated" 
  ON public.course_modules FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'recruiter', 'instructor')
    )
  );

-- DELETE: Only admin/instructor can delete
CREATE POLICY "modules_delete_authenticated" 
  ON public.course_modules FOR DELETE 
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'recruiter', 'instructor')
    )
  );

-- ============================================================================
-- COURSE LESSONS POLICIES
-- ============================================================================

-- SELECT: Anyone can read
CREATE POLICY "lessons_select_all" 
  ON public.course_lessons FOR SELECT 
  USING (true);

-- INSERT: Authenticated instructors
CREATE POLICY "lessons_insert_authenticated" 
  ON public.course_lessons FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'recruiter', 'instructor')
    )
  );

-- UPDATE: Authenticated instructors
CREATE POLICY "lessons_update_authenticated" 
  ON public.course_lessons FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'recruiter', 'instructor')
    )
  );

-- DELETE: Only admin/instructor
CREATE POLICY "lessons_delete_authenticated" 
  ON public.course_lessons FOR DELETE 
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'recruiter', 'instructor')
    )
  );

-- ============================================================================
-- Create course_progress table for tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  completed_modules INT DEFAULT 0,
  total_modules INT DEFAULT 0,
  completed_lessons INT DEFAULT 0,
  total_lessons INT DEFAULT 0,
  progress_percentage INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_progress" 
  ON course_progress FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'recruiter')));

CREATE POLICY "users_manage_own_progress" 
  ON course_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_progress" 
  ON course_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================================================
-- Create lesson_progress table for individual lesson tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  watched_percentage INT DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_lesson_progress" 
  ON lesson_progress FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'recruiter')));

CREATE POLICY "users_manage_own_lesson_progress" 
  ON lesson_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_lesson_progress" 
  ON lesson_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- ============================================================================
-- Update course_lessons to support flexible content blocks
-- ============================================================================

DO $$
BEGIN
    -- Add content_blocks column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_lessons' 
        AND column_name = 'content_blocks'
    ) THEN
        ALTER TABLE public.course_lessons ADD COLUMN content_blocks JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add video_url column for simplified video storage
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_lessons' 
        AND column_name = 'video_url'
    ) THEN
        ALTER TABLE public.course_lessons ADD COLUMN video_url TEXT;
    END IF;
    
    -- Add thumbnail_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_lessons' 
        AND column_name = 'thumbnail_url'
    ) THEN
        ALTER TABLE public.course_lessons ADD COLUMN thumbnail_url TEXT;
    END IF;
END $$;

-- Create function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE course_progress
  SET 
    progress_percentage = GREATEST(
      0,
      LEAST(
        100,
        (completed_lessons::FLOAT / NULLIF(total_lessons, 0) * 100)::INT
      )
    ),
    updated_at = now()
  WHERE course_id = NEW.course_id
    AND user_id IN (SELECT user_id FROM lesson_progress WHERE lesson_id = NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for progress updates
DROP TRIGGER IF EXISTS update_course_progress_on_lesson ON lesson_progress;
CREATE TRIGGER update_course_progress_on_lesson
AFTER INSERT OR UPDATE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION calculate_course_progress();
