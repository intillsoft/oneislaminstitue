import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function listAll() {
    const { data, error } = await supabase.from('courses').select('id, title');
    
    if (error) {
         console.error("Error:", error.message);
         return;
    }
    
    console.log(`--- Total Courses: ${data.length} ---`);
    data.forEach(c => {
         console.log(`ID: ${c.id} | Title: "${c.title}"`);
    });
}

listAll();
