-- ONE ISLAM INSTITUTE: FINAL LESSON & STATUS FIX
-- Run this script in the Supabase SQL Editor to populate lessons and show courses.

-- 1. Ensure all courses are published so they appear in the UI
UPDATE jobs SET status = 'published';

-- 2. Clear old lessons to prevent duplication
DELETE FROM lesson_blocks;
DELETE FROM lessons;

-- 3. Populate 10 lessons for each course
DO $$
DECLARE
    course_record RECORD;
    lesson_id UUID;
    i INTEGER;
BEGIN
    FOR course_record IN SELECT id FROM jobs LOOP
        FOR i IN 1..10 LOOP
            -- Create the lesson
            INSERT INTO lessons (course_id, module_name, title, estimated_duration, order_index, learning_objectives, is_published)
            VALUES (
                course_record.id,
                'Foundations',
                'Lesson ' || i || ': Sacred Wisdom and Practice',
                '15 mins',
                i,
                '["Core concepts", "Practical application", "Ethical considerations"]'::jsonb,
                true
            )
            RETURNING id INTO lesson_id;

            -- Add introductory text block
            INSERT INTO lesson_blocks (lesson_id, type, content, order_index)
            VALUES (
                lesson_id,
                'text',
                jsonb_build_object('text', 'Welcome to Lesson ' || i || '. This module explores the deep connection between theory and practice in Islamic scholarship.'),
                1
            );

            -- Add scripture/wisdom block
            INSERT INTO lesson_blocks (lesson_id, type, content, order_index)
            VALUES (
                lesson_id,
                'scripture',
                jsonb_build_object('arabic', 'إنما الأعمال بالنيات', 'translation', 'Actions are but by intentions'),
                2
            );

            -- Add video placeholder
            INSERT INTO lesson_blocks (lesson_id, type, content, order_index)
            VALUES (
                lesson_id,
                'video',
                jsonb_build_object('url', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'title', 'Session Overview'),
                3
            );
        END LOOP;
    END LOOP;
END $$;
