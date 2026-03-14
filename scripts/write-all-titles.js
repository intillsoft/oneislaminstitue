import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
  
  let output = "";
  for (const course of courses) {
      output += `Course: ${course.title}\n`;
      const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', course.id).order('sort_order');
      for (const mod of modules) {
          output += `  Module: ${mod.title}\n`;
          const { data: lessons } = await supabase.from('course_lessons').select('id, title, sort_order').eq('module_id', mod.id).order('sort_order');
          for (const les of lessons) {
              output += `    ${les.sort_order}: ${les.title}\n`;
          }
      }
      output += `\n`;
  }
  
  fs.writeFileSync('scripts/course-structure-view.txt', output);
  console.log("Done writing course-structure-view.txt");
}

check().catch(console.error);
