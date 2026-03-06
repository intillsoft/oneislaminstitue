
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkJobs() {
    console.log("Checking jobs table...");
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    if (error) {
        console.error("Error:", error);
    } else if (data && data.length > 0) {
        Object.keys(data[0]).forEach(col => console.log(col));
    } else {
        console.log("Table is empty.");
    }
}

checkJobs();
