-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: ENROLLMENT & ADMIN ROUTING RECOVERY
-- Fixes missing columns in applications table and ensures smooth administrative routing
-- ============================================================================

-- 1. FIX APPLICATIONS TABLE
-- Add missing columns for compatibility with the enrollment service and legacy systems
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE applications ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE applications ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE CASCADE; -- Legacy support

-- Ensure the status column exists with correct constraints
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'status') THEN
        ALTER TABLE applications ADD COLUMN status TEXT DEFAULT 'enrolled';
    END IF;
END $$;

-- Update column comments for clarity
COMMENT ON COLUMN applications.applied_at IS 'Timestamp for when the enrollment/application was first submitted';
COMMENT ON COLUMN applications.course_id IS 'Reference to the course (jobs table) the scholar is enrolling in';
COMMENT ON COLUMN applications.status IS 'Status of the enrollment: pending, enrolled, completed, etc.';

-- 2. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_applications_course_id ON applications(course_id);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);

-- 3. VERIFY USERS ROLE (Fail-safe for Admin Access)
-- Ensure admin role is correctly spelled and normalized
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'instructor', 'admin', 'job-seeker', 'recruiter'));

-- ============================================================================
-- ✅ SYSTEM SYNC COMPLETE
-- ============================================================================
