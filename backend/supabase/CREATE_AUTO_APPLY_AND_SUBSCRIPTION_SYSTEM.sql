-- ============================================================================
-- WORKFLOW - AUTO-APPLY & SUBSCRIPTION SYSTEM
-- Complete database schema for job auto-apply automation and subscription management
-- ============================================================================

-- ============================================================================
-- PART 1: AUTO-APPLY TABLES
-- ============================================================================

-- Auto-Apply Settings Table
CREATE TABLE IF NOT EXISTS auto_apply_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT false,
    job_title_keywords TEXT[] DEFAULT '{}',
    skills_required TEXT[] DEFAULT '{}',
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT,
    remote_only BOOLEAN DEFAULT false,
    job_type TEXT[] DEFAULT '{}', -- full-time, part-time, contract, freelance
    experience_level TEXT[] DEFAULT '{}', -- entry, mid, senior
    company_size TEXT[] DEFAULT '{}', -- 1-10, 11-50, 51-200, 201-500, 501-1000, 1001+
    industry TEXT[] DEFAULT '{}',
    excluded_companies TEXT[] DEFAULT '{}',
    excluded_titles TEXT[] DEFAULT '{}',
    frequency TEXT DEFAULT 'daily', -- daily, every_2_days, weekly, custom
    custom_schedule TEXT, -- cron format
    max_applications_per_day INTEGER DEFAULT 10,
    notification_platform BOOLEAN DEFAULT true,
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    last_auto_apply_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Auto-Apply Logs Table
CREATE TABLE IF NOT EXISTS auto_apply_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'success', -- success, failed, skipped
    reason TEXT,
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PART 2: NOTIFICATION TABLES
-- ============================================================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- job_applied, application_accepted, application_rejected, new_job_match, message_received, profile_viewed, subscription_expiring, payment_failed, new_review
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- emoji or icon name
    action_url TEXT,
    action_label TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    all_notifications_enabled BOOLEAN DEFAULT true,
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '08:00',
    frequency TEXT DEFAULT 'real-time', -- real-time, hourly, daily, weekly
    
    -- Job Applied Notifications
    job_applied_platform BOOLEAN DEFAULT true,
    job_applied_email BOOLEAN DEFAULT true,
    job_applied_sms BOOLEAN DEFAULT false,
    
    -- Application Status Notifications
    application_status_platform BOOLEAN DEFAULT true,
    application_status_email BOOLEAN DEFAULT true,
    application_status_sms BOOLEAN DEFAULT false,
    
    -- New Job Match Notifications
    new_job_match_platform BOOLEAN DEFAULT true,
    new_job_match_email BOOLEAN DEFAULT true,
    new_job_match_sms BOOLEAN DEFAULT false,
    
    -- Message Notifications
    message_received_platform BOOLEAN DEFAULT true,
    message_received_email BOOLEAN DEFAULT true,
    message_received_sms BOOLEAN DEFAULT false,
    
    -- Profile Interaction Notifications
    profile_viewed_platform BOOLEAN DEFAULT true,
    profile_viewed_email BOOLEAN DEFAULT false,
    profile_viewed_sms BOOLEAN DEFAULT false,
    
    -- Subscription Notifications
    subscription_expiring_platform BOOLEAN DEFAULT true,
    subscription_expiring_email BOOLEAN DEFAULT true,
    subscription_expiring_sms BOOLEAN DEFAULT false,
    
    -- Payment Notifications
    payment_failed_platform BOOLEAN DEFAULT true,
    payment_failed_email BOOLEAN DEFAULT true,
    payment_failed_sms BOOLEAN DEFAULT true,
    
    -- Review Notifications
    new_review_platform BOOLEAN DEFAULT true,
    new_review_email BOOLEAN DEFAULT true,
    new_review_sms BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- PART 3: SUBSCRIPTION TABLES
-- ============================================================================

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- free, professional, premium, recruiter, admin
    display_name TEXT NOT NULL,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    features JSONB DEFAULT '[]',
    auto_apply_limit INTEGER DEFAULT 0, -- -1 for unlimited
    manual_apply_limit INTEGER DEFAULT 0, -- -1 for unlimited
    job_post_limit INTEGER DEFAULT 0, -- -1 for unlimited
    resume_limit INTEGER DEFAULT 1,
    support_level TEXT DEFAULT 'none', -- none, email, priority
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, expired, pending
    billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    payment_method_id TEXT,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Subscription Usage Table
CREATE TABLE IF NOT EXISTS subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    auto_apply_count INTEGER DEFAULT 0,
    manual_apply_count INTEGER DEFAULT 0,
    job_post_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- PART 4: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Auto-Apply Indexes
CREATE INDEX IF NOT EXISTS idx_auto_apply_settings_user_id ON auto_apply_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_settings_enabled ON auto_apply_settings(enabled);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_user_id ON auto_apply_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_job_id ON auto_apply_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_applied_at ON auto_apply_logs(applied_at);

-- Notification Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Subscription Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON subscription_usage(user_id);

-- ============================================================================
-- PART 5: INSERT DEFAULT SUBSCRIPTION PLANS
-- ============================================================================

-- Free Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'free',
    'Free',
    0.00,
    0.00,
    'Perfect for job seekers testing the platform',
    '["Browse jobs (limited to 50/day)", "Apply to jobs manually (5/day)", "View 3 job details per day", "Basic profile", "Platform notifications only"]'::jsonb,
    0,
    5,
    0,
    1,
    'none'
) ON CONFLICT (name) DO NOTHING;

-- Professional Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'professional',
    'Professional',
    9.99,
    99.00,
    'For active job seekers',
    '["Browse unlimited jobs", "Apply to jobs manually (unlimited)", "Auto-apply to jobs (20/day)", "Advanced job filters", "Saved job searches", "Email notifications", "SMS notifications", "Resume management (3 resumes)", "Profile analytics", "Email support"]'::jsonb,
    20,
    -1,
    0,
    3,
    'email'
) ON CONFLICT (name) DO NOTHING;

-- Premium Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'premium',
    'Premium',
    19.99,
    199.00,
    'For serious job seekers',
    '["All Professional features", "Auto-apply to jobs (unlimited)", "Advanced AI job matching", "Priority support (24/7)", "Resume optimization AI", "Interview prep resources", "Salary negotiation guide", "Resume management (unlimited)", "Profile analytics (advanced)", "Job alerts (real-time)", "Networking features"]'::jsonb,
    -1,
    -1,
    0,
    -1,
    'priority'
) ON CONFLICT (name) DO NOTHING;

-- Recruiter Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'recruiter',
    'Recruiter',
    49.99,
    499.00,
    'For recruiters & HR teams',
    '["Post unlimited jobs", "Manage unlimited applicants", "Advanced applicant filtering", "Bulk messaging", "Candidate database", "Analytics & reports", "Team collaboration (up to 5 members)", "Email support", "Custom branding"]'::jsonb,
    0,
    0,
    -1,
    0,
    'email'
) ON CONFLICT (name) DO NOTHING;

-- Admin Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'admin',
    'Admin',
    0.00,
    0.00,
    'For platform administrators',
    '["All platform features", "Admin dashboard", "User management", "Platform analytics", "Content moderation", "System settings", "Reports & insights"]'::jsonb,
    -1,
    -1,
    -1,
    -1,
    'priority'
) ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PART 6: TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_auto_apply_settings_updated_at ON auto_apply_settings;
CREATE TRIGGER update_auto_apply_settings_updated_at
    BEFORE UPDATE ON auto_apply_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_usage_updated_at ON subscription_usage;
CREATE TRIGGER update_subscription_usage_updated_at
    BEFORE UPDATE ON subscription_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 7: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE auto_apply_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_apply_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Auto-Apply Settings Policies
DROP POLICY IF EXISTS "Users can view their own auto-apply settings" ON auto_apply_settings;
CREATE POLICY "Users can view their own auto-apply settings"
    ON auto_apply_settings FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own auto-apply settings" ON auto_apply_settings;
CREATE POLICY "Users can insert their own auto-apply settings"
    ON auto_apply_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own auto-apply settings" ON auto_apply_settings;
CREATE POLICY "Users can update their own auto-apply settings"
    ON auto_apply_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Auto-Apply Logs Policies
DROP POLICY IF EXISTS "Users can view their own auto-apply logs" ON auto_apply_logs;
CREATE POLICY "Users can view their own auto-apply logs"
    ON auto_apply_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Notification Preferences Policies
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON notification_preferences;
CREATE POLICY "Users can view their own notification preferences"
    ON notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON notification_preferences;
CREATE POLICY "Users can insert their own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON notification_preferences;
CREATE POLICY "Users can update their own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Subscription Plans Policies (public read)
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON subscription_plans;
CREATE POLICY "Anyone can view subscription plans"
    ON subscription_plans FOR SELECT
    USING (true);

-- User Subscriptions Policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Subscription Usage Policies
DROP POLICY IF EXISTS "Users can view their own subscription usage" ON subscription_usage;
CREATE POLICY "Users can view their own subscription usage"
    ON subscription_usage FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- PART 8: INITIALIZE DEFAULT NOTIFICATION PREFERENCES FOR EXISTING USERS
-- ============================================================================

-- This will be handled by the backend service when users first access notification settings

-- ============================================================================
-- COMPLETE!
-- ============================================================================


-- Complete database schema for job auto-apply automation and subscription management
-- ============================================================================

-- ============================================================================
-- PART 1: AUTO-APPLY TABLES
-- ============================================================================

-- Auto-Apply Settings Table
CREATE TABLE IF NOT EXISTS auto_apply_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT false,
    job_title_keywords TEXT[] DEFAULT '{}',
    skills_required TEXT[] DEFAULT '{}',
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT,
    remote_only BOOLEAN DEFAULT false,
    job_type TEXT[] DEFAULT '{}', -- full-time, part-time, contract, freelance
    experience_level TEXT[] DEFAULT '{}', -- entry, mid, senior
    company_size TEXT[] DEFAULT '{}', -- 1-10, 11-50, 51-200, 201-500, 501-1000, 1001+
    industry TEXT[] DEFAULT '{}',
    excluded_companies TEXT[] DEFAULT '{}',
    excluded_titles TEXT[] DEFAULT '{}',
    frequency TEXT DEFAULT 'daily', -- daily, every_2_days, weekly, custom
    custom_schedule TEXT, -- cron format
    max_applications_per_day INTEGER DEFAULT 10,
    notification_platform BOOLEAN DEFAULT true,
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    last_auto_apply_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Auto-Apply Logs Table
CREATE TABLE IF NOT EXISTS auto_apply_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'success', -- success, failed, skipped
    reason TEXT,
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PART 2: NOTIFICATION TABLES
-- ============================================================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- job_applied, application_accepted, application_rejected, new_job_match, message_received, profile_viewed, subscription_expiring, payment_failed, new_review
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- emoji or icon name
    action_url TEXT,
    action_label TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    all_notifications_enabled BOOLEAN DEFAULT true,
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '08:00',
    frequency TEXT DEFAULT 'real-time', -- real-time, hourly, daily, weekly
    
    -- Job Applied Notifications
    job_applied_platform BOOLEAN DEFAULT true,
    job_applied_email BOOLEAN DEFAULT true,
    job_applied_sms BOOLEAN DEFAULT false,
    
    -- Application Status Notifications
    application_status_platform BOOLEAN DEFAULT true,
    application_status_email BOOLEAN DEFAULT true,
    application_status_sms BOOLEAN DEFAULT false,
    
    -- New Job Match Notifications
    new_job_match_platform BOOLEAN DEFAULT true,
    new_job_match_email BOOLEAN DEFAULT true,
    new_job_match_sms BOOLEAN DEFAULT false,
    
    -- Message Notifications
    message_received_platform BOOLEAN DEFAULT true,
    message_received_email BOOLEAN DEFAULT true,
    message_received_sms BOOLEAN DEFAULT false,
    
    -- Profile Interaction Notifications
    profile_viewed_platform BOOLEAN DEFAULT true,
    profile_viewed_email BOOLEAN DEFAULT false,
    profile_viewed_sms BOOLEAN DEFAULT false,
    
    -- Subscription Notifications
    subscription_expiring_platform BOOLEAN DEFAULT true,
    subscription_expiring_email BOOLEAN DEFAULT true,
    subscription_expiring_sms BOOLEAN DEFAULT false,
    
    -- Payment Notifications
    payment_failed_platform BOOLEAN DEFAULT true,
    payment_failed_email BOOLEAN DEFAULT true,
    payment_failed_sms BOOLEAN DEFAULT true,
    
    -- Review Notifications
    new_review_platform BOOLEAN DEFAULT true,
    new_review_email BOOLEAN DEFAULT true,
    new_review_sms BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- PART 3: SUBSCRIPTION TABLES
-- ============================================================================

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- free, professional, premium, recruiter, admin
    display_name TEXT NOT NULL,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    features JSONB DEFAULT '[]',
    auto_apply_limit INTEGER DEFAULT 0, -- -1 for unlimited
    manual_apply_limit INTEGER DEFAULT 0, -- -1 for unlimited
    job_post_limit INTEGER DEFAULT 0, -- -1 for unlimited
    resume_limit INTEGER DEFAULT 1,
    support_level TEXT DEFAULT 'none', -- none, email, priority
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, expired, pending
    billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    payment_method_id TEXT,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Subscription Usage Table
CREATE TABLE IF NOT EXISTS subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    auto_apply_count INTEGER DEFAULT 0,
    manual_apply_count INTEGER DEFAULT 0,
    job_post_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- PART 4: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Auto-Apply Indexes
CREATE INDEX IF NOT EXISTS idx_auto_apply_settings_user_id ON auto_apply_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_settings_enabled ON auto_apply_settings(enabled);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_user_id ON auto_apply_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_job_id ON auto_apply_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_logs_applied_at ON auto_apply_logs(applied_at);

-- Notification Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Subscription Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON subscription_usage(user_id);

-- ============================================================================
-- PART 5: INSERT DEFAULT SUBSCRIPTION PLANS
-- ============================================================================

-- Free Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'free',
    'Free',
    0.00,
    0.00,
    'Perfect for job seekers testing the platform',
    '["Browse jobs (limited to 50/day)", "Apply to jobs manually (5/day)", "View 3 job details per day", "Basic profile", "Platform notifications only"]'::jsonb,
    0,
    5,
    0,
    1,
    'none'
) ON CONFLICT (name) DO NOTHING;

-- Professional Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'professional',
    'Professional',
    9.99,
    99.00,
    'For active job seekers',
    '["Browse unlimited jobs", "Apply to jobs manually (unlimited)", "Auto-apply to jobs (20/day)", "Advanced job filters", "Saved job searches", "Email notifications", "SMS notifications", "Resume management (3 resumes)", "Profile analytics", "Email support"]'::jsonb,
    20,
    -1,
    0,
    3,
    'email'
) ON CONFLICT (name) DO NOTHING;

-- Premium Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'premium',
    'Premium',
    19.99,
    199.00,
    'For serious job seekers',
    '["All Professional features", "Auto-apply to jobs (unlimited)", "Advanced AI job matching", "Priority support (24/7)", "Resume optimization AI", "Interview prep resources", "Salary negotiation guide", "Resume management (unlimited)", "Profile analytics (advanced)", "Job alerts (real-time)", "Networking features"]'::jsonb,
    -1,
    -1,
    0,
    -1,
    'priority'
) ON CONFLICT (name) DO NOTHING;

-- Recruiter Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'recruiter',
    'Recruiter',
    49.99,
    499.00,
    'For recruiters & HR teams',
    '["Post unlimited jobs", "Manage unlimited applicants", "Advanced applicant filtering", "Bulk messaging", "Candidate database", "Analytics & reports", "Team collaboration (up to 5 members)", "Email support", "Custom branding"]'::jsonb,
    0,
    0,
    -1,
    0,
    'email'
) ON CONFLICT (name) DO NOTHING;

-- Admin Plan
INSERT INTO subscription_plans (name, display_name, price_monthly, price_yearly, description, features, auto_apply_limit, manual_apply_limit, job_post_limit, resume_limit, support_level)
VALUES (
    'admin',
    'Admin',
    0.00,
    0.00,
    'For platform administrators',
    '["All platform features", "Admin dashboard", "User management", "Platform analytics", "Content moderation", "System settings", "Reports & insights"]'::jsonb,
    -1,
    -1,
    -1,
    -1,
    'priority'
) ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PART 6: TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_auto_apply_settings_updated_at ON auto_apply_settings;
CREATE TRIGGER update_auto_apply_settings_updated_at
    BEFORE UPDATE ON auto_apply_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_usage_updated_at ON subscription_usage;
CREATE TRIGGER update_subscription_usage_updated_at
    BEFORE UPDATE ON subscription_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 7: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE auto_apply_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_apply_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Auto-Apply Settings Policies
DROP POLICY IF EXISTS "Users can view their own auto-apply settings" ON auto_apply_settings;
CREATE POLICY "Users can view their own auto-apply settings"
    ON auto_apply_settings FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own auto-apply settings" ON auto_apply_settings;
CREATE POLICY "Users can insert their own auto-apply settings"
    ON auto_apply_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own auto-apply settings" ON auto_apply_settings;
CREATE POLICY "Users can update their own auto-apply settings"
    ON auto_apply_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Auto-Apply Logs Policies
DROP POLICY IF EXISTS "Users can view their own auto-apply logs" ON auto_apply_logs;
CREATE POLICY "Users can view their own auto-apply logs"
    ON auto_apply_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Notification Preferences Policies
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON notification_preferences;
CREATE POLICY "Users can view their own notification preferences"
    ON notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON notification_preferences;
CREATE POLICY "Users can insert their own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON notification_preferences;
CREATE POLICY "Users can update their own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Subscription Plans Policies (public read)
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON subscription_plans;
CREATE POLICY "Anyone can view subscription plans"
    ON subscription_plans FOR SELECT
    USING (true);

-- User Subscriptions Policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Subscription Usage Policies
DROP POLICY IF EXISTS "Users can view their own subscription usage" ON subscription_usage;
CREATE POLICY "Users can view their own subscription usage"
    ON subscription_usage FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- PART 8: INITIALIZE DEFAULT NOTIFICATION PREFERENCES FOR EXISTING USERS
-- ============================================================================

-- This will be handled by the backend service when users first access notification settings

-- ============================================================================
-- COMPLETE!
-- ============================================================================
