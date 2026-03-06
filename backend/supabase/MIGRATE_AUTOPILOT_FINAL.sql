-- Migrate Autopilot Final
-- Add missing columns for advanced Autopilot features

ALTER TABLE auto_apply_settings 
ADD COLUMN IF NOT EXISTS allowed_platforms TEXT[] DEFAULT '{"internal", "linkedin", "glassdoor", "indeed"}',
ADD COLUMN IF NOT EXISTS best_resume_matching BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS min_match_score INTEGER DEFAULT 50 CHECK (min_match_score >= 0 AND min_match_score <= 100);

-- Migrate location to array type safely
DO $$
BEGIN
    -- Check if location is not already an array
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'auto_apply_settings' 
        AND column_name = 'location' 
        AND data_type = 'text'
    ) THEN
        -- Convert existing single text locations to array
        ALTER TABLE auto_apply_settings 
        ALTER COLUMN location TYPE TEXT[] 
        USING CASE 
            WHEN location IS NULL THEN NULL 
            ELSE ARRAY[location] 
        END;
    END IF;
END $$;

-- Update auto_apply_logs with more detail
ALTER TABLE auto_apply_logs
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'internal',
ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id),
ADD COLUMN IF NOT EXISTS match_score INTEGER;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_platform ON auto_apply_logs(platform);
