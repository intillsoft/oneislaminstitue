-- ============================================================================
-- COMPLETE SQL SCRIPT TO CREATE 10 FEATURED TALENT USERS
-- ============================================================================
-- Email format: yussifabduljalil605@gmail.com through yussifabduljalil614@gmail.com
-- All users will have 'talent' role and full access to talent features
--
-- IMPORTANT: Users must be created via Supabase Auth API first (see instructions below)
-- Then run this SQL script to set up their profiles
-- ============================================================================

-- Step 1: First, create users in auth.users using Supabase Admin API or Dashboard
-- You can use the Supabase Admin API or create them manually in the Dashboard
-- 
-- For each user (605-614), you need to create them in auth.users with:
-- - Email: yussifabduljalil605@gmail.com (through 614)
-- - Password: Set a secure password (users will reset it on first login)
-- - Email confirmed: true

-- Step 2: After users are created in auth.users, update/insert their profiles in public.users
-- This assumes the auth.users were created and we're linking them
DO $$
DECLARE
  user_emails TEXT[] := ARRAY[
    'yussifabduljalil605@gmail.com',
    'yussifabduljalil606@gmail.com',
    'yussifabduljalil607@gmail.com',
    'yussifabduljalil608@gmail.com',
    'yussifabduljalil609@gmail.com',
    'yussifabduljalil610@gmail.com',
    'yussifabduljalil611@gmail.com',
    'yussifabduljalil612@gmail.com',
    'yussifabduljalil613@gmail.com',
    'yussifabduljalil614@gmail.com'
  ];
  user_email TEXT;
  auth_user_id UUID;
  talent_names TEXT[] := ARRAY[
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Jessica Williams',
    'Ryan Martinez',
    'Amanda Taylor',
    'Chris Anderson',
    'Lauren Brown',
    'Alex Thompson'
  ];
  talent_titles TEXT[] := ARRAY[
    'Senior Full-Stack Developer',
    'UI/UX Designer',
    'Content Writer & SEO Specialist',
    'Data Analyst',
    'Marketing Strategist',
    'Graphic Designer',
    'Project Manager',
    'Digital Marketing Expert',
    'Video Editor',
    'Copywriter'
  ];
  talent_skills JSONB[] := ARRAY[
    '["React", "Node.js", "TypeScript", "PostgreSQL"]'::jsonb,
    '["Figma", "Adobe XD", "UI Design", "Prototyping"]'::jsonb,
    '["Content Writing", "SEO", "Blogging", "Copywriting"]'::jsonb,
    '["Python", "SQL", "Data Analysis", "Machine Learning"]'::jsonb,
    '["Social Media", "SEO", "Analytics", "Campaign Management"]'::jsonb,
    '["Photoshop", "Illustrator", "Branding", "Logo Design"]'::jsonb,
    '["Agile", "Scrum", "Team Leadership", "Communication"]'::jsonb,
    '["Google Ads", "Facebook Ads", "Analytics", "Conversion Optimization"]'::jsonb,
    '["Premiere Pro", "After Effects", "Video Production", "Motion Graphics"]'::jsonb,
    '["Copywriting", "Email Marketing", "Content Strategy", "Brand Voice"]'::jsonb
  ];
  idx INT;
BEGIN
  -- Loop through each email and create/update user profile
  FOR idx IN 1..array_length(user_emails, 1) LOOP
    user_email := user_emails[idx];
    
    -- Try to find existing auth user by email
    SELECT id INTO auth_user_id
    FROM auth.users
    WHERE email = user_email
    LIMIT 1;
    
    -- If auth user exists, create/update public.users profile
    IF auth_user_id IS NOT NULL THEN
      -- Insert or update user profile
      INSERT INTO public.users (
        id,
        email,
        role,
        name,
        created_at,
        updated_at
      )
      VALUES (
        auth_user_id,
        user_email,
        'talent',
        talent_names[idx],
        NOW(),
        NOW()
      )
      ON CONFLICT (id) 
      DO UPDATE SET
        role = 'talent',
        name = talent_names[idx],
        email = user_email,
        updated_at = NOW();
      
      -- Create talent marketplace profile
      INSERT INTO public.talent_marketplace_profiles (
        user_id,
        title,
        bio,
        hourly_rate,
        skills,
        experience_level,
        is_active,
        rating,
        total_reviews,
        created_at,
        updated_at
      )
      VALUES (
        auth_user_id,
        talent_titles[idx],
        'Experienced professional with a proven track record of delivering high-quality work. Passionate about ' || 
        LOWER(SPLIT_PART(talent_titles[idx], ' ', 1)) || ' and committed to client success.',
        (50 + (idx * 5))::DECIMAL(10, 2), -- Varying rates from $55-$100/hr
        talent_skills[idx],
        CASE 
          WHEN idx <= 3 THEN 'expert'
          WHEN idx <= 7 THEN 'intermediate'
          ELSE 'beginner'
        END,
        true,
        4.5 + (RANDOM() * 0.5)::DECIMAL(3, 2), -- Random rating between 4.5-5.0
        (10 + (RANDOM() * 40))::INTEGER, -- Random reviews between 10-50
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        title = talent_titles[idx],
        bio = 'Experienced professional with a proven track record of delivering high-quality work. Passionate about ' || 
              LOWER(SPLIT_PART(talent_titles[idx], ' ', 1)) || ' and committed to client success.',
        hourly_rate = (50 + (idx * 5))::DECIMAL(10, 2),
        skills = talent_skills[idx],
        experience_level = CASE 
          WHEN idx <= 3 THEN 'expert'
          WHEN idx <= 7 THEN 'intermediate'
          ELSE 'beginner'
        END,
        is_active = true,
        updated_at = NOW();
      
      -- Create sample gig for each talent
      INSERT INTO public.talent_marketplace_gigs (
        user_id,
        title,
        description,
        price,
        delivery_time,
        category,
        skills,
        is_active,
        rating,
        total_orders,
        created_at,
        updated_at
      )
      VALUES (
        auth_user_id,
        talent_titles[idx] || ' Services',
        'Professional ' || LOWER(SPLIT_PART(talent_titles[idx], ' ', -1)) || 
        ' services. I deliver high-quality work on time and within budget. ' ||
        'Contact me to discuss your project requirements.',
        (100 + (idx * 25))::DECIMAL(10, 2), -- Varying prices
        (7 + (RANDOM() * 14))::INTEGER, -- Random delivery time 7-21 days
        CASE 
          WHEN talent_titles[idx] LIKE '%Developer%' THEN 'Development'
          WHEN talent_titles[idx] LIKE '%Designer%' THEN 'Design'
          WHEN talent_titles[idx] LIKE '%Writer%' OR talent_titles[idx] LIKE '%Copywriter%' THEN 'Writing'
          WHEN talent_titles[idx] LIKE '%Analyst%' THEN 'Analytics'
          WHEN talent_titles[idx] LIKE '%Marketing%' THEN 'Marketing'
          WHEN talent_titles[idx] LIKE '%Editor%' THEN 'Video'
          WHEN talent_titles[idx] LIKE '%Manager%' THEN 'Management'
          ELSE 'General'
        END,
        talent_skills[idx],
        true,
        4.5 + (RANDOM() * 0.5)::DECIMAL(3, 2),
        (5 + (RANDOM() * 20))::INTEGER,
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING; -- Skip if gig already exists
      
      RAISE NOTICE 'Created/Updated talent profile for: %', user_email;
    ELSE
      RAISE NOTICE 'Auth user not found for: %. Please create user in auth.users first.', user_email;
    END IF;
  END LOOP;
END $$;

-- Step 3: Verify the created talents
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  tmp.title as talent_title,
  tmp.hourly_rate,
  tmp.experience_level,
  tmp.rating,
  tmp.total_reviews,
  COUNT(tmg.id) as gig_count
FROM public.users u
LEFT JOIN public.talent_marketplace_profiles tmp ON u.id = tmp.user_id
LEFT JOIN public.talent_marketplace_gigs tmg ON u.id = tmg.user_id
WHERE u.email LIKE 'yussifabduljalil60%@gmail.com'
  AND u.role = 'talent'
GROUP BY u.id, u.email, u.name, u.role, tmp.title, tmp.hourly_rate, tmp.experience_level, tmp.rating, tmp.total_reviews
ORDER BY u.email;

-- ============================================================================
-- INSTRUCTIONS FOR CREATING USERS IN AUTH.USERS
-- ============================================================================
-- 
-- Option 1: Use Supabase Dashboard
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" for each email (605-614)
-- 3. Set email, password, and confirm email
-- 4. Then run this SQL script
--
-- Option 2: Use Supabase Admin API (Programmatic)
-- Use the Supabase Admin API to create users:
-- 
-- POST https://[your-project].supabase.co/auth/v1/admin/users
-- Headers:
--   Authorization: Bearer [your-service-role-key]
--   Content-Type: application/json
-- Body:
-- {
--   "email": "yussifabduljalil605@gmail.com",
--   "password": "[secure-password]",
--   "email_confirm": true,
--   "user_metadata": {
--     "name": "Sarah Johnson"
--   }
-- }
--
-- Repeat for emails 606-614, then run this SQL script.
--
-- Option 3: Use a script (see CREATE_TALENTS_VIA_API.js example below)
-- ============================================================================











