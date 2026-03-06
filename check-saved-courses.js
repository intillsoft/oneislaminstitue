import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSavedCourses() {
    const { data, error } = await supabase.from('saved_courses').select('*').limit(1);
    
    if (error) {
        console.error("Error fetching saved_courses:", error.message);
    } else if (data && data.length > 0) {
        console.log("COLUMNS in saved_courses:", Object.keys(data[0]).join(', '));
    } else {
        console.log("Empty or missing saved_courses. Let's try to query pg_class if possible, else we'll assume it exists but without job_id.");
    }
}

checkSavedCourses();
