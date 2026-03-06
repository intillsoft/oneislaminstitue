-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: MASTER ACADEMIC ECOSYSTEM SCHEMA
-- Comprehensive schema for Faculty, Courses, Enrollments, and Financials
-- ============================================================================

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI search/matching if needed

-- ============================================================================
-- 👤 USERS & SCHOLAR PROFILES
-- ============================================================================

-- Ensure base users table has all required fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS academic_field TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS enrolled_courses_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS certification_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_study_minutes INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- ============================================================================
-- 🏛️ FACULTIES & INSTITUTIONS (Replacing Companies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Dean/Owner
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    mission_statement TEXT,
    accreditation_status TEXT DEFAULT 'pending' CHECK (accreditation_status IN ('pending', 'accredited', 'probation', 'restricted')),
    faculty_size TEXT,
    location TEXT,
    website_url TEXT,
    founded_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculties_slug ON faculties(slug);
CREATE INDEX IF NOT EXISTS idx_faculties_accreditation ON faculties(accreditation_status);

-- ============================================================================
-- 📚 ACADEMIC COURSES (Replacing/Enhancing Jobs)
-- ============================================================================

-- We use 'jobs' table for compatibility, but add course-specific fields
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS faculty_id UUID REFERENCES faculties(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS syllabus TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS course_level TEXT DEFAULT 'beginner' CHECK (course_level IN ('beginner', 'intermediate', 'advanced', 'expert'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS subject_area TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS total_modules INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS total_lessons INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS credit_hours INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS enrollment_limit INT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS enrollment_count INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS prerequisite_ids UUID[] DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0.00; -- Support for premium courses

-- ============================================================================
-- 🗺️ CURRICULUM: MODULES & LESSONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'quiz', 'assignment', 'live_session')),
    content_data JSONB, -- Stores video URL, markdown content, etc.
    duration_minutes INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON course_lessons(module_id);

-- ============================================================================
-- 🤝 ENROLLMENTS & PROGRESSION
-- ============================================================================

-- We use 'applications' table for compatibility, but ensure it supports enrollment logic
ALTER TABLE applications ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE applications ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Study Progress Tracking (granular)
CREATE TABLE IF NOT EXISTS lesson_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Dashboard Stats & Analytics (Real-time aggregation source)
CREATE TABLE IF NOT EXISTS instructor_metrics (
    instructor_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_students INT DEFAULT 0,
    active_courses INT DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    total_revenue NUMERIC(15,2) DEFAULT 0.00,
    reputation_score INT DEFAULT 100,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 🏅 ACADEMIC ACHIEVEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    grade TEXT,
    metadata JSONB DEFAULT '{}',
    verification_hash TEXT UNIQUE
);

-- ============================================================================
-- 💝 FINANCIAL INTELLIGENCE & DONATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    type TEXT DEFAULT 'one-time' CHECK (type IN ('one-time', 'monthly', 'waqf')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT UNIQUE,
    title TEXT DEFAULT 'General Support',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 🛡️ GOVERNANCE & MODERATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS role_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_role TEXT NOT NULL CHECK (requested_role IN ('instructor', 'admin')),
    motivation TEXT,
    credentials_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    reviewer_id UUID REFERENCES users(id),
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ⚙️ SYSTEM CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 🧠 TRIGGERS FOR REAL-TIME SYNC
-- ============================================================================

-- Update enrollment count in jobs
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE jobs SET enrollment_count = enrollment_count + 1 WHERE id = NEW.course_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE jobs SET enrollment_count = enrollment_count - 1 WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_enrollment_count
AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Auto-create instructor metrics entry
CREATE OR REPLACE FUNCTION initialize_instructor_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'instructor' THEN
        INSERT INTO instructor_metrics (instructor_id) VALUES (NEW.id)
        ON CONFLICT (instructor_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_initialize_instructor_metrics
AFTER INSERT OR UPDATE OF role ON users
FOR EACH ROW EXECUTE FUNCTION initialize_instructor_metrics();

-- ============================================================================
-- 🔐 RLS POLICIES (Consolidated)
-- ============================================================================

ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Faculty Policies
CREATE POLICY "Public Read Faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Admin All Faculties" ON faculties FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Course Content Policies
CREATE POLICY "Public Read Content" ON course_modules FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Lessons" ON course_lessons FOR SELECT USING (is_published = true);

-- Donation Policies
CREATE POLICY "View Own Donations" ON donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin View All Donations" ON donations FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- ✅ SAMPLE SETTINGS
-- ============================================================================
INSERT INTO platform_settings (key, value, description)
VALUES 
('maintenance_mode', 'false', 'Enable/disable platform maintenance mode'),
('accreditation_required', 'true', 'Require manual approval for new courses'),
('donation_targets', '{"monthly": 5000, "current": 1200}', 'Financial goals for the institute')
ON CONFLICT (key) DO NOTHING;
