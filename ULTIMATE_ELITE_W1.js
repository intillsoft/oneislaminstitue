const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const uid = () => `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// Module-specific theme data for high-quality generation
const moduleThemes = {
    1: {
        title: "Understanding Iman",
        description: "The intellectual and spiritual foundation of faith.",
        quran: { t: "The believers are only those who, when Allah is mentioned, their hearts tremble; and when His verses are recited, it increases them in faith.", s: "Surah Al-Anfal 8:2", a: "إِنَّمَا ٱلمُؤۡمِنُونَ ٱلَّذِينَ إِذَا ذُكِرَ ٱللَّهُ وَجِلَتۡ قُلُوبُهُمۡ" },
        hadith: { t: "Iman has over seventy branches; the highest is 'La ilaha illallah', the lowest is removing harm from a path.", s: "Sahih Muslim 35", a: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً" },
        scholar: { n: "Imam al-Ghazali", i: "The heart is the 'king' and the limbs are its subjects. When the king is sound, order flows outward naturally.", s: "Ihya Ulum al-Din" }
    },
    2: {
        title: "The Pillars of Islam",
        description: "The outward framework of a Muslim's life.",
        quran: { t: "And establish prayer and give zakat and bow with those who bow.", s: "Surah Al-Baqarah 2:43", a: "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ" },
        hadith: { t: "Islam is built upon five: testimony that there is no god but Allah... prayer, zakat, hajj, and fasting Ramadan.", s: "Bukhari & Muslim", a: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ" },
        scholar: { n: "Imam al-Nawawi", i: "These five pillars are the foundation. If the foundation is strong, the building of faith stands tall.", s: "Commentary on 40 Hadith" }
    },
    3: {
        title: "The Pillars of Iman",
        description: "The inward convictions that define a believer.",
        quran: { t: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers.", s: "Surah Al-Baqarah 2:285", a: "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيۡهِ مِن رَّبِّهِۦ" },
        hadith: { t: "(Jibreel) said: Tell me about Iman. He replied: To believe in Allah, His angels, His books, His messengers, the Last Day, and Qadr.", s: "Sahih Muslim", a: "أَنْ تُؤْمِنَ بِاللَّهِ وَمَلائِكَتِهِ" },
        scholar: { n: "Ibn Taymiyyah", i: "True Iman is the alignment of heart, tongue, and limbs with the revelation of the Unseen.", s: "Al-Aqidah al-Wasitiyyah" }
    },
    4: {
        title: "Ihsan and Spiritual Excellence",
        description: "The pinnacle of the spiritual journey.",
        quran: { t: "And do good; indeed, Allah loves the doers of good (Al-Muhsinin).", s: "Surah Al-Baqarah 2:195", a: "وَأَحْسِنُوا ۚ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ" },
        hadith: { t: "Ihsan is to worship Allah as though you see Him; and if you do not see Him, then indeed He sees you.", s: "Hadith of Jibreel", a: "الإِحْسَانُ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ" },
        scholar: { n: "Ibn al-Qayyim", i: "Ihsan is the soul of Iman. Without it, rituals become empty shells and knowledge becomes cold information.", s: "Madarij al-Salikin" }
    },
    5: {
        title: "The Prophet Muhammad (PBUH)",
        description: "The embodiment of faith and the mercy to mankind.",
        quran: { t: "And indeed, you (O Muhammad) are of a great moral character.", s: "Surah Al-Qalam 68:4", a: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ" },
        hadith: { t: "None of you [truly] believes until I am more beloved to him than his father, his child, and all of mankind.", s: "Bukhari", a: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ" },
        scholar: { n: "Qadi Iyad", i: "He was the living Quran. To study his life is to see Divine guidance in human form.", s: "Al-Shifa" }
    }
};

async function seedEliteWeek1() {
    console.log('\n============================================');
    console.log('🚀 ULTIMATE ELITE WEEK 1 SEEDER (30 BLOCKS)');
    console.log('============================================\n');

    const { data: courses } = await sb.from('jobs').select('id, title').ilike('title', 'Foundations of Faith').limit(1);
    const courseId = courses?.[0]?.id;
    if (!courseId) return console.error('Course not found');

    for (let i = 1; i <= 5; i++) {
        const { data: modules } = await sb.from('course_modules').select('id, title').eq('course_id', courseId).eq('sort_order', i).limit(1);
        const mod = modules?.[0];
        if (!mod) continue;

        console.log(`\n📚 SEEDING MODULE ${i}: ${mod.title}`);
        const { data: lessons } = await sb.from('course_lessons').select('id, title, sort_order').eq('module_id', mod.id).order('sort_order');

        for (const lesson of lessons) {
            const blocks = generateEliteBlocks(lesson, mod, i);
            const { error } = await sb.from('course_lessons').update({ 
                content_blocks: blocks, 
                duration_minutes: 45 
            }).eq('id', lesson.id);
            
            if (error) console.error(`  ❌ Error in ${lesson.title}:`, error.message);
            else console.log(`  ✅ Seeded: ${lesson.title} (30 blocks)`);
        }
    }
}

function generateEliteBlocks(lesson, mod, modIndex) {
    const theme = moduleThemes[modIndex];
    let order = 1;
    const blocks = [];

    // 1. Hook
    let hookText = `Imagine standing before a vast ocean. You can see the surface, but the depth is where the life exists. **${lesson.title}** is our dive into the depths of faith.`;
    if (modIndex === 1 && lesson.sort_order === 1) {
        hookText = "A successful surgeon returns home after saving three lives. Yet lying in the dark, she feels a hollow ache she cannot name. Wealth, status, skill — none of it fills the void.";
    }
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### The Hook\n\n${hookText}` });

    // 2. Bridge
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Connecting the Dots\n\nBuilding upon our exploration of **${theme.title}**, this lesson bridges conceptual knowledge with spiritual reality. We move from asking 'what' to asking 'how'.` });

    // 3. Objectives
    blocks.push({ id: uid(), type: 'objectives', order: order++, content: { items: [
        `Define the core theological parameters of ${lesson.title}.`,
        `Differentiate between cultural practice and Prophetic example.`,
        `Identify the internal psychological shifts required for this growth.`,
        `Develop a concrete daily habit reflecting this lesson's wisdom.`
    ] }});

    // 4-6. Concepts (Sacred Terminology)
    const prefixes = ['The Inward Anchor', 'The Outward Evidence', 'The Spiritual Fruit'];
    const conceptMap = {
        1: [{t: 'Tasdiq', d: 'Heartfelt affirmation.'}, {t: 'Iqrar', d: 'Verbal testimony.'}, {t: 'Amal', d: 'Action of limbs.'}],
        2: [{t: 'Arkan', d: 'The pillars that hold the structure.'}, {t: 'Ibadah', d: 'Servitude and worship.'}, {t: 'Ubudiyyah', d: 'The state of slavehood to God.'}],
        3: [{t: 'Ghaib', d: 'The Unseen reality.'}, {t: 'Fart', d: 'Divine obligation.'}, {t: 'Fitrah', d: 'The innate human disposition.'}],
        4: [{t: 'Muraqabah', d: 'Constant awareness of God watching.'}, {t: 'Ikhlas', d: 'Sincerity of purpose.'}, {t: 'Sidq', d: 'Truthfulness with one\'s self and God.'}],
        5: [{t: 'Sunnah', d: 'The path and example of the Prophet.'}, {t: 'Uswah', d: 'The absolute role model.'}, {t: 'Nubuwwah', d: 'The nature of Prophethood.'}]
    };
    (conceptMap[modIndex] || conceptMap[1]).forEach((c, idx) => {
        blocks.push({ id: uid(), type: 'concept', order: order++, content: { term: c.t, definition: c.d, context: prefixes[idx] } });
    });

    // 7-12. Core Teachings (High-level Scholarly Narrative)
    const coreMap = [
        { t: "The Architecture of the Unseen", c: "Every physical structure has an invisible foundation. In Islam, the visible acts of worship are anchored in an invisible internal world. If the internal world decays, the external acts become brittle." },
        { t: "The Feedback Loop", c: "Knowledge produces awe; awe produces action; action produces certainty. This is the divine spiral of growth. To jump to action without knowledge leads to burnout; to stick to knowledge without action leads to arrogance." },
        { t: "The Mirror Analogy", c: "Imam al-Ghazali taught that the heart is like a mirror designed to reflect the Divine Light. Sins are like dust. Every good deed is a polish. ${lesson.title} is a specialized tool for that polishing process." },
        { t: "The Modern Challenge", c: "We live in a culture of 'Heedlessness' (Ghaflah). We are surrounded by screens that demand our attention but ignore our souls. Reclaiming your focus is the first step to reclaiming your faith." },
        { t: "Authenticity vs Performance", c: "True faith is measured in the dark—when no one is watching. If your religion is merely a social performance, it will shatter during a private crisis. ${lesson.title} builds the 'secret floor' of your faith." },
        { t: "The Ultimate Metric", c: "How do you know you've learned this? Not by a quiz score, but by the level of 'Sakina' (tranquility) you feel in your next moment of stress." }
    ];
    coreMap.forEach(core => {
        blocks.push({ id: uid(), type: 'text', order: order++, content: `### ${core.t}\n\n${core.c}` });
    });

    // 13. Quran
    blocks.push({ id: uid(), type: 'quran', order: order++, content: { translation: theme.quran.t, arabic: theme.quran.a, source: theme.quran.s } });

    // 14. Hadith
    blocks.push({ id: uid(), type: 'hadith', order: order++, content: { translation: theme.hadith.t, arabic: theme.hadith.a, source: theme.hadith.s } });

    // 15. Scholar
    blocks.push({ id: uid(), type: 'scholar', order: order++, content: { scholar: theme.scholar.n, insight: theme.scholar.i, source: theme.scholar.s } });

    // 16. Misconception
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Clearing the Fog\n\n**Common Misconception:** That **${lesson.title}** is an 'all or nothing' game. Either you're perfect or you've failed.\n\n**The Reality:** Faith is a garment that wears out (Prophetic analogy) and requires constant repair. The goal is not perfection, but persistent direction.` });

    // 17. Scenario
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Behavioral Scenario\n\nImagine a person who prays perfectly in public but is harsh with their family in private. How does the core concept of this lesson reveal the flaw in this behavior? What would a 'character pivot' look like for this individual?` });

    // 18. Mini Activity
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### The 60-Second Audit\n\nClose your eyes. Identify the single biggest distraction in your life right now. How does **${lesson.title}** provide the framework to outgrow that distraction? Write down one action you will take in the next hour.` });

    // 19-20. Modern Applications
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Faith in the Digital Age\n\nAlgorithms are engineered to capture your 'Ghaflah' (heedlessness). Using this lesson to build intentional digital habits is an act of spiritual preservation.` });
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### The Productivity Trap\n\nWork culture measures worth by output. **${lesson.title}** teaches that your worth is measured by 'Niyyah' (Intention). You can be worldly 'unproductive' while divine 'successful'.` });

    // 21-25. Quizzes
    const quizzes = [
        { q: "What is the 'highest' level of faith mention in the prophetic tradition?", o: ["Perfect prayer", "The declaration of La ilaha illallah", "Hajj", "Deep academic knowledge"], c: 1 },
        { q: "According to the lesson, what is the 'soul' of all rituals?", o: ["Punctuality", "Social recognition", "Ihsan (Spiritual Excellence)", "Loud recitation"], c: 2 },
        { q: "In the mirror analogy, what does 'dust' represent?", o: ["Wisdom", "Sins and distractions", "Charity", "Long life"], c: 1 },
        { q: "Which habit is defined as 'Truthfulness with God'?", o: ["Sidq", "Ikhlas", "Muraqabah", "Sabr"], c: 0 },
        { q: "What is the primary spiritual disease of the modern age?", o: ["Lack of information", "Heedlessness (Ghaflah)", "Physical weakness", "Poverty"], c: 1 }
    ];
    quizzes.forEach(quiz => {
        blocks.push({ id: uid(), type: 'quiz', order: order++, question: quiz.q, options: quiz.o, correctIndex: quiz.c });
    });

    // 26-27. Reflection/Callout
    blocks.push({ id: uid(), type: 'text', order: order++, content: "### A Question for the Soul\n\nIf all your wealth and status were removed tomorrow, what would be left of your connection to the Divine? Is your foundation built on temporary things or the Eternal?" });
    blocks.push({ id: uid(), type: 'reflection', order: order++, content: { prompt: "Think of an area where you have been performing for people rather than for Allah. What would it look like to make that act purely private today?", guiding_thought: "The secret worship is the anchor of the public soul." } });

    // 28. Action Plan
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Your Elite Action Plan\n\n1. **Reflect:** Sit for 5 minutes in silence.\n2. **Act:** Perform one 'invisible' good deed.\n3. **Protect:** Guard your next prayer from 'Ghaflah'.` });

    // 29. Final Dua/Reflection
    blocks.push({ id: uid(), type: 'reflection', order: order++, content: { translation: theme.dua.translation, arabic: theme.dua.arabic } });

    // 30. Conclusion
    blocks.push({ id: uid(), type: 'conclusion', order: order++, content: `You have completed the elite study of **${lesson.title}**. You now carry a piece of the Prophetic inheritance. Use it to light your path and the path of others.` });

    return blocks;
}

seedEliteWeek1().catch(e => console.error(e));

