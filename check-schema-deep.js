
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
    const tables = ['jobs', 'applications', 'study_progress', 'lesson_progress', 'profiles'];
    for (const table of tables) {
        console.log(`\n--- ${table} ---`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Error: ${error.message} (Code: ${error.code})`);
        } else if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]).join(', '));
        } else {
            console.log('Table found but empty.');
            // Try to get columns by selecting just the ID
            const { error: idError } = await supabase.from(table).select('id').limit(1);
            if (idError) {
                console.log(`ID check error: ${idError.message}`);
            } else {
                console.log('Table exists.');
            }
        }
    }
}

checkSchema();
