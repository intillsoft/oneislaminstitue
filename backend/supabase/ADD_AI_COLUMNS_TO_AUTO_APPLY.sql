-- Add missing columns to auto_apply_logs table for enhanced Autopilot tracking
ALTER TABLE auto_apply_logs 
ADD COLUMN IF NOT EXISTS match_score INTEGER,
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'internal',
ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL;

-- Ensure indexes exist for the new columns
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_match_score ON auto_apply_logs(match_score);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_platform ON auto_apply_logs(platform);

-- Comment for clarity
COMMENT ON COLUMN auto_apply_logs.match_score IS 'AI-calculated match percentage for the job';
COMMENT ON COLUMN auto_apply_logs.platform IS 'The source platform of the job (internal, linkedin, dice, etc.)';
