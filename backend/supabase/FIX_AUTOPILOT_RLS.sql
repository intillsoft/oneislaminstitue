-- Enable RLS on Autopilot Logs
ALTER TABLE auto_apply_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own logs
DROP POLICY IF EXISTS "Users can view own auto apply logs" ON auto_apply_logs;
CREATE POLICY "Users can view own auto apply logs"
ON auto_apply_logs FOR SELECT
USING (auth.uid() = user_id);

-- Allow users (or backend acting as user) to insert logs
DROP POLICY IF EXISTS "Users can insert own auto apply logs" ON auto_apply_logs;
CREATE POLICY "Users can insert own auto apply logs"
ON auto_apply_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Ensure Applications RLS is correct
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
CREATE POLICY "Users can insert own applications"
ON applications FOR INSERT
WITH CHECK (auth.uid() = user_id);
