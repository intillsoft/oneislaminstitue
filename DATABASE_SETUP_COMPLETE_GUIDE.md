# 🗄️ COMPLETE DATABASE SETUP GUIDE

## ⚠️ IMPORTANT: Run these scripts in ORDER

### Step 1: Clean Database (DELETE ALL DATA)
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `backend/supabase/CLEAN_DATABASE.sql`
3. Click **Run**
4. Wait for confirmation: "Database cleaned successfully"

### Step 2: Create Main Schema
1. Still in SQL Editor
2. Copy and paste the entire contents of `backend/supabase/FINAL_SCHEMA.sql`
3. Click **Run**
4. Should complete with NO ERRORS

### Step 3: Create AI Schema
1. Still in SQL Editor
2. Copy and paste the entire contents of `backend/supabase/FINAL_AI_SCHEMA.sql`
3. Click **Run**
4. Should complete with NO ERRORS

### Step 4: Enable pgvector Extension (for AI features)
1. Go to Supabase Dashboard → Database → Extensions
2. Search for "vector"
3. Click **Enable** on "pgvector"
4. Wait for confirmation

### Step 5: Verify Setup
Run this query in SQL Editor to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- users
- resumes
- jobs
- applications
- saved_jobs
- job_alerts
- subscriptions
- usage_tracking
- email_preferences
- companies
- notifications
- activity_log
- goals
- application_notes
- application_follow_ups
- embeddings_cache
- interview_questions
- interview_sessions
- salary_cache
- salary_reports
- career_analyses

## ✅ Verification Checklist

- [ ] CLEAN_DATABASE.sql ran successfully
- [ ] FINAL_SCHEMA.sql ran with NO ERRORS
- [ ] FINAL_AI_SCHEMA.sql ran with NO ERRORS
- [ ] pgvector extension enabled
- [ ] All 21 tables exist
- [ ] Can sign up new user (profile auto-creates)
- [ ] Can update profile (no errors)
- [ ] Can save resume
- [ ] Can create application

## 🔧 Troubleshooting

### Error: "column role does not exist"
- This means old policies still exist
- Run CLEAN_DATABASE.sql again FIRST
- Then run FINAL_SCHEMA.sql

### Error: "type vector does not exist"
- Enable pgvector extension (Step 4)
- Or use `backend/supabase/ai-schema-fallback.sql` instead

### Profile not updating
- Check browser console for errors
- Verify RLS policies are correct
- Ensure user is authenticated

### Profile not auto-creating on signup
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Verify function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`

## 📝 Notes

- All schemas use `auth.uid()` - NO `auth.role()` anywhere
- All policies are user-scoped (users can only access their own data)
- Auto-profile creation trigger is included
- All foreign keys have proper CASCADE rules

