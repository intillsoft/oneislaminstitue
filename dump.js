import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
   const { data: courses } = await supabase.from('jobs').select('*').order('created_at', {ascending: false}).limit(10);
   fs.writeFileSync('courses_dump.json', JSON.stringify(courses, null, 2));

   // Let's also dump the modules for the first course
   const firstCourseId = courses[courses.length-1].id; // The Compass
   const { data: modules } = await supabase.from('course_modules').select('*').eq('course_id', firstCourseId).order('sort_order', {ascending: true});
   fs.writeFileSync('modules_dump.json', JSON.stringify(modules, null, 2));

   const { data: lessons } = await supabase.from('course_lessons').select('*').eq('module_id', modules[0].id).order('sort_order', {ascending: true});
   fs.writeFileSync('lessons_dump.json', JSON.stringify(lessons, null, 2));
})();
