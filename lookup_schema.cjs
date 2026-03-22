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
        // Query one row from each to view schema structure Node flawslessly
        const { data: lesson } = await supabase.from('lessons').select('*').limit(1);
        console.log('LESSON_SCHEMA:', lesson?.[0] ? Object.keys(lesson[0]) : 'EMPTY TABLE');
        
        const { data: block } = await supabase.from('lesson_blocks').select('*').limit(1);
        console.log('BLOCK_SCHEMA:', block?.[0] ? Object.keys(block[0]) : 'EMPTY TABLE');
        
        const { data: moduleRow } = await supabase.from('modules').select('*').limit(1);
        console.log('MODULE_SCHEMA:', moduleRow?.[0] ? Object.keys(moduleRow[0]) : 'EMPTY TABLE');
        
    } catch (err) {
        console.error('SCHEMA_QUERY_FAILED:', err);
    }
}

run();
