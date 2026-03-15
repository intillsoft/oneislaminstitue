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

    const { data: lessons } = await supabase
        .from('course_lessons')
        .select('id, title')
        .eq('module_id', 'c32c01b9-d72e-47ae-aefd-97cf10439b70');

    if (!lessons) return console.log("No lessons found.");

    const l15 = lessons.find(l => l.title.includes("1.5"));
    const l16 = lessons.find(l => l.title.includes("1.6"));

    const content15 = JSON.parse(fs.readFileSync('content_15.json', 'utf8'));
    const content16 = JSON.parse(fs.readFileSync('content_16.json', 'utf8'));

    if (l15) {
        const { error: err15 } = await supabase
            .from('course_lessons')
            .update({
                content_blocks: content15,
                content_data: { pages: content15 }
            })
            .eq('id', l15.id);
        console.log("Updated 1.5:", err15 ? err15.message : "Success");
    } else {
        console.log("Lesson 1.5 not found inside lookup triggers.");
    }

    if (l16) {
        const { error: err16 } = await supabase
            .from('course_lessons')
            .update({
                content_blocks: content16,
                content_data: { pages: content16 }
            })
            .eq('id', l16.id);
        console.log("Updated 1.6:", err16 ? err16.message : "Success");
    } else {
        console.log("Lesson 1.6 not found inside lookup triggers.");
    }
}

main();
