-- ============================================================================
-- THE REAL FINAL DATABASE REPAIR SCRIPT 
-- Resolves Enrollment Visibility (RLS), Notifications Crash, and Saved Courses
-- Uses the correct course schema variables (instructor_id instead of user_id/employer_id)
-- ============================================================================

-- 1. NOTIFICATIONS TABLE (Fixes the 500 Error / Crash)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    action_url TEXT,
    action_label TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- 2. SAVED_COURSES TABLE (Fixes the PGRST200 relationship error)
CREATE TABLE IF NOT EXISTS public.saved_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, job_id)
);

-- Ensure the relationship exists for the PostgREST API
ALTER TABLE public.saved_courses DROP CONSTRAINT IF EXISTS saved_courses_job_id_fkey;
ALTER TABLE public.saved_courses ADD CONSTRAINT saved_courses_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

ALTER TABLE public.saved_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own saved courses" ON public.saved_courses;
DROP POLICY IF EXISTS "Users can manage their own saved courses" ON public.saved_courses;

CREATE POLICY "Users can view their own saved courses" ON public.saved_courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own saved courses" ON public.saved_courses FOR ALL USING (auth.uid() = user_id);

-- 3. ENROLLMENTS (APPLICATIONS) RLS POLICIES (Fixes users not seeing enrolled courses)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Course creators can view applications" ON public.applications;

CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);

-- Explicitly use instructor_id from the modern course schema
CREATE POLICY "Course creators can view applications"
ON public.applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE (j.id = applications.course_id OR j.id = applications.job_id)
    AND j.instructor_id = auth.uid()
  )
);

-- Force Supabase's PostgREST to refresh its schema cache 
-- (which resolves PGRST200 without having to restart the backend)
NOTIFY pgrst, 'reload schema';
