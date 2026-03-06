-- ============================================================================
-- NUCLEAR USER SYSTEM REBUILD (v1)
-- Fixes: Role Locking, Missing Users, and Sync Errors
-- ============================================================================

-- 1. CLEAN UP ROLE CONSTRAINTS
-- Remove old check constraints that might be blocking new roles
DO $$ 
BEGIN 
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check1;
EXCEPTION WHEN OTHERS THEN 
    NULL; 
END $$;

-- 2. ENSURE COLUMNS EXIST
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. THE "SMART" SYNC FUNCTION
-- This reads the latest role from your metadata and syncs it.
CREATE OR REPLACE FUNCTION public.handle_new_user_nuclear()
RETURNS TRIGGER AS $$
DECLARE
    raw_role TEXT;
    cleaned_role TEXT;
BEGIN
    -- Extract role from metadata
    raw_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
    
    -- Normalization Logic
    CASE 
        WHEN raw_role IN ('admin', 'super_admin', 'superadmin') THEN cleaned_role := 'admin';
        WHEN raw_role IN ('instructor', 'recruiter', 'faculty', 'teacher') THEN cleaned_role := 'instructor';
        WHEN raw_role IN ('student', 'job-seeker', 'jobseeker', 'scholar') THEN cleaned_role := 'student';
        ELSE cleaned_role := 'student';
    END CASE;

    INSERT INTO public.users (id, email, name, role, avatar_url, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        cleaned_role,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        role = COALESCE(EXCLUDED.role, public.users.role),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RE-BIND THE TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_nuclear();

-- 5. BULLETPROOF RLS (Allowing the Frontend to fix missing users)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Rule: Read access for everyone (standard for a social/academic platform)
DROP POLICY IF EXISTS "Public profile visibility" ON public.users;
CREATE POLICY "Public profile visibility" ON public.users FOR SELECT USING (true);

-- Rule: Self-management (INSERT, UPDATE)
DROP POLICY IF EXISTS "Self management" ON public.users;
CREATE POLICY "Self management" ON public.users 
  FOR ALL 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Rule: Admin God Mode
DROP POLICY IF EXISTS "Admin view all" ON public.users;
CREATE POLICY "Admin view all" ON public.users 
  FOR ALL 
  USING (
    COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') IN ('admin', 'super_admin')
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. SYNC ALL EXISTING USERS NOW
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    CASE 
        WHEN LOWER(raw_user_meta_data->>'role') IN ('admin', 'super_admin') THEN 'admin'
        WHEN LOWER(raw_user_meta_data->>'role') IN ('instructor', 'recruiter') THEN 'instructor'
        ELSE 'student'
    END,
    created_at,
    NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    updated_at = NOW();

-- 7. NOTIFY
GRANT ALL ON public.users TO authenticated, service_role;
