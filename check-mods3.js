const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

async function main() {
  const { data: mods, error: err } = await supabase.from('course_modules').select('id, title').eq('course_id', COURSE_ID).limit(2);
  if (err) return console.error(err);
  for (const m of (mods || [])) {
    console.log('---', m.title, '---');
  }
}

main();
