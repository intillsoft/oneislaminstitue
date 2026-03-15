import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function main() {
    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing SUPABASE env vars.");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: sample } = await supabase
         .from('course_lessons')
         .select('*')
         .limit(1);
    
    console.log("Found sample count:", sample ? sample.length : 0);
    if (sample) {
         fs.writeFileSync('lookup_output.txt', JSON.stringify(sample, null, 2));
         process.exit(0);
    }

    if (courses && courses.length > 0) {
        const courseId = courses[0].id;
        const { data: modules } = await supabase
            .from('course_modules')
            .select('id, title, sort_order')
            .eq('course_id', courseId)
            .order('sort_order', { ascending: true });

        console.log("Modules structure:", JSON.stringify(modules, null, 2));

        if (modules && modules.length > 0) {
            const moduleId = modules[0].id; // Assuming first module is Module 1
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
