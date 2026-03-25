const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    // 1. Find Lesson 1.4
    const { data: lessons, error } = await supabase
        .from('course_lessons')
        .select('id, title, module_id')
        .or('title.ilike.%1.4%,title.ilike.%truth%');

    if (error) {
        console.error('Error fetching lessons:', error);
        return;
    }

    console.log('--- FOUND LESSONS ---');
    console.log(JSON.stringify(lessons, null, 2));
}

run();
