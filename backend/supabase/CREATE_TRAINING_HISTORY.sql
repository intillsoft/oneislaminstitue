-- Create Training Sessions Table
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_type TEXT NOT NULL, -- 'interview', 'roast', 'negotiation', 'skill_drill'
    score INTEGER,
    title TEXT, -- Optional title e.g. "Mock Interview: Frontend Dev"
    metadata JSONB DEFAULT '{}'::jsonb, -- Store transcripts, analysis, roasted_text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own training sessions"
    ON training_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training sessions"
    ON training_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own training sessions"
    ON training_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON training_sessions(user_id);
