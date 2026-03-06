-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: ULTIMATE SCHEMA REPAIR
-- This script fixes core database issues including missing columns and constraints
-- Handles: missing user_id, missing applied_at, missing roles
-- ============================================================================

-- 1. REPAIR APPLICATIONS (ENROLLMENT) TABLE
-- Ensure the table exists
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check and add user_id if missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'user_id') THEN
        ALTER TABLE applications ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Check and add job_id if missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'job_id') THEN
        ALTER TABLE applications ADD COLUMN job_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Check and add course_id if missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'course_id') THEN
        ALTER TABLE applications ADD COLUMN course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Check and add applied_at if missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'applied_at') THEN
        ALTER TABLE applications ADD COLUMN applied_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Check and add status if missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'status') THEN
        ALTER TABLE applications ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Fix unique constraint (one enrollment per student per course)
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_user_id_job_id_key;
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_user_id_course_id_key;
-- Note: We only add back one unique constraint to prevent duplicates
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'applications_user_course_unique') THEN
        -- We try to use course_id if it exists, otherwise job_id
        -- But since we added both above, we can pick one as primary for the unique key
        ALTER TABLE applications ADD CONSTRAINT applications_user_course_unique UNIQUE (user_id, course_id);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add unique constraint, might have duplicate data already.';
END $$;

-- 2. REPAIR ROLES
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'instructor', 'admin', 'job-seeker', 'recruiter'));

-- 3. ENSURE JOBS HAS STATUS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
        ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- 4. RECREATE INDEXES (Fail-safe)
DROP INDEX IF EXISTS idx_applications_user_id;
DROP INDEX IF EXISTS idx_applications_course_id;
DROP INDEX IF EXISTS idx_applications_applied_at;
DROP INDEX IF EXISTS idx_applications_status;

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_course_id ON applications(course_id);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================================================
-- ✅ REPAIR COMPLETE
-- ============================================================================
