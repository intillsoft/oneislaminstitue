import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
  console.log('--- Inspecting DB ---');
  
  const { data: courses, error: errC } = await supabase.from('jobs').select('id, title, type');
  if (errC) console.error('Error fetching jobs:', errC);
  console.log(`Total courses (jobs): ${courses?.length}`);
  if (courses) {
    courses.forEach(c => console.log(`- [${c.id}] ${c.title} (type: ${c.type})`));
  }
  
  const tables = ['course_modules', 'course_lessons', 'user_progress', 'user_course_progress', 'user_lesson_progress', 'user_enrollments', 'user_lesson_completion', 'user_certificates', 'user_transactions'];
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (!error) console.log(`Table ${t} count: ${count}`);
    else console.log(`Table ${t} check failed: ${error?.message}`);
  }
}

inspectDb().catch(console.error);
