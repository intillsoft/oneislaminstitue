import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function start() {
    const { data, error } = await supabase.from('courses').select('id, title');
    if (error) {
         console.error("Error:", error.message);
         return;
    }
    console.log("Titles in DB:");
    data.forEach(c => console.log(`- "${c.title}"`));
}

start();
