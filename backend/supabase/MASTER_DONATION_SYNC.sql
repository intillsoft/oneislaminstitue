
-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: MASTER DONATION & OWNERSHIP SYNC
-- Ensuring min/max columns exist and RLS policies allow saving
-- ============================================================================

-- 1. Metadata Schema Expansion
DO $$ 
BEGIN
    -- Ensure columns exist in 'jobs' table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_min') THEN
        ALTER TABLE jobs ADD COLUMN salary_min NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_max') THEN
        ALTER TABLE jobs ADD COLUMN salary_max NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'price') THEN
        ALTER TABLE jobs ADD COLUMN price NUMERIC DEFAULT 0;
    END IF;

    -- Add aliases for easier integration if needed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'min') THEN
        ALTER TABLE jobs ADD COLUMN min NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'max') THEN
        ALTER TABLE jobs ADD COLUMN max NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 2. Data Migration: Populate owner fields for existing content
-- If created_by is null, try to use instructor_id or vice versa
UPDATE jobs SET created_by = instructor_id WHERE created_by IS NULL AND instructor_id IS NOT NULL;
UPDATE jobs SET instructor_id = created_by WHERE instructor_id IS NULL AND created_by IS NOT NULL;

-- 3. Robust RLS Policy for Course Management
-- Allows instructors to manage their own courses even if created_by was missing
DROP POLICY IF EXISTS "Instructors can update own courses" ON jobs;
DROP POLICY IF EXISTS "Instructors can delete own courses" ON jobs;
DROP POLICY IF EXISTS "Users can update own jobs or admins can update any" ON jobs;
DROP POLICY IF EXISTS "Users can delete own jobs or admins can delete any" ON jobs;

CREATE POLICY "Owners can update their courses"
ON jobs FOR UPDATE
USING (
    auth.uid() = created_by OR 
    auth.uid() = instructor_id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super-admin')
);

CREATE POLICY "Owners can delete their courses"
ON jobs FOR DELETE
USING (
    auth.uid() = created_by OR 
    auth.uid() = instructor_id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super-admin')
);

-- Ensure Insert is also covered
DROP POLICY IF EXISTS "Instructors can insert courses" ON jobs;
CREATE POLICY "Instructors can insert courses" 
ON jobs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Sync Values
UPDATE jobs SET price = salary_min WHERE price = 0 AND salary_min > 0;
UPDATE jobs SET min = salary_min WHERE min = 0 AND salary_min > 0;
UPDATE jobs SET max = salary_max WHERE max = 0 AND salary_max > 0;

-- Refresh cache hints
NOTIFY pgrst, 'reload schema';
