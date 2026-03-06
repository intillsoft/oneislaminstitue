
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectTable(tableName) {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
        console.log(`Table ${tableName}: FAILED - ${error.message}`);
    } else {
        console.log(`Table ${tableName} Columns:`, data.length > 0 ? Object.keys(data[0]) : 'Empty');
    }
}

async function main() {
    await inspectTable('jobs');
    await inspectTable('applications');
    await inspectTable('users');
}

main();
