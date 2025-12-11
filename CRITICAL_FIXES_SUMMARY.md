# 🚨 CRITICAL FIXES - RLS Recursion & Role Issues

## ⚠️ Issues Identified

### 1. **Infinite Recursion Error** (CRITICAL)
**Error:** `infinite recursion detected in policy for relation "users"`

**Root Cause:**
- When querying `jobs` with `companies(*)` relationship, Supabase checks RLS policies
- The companies policy triggers a check that references users table
- Users table policy causes infinite recursion

**Fix Applied:**
- ✅ Changed `jobService.js` to fetch companies **separately** instead of using relationship syntax
- ✅ Created `FIX_RLS_RECURSION.sql` to fix RLS policies
- ✅ Simplified companies policy to `USING (true)` to avoid any recursion

### 2. **Role Not Working** (CRITICAL)
**Issue:** Admin/recruiter users see job-seeker features

**Root Cause:**
- Role is stored in `users` table (correct - there's no separate `profile` table)
- RLS recursion error prevents profile from loading correctly
- Once RLS is fixed, role should work correctly

**Fix Applied:**
- ✅ RLS fix will allow profile to load correctly
- ✅ `AuthContext` already fetches role from `users.role` field
- ✅ `ProtectedRoute` already checks `profile?.role`

### 3. **Jobs Not Showing** (CRITICAL)
**Issue:** Jobs return 500 error

**Root Cause:**
- RLS recursion error causes all job queries to fail
- Once RLS is fixed, jobs will load

**Fix Applied:**
- ✅ Changed query to fetch companies separately
- ✅ RLS policy fix will resolve the 500 errors

---

## 🔧 Steps to Fix

### Step 1: Fix RLS Policies (REQUIRED)
1. Open **Supabase Dashboard** → **SQL Editor**
2. Run `backend/supabase/FIX_RLS_RECURSION.sql`
3. This will fix the infinite recursion error

### Step 2: Verify Database
Check that roles are set correctly:
```sql
-- Check user roles
SELECT id, email, role, subscription_tier 
FROM users 
ORDER BY created_at DESC;

-- Set a user as admin (if needed)
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Set a user as recruiter (if needed)
UPDATE users 
SET role = 'recruiter' 
WHERE email = 'your-email@example.com';
```

### Step 3: Test
1. **Refresh the app** (hard refresh: Ctrl+Shift+R)
2. **Login** and check:
   - Jobs should load without errors
   - Profile role should be correct
   - Navigation should show correct links based on role

---

## 📝 Files Changed

### Backend/Database:
- ✅ `backend/supabase/FIX_RLS_RECURSION.sql` - **NEW** - Run this first!

### Frontend:
- ✅ `src/services/jobService.js` - Changed to fetch companies separately
  - `getAll()` - Fetches companies separately
  - `getById()` - Fetches company separately  
  - `getSavedJobs()` - Fetches companies separately

---

## 🧪 Testing Checklist

After running the SQL fix:

- [ ] Jobs load without 500 errors
- [ ] Jobs display in job search page
- [ ] Company information shows correctly
- [ ] Admin users see "Admin Panel" link
- [ ] Recruiter users see "Post Job" link
- [ ] Job-seeker users see correct navigation
- [ ] No console errors about RLS recursion
- [ ] Profile loads correctly with role

---

## 🔍 Debugging

### If jobs still don't show:
1. Check browser console for errors
2. Verify RLS policies were updated:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'jobs';
   SELECT * FROM pg_policies WHERE tablename = 'companies';
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

### If role still doesn't work:
1. Check user's role in database:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
   ```
2. Check browser console - profile should have `role` field
3. Sign out and sign back in to refresh profile

---

## ✅ Expected Results

After fixes:
- ✅ No more "infinite recursion" errors
- ✅ Jobs load successfully
- ✅ Company data displays correctly
- ✅ Role-based navigation works
- ✅ Admin/recruiter features accessible

---

## 🚀 Next Steps

1. **Run the SQL fix** (`FIX_RLS_RECURSION.sql`)
2. **Refresh the app**
3. **Test all scenarios**
4. **Report any remaining issues**

---

**Status:** 🔴 **CRITICAL FIX REQUIRED** - Run SQL script first!

