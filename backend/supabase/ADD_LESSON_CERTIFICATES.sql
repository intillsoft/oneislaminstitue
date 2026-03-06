-- Add lesson_id to certificate_templates to support lesson-level certificates
ALTER TABLE certificate_templates ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE;

-- Update unique constraint to allow one template per course AND one per lesson
ALTER TABLE certificate_templates DROP CONSTRAINT IF EXISTS certificate_templates_course_id_key;
ALTER TABLE certificate_templates ADD CONSTRAINT certificate_templates_scope_unique UNIQUE (course_id, lesson_id);

-- Add lesson_id to certificates table to track which lesson a certificate belongs to
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE;

-- Ensure uniqueness for certificates: one per user per (course, lesson)
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_user_id_course_id_lesson_id_key;
ALTER TABLE certificates ADD CONSTRAINT certificates_user_id_course_id_lesson_id_key UNIQUE (user_id, course_id, lesson_id);
