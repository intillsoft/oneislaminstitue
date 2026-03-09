-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: ULTIMATE SCHEMA & OWNERSHIP STABILIZER
-- Resolves donation saving bugs, relationship errors, and role sync issues.
-- ============================================================================

-- 1. Helper Function: Check/Fix Admin Mapping (Security Definer)
CREATE OR REPLACE FUNCTION public.is_admin_v2()
RETURNS BOOLEAN SECURITY DEFINER STABLE AS $$
BEGIN
  RETURN (
    coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') IN ('admin', 'super-admin')
    OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Repair 'jobs' table (Courses)
DO $$ 
BEGIN
    -- Ensure all pricing/donation columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_min') THEN
        ALTER TABLE jobs ADD COLUMN salary_min NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_max') THEN
        ALTER TABLE jobs ADD COLUMN salary_max NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'price') THEN
        ALTER TABLE jobs ADD COLUMN price NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'min') THEN
        ALTER TABLE jobs ADD COLUMN min NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'max') THEN
        ALTER TABLE jobs ADD COLUMN max NUMERIC DEFAULT 0;
    END IF;

    -- Ownership Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_by') THEN
        ALTER TABLE jobs ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'instructor_id') THEN
        ALTER TABLE jobs ADD COLUMN instructor_id UUID REFERENCES public.users(id);
    END IF;
END $$;

-- Fix ownership for orphaned content
UPDATE jobs SET created_by = instructor_id WHERE created_by IS NULL AND instructor_id IS NOT NULL;
UPDATE jobs SET instructor_id = created_by WHERE instructor_id IS NULL AND created_by IS NOT NULL;

-- Repair 'jobs' RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active courses" ON jobs;
CREATE POLICY "Anyone can view active courses" ON jobs FOR SELECT USING (
    COALESCE(status, 'active') IN ('active', 'published') OR auth.uid() = created_by OR public.is_admin_v2()
);

DROP POLICY IF EXISTS "Owners can update their courses" ON jobs;
CREATE POLICY "Owners can update their courses" ON jobs FOR UPDATE USING (
    auth.uid() = created_by OR auth.uid() = instructor_id OR public.is_admin_v2()
);

DROP POLICY IF EXISTS "Instructors can insert courses" ON jobs;
CREATE POLICY "Instructors can insert courses" ON jobs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Repair 'applications' table (Enrollments)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'course_id') THEN
        ALTER TABLE applications ADD COLUMN course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'job_id') THEN
        ALTER TABLE applications ADD COLUMN job_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Force relationships if missing from information_schema but columns exist
DO $$
BEGIN
    BEGIN
        ALTER TABLE applications ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE applications ADD CONSTRAINT applications_course_id_fkey FOREIGN KEY (course_id) REFERENCES jobs(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- 4. User Role Synchronization (Fix role being stuck on 'student')
-- Ensure that when metadata role is updated, public.users.role is updated too
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    UPDATE public.users SET role = NEW.raw_user_meta_data->>'role' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_role_update ON auth.users;
CREATE TRIGGER on_auth_user_role_update
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_role();

-- Initial sync for existing users
UPDATE public.users u
SET role = au.raw_user_meta_data->>'role'
FROM auth.users au
WHERE u.id = au.id AND au.raw_user_meta_data->>'role' IS NOT NULL;

-- 5. Donations Table Fix
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'donations' AND column_name = 'title') THEN
        ALTER TABLE donations ADD COLUMN title TEXT;
    END IF;
END $$;

-- 6. Reload cache
NOTIFY pgrst, 'reload schema';
