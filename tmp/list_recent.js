
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

async function listRecent() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data } = await supabase.from('jobs').select('id, title, salary_min, salary_max, price, created_at').order('created_at', { ascending: false }).limit(5);
    console.log('--- Last 5 courses in DB ---');
    console.log(JSON.stringify(data, null, 2));
}

listRecent();
