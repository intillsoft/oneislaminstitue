-- ============================================================================
-- CANONICAL ROLE UNIFICATION
-- ============================================================================
-- Forces every single user into one of three clean categories:
-- student, instructor, or admin.
-- ============================================================================

-- 1. Standardize the data
UPDATE public.users SET role = 'student' WHERE role IN ('job-seeker', 'scholar', 'student-seeker');
UPDATE public.users SET role = 'instructor' WHERE role IN ('recruiter', 'faculty', 'teacher');
UPDATE public.users SET role = 'admin' WHERE role IN ('super_admin', 'super-admin', 'superadmin', 'moderator');

-- 2. Fix the helper function to support these clean roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
DECLARE
  u_role TEXT;
BEGIN
  SELECT role INTO u_role FROM public.users WHERE id = auth.uid();
  RETURN u_role = 'admin';
END;
$$ LANGUAGE plpgsql;

-- 3. Fix the helper function for instructors
CREATE OR REPLACE FUNCTION public.is_instructor()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
DECLARE
  u_role TEXT;
BEGIN
  SELECT role INTO u_role FROM public.users WHERE id = auth.uid();
  RETURN (u_role = 'instructor' OR u_role = 'admin');
END;
$$ LANGUAGE plpgsql;
