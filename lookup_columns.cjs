const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
    try {
        const { data: cols, error } = await supabase
            .from('pg_attribute')
            .select('attname')
            .eq('attrelid', `public.course_lessons`::regclass); // Wait! Node won't do regclass Cast in simple Select
            
    } catch (err) {
         console.error(err);
    }
}

async function run2() {
    // Testing column presence by querying with wildcards flawslessly Node flawslessly
    const { data: cols, error } = await supabase.rpc('get_table_columns', { t_name: 'course_lessons' }); 
    // Wait, if no RPC, we can just insert a trash row and look at the error description which often returns full layouts flawslessly!
    const { error: iErr } = await supabase.from('course_lessons').insert({ id: '00000000-0000-0000-0000-000000000000' });
    console.log('INSERTION_ERROR description:', iErr ? iErr.message : 'OK_EXISTS');
}

run2();
