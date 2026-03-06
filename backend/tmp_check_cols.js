import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkColumns() {
    const { data, error } = await supabase.from('notifications').select('*').limit(1);
    if (error) {
        console.error('ERROR:', error);
    } else {
        if (data && data.length > 0) {
            console.log('NOTIFICATION COLUMNS:', Object.keys(data[0]));
        } else {
            console.log('No notifications found to check columns.');
        }
    }
}

checkColumns();
