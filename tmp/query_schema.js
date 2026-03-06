
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function getDefiningSQL() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('--- Fetching column info from information_schema ---');
    const { data, error } = await supabase.rpc('execute_sql', {
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'jobs' AND table_schema = 'public'"
    });
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns from information_schema:', data);
    }
}

getDefiningSQL();
