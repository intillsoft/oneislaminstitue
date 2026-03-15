import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function locate() {
    console.log("Searching for Lesson titles like 'Who Am I'...");
    const { data: lessons, error } = await supabase.from('course_lessons').select('id, title, module_id').ilike('title', '%Who Am I%');
    if (error) {
        console.error("Lesson query error:", error.message);
        return;
    }
    
    if (lessons.length === 0) {
        console.log("No lessons found containing 'Who Am I'. Searching module 'The Big Questions'...");
        const { data: mods } = await supabase.from('course_modules').select('id, title, course_id').ilike('title', '%Big Questions%');
        if (mods && mods.length > 0) {
            console.log("Found Module:", mods[0].title);
            const { data: course } = await supabase.from('courses').select('id, title').eq('id', mods[0].course_id);
            console.log(`Target Found! Course Title: "${course[0].title}" (${course[0].id})`);
        } else {
            console.log("No modules called Big Questions either. Checking ALL modules to map to courses...");
            const { data: allMods } = await supabase.from('course_modules').select('id, title, course_id').limit(10);
            allMods.forEach(m => console.log(`Mod: ${m.title} | Course ID: ${m.course_id}`));
        }
    } else {
         console.log(`Found ${lessons.length} lessons. First ID: ${lessons[0].id}`);
         const { data: mod } = await supabase.from('course_modules').select('id, title, course_id').eq('id', lessons[0].module_id);
         console.log(`Matches Module: "${mod[0].title}"`);
         const { data: course } = await supabase.from('courses').select('id, title').eq('id', mod[0].course_id);
         console.log(`Matches Course: "${course[0].title}" (${course[0].id})`);
    }
}

locate();
