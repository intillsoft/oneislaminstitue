-- 1. Drop the constraint FIRST to allow updates
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- 2. Now clean up any invalid data
UPDATE users 
SET role = 'job-seeker' 
WHERE role NOT IN ('job-seeker', 'recruiter', 'admin', 'talent') 
   OR role IS NULL;

-- 3. Add the new constraint including 'talent'
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('job-seeker', 'recruiter', 'admin', 'talent'));

-- 4. Update the trigger function to ensure future inserts work correctly
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
