-- First, clean up any data that violates the new constraint
-- Set any invalid role to 'job-seeker' default
UPDATE users 
SET role = 'job-seeker' 
WHERE role NOT IN ('job-seeker', 'recruiter', 'admin', 'talent') 
   OR role IS NULL;

-- Drop the old constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint including 'talent'
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('job-seeker', 'recruiter', 'admin', 'talent'));

-- Ensure the trigger function handles the 'talent' role correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'job-seeker')
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        role = COALESCE(EXCLUDED.role, users.role);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
