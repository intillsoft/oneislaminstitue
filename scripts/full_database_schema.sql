-- ONE ISLAM INSTITUTE: COMPREHENSIVE DATABASE SCHEMA
-- This script defines all necessary tables, columns, and security policies for the academic platform.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Academic Departments (formerly Companies)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo TEXT,
    website TEXT,
    description TEXT,
    location TEXT,
    academic_focus TEXT, -- formerly industry
    foundation_year TEXT,
    subscription_tier TEXT DEFAULT 'foundational',
    subscription_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles / Users (Extending auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student', -- student, instructor, scholar, admin
    academic_field TEXT, -- formerly industry
    bio TEXT,
    enrolled_courses_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses (formerly Jobs)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    curriculum TEXT, -- formerly description details
    requirements JSONB DEFAULT '[]',
    learning_outcomes JSONB DEFAULT '[]', -- formerly benefits
    study_mode TEXT, -- formerly employment_type (On-Site, Virtual, etc.)
    academic_level TEXT, -- formerly experience_level (Foundational, etc.)
    study_plan_tier TEXT, -- formerly salary_range (Foundational Plan, Intensive Plan, etc.)
    location TEXT,
    status TEXT DEFAULT 'draft', -- draft, published, archived
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Enrollments (formerly Applications)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, active, completed, dropped
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    completion_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS)

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Companies (Departments)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departments are viewable by everyone" 
ON companies FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their own departments" 
ON companies FOR ALL USING (auth.uid() = user_id);

-- Jobs (Courses)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone" 
ON jobs FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage their own courses" 
ON jobs FOR ALL USING (auth.uid() = instructor_id);

-- Enrollments
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own enrollments" 
ON applications FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view enrollments for their courses" 
ON applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM jobs 
        WHERE jobs.id = applications.course_id 
        AND jobs.instructor_id = auth.uid()
    )
);

CREATE POLICY "Students can enroll themselves" 
ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 4. FUNCTIONS & TRIGGERS

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
