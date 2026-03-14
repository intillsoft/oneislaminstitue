import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
  const course = courses.find(c => c.title.includes('The Compass'));
  const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', course.id).order('sort_order');
  
  // Outer Course titles
  console.log(`Course: ${course.title}`);
  for (const mod of modules) {
      console.log(`  Module: ${mod.title}`);
      const { data: lessons } = await supabase.from('course_lessons').select('id, title, sort_order').eq('module_id', mod.id).order('sort_order');
      for (const les of lessons) {
          console.log(`    ${les.sort_order}: ${les.title}`);
      }
  }
}
check().catch(console.error);
