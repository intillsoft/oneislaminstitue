-- ============================================================================
-- FIX INFINITE RECURSION ERROR - RUN THIS NOW
-- ============================================================================
-- The error "infinite recursion detected in policy for relation 'users'"
-- happens because policies are checking users table within users policies
-- ============================================================================
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL PROBLEMATIC POLICIES
-- ============================================================================

-- Drop ALL policies that might cause recursion
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ============================================================================
-- STEP 2: CREATE SIMPLE, NON-RECURSIVE POLICIES
-- ============================================================================

-- ============================================================================
-- USERS POLICIES (CRITICAL: No recursion - simple checks only)
-- ============================================================================
-- Users can only view/edit their own profile
-- NO checking of users table within users policy!
CREATE POLICY "Users can view own profile" 
    ON users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON users FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- NOTE: Removed "Admins can view all users" policy because it causes recursion
-- Admins will need to use service role key for admin operations

-- ============================================================================
-- JOBS POLICIES (CRITICAL: No user table checks)
-- ============================================================================
-- Jobs are viewable by EVERYONE (including anonymous users)
-- This is the key fix - no authentication check needed!
CREATE POLICY "Anyone can view active jobs" 
    ON jobs FOR SELECT 
    USING (
        status IS NULL OR 
        status = 'active' OR 
        status = 'published'
    );

-- Authenticated users can see all jobs (including drafts)
CREATE POLICY "Authenticated users can view all jobs" 
    ON jobs FOR SELECT 
    USING (auth.uid() IS NOT NULL);

-- For INSERT/UPDATE/DELETE, we'll use a simpler check
-- Only allow if user is authenticated (role check happens in app, not DB)
CREATE POLICY "Authenticated users can manage jobs" 
    ON jobs FOR ALL 
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- COMPANIES POLICIES (Public - no checks)
-- ============================================================================
CREATE POLICY "Anyone can view companies" 
    ON companies FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can manage companies" 
    ON companies FOR ALL 
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- APPLICATIONS POLICIES (Simple user_id check)
-- ============================================================================
CREATE POLICY "Users can manage own applications" 
    ON applications FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SAVED JOBS POLICIES (Simple user_id check)
-- ============================================================================
CREATE POLICY "Users can manage own saved jobs" 
    ON saved_jobs FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RESUMES POLICIES (Simple user_id check)
-- ============================================================================
CREATE POLICY "Users can manage own resumes" 
    ON resumes FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- JOB ALERTS POLICIES
-- ============================================================================
CREATE POLICY "Users can manage own job alerts" 
    ON job_alerts FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SUBSCRIPTIONS POLICIES
-- ============================================================================
CREATE POLICY "Users can view own subscriptions" 
    ON subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

-- ============================================================================
-- USAGE TRACKING POLICIES
-- ============================================================================
CREATE POLICY "Users can view own usage" 
    ON usage_tracking FOR SELECT 
    USING (auth.uid() = user_id);

-- ============================================================================
-- EMAIL PREFERENCES POLICIES
-- ============================================================================
CREATE POLICY "Users can manage own email preferences" 
    ON email_preferences FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================
CREATE POLICY "Users can manage own notifications" 
    ON notifications FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ACTIVITY LOG POLICIES
-- ============================================================================
CREATE POLICY "Users can view own activity" 
    ON activity_log FOR SELECT 
    USING (auth.uid() = user_id);

-- ============================================================================
-- GOALS POLICIES
-- ============================================================================
CREATE POLICY "Users can manage own goals" 
    ON goals FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- APPLICATION NOTES POLICIES
-- ============================================================================
CREATE POLICY "Users can manage own application notes" 
    ON application_notes FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- APPLICATION FOLLOW UPS POLICIES
-- ============================================================================
CREATE POLICY "Users can manage own application follow ups" 
    ON application_follow_ups FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STEP 3: ADD STATUS COLUMN IF MISSING
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'status'
    ) THEN
        ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'active' 
            CHECK (status IN ('active', 'published', 'draft', 'expired', 'closed'));
        CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    END IF;
END $$;

-- Set status for existing jobs
UPDATE jobs SET status = 'active' WHERE status IS NULL;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running, test these:

-- 1. Should work (no auth needed):
--    SELECT * FROM jobs WHERE status = 'active' LIMIT 5;

-- 2. Should work (no auth needed):
--    SELECT * FROM companies LIMIT 5;

-- 3. Should work (with auth):
--    SELECT * FROM users WHERE id = auth.uid();

-- ============================================================================
-- KEY CHANGES:
-- 1. Removed ALL policies that query users table within users policies
-- 2. Jobs are now public (no auth needed to view)
-- 3. All policies use simple auth.uid() checks - no recursion possible
-- ============================================================================










