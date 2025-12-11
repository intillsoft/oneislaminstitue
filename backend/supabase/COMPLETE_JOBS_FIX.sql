-- ============================================================================
-- COMPLETE JOBS TABLE FIX
-- ============================================================================
-- This fixes all job-related issues:
-- 1. Adds created_by column
-- 2. Fixes status constraint
-- 3. Ensures all required columns exist
-- ============================================================================

-- ============================================================================
-- STEP 1: ADD MISSING COLUMNS
-- ============================================================================

-- Add created_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE jobs ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
    END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'status'
    ) THEN
        ALTER TABLE jobs ADD COLUMN status TEXT;
        CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    END IF;
END $$;

-- Add other missing columns
DO $$ 
BEGIN
    -- Add benefits column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'benefits'
    ) THEN
        ALTER TABLE jobs ADD COLUMN benefits TEXT;
    END IF;

    -- Add department column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'department'
    ) THEN
        ALTER TABLE jobs ADD COLUMN department TEXT;
    END IF;

    -- Add posted_date column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'posted_date'
    ) THEN
        ALTER TABLE jobs ADD COLUMN posted_date TIMESTAMPTZ DEFAULT NOW();
        CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date);
    END IF;
END $$;

-- ============================================================================
-- STEP 2: FIX STATUS CONSTRAINT
-- ============================================================================

-- Drop ALL existing status constraints
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'jobs' 
        AND constraint_type = 'CHECK'
        AND (
            constraint_name LIKE '%status%' OR
            constraint_name LIKE '%job_type%' OR
            constraint_name LIKE '%experience%'
        )
    ) LOOP
        EXECUTE format('ALTER TABLE jobs DROP CONSTRAINT IF EXISTS %I', r.constraint_name);
    END LOOP;
END $$;

-- Add correct status constraint
ALTER TABLE jobs 
ADD CONSTRAINT jobs_status_check 
CHECK (status IS NULL OR status IN (
    'active', 
    'inactive', 
    'expired', 
    'draft', 
    'published', 
    'closed', 
    'pending', 
    'rejected'
));

-- Add job_type constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'jobs' 
        AND constraint_name = 'jobs_job_type_check'
    ) THEN
        ALTER TABLE jobs 
        ADD CONSTRAINT jobs_job_type_check 
        CHECK (job_type IS NULL OR job_type IN (
            'full-time', 
            'part-time', 
            'contract', 
            'freelance', 
            'internship'
        ));
    END IF;
END $$;

-- Add experience_level constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'jobs' 
        AND constraint_name = 'jobs_experience_level_check'
    ) THEN
        ALTER TABLE jobs 
        ADD CONSTRAINT jobs_experience_level_check 
        CHECK (experience_level IS NULL OR experience_level IN (
            'entry', 
            'mid', 
            'senior', 
            'executive'
        ));
    END IF;
END $$;

-- ============================================================================
-- STEP 3: SET DEFAULTS FOR EXISTING DATA
-- ============================================================================

-- Set default status for existing jobs
UPDATE jobs 
SET status = 'active' 
WHERE status IS NULL 
   OR status NOT IN ('active', 'inactive', 'expired', 'draft', 'published', 'closed', 'pending', 'rejected');

-- Update posted_date for existing jobs
UPDATE jobs 
SET posted_date = created_at 
WHERE posted_date IS NULL 
AND created_at IS NOT NULL;

-- ============================================================================
-- STEP 4: UPDATE RLS POLICIES
-- ============================================================================

-- Drop existing job policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can view all jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can create jobs" ON jobs;
DROP POLICY IF EXISTS "Users can update own jobs or admins can update any" ON jobs;
DROP POLICY IF EXISTS "Users can delete own jobs or admins can delete any" ON jobs;

-- Recreate policies
CREATE POLICY "Anyone can view active jobs" 
    ON jobs FOR SELECT 
    USING (
        status IS NULL OR 
        status = 'active' OR 
        status = 'published'
    );

CREATE POLICY "Authenticated users can view all jobs" 
    ON jobs FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create jobs" 
    ON jobs FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own jobs or admins can update any" 
    ON jobs FOR UPDATE 
    USING (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can delete own jobs or admins can delete any" 
    ON jobs FOR DELETE 
    USING (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running, verify:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'jobs' 
-- AND column_name IN ('created_by', 'status', 'benefits', 'department', 'posted_date');
--
-- SELECT constraint_name, constraint_definition
-- FROM information_schema.table_constraints
-- WHERE table_name = 'jobs' AND constraint_type = 'CHECK';










