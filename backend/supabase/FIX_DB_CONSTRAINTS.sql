-- ============================================================================
-- DEFINITIVE JOBS TABLE FIX (REVISED V2)
-- Sanitizes data, fixes constraints, and migrates embeddings cache
-- ============================================================================

-- 1. Ensure columns exist and migrate types if needed
DO $$ 
BEGIN
    -- jobs table columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_min') THEN
        ALTER TABLE jobs ADD COLUMN salary_min NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_max') THEN
        ALTER TABLE jobs ADD COLUMN salary_max NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'job_type') THEN
        ALTER TABLE jobs ADD COLUMN job_type TEXT DEFAULT 'full-time';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'url') THEN
        ALTER TABLE jobs ADD COLUMN url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'experience_level') THEN
        ALTER TABLE jobs ADD COLUMN experience_level TEXT DEFAULT 'mid';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'remote') THEN
        ALTER TABLE jobs ADD COLUMN remote TEXT DEFAULT 'on-site';
    END IF;

    -- embeddings_cache migration to JSONB to support multiple dimensions (384 vs 1536)
    -- Check if it exists first
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'embeddings_cache' AND column_name = 'embedding') THEN
        -- Check if it's the 'vector' type or something else we want to change
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'embeddings_cache' AND column_name = 'embedding' AND data_type = 'USER-DEFINED') THEN
            ALTER TABLE embeddings_cache ALTER COLUMN embedding TYPE JSONB USING embedding::text::jsonb;
        END IF;
    END IF;
END $$;

-- 2. Aggressive Sanitization of existing jobs data
-- First, handle nulls/empty strings
UPDATE jobs SET source = 'manual' WHERE source IS NULL OR TRIM(source) = '';
UPDATE jobs SET job_type = 'full-time' WHERE job_type IS NULL OR TRIM(job_type) = '';

-- Normalize casing
UPDATE jobs SET source = LOWER(TRIM(source)), job_type = LOWER(TRIM(job_type));

-- Fix invalid sources
UPDATE jobs 
SET source = 'manual' 
WHERE source NOT IN ('indeed', 'linkedin', 'glassdoor', 'manual', 'jsearch', 'crawled');

-- Fix invalid job types
UPDATE jobs 
SET job_type = 'full-time' 
WHERE job_type NOT IN ('full-time', 'part-time', 'contract', 'contractor', 'freelance', 'internship', 'temporary', 'other');

-- 3. Re-apply constraints safely
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_source_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_source_check CHECK (source IN ('indeed', 'linkedin', 'glassdoor', 'manual', 'jsearch', 'crawled'));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_job_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_job_type_check CHECK (job_type IN ('full-time', 'part-time', 'contract', 'contractor', 'freelance', 'internship', 'temporary', 'other'));

-- 4. Create missing indexes
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_source_new ON jobs(source);
CREATE INDEX IF NOT EXISTS idx_jobs_url ON jobs(url);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(remote);
