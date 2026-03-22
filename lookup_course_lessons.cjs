const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
    try {
        const { data: cl, error } = await supabase.from('course_lessons').select('*').limit(1);
        if (error) {
             console.error('Course Lessons Query failed:', error.message);
        } else if (cl && cl.length > 0) {
             console.log('COURSE_LESSONS_COLUMNS:', Object.keys(cl[0]));
        } else {
             console.log('COURSE_LESSONS_COLUMNS: EMPTY TABLE');
        }
    } catch (err) {
        console.error('SEARCH_FAILED:', err);
    }
}

run();
