const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
  if (!course) return console.log('Course not found');

  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('title, content_blocks')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })
    .limit(14);

  lessons.forEach(l => {
    console.log(`Lesson: "${l.title}" | Blocks: ${l.content_blocks?.length || 0} | First Block Type: ${l.content_blocks?.[0]?.type || 'N/A'}`);
  });
}

check();
