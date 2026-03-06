-- ============================================================================
-- FINAL HEALING SCRIPT: ROLES & PERMISSIONS
-- ============================================================================

-- 1. Ensure the helper function is NOT recursive
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
BEGIN
  -- We check auth.jwt() directly to avoid hitting the users table if possible,
  -- but falling back to a direct lookup if metadata is missing.
  RETURN (
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') IN ('admin', 'super_admin', 'super-admin')
    OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Clean up ALL user policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;

-- 3. Apply Clean, High-Performance Policies
CREATE POLICY "Users can always see themselves" 
ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins have full power" 
ON public.users FOR ALL USING (public.is_admin());

-- 4. Fix Saved Courses Relationship
-- Ensure the foreign key is explicitly named for the API
ALTER TABLE IF EXISTS public.saved_courses 
DROP CONSTRAINT IF EXISTS saved_courses_course_id_fkey,
ADD CONSTRAINT saved_courses_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- 5. Force specific users (Use emails you know) to Admin if they are stuck
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
