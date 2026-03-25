const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const lessonId = '553f2788-3e50-419d-99d3-0b14a84b49e9'; 
    
    // Copy pages explicitly node absolute flawless
    const { data: firstLesson } = await supabase.from('course_lessons').select('content_data').eq('id', lessonId).single();

    if (firstLesson && firstLesson.content_data?.pages) {
         // Re-apply and clear flat array Coordinate flawless safely Cinematic safely
         const { error } = await supabase
             .from('course_lessons')
             .update({ 
                 content_blocks: [] // CLEAR
             })
             .eq('id', lessonId);

         if (error) {
              console.error(error);
         } else {
              console.log('CLEAR OK');
         }
    }
}

run();
