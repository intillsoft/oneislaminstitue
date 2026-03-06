-- Add unlock_week column to course_modules to support multiple modules per week
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS unlock_week INT DEFAULT 1;

-- Add index for performance on filtering by week
CREATE INDEX IF NOT EXISTS idx_course_modules_unlock_week ON course_modules(unlock_week);

-- Add course_id to course_lessons for flatter queries and better progress tracking
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;

-- Add index for course lessons
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
