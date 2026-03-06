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
    .eq('content_blocks', '[]');

  console.log(`Lessons with empty blocks: ${lessons?.length || 0}`);
  
  const { data: filledLessons } = await supabase
    .from('course_lessons')
    .select('title, content_blocks')
    .eq('course_id', course.id)
    .neq('content_blocks', '[]');

  console.log(`Filled Lessons: ${filledLessons?.length || 0}`);
  filledLessons?.forEach(l => {
     console.log(`- ${l.title}: ${l.content_blocks?.[0]?.type}`);
  });
}

check();
