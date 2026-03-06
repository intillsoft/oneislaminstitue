-- 1. NOTIFICATIONS TABLE (Fixes the 500 Error)
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

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- 2. SAVED_COURSES TABLE (Fixes the PGRST200 foreign key error)
-- If table doesn't exist, create it. If it does, ensure foreign key exists.
CREATE TABLE IF NOT EXISTS public.saved_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, job_id)
);

-- Note: if `saved_courses` already existed without a foreign key, 
-- we would need to add it, but Supabase standard table creation handles this. Let's explicitly add the FK if missing.
ALTER TABLE public.saved_courses 
DROP CONSTRAINT IF EXISTS saved_courses_job_id_fkey;

ALTER TABLE public.saved_courses
ADD CONSTRAINT saved_courses_job_id_fkey 
FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

-- Enable RLS for saved_courses
ALTER TABLE public.saved_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own saved courses" ON public.saved_courses;
DROP POLICY IF EXISTS "Users can manage their own saved courses" ON public.saved_courses;

CREATE POLICY "Users can view their own saved courses"
ON public.saved_courses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved courses"
ON public.saved_courses FOR ALL
USING (auth.uid() = user_id);
