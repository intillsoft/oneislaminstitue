
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function checkTypes() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('--- Checking column types in jobs ---');
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    
    if (data && data.length > 0) {
        const row = data[0];
        console.log('Sample Row values and types:');
        for (const key of ['salary', 'salary_min', 'salary_max', 'price', 'min', 'max']) {
            if (row.hasOwnProperty(key)) {
                console.log(`${key}: ${JSON.stringify(row[key])} (${typeof row[key]})`);
            }
        }
    } else {
        console.log('No rows found to check types.');
    }
}

checkTypes();
