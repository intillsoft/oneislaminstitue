-- ==========================================
-- ONE ISLAM INSTITUTE: CORE SCHEMAS
-- Features: Faculty, Donations, Bookmarks
-- ==========================================

-- 1. Faculty Applications Table
CREATE TABLE IF NOT EXISTS faculty_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    specialization TEXT NOT NULL,
    motivation TEXT,
    experience TEXT, -- academic, teacher, researcher, creative
    status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Donations & Impact Table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    type TEXT NOT NULL, -- 'one-time', 'monthly'
    title TEXT, -- e.g., 'Sponsor a Seeker', 'Resource Research'
    status TEXT DEFAULT 'completed',
    transaction_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Saved Courses (Bookmarks) Table
CREATE TABLE IF NOT EXISTS saved_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES jobs(id) ON DELETE CASCADE, -- Linking to your courses (jobs) table
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, course_id)
);

-- ==========================================
-- RLS POLICIES (Security)
-- ==========================================

-- Enable Row Level Security
ALTER TABLE faculty_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_courses ENABLE ROW LEVEL SECURITY;

-- Faculty Applications: Anyone can apply, only admins can view
CREATE POLICY "Public can submit applications" ON faculty_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view applications" ON faculty_applications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Donations: Users view their own, anyone can insert (public donation)
CREATE POLICY "Users view own donations" ON donations FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
CREATE POLICY "Public can submit donations" ON donations FOR INSERT WITH CHECK (true);

-- Saved Courses: Users manage their own
CREATE POLICY "Users manage own bookmarks" ON saved_courses 
  FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- INDEXES (Performance)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_courses_user ON saved_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty_applications(status);
