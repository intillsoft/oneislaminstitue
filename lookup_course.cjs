const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.log('MISSING_CREDENTIALS');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
    try {
        // 1. Find Course
        const { data: courses, error: cErr } = await supabase
            .from('jobs')
            .select('id, title')
            .ilike('title', '%Compass%');
            
        if (cErr) throw cErr;
        console.log('COURSE_MATCHES:', courses);
        
        if (courses.length > 0) {
            const courseId = courses[0].id;
            // 2. Find Modules
            const { data: modules } = await supabase
                .from('modules')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });
                
            console.log('MODULES:', modules);
        }
    } catch (err) {
        console.error('SEARCH_FAILED:', err);
    }
}

run();
