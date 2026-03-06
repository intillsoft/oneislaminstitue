
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
    console.log("Listing tables via RPC if available...");
    // Often there's an RPC to list tables or we can try to query information_schema.tables (but usually restricted)
    // Another way is to try common names.
    const commonNames = [
        'jobs', 'applications', 'users', 'profiles', 'course_progress', 'lesson_progress', 
        'study_progress', 'study_streaks', 'course_enrollments', 'enrolled_courses',
        'enrollments', 'certificates', 'course_modules', 'course_lessons', 'companies'
    ];
    
    for (const table of commonNames) {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`${table}: NOT FOUND or ERROR (${error.message})`);
        } else {
            console.log(`${table}: EXISTS`);
        }
    }
}

listTables();
