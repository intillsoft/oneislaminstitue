const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
  const { data: mods, error: modErr } = await supabase.from('course_modules').select('id, title').eq('course_id', COURSE_ID).limit(1);
  if (modErr || !mods) {
    console.error('Module error:', modErr);
    return;
  }
  const m = mods[0];
  console.log('MODULE:', m.title);
  const { data: lessons, error: lesErr } = await supabase.from('course_lessons').select('id, title, "order", content_blocks').eq('module_id', m.id).order('order');
  if (lesErr || !lessons) {
    console.error('Lesson error:', lesErr);
    return;
  }
  lessons.forEach(l => {
    console.log(`  [order: ${l.order}] [${l.content_blocks ? l.content_blocks.length : 0} blocks] ${l.title}`);
  });
}

main();
