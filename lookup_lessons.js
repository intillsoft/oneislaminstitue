require('dotenv').config();`r`nconst { createClient } = require('@supabase/supabase-js');`nconst supabaseUrl = process.env.VITE_SUPABASE_URL;`nconst supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
// Need to load env vars? I can use the same variables the script runs with or just read .env
const fs = require('fs');

async function main() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
         console.error("Missing SUPABASE env vars.");
         return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Find Course
    const { data: courses } = await supabase
         .from('courses')
         .select('id, title')
         .ilike('title', '%Compass%');

    console.log("Found Courses:", JSON.stringify(courses, null, 2));

    if (courses && courses.length > 0) {
         const courseId = courses[0].id;
         // 2. Find Modules
         const { data: modules } = await supabase
              .from('course_modules')
              .select('id, title, sort_order')
              .eq('course_id', courseId)
              .order('sort_order', { ascending: true });

         console.log("Modules structure:", JSON.stringify(modules, null, 2));

         if (modules && modules.length > 0) {
              const moduleId = modules[0].id; // Assuming first module is Module 1
              // 3. Find Lessons
              const { data: lessons } = await supabase
                   .from('course_lessons')
                   .select('id, title, sort_order')
                   .eq('module_id', moduleId)
                   .order('sort_order', { ascending: true });

              console.log("Lessons structure:", JSON.stringify(lessons, null, 2));
         }
    }
}

main();
