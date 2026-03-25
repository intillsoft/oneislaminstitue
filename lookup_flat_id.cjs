const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const { data: lessons, error } = await supabase
        .from('course_lessons')
        .select('id, title')
        .or('title.ilike.%1.4%,title.ilike.%Truth%');

    if (error) {
        fs.writeFileSync('results_id.txt', JSON.stringify(error, null, 2), 'utf8');
        return;
    }

    const output = lessons.map(l => `${l.id} === ${l.title}`).join('\n');
    fs.writeFileSync('results_id.txt', output, 'utf8');
    console.log('OUTPUT SAVED OK');
}

run();
