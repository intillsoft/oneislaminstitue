-- ============================================================================
-- FIX RLS POLICIES - RESOLVE INFINITE RECURSION
-- ============================================================================
-- This script fixes the infinite recursion error in RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can view companies" ON companies;
DROP POLICY IF EXISTS "Users can manage own saved jobs" ON saved_jobs;

-- ============================================================================
-- USERS POLICIES (FIXED - No recursion)
-- ============================================================================
-- Users can view their own profile - simple check, no recursion
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- COMPANIES POLICIES (FIXED - Public read, no user reference)
-- ============================================================================
-- Companies are public - anyone authenticated can view them
-- Using simple true check to avoid any recursion
-- This prevents recursion when jobs query companies
CREATE POLICY "Anyone can view companies" 
  ON companies FOR SELECT 
  USING (true);

-- ============================================================================
-- JOBS POLICIES (FIXED - Simple check, no recursion)
-- ============================================================================
-- Jobs are viewable by all authenticated users
-- This is simple and doesn't cause recursion
CREATE POLICY "Authenticated users can view jobs" 
  ON jobs FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- SAVED JOBS POLICIES (FIXED - Direct user_id check)
-- ============================================================================
-- Users can manage their own saved jobs
CREATE POLICY "Users can manage own saved jobs" 
  ON saved_jobs FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Test that policies work:
-- SELECT * FROM jobs LIMIT 1; -- Should work
-- SELECT * FROM companies LIMIT 1; -- Should work
-- SELECT * FROM users WHERE id = auth.uid(); -- Should work

