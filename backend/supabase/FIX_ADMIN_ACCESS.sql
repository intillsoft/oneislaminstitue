-- ============================================================================
-- FIX ADMIN ACCESS TO USERS AND APPLICATIONS
-- ============================================================================
-- This script adds RLS policies that allow admins to view all users and 
-- applications without causing recursion issues
-- ============================================================================
-- Run this in Supabase SQL Editor AFTER running FIX_INFINITE_RECURSION_NOW.sql
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE HELPER FUNCTION TO CHECK ADMIN ROLE (NO RECURSION)
-- ============================================================================
-- This function uses security definer to bypass RLS when checking roles
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role directly from users table (bypasses RLS due to SECURITY DEFINER)
  SELECT role INTO user_role
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN user_role IN ('admin', 'super-admin', 'super_admin', 'owner', 'moderator');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================================
-- STEP 2: ADD ADMIN POLICIES FOR USERS TABLE
-- ============================================================================

-- Allow admins to view all users
CREATE POLICY "Admins can view all users" 
    ON users FOR SELECT 
    USING (public.is_admin());

-- Allow admins to update any user
CREATE POLICY "Admins can update any user" 
    ON users FOR UPDATE 
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Allow admins to delete users (optional - uncomment if needed)
-- CREATE POLICY "Admins can delete any user" 
--     ON users FOR DELETE 
--     USING (public.is_admin());

-- ============================================================================
-- STEP 3: ADD ADMIN POLICIES FOR APPLICATIONS TABLE
-- ============================================================================

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications" 
    ON applications FOR SELECT 
    USING (public.is_admin());

-- Allow admins to update any application
CREATE POLICY "Admins can update any application" 
    ON applications FOR UPDATE 
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Allow admins to delete applications (optional - uncomment if needed)
-- CREATE POLICY "Admins can delete any application" 
--     ON applications FOR DELETE 
--     USING (public.is_admin());

-- ============================================================================
-- STEP 4: ADD ADMIN POLICIES FOR JOBS TABLE (if not already exists)
-- ============================================================================

-- Allow admins to view all jobs (including drafts)
CREATE POLICY "Admins can view all jobs" 
    ON jobs FOR SELECT 
    USING (public.is_admin());

-- Allow admins to update any job
CREATE POLICY "Admins can update any job" 
    ON jobs FOR UPDATE 
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Allow admins to delete any job
CREATE POLICY "Admins can delete any job" 
    ON jobs FOR DELETE 
    USING (public.is_admin());

-- ============================================================================
-- STEP 5: ADD ADMIN POLICIES FOR OTHER TABLES (optional)
-- ============================================================================

-- Allow admins to view all resumes
CREATE POLICY "Admins can view all resumes" 
    ON resumes FOR SELECT 
    USING (public.is_admin());

-- Allow admins to view all companies
CREATE POLICY "Admins can view all companies" 
    ON companies FOR SELECT 
    USING (public.is_admin());

-- Allow admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions" 
    ON subscriptions FOR SELECT 
    USING (public.is_admin());

-- Allow admins to view all notifications
CREATE POLICY "Admins can view all notifications" 
    ON notifications FOR SELECT 
    USING (public.is_admin());

-- Allow admins to view all activity logs
CREATE POLICY "Admins can view all activity logs" 
    ON activity_log FOR SELECT 
    USING (public.is_admin());

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running, test these queries as an admin user:

-- 1. Should return all users (if you're admin):
--    SELECT COUNT(*) FROM users;

-- 2. Should return all applications (if you're admin):
--    SELECT COUNT(*) FROM applications;

-- 3. Should return all jobs (if you're admin):
--    SELECT COUNT(*) FROM jobs;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. The is_admin() function uses SECURITY DEFINER to bypass RLS when checking
--    the user's role, preventing infinite recursion
-- 2. These policies are additive - they work alongside existing policies
-- 3. Regular users can still only see their own data
-- 4. Admins can see everything
-- ============================================================================

