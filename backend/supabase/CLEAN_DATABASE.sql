-- ============================================================================
-- CLEAN DATABASE SCRIPT
-- Run this FIRST to drop all tables and start fresh
-- WARNING: This will delete ALL data!
-- ============================================================================

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS sync_subscription_tier ON subscriptions;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_job_alerts_updated_at ON job_alerts;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_usage_tracking_updated_at ON usage_tracking;
DROP TRIGGER IF EXISTS update_email_preferences_updated_at ON email_preferences;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS sync_user_subscription_tier() CASCADE;
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_activity(UUID, TEXT, TEXT, UUID, JSONB) CASCADE;

-- Drop all policies (aggressive cleanup)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                pol.policyname, pol.schemaname, pol.tablename);
        EXCEPTION WHEN OTHERS THEN
            -- Continue if policy doesn't exist
            NULL;
        END;
    END LOOP;
END $$;

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS application_follow_ups CASCADE;
DROP TABLE IF EXISTS application_notes CASCADE;
DROP TABLE IF EXISTS career_analyses CASCADE;
DROP TABLE IF EXISTS salary_reports CASCADE;
DROP TABLE IF EXISTS salary_cache CASCADE;
DROP TABLE IF EXISTS interview_sessions CASCADE;
DROP TABLE IF EXISTS interview_questions CASCADE;
DROP TABLE IF EXISTS embeddings_cache CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS email_preferences CASCADE;
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS job_alerts CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Verify cleanup
SELECT 'Database cleaned successfully. All tables, policies, triggers, and functions dropped.' as status;

