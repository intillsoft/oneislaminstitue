
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function deepCheck() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('--- Deep Checking Columns via RPC ---');
    // Using a common trick to get column names if RPC isn't available: select with a limit of 0
    const { data: cols, error: err } = await supabase.from('jobs').select('*').limit(0);
    
    if (err) {
        console.error('Deep check failed:', err);
    } else {
        // This doesn't actually give columns in some Supabase versions if limit is 0
        // Let's just select 1 row and check keys
        const { data } = await supabase.from('jobs').select('*').limit(1);
        if (data && data.length > 0) {
            console.log('Keys in a real row:', Object.keys(data[0]));
        } else {
            console.log('No rows found, trying to create a course with min/max and see if it fails.');
            const { error: errorMin } = await supabase.from('jobs').insert({ title: 'Test', company: 'Test', min: 100 });
            console.log('Insert with "min" column error:', errorMin?.message);
            
            const { error: errorSMin } = await supabase.from('jobs').insert({ title: 'Test', company: 'Test', salary_min: 100 });
            console.log('Insert with "salary_min" column error:', errorSMin?.message);
        }
    }
}

deepCheck();
