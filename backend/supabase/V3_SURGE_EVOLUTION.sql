-- ============================================================================
-- V3 SURGE EVOLUTION: COMPLETE DATABASE SYNCHRONIZATION
-- ============================================================================
-- This script finalizes the database for Resume Generator V3, AI Agents, 
-- and Autopilot (Auto-Apply) systems.
-- ============================================================================

-- 1. AI AGENTS TABLE
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    goal TEXT DEFAULT 'find_jobs',
    job_criteria JSONB DEFAULT '{}',
    actions JSONB DEFAULT '{}',
    schedule JSONB DEFAULT '{"enabled": true, "frequency": "daily"}',
    intelligence JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'finished', 'error')),
    runs_count INTEGER DEFAULT 0,
    last_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. AUTO-APPLY SETTINGS TABLE (Refined for V3)
CREATE TABLE IF NOT EXISTS auto_apply_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    enabled BOOLEAN DEFAULT false,
    job_title_keywords TEXT[],
    skills_required TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT,
    remote_only BOOLEAN DEFAULT false,
    job_type TEXT[],
    experience_level TEXT[],
    company_size TEXT[],
    industry TEXT[],
    excluded_companies TEXT[],
    excluded_titles TEXT[],
    frequency TEXT DEFAULT 'continuous',
    check_interval_minutes INTEGER DEFAULT 15,
    max_applications_per_day INTEGER DEFAULT 10,
    use_ai_matching BOOLEAN DEFAULT true,
    min_match_score INTEGER DEFAULT 60,
    generate_cover_letter BOOLEAN DEFAULT true,
    notification_platform BOOLEAN DEFAULT true,
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    last_check_at TIMESTAMPTZ,
    last_auto_apply_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. AUTO-APPLY LOGS
CREATE TABLE IF NOT EXISTS auto_apply_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
    reason TEXT,
    match_score INTEGER,
    notification_sent BOOLEAN DEFAULT false,
    applied_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. USAGE TRACKING (For Feature Gating)
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, feature, period_start)
);

-- 5. RESUME UPDATES (V3 Enhancements)
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS ats_score INTEGER DEFAULT 0;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS ai_analysis JSONB DEFAULT '{}';

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_user_id ON auto_apply_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON usage_tracking(user_id, period_start);
CREATE INDEX IF NOT EXISTS idx_resumes_is_draft ON resumes(is_draft);

-- 7. RLS POLICIES (Fresh and Recursive-Safe)
-- Ensure RLS is enabled
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_apply_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_apply_logs ENABLE ROW LEVEL SECURITY;

-- AI Agents Policies
CREATE POLICY "Users can manage own agents" ON ai_agents
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-Apply Settings Policies
CREATE POLICY "Users can manage own settings" ON auto_apply_settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-Apply Logs Policies
CREATE POLICY "Users can view own logs" ON auto_apply_logs
    FOR SELECT USING (auth.uid() = user_id);

-- usage_tracking Policies
CREATE POLICY "Users can view own usage" ON usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- END OF V3 SURGE EVOLUTION
-- ============================================================================
