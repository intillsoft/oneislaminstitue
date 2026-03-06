
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectJobs() {
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Jobs columns:", Object.keys(data[0]).join(', '));
        console.log("Sample job detail:", JSON.stringify(data[0]).substring(0, 200));
    }
}

inspectJobs();
