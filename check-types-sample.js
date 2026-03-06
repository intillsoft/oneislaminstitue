const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColTypes() {
    // We can't query information_schema directly via PostgREST usually, 
    // unless there is an RPC. Let's try to query an existing course and see the data types in JS.
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    
    if (error) {
        console.error('Error fetching jobs:', error);
        return;
    }
    
    if (data.length === 0) {
        console.log('No jobs found. Cannot determine types from sample.');
        return;
    }
    
    const row = data[0];
    console.log('Sample course data types:');
    for (const key in row) {
        console.log(`${key}: ${typeof row[key]} (${row[key]})`);
    }
}

checkColTypes();
