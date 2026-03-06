const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const s = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
    const { data: mods } = await s.from('course_modules').select('id, title, sort_order').eq('course_id', CID).order('sort_order');
    const { data: lessons } = await s.from('course_lessons').select('id, module_id, title, sort_order, content_blocks').eq('course_id', CID).order('sort_order');

    mods.forEach(m => {
        console.log('\nMOD: ' + m.sort_order + ' - ' + m.title + ' | ' + m.id);
        lessons.filter(l => l.module_id === m.id).forEach(l => {
            const ct = l.content_blocks?.length || 0;
            console.log('  [' + ct + '] ' + l.title + ' | ' + l.id);
        });
    });
}
main();
