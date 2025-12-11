# 🚨 URGENT: Fix Infinite Recursion Error

## The Error
```
infinite recursion detected in policy for relation "users"
```

## Root Cause
The RLS policies are checking the `users` table within `users` policies, causing infinite recursion.

## The Fix (2 Steps)

### Step 1: Run This SQL Script

Open Supabase SQL Editor and run: `backend/supabase/FIX_INFINITE_RECURSION_NOW.sql`

This script:
- ✅ Removes ALL recursive policies
- ✅ Creates simple, non-recursive policies
- ✅ Makes jobs viewable to everyone
- ✅ Fixes the infinite recursion

### Step 2: Code Already Fixed

I've already fixed the code to avoid relationship queries that cause recursion:
- ✅ `applicationService.js` - Fixed
- ✅ `jobService.js` - Fixed

---

## Quick Copy-Paste Fix

If you can't find the file, copy this into Supabase SQL Editor:

```sql
-- Drop ALL policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Users policies (NO recursion)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies (Public - no auth needed)
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT 
    USING (status IS NULL OR status = 'active' OR status = 'published');
CREATE POLICY "Authenticated users can view all jobs" ON jobs FOR SELECT 
    USING (auth.uid() IS NOT NULL);

-- Companies (Public)
CREATE POLICY "Anyone can view companies" ON companies FOR SELECT USING (true);

-- Applications
CREATE POLICY "Users can manage own applications" ON applications FOR ALL 
    USING (auth.uid() = user_id);

-- Saved jobs
CREATE POLICY "Users can manage own saved jobs" ON saved_jobs FOR ALL 
    USING (auth.uid() = user_id);

-- Resumes
CREATE POLICY "Users can manage own resumes" ON resumes FOR ALL 
    USING (auth.uid() = user_id);

-- Add status column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'status'
    ) THEN
        ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;

UPDATE jobs SET status = 'active' WHERE status IS NULL;
```

---

## After Running

1. **Refresh your app** - The errors should be gone
2. **Test:**
   - Jobs should load ✅
   - Applications should load ✅
   - Saved jobs should load ✅
   - Profile should load ✅

---

## Why This Works

- **No recursion**: Policies don't query users table within users policies
- **Jobs are public**: No authentication needed to view jobs
- **Simple checks**: All policies use direct `auth.uid()` checks
- **Separate queries**: Code fetches related data separately

---

## Run It Now!

The fix script is ready. Just run it in Supabase SQL Editor and your app will work! 🚀










