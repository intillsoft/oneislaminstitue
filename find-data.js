
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findProgress() {
    const candidateTables = [
        'study_progress', 'course_progress', 'lesson_progress', 
        'applications', 'enrollments', 'enrolled_courses', 
        'course_enrollments', 'study_streaks'
    ];
    
    for (const t of candidateTables) {
        console.log(`\n--- Checking ${t} ---`);
        const { data, error, count } = await supabase.from(t).select('*', { count: 'exact' }).limit(1);
        if (error) {
            console.log(`  ERROR: ${error.message} (${error.code})`);
        } else {
            console.log(`  COUNT: ${count} rows`);
            if (data && data.length > 0) {
                console.log(`  SAMPLE: ${JSON.stringify(data[0]).substring(0, 100)}...`);
                console.log(`  COLUMNS: ${Object.keys(data[0]).join(', ')}`);
            }
        }
    }
}

findProgress();
