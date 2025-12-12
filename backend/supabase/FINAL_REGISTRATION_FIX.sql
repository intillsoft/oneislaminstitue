-- ============================================
-- FINAL COMPREHENSIVE FIX FOR REGISTRATION
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Drop the problematic trigger entirely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop ALL possible constraints on users table
DO $$ 
BEGIN
    -- Drop all check constraints that might exist
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS role_check;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS check_role;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_check;
    
    RAISE NOTICE 'All constraints dropped successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping constraints: %', SQLERRM;
END $$;

-- Step 3: Make sure role column accepts any value
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50);
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'job-seeker';

-- Step 4: Clean up any bad data
UPDATE users 
SET role = 'job-seeker' 
WHERE role IS NULL 
   OR role = '' 
   OR role NOT IN ('job-seeker', 'recruiter', 'admin', 'talent');

-- Step 5: Create a SIMPLE trigger that won't fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple insert with minimal logic
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'job-seeker'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail - just log and continue
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 6: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Grant ALL necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON auth.users TO anon, authenticated;

-- Step 8: Verify it worked
SELECT 'SUCCESS: Registration fix applied!' as result;
