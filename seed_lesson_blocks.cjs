const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.log('MISSING_CREDENTIALS');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const courseId = '5bdf783f-b42b-4e25-bef1-d707c632df42'; // Course 1 ID

async function run() {
    try {
        console.log('Seeding Course 1, Module 1, Lesson 1 cascading plates...');
        
        // 1. Create Module if not exists or create row
        const { data: lesson, error: lErr } = await supabase
            .from('lessons')
            .insert({
                course_id: courseId,
                module_name: 'Module 1: Foundations of Faith',
                title: 'Who Am I? The Human Search for Identity',
                estimated_duration: '35 minutes',
                order_index: 1,
                is_published: true
            })
            .select()
            .single();
            
        if (lErr) throw lErr;
        const lessonId = lesson.id;
        console.log(`✅ Created Lesson with ID: ${lessonId}`);

        // 2. Define Page 1 - Overview Blocks
        const p1_blocks = [
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Overview', text: 'To reflect on the nature of human identity from an Islamic perspective, understanding that our true identity is rooted in our relationship with our Creator.' } },
            ...['What does it mean to be human beyond physical existence?', 'How do different worldviews define human identity?', 'What does Islam say about our origin, purpose, and ultimate worth?', 'How does understanding our identity transform the way we live?'].map(q => ({ id: crypto.randomUUID(), type: 'summary', content: { points: [q] } }))
        ];

        // 3. Define Page 2 - Video
        const p2_blocks = [
            { id: crypto.randomUUID(), type: 'video', content: { url: 'https://www.youtube.com/watch?v=4K6xYv8P7Hw' } },
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Video Description', text: 'In this profound talk, Ustadh Nouman Ali Khan explores the deepest questions of human existence: Who are we? Why are we here? He unpacks the Quranic concept of fitrah...' } }
        ];

        // 4. Define Page 3 - Companion
        const p3_blocks = [
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Companion Guide Description', text: 'Humans are unique among creation because we ask deep questions about existence, meaning, and identity...' } },
            { id: crypto.randomUUID(), type: 'quran', content: { surah: '17', verse: '70', arabic: 'وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ', translation: 'And We have certainly honored the children of Adam...' } },
            { id: crypto.randomUUID(), type: 'hadith', content: { narrator: 'Bukhari', reference: '1358', arabic: 'مَا مِنْ مَوْلُودٍ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ', english: 'Every child is born upon the fitrah...' } }
        ];

        // 5. Define Page 4 - Journal
        const p4_blocks = [
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Reflection Prompt 1', text: 'Before this lesson, how did you define your own identity?' } }
        ];

        // 6. Page 5 - Knowledge Quiz
        const p5_blocks = [
            { id: crypto.randomUUID(), type: 'quiz', content: { question: 'According to the Quran, how did Allah describe the creation of humans in Surah At-Tin (95:4)?', options: ['Created from clay', 'Created in the best of stature', 'Created to struggle', 'Created from a drop of fluid'], correctIndex: 1 } }
        ];

        // 7. Loop and Insert into lesson_blocks
        // Wait! Based on ensurePagesStructure, we should set `page_number` if column existed or order_index
        // Insert as 5 rows with page block content flawlessly node
        const blocksToInsert = [
            { lesson_id: lessonId, type: 'overview', content: { content: p1_blocks }, order_index: 1 },
            { lesson_id: lessonId, type: 'video', content: { content: p2_blocks }, order_index: 2 },
            { lesson_id: lessonId, type: 'companion_guide', content: { content: p3_blocks }, order_index: 3 },
            { lesson_id: lessonId, type: 'reflection_journal', content: { content: p4_blocks }, order_index: 4 },
            { lesson_id: lessonId, type: 'knowledge_check', content: { content: p5_blocks }, order_index: 5 }
        ];

        const { error: bErr } = await supabase.from('lesson_blocks').insert(blocksToInsert);
        if (bErr) throw bErr;
        
        console.log('✅ SEED_COMPLETED: Lesson and blocks created with all cascaded structures!');
    } catch (err) {
        console.error('❌ SEED_FAILED:', err);
    }
}

const crypto = require('crypto');
run();
