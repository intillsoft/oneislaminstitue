-- One Islam Institute Admin Fix
-- Run this in your Supabase SQL Editor

-- 1. Identify your user ID (or it will use your logged in email)
-- 2. Update the role to 'admin'

UPDATE users 
SET role = 'admin' 
WHERE email = 'yussifabduljalil601@gmail.com'; -- Update this if your email is different

-- Verify the change
SELECT id, email, role FROM users WHERE email = 'yussifabduljalil601@gmail.com';

-- Ensure the public.jobs table has some 'published' or 'active' status courses 
-- for the homepage to display them.
UPDATE jobs SET status = 'published' WHERE status IS NULL OR status = 'active';

-- Bonus: Fix any legacy branding in company names
UPDATE jobs SET company = 'One Islam Institute' WHERE company = 'Legacy Academy' OR company = 'Workflow';
