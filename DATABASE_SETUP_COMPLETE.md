# 🗄️ Complete Database Setup Guide

## Overview

This document provides instructions for setting up the complete database schema for the Workflow platform, including all tables needed for all features.

## Database Schema Files

### 1. Main Schema (`backend/supabase/complete-schema.sql`)
**Run this FIRST** - Contains all core tables:
- `users` (enhanced with phone, location, bio, role, preferences)
- `resumes` (with template and version tracking)
- `jobs` (enhanced with salary ranges, job types, industries)
- `applications` (enhanced with interview dates, offer details, follow-ups)
- `saved_jobs` (with notes)
- `job_alerts` (for email notifications)
- `subscriptions` (Stripe integration)
- `usage_tracking` (feature limits)
- `email_preferences` (user email settings)
- `companies` (company profiles)
- `notifications` (in-app notifications)
- `activity_log` (user activity tracking)
- `goals` (user goals tracking)

### 2. AI Schema (`backend/supabase/ai-schema.sql`)
**Run this SECOND** - Contains AI-related tables:
- `embeddings_cache` (for job matching)
- `interview_questions` (question database)
- `interview_sessions` (mock interview tracking)
- `salary_cache` (salary predictions cache)
- `salary_reports` (user-submitted salary data)
- `career_analyses` (career advisor history)

**Note:** Requires `pgvector` extension. If not available, use `ai-schema-fallback.sql` instead.

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run Main Schema

1. Copy the contents of `backend/supabase/complete-schema.sql`
2. Paste into SQL Editor
3. Click **Run** (or press `Ctrl+Enter`)
4. Wait for all tables to be created

### Step 3: Enable pgvector Extension (for AI features)

1. In Supabase Dashboard, go to **Database** → **Extensions**
2. Search for "vector" or "pgvector"
3. Click **Enable**

**OR** run in SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 4: Run AI Schema

1. Copy the contents of `backend/supabase/ai-schema.sql`
2. Paste into SQL Editor
3. Click **Run**

**If pgvector is not available:**
- Use `backend/supabase/ai-schema-fallback.sql` instead
- This uses JSONB for embeddings instead of VECTOR type

### Step 5: Verify Setup

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see:
- activity_log
- applications
- career_analyses
- companies
- email_preferences
- embeddings_cache
- goals
- interview_questions
- interview_sessions
- job_alerts
- jobs
- notifications
- resumes
- salary_cache
- salary_reports
- saved_jobs
- subscriptions
- usage_tracking
- users

### Step 6: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create these buckets:
   - `avatars` (public, for user profile pictures)
   - `resumes` (private, for uploaded resume files)
   - `documents` (private, for application documents)

For each bucket:
- Set appropriate policies (users can upload their own files)
- Enable public access for `avatars` if needed

## Table Descriptions

### Core Tables

**users**
- Stores user accounts with profile information
- Includes subscription tier, role, and preferences

**resumes**
- User resumes stored as JSONB
- Supports multiple resumes per user
- Tracks default resume and versions

**jobs**
- Job listings from scrapers or manual entry
- Includes salary ranges, job types, industries
- Full-text search indexes on title and description

**applications**
- Job applications with status tracking
- Includes interview dates, offer details, notes
- Supports follow-up scheduling

**saved_jobs**
- User bookmarked jobs
- Includes notes for each saved job

**job_alerts**
- Email alert configurations
- Supports keyword, location, salary filters

**subscriptions**
- Stripe subscription data
- Tracks billing periods and status

**usage_tracking**
- Monthly feature usage limits
- Tracks applications, saved jobs, resumes, API calls

**email_preferences**
- User email notification preferences
- Opt-in/opt-out per email type

### Analytics Tables

**notifications**
- In-app notifications
- Supports read/unread status

**activity_log**
- User activity tracking
- Logs all user actions for analytics

**goals**
- User-set goals (applications, interviews, offers)
- Tracks progress and achievements

### AI Tables

**embeddings_cache**
- Cached embeddings for job matching
- Uses pgvector for similarity search

**interview_questions**
- Database of interview questions
- Organized by company, type, difficulty

**interview_sessions**
- Mock interview session data
- Stores answers, metrics, suggestions

**salary_cache**
- Cached salary predictions
- Reduces API calls

**salary_reports**
- User-submitted salary data
- Used for market insights

**career_analyses**
- Career advisor analysis history
- Stores personalized recommendations

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users**: Can only access their own data
- **Jobs**: Public read, service role write
- **Applications**: Users can only see their own
- **Subscriptions**: Users can view their own
- **AI Tables**: Users can manage their own sessions/analyses

## Indexes

All tables have appropriate indexes for:
- Foreign keys
- Common query patterns
- Full-text search (jobs)
- Time-based queries (activity_log, notifications)

## Functions

**update_updated_at_column()**
- Automatically updates `updated_at` timestamp on row updates

**sync_user_subscription_tier()**
- Syncs subscription tier from subscriptions table to users table

**create_notification()**
- Helper function to create notifications

**log_activity()**
- Helper function to log user activities

## Verification Queries

### Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Check indexes:
```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Check policies:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## Troubleshooting

### Error: "extension vector does not exist"
- Enable pgvector extension via Dashboard
- Or use `ai-schema-fallback.sql` instead

### Error: "column already exists"
- Tables may already exist
- Use `schema-clean.sql` to drop and recreate (WARNING: deletes all data)

### Error: "permission denied"
- Ensure you're using the service role key for admin operations
- Check RLS policies are correctly set

## Next Steps

After database setup:
1. Configure environment variables
2. Set up Supabase Storage buckets
3. Configure OAuth providers (Google, GitHub)
4. Set up Stripe webhooks
5. Configure Resend email service
6. Test all features

## Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Verify all extensions are enabled
3. Check RLS policies
4. Review error messages in SQL Editor

