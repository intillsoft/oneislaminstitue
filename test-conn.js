const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    const { data, error } = await supabase.from('course_modules').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('Connection failed:', error.message);
    } else {
        console.log('Connection successful! Total modules:', data);
    }
}

test();
