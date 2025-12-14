-- ============================================================================
-- FIXED SQL SCRIPT TO CREATE 10 FEATURED TALENT USERS
-- ============================================================================
-- Email format: yussifabduljalil605@gmail.com through yussifabduljalil614@gmail.com
-- All users will have 'talent' role and full access to talent features
--
-- IMPORTANT: Users must be created via Supabase Auth API first
-- Then run this SQL script to set up their profiles
-- ============================================================================
-- Fixed: Uses correct table names: 'talents' and 'gigs' (not talent_marketplace_profiles/gigs)
-- ============================================================================

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
  talent_id_var UUID;
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
      
      -- Create talent profile (using 'talents' table, not 'talent_marketplace_profiles')
      INSERT INTO public.talents (
        user_id,
        title,
        bio,
        hourly_rate,
        skills,
        experience_level,
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
        updated_at = NOW()
      RETURNING id INTO talent_id_var;
      
      -- Get talent_id if it was updated
      IF talent_id_var IS NULL THEN
        SELECT id INTO talent_id_var
        FROM public.talents
        WHERE user_id = auth_user_id
        LIMIT 1;
      END IF;
      
      -- Create sample gig for each talent (using 'gigs' table, not 'talent_marketplace_gigs')
      IF talent_id_var IS NOT NULL THEN
        INSERT INTO public.gigs (
          talent_id,
          title,
          description,
          price,
          delivery_time,
          category,
          tags,
          is_active,
          rating,
          total_orders,
          created_at,
          updated_at
        )
        VALUES (
          talent_id_var,
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
          talent_skills[idx], -- Use skills as tags
          true,
          4.5 + (RANDOM() * 0.5)::DECIMAL(3, 2),
          (5 + (RANDOM() * 20))::INTEGER,
          NOW(),
          NOW()
        )
        ON CONFLICT DO NOTHING; -- Skip if gig already exists
      END IF;
      
      RAISE NOTICE 'Created/Updated talent profile for: %', user_email;
    ELSE
      RAISE NOTICE 'Auth user not found for: %. Please create user in auth.users first.', user_email;
    END IF;
  END LOOP;
END $$;

-- Verify the created talents
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  t.title as talent_title,
  t.hourly_rate,
  t.experience_level,
  t.rating,
  t.total_reviews,
  COUNT(g.id) as gig_count
FROM public.users u
LEFT JOIN public.talents t ON u.id = t.user_id
LEFT JOIN public.gigs g ON t.id = g.talent_id
WHERE u.email LIKE 'yussifabduljalil60%@gmail.com'
  AND u.role = 'talent'
GROUP BY u.id, u.email, u.name, u.role, t.title, t.hourly_rate, t.experience_level, t.rating, t.total_reviews
ORDER BY u.email;












