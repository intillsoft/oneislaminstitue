# 📋 Database Schema Setup Instructions

## ⚠️ Important: Supabase Extensions

The `vector` extension (pgvector) needs to be enabled **manually** in Supabase Dashboard before running the AI schema.

### Step 1: Enable pgvector Extension

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Extensions**
3. Search for `vector` or `pgvector`
4. Click **Enable** or toggle it on
5. Wait for it to activate (usually instant)

**OR** use SQL:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 2: Run Main Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New query**
3. Copy and paste **ALL** contents of `backend/supabase/schema.sql`
4. Click **Run** (or press Ctrl+Enter)
5. Wait for success message

### Step 3: Run AI Schema

1. Still in SQL Editor, click **New query**
2. Copy and paste **ALL** contents of `backend/supabase/ai-schema.sql`
3. Click **Run**
4. Wait for success message

---

## 🔧 Alternative: If Vector Extension Fails

If you can't enable the `vector` extension, you can modify the AI schema to work without it:

**Option 1:** Use JSONB instead of vector (less efficient but works):
```sql
-- In ai-schema.sql, replace:
embedding VECTOR(1536),
-- With:
embedding JSONB, -- Array of floats
```

**Option 2:** Skip embeddings cache table (AI will still work, just slower):
- Comment out the `embeddings_cache` table creation
- The AI features will regenerate embeddings each time (slower but functional)

---

## ✅ Verification

After running both schemas, verify:

1. **Check tables exist:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Check extensions:**
   ```sql
   SELECT * FROM pg_extension;
   ```

3. **Test a query:**
   ```sql
   SELECT * FROM users LIMIT 1;
   ```

---

## 🆘 Troubleshooting

### Error: "type vector does not exist"
- **Solution:** Enable pgvector extension in Dashboard → Database → Extensions
- Or run: `CREATE EXTENSION IF NOT EXISTS vector;`

### Error: "column company does not exist"
- **Solution:** Make sure you ran `schema.sql` BEFORE `ai-schema.sql`
- The `jobs` table must exist first

### Error: "relation already exists"
- **Solution:** This is OK - the `IF NOT EXISTS` clauses prevent errors
- You can safely re-run the schemas

### Error: "permission denied"
- **Solution:** Make sure you're using the SQL Editor in Supabase Dashboard
- Or use a service role connection

---

## 📝 Schema Order

**Always run in this order:**
1. ✅ `schema.sql` (main tables)
2. ✅ `ai-schema.sql` (AI tables)

**Why?** AI schema references tables from main schema (like `users`).

---

## 🎯 Quick Checklist

- [ ] pgvector extension enabled
- [ ] `schema.sql` run successfully
- [ ] `ai-schema.sql` run successfully
- [ ] All tables visible in Table Editor
- [ ] RLS policies active (check in Authentication → Policies)

---

**See `COMPLETE_SETUP_GUIDE.md` for full setup instructions!**

