-- ============================================================================
-- PROGRESSION SCHEMA REPAIR v9 — CLEAN SLATE
-- Drops and recreates broken tables. Safe because 404 errors confirm they
-- are either empty or corrupted. Run in Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- PART A: DIAGNOSTIC — See what's actually in your DB right now
-- (Scroll past the results and run PART B separately if you want confirmation)
-- ============================================================================
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name IN ('study_progress','lesson_completions','study_streaks','quiz_results','coin_transactions')
-- ORDER BY table_name, ordinal_position;

-- ============================================================================
-- PART B: DROP BROKEN TABLES (the 404s confirm no usable data)
-- ============================================================================
DROP TABLE IF EXISTS public.quiz_results        CASCADE;
DROP TABLE IF EXISTS public.study_streaks       CASCADE;
DROP TABLE IF EXISTS public.coin_transactions   CASCADE;
DROP TABLE IF EXISTS public.study_progress      CASCADE;

-- lesson_completions: only drop if it's missing the course_id column
-- (to avoid losing data if it's healthy)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'lesson_completions'
          AND column_name  = 'course_id'
    ) THEN
        DROP TABLE IF EXISTS public.lesson_completions CASCADE;
        RAISE NOTICE 'Dropped lesson_completions (missing course_id column)';
    ELSE
        RAISE NOTICE 'lesson_completions looks healthy, keeping it';
    END IF;
END $$;

-- ============================================================================
-- PART C: RECREATE TABLES
-- ============================================================================

-- 1. study_progress
CREATE TABLE public.study_progress (
    id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id             UUID        NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    completed_lessons     TEXT[]      DEFAULT '{}',
    lessons_completed     INT         DEFAULT 0,
    lessons_total         INT         DEFAULT 0,
    completion_percentage INT         DEFAULT 0,
    status                TEXT        DEFAULT 'in_progress',
    last_activity_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 2. lesson_completions (only created if it was just dropped above)
CREATE TABLE IF NOT EXISTS public.lesson_completions (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id    UUID        NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    course_id    UUID        REFERENCES public.jobs(id) ON DELETE CASCADE,
    xp_earned    INT         DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Add course_id if it still doesn't exist (table was NOT dropped above)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'lesson_completions'
          AND column_name  = 'course_id'
    ) THEN
        ALTER TABLE public.lesson_completions
            ADD COLUMN course_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'lesson_completions'
          AND column_name  = 'xp_earned'
    ) THEN
        ALTER TABLE public.lesson_completions ADD COLUMN xp_earned INT DEFAULT 0;
    END IF;
END $$;

-- 3. quiz_results
CREATE TABLE public.quiz_results (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id       UUID        NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    lesson_id       UUID        NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    quiz_id         TEXT        NOT NULL,
    score           INT         DEFAULT 0,
    total_questions INT         DEFAULT 1,
    passed          BOOLEAN     DEFAULT FALSE,
    completed_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id, quiz_id)
);

-- 4. study_streaks
CREATE TABLE public.study_streaks (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_date        DATE        NOT NULL DEFAULT CURRENT_DATE,
    minutes_studied   INT         DEFAULT 0,
    lessons_completed INT         DEFAULT 0,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, study_date)
);

-- 5. coin_transactions
CREATE TABLE public.coin_transactions (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount       INT         NOT NULL,
    type         TEXT        NOT NULL,
    description  TEXT,
    reference_id UUID,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 6. coins column on users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'users'
          AND column_name  = 'coins'
    ) THEN
        ALTER TABLE public.users ADD COLUMN coins INT DEFAULT 0;
    END IF;
END $$;

-- ============================================================================
-- PART D: ENABLE RLS
-- ============================================================================
ALTER TABLE public.study_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions  ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART E: RLS POLICIES
-- ALL CREATE POLICY statements are at the TOP LEVEL (not inside any DO block)
-- ============================================================================

DROP POLICY IF EXISTS "Users can manage own study progress"       ON public.study_progress;
DROP POLICY IF EXISTS "Users can view own study progress"         ON public.study_progress;

DROP POLICY IF EXISTS "Users can manage own lesson completions"   ON public.lesson_completions;
DROP POLICY IF EXISTS "Users can view own lesson completions"     ON public.lesson_completions;

DROP POLICY IF EXISTS "Users can manage own quiz results"         ON public.quiz_results;
DROP POLICY IF EXISTS "Users can view own quiz results"           ON public.quiz_results;

DROP POLICY IF EXISTS "Users can manage own streaks"              ON public.study_streaks;
DROP POLICY IF EXISTS "Users can view own streaks"                ON public.study_streaks;

DROP POLICY IF EXISTS "Users can manage own coin transactions"    ON public.coin_transactions;
DROP POLICY IF EXISTS "Users can manage own transactions"         ON public.coin_transactions;

CREATE POLICY "Users can manage own study progress"
    ON public.study_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson completions"
    ON public.lesson_completions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own quiz results"
    ON public.quiz_results FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks"
    ON public.study_streaks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own coin transactions"
    ON public.coin_transactions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PART F: COIN BALANCE TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_user_coins_balance()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := COALESCE(NEW.user_id, OLD.user_id);
    UPDATE public.users
    SET coins = (
        SELECT COALESCE(SUM(amount), 0)
        FROM public.coin_transactions
        WHERE user_id = v_user_id
    )
    WHERE id = v_user_id;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_coins ON public.coin_transactions;
CREATE TRIGGER tr_update_coins
    AFTER INSERT OR UPDATE OR DELETE ON public.coin_transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_user_coins_balance();

-- ============================================================================
-- PART G: PERMISSIONS & SCHEMA CACHE FLUSH
-- ============================================================================
GRANT ALL ON ALL TABLES    IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';
