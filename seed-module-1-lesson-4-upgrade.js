const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Increase and Decrease of Iman",
        blocks: [
            { type: "callout", content: "Iman is speech and action. It increases with obedience to Ar-Rahman (the Merciful) and decreases with obedience to Ash-Shaytan (the devil).", author: "Imam Ash-Shafi'i (Dala'il al-Nubuwwah)" },
            { type: "objectives", items: ["Understand the orthodox Sunni position on the fluctuation of faith", "Analyze Quranic proofs for the increase of Iman", "Identify the primary spiritual toxins that cause faith to decrease", "Learn the concept of 'Tajdid' (Renewal) of faith"] },
            { type: "text", content: "## A Living Entity\n\nIman is not a static rock; it is a living tree. Sometimes its leaves are green and vibrant, and sometimes they wither. The major scholars of Ahl al-Sunnah established that Iman fluctuates. It is never absolutely still." },
            { type: "quran", translation: "It is He who sent down tranquility into the hearts of the believers that they would increase in faith along with their [present] faith. (Surah Al-Fath 48:4)", arabic: "هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَّعَ إِيمَانِهِمْ" },
            { type: "concept", translation: "Fluctuation of Faith (Ziyadah wa Nuqsan): The theological reality that faith is dynamic, expanding when the heart is connected to Allah and contracting when it is distracted.", arabic: "زيادة الإيمان ونقصانه" },
            { type: "infographic", layout: "process", items: [
                { title: "Ziyadah (Increase)", description: "Achieved through Quran, obedience, and reflection.", icon: "TrendingUp" },
                { title: "Nuqsan (Decrease)", description: "Caused by sins, heedlessness, and neglecting duties.", icon: "TrendingDown" },
                { title: "Tajdid (Renewal)", description: "'Renew your faith frequently.'", icon: "RefreshCw" }
            ]},
            { type: "text", content: "### The Mechanism of Increase\n\nAllah mentions in multiple places that the recitation of His verses and the witnessing of His signs increases the certainty of the believers. This is often accompanied by 'Sakinah'—a divine tranquility that settles the heart during chaos." },
            { type: "quran", translation: "And whenever a surah is revealed, there are among them those who say, 'Which of you has this increased in faith?' As for those who believed, it has increased them in faith, and they rejoice. (Surah At-Tawbah 9:124)", arabic: "وَإِذَا مَا أُنزِلَتْ سُورَةٌ فَمِنْهُم مَّن يَقُولُ أَيُّكُمْ زَادَتْهُ هَٰذِهِ إِيمَانًا ۚ فَأَمَّا الَّذِينَ آمَنُوا فَزَادَتْهُمْ إِيمَانًا وَهُمْ يَسْتَبْشِرُونَ" },
            { type: "hadith", translation: "Renew your faith. They said: O Messenger of Allah, how do we renew our faith? He said: Say frequently 'La ilaha illallah'. (Musnad Ahmad 8710, Authentic)", arabic: "جَدِّدُوا إِيمَانَكُمْ. قِيلَ: يَا رَسُولَ اللَّهِ، وَكَيْفَ نُجَدِّدُ إِيمَانَنَا؟ قَالَ: أَكْثِرُوا مِنْ قَوْلِ لَا إِلَهَ إِلَّا اللَّهُ" },
            { type: "scholar", translation: "Iman increases until it becomes like mountains, and it decreases until there is not even a mustard seed's weight left. (Imam Ahmad)", arabic: "يزيد حتى يكون كالجبال وينقص حتى لا يبقى منه شيء" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Nutrients", description: "Quran, Dhikr, Good Company.", icon: "Sun" },
                { title: "The Toxins", description: "Major Sins, Bad Company, Ghaflah (Heedlessness).", icon: "CloudRain" },
                { title: "The Protective Layer", description: "Leaving doubtful matters (Shubuhat).", icon: "Shield" },
                { title: "The Growth Spurt", description: "Trials handled with Sabr (Patience).", icon: "Zap" }
            ]},
            { type: "text", content: "### The Inevitability of Fluctuation\n\nEven the companions felt this fluctuation. Hanzalah (RA) once cried out, 'Hanzalah has become a hypocrite!' because his feeling of faith at home was different from his feeling when with the Prophet. The Prophet (PBUH) comforted him, saying that faith has moments and hours (Sa'ah wa Sa'ah)." },
            { type: "hadith", translation: "By Him in whose hand is my soul, if you were to remain as you are with me, the angels would shake your hands in your paths and your beds. But, O Hanzalah, there is a time for this and a time for that. (Sahih Muslim 2750)", arabic: "وَلَكِنْ يَا حَنْظَلَةُ سَاعَةً وَسَاعَةً" },
            { type: "reflection", translation: "If I do not feel my Iman increasing, it is likely decreasing. The heart never stands absolutely still.", arabic: "القلب كالماء، إذا ركد فسد" },
            { type: "legal", translation: "The Condition of Perpetuity: While faith fluctuates in strength, the core 'certainty' must remain. If doubt takes over the core, the status of a believer is questioned.", arabic: "ثبات الأصل" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "To protect the tree of Iman, we must constantly water it with acts of obedience and shield it from the toxins of sin. Expect fluctuation, but manage the decline." },
            { type: "quiz", question: "What is the mainstream Sunni belief regarding the state of Iman?", options: ["It is static and unchanging", "It increases with obedience and decreases with disobedience", "It only increases for scholars", "It is only determined by logic"], correctIndex: 1, hint: "See the quote by Imam Ash-Shafi'i." },
            { type: "quiz", question: "According to the Prophet (PBUH), how can one 'renew' their faith?", options: ["Buy new clothes", "Travel to Makkah only", "Say frequently 'La ilaha illallah'", "Sleep more"], correctIndex: 2, hint: "The declaration of Tawheed." },
            { type: "quiz", question: "In the Hadith of Hanzalah, what did the Prophet say about the constant high state of faith?", options: ["It is required for everyone", "If you stayed that way, angels would shake your hands", "It is impossible for humans", "It is a sign of hypocrisy"], correctIndex: 1, hint: "Angels would greet you in the streets." },
            { type: "quiz", question: "Which of the following is considered a 'toxin' that decreases Iman?", options: ["Reading Quran", "Obedience", "Heedlessness (Ghaflah)", "Charity"], correctIndex: 2, hint: "Forgetting Allah." },
            { type: "quiz", question: "What does 'Sakinah' mean in the context of increasing faith?", options: ["Wealth", "Tranquility", "Power", "Knowledge"], correctIndex: 1, hint: "A calmness from Allah." },
            { type: "document", title: "Fluctuations of Faith", description: "A psychological and spiritual guide to managing the 'lows' of faith.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Renewal of the Soul", description: "Imam Al-Ghazali's writings on polishing the heart to increase Iman.", url: "https://kalamullah.com/", platform: "Classical Archives" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 1 LESSON 4 TO 24 BLOCKS ---');
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
