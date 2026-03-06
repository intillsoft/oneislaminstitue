-- ============================================================================
-- FIX MISSING CURRICULUM
-- Explicitly adds curriculum to the active course: 07ef050d-ca9c-423b-9bfc-8b04ae9f2b0e
-- ============================================================================

DO $$
DECLARE
  target_course_id UUID;
  module1_id UUID := uuid_generate_v4();
  module2_id UUID := uuid_generate_v4();
  module3_id UUID := uuid_generate_v4();
BEGIN
  -- 1. Target the specific course visible in browser
  -- 07ef050d-ca9c-423b-9bfc-8b04ae9f2b0e
  
  SELECT id INTO target_course_id FROM jobs 
  WHERE id = '07ef050d-ca9c-423b-9bfc-8b04ae9f2b0e';

  -- If not found (unlikely), try to attach to *any* job
  IF target_course_id IS NULL THEN
     SELECT id INTO target_course_id FROM jobs LIMIT 1;
  END IF;

  IF target_course_id IS NULL THEN
    RAISE NOTICE 'No jobs found at all.';
    RETURN;
  ELSIF (SELECT count(*) FROM course_modules WHERE course_id = target_course_id) > 0 THEN
    RAISE NOTICE 'Course % already has modules. Skipping.', target_course_id;
    RETURN;
  END IF;

  RAISE NOTICE 'Adding curriculum to course: %', target_course_id;

  -- 2. Create Modules
  INSERT INTO course_modules (id, course_id, title, description, sort_order)
  VALUES 
    (module1_id, target_course_id, 'Course Introduction', 'Overview and setup', 1),
    (module2_id, target_course_id, 'Core Concepts', 'Deep dive into fundamentals', 2),
    (module3_id, target_course_id, 'Capstone Project', 'Real-world application', 3);

  -- 3. Create Lessons
  INSERT INTO course_lessons (module_id, title, description, content_type, duration_minutes, sort_order, is_free_preview)
  VALUES
    (module1_id, 'Welcome & Overview', 'What you will learn', 'video', 5, 1, true),
    (module1_id, 'Setting Up Your Environment', 'Required tools installation', 'text', 15, 2, false),
    
    (module2_id, 'Key Principles', 'Theoretical foundations', 'video', 25, 1, false),
    (module2_id, 'Advanced Techniques', 'Expert level tips', 'video', 40, 2, false),
    (module2_id, 'Knowledge Check', 'Test understanding', 'quiz', 10, 3, false),

    (module3_id, 'Project Brief', 'Your assignment details', 'assignment', 5, 1, false),
    (module3_id, 'Submission Guidelines', 'How to submit', 'text', 5, 2, false);

END $$;
