-- ============================================================================
-- COMPREHENSIVE JOBS TABLE FIX
-- Fixes constraints and adds missing columns for Crawler and AI Matching
-- ============================================================================

-- 1. Add missing columns to jobs table
DO $$ 
BEGIN
    -- salary_min
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_min') THEN
        ALTER TABLE jobs ADD COLUMN salary_min NUMERIC;
    END IF;

    -- salary_max
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_max') THEN
        ALTER TABLE jobs ADD COLUMN salary_max NUMERIC;
    END IF;

    -- job_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'job_type') THEN
        ALTER TABLE jobs ADD COLUMN job_type TEXT DEFAULT 'full-time';
    END IF;

    -- experience_level
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'experience_level') THEN
        ALTER TABLE jobs ADD COLUMN experience_level TEXT DEFAULT 'mid';
    END IF;

    -- remote
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'remote') THEN
        ALTER TABLE jobs ADD COLUMN remote TEXT DEFAULT 'on-site';
    END IF;

    -- url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'url') THEN
        ALTER TABLE jobs ADD COLUMN url TEXT;
    END IF;

    -- created_by (if missing)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_by') THEN
        ALTER TABLE jobs ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Fix source constraint to allow 'jsearch'
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_source_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_source_check CHECK (source IN ('indeed', 'linkedin', 'glassdoor', 'manual', 'jsearch'));

-- 3. Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(remote);
CREATE INDEX IF NOT EXISTS idx_jobs_url ON jobs(url);
