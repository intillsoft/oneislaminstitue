-- ============================================================================
-- INSERT SAMPLE CURRICULUM
-- Adds sample modules and lessons to the active course so the UI appears
-- ============================================================================

-- Target Course ID (from user's browser)
-- You can also use a specific UUID if known
DO $$
DECLARE
  target_course_id UUID;
  module1_id UUID := uuid_generate_v4();
  module2_id UUID := uuid_generate_v4();
  module3_id UUID := uuid_generate_v4();
BEGIN
  -- Try to get the specific course user is looking at, or fallback to any course
  SELECT id INTO target_course_id FROM jobs 
  WHERE id = '4d3168be-4ab5-4f4c-83bc-bb02ac134fa3'
  LIMIT 1;

  -- If not found, just pick the most recent one
  IF target_course_id IS NULL THEN
    SELECT id INTO target_course_id FROM jobs ORDER BY created_at DESC LIMIT 1;
  END IF;

  -- If still no course, exit
  IF target_course_id IS NULL THEN
    RAISE NOTICE 'No courses found to attach curriculum to.';
    RETURN;
  END IF;

  RAISE NOTICE 'Adding curriculum to course: %', target_course_id;

  -- 1. Create Modules
  INSERT INTO course_modules (id, course_id, title, description, sort_order)
  VALUES 
    (module1_id, target_course_id, 'Introduction & Fundamentals', 'Core concepts and getting started', 1),
    (module2_id, target_course_id, 'Advanced Techniques', 'Deep dive into complex topics', 2),
    (module3_id, target_course_id, 'Final Project & Capstone', 'Applying what you learned', 3);

  -- 2. Create Lessons for Module 1
  INSERT INTO course_lessons (module_id, title, description, content_type, duration_minutes, sort_order, is_free_preview)
  VALUES
    (module1_id, 'Welcome to the Course', 'Course overview and objectives', 'video', 5, 1, true),
    (module1_id, 'Setting Up Your Environment', 'Tools and installation guide', 'text', 15, 2, false),
    (module1_id, 'Core Principles', 'Foundational theory', 'video', 20, 3, true),
    (module1_id, 'First Assignment', 'Test your knowledge', 'assignment', 45, 4, false);

  -- 3. Create Lessons for Module 2
  INSERT INTO course_lessons (module_id, title, description, content_type, duration_minutes, sort_order, is_free_preview)
  VALUES
    (module2_id, 'Advanced Strategy', 'Mastering the details', 'video', 30, 1, false),
    (module2_id, 'Case Studies', 'Real-world examples', 'text', 20, 2, false),
    (module2_id, 'Mid-term Quiz', 'Knowledge check', 'quiz', 15, 3, false);

  -- 4. Create Lessons for Module 3
  INSERT INTO course_lessons (module_id, title, description, content_type, duration_minutes, sort_order, is_free_preview)
  VALUES
    (module3_id, 'Project Brief', 'Guidelines for final project', 'video', 10, 1, false),
    (module3_id, 'Submission Guide', 'How to submit your work', 'text', 5, 2, false);

END $$;
