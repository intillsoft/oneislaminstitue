
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
    const tables = [
        'jobs', 'applications', 'users', 'profiles', 
        'courses', 'course_modules', 'course_lessons', 
        'enrollments', 'faculties', 'study_progress'
    ];
    
    console.log('--- Table Verification ---');
    for (const t of tables) {
        try {
            const { data, error } = await supabase.from(t).select('id').limit(1);
            if (error) {
                console.log(`Table ${t.padEnd(20)}: MISSING/ERROR (${error.message})`);
            } else {
                console.log(`Table ${t.padEnd(20)}: OK`);
            }
        } catch (e) {
            console.log(`Table ${t.padEnd(20)}: CRITICAL ERROR (${e.message})`);
        }
    }
}

checkTables();
