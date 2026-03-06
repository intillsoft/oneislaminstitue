-- ============================================================================
-- FINAL COLLECTIVE SYSTEM FIX (v4)
-- This script fixes Notifications, Storage Buckets, and Schema Cache
-- Instructions: Copy and run this ENTIRE script in Supabase SQL Editor
-- ============================================================================

-- 1. FIX NOTIFICATIONS TABLE SCHEMA
-- Ensure the table exists and all columns are present
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add missing columns if they don't exist
DO $$ 
BEGIN
    -- Core pillars: title and message
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'title') THEN
        ALTER TABLE public.notifications ADD COLUMN title TEXT NOT NULL DEFAULT 'Subject';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'message') THEN
        ALTER TABLE public.notifications ADD COLUMN message TEXT NOT NULL DEFAULT 'Content';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'sender_id') THEN
        ALTER TABLE public.notifications ADD COLUMN sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'type') THEN
        ALTER TABLE public.notifications ADD COLUMN type TEXT NOT NULL DEFAULT 'general';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'data') THEN
        ALTER TABLE public.notifications ADD COLUMN data JSONB DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'is_read') THEN
        ALTER TABLE public.notifications ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'read_at') THEN
        ALTER TABLE public.notifications ADD COLUMN read_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'updated_at') THEN
        ALTER TABLE public.notifications ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Notification column update skipped: %', SQLERRM;
END $$;

-- 2. RESET NOTIFICATIONS RLS POLICIES
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can do anything" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own or sent notifications" ON public.notifications;

CREATE POLICY "Users can view own or sent notifications" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() = sender_id);

CREATE POLICY "Users can update own notifications" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" 
    ON public.notifications FOR DELETE 
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" 
    ON public.notifications FOR ALL 
    USING (true);

-- 3. SETUP STORAGE BUCKETS
-- Insert buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT (id) DO NOTHING;

-- Reset Storage Policies
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND (policyname LIKE '%avatar%' OR policyname LIKE '%profile%' OR policyname LIKE '%resume%')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    END LOOP;
END $$;

-- Avatars Policies
CREATE POLICY "Public Access avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth Upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "User Update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "User Delete avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- Profiles Policies
CREATE POLICY "Public Access profiles" ON storage.objects FOR SELECT USING (bucket_id = 'profiles');
CREATE POLICY "Auth Upload profiles" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profiles');
CREATE POLICY "User Update profiles" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profiles');
CREATE POLICY "User Delete profiles" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'profiles');

-- Resumes Policies
CREATE POLICY "Public Access resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Auth Upload resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "User Update resumes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "User Delete resumes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');

-- 4. REFRESH SCHEMA CACHE
-- This is CRITICAL to fix the "column not found in schema cache" error
NOTIFY pgrst, 'reload schema';

SELECT 'SUCCESS: SYSTEM REPAIRED' as status;
