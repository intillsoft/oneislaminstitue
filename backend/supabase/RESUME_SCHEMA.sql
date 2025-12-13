-- COMPREHENSIVE RESUME & TALENT SCHEMA
-- Run this in Supabase SQL Editor

-- 1. Create Resumes Table with Versioning Support
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
    
    -- Core Content (JSONB for flexibility)
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Metadata
    template_id VARCHAR(50) DEFAULT 'modern',
    is_default BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN DEFAULT TRUE,
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'recruiter')),
    
    -- Analytics & AI
    ats_score INTEGER DEFAULT 0,
    completeness_score INTEGER DEFAULT 0,
    keywords TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Resume Versions (History)
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    content_json JSONB NOT NULL,
    version_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Job Matches (Tailoring)
CREATE TABLE IF NOT EXISTS public.resume_job_matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_id TEXT, -- External or internal job ID
    job_description TEXT,
    match_score INTEGER,
    missing_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_job_matches ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Users can view own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Recruiter Access Policy (Placeholder for now)
CREATE POLICY "Recruiters can view public resumes" ON public.resumes
    FOR SELECT USING (visibility = 'public' OR visibility = 'recruiter');

-- 6. Storage Bucket for Resume Exports (PDFs)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND auth.uid() = owner);

-- 7. Add Functions for Updating Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
