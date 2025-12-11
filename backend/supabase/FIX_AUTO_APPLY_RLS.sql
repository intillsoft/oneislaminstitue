-- Fix RLS policies for auto_apply_settings table
-- Run this in your Supabase SQL Editor

-- Enable RLS (if not already enabled)
ALTER TABLE auto_apply_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own autopilot settings" ON auto_apply_settings;
DROP POLICY IF EXISTS "Users can insert their own autopilot settings" ON auto_apply_settings;
DROP POLICY IF EXISTS "Users can update their own autopilot settings" ON auto_apply_settings;
DROP POLICY IF EXISTS "Users can delete their own autopilot settings" ON auto_apply_settings;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own autopilot settings"
ON auto_apply_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own autopilot settings"
ON auto_apply_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own autopilot settings"
ON auto_apply_settings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own autopilot settings"
ON auto_apply_settings FOR DELETE
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON auto_apply_settings TO authenticated;
GRANT ALL ON auto_apply_settings TO service_role;
