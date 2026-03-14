import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function run() {
  try {
    const { data: courses, error } = await supabase.from('jobs').select('id, title, is_published, total_modules, total_lessons').order('created_at', { ascending: true });
    if (error) throw error;
    fs.writeFileSync('tmp_courses.json', JSON.stringify(courses, null, 2));
    console.log(`Saved ${courses.length} courses to tmp_courses.json`);

    const { data: modules, error: mErr } = await supabase.from('course_modules').select('id, course_id, title');
    fs.writeFileSync('tmp_modules.json', JSON.stringify(modules || [], null, 2));
    console.log(`Saved ${modules?.length} modules to tmp_modules.json`);

    const { data: lessons, error: lErr } = await supabase.from('course_lessons').select('id, module_id, course_id, title');
    fs.writeFileSync('tmp_lessons.json', JSON.stringify(lessons || [], null, 2));
    console.log(`Saved ${lessons?.length} lessons to tmp_lessons.json`);
    
  } catch (err) {
    console.error('Fatal error:', err);
  }
}
run();
