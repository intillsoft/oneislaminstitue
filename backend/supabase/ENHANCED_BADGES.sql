-- ============================================================================
-- PROGRESSION SCHEMA REPAIR v12 — ROBUST GAMIFICATION
-- Fixes: Syntax error in trigger (removed invalid LIMIT).
-- Refactored: Centralized badge checking into a single reusable function.
-- Adds: XP and One Coin based badges (first 5 easy milestones).
-- ============================================================================

-- 1. CLEAN SLATE
DROP TRIGGER IF EXISTS tr_award_badges ON public.study_progress;
DROP TRIGGER IF EXISTS tr_sync_xp_badges ON public.lesson_completions;
DROP TRIGGER IF EXISTS tr_check_badges_on_coins ON public.users;
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;

-- 2. RECREATE BADGES TABLE
CREATE TABLE public.badges (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT        NOT NULL UNIQUE,
    description   TEXT,
    icon_name     TEXT        NOT NULL, -- Lucide icon name
    color_scheme  TEXT        DEFAULT 'emerald',
    rarity        TEXT        DEFAULT 'common',
    criteria_type TEXT        NOT NULL, -- 'lessons_completed', 'courses_completed', 'total_xp', 'total_coins'
    criteria_value INTEGER     NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RECREATE USER_BADGES (Earned)
CREATE TABLE public.user_badges (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id  UUID        NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 4. ENSURE USER COLUMNS EXIST
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='total_xp') THEN
        ALTER TABLE public.users ADD COLUMN total_xp INT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='coins') THEN
        ALTER TABLE public.users ADD COLUMN coins INT DEFAULT 0;
    END IF;
END $$;

-- 5. SEED BADGES
INSERT INTO public.badges (name, description, icon_name, color_scheme, rarity, criteria_type, criteria_value)
VALUES 
('Novice Seeker', 'Earned your first 100 XP.', 'Zap', 'blue', 'common', 'total_xp', 100),
('Coin Collector', 'Saved 100 One Coins.', 'Coins', 'amber', 'common', 'total_coins', 100),
('Dedicated Student', 'Earned 500 XP.', 'Target', 'emerald', 'common', 'total_xp', 500),
('Wealthy Scholar', 'Accumulated 500 One Coins.', 'TreasureChest', 'purple', 'rare', 'total_coins', 500),
('Elite Learner', 'Reached 1,000 XP milestone.', 'Crown', 'rose', 'epic', 'total_xp', 1000),
('Seeker of Knowledge', 'Completed your first lesson.', 'BookOpen', 'blue', 'common', 'lessons_completed', 1),
('Academic Finisher', 'Completed your first course.', 'Award', 'amber', 'rare', 'courses_completed', 1);

-- 6. CENTRALIZED BADGE CHECKING FUNCTION
-- This function can be called by ANY trigger safely.
CREATE OR REPLACE FUNCTION public.check_user_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_badge RECORD;
    v_lessons_count INT;
    v_user_xp INT;
    v_user_coins INT;
BEGIN
    -- Get current stats for this user
    SELECT COALESCE(total_xp, 0), COALESCE(coins, 0) INTO v_user_xp, v_user_coins 
    FROM public.users WHERE id = p_user_id;
    
    -- Get global lesson completion count
    SELECT COUNT(*) INTO v_lessons_count FROM public.lesson_completions WHERE user_id = p_user_id;

    -- 1. Check Lessons Completed Badges
    FOR v_badge IN SELECT id FROM public.badges WHERE criteria_type = 'lessons_completed' AND criteria_value <= v_lessons_count LOOP
        INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 2. Check XP Badges
    FOR v_badge IN SELECT id FROM public.badges WHERE criteria_type = 'total_xp' AND criteria_value <= v_user_xp LOOP
        INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 3. Check Coin Badges
    FOR v_badge IN SELECT id FROM public.badges WHERE criteria_type = 'total_coins' AND criteria_value <= v_user_coins LOOP
        INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id) ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. TRIGGER FUNCTIONS

-- A. For Lesson Completions (Syncs XP then checks badges)
CREATE OR REPLACE FUNCTION public.fn_trigger_lessons()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users 
    SET total_xp = (SELECT COALESCE(SUM(xp_earned), 0) FROM public.lesson_completions WHERE user_id = NEW.user_id)
    WHERE id = NEW.user_id;
    
    PERFORM public.check_user_badges(NEW.user_id);
    RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. For Coins (Trigger check whenever user balance updates)
CREATE OR REPLACE FUNCTION public.fn_trigger_coins()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.check_user_badges(NEW.id);
    RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. For Course Progress
CREATE OR REPLACE FUNCTION public.fn_trigger_progress()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.check_user_badges(NEW.user_id);
    RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ATTACH TRIGGERS
CREATE TRIGGER tr_sync_xp_badges AFTER INSERT OR UPDATE ON public.lesson_completions FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_lessons();
CREATE TRIGGER tr_check_badges_on_coins AFTER UPDATE OF coins ON public.users FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_coins();
CREATE TRIGGER tr_award_badges AFTER INSERT OR UPDATE ON public.study_progress FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_progress();

-- 9. PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';
