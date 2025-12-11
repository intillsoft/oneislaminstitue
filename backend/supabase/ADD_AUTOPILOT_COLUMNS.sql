-- Add missing columns for Advanced Autopilot features
-- Run this in your Supabase SQL Editor

ALTER TABLE auto_apply_settings 
ADD COLUMN IF NOT EXISTS check_interval_minutes INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS use_ai_matching BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS generate_cover_letter BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS min_match_score INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS last_check_at TIMESTAMP WITH TIME ZONE;

-- Add index for performance on new columns if needed
CREATE INDEX IF NOT EXISTS idx_auto_apply_last_check ON auto_apply_settings(last_check_at);
