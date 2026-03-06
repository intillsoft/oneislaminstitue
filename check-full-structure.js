const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
  const { data: mods, error: modErr } = await supabase
    .from('course_modules')
    .select('id, title, sort_order')
    .eq('course_id', COURSE_ID)
    .order('sort_order');

  if (modErr) {
    console.error('Module error:', modErr);
    return;
  }

  console.log('--- Course Structure ---');
  for (const m of mods) {
    console.log(`\nMODULE [${m.sort_order}]: ${m.title} (${m.id})`);
    const { data: lessons, error: lesErr } = await supabase
      .from('course_lessons')
      .select('id, title, sort_order, content_blocks')
      .eq('module_id', m.id)
      .order('sort_order');

    if (lesErr) {
      console.error('Lesson error:', lesErr);
      continue;
    }

    lessons.forEach(l => {
      const blockCount = l.content_blocks ? l.content_blocks.length : 0;
      console.log(`  Lesson [${l.sort_order}]: ${l.title} (${l.id}) (${blockCount} blocks)`);
    });
  }
}

main();
