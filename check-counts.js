
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCounts() {
    const tables = ['jobs', 'courses', 'course_modules', 'course_lessons', 'applications'];
    console.log('--- Table Counts ---');
    for (const t of tables) {
        try {
            const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
            if (error) {
                console.log(`${t.padEnd(20)}: ERROR (${error.message})`);
            } else {
                console.log(`${t.padEnd(20)}: ${count} rows`);
            }
        } catch (e) {
            console.log(`${t.padEnd(20)}: CRITICAL ERROR (${e.message})`);
        }
    }
}

checkCounts();
