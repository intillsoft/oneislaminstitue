-- Migration to fix auto_apply_settings constraints

-- 1. Update frequency check to allow 'continuous' as it is the new default
ALTER TABLE auto_apply_settings 
DROP CONSTRAINT IF EXISTS auto_apply_settings_frequency_check;

ALTER TABLE auto_apply_settings 
ADD CONSTRAINT auto_apply_settings_frequency_check 
CHECK (frequency IN ('daily', 'weekly', 'continuous', 'custom'));

-- 2. Add application_url column to jobs table if simpler than code refactor
-- (Optional, but good for compatibility if multiple services use it)
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS application_url TEXT;

-- Sync application_url with url for existing rows
UPDATE jobs 
SET application_url = url 
WHERE application_url IS NULL;
