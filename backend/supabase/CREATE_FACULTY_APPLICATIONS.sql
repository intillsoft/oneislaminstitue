-- Create Faculty Applications Table
CREATE TABLE IF NOT EXISTS faculty_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    specialization TEXT NOT NULL,
    motivation TEXT,
    experience TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE faculty_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (applicants)
CREATE POLICY "Enable insert for everyone" ON faculty_applications
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can view applications
-- Using the existing 'profiles' table role check if applicable
CREATE POLICY "Admins can view all applications" ON faculty_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy: Only admins can update applications
CREATE POLICY "Admins can update applications" ON faculty_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
