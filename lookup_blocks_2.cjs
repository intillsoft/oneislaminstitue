const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('MISSING ENV CREDENTIALS');
    process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
    const { data, error } = await supabase
        .from('course_lessons')
        .select('id, title, content_blocks, content_data')
        .limit(10);
        
    if (error) {
        console.error('DB_ERROR', error);
    } else {
        console.log('--- DB BLOCKS LOOKUP ---');
        data.forEach(l => {
            console.log(`\nLesson: ${l.title} (${l.id})`);
            console.log(`Content Blocks length: ${Array.isArray(l.content_blocks) ? l.content_blocks.length : 'Not Array'}`);
            console.log(`Content Data Pages: ${l.content_data?.pages ? Array.isArray(l.content_data.pages) ? l.content_data.pages.length : 'Not Array' : 'Missing'}`);
            
            if (Array.isArray(l.content_blocks) && l.content_blocks.length > 0) {
                 console.log('First Block preview:', JSON.stringify(l.content_blocks[0]).substring(0, 100));
            }
            if (l.content_data?.pages && l.content_data.pages.length > 0) {
                 console.log('First Page Preview Content length:', l.content_data.pages[0].content?.length);
                 if (l.content_data.pages[0].content?.length > 0) {
                      console.log('First block of First Page:', JSON.stringify(l.content_data.pages[0].content[0]).substring(0, 100));
                 }
            }
        });
    }
}

check();
