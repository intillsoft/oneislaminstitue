# 🔧 CRITICAL DATABASE FIX - READ THIS FIRST

## The Problem

Your database RLS policies are blocking everything:
- Jobs require authentication but users browse without logging in
- Policies might be causing recursion errors
- Missing `status` column on jobs table

## The Solution

I've created a complete fix script that will:
1. ✅ Add missing `status` column to jobs
2. ✅ Fix ALL RLS policies
3. ✅ Make jobs viewable to EVERYONE (including anonymous users)
4. ✅ Preserve all your existing data
5. ✅ Fix role-based access

---

## 🚀 HOW TO FIX (5 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Fix Script
1. Open the file: `backend/supabase/COMPLETE_DATABASE_FIX.sql`
2. Copy the ENTIRE contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify It Worked
Run these test queries in SQL Editor:

```sql
-- Should return jobs (even without being logged in)
SELECT id, title, company, status FROM jobs LIMIT 5;

-- Should return companies
SELECT id, name FROM companies LIMIT 5;

-- Check job statuses
SELECT status, COUNT(*) FROM jobs GROUP BY status;
```

If these work, you're done! ✅

---

## 📋 What the Fix Does

### 1. Adds Missing Columns
- Adds `status` column to `jobs` table if missing
- Sets default status to 'active' for existing jobs

### 2. Fixes RLS Policies
- **Jobs**: Now viewable by EVERYONE (not just authenticated users)
- **Companies**: Public (anyone can view)
- **Users**: Can only view/edit their own profile
- **Applications**: Users can only see their own
- **Saved Jobs**: Users can only see their own

### 3. Role-Based Access
- Admins can view all users
- Recruiters/Admins can manage jobs
- Job seekers see only active/published jobs

---

## ⚠️ Important Notes

1. **This preserves all your data** - nothing is deleted
2. **Jobs become public** - anyone can view active jobs (this is correct for a job board)
3. **User data stays private** - users can only see their own data
4. **Roles work correctly** - admins/recruiters get proper access

---

## 🧪 After Running the Fix

### Test These:

1. **Open app without logging in:**
   - Go to http://localhost:3000
   - Click "Browse Jobs"
   - Jobs should appear ✅

2. **Sign in as job seeker:**
   - Jobs should appear ✅
   - Can save jobs ✅
   - Can view applications ✅

3. **Sign in as admin/recruiter:**
   - Should see admin/recruiter navigation ✅
   - Can see all jobs (including drafts) ✅
   - Can manage jobs ✅

---

## 🆘 If Something Goes Wrong

### Rollback (if needed):
```sql
-- This will reset policies (but keep data)
-- Only run if the fix causes issues

-- Drop all policies
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
```

Then re-run the fix script.

---

## ✅ Expected Results

After running the fix:

- ✅ Jobs appear on job search page
- ✅ No "fail to load data" errors
- ✅ Role-based navigation works
- ✅ Saved jobs load correctly
- ✅ Applications load correctly
- ✅ Profile loads correctly

---

## 📞 Still Having Issues?

If jobs still don't appear after running the fix:

1. **Check job status:**
   ```sql
   SELECT id, title, status FROM jobs LIMIT 10;
   ```
   Jobs should have `status = 'active'` or `status = 'published'`

2. **Check RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'jobs';
   ```
   `rowsecurity` should be `true`

3. **Test policy directly:**
   ```sql
   -- This should work (returns jobs)
   SELECT * FROM jobs WHERE status = 'active' LIMIT 1;
   ```

---

## 🎯 Summary

**The fix script does everything automatically:**
- ✅ Adds missing columns
- ✅ Fixes all RLS policies
- ✅ Makes jobs public
- ✅ Preserves all data
- ✅ Enables role-based access

**Just run the script and test!** 🚀











