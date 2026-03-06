
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const tables = ['study_progress', 'course_progress', 'applications', 'course_enrollments', 'lesson_progress'];
    for (const t of tables) {
        try {
            const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
            if (error) {
                console.log(`${t}: ERROR - ${error.message}`);
            } else {
                console.log(`${t}: ${count} rows`);
            }
        } catch (e) {
            console.log(`${t}: EXCEPTION - ${e.message}`);
        }
    }
}

check();
