import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- DB Schema Check ---');
    
    // 1. Check Tables
    const { data: tables, error: tErr } = await supabase.rpc('get_tables'); 
    // Wait, rpc might not exist. Let's list some tables via queries or check if they exist.
    
    // 2. Fetch Course "The Compass"
    const { data: courses, error: cErr } = await supabase.from('jobs').select('id, title').ilike('title', '%Compass%');
    console.log('Courses with Compass:', courses, cErr ? cErr.message : '');

    // 3. Describe course_lessons columns
    const { data: cols, error: lErr } = await supabase.from('course_lessons').select('*').limit(1);
    console.log('Sample Lesson:', cols ? Object.keys(cols[0] || {}) : 'No lessons found');
    
    // 4. Check if lesson_pages table exists
    const { data: pages, error: pErr } = await supabase.from('lesson_pages').select('id').limit(1);
    console.log('Lesson Pages Table Exists:', !pErr, pErr ? pErr.message : '');

    // 5. If lesson_pages exists, describe it
    if (!pErr && pages && pages.length > 0) {
        const { data: pageCols } = await supabase.from('lesson_pages').select('*').limit(1);
        console.log('Lesson Page Columns:', Object.keys(pageCols[0] || {}));
    }
}

check().catch(console.error);
