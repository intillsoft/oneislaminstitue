-- ============================================================================
-- FIX APPLICATIONS TABLE SCHEMA
-- ============================================================================
-- This script fixes the applications table to include all required columns
-- ============================================================================

-- Add missing columns to applications table if they don't exist
DO $$
BEGIN
    -- Add cover_letter column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'cover_letter') THEN
        ALTER TABLE applications ADD COLUMN cover_letter TEXT;
    END IF;

    -- Add linkedin_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'linkedin_url') THEN
        ALTER TABLE applications ADD COLUMN linkedin_url TEXT;
    END IF;

    -- Add portfolio_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'portfolio_url') THEN
        ALTER TABLE applications ADD COLUMN portfolio_url TEXT;
    END IF;

    -- Add answers column if it doesn't exist (JSONB for custom questions)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'answers') THEN
        ALTER TABLE applications ADD COLUMN answers JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add resume_id column if it doesn't exist (reference to resumes table)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'resume_id') THEN
        ALTER TABLE applications ADD COLUMN resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL;
    END IF;
    
    -- Add resume_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'resume_url') THEN
        ALTER TABLE applications ADD COLUMN resume_url TEXT;
    END IF;

    -- Ensure first_name and last_name exist (they should, but check anyway)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'first_name') THEN
        ALTER TABLE applications ADD COLUMN first_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'last_name') THEN
        ALTER TABLE applications ADD COLUMN last_name TEXT;
    END IF;

    -- Ensure email and phone exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'email') THEN
        ALTER TABLE applications ADD COLUMN email TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'phone') THEN
        ALTER TABLE applications ADD COLUMN phone TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_resume_id ON applications(resume_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);


