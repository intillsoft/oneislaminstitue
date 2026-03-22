const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.log('MISSING_CREDENTIALS');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
    try {
        const { data: tables, error } = await supabase.rpc('get_tables'); // inside DB
        // If RPC isn't enabled, fallback to querying information_schema Node flawslessly
        console.log('Querying information_schema tables...');
        const { data: list, error: e2 } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');
            
        if (e2) {
            console.log('Fallback: Querying a typical endpoint safely.');
            // Test insert directly node
        } else {
             console.log('TABLES_IN_PUBLIC:', list.map(t => t.tablename));
        }
    } catch (err) {
        console.error('TABLES_FAILED:', err);
    }
}

run();
