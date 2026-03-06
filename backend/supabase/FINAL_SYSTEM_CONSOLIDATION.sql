-- ============================================================================
-- 🚀 ONE ISLAM INSTITUTE: ULTIMATE SYSTEM CONSOLIDATION
-- Fixing Enrollment, Course Studio, and Gamification Data
-- ============================================================================

-- 1. ENROLLMENT SYSTEM REPAIR (Bulletproof)
-- Ensure 'applications' table is clean and has perfect foreign keys
DO $$ BEGIN
    -- Add course_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'course_id') THEN
        ALTER TABLE applications ADD COLUMN course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
    
    -- Add user_id if missing (should exist, but let's be sure)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'user_id') THEN
        ALTER TABLE applications ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
    END IF;

    -- Standardize status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'status') THEN
        ALTER TABLE applications ADD COLUMN status TEXT DEFAULT 'enrolled';
    END IF;

    -- Add enrolled_at for tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'applied_at') THEN
        ALTER TABLE applications ADD COLUMN applied_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Drop and recreate unique constraint to prevent double enrollment
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_user_job_unique;
ALTER TABLE applications ADD CONSTRAINT applications_user_course_unique UNIQUE(user_id, course_id);

-- 2. COURSE STUDIO SCHEMA ENHANCEMENT
-- Adding rich content fields to course_lessons
DO $$ BEGIN
    -- Media URLs
    ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
    ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS markdown_content TEXT;
    ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS infographic_urls TEXT[] DEFAULT '{}';
    ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS pdf_urls TEXT[] DEFAULT '{}';
    
    -- Rewards
    ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS coin_reward INT DEFAULT 10;
    ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS xp_reward INT DEFAULT 50;
    
    -- Content Data fallback (for flexibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'content_data') THEN
        ALTER TABLE course_lessons ADD COLUMN content_data JSONB DEFAULT '{}';
    END IF;
END $$;

-- Adding Advanced Metadata to jobs (Courses)
DO $$ BEGIN
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS preview_video_url TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[] DEFAULT '{}';
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}';
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS instructor_bio TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS estimated_duration_hours INT DEFAULT 0;
END $$;

-- 3. GAMIFICATION RE-POPULATION (15 REAL BADGES)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'Award',
    requirement_type TEXT NOT NULL, -- 'xp', 'courses', 'coins', 'login_streak'
    requirement_value INT NOT NULL,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'divine')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reset and Insert 15 Scholar Badges
TRUNCATE TABLE badges CASCADE;
INSERT INTO badges (name, description, icon_name, requirement_type, requirement_value, rarity) VALUES
('Faith Seeker', 'Enrolled in your first course at One Islam Institute.', 'Star', 'courses', 1, 'common'),
('Disciplined Mind', 'Completed your first 5 lessons.', 'Zap', 'xp', 250, 'common'),
('Consistent Scholar', 'Logged in for 7 consecutive days.', 'Calendar', 'login_streak', 7, 'common'),
('Generous Giver', 'Earned your first 1,000 Dinar Tokens.', 'DollarSign', 'coins', 1000, 'rare'),
('Curriculum Explorer', 'Explored 3 different subject areas.', 'BookOpen', 'courses', 3, 'rare'),
('Deep Thinker', 'Earned 5,000 Scholarly XP.', 'Brain', 'xp', 5000, 'rare'),
('Academic Resident', 'Completed 5 full courses.', 'Home', 'courses', 5, 'epic'),
('Wisdom Keeper', 'Successfully navigated 20 quizzes.', 'Key', 'xp', 10000, 'epic'),
('Dinar Millionaire', 'Amassed a fortune of 10,000 Tokens.', 'Award', 'coins', 10000, 'epic'),
('Senior Fellow', 'Instructed or helped 10 peers in community.', 'Users', 'courses', 10, 'legendary'),
('Master of Fiqh', 'Achieved perferct marks in a Mastery course.', 'Shield', 'xp', 25000, 'legendary'),
('Institute Legend', 'Completed 30 courses and 50,000 XP.', 'Crown', 'xp', 50000, 'legendary'),
('Grand Mufti', 'Highest rank of academic achievement.', 'Sparkles', 'xp', 100000, 'divine'),
('Knowledge Pillar', 'Donated 50,000 coins to peer scholarships.', 'Heart', 'coins', 50000, 'divine'),
('Universal Scholar', 'Mastered every category in the registry.', 'Globe', 'courses', 20, 'divine');

-- User Progress Table if missing
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 4. UTILITY FUNCTIONS
-- Add coins to user function
CREATE OR REPLACE FUNCTION award_user_coins_and_xp(user_uuid UUID, coins INT, xp INT)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET coin_balance = coin_balance + coins,
        total_xp = total_xp + xp
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
