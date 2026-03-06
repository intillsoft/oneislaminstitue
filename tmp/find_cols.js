
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function findCols() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Using a row to find all columns that might have 'min' or 'max' or are nulled
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    
    if (data && data.length > 0) {
        const row = data[0];
        const keys = Object.keys(row);
        const matches = keys.filter(k => k.includes('min') || k.includes('max') || k.includes('amount') || k.includes('donation'));
        console.log('--- Matching columns found ---');
        console.log(matches);
        console.log('--- All columns for reference ---');
        console.log(keys);
    }
}

findCols();
