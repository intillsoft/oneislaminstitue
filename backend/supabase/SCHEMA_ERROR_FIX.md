# 🔧 FIXING "column company does not exist" Error

## Problem

The error occurs when:
- The `jobs` table already exists without the `company` column
- You're trying to create an index on a column that doesn't exist

## ✅ Solution Options

### Option 1: Use the Fixed Schema (Recommended)

The updated `schema.sql` now:
- ✅ Checks if `company` column exists before creating index
- ✅ Adds the column if it's missing
- ✅ Handles existing tables safely

**Just run the updated `schema.sql` again!**

### Option 2: Drop and Recreate (If No Important Data)

If you don't have important data, use `schema-clean.sql`:

1. Go to SQL Editor
2. Copy and paste `schema-clean.sql`
3. Uncomment the DROP TABLE lines (lines 9-16) if you want to start fresh
4. Run it

**⚠️ WARNING:** This will delete all existing data!

### Option 3: Manual Fix (If You Have Data)

Run this SQL to add the column manually:

```sql
-- Check if column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'jobs' AND column_name = 'company';

-- If it doesn't exist, add it:
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company TEXT;

-- Then create the index:
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
```

---

## 🎯 Recommended Steps

1. **Try the updated schema.sql first** (it should work now)
2. **If still errors**, check if jobs table exists:
   ```sql
   SELECT * FROM jobs LIMIT 1;
   ```
3. **If table exists**, run the manual fix (Option 3)
4. **If table doesn't exist**, the schema should create it correctly

---

## ✅ Verification

After running the schema, verify:

```sql
-- Check jobs table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'jobs'
ORDER BY ordinal_position;

-- Should see: id, title, company, location, salary, description, source, scraped_at, created_at, updated_at
```

---

## 🆘 Still Having Issues?

1. **Check if jobs table exists:**
   ```sql
   SELECT EXISTS (
       SELECT FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name = 'jobs'
   );
   ```

2. **Check current structure:**
   ```sql
   \d jobs
   ```
   (In psql) or check in Supabase Table Editor

3. **Drop and recreate** (if no data):
   ```sql
   DROP TABLE IF EXISTS jobs CASCADE;
   -- Then run schema.sql again
   ```

---

**The updated schema.sql should now work! Try running it again.** ✅

