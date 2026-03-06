-- ============================================================================
-- FINAL DATABASE REPAIR SCRIPT
-- RUN THIS IN YOUR SUPABASE DASHBOARD -> SQL EDITOR
-- ============================================================================

-- 1. FIX USERS TABLE (Add coins)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0;

-- 2. FIX PROFILES TABLE (Add coins if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='profiles') THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0;
    END IF;
END $$;

-- 3. FIX NOTIFICATIONS TABLE (Add data column)
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;

-- 4. CREATE PROGRESS TABLES
CREATE TABLE IF NOT EXISTS public.study_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    lessons_total INT DEFAULT 10,
    lessons_completed INT DEFAULT 0,
    completed_lessons TEXT[] DEFAULT '{}',
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

CREATE TABLE IF NOT EXISTS public.lesson_progress (
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

CREATE TABLE IF NOT EXISTS public.study_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL,
    minutes_studied INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    courses_active INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, study_date)
);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

-- 6. ADD RLS POLICIES
DROP POLICY IF EXISTS "Users can manage own study progress" ON public.study_progress;
CREATE POLICY "Users can manage own study progress" ON public.study_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own streaks" ON public.study_streaks;
CREATE POLICY "Users can manage own streaks" ON public.study_streaks FOR ALL USING (auth.uid() = user_id);

-- 7. REFRESH CACHE (CRITICAL)
NOTIFY pgrst, 'reload schema';
