-- Add is_paid column and verify salary_max/salary_min
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='is_paid') THEN
        ALTER TABLE jobs ADD COLUMN is_paid BOOLEAN DEFAULT false;
    END IF;

    -- Ensure salary_max exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_max') THEN
        ALTER TABLE jobs ADD COLUMN salary_max NUMERIC DEFAULT 0;
    END IF;
END $$;
