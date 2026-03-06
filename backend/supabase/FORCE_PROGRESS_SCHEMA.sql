-- ============================================================================
-- PROGRESS SCHEMA FORCE INIT AND CACHE RELOAD SCRIPT 
-- Run this in Supabase SQL Editor to force the creation of the schema and 
-- expose an RPC we can use to bypass standard queries if needed.
-- ============================================================================

-- Force Drop and Recreate to clear corrupted cache if necessary
-- WARNING: This deletes data but study_progress was already broken/empty.
DROP TABLE IF EXISTS public.study_progress CASCADE;
DROP TABLE IF EXISTS public.lesson_progress CASCADE;
DROP TABLE IF EXISTS public.study_streaks CASCADE;

-- 1. Create study_progress table
CREATE TABLE public.study_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    modules_total INT DEFAULT 0,
    modules_completed INT DEFAULT 0,
    lessons_total INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    completed_lessons TEXT[] DEFAULT '{}',
    quizzes_passed INT DEFAULT 0,
    quizzes_total INT DEFAULT 0,
    time_spent_minutes INT DEFAULT 0,
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    status TEXT DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 2. Create lesson_progress table (Detailed status per lesson)
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    watched_percentage INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 3. Create study_streaks table (For dashboard heatmap)
CREATE TABLE public.study_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL,
    minutes_studied INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    courses_active INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, study_date)
);

-- 5. Enable RLS and add basic policies
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own study progress" ON public.study_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streaks" ON public.study_streaks FOR ALL USING (auth.uid() = user_id);

-- 6. Permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role, anon;

-- Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
