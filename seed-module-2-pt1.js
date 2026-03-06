const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Introduction to Tawheed",
        blocks: [
            { type: "callout", content: "Tawheed is the first command in religion, the purpose of creation, and the key to Paradise.", author: "Ibn Taymiyyah" },
            { type: "objectives", items: ["Understand the linguistic and technical meaning of Tawheed", "Recognize its absolute centrality in Islam", "Identify the core categories of Tawheed"] },
            { type: "text", content: "## The Foundation of Existence\n\nThe Arabic root w-ḥ-d (و-ح-د) signifies 'to make one' or 'to unify.' In theology, Tawheed is realizing and maintaining the absolute Oneness of Allah in all of His rights. It is the core axis around which all of Islam revolves." },
            { type: "quran", translation: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge.'", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ - اللَّهُ الصَّمَدُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Rububiyyah", description: "Oneness in His Actions (Creator, Sustainer).", icon: "Globe" },
                { title: "Uluhiyyah", description: "Oneness in Our Actions (Worship exclusively for Him).", icon: "Heart" },
                { title: "Asma wa Sifat", description: "Oneness in His Names and Attributes.", icon: "BookOpen" }
            ]},
            { type: "hadith", translation: "Let the first thing to which you invite them be the Tawheed (Oneness) of Allah.", arabic: "فَلْيَكُنْ أَوَّلَ مَا تَدْعُوهُمْ إِلَيْهِ تَوْحِيدُ اللَّهِ" },
            { type: "concept", translation: "Tawheed: The singles out of Allah alone for worship, alongside the affirmation of what He affirmed for Himself of divine attributes.", arabic: "التوحيد: إفراد الله بالعبادة مع إثبات ما أثبته لنفسه من الصفات" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Without Tawheed, everything else crumbles. It is the firmest handhold and the condition for the acceptance of any good deed." },
            { type: "quiz", question: "What does the Arabic root 'w-h-d' signify?", options: ["To worship", "To make one or unify", "To fear", "To love"], correctIndex: 1, hint: "Look at the word 'Wahid'." },
            { type: "quiz", question: "In the famous Hadith of Mu'adh ibn Jabal going to Yemen, what was the first thing they were to be invited to?", options: ["Zakat", "Hajj", "Tawheed of Allah", "Fasting"], correctIndex: 2, hint: "The first condition of Islam." },
            { type: "quiz", question: "Which of these is NOT one of the three primary categories of Tawheed?", options: ["Tawheed al-Hukm (Governance)", "Tawheed al-Rububiyyah (Lordship)", "Tawheed al-Uluhiyyah (Worship)", "Tawheed al-Asma wa Sifat (Names)"], correctIndex: 0, hint: "Look at the infographic grid." }
        ]
    },
    {
        title: "Tawheed ar-Rububiyyah",
        blocks: [
            { type: "callout", content: "To acknowledge that He is the sole Creator, Sovereign, and Disposer of all affairs.", author: "Classical Definition" },
            { type: "objectives", items: ["Define Tawheed ar-Rububiyyah", "Understand why recognizing Rububiyyah is necessary but insufficient for salvation", "Examine how even the Quraysh acknowledged this element"] },
            { type: "text", content: "## The Lordship of Allah\n\nTawheed ar-Rububiyyah (Oneness of Lordship) is to single out Allah concerning His actions. This means firmly believing that He alone is the Creator (Al-Khaliq), the Provider (Ar-Razzaq), the Sovereign (Al-Malik), and the Director of all affairs." },
            { type: "quran", translation: "And if you asked them, 'Who created the heavens and earth?' they would surely say, 'Allah.'", arabic: "وَلَئِنْ سَأَلْتَهُمْ مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ لَيَقُولُنَّ اللَّهُ" },
            { type: "scholar", translation: "Affirming Rububiyyah alone is not enough to make someone a Muslim, for even the polytheists affirmed it.", arabic: "توحيد الربوبية لا يكفي لإدخال العبد في الإسلام، فإن المشركين كانوا مقرين به" },
            { type: "infographic", layout: "process", items: [
                { title: "Al-Khaliq", description: "He brings things from non-existence into existence.", icon: "Activity" },
                { title: "Al-Malik", description: "He has absolute ownership over everything.", icon: "Shield" },
                { title: "Al-Mudabbir", description: "He regulates and disposes of all physical laws and events.", icon: "Command" }
            ]},
            { type: "reflection", translation: "When you stress about your provision or future, remind yourself: My Lord is Ar-Razzaq (The Provider) and Al-Mudabbir (The Disposer of Affairs).", arabic: "عندما تقلق بشأن رزقك، تذكر: ربي هو الرزاق والمدبر" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "Recognizing that Allah is the singular Lord over creation is the stepping stone that naturally demands we worship Him alone." },
            { type: "quiz", question: "Tawheed ar-Rububiyyah refers to Singling out Allah in:", options: ["His Names", "Our Actions", "His Actions (Creation, Sustenance)", "The direction of prayer"], correctIndex: 2, hint: "Lordship implies actions from the Lord." },
            { type: "quiz", question: "Did the pagan Arabs of Quraysh at the time of the Prophet believe in Tawheed ar-Rububiyyah?", options: ["No, they thought idols created the universe", "Yes, they acknowledged Allah as the Supreme Creator", "They were atheists", "They believed the universe was infinite"], correctIndex: 1, hint: "Look at the Qur'anic verse block." },
            { type: "quiz", question: "Is believing in Tawheed ar-Rububiyyah alone sufficient to enter Islam?", options: ["Yes, completely", "Only if combined with fasting", "No, one must also establish Uluhiyyah (Worship)", "Yes, it is the highest form"], correctIndex: 2, hint: "See the Scholarly Insight block." }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING LESSONS PT 5 (MODULE 2 Introduction) ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}`, order: i };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                block.content = { translation: b.translation, arabic: b.arabic };
            } else if (b.type === 'quiz') {
                block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
            } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
                block.content = b.content;
                block.author = b.author;
            } else if (['objectives', 'infographic'].includes(b.type)) {
                block.content = { items: b.items, layout: b.layout };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title}%`);
        console.log('DONE');
    }
}

seedLessons();
