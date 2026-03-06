
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLS() {
    console.log("Checking RLS policies...");
    // We can't query pg_policies directly via Supabase client easily unless we have an RPC
    // But we can try to perform operations as the service role and see if it works, 
    // contrasted with the anon/authenticated role.
    
    // Let's try to get a list of all policies if possible (often blocked)
    const { data, error } = await supabase.rpc('get_policies'); // Usually doesn't exist by default
    if (error) {
        console.log("RPC get_policies failed, expected.");
    } else {
        console.log("Policies:", data);
    }
}

checkRLS();
