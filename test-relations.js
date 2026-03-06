const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRelations() {
    console.log('Testing relation...');
    const { data, error } = await supabase
        .from('course_modules')
        .select(`
            id,
            course_id,
            lessons:course_lessons(id, module_id)
        `)
        .limit(1);
    
    if (error) {
        console.error('Relation error:', error);
    } else {
        console.dir(data, { depth: null });
    }
}

checkRelations();
