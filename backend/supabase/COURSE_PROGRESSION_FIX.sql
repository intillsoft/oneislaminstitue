-- ============================================================================
-- COURSE PROGRESSION AND REWARDS FIX
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Fix study_progress table
ALTER TABLE public.study_progress 
ADD COLUMN IF NOT EXISTS completed_lessons TEXT[] DEFAULT '{}';

-- 2. Fix users table (add coins)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0;

-- 3. Fix profiles table (add coins for sync)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0;

-- 4. Ensure lesson_progress table exists (for per-lesson state)
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    watched_percentage INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS on lesson_progress
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own lesson progress') THEN
        CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;
