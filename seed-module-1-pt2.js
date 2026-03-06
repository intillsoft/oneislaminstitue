const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

// We target these specific lessons for a comprehensive layout upgrade
const LESSON_DATA = [
    {
        title: "The Cosmological Argument",
        quote: "Were they created by nothing, or were they themselves the creators?",
        author: "Qur'an 52:35",
        objectives: [
            "Understand the necessity of a First Cause",
            "Identify the logical impossibility of infinite regress",
            "Trace cosmological thought in early Islamic theology"
        ],
        blocks: [
            { type: "callout", content: "Were they created by nothing, or were they themselves the creators?", author: "Qur'an 52:35" },
            { type: "objectives", items: ["Understand the necessity of a First Cause", "Identify the logical impossibility of infinite regress", "Trace cosmological thought in early Islamic theology"] },
            { type: "text", content: "## Beyond the Big Bang: The Islamic Approach\n\nWhen we look at the universe, the mind demands an explanation. The Cosmological Argument (Dalil al-Huduth) argues that whatever begins to exist has a cause. The universe began to exist; therefore, it has a cause. Let us explore the traditional Kalam argument." },
            { type: "concept", translation: "Dalil al-Huduth (Argument from Origination): A philosophical proof for the existence of God based on the premise that the universe is contingent and temporal.", arabic: "دليل الحدوث: كل حادث لا بد له من محدث" },
            { type: "infographic", layout: "process", items: [
                { title: "Premise 1", description: "Everything that has a beginning has a cause.", icon: "Clock" },
                { title: "Premise 2", description: "The universe has a beginning.", icon: "Globe" },
                { title: "Conclusion", description: "Therefore, the universe has an uncaused Cause.", icon: "Check" }
            ]},
            { type: "scholar", translation: "If the chain of causes were infinite, no cause would ever come into effect. It must stop at a Necessary Being.", arabic: "لو تسلسل الفاعلون إلى غير نهاية لم يوجد فعل أصلاً" },
            { type: "video", url: "https://www.youtube.com/watch?v=6CulBuMCLg0" },
            { type: "conclusion", content: "The intellect inevitably leads us to the Uncaused Cause, whom we recognize as Allah." },
            { type: "quiz", question: "What is 'Dalil al-Huduth' primarily focused on?", options: ["The Qur'an's language", "The origination and contingency of the universe", "The moral laws of society", "Islamic history"], correctIndex: 1, hint: "Huduth means origination." },
            { type: "quiz", question: "Which Qur'anic verse poses the question: 'Were they created by nothing?'", options: ["2:255", "52:35", "112:1", "1:1"], correctIndex: 1, hint: "Surah at-Tur." },
            { type: "quiz", question: "Infinite regress (Tasalsul) is considered logically:", options: ["Possible", "Necessary", "Impossible", "Probable"], correctIndex: 2, hint: "A chain without a start never produces an end." }
        ]
    },
    {
        title: "Why Humanity Needs Revelation",
        quote: "The intellect acts as a foundation, but Revelation is the building erected upon it.",
        author: "Al-Ghazali",
        objectives: [
            "Understand the limitations of human intellect",
            "Explain the role of Messengers (Risalah)",
            "Identify why moral compasses vary without divine grounding"
        ],
        blocks: [
            { type: "callout", content: "The intellect acts as a foundation, but Revelation is the building erected upon it.", author: "Al-Ghazali" },
            { type: "objectives", items: [
                "Understand the limitations of human intellect",
                "Explain the role of Messengers (Risalah)",
                "Identify why moral compasses vary without divine grounding"
            ] },
            { type: "text", content: "## The Compass in the Dark\n\nWhile reason (Aql) can arrive at the existence of a Creator, it cannot discern the specifics of His will, the details of the Hereafter, or the correct modes of worship. Revelation (Wahy) serves as the light that guides the intellect." },
            { type: "quran", translation: "Mankind was a single community, then Allah sent prophets bringing good tidings and warnings...", arabic: "كَانَ النَّاسُ أُمَّةً وَاحِدَةً فَبَعَثَ اللَّهُ النَّبِيِّينَ مُبَشِّرِينَ وَمُنْذِرِينَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Intellect (Aql)", description: "Recognizes the Creator", icon: "Brain" },
                { title: "Revelation (Wahy)", description: "Defines the purpose", icon: "BookOpen" },
                { title: "Prophethood (Risalah)", description: "Demonstrates the application", icon: "User" }
            ]},
            { type: "reflection", translation: "If a watchmaker designs a complex watch, wouldn't they also leave an instruction manual? Revelation is that manual for humanity.", arabic: "هل يُعقل أن يُصنع جهاز معقد دون كتيب تعليمات؟ الوحي هو دليل الإنسانية." },
            { type: "video", url: "https://www.youtube.com/watch?v=e4B7X1d7C3M" },
            { type: "conclusion", content: "Revelation does not contradict intellect; it elevates it beyond its human limitations to grasp divine purpose." },
            { type: "quiz", question: "According to Al-Ghazali, if Intellect is the foundation, what is Revelation?", options: ["The wrecking ball", "The basement", "The building erected upon it", "The neighborhood"], correctIndex: 2, hint: "They work together, one supports the other." },
            { type: "quiz", question: "Can human reason (Aql) alone deduce the specific details of the Hereafter?", options: ["Yes, entirely", "Only with science", "No, it requires Revelation", "Yes, through meditation"], correctIndex: 2, hint: "The unseen (Ghayb) is known only through what is revealed." },
            { type: "quiz", question: "What Arabic term refers to Divine Revelation?", options: ["Wahy", "Aql", "Qiyas", "Ijma"], correctIndex: 0, hint: "What was given to the Prophet." }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING LESSONS ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
        // Finalize block structures and IDs
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}`, order: i };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                // Ensure data matches builder format
                block.content = { translation: b.translation, arabic: b.arabic };
                delete block.translation;
                delete block.arabic;
            } else if (b.type === 'quiz') {
                block.content = { 
                    question: b.question, 
                    options: b.options, 
                    correctIndex: b.correctIndex, 
                    hint: b.hint 
                };
            } else if (b.type === 'text' || b.type === 'callout' || b.type === 'conclusion') {
                block.content = b.content; // text renderer takes block.content
                block.author = b.author;
            } else if (b.type === 'objectives' || b.type === 'infographic') {
                block.content = { items: b.items, layout: b.layout };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        const { error } = await supabase
            .from('course_lessons')
            .update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID)
            .ilike('title', `%${item.title}%`);

        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log('DONE');
        }
    }
}

seedLessons();
