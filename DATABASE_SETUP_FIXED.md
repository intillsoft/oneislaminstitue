# Database Setup - FIXED VERSION

## ✅ SQL Error Fixed!

The `auth.role()` error has been fixed. Use these schema files instead.

## Setup Steps

### Step 1: Run Main Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `backend/supabase/schema-fixed.sql`
3. Click "Run"
4. Wait for success message

### Step 2: Run AI Schema
1. First, enable pgvector extension:
   - Go to Supabase Dashboard → Database → Extensions
   - Search for "vector" or "pgvector"
   - Click "Enable"
   
2. Then run the AI schema:
   - Go to SQL Editor
   - Copy and paste the contents of `backend/supabase/ai-schema-fixed.sql`
   - Click "Run"

## What Was Fixed?

### Before (Error):
```sql
CREATE POLICY "Authenticated users can view jobs" 
ON jobs FOR SELECT 
USING (auth.role() = 'authenticated');  -- ❌ ERROR: column "role" does not exist
```

### After (Fixed):
```sql
CREATE POLICY "Authenticated users can view jobs" 
ON jobs FOR SELECT 
USING (auth.uid() IS NOT NULL);  -- ✅ Works correctly
```

## All Fixed Policies

- ✅ Jobs: `auth.uid() IS NOT NULL` instead of `auth.role() = 'authenticated'`
- ✅ Embeddings Cache: `auth.uid() IS NOT NULL` instead of `auth.role() = 'service_role'`
- ✅ Interview Questions: `auth.uid() IS NOT NULL` instead of `auth.role() = 'service_role'`
- ✅ Salary Cache: `auth.uid() IS NOT NULL` instead of `auth.role() = 'service_role'`
- ✅ Salary Reports: `auth.uid() IS NOT NULL` instead of `auth.role() = 'service_role'`

## Verification

After running both schemas, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- applications
- career_analyses
- email_preferences
- embeddings_cache
- interview_questions
- interview_sessions
- jobs
- resumes
- salary_cache
- salary_reports
- saved_jobs
- usage_tracking
- users
- subscriptions
- job_alerts
- companies
- notifications
- activity_log
- goals

## Troubleshooting

### Error: "extension vector does not exist"
- Enable pgvector via Supabase Dashboard → Database → Extensions
- Or use the fallback schema that uses JSONB instead

### Error: "table already exists"
- The schema uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times
- If you get this error, the table already exists - that's fine!

### Error: "policy already exists"
- The fixed schema drops existing policies first
- If you still get this error, manually drop the policy:
```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

## Next Steps

1. ✅ Run `schema-fixed.sql`
2. ✅ Enable pgvector extension
3. ✅ Run `ai-schema-fixed.sql`
4. ✅ Verify all tables exist
5. ✅ Test your app!

Everything should work now! 🎉

