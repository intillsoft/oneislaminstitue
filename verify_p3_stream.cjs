const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const lessonId = '42ab766d-1a0d-48d7-98c1-42dcd9240ab9'; 
    const { data: lesson } = await supabase.from('course_lessons').select('content_data').eq('id', lessonId).single();
    
    if (lesson && lesson.content_data?.pages) {
         const p3 = lesson.content_data.pages.find(p => p.page_number === 3);
         fs.writeFileSync('verify_p3.txt', JSON.stringify(p3, null, 2), 'utf8');
         console.log('VERIFY OK');
    }
}

run();
