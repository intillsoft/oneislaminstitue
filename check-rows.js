
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRows() {
    const list = ['study_progress', 'lesson_progress', 'course_progress', 'applications', 'saved_courses'];
    for (const t of list) {
        const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`${t}: ERROR (${error.message})`);
        } else {
            console.log(`${t}: ${count} rows`);
        }
    }
}

checkRows();
