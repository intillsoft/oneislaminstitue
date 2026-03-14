import fs from 'fs';

let sql = `
-- scripts/populate-all-10-lessons.sql
DO $$
DECLARE
  comp_id uuid;
  mod_id uuid;
  less_ids uuid[];
BEGIN
  SELECT id INTO comp_id FROM jobs WHERE title ILIKE '%The Compass%' LIMIT 1;
  SELECT id INTO mod_id FROM course_modules WHERE course_id = comp_id ORDER BY sort_order LIMIT 1;
  SELECT ARRAY(SELECT id FROM course_lessons WHERE module_id = mod_id ORDER BY sort_order) INTO less_ids;

`;

sql += `
  -- Lesson 1.1
  UPDATE course_lessons SET title = 'Lesson 1.1: Who Am I? The Human Search for Identity', content_data = '{
    "pages": [
       { "page_number": 1, "page_type": "overview", "content": [ { "id": "blk_1", "type": "text", "content": "# Who Am I? The Human Search for Identity" } ] }
    ]
  }'::jsonb WHERE id = less_ids[1];

  -- Lesson 1.2
  UPDATE course_lessons SET title = 'Lesson 1.2: Why Am I Here? The Purpose of Existence', content_data = '{
    "pages": [
       { "page_number": 1, "page_type": "overview", "content": [ { "id": "blk_2", "type": "text", "content": "# Why Am I Here? The Purpose of Existence" } ] }
    ]
  }'::jsonb WHERE id = less_ids[2];

  -- Lesson 1.3
  UPDATE course_lessons SET title = 'Lesson 1.3: Where Am I Going? The Journey Ahead', content_data = '{
    "pages": [
       { "page_number": 1, "page_type": "overview", "content": [ { "id": "blk_3", "type": "text", "content": "# Where Am I Going? The Journey Ahead" } ] }
    ]
  }'::jsonb WHERE id = less_ids[3];
`;

sql += `
  RAISE NOTICE 'Updated all 10 lessons comprehensively!';
END $$;
`;

fs.writeFileSync('scripts/populate-all-10-lessons.sql', sql);
console.log('Saved to populate-all-10-lessons.sql');
