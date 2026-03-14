import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const tables = ['users', 'notifications', 'donations', 'applications', 'notification_preferences'];
    
    console.log('--- Table Presence Check ---');
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`❌ Table "${table}" error:`, error.message);
        } else {
            console.log(`✅ Table "${table}" exists.`);
        }
    }

    console.log('\n--- Column Check (notifications) ---');
    const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'notifications' });
    if (colError) {
        // Fallback if RPC doesn't exist
        const { data: sample, error: sampleError } = await supabase.from('notifications').select('*').limit(1);
        if (sampleError) {
             console.error('Could not fetch sample from notifications');
        } else if (sample && sample.length > 0) {
             console.log('Columns in notifications:', Object.keys(sample[0]).join(', '));
        } else {
            console.log('Notifications table is empty, columns cannot be inferred via select *');
        }
    } else {
        console.log('Columns in notifications:', cols);
    }
}

checkSchema();
