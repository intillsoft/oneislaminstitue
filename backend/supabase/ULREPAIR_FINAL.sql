-- ============================================================================
-- THE MASTER REPAIR SCRIPT (v6)
-- Run this in your Supabase SQL Editor to fix ALL role/registration issues.
-- ============================================================================

-- 1. Ensure the 'users' table is ready
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'student',
    professional_title TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. God-Mode Admin Check (Shield against recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
BEGIN
  RETURN (
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') IN ('admin', 'super_admin')
    OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
END;
$$ LANGUAGE plpgsql;

-- 3. The Sync Trigger (Handles automatic profile creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    final_role TEXT;
BEGIN
    -- Extract and normalize role from metadata
    final_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    IF final_role = 'job-seeker' THEN final_role := 'student'; END IF;
    IF final_role = 'recruiter' THEN final_role := 'instructor'; END IF;
    
    INSERT INTO public.users (id, email, name, role, avatar_url, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        final_role,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = COALESCE(EXCLUDED.role, public.users.role),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS POLICIES (Bulletproof)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Rule 1: Anyone can see profiles (Safe for academic directory)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.users;
CREATE POLICY "Anyone can view profiles" ON public.users FOR SELECT USING (true);

-- Rule 2: Users can insert their own profile (Safety net if trigger fails)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Rule 3: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Rule 4: Admins can do EVERYTHING
DROP POLICY IF EXISTS "Admins manage everything" ON public.users;
CREATE POLICY "Admins manage everything" ON public.users FOR ALL USING (public.is_admin());

-- 5. Fix Saved Courses Relationship
ALTER TABLE IF EXISTS public.saved_courses 
DROP CONSTRAINT IF EXISTS saved_courses_course_id_fkey,
ADD CONSTRAINT saved_courses_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- 6. SYNC EXISTING USERS (If any were missed)
INSERT INTO public.users (id, email, name, role, updated_at)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    CASE 
        WHEN raw_user_meta_data->>'role' = 'job-seeker' THEN 'student'
        WHEN raw_user_meta_data->>'role' = 'recruiter' THEN 'instructor'
        ELSE COALESCE(raw_user_meta_data->>'role', 'student')
    END,
    NOW()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. Permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
