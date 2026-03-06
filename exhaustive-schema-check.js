
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getFullSchema() {
    const { data, error } = await supabase.rpc('get_schema_details');
    if (error) {
        // If RPC doesn't exist, try postgrest information schema if available
        // Usually Supabase doesn't expose information_schema via PostgREST unless configured.
        // Let's try to just guess and check columns for the most important tables.
        const tables = ['applications', 'jobs', 'users', 'profiles', 'study_progress', 'certificates', 'donations'];
        for (const table of tables) {
            console.log(`\n--- TABLE: ${table} ---`);
            const { data: cols, error: err } = await supabase.from(table).select('*').limit(1);
            if (err) {
                console.log(`Error: ${err.message}`);
            } else if (cols && cols.length > 0) {
                console.log(`Columns: ${Object.keys(cols[0]).join(', ')}`);
            } else {
                console.log('Empty table or no columns returned');
                // Try to insert a dummy and rollback? No, risky.
                // Let's try to select specific known columns to see if they exist.
                const possibleCols = ['id', 'created_at', 'user_id', 'course_id', 'job_id', 'status', 'applied_at', 'enrolled_at'];
                for (const col of possibleCols) {
                    const { error: colErr } = await supabase.from(table).select(col).limit(1);
                    if (!colErr) {
                        process.stdout.write(`${col}, `);
                    }
                }
                console.log();
            }
        }
    } else {
        console.log(data);
    }
}

getFullSchema();
