
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
    const tables = ['jobs', 'applications', 'users', 'study_progress', 'certificates', 'donations', 'study_streaks', 'profiles'];
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) {
            console.log(`Table ${t}: FAILED (${error.message})`);
        } else {
            console.log(`Table ${t}: OK - Existing Columns:`, data.length > 0 ? Object.keys(data[0]) : 'Empty table');
        }
    }
}

checkSchema();
