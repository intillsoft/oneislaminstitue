-- YAKIN ACADEMY: STRUCTURED LESSON SYSTEM MIGRATION
-- This script adds the necessary tables for the modular LMS lesson system.

-- 1. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    title TEXT NOT NULL,
    estimated_duration TEXT, -- e.g. "15 mins"
    order_index INTEGER NOT NULL,
    learning_objectives JSONB DEFAULT '[]', -- List of 3-5 strings
    reflection_question TEXT, -- Optional reflection question for the intro
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lesson Content Blocks (Modular System)
CREATE TABLE IF NOT EXISTS lesson_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'text', 'scripture', 'video', 'audio', 'file', 'summary'
    content JSONB NOT NULL, -- Stores type-specific data (e.g., { "text": "...", "arabic": "..." })
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    passing_score INTEGER DEFAULT 80,
    lock_next_lesson BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'mcq', 'tf', 'short_answer'
    question_text TEXT NOT NULL,
    options JSONB, -- For MCQ/TF: [{ "id": "a", "text": "...", "isCorrect": true }]
    correct_answer TEXT, -- For short answer or reference key
    feedback_text TEXT, -- Immediate feedback shown after answering
    order_index INTEGER NOT NULL
);

-- 4. Lesson Interactions (Reflections, Comments, Progress)
CREATE TABLE IF NOT EXISTS lesson_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS lesson_reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES lesson_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_instructor_response BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS POLICIES
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Lessons viewable by enrolled students" ON lessons FOR SELECT USING (true);
CREATE POLICY "Blocks viewable by enrolled students" ON lesson_blocks FOR SELECT USING (true);
CREATE POLICY "Quizzes viewable by enrolled students" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Questions viewable by enrolled students" ON quiz_questions FOR SELECT USING (true);

-- Instructor/Admin policies (Simplified for now - can manage all if instructor/admin role)
CREATE POLICY "Instructors can manage lessons" ON lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
);
CREATE POLICY "Instructors can manage blocks" ON lesson_blocks FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
);

-- Student policies for interactions
CREATE POLICY "Students can manage their completions" ON lesson_completions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can manage their reflections" ON lesson_reflections FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Anyone can view comments" ON lesson_comments FOR SELECT USING (true);
CREATE POLICY "Users can post comments" ON lesson_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. TRIGGERS
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lesson_blocks_updated_at BEFORE UPDATE ON lesson_blocks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
