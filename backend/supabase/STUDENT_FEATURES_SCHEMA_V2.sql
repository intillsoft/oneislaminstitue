-- ============================================================================
-- STUDENT FEATURES SCHEMA V2 (Robust Version)
-- Includes base tables (jobs, applications) if they are missing
-- ============================================================================

-- 0. Ensure base 'users' table exists (Mirror of auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    professional_title TEXT,
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Ensure 'jobs' table exists (Base dependency for courses)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    description TEXT,
    source TEXT CHECK (source IN ('indeed', 'linkedin', 'glassdoor', 'manual')),
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add company column to jobs if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'company') THEN
        ALTER TABLE jobs ADD COLUMN company TEXT;
    END IF;
END $$;

-- 2. Ensure 'applications' table exists (Base dependency for enrollments)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    applied_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- ============================================================================
-- STUDENT FEATURES TABLES
-- ============================================================================

-- 3. Study Progress Tracking
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
    status TEXT DEFAULT 'in_progress',
    ai_study_tips TEXT,
    ai_predicted_completion DATE,
    ai_strength_areas TEXT[],
    ai_improvement_areas TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 4. Certificates
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
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Class Schedule
CREATE TABLE IF NOT EXISTS class_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'lesson',
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
    ai_difficulty_level TEXT,
    ai_estimated_prep_time_minutes INT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Student Schedule Enrollments
CREATE TABLE IF NOT EXISTS student_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES class_schedule(id) ON DELETE CASCADE,
    reminder_set BOOLEAN DEFAULT FALSE,
    reminder_minutes_before INT DEFAULT 15,
    attendance_status TEXT DEFAULT 'registered',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, schedule_id)
);

-- 7. Study Streaks
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

-- RLS Policies
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;

-- Note: Policies created with DO block to avoid 'policy already exists' errors
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own progress') THEN
        CREATE POLICY "Users can view own progress" ON study_progress FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own certificates') THEN
        CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enrolled users can view schedule') THEN
        CREATE POLICY "Enrolled users can view schedule" ON class_schedule FOR SELECT USING (
            EXISTS (SELECT 1 FROM applications WHERE applications.job_id = class_schedule.course_id AND applications.user_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own schedule') THEN
       CREATE POLICY "Users can manage own schedule" ON student_schedule FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own streaks') THEN
       CREATE POLICY "Users can manage own streaks" ON study_streaks FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;
