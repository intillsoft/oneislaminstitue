-- ============================================================================
-- FIX JOB STATUS CONSTRAINT
-- ============================================================================
-- Update jobs table status constraint to match actual allowed values
-- ============================================================================

-- Drop existing constraint if it exists
DO $$ 
BEGIN
    -- Drop the constraint if it exists
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
    
    -- Also check for any other status constraints
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%status%' 
        AND table_name = 'jobs'
    ) THEN
        -- Get constraint name and drop it
        EXECUTE (
            SELECT 'ALTER TABLE jobs DROP CONSTRAINT ' || constraint_name
            FROM information_schema.table_constraints 
            WHERE constraint_name LIKE '%status%' 
            AND table_name = 'jobs'
            LIMIT 1
        );
    END IF;
END $$;

-- Add new constraint with correct values
-- Based on database schema: 'active', 'published', 'draft', 'expired', 'closed'
ALTER TABLE jobs 
ADD CONSTRAINT jobs_status_check 
CHECK (status IS NULL OR status IN ('active', 'published', 'draft', 'expired', 'closed'));

-- Update any invalid status values to 'draft'
UPDATE jobs 
SET status = 'draft' 
WHERE status IS NOT NULL 
AND status NOT IN ('active', 'published', 'draft', 'expired', 'closed');

-- Set default status for jobs without status
UPDATE jobs 
SET status = 'active' 
WHERE status IS NULL;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Test that constraint works:
-- INSERT INTO jobs (title, company, status) VALUES ('Test', 'Test Co', 'active'); -- Should work
-- INSERT INTO jobs (title, company, status) VALUES ('Test', 'Test Co', 'invalid'); -- Should fail
-- ============================================================================










