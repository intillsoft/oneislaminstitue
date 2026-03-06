-- YAKIN ACADEMY: DATA POPULATION & SCHEMA COMPLETION
-- This script ensures a 'courses' table exists and populates it with 10 sample courses.

-- 1. Create Courses Table (Mirroring jobs but with correct terminology)
-- Note: We keep 'jobs' for compatibility but the UI will use 'courses'.
-- However, for the user's specific request, we create a 'courses' table if they prefer it.
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    curriculum TEXT,
    requirements JSONB DEFAULT '[]',
    learning_outcomes JSONB DEFAULT '[]',
    thumbnail_url TEXT,
    faculty TEXT,
    academic_level TEXT, -- Foundational, Intermediate, Advanced
    duration TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Populate Sample Data (10 Courses)
INSERT INTO courses (title, faculty, academic_level, duration, price, description, is_featured, thumbnail_url)
VALUES 
('Introduction to Aqidah', 'Theology', 'Foundational', '8 Weeks', 49.99, 'Exploring the pillars of faith and the core beliefs of Islam.', true, 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800'),
('Advanced Fiqh: Transactions', 'Jurisprudence', 'Advanced', '12 Weeks', 89.99, 'Detailed study of Islamic commercial law and modern financial ethics.', false, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800'),
('The Seerah: Prophetic Wisdom', 'History', 'Foundational', '10 Weeks', 0.00, 'Chronological study of the life of Prophet Muhammad (PBUH) and its modern applications.', true, 'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=800'),
('Arabic Language: Level 1', 'Linguistics', 'Foundational', '16 Weeks', 120.00, 'Comprehensive introduction to Quranic Arabic grammar and vocabulary.', false, 'https://images.unsplash.com/photo-1566121315132-d3a5ce93288d?q=80&w=800'),
('Sciences of the Quran', 'Quranic Studies', 'Intermediate', '8 Weeks', 59.99, 'Understanding the history of revelation, preservation, and interpretation of the Quran.', true, 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800'),
('Islamic Ethics in the Digital Age', 'Contemporary Studies', 'Intermediate', '6 Weeks', 39.99, 'Navigating the challenges of technology and social media through an Islamic lens.', false, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'),
('Hadith Methodology (Mustalah)', 'Hadith', 'Advanced', '10 Weeks', 75.00, 'Technical study of how Hadith are classified, authenticated, and preserved.', false, 'https://images.unsplash.com/photo-1506784911363-b295c517f694?q=80&w=800'),
('Spiritual Excellence (Ihsan)', 'Spirituality', 'Foundational', '8 Weeks', 0.00, 'A journey into the heart of Islamic spirituality and purification of the soul.', true, 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800'),
('Logic and Philosophy in Islam', 'Philosophy', 'Intermediate', '12 Weeks', 95.00, 'Exploring the interplay between reason and revelation in the Islamic tradition.', false, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800'),
('Islamic Leadership Principles', 'Management', 'Advanced', '6 Weeks', 150.00, 'Developing leadership skills based on the Quranic model and Prophetic examples.', true, 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800');

-- 3. Update Existing Jobs Table (to ensure compatibility if some parts still use it)
-- We'll add some courses there too.
INSERT INTO jobs (title, description, status, is_featured, academic_level, study_mode)
SELECT title, description, status, is_featured, academic_level, 'Virtual' FROM courses;
