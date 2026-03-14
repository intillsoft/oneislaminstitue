-- ============================================================================
-- FIX NOTIFICATIONS SCHEMA (v2)
-- Adds missing columns and ensures RLS is correct for all roles
-- ============================================================================

-- 1. Ensure columns exist
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'info';

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON public.notifications(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 3. Robust RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Rule: Users can read their own received notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Rule: Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Rule: Users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" 
  ON public.notifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Rule: Instructors/Admins can see notifications they SENT (for the 'Sent' tab)
DROP POLICY IF EXISTS "Users can view sent notifications" ON public.notifications;
CREATE POLICY "Users can view sent notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = sender_id);

-- Rule: Instructors/Admins can INSERT notifications (broadcast)
DROP POLICY IF EXISTS "Elevated roles can send notifications" ON public.notifications;
CREATE POLICY "Elevated roles can send notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('instructor', 'recruiter', 'admin', 'super-admin', 'super_admin', 'owner', 'moderator', 'faculty', 'teacher')
    )
  );

-- Rule: Admin God Mode (View all)
DROP POLICY IF EXISTS "Admin view all notifications" ON public.notifications;
CREATE POLICY "Admin view all notifications" 
  ON public.notifications 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super-admin', 'super_admin', 'owner', 'moderator')
    )
  );

-- 4. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
