-- SQL Script to Create 10 Featured Talent Users
-- Emails: yussifabduljalil605@gmail.com through yussifabduljalil614@gmail.com
-- All users will have the 'talent' role

-- Create users in auth.users (this should be done via Supabase Auth API, but we'll prepare the SQL)
-- Note: In production, users should be created via the Auth API to properly hash passwords
-- This script assumes users will be created via the application's registration flow

-- First, let's create a function to help with user creation
-- You'll need to create these users via the Supabase Auth Admin API or through the registration flow

-- SQL to update existing users to talent role (if they exist)
-- Or insert into users table after auth user is created

-- Step 1: Create the users via Supabase Auth API (this needs to be done via application code or Supabase Dashboard)
-- For now, we'll create SQL that can be run after users are created in auth.users

-- Step 2: Insert/Update user profiles in public.users table
INSERT INTO public.users (id, email, role, name, created_at, updated_at)
VALUES
  -- User 605
  (
    gen_random_uuid(),
    'yussifabduljalil605@gmail.com',
    'talent',
    'Yussif Abdul Jalil 605',
    NOW(),
    NOW()
  ),
  -- User 606
  (
    gen_random_uuid(),
    'yussifabduljalil606@gmail.com',
    'talent',
    'Yussif Abdul Jalil 606',
    NOW(),
    NOW()
  ),
  -- User 607
  (
    gen_random_uuid(),
    'yussifabduljalil607@gmail.com',
    'talent',
    'Yussif Abdul Jalil 607',
    NOW(),
    NOW()
  ),
  -- User 608
  (
    gen_random_uuid(),
    'yussifabduljalil608@gmail.com',
    'talent',
    'Yussif Abdul Jalil 608',
    NOW(),
    NOW()
  ),
  -- User 609
  (
    gen_random_uuid(),
    'yussifabduljalil609@gmail.com',
    'talent',
    'Yussif Abdul Jalil 609',
    NOW(),
    NOW()
  ),
  -- User 610
  (
    gen_random_uuid(),
    'yussifabduljalil610@gmail.com',
    'talent',
    'Yussif Abdul Jalil 610',
    NOW(),
    NOW()
  ),
  -- User 611
  (
    gen_random_uuid(),
    'yussifabduljalil611@gmail.com',
    'talent',
    'Yussif Abdul Jalil 611',
    NOW(),
    NOW()
  ),
  -- User 612
  (
    gen_random_uuid(),
    'yussifabduljalil612@gmail.com',
    'talent',
    'Yussif Abdul Jalil 612',
    NOW(),
    NOW()
  ),
  -- User 613
  (
    gen_random_uuid(),
    'yussifabduljalil613@gmail.com',
    'talent',
    'Yussif Abdul Jalil 613',
    NOW(),
    NOW()
  ),
  -- User 614
  (
    gen_random_uuid(),
    'yussifabduljalil614@gmail.com',
    'talent',
    'Yussif Abdul Jalil 614',
    NOW(),
    NOW()
  )
ON CONFLICT (email) 
DO UPDATE SET
  role = 'talent',
  updated_at = NOW();

-- Step 3: Create talent marketplace profiles for each user
-- This will create basic talent profiles in the talent_marketplace_profiles table
INSERT INTO public.talent_marketplace_profiles (
  user_id,
  title,
  bio,
  hourly_rate,
  is_active,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Professional Talent ' || SUBSTRING(u.email FROM '@(.*)@' FOR '#'),
  'Experienced professional ready to help with your projects.',
  50.00,
  true,
  NOW(),
  NOW()
FROM public.users u
WHERE u.email LIKE 'yussifabduljalil60%@gmail.com'
  AND u.role = 'talent'
  AND NOT EXISTS (
    SELECT 1 FROM public.talent_marketplace_profiles tmp
    WHERE tmp.user_id = u.id
  );

-- Step 4: Create sample gigs for featured talents (optional - to make them visible)
INSERT INTO public.talent_marketplace_gigs (
  user_id,
  title,
  description,
  price,
  delivery_time,
  is_active,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Professional ' || CASE (ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY u.created_at) % 3)
    WHEN 0 THEN 'Web Development'
    WHEN 1 THEN 'UI/UX Design'
    ELSE 'Content Writing'
  END,
  'High-quality professional service. Experienced in delivering exceptional results.',
  50.00,
  7,
  true,
  NOW(),
  NOW()
FROM public.users u
WHERE u.email LIKE 'yussifabduljalil60%@gmail.com'
  AND u.role = 'talent'
  AND NOT EXISTS (
    SELECT 1 FROM public.talent_marketplace_gigs tmg
    WHERE tmg.user_id = u.id
  )
LIMIT 10;

-- Verify the users were created
SELECT 
  id,
  email,
  role,
  name,
  created_at
FROM public.users
WHERE email LIKE 'yussifabduljalil60%@gmail.com'
ORDER BY email;












