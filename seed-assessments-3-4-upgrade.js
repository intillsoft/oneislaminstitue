const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Weekly Assessment", // For Module 3 (Tawheed)
        blocks: [
            { type: "callout", content: "Tawheed is the first command and the final exit. It is the beginning of the road and its end.", author: "Ibn Qayyim (Madarij as-Salikeen)" },
            { type: "objectives", items: ["Verify mastery of the three categories of Tawheed", "Demonstrate understanding of the insufficiency of Rububiyyah without Uluhiyyah", "Identify the core dangers of major and minor Shirk", "Reflect on the practical application of Allah's Oneness in daily life"] },
            { type: "text", content: "## The Heart of the Matter\n\nYou have completed the deep dive into the most important subject in existence: The Oneness of Allah (Tawheed). This assessment is designed to verify that the core concepts of Lordship, Worship, and Names are firmly established in your understanding." },
            { type: "infographic", layout: "grid", items: [
                { title: "Rububiyyah", description: "Lordship and Creation.", icon: "Globe" },
                { title: "Uluhiyyah", description: "Worship and Submission.", icon: "Heart" },
                { title: "Asma wa Sifat", description: "Names and Attributes.", icon: "BookOpen" },
                { title: "Ikhlas", description: "Sincerity vs Shirk.", icon: "Shield" }
            ]},
            { type: "quran", translation: "Say, 'Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.' (Surah Al-An'am 6:162)", arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ" },
            { type: "text", content: "### Final Knowledge Verification\n\nPlease proceed to answer the following questions to verify your completion of Module 3." },
            { type: "quiz", question: "Which category of Tawheed involves singling out Allah in His actions like Creation and Sustaining?", options: ["Tawheed al-Uluhiyyah", "Tawheed ar-Rububiyyah", "Tawheed al-Asma", "Tawheed al-Hukm"], correctIndex: 1, hint: "Lordship (Rabb)." },
            { type: "quiz", question: "Is acknowledging that Allah created the universe enough to make one a complete Muslim?", options: ["Yes, entirely", "No, one must also direct all worship to Him alone (Uluhiyyah)", "Only if they know all 99 names", "Yes, if they pray once a year"], correctIndex: 1, hint: "Polytheists of Mecca also believed in a Creator." },
            { type: "quiz", question: "Which sin is described as 'Great Injustice' (Zulm 'Azim) in the Quran?", options: ["Theft", "Lying", "Shirk (Associating partners with Allah)", "Laziness"], correctIndex: 2, hint: "Surah Luqman 31:13." },
            { type: "quiz", question: "What is 'Riya' (Showing off) categorized as?", options: ["Major Shirk", "Minor Shirk (Nifaq al-Amali)", "Hidden Shirk / Minor Shirk", "It's not a sin"], correctIndex: 2, hint: "Performing deeds for human praise." },
            { type: "quiz", question: "Which Surah is purely about the Oneness of Allah and is equal to one-third of the Quran?", options: ["Surah Al-Fatiha", "Surah At-Tawbah", "Surah Al-Ikhlas", "Surah Al-Kafirun"], correctIndex: 2, hint: "Say, 'He is Allah, One...'" },
            { type: "quiz", question: "What is the primary rule for affirming Allah's Names and Attributes?", options: ["He is like us", "Affirm without comparison (Tamthil) or denial (Ta'til)", "Everything is a metaphor", "Only philosophers can understand"], correctIndex: 1, hint: "The middle path of the Sunnah." },
            { type: "quiz", question: "What did the Prophet (PBUH) fear for his Ummah more than the Dajjal?", options: ["Poverty", "War", "Hidden Shirk (Riya')", "Storms"], correctIndex: 2, hint: "Mentioned in the Hadith of Ibn Majah." },
            { type: "quiz", question: "Which name refers to Allah as 'The Creator'?", options: ["Al-Alim", "Al-Khaliq", "Ar-Razzaq", "Al-Afuww"], correctIndex: 1, hint: "The One who brings things into existence." },
            { type: "conclusion", content: "Congratulations. You have completed the study of Tawheed. You are now prepared to explore the Attributes of Allah in more detail." },
            { type: "document", title: "Tawheed Comprehensive Chart", description: "A high-level overview of the entire module for review.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    },
    {
        title: "Module Assessment", // For Module 4 (Attributes)
        blocks: [
            { type: "callout", content: "Knowledge of Allah is the most honorable of all knowledge, and the most valuable fruit of a believer's life.", author: "Traditional Academic Maxim" },
            { type: "objectives", items: ["Demonstrate understanding of Sifat al-Dhat vs Sifat al-Fi'liyyah", "Affirm Allah's attributes as described in Quran and Sunnah using the 'middle path'", "Identify the practical effects of divine names on personal character", "Recognize and refute common misunderstandings like Ta'til and Tamthil"] },
            { type: "text", content: "## Synthesis of the Divine Names\n\nThis assessment concludes the module on the Names and Attributes of Allah. You have learned that these are not just words, but realities that anchor the soul. You have explored the essential attributes (Dhat) like Knowledge and Life, and the active attributes (Fi'l) like Speech and Rising." },
            { type: "infographic", layout: "grid", items: [
                { title: "Essential", description: "Life, Power, Knowledge, Hearing.", icon: "Sunrise" },
                { title: "Active", description: "Rising, Descending, Creating.", icon: "Zap" },
                { title: "Beautiful", description: "Mercy, Love, Forgiveness.", icon: "Heart" },
                { title: "Majestic", description: "Greatness, Pride, Sovereignty.", icon: "Shield" }
            ]},
            { type: "quran", translation: "The Most Merciful [who is] above the Throne established (Istiwa'). (Surah Taha 20:5)", arabic: "الرَّحْمَنُ عَلَى الْعَرْشِ اسْتَوَى" },
            { type: "text", content: "### Final Knowledge Verification\n\nPlease answer the following questions to verify your mastery of Module 4." },
            { type: "quiz", question: "What are 'Sifat al-Dhat'?", options: ["Attributes of action", "Attributes inseparable from His Essence (e.g., Knowledge)", "Attributes of the angels", "Temporary attributes"], correctIndex: 1, hint: "Always present." },
            { type: "quiz", question: "What is 'Ta'til' in theological terms?", options: ["Affirming too many names", "Likening Allah to humans", "Stripping or denying Allah's attributes", "Talking too much about faith"], correctIndex: 2, hint: "Vacating the meaning." },
            { type: "quiz", question: "Which Imam's rule regarding 'Istiwa' is used as a template for all attributes?", options: ["Imam Malik", "Imam Ash-Shafi'i", "Imam Ahmed", "Imam Abu Hanifa"], correctIndex: 0, hint: "The meaning is known, the manner is unknown." },
            { type: "quiz", question: "The Quran is correctly defined as:", options: ["A creation of Allah", "The literal, uncreated speech of Allah", "A translation by angels", "A book written by scholars"], correctIndex: 1, hint: "Kalamullah ghayru makhluq." },
            { type: "quiz", question: "When Allah says He 'hears' (As-Sami'), how do we understand the manner of His hearing?", options: ["He has ears like us", "The 'how' is unknown (Bi-la kayf)", "It's only a metaphor", "He only hears loud sounds"], correctIndex: 1, hint: "Laysa ka-mithlihi shay'." },
            { type: "quiz", question: "Which Name should one call upon when seeking help in making a difficult decision and needing guidance?", options: ["Ar-Razzaq", "Al-Hadi (The Guide)", "Al-Jabbar", "Al-Khaliq"], correctIndex: 1, hint: "The One who directs." },
            { type: "quiz", question: "What is the primary spiritual goal of knowing Allah's names of Majesty (Jalal)?", options: ["To feel arrogant", "To invoke Awe and Fear of Him", "To ignore His mercy", "To count them quickly"], correctIndex: 1, hint: "Recognizing His power." },
            { type: "quiz", question: "How many names of Allah are mentioned in the famous Hadith in Sahih al-Bukhari that promises Paradise?", options: ["99", "10", "1", "1000"], correctIndex: 0, hint: "Inna lillahi tis'atan wa tis'ina isman." },
            { type: "conclusion", content: "You have verified your scholarship on the Divine Names. Now we move forward to study the Messengers who brought this knowledge: Module 5 - Prophethood (Risalah)." },
            { type: "document", title: "Module 4 Summary Guide", description: "Key terms and definitions for Allah's attributes.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING ASSESSMENTS (MOD 3 & 4) TO 16+ BLOCKS ---');
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
            } else if (b.type === 'document') {
                block.content = { title: b.title, description: b.description, url: b.url, platform: b.platform };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        const { error } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title}%`);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE (${finalBlocks.length} Blocks Seeded)`);
        }
    }
}

seedLessons();
