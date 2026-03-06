const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
  const { data: mods, error: modErr } = await supabase.from('course_modules').select('id, title, sort_order').eq('course_id', COURSE_ID).order('sort_order').limit(2);
  if (modErr || !mods) {
    console.error('Module error:', modErr);
    return;
  }
  for (const m of mods) {
    console.log('MODULE:', m.title);
    const { data: lessons, error: lesErr } = await supabase.from('course_lessons').select('id, title, sort_order, content_blocks').eq('module_id', m.id).order('sort_order');
    if (lesErr || !lessons) {
      console.error('Lesson error:', lesErr);
      continue;
    }
    lessons.forEach(l => {
      console.log('  ', l.title, l.content_blocks ? l.content_blocks.length : 0);
    });
  }
}

main();
