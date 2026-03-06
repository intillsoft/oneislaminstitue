-- ============================================================================
-- FIX USER ROLES AND MISSING COLUMNS
-- ============================================================================

-- 1. Add missing `role` column to `users` table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student';
    END IF;
END $$;

-- 2. Add missing `professional_title` column to `users` table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'professional_title') THEN
        ALTER TABLE users ADD COLUMN professional_title TEXT;
    END IF;
END $$;

-- 3. Sync role and title from auth.users (metadata) to public.users
-- This fixes users who were created without these columns being populated
UPDATE public.users pu
SET 
    role = COALESCE(au.raw_user_meta_data->>'role', 'student'),
    professional_title = au.raw_user_meta_data->>'professional_title'
FROM auth.users au
WHERE pu.id = au.id
AND (pu.role IS NULL OR pu.role = 'student'); -- Only update if missing or default

-- 4. Ensure RLS policies on users table allow reading own data (including role)
-- This is critical for the frontend to fetch the user's role
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;
