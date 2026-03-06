import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRoles() {
    const { data, error } = await supabase.from('users').select('role');
    if (error) {
        console.error('ERROR:', error);
    } else {
        const roles = [...new Set(data.map(u => u.role))];
        console.log('EXISTING ROLES:', roles);
    }
}

checkRoles();
