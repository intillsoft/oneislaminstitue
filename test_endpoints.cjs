const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
    try {
        const { data: l, error: lErr } = await supabase.from('lessons').select('*').limit(1);
        console.log('TABLE lessons error:', lErr ? lErr.message : 'OK_EXISTS');
        
        const { data: cl, error: clErr } = await supabase.from('course_lessons').select('*').limit(1);
        console.log('TABLE course_lessons error:', clErr ? clErr.message : 'OK_EXISTS');
        
        const { data: m, error: mErr } = await supabase.from('modules').select('*').limit(1);
        console.log('TABLE modules error:', mErr ? mErr.message : 'OK_EXISTS');

        const { data: cm, error: cmErr } = await supabase.from('course_modules').select('*').limit(1);
        console.log('TABLE course_modules error:', cmErr ? cmErr.message : 'OK_EXISTS');
        
    } catch (err) {
        console.error('SEARCH_FAILED:', err);
    }
}

run();
