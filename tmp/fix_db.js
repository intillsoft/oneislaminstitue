const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sql = `
CREATE TABLE IF NOT EXISTS public.auto_apply_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT false,
    frequency TEXT DEFAULT 'daily',
    check_interval_minutes INTEGER DEFAULT 1440,
    last_check_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id)
);

ALTER TABLE public.auto_apply_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'auto_apply_settings' AND policyname = 'Users can manage own auto_apply_settings'
    ) THEN
        CREATE POLICY "Users can manage own auto_apply_settings" 
            ON public.auto_apply_settings FOR ALL 
            USING (auth.uid() = user_id);
    END IF;
END $$;
`;

async function run() {
    console.log("Running SQL to create auto_apply_settings...");
    const { data, error } = await supabase.rpc('execute_sql', { sql });
    if (error) {
        console.error("RPC Error:", error);
        // Fallback to direct query if RPC execute_sql is not available
        console.log("Attempting direct table creation check...");
        const { error: tableError } = await supabase.from('auto_apply_settings').select('id').limit(1);
        if (tableError) {
            console.log("Table definitely missing. Please run the SQL manually in Supabase Dashboard.");
        } else {
            console.log("Table exists.");
        }
    } else {
        console.log("SQL executed successfully.");
    }
}

run();
