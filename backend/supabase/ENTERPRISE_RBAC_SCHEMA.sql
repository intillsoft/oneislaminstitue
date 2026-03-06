-- ENTERPRISE RBAC & AUDIT LOGGING SCHEMA
-- Phase 12 Extension: Security & Compliance Foundations

-- 1. Permissions Definition
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- e.g., 'jobs', 'users', 'billing'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Role Permissions Mapping
-- We use a mapping instead of hardcoded roles to allow future custom roles
CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(50) NOT NULL, -- matches user.role (e.g., 'admin', 'recruiter', 'job-seeker')
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- 3. Enterprise Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    subscription_tier VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Team Members & Granular Roles
CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'admin', 'member', 'billing'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- 5. Audit Logging (Enterprise Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL, -- e.g., 'job_posted', 'user_invited', 'api_key_generated'
    resource_type VARCHAR(50), -- e.g., 'jobs', 'teams', 'api_keys'
    resource_id UUID,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
-- Permissions/Role Map: Read-only for authenticated users
CREATE POLICY "Allow read for authenticated" ON permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated" ON role_permissions FOR SELECT TO authenticated USING (true);

-- Team Policies: Members can see their teams
CREATE POLICY "Users can view their team memberships" ON team_members
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their teams" ON teams
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM team_members 
            WHERE team_id = teams.id AND user_id = auth.uid()
        )
    );

-- Audit Logs: Only visible to admins or the user themselves (for their own logs)
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Initial Permissions Seed Logic
INSERT INTO permissions (slug, name, description, category) VALUES
('jobs:write', 'Create & Edit Jobs', 'Allows posting and managing job listings', 'jobs'),
('jobs:read', 'View Jobs', 'Allows viewing job details (standard for all)', 'jobs'),
('talent:read', 'Search Talent', 'Allows searching the talent marketplace', 'talent'),
('team:invite', 'Invite Members', 'Allows inviting users to an enterprise team', 'teams'),
('billing:manage', 'Manage Billing', 'Allows updating payment methods and subscriptions', 'billing'),
('api_keys:manage', 'Manage API Keys', 'Allows generating and revoking enterprise API keys', 'api');

-- Map to default roles
-- Admin: Everything
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions;

-- Recruiter: Jobs and Talent
INSERT INTO role_permissions (role, permission_id)
SELECT 'recruiter', id FROM permissions WHERE category IN ('jobs', 'talent', 'api');

-- Job Seeker: Standard Read
INSERT INTO role_permissions (role, permission_id)
SELECT 'job-seeker', id FROM permissions WHERE slug IN ('jobs:read');
