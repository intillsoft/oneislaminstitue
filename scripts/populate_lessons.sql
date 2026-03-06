-- Create populated_lessons.sql
-- Add 10 lessons to each existing course with content blocks

DO $$
DECLARE
    course_record RECORD;
    lesson_id UUID;
    i INTEGER;
    j INTEGER;
BEGIN
    FOR course_record IN SELECT id FROM jobs LOOP
        FOR i IN 1..10 LOOP
            -- Create the lesson
            INSERT INTO lessons (course_id, module_name, title, estimated_duration, order_index, learning_objectives, is_published)
            VALUES (
                course_record.id,
                'Foundations',
                'Lesson ' || i || ': Introduction to Sacred Knowledge',
                '20 mins',
                i,
                '["Understand the context", "Apply principles", "Reflect on wisdom"]'::jsonb,
                true
            )
            RETURNING id INTO lesson_id;

            -- Add a text block
            INSERT INTO lesson_blocks (lesson_id, type, content, order_index)
            VALUES (
                lesson_id,
                'text',
                jsonb_build_object('text', 'In this lesson, we will explore the foundational principles of the subject. It is essential to approach this with an open heart and mind.'),
                1
            );

            -- Add a scripture block
            INSERT INTO lesson_blocks (lesson_id, type, content, order_index)
            VALUES (
                lesson_id,
                'scripture',
                jsonb_build_object('arabic', 'إقرأ باسم ربك الذي خلق', 'translation', 'Read in the name of your Lord who created'),
                2
            );
        END LOOP;
    END LOOP;
END $$;
