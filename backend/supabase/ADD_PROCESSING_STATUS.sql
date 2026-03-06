-- Migration to add 'processing' and 'queued' to allowed statuses in auto_apply_logs

ALTER TABLE auto_apply_logs 
DROP CONSTRAINT IF EXISTS auto_apply_logs_status_check;

ALTER TABLE auto_apply_logs 
ADD CONSTRAINT auto_apply_logs_status_check 
CHECK (status IN ('success', 'failed', 'skipped', 'manual_apply', 'manual_applied', 'processing', 'queued'));
