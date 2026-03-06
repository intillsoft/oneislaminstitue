-- ============================================================================
-- FINAL ULTIMATE ADMIN AND REGISTRATION FIX
-- ============================================================================
-- This script fixes:
-- 1. RLS Infinite Recursion (The #1 cause of "everyone is a student" bugs)
-- 2. New User registration visibility for admins
-- 3. Super Admin role handling
-- ============================================================================

-- 1. DROP CONFLICTING POLICIES FIRST
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 2. RECREATE THE ULTIMATE IS_ADMIN FUNCTION (NO RECURSION)
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
  
  -- Support both 'admin' and 'super_admin'
  RETURN (user_role = 'admin' OR user_role = 'super_admin' OR user_role = 'super-admin');
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3. APPLY CLEAN POLICIES TO USERS TABLE
-- Users can always see their own record
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Users can always update their own record
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can see EVERYTHING
CREATE POLICY "Admins can manage all users" 
  ON users FOR ALL
  USING (public.is_admin());

-- 4. FIX TRIGGER FOR NEW USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'User'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'job-seeker' THEN 'student'
      WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL THEN NEW.raw_user_meta_data->>'role'
      ELSE 'student'
    END,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    role = COALESCE(EXCLUDED.role, users.role),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. FIX OTHER TABLES FOR ADMINS
CREATE POLICY "Admins access all apps" ON applications FOR ALL USING (public.is_admin());
CREATE POLICY "Admins access all jobs" ON jobs FOR ALL USING (public.is_admin());
CREATE POLICY "Admins access all resumes" ON resumes FOR ALL USING (public.is_admin());
CREATE POLICY "Admins access all activity" ON activity_log FOR ALL USING (public.is_admin());

-- 6. ENSURE PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
