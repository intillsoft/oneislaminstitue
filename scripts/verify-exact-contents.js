import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
  const course = courses.find(c => c.title.includes('The Compass'));
  
  const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', course.id).order('sort_order');
  const mod1 = modules[0]; // Module 1
  
  const { data: lessons } = await supabase.from('course_lessons').select('id, title, content_data').eq('module_id', mod1.id).order('sort_order');
  
  const lesson1_1 = lessons[0];
  console.log(`Contents for: ${lesson1_1.title}`);
  console.log(JSON.stringify(lesson1_1.content_data?.pages?.[0]?.content, null, 2));
}

check().catch(console.error);
