const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function check() {
    const { data, error } = await supabase
        .from('course_lessons')
        .select('content_blocks');
        
    if (error) {
        console.error('DB_ERROR', error);
    } else {
        const types = new Set();
        data.forEach(l => {
            if (Array.isArray(l.content_blocks)) {
                l.content_blocks.forEach(b => {
                    if (b.type) types.add(b.type);
                });
            }
        });
        console.log('--- ALL DISTINCT BLOCK TYPES IN DB ---');
        console.log(Array.from(types));
    }
}

check();
