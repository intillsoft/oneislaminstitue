const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data: courses } = await supabase.from('courses').select('id, title').limit(3);
    const { data: modules } = await supabase.from('course_modules').select('id, course_id, title').limit(5);
    const { data: lessons, error } = await supabase.from('course_lessons').select('id, module_id, title').limit(5);
    
    console.log(JSON.stringify({ courses, modules, lessons, error }, null, 2));
}

checkData();
