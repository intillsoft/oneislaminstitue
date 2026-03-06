-- ONE ISLAM INSTITUTE: RBAC SYNCHRONIZATION & TRIGGER FIX
-- This script aligns the 'users' table with auth.users and fixes the automatic role assignment.

-- 1. Harmonize Table Names: Ensure 'users' table exists with correct schema
-- (We use 'users' instead of 'profiles' to match the React app's code)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'job-seeker', -- Mapping: 'job-seeker' (student), 'recruiter' (instructor), 'admin', 'talent'
    location TEXT,
    phone TEXT, -- Added to resolve schema cache error
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create a SMART trigger function that respects user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, avatar_url, role, created_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'job-seeker'), -- Use metadata role if available!
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role, -- Update role if it changes in metadata
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-enable the trigger on the 'users' table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CRITICAL: Fix roles for EXISTING users based on their metadata
-- This will unblock Admins and Instructors who are currently trapped in the Student role
UPDATE public.users u
SET role = (a.raw_user_meta_data->>'role')
FROM auth.users a
WHERE u.id = a.id
AND a.raw_user_meta_data->>'role' IS NOT NULL;

-- 5. Backfill any missing records in public.users
INSERT INTO public.users (id, name, email, avatar_url, role, created_at)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
    email,
    raw_user_meta_data->>'avatar_url',
    COALESCE(raw_user_meta_data->>'role', 'job-seeker'),
    created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 6. Optional: Clean up the redundant 'profiles' table if it was created by mistake
-- DROP TABLE IF EXISTS public.profiles;

-- 7. ADDED: Ensure auto_apply_settings table exists for backend features
CREATE TABLE IF NOT EXISTS public.auto_apply_settings (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT FALSE,
    job_titles TEXT[],
    locations TEXT[],
    experience_level TEXT,
    salary_min INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);



this app still has critical issues that need to be fix ultimatly with precision and accuracy. 1) the courses detail pages should be redesign to look modrn and premium courses detail pages  with clean and professional ui 2) users cant enroll in any course and this need to be fix now 3) the courses page where users cant see the strutured and modules and lessons to start laerning needs to be redesign to look professional and neautiful and clean modern designs and ui 4) the lessons learning interface also needs redesing  5) admins and instructors needs to be able to create course with a brand new ai porewd course creation systems that is flexible and easy to customize and also the edit course systems. the save courses or bookmark and other sysytems such as learning path should be working good in realtime data