-- Fix users table role constraint to include 'talent'
-- Run this in Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint with 'talent' role included
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('job-seeker', 'recruiter', 'admin', 'talent'));

-- Verify the constraint
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
  AND conname = 'users_role_check';









