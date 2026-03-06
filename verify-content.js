const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('--- Course Verification ---');
  const { data: courses, error: cErr } = await supabase
    .from('jobs')
    .select('id, title')
    .ilike('title', '%Foundations of Islamic Faith%');
    
  if (cErr) {
    console.error('Error fetching courses:', cErr.message);
    return;
  }
  
  if (courses.length === 0) {
    console.log('No courses found matching "Foundations of Islamic Faith"');
    return;
  }
  
  console.log(`Found ${courses.length} course(s):`);
  courses.forEach(c => console.log(`- ID: ${c.id}, Title: "${c.title}"`));
  
  const courseId = courses[0].id;
  
  console.log('\n--- Module Verification ---');
  const { data: modules, error: mErr } = await supabase
    .from('course_modules')
    .select('id, title, sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true });
    
  if (mErr) {
    console.error('Error fetching modules:', mErr.message);
    return;
  }
  
  console.log(`Found ${modules.length} modules:`);
  for (const mod of modules) {
    const { data: lessons, count } = await supabase
      .from('course_lessons')
      .select('id, title, content_blocks', { count: 'exact' })
      .eq('module_id', mod.id);
      
    console.log(`- Module: "${mod.title}" (ID: ${mod.id}, Order: ${mod.sort_order}) - Lessons: ${count || 0}`);
    if (lessons && lessons.length > 0) {
        lessons.slice(0, 3).forEach(l => {
            const hasBlocks = l.content_blocks && Array.isArray(l.content_blocks) && l.content_blocks.length > 0;
            console.log(`  - Lesson: "${l.title}" (Content: ${hasBlocks ? 'YES' : 'NO'})`);
        });
    }
  }
}

verify();
