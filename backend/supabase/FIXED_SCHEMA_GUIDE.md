# ✅ FIXED SCHEMA SETUP GUIDE

## 🔧 Issues Fixed

1. ✅ **Vector extension error** - Added proper handling
2. ✅ **Company column error** - Fixed reference in jobMatching.js
3. ✅ **Requirements column** - Removed non-existent column reference

---

## 📋 Setup Steps (Fixed)

### Step 1: Enable pgvector Extension (IMPORTANT!)

**Option A: Via Dashboard (Recommended)**
1. Go to Supabase Dashboard
2. Navigate to **Database** → **Extensions**
3. Search for `vector` or `pgvector`
4. Click **Enable**
5. Wait for activation

**Option B: Via SQL**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 2: Run Main Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New query**
3. Copy **ALL** contents of `backend/supabase/schema.sql`
4. Paste and click **Run**
5. ✅ Wait for success

### Step 3: Run AI Schema

**If pgvector is enabled:**
1. New query in SQL Editor
2. Copy **ALL** contents of `backend/supabase/ai-schema.sql`
3. Paste and click **Run**
4. ✅ Wait for success

**If pgvector is NOT available:**
1. New query in SQL Editor
2. Copy **ALL** contents of `backend/supabase/ai-schema-fallback.sql`
3. Paste and click **Run**
4. ✅ Wait for success

---

## ✅ Verification

After running schemas, verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should see:
-- applications
-- career_analyses
-- email_preferences
-- embeddings_cache
-- interview_questions
-- interview_sessions
-- jobs
-- resumes
-- salary_cache
-- salary_reports
-- saved_jobs
-- subscriptions
-- usage_tracking
-- users
```

---

## 🆘 If You Still Get Errors

### Error: "type vector does not exist"
**Solution:**
1. Enable pgvector extension (see Step 1)
2. OR use `ai-schema-fallback.sql` instead

### Error: "column company does not exist"
**Solution:**
- Make sure you ran `schema.sql` FIRST
- The `jobs` table must exist before AI schema

### Error: "relation already exists"
**Solution:**
- This is OK! The `IF NOT EXISTS` prevents errors
- You can safely re-run schemas

---

## 📝 Quick Reference

**Schema Order:**
1. ✅ Enable pgvector extension
2. ✅ Run `schema.sql`
3. ✅ Run `ai-schema.sql` (or `ai-schema-fallback.sql`)

**Files:**
- `schema.sql` - Main tables (REQUIRED)
- `ai-schema.sql` - AI tables with vector (if pgvector enabled)
- `ai-schema-fallback.sql` - AI tables without vector (fallback)

---

## ✅ All Fixed!

The schemas are now fixed and ready to run. Follow the steps above and everything should work! 🎉

