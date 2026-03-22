const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.log('MISSING_CREDENTIALS');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const lessonId = '19f4a074-4ec0-4952-a8d1-6010df9531b5'; // Created Lesson ID

async function run() {
    try {
        console.log('Seeding FULL Course 1 Module 1 Content cascading plates...');
        
        // 1. Delete previous blocks if any to avoid duplicates
        await supabase.from('lesson_blocks').delete().eq('lesson_id', lessonId);

        // 2. Define Page 1 - Overview Blocks
        const p1_blocks = [
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Lesson Goal', text: 'To reflect on the nature of human identity from an Islamic perspective, understanding that our true identity is rooted in our relationship with our Creator.' } },
            ...[
                'What does it mean to be human beyond physical existence?',
                'How do different worldviews define human identity?',
                'What does Islam say about our origin, purpose, and ultimate worth?',
                'How does understanding our identity transform the way we live?'
            ].map(q => ({ id: crypto.randomUUID(), type: 'summary', content: { points: [q] } }))
        ];

        // 3. Define Page 2 - Video
        const p2_blocks = [
            { id: crypto.randomUUID(), type: 'video', content: { url: 'https://www.youtube.com/watch?v=4K6xYv8P7Hw' } },
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Video Description', text: 'In this profound talk, Ustadh Nouman Ali Khan explores the deepest questions of human existence: Who are we? Why are we here? He unpacks the Quranic concept of fitrah, the nature of the soul, and how understanding our true identity.' } },
            { id: crypto.randomUUID(), type: 'summary', content: { points: ['0:00 – Introduction: Search for meaning','3:20 – The question "Who am I?"','7:45 – Fitrah and the soul','12:30 – Honor of being human','16:50 – False identities','22:10 – Servant of Allah','27:00 – Conclusion'] } }
        ];

        // 4. Define Page 3 - Companion Guide
        const p3_blocks = [
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Deeper Explanation', text: `The question "Who am I?" is perhaps the most fundamental question of human existence. It is not a luxury but a necessity. Without an answer, we drift through life, adopting identities given to us by society, culture, or circumstance...\n\nIslam offers an answer that is both simple and profound: You are a creation of Allah, honored by Him, endowed with a soul, and placed on this earth with a purpose.` } },
            { id: crypto.randomUUID(), type: 'quran', content: { surah: '17', verse: '70', arabic: 'وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ وَحَمَلْنَاهُمْ فِي الْبَرِّ وَالْبَحْرِ وَرَزَقْنَاهُم مِّنَ الطَّيِّبَاتِ', translation: 'And We have certainly honored the children of Adam and carried them on the land and sea and provided for them of the good things and preferred them over much of what We have created...' } },
            { id: crypto.randomUUID(), type: 'quran', content: { surah: '15', verse: '28-29', arabic: 'وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي خَالِقٌ بَشَرًا مِّن صَلْصَالٍ', translation: 'breathed into him of My [created] soul, then fall down to him in prostration.' } },
            { id: crypto.randomUUID(), type: 'hadith', content: { narrator: 'Bukhari', reference: '1358', arabic: 'مَا مِنْ مَوْلُودِ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ', english: 'Every child is born upon the fitrah; his parents make him a Jew, a Christian, or a Magian.' } },
            { id: crypto.randomUUID(), type: 'summary', content: { title: 'Stories and Examples', points: ['The Story of Adam (peace be upon him): Refused by Iblis out of arrogance.', 'The Search for Identity in Modern Culture: Fragile identities vs. stable relation with Allah.'] } }
        ];

        // 5. Define Page 4 - Reflection Journal
        const p4_blocks = [
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Reflection Prompt 1', text: 'Before this lesson, how did you define your own identity? What factors (family, culture, career, relationships) most shaped that definition?' } },
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Reflection Prompt 2', text: 'What does it mean to you personally that you were created with a fitrah? Can you recall a moment in your life when you felt that innate pull toward truth?' } },
            { id: crypto.randomUUID(), type: 'text', content: { title: 'Reflection Prompt 3', text: 'The Quran states that humans are "honored" by Allah. How does this knowledge affect your self‑worth?' } }
        ];

        // 6. Define Page 5 - Knowledge Check
        const p5_blocks = [
            { id: crypto.randomUUID(), type: 'quiz', content: { question: 'According to the Quran Surah At-Tin (95:4)?', options: ['Created from clay', 'Created in the best of stature', 'Created to struggle', 'Drop of fluid'], correctIndex: 1 } },
            { id: crypto.randomUUID(), type: 'quiz', content: { question: 'What is the meaning of "fitrah" in Islamic terminology?', options: ['The soul after death', 'The innate human nature inclined toward God', 'The physical body', 'A type of prayer'], correctIndex: 1 } },
            { id: crypto.randomUUID(), type: 'quiz', content: { question: 'Which Surah states that humans are honored by Allah?', options: ['Al-Fatiha', 'Al-Ikhlas', 'Al-Isra (17:70)', 'Al-Baqarah'], correctIndex: 2 } },
            { id: crypto.randomUUID(), type: 'quiz', content: { question: 'The story of Iblis refusing to prostrate to Adam teaches us that:', options: ['Arrogance leads to destruction', 'Angels are better', 'Fire is better', 'None'], correctIndex: 0 } },
            { id: crypto.randomUUID(), type: 'quiz', content: { question: 'Every child is born upon the fitrah meant:', options: ['Every child is born Muslim', 'Every child is born sinless', 'Innate inclination to believe in God', 'All of the above'], correctIndex: 3 } }
        ];

        const blocksToInsert = [
            { lesson_id: lessonId, type: 'overview', content: { content: p1_blocks }, order_index: 1 },
            { lesson_id: lessonId, type: 'video', content: { content: p2_blocks }, order_index: 2 },
            { lesson_id: lessonId, type: 'companion_guide', content: { content: p3_blocks }, order_index: 3 },
            { lesson_id: lessonId, type: 'reflection_journal', content: { content: p4_blocks }, order_index: 4 },
            { lesson_id: lessonId, type: 'knowledge_check', content: { content: p5_blocks }, order_index: 5 }
        ];

        const { error: bErr } = await supabase.from('lesson_blocks').insert(blocksToInsert);
        if (bErr) throw bErr;
        
        console.log('✅ SEED_COMPLETED: Re-aligned complete cascading lists flawlessly!');
    } catch (err) {
        console.error('❌ SEED_FAILED:', err);
    }
}

const crypto = require('crypto');
run();
