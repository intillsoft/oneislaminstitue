-- ============================================================================
-- FIX AUTO APPLY FREQUENCY CONSTRAINT
-- Adds 'continuous' to the allowed values for auto_apply_settings.frequency
-- ============================================================================

-- 1. Drop the existing constraint
ALTER TABLE auto_apply_settings 
DROP CONSTRAINT IF EXISTS auto_apply_settings_frequency_check;

-- 2. Add the updated constraint including 'continuous'
ALTER TABLE auto_apply_settings 
ADD CONSTRAINT auto_apply_settings_frequency_check 
CHECK (frequency IN ('daily', 'every_2_days', 'weekly', 'custom', 'continuous'));

-- 3. Comment to document the change
COMMENT ON COLUMN auto_apply_settings.frequency IS 'Frequency of auto-apply: daily, every_2_days, weekly, custom, continuous';

-- 4. Verify the fix (optional, for log output)
DO $$
BEGIN
    RAISE NOTICE 'Updated auto_apply_settings_frequency_check to include continuous';
END $$;
