import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function main() {
    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing SUPABASE env vars.");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const content13 = JSON.parse(fs.readFileSync('content_13.json', 'utf8'));
    const content14 = JSON.parse(fs.readFileSync('content_14.json', 'utf8'));

    // Update 1.3
    const { error: err13 } = await supabase
        .from('course_lessons')
        .update({
            content_blocks: content13,
            content_data: { pages: content13 }
        })
        .eq('id', '85168893-bb36-40fb-b54f-88890fa5261b');

    console.log("Update 1.3 Result:", err13 ? err13.message : "Success");

    // Update 1.4 (including title overwrite)
    const { error: err14 } = await supabase
        .from('course_lessons')
        .update({
            title: "Lesson 1.4: What is Truth? How Do We Know?",
            content_blocks: content14,
            content_data: { pages: content14 }
        })
        .eq('id', 'ca3b5734-3344-47d8-8c50-034f9ef383af');

    console.log("Update 1.4 Result:", err14 ? err14.message : "Success");
}

main();
