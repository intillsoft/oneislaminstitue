-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: GAMIFICATION & ADVANCED COURSE ECOSYSTEM
-- Implements Coins, Badges, and Advanced Course Metadata
-- ============================================================================

-- 1. GAMIFICATION SYSTEM: COINS & BADGES
-- Add coin balance to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS coin_balance INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_xp INT DEFAULT 0;

-- Ensure created_by exists on jobs for attribution
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Badges Definition Table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    requirement_type TEXT CHECK (requirement_type IN ('xp', 'coins', 'course_completion', 'login_streak', 'special')),
    requirement_value INT DEFAULT 0,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'divine')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badges (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 2. ADVANCED COURSE METADATA (Enhancing 'jobs' table for Full Course Creation)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS preview_video_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS instructor_bio TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[]; -- Array of strings
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS target_audience TEXT[];
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS estimated_duration_hours INT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS difficulty_rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';

-- 3. ENHANCED LESSON CONTENT
-- Support for multiple content formats per lesson
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS markdown_content TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS infographic_urls TEXT[];
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS pdf_attachment_urls TEXT[];
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS coin_reward INT DEFAULT 10;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS xp_reward INT DEFAULT 50;

-- 4. INSERT INITIAL BADGES (15 Different Badges)
INSERT INTO badges (name, description, requirement_type, requirement_value, rarity) VALUES
('Beginner Scholar', 'Started your first course', 'course_completion', 1, 'common'),
('Consistent Seeker', 'Completed 5 lessons', 'special', 5, 'common'),
('Knowledge Accumulator', 'Earned 500 XP', 'xp', 500, 'common'),
('Scholar in Residence', 'Logged in 7 days in a row', 'login_streak', 7, 'rare'),
('Deep Thinker', 'Completed a course with 90%+ in quizzes', 'special', 1, 'rare'),
('Wealthy Mind', 'Stored 1000 Coins', 'coins', 1000, 'rare'),
('Community Pillar', 'Supplied first donation or support', 'special', 1, 'epic'),
('Expert Academic', 'Completed 5 courses', 'course_completion', 5, 'epic'),
('Neural Master', 'Used AI Search 50 times', 'special', 50, 'rare'),
('Curriculum Architect', 'Created your first course (Faculty only)', 'special', 1, 'epic'),
('Global Mentor', 'Taught 100 students', 'special', 100, 'legendary'),
('Legacy Builder', 'Founded a Faculty', 'special', 1, 'legendary'),
('One Islam Fellow', 'Earned 10,000 XP', 'xp', 10000, 'legendary'),
('Divine Knowledge', 'Complete the Quranic Fundamentals Path', 'special', 1, 'divine'),
('Infinite Scholar', 'Maintain a 30-day streak', 'login_streak', 30, 'divine')
ON CONFLICT (name) DO NOTHING;

-- 5. REVENUE & FINANCIAL TRACKING (Advanced)
CREATE TABLE IF NOT EXISTS revenue_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(15,2) NOT NULL,
    platform_fee NUMERIC(15,2) DEFAULT 0.00,
    instructor_share NUMERIC(15,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RLS POLICIES FOR NEW TABLES
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Instructors can view course revenue" ON revenue_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM jobs WHERE id = course_id AND created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- ✅ GAMIFICATION & CONTENT ARCHITECTURE SYNCED
-- ============================================================================
