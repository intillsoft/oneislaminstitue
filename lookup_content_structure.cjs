const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const { data: lesson, error } = await supabase
        .from('course_lessons')
        .select('content_blocks')
        .eq('id', '553f2788-3e50-419d-99d3-0b14a84b49e9')
        .single();

    if (error) {
        fs.writeFileSync('lesson_content_structure.txt', JSON.stringify(error, null, 2), 'utf8');
        return;
    }

    fs.writeFileSync('lesson_content_structure.txt', JSON.stringify(lesson.content_blocks, null, 2), 'utf8');
    console.log('CONTENT READ OK');
}

run();
