-- Run this in your Supabase SQL Editor to update the course records
UPDATE courses
SET company = 'Hope Dawah Institute'
WHERE company = 'One Islam Institute';

-- If there are other tables like 'users' or 'profiles' that might have the name, you can do similar updates:
-- UPDATE profiles SET organization = 'Hope Dawah Institute' WHERE organization = 'One Islam Institute';
