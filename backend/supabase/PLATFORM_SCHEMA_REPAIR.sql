-- ============================================================================
-- PLATFORM WIDE SCHEMA REPAIR & INITIALIZATION (ROBUST VERSION)
-- ============================================================================

-- 1. Tables Initialization
CREATE TABLE IF NOT EXISTS public.study_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    study_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.class_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Robust Column & Constraint Check
-- study_progress
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS time_spent_minutes INT DEFAULT 0;
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS lessons_completed INT DEFAULT 0;
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS lessons_total INT DEFAULT 10;
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS completion_percentage INT DEFAULT 0;
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress';
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS completed_lessons TEXT[] DEFAULT '{}';
ALTER TABLE public.study_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- study_streaks
ALTER TABLE public.study_streaks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.study_streaks ADD COLUMN IF NOT EXISTS study_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.study_streaks ADD COLUMN IF NOT EXISTS minutes_studied INT DEFAULT 0;
ALTER TABLE public.study_streaks ADD COLUMN IF NOT EXISTS lessons_completed INT DEFAULT 0;

-- class_schedule
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'lesson';
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS meeting_url TEXT;
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE public.class_schedule ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- lesson_progress
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS watched_percentage INT DEFAULT 0;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Unique Constraints
ALTER TABLE public.study_progress DROP CONSTRAINT IF EXISTS study_progress_user_course_unique;
ALTER TABLE public.study_progress ADD CONSTRAINT study_progress_user_course_unique UNIQUE (user_id, course_id);

ALTER TABLE public.study_streaks DROP CONSTRAINT IF EXISTS study_streaks_user_date_unique;
ALTER TABLE public.study_streaks ADD CONSTRAINT study_streaks_user_date_unique UNIQUE (user_id, study_date);

ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_user_lesson_unique;
ALTER TABLE public.lesson_progress ADD CONSTRAINT lesson_progress_user_lesson_unique UNIQUE (user_id, lesson_id);

-- 4. Enable RLS
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Users can manage own study progress" ON public.study_progress;
CREATE POLICY "Users can manage own study progress" ON public.study_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own study streaks" ON public.study_streaks;
CREATE POLICY "Users can manage own study streaks" ON public.study_streaks FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own schedule" ON public.class_schedule;
CREATE POLICY "Users can view own schedule" ON public.class_schedule FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- 6. Ensure Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Avatars
DROP POLICY IF EXISTS "Public Access to Avatars" ON storage.objects;
CREATE POLICY "Public Access to Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
