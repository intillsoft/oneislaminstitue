-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'usd',
    provider VARCHAR(50) NOT NULL, -- 'stripe' or 'paystack'
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    reference VARCHAR(255) NOT NULL UNIQUE, -- Provider transaction ID or reference
    type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'general' or 'course_enrollment'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Turn on RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own donations
CREATE POLICY "Users can view their own donations"
    ON public.donations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admins to view all donations
CREATE POLICY "Admins can view all donations"
    ON public.donations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'recruiter')
        )
    );

-- Insert policies (usually handled by service role/backend, but granting to auth just in case)
CREATE POLICY "Users can insert their own donations"
    ON public.donations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
-- Update policies (also handled by backend)
CREATE POLICY "Users can update their own donations"
    ON public.donations
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_donations_updated_at ON public.donations;
CREATE TRIGGER trigger_donations_updated_at
    BEFORE UPDATE ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION update_donations_updated_at();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_course_id ON public.donations(course_id);
CREATE INDEX IF NOT EXISTS idx_donations_reference ON public.donations(reference);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
