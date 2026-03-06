-- ============================================================================
-- SCHOLAR BADGES & ACHIEVEMENTS SYSTEM
-- ============================================================================

-- 1. Badges Definition Table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT NOT NULL, -- Lucide icon name
    color_scheme TEXT DEFAULT 'emerald',
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    criteria_type TEXT NOT NULL, -- 'lessons_completed', 'courses_completed', 'streak_days', 'quizzes_perfect'
    criteria_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Badges (Earned)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 3. Seed some initial badges
INSERT INTO badges (name, description, icon_name, color_scheme, rarity, criteria_type, criteria_value)
VALUES 
('Seeker of Knowledge', 'Completed your first lesson.', 'BookOpen', 'blue', 'common', 'lessons_completed', 1),
('Dedicated Scholar', 'Completed 10 lessons.', 'GraduationCap', 'emerald', 'common', 'lessons_completed', 10),
('Master of Focus', 'Maintained a 7-day study streak.', 'Flame', 'orange', 'rare', 'streak_days', 7),
('Academic Finisher', 'Completed your first course.', 'Award', 'amber', 'rare', 'courses_completed', 1),
('Elite Scholar', 'Completed 5 courses.', 'Trophy', 'indigo', 'epic', 'courses_completed', 5)
ON CONFLICT (name) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Users can view own earned badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);

-- 6. Trigger to auto-award lesson-based badges
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_badge RECORD;
BEGIN
    -- Check lesson-based badges
    FOR v_badge IN 
        SELECT * FROM badges 
        WHERE criteria_type = 'lessons_completed' 
        AND criteria_value <= NEW.lessons_completed
    LOOP
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (NEW.user_id, v_badge.id)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Check course-based badges
    IF NEW.status = 'completed' THEN
        FOR v_badge IN 
            SELECT * FROM badges 
            WHERE criteria_type = 'courses_completed' 
            AND criteria_value <= (SELECT count(*) FROM study_progress WHERE user_id = NEW.user_id AND status = 'completed')
        LOOP
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (NEW.user_id, v_badge.id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_award_badges ON study_progress;
CREATE TRIGGER tr_award_badges
AFTER INSERT OR UPDATE ON study_progress
FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();
