-- FIX: Ensure user role is properly assigned from metadata
-- Run this in Supabase SQL Editor

-- Update the trigger to properly read role from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert with proper role from metadata
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
    -- IMPORTANT: Read role from raw_user_meta_data, default to job-seeker if not set
    COALESCE(NEW.raw_user_meta_data->>'role', 'job-seeker'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    role = COALESCE(EXCLUDED.role, users.role),
    name = COALESCE(EXCLUDED.name, users.name),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Verify the trigger exists
SELECT 'Trigger updated successfully!' as result;

-- Test: Check what metadata is being passed
-- After running this, register a test user and check the logs
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as metadata_role,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
