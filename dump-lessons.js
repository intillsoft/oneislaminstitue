const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
    const { data: modules, error: modErr } = await supabase
        .from('course_modules')
        .select('id, title, sort_order')
        .eq('course_id', COURSE_ID)
        .order('sort_order');
        
    for (const m of modules) {
        if (m.sort_order >= 4 && m.sort_order <= 8) {
            console.log(`\nMod [${m.sort_order}]: ${m.title}`);
            const { data: lessons, } = await supabase
                .from('course_lessons')
                .select('id, title, sort_order')
                .eq('module_id', m.id)
                .order('sort_order');
            
            lessons.forEach(l => {
                console.log(`  { id: "${l.id}", title: "${l.title}" },`);
            });
        }
    }
}

main();
