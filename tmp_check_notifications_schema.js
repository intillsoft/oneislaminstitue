
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking notifications table schema...');
    
    // Try to get one row to see columns
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching from notifications:', error);
        
        // If it's a "column does not exist" error, we can still see which columns WERE found if we try to select them individually
        // But a better way is to use RPC or just check which ones fail
    } else {
        console.log('Columns found:', data.length > 0 ? Object.keys(data[0]) : 'Table is empty, cannot determine columns this way');
    }

    // Try to list columns from information_schema
    const { data: columns, error: colError } = await supabase
        .rpc('get_table_columns', { table_name: 'notifications' });

    if (colError) {
        console.log('RPC get_table_columns failed (expected if not defined). Trying direct query...');
        const { data: infoCols, error: infoError } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'notifications')
            .eq('table_schema', 'public');
        
        if (infoError) {
            console.error('Error querying information_schema:', infoError);
        } else {
            console.log('Columns from information_schema:', infoCols.map(c => c.column_name));
        }
    } else {
        console.log('Columns from RPC:', columns);
    }
}

checkSchema();
