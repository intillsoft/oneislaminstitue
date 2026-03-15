import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function expandPage3(supabase, lessonId, detailedJsonFile) {
    const { data: lesson } = await supabase
        .from('course_lessons')
        .select('content_blocks')
        .eq('id', lessonId)
        .single();

    if (!lesson) return console.log(`Lesson ${lessonId} not found`);

    const newPage3 = JSON.parse(fs.readFileSync(detailedJsonFile, 'utf8'))[0];

    let blocks = lesson.content_blocks && Array.isArray(lesson.content_blocks) ? [...lesson.content_blocks] : [];

    // Fallback if empty structure
    if (blocks.length === 0 || !blocks[0].hasOwnProperty('page_number')) {
         blocks = [
            { page_number: 1, page_type: 'overview', content: [] },
            { page_number: 2, page_type: 'video', content: [] },
            { page_number: 3, page_type: 'companion_guide', content: [] },
            { page_number: 4, page_type: 'reflection_journal', content: [] },
            { page_number: 5, page_type: 'knowledge_check', content: [] }
         ];
    }

    const p3Idx = blocks.findIndex(p => p.page_number === 3);
    if (p3Idx >= 0) {
        blocks[p3Idx] = { ...blocks[p3Idx], content: newPage3.content };
    } else {
        blocks.splice(2, 0, { page_number: 3, page_type: 'companion_guide', content: newPage3.content });
    }

    const { error } = await supabase
        .from('course_lessons')
        .update({
            content_blocks: blocks,
            content_data: { pages: blocks }
        })
        .eq('id', lessonId);

    console.log(`Updated Page 3 for ${lessonId}:`, error ? error.message : "Success");
}

async function main() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    await expandPage3(supabase, 'dbe9eb16-2810-4893-b731-cacd8a3ea530', 'detailed_content_11.json');
    await expandPage3(supabase, 'a2f73f11-f205-4c22-99fa-25a66e5ebc0d', 'detailed_content_12.json');
    await expandPage3(supabase, '85168893-bb36-40fb-b54f-88890fa5261b', 'detailed_content_13.json');
    await expandPage3(supabase, 'ca3b5734-3344-47d8-8c50-034f9ef383af', 'detailed_content_14.json');
}

main();
