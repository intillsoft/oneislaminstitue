import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testRPC() {
    console.log("Testing execute_sql RPC...");
    const { data, error } = await supabase.rpc('execute_sql', { sql: 'SELECT 1' });
    if (error) {
        console.log('execute_sql NOT available:', error.message);
    } else {
        console.log('execute_sql IS available!', data);
    }
}

testRPC();
