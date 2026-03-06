const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "The Concept of Ihsan",
        blocks: [
            { type: "callout", content: "Ihsan is to worship Allah as if you see Him, and if you cannot achieve this state of devotion, then you must consider that He is looking at you.", author: "Sahih Muslim" },
            { type: "objectives", items: ["Define Ihsan spiritually and practically", "Understand the degrees of Ihsan: Mushahadah (Observation) and Muraqabah (Watchfulness)", "See Ihsan as the ultimate pinnacle of Islamic faith"] },
            { type: "text", content: "## The Final Degree: Excellence\n\nBeyond basic submission (Islam) and inner conviction (Iman), lies the summit of the religious experience: Ihsan. It is a state where the believer's worship is perfected through profound spiritual awareness." },
            { type: "concept", translation: "Ihsan (Excellence/Perfection): Doing what is beautiful. In worship, it means a complete presence of heart and excellence in executing the outer actions.", arabic: "الإحسان: الإتيان بالشيء على أكمل وجه" },
            { type: "infographic", layout: "grid", items: [
                { title: "Muraqabah (Watchfulness)", description: "Knowing Allah sees you. This creates fear of sin.", icon: "Eye" },
                { title: "Mushahadah (Witnessing)", description: "Worshipping as if you see Him. This creates intense love.", icon: "Sparkles" },
                { title: "Ihsan with Creation", description: "Treating others with excellence because of your love for Him.", icon: "Heart" }
            ]},
            { type: "hadith", translation: "Verily, Allah has prescribed Ihsan (excellence/proficiency) in all things.", arabic: "إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ" },
            { type: "scholar", translation: "Ihsan encompasses the inner purification of the heart and the outward perfection of the limbs.", arabic: "الإحسان يجمع بين طهارة الباطن وإتقان الظاهر" },
            { type: "video", url: "https://www.youtube.com/watch?v=S01Z-Yw2m3E" },
            { type: "conclusion", content: "Ihsan turns the ordinary into the sacred. A simple act, done with Ihsan, weighs heavier than a mountain of distracted worship." },
            { type: "quiz", question: "What are the two degrees of Ihsan in worship?", options: ["Hope and Fear", "Muraqabah and Mushahadah", "Fasting and Prayer", "Iman and Islam"], correctIndex: 1, hint: "Watchfulness and Witnessing." },
            { type: "quiz", question: "In the Hadith of Jibreel, Ihsan represents:", options: ["The base", "The walls", "The pinnacle", "The door"], correctIndex: 2, hint: "It is the highest level." },
            { type: "quiz", question: "Does Ihsan apply only to ritual worship?", options: ["Yes, only prayer", "Yes, only in Ramadan", "No, it is prescribed in all things", "No, only in charity"], correctIndex: 2, hint: "Allah has prescribed it in ALL things." }
        ]
    },
    {
        title: "Increase and Decrease of Iman",
        blocks: [
            { type: "callout", content: "Iman is speech and action. It increases with obedience and decreases with disobedience.", author: "Imam Ash-Shafi'i" },
            { type: "objectives", items: ["Understand the orthodox Sunni position on the state of Iman", "Identify actions that increase faith", "Recognize the spiritual dangers that decrease faith"] },
            { type: "text", content: "## A Living Entity\n\nIman is not a static rock; it is a living tree. Sometimes its leaves are green and vibrant, and sometimes they wither. The major scholars of Ahl al-Sunnah established that Iman fluctuates." },
            { type: "quran", translation: "And whenever a surah is revealed, there are among them those who say, 'Which of you has this increased in faith?' As for those who believed, it has increased them in faith...", arabic: "وَإِذَا مَا أُنْزِلَتْ سُورَةٌ فَمِنْهُمْ مَنْ يَقُولُ أَيُّكُمْ زَادَتْهُ هَذِهِ إِيمَانًا فَأَمَّا الَّذِينَ آمَنُوا فَزَادَتْهُمْ إِيمَانًا" },
            { type: "infographic", layout: "process", items: [
                { title: "Ziyadah (Increase)", description: "Achieved through Quran, obedience, and reflection.", icon: "TrendingUp" },
                { title: "Nuqsan (Decrease)", description: "Caused by sins, heedlessness, and neglecting duties.", icon: "TrendingDown" },
                { title: "Tajdid (Renewal)", description: "'Renew your faith frequently.'", icon: "RefreshCw" }
            ]},
            { type: "hadith", translation: "Renew your faith. They said: O Messenger of Allah, how do we renew our faith? He said: Say frequently 'La ilaha illallah'.", arabic: "جَدِّدُوا إِيمَانَكُمْ. قِيلَ: يَا رَسُولَ اللَّهِ، وَكَيْفَ نُجَدِّدُ إِيمَانَنَا؟ قَالَ: أَكْثِرُوا مِنْ قَوْلِ لَا إِلَهَ إِلَّا اللَّهُ" },
            { type: "reflection", translation: "If you do not feel your Iman increasing, it is likely decreasing. The heart never stands absolutely still.", arabic: "إذا لم تشعر بزيادة إيمانك، فهو في الحقيقة ينقص. القلب لا يتوقف أبداً عن التقلب." },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "To protect the tree of Iman, we must constantly water it with acts of obedience and shield it from the toxins of sin." },
            { type: "quiz", question: "What is the mainstream Sunni belief regarding Iman?", options: ["It is static and unchanging", "It increases with obedience and decreases with disobedience", "It only increases", "It is only determined by logic"], correctIndex: 1, hint: "What did Imam Ash-Shafi'i say?" },
            { type: "quiz", question: "According to the Prophet (PBUH), how can one 'renew' their faith?", options: ["Buy new clothes", "Travel to Makkah only", "Say frequently 'La ilaha illallah'", "Sleep more"], correctIndex: 2, hint: "The declaration of Tawhid." },
            { type: "quiz", question: "Which of the following decreases Iman?", options: ["Reading Quran", "Obedience", "Heedlessness (Ghaflah)", "Charity"], correctIndex: 2, hint: "Forgetting Allah." }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING LESSONS PT 3 ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}`, order: i };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                block.content = { translation: b.translation, arabic: b.arabic };
                delete block.translation;
                delete block.arabic;
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
