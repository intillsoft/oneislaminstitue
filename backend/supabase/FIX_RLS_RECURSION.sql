-- ============================================================================
-- FIX RLS INFINITE RECURSION ERROR
-- ============================================================================
-- This script fixes the "infinite recursion detected in policy for relation 'users'"
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop problematic policies first
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can view companies" ON companies;
DROP POLICY IF EXISTS "Users can manage own saved jobs" ON saved_jobs;

-- ============================================================================
-- USERS POLICIES (FIXED - Simple, no recursion)
-- ============================================================================
-- Users can view their own profile
-- Using direct auth.uid() check - no recursion possible
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- COMPANIES POLICIES (FIXED - Public, no user check)
-- ============================================================================
-- Companies are public - no authentication check to avoid recursion
-- This is safe because companies don't contain sensitive user data
CREATE POLICY "Anyone can view companies" 
  ON companies FOR SELECT 
  USING (true);

-- ============================================================================
-- JOBS POLICIES (FIXED - Simple authenticated check)
-- ============================================================================
-- Jobs are viewable by all authenticated users
-- Simple check - no recursion
CREATE POLICY "Authenticated users can view jobs" 
  ON jobs FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- SAVED JOBS POLICIES (FIXED - Direct user_id check)
-- ============================================================================
-- Users can manage their own saved jobs
CREATE POLICY "Users can manage own saved jobs" 
  ON saved_jobs FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- After running this, test:
-- SELECT * FROM jobs LIMIT 1; -- Should work
-- SELECT * FROM companies LIMIT 1; -- Should work  
-- SELECT * FROM users WHERE id = auth.uid(); -- Should work

