-- ============================================================================
-- FIX: Update Subscription Tiers and Unique Constraints
-- ============================================================================

-- 1. Ensure user_id has a unique constraint for UPSERT (ON CONFLICT)
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- 2. Update subscriptions table plan constraints
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check 
    CHECK (plan IN ('free', 'professional', 'premium', 'recruiter', 'admin'));

-- 3. Update users table subscription_tier constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check 
    CHECK (subscription_tier IN ('free', 'professional', 'premium', 'recruiter', 'admin'));

-- 4. Sync legacy plan names if they exist
UPDATE subscriptions SET plan = 'professional' WHERE plan IN ('pro', 'basic');
UPDATE users SET subscription_tier = 'professional' WHERE subscription_tier IN ('pro', 'basic');
