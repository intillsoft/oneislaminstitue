-- ============================================================================
-- MIGRATE EXISTING USERS
-- Run this if you have users in auth.users but not in public.users
-- ============================================================================

-- Create profiles for all existing auth users who don't have profiles
INSERT INTO public.users (id, email, name, avatar_url, role, subscription_tier)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'name',
        au.raw_user_meta_data->>'full_name',
        split_part(au.email, '@', 1)
    ) as name,
    au.raw_user_meta_data->>'avatar_url' as avatar_url,
    COALESCE(au.raw_user_meta_data->>'role', 'job-seeker')::text as role,
    'free' as subscription_tier
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify migration
SELECT 
    COUNT(*) as total_auth_users,
    (SELECT COUNT(*) FROM public.users) as total_profiles,
    COUNT(*) - (SELECT COUNT(*) FROM public.users) as missing_profiles
FROM auth.users;

