-- ============================================================================
-- FIX JOBS STATUS CONSTRAINT
-- ============================================================================
-- This fixes the status constraint violation error when creating jobs
-- ============================================================================

-- First, drop the existing constraint if it exists
DO $$ 
BEGIN
    -- Drop existing status constraint
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check1;
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check2;
    
    -- Also try to drop any constraint on status column
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'jobs' 
        AND constraint_type = 'CHECK'
        AND constraint_name LIKE '%status%'
    ) LOOP
        EXECUTE format('ALTER TABLE jobs DROP CONSTRAINT IF EXISTS %I', r.constraint_name);
    END LOOP;
END $$;

-- Add the correct status constraint
-- Allow: active, inactive, expired, draft, published, closed, pending, rejected
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

-- Set default status for existing jobs that might have invalid status
UPDATE jobs 
SET status = 'active' 
WHERE status IS NULL 
   OR status NOT IN ('active', 'inactive', 'expired', 'draft', 'published', 'closed', 'pending', 'rejected');

-- Verify the constraint
SELECT constraint_name, constraint_definition
FROM information_schema.table_constraints
WHERE table_name = 'jobs' 
AND constraint_type = 'CHECK'
AND constraint_name LIKE '%status%';










