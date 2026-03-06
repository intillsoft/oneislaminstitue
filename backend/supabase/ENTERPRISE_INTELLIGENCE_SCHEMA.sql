-- ============================================================================
-- ENTERPRISE INTELLIGENCE SCHEMA
-- Enables Semantic Search and AI-Powered Matching
-- ============================================================================

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding columns to core tables
-- Using 1536 dimensions for OpenAI text-embedding-3-small
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE users ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Create Embeddings Cache for performance and cost saving
CREATE TABLE IF NOT EXISTS embeddings_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key TEXT UNIQUE NOT NULL, -- usually a hash of the content
    embedding vector(1536) NOT NULL,
    model TEXT NOT NULL DEFAULT 'text-embedding-3-small',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- 4. Create Indexes for Vector Search (HNSW for high performance at scale)
-- Note: HNSW is better for high-scale enterprise apps than IVF
CREATE INDEX IF NOT EXISTS idx_jobs_embedding ON jobs USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_users_embedding ON users USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_embeddings_cache_key ON embeddings_cache(cache_key);

-- 5. Helper Function for Job Matching
CREATE OR REPLACE FUNCTION match_jobs(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company TEXT,
    location TEXT,
    salary TEXT,
    description TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        jobs.id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.salary,
        jobs.description,
        1 - (jobs.embedding <=> query_embedding) AS similarity
    FROM jobs
    WHERE 1 - (jobs.embedding <=> query_embedding) > match_threshold
    ORDER BY jobs.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 6. Helper Function for Talent Matching
CREATE OR REPLACE FUNCTION match_talent(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    location TEXT,
    bio TEXT,
    role TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        users.id,
        users.name,
        users.email,
        users.location,
        users.bio,
        users.role,
        1 - (users.embedding <=> query_embedding) AS similarity
    FROM users
    WHERE users.role = 'job-seeker'
    AND 1 - (users.embedding <=> query_embedding) > match_threshold
    ORDER BY users.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
