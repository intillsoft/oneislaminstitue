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
        console.log('--- TEXT BLOCKS LOOKUP ---');
        data.forEach(l => {
            if (Array.isArray(l.content_blocks)) {
                l.content_blocks.forEach(b => {
                    if (b.type === 'text') {
                        console.log(`\nLesson block found:`);
                        console.log(JSON.stringify(b, null, 2));
                    }
                });
            }
        });
    }
}

check();
