-- ============================================================================
-- FIX JOBS TABLE SCHEMA - Add missing created_by column
-- ============================================================================
-- This fixes the error: "Could not find the 'created_by' column of 'jobs'"
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

-- Add status column if it doesn't exist (for consistency)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'status'
    ) THEN
        ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'active' 
            CHECK (status IN ('active', 'published', 'draft', 'expired', 'closed', 'pending', 'rejected'));
        CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    END IF;
END $$;

-- Set default status for existing jobs
UPDATE jobs SET status = 'active' WHERE status IS NULL;

-- Add other missing columns that might be needed
DO $$ 
BEGIN
    -- Add benefits column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'benefits'
    ) THEN
        ALTER TABLE jobs ADD COLUMN benefits TEXT;
    END IF;

    -- Add department column if missing (some code uses this)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'department'
    ) THEN
        ALTER TABLE jobs ADD COLUMN department TEXT;
    END IF;

    -- Add posted_date column if missing (for sorting)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'posted_date'
    ) THEN
        ALTER TABLE jobs ADD COLUMN posted_date TIMESTAMPTZ DEFAULT NOW();
        CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date);
    END IF;

    -- Update posted_date for existing jobs
    UPDATE jobs SET posted_date = created_at WHERE posted_date IS NULL AND created_at IS NOT NULL;
END $$;

-- ============================================================================
-- UPDATE RLS POLICIES FOR JOBS WITH created_by
-- ============================================================================

-- Drop existing job policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can view all jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can manage jobs" ON jobs;

-- Recreate policies with created_by support
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

-- Users can create jobs
CREATE POLICY "Authenticated users can create jobs" 
    ON jobs FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own jobs or admins can update any
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

-- Users can delete their own jobs or admins can delete any
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
-- After running, test:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'jobs' AND column_name IN ('created_by', 'status', 'benefits', 'department', 'posted_date');











