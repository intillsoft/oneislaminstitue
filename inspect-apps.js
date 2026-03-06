
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectApplications() {
    const { data, error } = await supabase.from('applications').select('id, course_id, job_id, user_id, status').limit(5);
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Applications data:", JSON.stringify(data, null, 2));
    }
}

inspectApplications();
