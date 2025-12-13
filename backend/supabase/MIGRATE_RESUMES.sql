-- SAFE MIGRATION: UPDATE RESUMES TABLE
-- Run this in Supabase SQL Editor

-- 1. Add missing columns safely
DO $$ 
BEGIN
    -- Add visibility column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'visibility') THEN
        ALTER TABLE public.resumes ADD COLUMN visibility VARCHAR(20) DEFAULT 'private';
        ALTER TABLE public.resumes ADD CONSTRAINT check_visibility CHECK (visibility IN ('private', 'public', 'recruiter'));
    END IF;

    -- Add template_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'template_id') THEN
        ALTER TABLE public.resumes ADD COLUMN template_id VARCHAR(50) DEFAULT 'modern';
    END IF;

    -- Add is_default
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'is_default') THEN
        ALTER TABLE public.resumes ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add is_draft
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'is_draft') THEN
        ALTER TABLE public.resumes ADD COLUMN is_draft BOOLEAN DEFAULT TRUE;
    END IF;

    -- Add ats_score
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'ats_score') THEN
        ALTER TABLE public.resumes ADD COLUMN ats_score INTEGER DEFAULT 0;
    END IF;

    -- Add completeness_score
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'completeness_score') THEN
        ALTER TABLE public.resumes ADD COLUMN completeness_score INTEGER DEFAULT 0;
    END IF;

    -- Add keywords
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'keywords') THEN
        ALTER TABLE public.resumes ADD COLUMN keywords TEXT[] DEFAULT '{}';
    END IF;

    -- Add last_viewed_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'last_viewed_at') THEN
        ALTER TABLE public.resumes ADD COLUMN last_viewed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 2. Create related tables if they don't exist
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    content_json JSONB NOT NULL,
    version_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resume_job_matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_id TEXT,
    job_description TEXT,
    match_score INTEGER,
    missing_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on new tables
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_job_matches ENABLE ROW LEVEL SECURITY;

-- 4. Create policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resumes' AND policyname = 'Users can view own resumes') THEN
        CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resumes' AND policyname = 'Users can insert own resumes') THEN
        CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resumes' AND policyname = 'Users can update own resumes') THEN
        CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resumes' AND policyname = 'Users can delete own resumes') THEN
        CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
