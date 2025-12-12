-- FINAL FIX: Update trigger to properly set role from metadata
-- Run this in Supabase SQL Editor

-- Drop and recreate the trigger with UPDATE logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert with role from metadata, or UPDATE if already exists
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
    COALESCE(
      NEW.raw_user_meta_data->>'name', 
      NEW.raw_user_meta_data->>'full_name', 
      split_part(NEW.email, '@', 1)
    ),
    -- Read role from metadata
    COALESCE(NEW.raw_user_meta_data->>'role', 'job-seeker'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    -- IMPORTANT: Update the role from metadata
    role = COALESCE(EXCLUDED.role, users.role),
    name = COALESCE(EXCLUDED.name, users.name),
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Now fix existing users who have wrong roles
-- Update users table from auth.users metadata
UPDATE public.users u
SET role = COALESCE(au.raw_user_meta_data->>'role', 'job-seeker')
FROM auth.users au
WHERE u.id = au.id
  AND au.raw_user_meta_data->>'role' IS NOT NULL
  AND u.role != au.raw_user_meta_data->>'role';

-- Verify it worked
SELECT 
  u.email,
  u.role as users_table_role,
  au.raw_user_meta_data->>'role' as metadata_role,
  CASE 
    WHEN u.role = au.raw_user_meta_data->>'role' THEN '✅ Correct'
    ELSE '❌ Mismatch'
  END as status
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC
LIMIT 10;
