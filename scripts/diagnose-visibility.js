import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log("Reading data state for Module 1...");
    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    console.log(`Found Course: ${compass.title} (${compass.id})`);

    const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', compass.id).order('sort_order');
    const mod1 = modules[0];
    console.log(`Found Module: ${mod1.title} (${mod1.id})`);

    const { data: lessons } = await supabase.from('course_lessons').select('id, title, content_data').eq('module_id', mod1.id).order('sort_order');
    
    for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        const pageCount = l.content_data && l.content_data.pages ? l.content_data.pages.length : 0;
        console.log(`[Index ${i}] ID: ${l.id} | Title: ${l.title} | Pages: ${pageCount}`);
        if (i < 2) {
             console.log(JSON.stringify(l.content_data, null, 2).substring(0, 300) + "...\n");
        }
    }
}

check();
