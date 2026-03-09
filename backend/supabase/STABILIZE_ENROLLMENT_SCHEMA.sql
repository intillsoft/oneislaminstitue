-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: ENROLLMENT SCHEMA STABILIZATION
-- Fixes missing relationships and ensures course-student connectivity
-- ============================================================================

-- 1. Ensure 'jobs' table has required indexes
CREATE INDEX IF NOT EXISTS idx_jobs_id ON jobs(id);

-- 2. Repair 'applications' table
-- Add columns if missing and ensure foreign key relationships exist
DO $$ 
BEGIN
    -- Ensure user_id exists and references users
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'user_id') THEN
        ALTER TABLE applications ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
    ELSE
        -- Ensure foreign key constraint exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc 
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name 
            WHERE tc.table_name = 'applications' AND kcu.column_name = 'user_id' AND tc.constraint_type = 'FOREIGN KEY'
        ) THEN
            ALTER TABLE applications ADD CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- Ensure job_id exists and references jobs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'job_id') THEN
        ALTER TABLE applications ADD COLUMN job_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    ELSE
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc 
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name 
            WHERE tc.table_name = 'applications' AND kcu.column_name = 'job_id' AND tc.constraint_type = 'FOREIGN KEY'
        ) THEN
            ALTER TABLE applications ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- Ensure course_id exists and references jobs (synchronizing synonyms)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'course_id') THEN
        ALTER TABLE applications ADD COLUMN course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    ELSE
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc 
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name 
            WHERE tc.table_name = 'applications' AND kcu.column_name = 'course_id' AND tc.constraint_type = 'FOREIGN KEY'
        ) THEN
            ALTER TABLE applications ADD CONSTRAINT applications_course_id_fkey FOREIGN KEY (course_id) REFERENCES jobs(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 3. Data Synchronization: Ensure both job_id and course_id are populated if one is missing
UPDATE applications SET course_id = job_id WHERE course_id IS NULL AND job_id IS NOT NULL;
UPDATE applications SET job_id = course_id WHERE job_id IS NULL AND course_id IS NOT NULL;

-- 4. RepaiR companies relationship (for course:jobs join)
-- Ensure jobs(department_id) references companies(id)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'department_id') THEN
        ALTER TABLE jobs ADD COLUMN department_id UUID REFERENCES companies(id) ON DELETE SET NULL;
    ELSE
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc 
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name 
            WHERE tc.table_name = 'jobs' AND kcu.column_name = 'department_id' AND tc.constraint_type = 'FOREIGN KEY'
        ) THEN
            ALTER TABLE jobs ADD CONSTRAINT jobs_department_id_fkey FOREIGN KEY (department_id) REFERENCES companies(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- 5. Final Notify to PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
