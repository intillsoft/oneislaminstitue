-- FIX NUMERIC OVERFLOWS
-- Increases precision of price to allow courses > $9.99
-- Ensures estimated duration is treated accurately as an integer
-- Keeps difficulty rating at 3,2 (e.g. 4.95)

ALTER TABLE public.jobs ALTER COLUMN price TYPE NUMERIC(15,2);
ALTER TABLE public.jobs ALTER COLUMN difficulty_rating TYPE NUMERIC(4,2);
ALTER TABLE public.jobs ALTER COLUMN estimated_duration_hours TYPE INTEGER USING estimated_duration_hours::INTEGER;

-- Reload schema cache to ensure seamless API usage
NOTIFY pgrst, 'reload schema';
