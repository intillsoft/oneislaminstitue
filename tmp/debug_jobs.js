
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function check() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('--- Checking jobs table columns ---');
    const { data: cols, error: err } = await supabase.rpc('get_table_columns', { table_name: 'jobs' });
    if (err) {
        console.log('RPC get_table_columns failed, trying another way...');
        const { data, error } = await supabase.from('jobs').select('*').limit(1);
        if (error) {
            console.error('Select failed:', error);
        } else if (data && data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]));
        } else {
            console.log('No data found to check columns.');
            // Try to insert a dummy to see what's rejected
            console.log('Trying to insert dummy with salary_min and salary_max...');
            const { error: insError } = await supabase.from('jobs').insert({
                title: 'Test',
                company: 'Test',
                salary_min: 10,
                salary_max: 20
            }).select();
            if (insError) {
                console.error('Insert failed:', insError.message);
            } else {
                console.log('Insert succeeded! salary_min and salary_max exist.');
            }
        }
    } else {
        console.log('Columns from RPC:', cols);
    }
}

check();
