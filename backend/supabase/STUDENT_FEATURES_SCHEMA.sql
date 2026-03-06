-- ============================================================================
-- STUDENT FEATURES SCHEMA
-- Tables for Study Progress, Certificates, and Class Schedule
-- ============================================================================

-- 1. Study Progress Tracking
CREATE TABLE IF NOT EXISTS study_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    modules_total INT DEFAULT 0,
    modules_completed INT DEFAULT 0,
    lessons_total INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    quizzes_passed INT DEFAULT 0,
    quizzes_total INT DEFAULT 0,
    time_spent_minutes INT DEFAULT 0,
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    ai_study_tips TEXT,
    ai_predicted_completion DATE,
    ai_strength_areas TEXT[],
    ai_improvement_areas TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 2. Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    grade TEXT,
    score DECIMAL(5,2),
    skills_earned TEXT[],
    verification_url TEXT,
    pdf_url TEXT,
    ai_achievement_summary TEXT,
    ai_career_impact TEXT,
    ai_recommended_next TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Class Schedule
CREATE TABLE IF NOT EXISTS class_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'lesson' CHECK (event_type IN ('lesson', 'live_session', 'assignment_due', 'quiz', 'exam', 'office_hours', 'workshop')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    meeting_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    materials JSONB DEFAULT '[]',
    ai_preparation_tips TEXT,
    ai_difficulty_level TEXT CHECK (ai_difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    ai_estimated_prep_time_minutes INT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student Schedule Enrollments (which schedule events a student is attending)
CREATE TABLE IF NOT EXISTS student_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES class_schedule(id) ON DELETE CASCADE,
    reminder_set BOOLEAN DEFAULT FALSE,
    reminder_minutes_before INT DEFAULT 15,
    attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'missed', 'excused')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, schedule_id)
);

-- Users table (for authentication and profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    professional_title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Study Streaks (daily log for streak tracking)
CREATE TABLE IF NOT EXISTS study_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL,
    minutes_studied INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    courses_active INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, study_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_progress_user ON study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_course ON study_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_class_schedule_course ON class_schedule(course_id);
CREATE INDEX IF NOT EXISTS idx_class_schedule_time ON class_schedule(start_time);
CREATE INDEX IF NOT EXISTS idx_student_schedule_user ON student_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_study_streaks_user ON study_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_study_streaks_date ON study_streaks(user_id, study_date);

-- RLS Policies
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;

-- Study Progress: users can read/write their own
CREATE POLICY "Users can view own progress" ON study_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON study_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON study_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates: users can read their own, public verification
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage certificates" ON certificates FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Class Schedule: anyone enrolled can view
CREATE POLICY "Enrolled users can view schedule" ON class_schedule FOR SELECT USING (
    EXISTS (SELECT 1 FROM applications WHERE applications.job_id = class_schedule.course_id AND applications.user_id = auth.uid())
);
CREATE POLICY "Instructors can manage schedule" ON class_schedule FOR ALL USING (
    auth.uid() = instructor_id OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Student Schedule: users can manage their own
CREATE POLICY "Users can manage own schedule" ON student_schedule FOR ALL USING (auth.uid() = user_id);

-- Study Streaks: users can manage their own
CREATE POLICY "Users can manage own streaks" ON study_streaks FOR ALL USING (auth.uid() = user_id);
