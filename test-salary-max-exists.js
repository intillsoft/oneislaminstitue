import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
    console.log("Testing insert with salary_max...");
    const { data, error } = await supabase
        .from('jobs')
        .insert([{ title: 'Schema Test', salary_max: 9999 }])
        .select();
    
    if (error) {
        console.error("Insert failed:", error.message);
        console.error("Error Code:", error.code);
    } else {
        console.log("Insert successful! Column exists.");
        // Clean up
        await supabase.from('jobs').delete().eq('id', data[0].id);
    }
}

testInsert();
