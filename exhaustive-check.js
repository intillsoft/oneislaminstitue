
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const list = [
        'study_progress',
        'course_progress',
        'applications',
        'course_enrollments',
        'lesson_progress',
        'study_streaks',
        'jobs'
    ];
    for (const t of list) {
        const { data, count, error } = await supabase.from(t).select('*', { count: 'exact' }).limit(0);
        if (error) {
            console.log(`${t}: ERROR - ${error.message}`);
        } else {
            console.log(`${t}: ${count} rows`);
        }
    }
}
check();
