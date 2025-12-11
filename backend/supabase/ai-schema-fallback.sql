-- Additional Schema for AI Services (Fallback - No pgvector)
-- Use this if pgvector extension is not available
-- This version uses JSONB instead of VECTOR type

-- Embeddings Cache for Job Matching (using JSONB instead of vector)
CREATE TABLE IF NOT EXISTS embeddings_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key TEXT UNIQUE NOT NULL,
    embedding JSONB, -- Array of floats [0.1, 0.2, ...] instead of vector type
    text_preview TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_embeddings_cache_key ON embeddings_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_embeddings_cache_expires ON embeddings_cache(expires_at);
-- GIN index for JSONB embedding searches
CREATE INDEX IF NOT EXISTS idx_embeddings_cache_embedding ON embeddings_cache USING gin(embedding);

-- Interview Questions Database
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT,
    question TEXT NOT NULL,
    type TEXT CHECK (type IN ('behavioral', 'technical', 'situational', 'cultural')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_company ON interview_questions(company);
CREATE INDEX IF NOT EXISTS idx_interview_questions_type ON interview_questions(type);
CREATE INDEX IF NOT EXISTS idx_interview_questions_difficulty ON interview_questions(difficulty);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL,
    metrics JSONB,
    suggestions TEXT[],
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created ON interview_sessions(created_at);

-- Salary Cache
CREATE TABLE IF NOT EXISTS salary_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_salary_cache_key ON salary_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_salary_cache_expires ON salary_cache(expires_at);

-- Salary Reports (User-submitted)
CREATE TABLE IF NOT EXISTS salary_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    location TEXT NOT NULL,
    salary INTEGER NOT NULL,
    experience_years INTEGER,
    company_size TEXT,
    industry TEXT,
    skills TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salary_reports_job_title ON salary_reports(job_title);
CREATE INDEX IF NOT EXISTS idx_salary_reports_location ON salary_reports(location);
CREATE INDEX IF NOT EXISTS idx_salary_reports_created ON salary_reports(created_at);

-- Career Analysis History
CREATE TABLE IF NOT EXISTS career_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_analyses_user_id ON career_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_career_analyses_created ON career_analyses(created_at);

-- RLS Policies for AI Tables
ALTER TABLE embeddings_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_analyses ENABLE ROW LEVEL SECURITY;

-- Embeddings Cache: Service role only
CREATE POLICY "Service role can manage embeddings"
    ON embeddings_cache FOR ALL
    USING (auth.role() = 'service_role');

-- Interview Questions: Public read, service role write
CREATE POLICY "Anyone can read interview questions"
    ON interview_questions FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage questions"
    ON interview_questions FOR ALL
    USING (auth.role() = 'service_role');

-- Interview Sessions: Users can manage own sessions
CREATE POLICY "Users can manage own interview sessions"
    ON interview_sessions FOR ALL
    USING (auth.uid() = user_id);

-- Salary Cache: Service role only
CREATE POLICY "Service role can manage salary cache"
    ON salary_cache FOR ALL
    USING (auth.role() = 'service_role');

-- Salary Reports: Users can create, service role can read
CREATE POLICY "Users can create salary reports"
    ON salary_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Service role can read salary reports"
    ON salary_reports FOR SELECT
    USING (auth.role() = 'service_role');

-- Career Analyses: Users can manage own analyses
CREATE POLICY "Users can manage own career analyses"
    ON career_analyses FOR ALL
    USING (auth.uid() = user_id);

