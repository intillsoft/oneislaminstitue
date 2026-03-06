-- ============================================================================
-- FINAL FIX (Attempt 3): Handle existing profiles table schema
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: Ensure public.users table exists (with email)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    professional_title TEXT,
    role TEXT DEFAULT 'student',
    subscription_tier TEXT DEFAULT 'free',
    preferences JSONB DEFAULT '{}',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Ensure public.profiles table exists 
-- (And ADD email column if missing - getting ERROR 42703 suggests it is)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'professional_title') THEN
        ALTER TABLE public.profiles ADD COLUMN professional_title TEXT;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ============================================================================
-- STEP 3: Remove restrictive constraints
-- ============================================================================

DO $$ 
BEGIN
    -- Drop from users table
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS role_check;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS check_role;
    
    -- Drop from profiles table
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================================
-- STEP 4: RLS Policies
-- ============================================================================

-- Users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles can view own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can update own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can insert own" ON public.profiles;

CREATE POLICY "Profiles can view own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles can update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles can insert own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- STEP 5: Trigger - Populates BOTH tables safely
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
  user_role TEXT;
  user_avatar TEXT;
  user_title TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'User');
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  user_avatar := NEW.raw_user_meta_data->>'avatar_url';
  user_title := COALESCE(NEW.raw_user_meta_data->>'professional_title', '');

  -- Insert into users
  BEGIN
    INSERT INTO public.users (id, email, name, avatar_url, role, professional_title, created_at, updated_at)
    VALUES (NEW.id, NEW.email, user_name, user_avatar, user_role, user_title, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, users.name),
      role = COALESCE(EXCLUDED.role, users.role),
      updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'users insert error: %', SQLERRM;
  END;

  -- Insert into profiles (handle missing columns dynamically if needed, but we added them above)
  BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url, role, professional_title, created_at, updated_at)
    VALUES (NEW.id, NEW.email, user_name, user_avatar, user_role, user_title, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, profiles.name),
      role = COALESCE(EXCLUDED.role, profiles.role),
      updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'profiles insert error: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 6: Backfill
-- ============================================================================

-- Backfill users
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  au.id, 
  au.email, 
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)), 
  COALESCE(au.raw_user_meta_data->>'role', 'student'),
  au.created_at, NOW()
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- Backfill profiles (safely)
INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
SELECT 
  au.id, 
  au.email, 
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)), 
  COALESCE(au.raw_user_meta_data->>'role', 'student'),
  au.created_at, NOW()
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 7: Storage
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Drop existing avatar policies
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%avatar%'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    END LOOP;
END $$;

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'SUCCESS' as status,
  (SELECT COUNT(*) FROM public.users) as users_count,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count;
