-- Create role_change_requests table
CREATE TABLE IF NOT EXISTS role_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    requested_role VARCHAR(50) NOT NULL CHECK (requested_role IN ('talent', 'recruiter')),
    reason TEXT NOT NULL,
    talent_data JSONB,
    recruiter_data JSONB,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_role_change_requests_user_id ON role_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_change_requests_status ON role_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_role_change_requests_created_at ON role_change_requests(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own role change requests" ON role_change_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own requests
CREATE POLICY "Users can create own role change requests" ON role_change_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all requests
CREATE POLICY "Admins can view all role change requests" ON role_change_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Policy: Admins can update requests
CREATE POLICY "Admins can update role change requests" ON role_change_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_role_change_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_role_change_requests_updated_at
    BEFORE UPDATE ON role_change_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_role_change_requests_updated_at();










