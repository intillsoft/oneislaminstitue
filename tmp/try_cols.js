
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function tryAddCols() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('--- Attempting to add min/max columns to confirm existence ---');
    // Using an RPC that executes SQL if it exists, or just try to insert into them
    const { error: errMin } = await supabase.from('jobs').insert({ title: 'Check', company: 'Check', min: 1 });
    if (errMin && errMin.message.includes('column "min" does not exist')) {
        console.log('Column "min" definitely does NOT exist.');
    } else if (errMin) {
        console.log('Column "min" might exist, but insert failed:', errMin.message);
    } else {
        console.log('Column "min" EXISTS and insert succeeded!');
    }

    const { error: errMax } = await supabase.from('jobs').insert({ title: 'Check', company: 'Check', max: 1 });
    if (errMax && errMax.message.includes('column "max" does not exist')) {
        console.log('Column "max" definitely does NOT exist.');
    } else {
        console.log('Column "max" result:', errMax ? errMax.message : 'EXISTS');
    }
}

tryAddCols();
