import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function listTables() {
    const { data, error } = await supabase.rpc('get_tables'); // Or just query info schema
    if (error) {
        console.log("Rpc Error, trying raw sql select...");
        const { data: qData, error: qError } = await supabase.from('information_schema.tables').select('table_name'); // Wait, Supabase doesn't let select info_schema directly easily without rpc or explicit table
        // Let's just try to select from 'courses' table directly to see if it exists!
        const { data: cData, error: cError } = await supabase.from('courses').select('id, title').limit(5);
        if (cError) {
             console.log("Error querying 'courses':", cError.message);
        } else {
             console.log("Success querying 'courses'! Rows:", cData.length);
             if (cData.length > 0) console.log("Sample Course:", cData[0].title);
        }
    }
}
listTables();
