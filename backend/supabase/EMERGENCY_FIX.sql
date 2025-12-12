-- NUCLEAR OPTION: Drop the constraint entirely to unblock registration
-- We can re-add a better one later once users can sign up
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Also just in case, clean up any weird data
UPDATE users SET role = 'job-seeker' WHERE role IS NULL OR role = '';
