# Supabase Database Deployment Guide

## Quick Start: Deploy Notification Schema

### Prerequisites
- Supabase account created
- Project initialized
- Database keys added to `.env.local`

---

## STEP 1: Access Supabase SQL Editor

```
1. Go to: https://app.supabase.com
2. Select your project
3. Click "SQL Editor" (left sidebar)
4. Click "New Query"
```

---

## STEP 2: Copy Migration SQL

The complete schema is in:
📄 **File**: `backend/supabase/migrations/notifications_table.sql`

**Contents** (copy everything):

```sql
-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy 1: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Users can update their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 3: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 4: Service role can insert notifications (from backend)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy 5: Service role can delete notifications
CREATE POLICY "Service role can delete notifications"
  ON public.notifications
  FOR DELETE
  TO service_role
  USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_notification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_updated_at_trigger
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE PROCEDURE update_notification_updated_at();
```

---

## STEP 3: Execute in Supabase

1. **Copy** the entire SQL above
2. **Go** to SQL Editor
3. **Paste** into the query box
4. **Click** "Run" button (or press `Ctrl+Enter`)

**Expected Output:**
```
✓ Query succeeded
  No rows returned
```

---

## STEP 4: Verify Table Created

In Supabase SQL Editor, run:

```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'notifications';
```

**Expected Result:**
- 1 row showing notifications table

---

## STEP 5: Enable Realtime

```
1. Go to Database > Tables
2. Click "notifications" table
3. Look for "Realtime" toggle (top right)
4. Click to enable
5. Choose events:
   ✓ Insert
   ✓ Update
   ✓ Delete
6. Save
```

**Verify**: Realtime badge shows "Enabled"

---

## STEP 6: Verify RLS Policies

```
1. Click notifications table
2. Click "RLS Policies" tab
3. Should see 5 policies:
   ✓ Users can view their own notifications
   ✓ Users can update their own notifications
   ✓ Users can delete their own notifications
   ✓ Service role can insert notifications
   ✓ Service role can delete notifications
```

---

## STEP 7: Verify Indexes

```
In SQL Editor, run:

SELECT indexname FROM pg_indexes 
WHERE tablename = 'notifications';
```

**Expected Result**: 3 rows
```
idx_notifications_user_id
idx_notifications_is_read
idx_notifications_created_at
```

---

## STEP 8: Test Permissions

Run this in SQL Editor as authenticated user:

```sql
-- This should work (viewing own notifications)
SELECT * FROM notifications WHERE user_id = auth.uid();

-- This should be blocked (viewing other user's notifications)
-- SELECT * FROM notifications WHERE user_id != auth.uid();
```

**Expected**: First query runs, second would be blocked by RLS

---

## STEP 9: Verify in App

Once deployed, the app can use:

```typescript
// Fetch notifications
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .order('created_at', { ascending: false });

// Real-time subscription
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'notifications'
  }, (payload) => {
    console.log('Notification update:', payload);
  })
  .subscribe();
```

---

## Troubleshooting

### Error: "Permission denied for schema public"
- **Solution**: Use service_role key for migrations
- **Check**: `SUPABASE_SERVICE_ROLE_KEY` in environment

### Error: "Relation notifications already exists"
- **Solution**: SQL is idempotent (uses IF NOT EXISTS)
- **Try**: Drop table first:
```sql
DROP TABLE IF EXISTS public.notifications CASCADE;
-- Then run full SQL again
```

### RLS Policies Not Applied
- **Solution**: Make sure "Realtime" is enabled
- **Check**: RLS toggle on table is "ON"
- **Verify**: Each policy shows in RLS tab

### Realtime Not Working
- **Solution**: Enable realtime in Supabase dashboard
- **Check**: Realtime toggle is ON for table
- **Verify**: WebSocket connection in app (DevTools > Network > WS)

### Slow Queries
- **Solution**: Indexes should exist (verified in Step 7)
- **Check**: Query plan:
```sql
EXPLAIN ANALYZE
SELECT * FROM notifications 
WHERE user_id = 'some-uuid' 
ORDER BY created_at DESC;
```

---

## ✅ Deployment Checklist

- [ ] SQL executed successfully
- [ ] Table appears in Tables list
- [ ] Realtime enabled
- [ ] All 5 RLS policies created
- [ ] All 3 indexes exist
- [ ] Test query returns data
- [ ] App successfully queries table
- [ ] Real-time updates work

---

## Next Steps

After database is deployed:

1. **Deploy API**
   - Backend/API routes configured
   - Supabase client initialized
   - CORS configured

2. **Deploy UI**
   - Components in place
   - Hooks connected
   - Real-time subscribed

3. **Configure Email** (optional)
   - RESEND_API_KEY set
   - Email templates ready
   - Test sending

4. **Run Tests**
   - Use NOTIFICATION_SYSTEM_TESTING_GUIDE.md
   - Verify all workflows
   - Check performance

---

## Database Cleanup (if needed)

To completely remove the notification system:

```sql
-- Drop table (cascades drop policies, triggers, indexes)
DROP TABLE IF EXISTS public.notifications CASCADE;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_notification_updated_at() CASCADE;
```

Then remove all notification files from the app.

---

## Support

- Supabase Docs: https://supabase.com/docs
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- Realtime: https://supabase.com/docs/guides/realtime

**Questions?** Check the NOTIFICATION_SYSTEM_TESTING_GUIDE.md for full details.
