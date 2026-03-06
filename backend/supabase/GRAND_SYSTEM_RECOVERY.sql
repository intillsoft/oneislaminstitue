-- ============================================================================
-- GRAND SYSTEM RECOVERY & SCHEMA ENFORCEMENT
-- This script fixes all missing tables and columns reported by the console.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE (Robust definition)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    full_name TEXT, -- For compatibility
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    professional_title TEXT,
    bio TEXT,
    location TEXT,
    phone TEXT,
    subscription_tier TEXT DEFAULT 'free',
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JOBS TABLE (The "Courses" backend)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT, -- Faculty/Provider
    description TEXT,
    location TEXT,
    type TEXT, -- Full-time / Online
    category TEXT,
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency TEXT DEFAULT 'USD',
    requirements TEXT,
    benefits TEXT,
    status TEXT DEFAULT 'active',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    course_id TEXT -- Extra mapping
);

-- 4. APPLICATIONS TABLE (The "Enrollments" backend)
-- We use a fresh approach to ensure columns exist.
DROP TABLE IF EXISTS public.applications CASCADE;
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE, -- Dual support
    status TEXT DEFAULT 'applied',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    offer_salary NUMERIC,
    feedback TEXT
);

-- 5. NOTIFICATIONS TABLE (Fixes the 500 Error)
DROP TABLE IF EXISTS public.notifications CASCADE;
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES (Enforce Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users
DROP POLICY IF EXISTS "Public profiles" ON public.users;
CREATE POLICY "Public profiles" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Self update" ON public.users;
CREATE POLICY "Self update" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Jobs (Courses)
DROP POLICY IF EXISTS "Public view jobs" ON public.jobs;
CREATE POLICY "Public view jobs" ON public.jobs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Instructor manage jobs" ON public.jobs;
CREATE POLICY "Instructor manage jobs" ON public.jobs FOR ALL USING (auth.uid() = created_by);

-- Applications (Enrollments)
DROP POLICY IF EXISTS "Users view own applications" ON public.applications;
CREATE POLICY "Users view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own applications" ON public.applications;
CREATE POLICY "Users insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Instructors view course applications" ON public.applications;
CREATE POLICY "Instructors view course applications" ON public.applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = public.applications.job_id AND created_by = auth.uid())
);

-- Notifications
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 8. THE NUCLEAR SYNC ENGINE (v2)
CREATE OR REPLACE FUNCTION public.handle_new_user_ultimate()
RETURNS TRIGGER AS $$
DECLARE
    raw_role TEXT;
    cleaned_role TEXT;
BEGIN
    raw_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
    
    -- Normalize
    IF raw_role LIKE '%admin%' THEN cleaned_role := 'admin';
    ELSIF raw_role IN ('instructor', 'recruiter', 'faculty', 'teacher') THEN cleaned_role := 'instructor';
    ELSE cleaned_role := 'student';
    END IF;

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

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_ultimate();

-- 9. SYNC EXISTING
INSERT INTO public.users (id, email, name, role, created_at)
SELECT 
    id, email, 
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'student', -- Default for sync
    created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 10. GRANTS
GRANT ALL ON public.users TO authenticated, service_role;
GRANT ALL ON public.jobs TO authenticated, service_role;
GRANT ALL ON public.applications TO authenticated, service_role;
GRANT ALL ON public.notifications TO authenticated, service_role;
GRANT ALL ON public.notification_preferences TO authenticated, service_role;
