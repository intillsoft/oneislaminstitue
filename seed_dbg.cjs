const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.log('MISSING_CREDENTIALS');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const lessonId = '19f4a074-4ec0-4952-a8d1-6010df9531b5'; 

async function run() {
    try {
        console.log('1. Deleting old blocks');
        const { error: dErr } = await supabase.from('lesson_blocks').delete().eq('lesson_id', lessonId);
        if (dErr) { console.error('Delete Error:', dErr); return; }
        
        console.log('2. Preparing blocks to insert');
        const crypto = require('crypto');
        
        const p1_blocks = [{ id: crypto.randomUUID(), type: 'text', content: { title: 'Lesson Goal', text: 'To reflect.' } }];
        const blocksToInsert = [
            { lesson_id: lessonId, type: 'overview', content: { content: p1_blocks }, order_index: 1 }
        ];

        console.log('3. Inserting blocks into DB');
        const { error: bErr } = await supabase.from('lesson_blocks').insert(blocksToInsert).select();
        
        if (bErr) {
             console.error('Insert Error:', bErr);
        } else {
             console.log('✅ SEED_COMPLETED SUCCESS');
        }
    } catch (err) {
        console.error('❌ CATCH_ERR:', err);
    }
}

run();
