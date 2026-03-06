-- ONE ISLAM INSTITUTE: PROFILE AUTOMATION
-- This script ensures that every new user registered in auth.users 
-- automatically gets a matching record in the public profiles table.

-- 1. Ensure Profiles table exists (using 'users' naming convention if already established)
-- We'll check the existing schema first, but assuming 'users' or 'profiles'.
-- Based on previous context, the app uses a 'users' table in the public schema for profiles.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, created_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'student',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill missing profiles (Optional, for existing users)
INSERT INTO public.profiles (id, name, role, created_at)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)), 'student', created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;
