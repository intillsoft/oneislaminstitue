const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
  const { data: mods } = await supabase.from('course_modules').select('id, title, order').eq('course_id', COURSE_ID).order('order').limit(2);
  for (const m of (mods || [])) {
    console.log('---', m.title, '---');
    const { data: lessons } = await supabase.from('course_lessons').select('id, title, order, content_blocks').eq('module_id', m.id).order('order');
    for (const l of (lessons || [])) {
      console.log(`  [${l.content_blocks ? l.content_blocks.length : 0}] ${l.title}`);
    }
  }
}

main();
