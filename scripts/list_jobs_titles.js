import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function start() {
    const { data, error } = await supabase.from('jobs').select('id, title');
    if (error) {
         console.error("Error Status:", error.message);
         return;
    }
    console.log("Titles in 'jobs' table:");
    data.forEach(j => console.log(`- "${j.title}" (ID: ${j.id})`));
}

start();
