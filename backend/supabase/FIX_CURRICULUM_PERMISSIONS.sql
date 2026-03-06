-- Fix Curriculum Permissions

-- Add content_blocks to course_lessons if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'content_blocks') THEN
        ALTER TABLE public.course_lessons ADD COLUMN content_blocks JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Drop any potentially conflicting policies
DROP POLICY IF EXISTS "Anyone can view modules" ON public.course_modules;
DROP POLICY IF EXISTS "Instructors can insert modules" ON public.course_modules;
DROP POLICY IF EXISTS "Instructors can update modules" ON public.course_modules;
DROP POLICY IF EXISTS "Instructors can delete modules" ON public.course_modules;
DROP POLICY IF EXISTS "Public select modules" ON public.course_modules;
DROP POLICY IF EXISTS "Auth insert/update/delete modules" ON public.course_modules;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.course_modules;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.course_modules;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.course_modules;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.course_modules;

DROP POLICY IF EXISTS "Anyone can view lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Instructors can insert lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Instructors can update lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Instructors can delete lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Public select lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Auth insert/update/delete lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.course_lessons;

-- Create broad policies for modules
CREATE POLICY "Public select modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Auth insert modules" ON public.course_modules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update modules" ON public.course_modules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete modules" ON public.course_modules FOR DELETE USING (auth.role() = 'authenticated');

-- Create broad policies for lessons
CREATE POLICY "Public select lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Auth insert lessons" ON public.course_lessons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update lessons" ON public.course_lessons FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete lessons" ON public.course_lessons FOR DELETE USING (auth.role() = 'authenticated');

