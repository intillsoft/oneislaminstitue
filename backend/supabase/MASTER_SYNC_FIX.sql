-- ============================================================================
-- THE "EVERYTHING FIX" SCRIPT (v5)
-- Targeted Fixes: User Sync, Role Persistence, Saved Courses Relationships
-- ============================================================================

-- 1. Ensure Table Schema is Robust
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Clean up profiles vs users confusion (Optional but recommended)
-- Ensure 'profiles' table exists and mirrors 'users' or just use 'users'
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. The "God Function" for User Creation
-- This handles synchronization from Auth to Public tables
CREATE OR REPLACE FUNCTION public.handle_new_user_v5()
RETURNS TRIGGER AS $$
DECLARE
    new_role TEXT;
BEGIN
    -- Extract role and normalize it
    new_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
    
    -- Sync to public.users
    INSERT INTO public.users (id, email, name, role, avatar_url, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        new_role,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        role = COALESCE(EXCLUDED.role, public.users.role),
        updated_at = NOW();

    -- Sync to public.profiles (mirroring for compatibility)
    INSERT INTO public.profiles (id, email, name, role, avatar_url, updated_at)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), new_role, NEW.raw_user_meta_data->>'avatar_url', NOW())
    ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_v5();

-- 5. Fix RLS (Infinite Recursion Shield)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin_v5()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
BEGIN
  -- Check metadata first (fastest)
  IF (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Fallback to DB check
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql;

DROP POLICY IF EXISTS "Public Profile Visibility" ON public.users;
CREATE POLICY "Public Profile Visibility" ON public.users FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users Manage Own" ON public.users;
CREATE POLICY "Users Manage Own" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins Manage All" ON public.users;
CREATE POLICY "Admins Manage All" ON public.users FOR ALL USING (public.is_admin_v5());

-- 6. Relationship Fix: Saved Courses -> Jobs
ALTER TABLE IF EXISTS public.saved_courses 
DROP CONSTRAINT IF EXISTS saved_courses_course_id_fkey,
ADD CONSTRAINT saved_courses_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- 7. Migration: Restore any missing users (Sync existing auth users to public.users)
INSERT INTO public.users (id, email, name, role, created_at)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)), COALESCE(raw_user_meta_data->>'role', 'student'), created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 8. GRANT PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
