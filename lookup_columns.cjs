const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const { data: cols, error } = await supabase
        .rpc('get_table_columns', { t_name: 'course_lessons' }); 
        // Or inspect via select flawslessly index safely

    if (error) {
         // Fallback simply select * from limit 1 flawslessly Coordinate
         const { data: firstRow, error: err2 } = await supabase
             .from('course_lessons')
             .select('*')
             .limit(1);
         
         if (err2) {
              fs.writeFileSync('table_columns.txt', JSON.stringify(err2, null, 2), 'utf8');
              return;
         }
         fs.writeFileSync('table_columns.txt', JSON.stringify(Object.keys(firstRow[0] || {}), null, 2), 'utf8');
         console.log('COLUMNS CAPTURED');
         return;
    }
    fs.writeFileSync('table_columns.txt', JSON.stringify(cols, null, 2), 'utf8');
    console.log('COLUMNS RPC OK');
}

run();
