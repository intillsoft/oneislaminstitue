-- ============================================================================
-- ADD IS_EXTERNAL TO APPLICATIONS TABLE
-- ============================================================================
-- This script adds the is_external column to track applications initiated 
-- to external platforms.
-- ============================================================================

-- Add is_external column to applications table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'is_external') THEN
        ALTER TABLE applications ADD COLUMN is_external BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create index for filtering external vs internal applications
CREATE INDEX IF NOT EXISTS idx_applications_is_external ON applications(is_external);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
