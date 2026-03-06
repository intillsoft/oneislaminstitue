
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
    for (const table of ['applications', 'study_progress', 'lesson_progress']) {
        console.log(`\n--- ${table} ---`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(error);
        } else if (data && data.length > 0) {
            Object.keys(data[0]).forEach(col => console.log(col));
        } else {
            console.log("Empty");
        }
    }
}

checkTables();
