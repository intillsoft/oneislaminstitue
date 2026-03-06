const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const uid = () => `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const moduleList = [
    { title: "Understanding Iman", sort: 1 },
    { title: "The Pillars of Islam", sort: 2 },
    { title: "The Pillars of Iman", sort: 3 },
    { title: "Ihsan and Spiritual Excellence", sort: 4 },
    { title: "The Prophet Muhammad (PBUH)", sort: 5 }
];

async function seedEliteWeek1() {
    console.log('\n============================================');
    console.log('🚀 ULTIMATE ELITE SEEDER: WEEK 1 (30 BLOCKS)');
    console.log('============================================\n');

    const { data: courses, error: courseError } = await sb.from('jobs').select('id, title').ilike('title', 'Foundations of Faith').limit(1);
    if (courseError) { console.error('Error fetching course:', courseError); return; }
    if (!courses || courses.length === 0) { console.error('Course "Foundations of Faith" not found'); return; }
    const course = courses[0];
    console.log(`🎯 Found Course ID: ${course.id}`);

    for (const modInfo of moduleList) {
        const { data: modules, error: modError } = await sb.from('course_modules').select('id, title').eq('course_id', course.id).eq('sort_order', modInfo.sort).limit(1);
        if (modError) { console.error(`Error fetching Module ${modInfo.sort}:`, modError); continue; }
        if (!modules || modules.length === 0) { console.error(`Module with sort_order ${modInfo.sort} not found`); continue; }
        const mod = modules[0];

        console.log(`\n📚 SEEDING MODULE ${mod.sort_order || modInfo.sort}: ${mod.title}`);
        const { data: lessons, error: lessonFetchError } = await sb.from('course_lessons').select('id, title, sort_order').eq('module_id', mod.id).order('sort_order');
        if (lessonFetchError) { console.error(`Error fetching lessons for ${mod.title}:`, lessonFetchError); continue; }

        for (const lesson of lessons) {
            const blocks = generateEliteBlocks(lesson.title, mod.title, lesson.sort_order);
            const { error: updateError } = await sb.from('course_lessons').update({ 
                content_blocks: blocks, 
                duration_minutes: 45
            }).eq('id', lesson.id);
            
            if (updateError) console.error(`  ❌ Error in ${lesson.title}:`, updateError.message);
            else console.log(`  ✅ Seeded: ${lesson.title} (30 blocks)`);
        }
    }
}

function generateEliteBlocks(title, mod, sort) {
    const blocks = [];
    let order = 1;

    // Content specialized by Module
    const isMod1 = mod.includes('Understanding');
    const isMod2 = mod.includes('Islam');
    const isMod3 = mod.includes('Iman');
    const isMod4 = mod.includes('Ihsan');
    const isMod5 = mod.includes('Prophet');

    // 1. Hook
    let hook = `How do you measure a thing as vast as the human soul? In the modern era, we use metrics for everything—except the one thing that actually determines our peace. This lesson on **${title}** introduces the only metric that matters.`;
    if (isMod1 && sort === 1) hook = "A successful surgeon returns home after saving three lives. Yet lying in the dark, she feels a hollow ache she cannot name. Wealth, status, skill — none of it fills the void.";
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### The Hook\n\n${hook}` });

    // 2. Bridge
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Connecting the Dots\n\nLast we looked at the broad overview; now we tighten the lens. You cannot build a skyscraper on sand, and you cannot build a life on unexamined assumptions. Let's examine the specifics of ${title.toLowerCase()}.` });

    // 3. Objectives
    blocks.push({ id: uid(), type: 'objectives', order: order++, content: { items: [
        `Master the technical limits of ${title}.`,
        `Apply the Prophetic model of character to this area.`,
        `Differentiate between cultural habits and theological requirements.`,
        `Synthesize a personal action plan for immediate growth.`
    ] }});

    // 4-6. Key Concepts
    const terms = [
        { t: "Sidq", d: "Truthfulness in relationship with the Divine." },
        { t: "Ikhlas", d: "Purity of intention; doing it for the One, not the many." },
        { t: "Yaqeen", d: "Unshakeable certainty that survives the storm." }
    ];
    terms.forEach(term => {
        blocks.push({ id: uid(), type: 'concept', order: order++, content: { term: term.t, definition: term.d, context: "Scholarly insight from the primary texts." } });
    });

    // 7-11. Core Teachings
    const cores = [
        { t: "The Architecture of the Unseen", c: "We often focus on what we can see—the ritual, the dress, the social circles. But Islam teaches that these are merely the leaves. The root is in the heart. If the root is poisoned by arrogance or doubt, the leaves eventually wither." },
        { t: "The Cognitive Framework", c: "How do you think about God? Do you see Him as a harsh judge, or as Al-Wadud (The Most Loving)? Your theology determines your psychology. This lesson reframes your cognitive relationship with ${title}." },
        { t: "The Power of Consistency", c: "Small, repeated actions (Al-Dawam) are the currency of the soul. It is better to do one tiny good deed daily than to perform a massive act once a year. Consistency creates a groove in the soul that makes uprightness natural." },
        { t: "Navigating the Modern Noise", c: "We live in an era of engineered distraction. Heedlessness (Ghaflah) is the disease; remembrance (Dhikr) is the cure. Reclaiming your attention is an act of spiritual rebellion." },
        { t: "The Ultimate Goal", c: "Success is not measured in debates won or books read. It is measured in the tranquility (Sakina) found in the heart during a trial. Does your understanding of ${title} provide that peace?" }
    ];
    cores.forEach(c => {
        blocks.push({ id: uid(), type: 'text', order: order++, content: `### ${c.t}\n\n${c.c}` });
    });

    // 12. Misconception
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Clearing the Fog\n\n**Common Misconception:** That ${title.toLowerCase()} is only for 'holy people' or saints.\n\n**The Reality:** The Prophetic message was sent to broken people, struggling people, and forgotten people. It is a ladder, not a pedestal.` });

    // 13. Quran Evidence
    blocks.push({ id: uid(), type: 'quran', order: order++, content: { translation: "Verily, in the remembrance of Allah do hearts find rest.", arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", source: "Surah Ar-Ra'd 13:28" } });

    // 14. Hadith Evidence
    blocks.push({ id: uid(), type: 'hadith', order: order++, content: { translation: "Religion is sincerity (to Allah, His Book, His Messenger...).", arabic: "الدِّيـنُ النَّصيـحَةُ", source: "Sahih Muslim" } });

    // 15. Scholar Insight
    blocks.push({ id: uid(), type: 'scholar', order: order++, content: { scholar: "Imam Al-Ghazali", insight: "The heart is like a mirror. Sins are like dust. Every good deed is a polish uniquely suited for ${title}.", source: "Ihya Ulum al-Din" } });

    // 16. Case Study Scenario
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Behavioral Scenario\n\nA student faces a difficult choice where the 'easy path' involves a small lie, and the 'hard path' involves the truth. How does the concept of **Sidq** discussed today provide the strength to choose the hard path? Why is the hard path often shorter in the long run?` });

    // 17. Mini Activity
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### The 5-Minute Audit\n\n1. Identify the one area where you are currently most heedless.\n2. Apply the 'One Minute Rule': Dedicate exactly 60 seconds of focused reflection to that area tonight.\n3. Write down the first emotion you feel.` });

    // 18-19. Modern Apps
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### Digital Application\n\nAlgorithms are designed to trigger outrage. A believer uses the framework of ${title} to move from 'outrage' to 'outreach'. Respond with compassion where the internet expects anger.` });
    blocks.push({ id: uid(), type: 'text', order: order++, content: `### The Productivity Trap\n\nModern work culture defines worth by output. Islamic theology defines worth by intent (Niyyah). You can be 'unproductive' by worldly standards but highly rewarded by Divine standards if your heart is present.` });

    // 20-24. Quizzes (Crucial for Interactive Feedback)
    const quizzes = [
        { q: "What is the primary spiritual antidote to heedlessness (Ghaflah)?", o: ["Arguing online", "Dhikr (Remembrance)", "Bigger house", "More sleep"], c: 1 },
        { q: "In the mirror analogy, what do good deeds represent?", o: ["The reflection", "The frame", "The polish", "The glass"], c: 2 },
        { q: "True or False: Every small action is a brick in the foundation of faith.", o: ["True", "False"], c: 0 },
        { q: "Which character trait is defined as 'Truthfulness with God'?", o: ["Ikhlas", "Sidq", "Haya", "Karam"], c: 1 },
        { q: "What is the 'highest' goal of religious knowledge?", o: ["Winning debates", "Tranquility and connection to God", "Earning a degree", "Public recognition"], c: 1 }
    ];
    quizzes.forEach(quiz => {
        blocks.push({ id: uid(), type: 'quiz', order: order++, question: quiz.q, options: quiz.o, correctIndex: quiz.c });
    });

    // 25-26. Callouts (presented as Text)
    blocks.push({ id: uid(), type: 'text', order: order++, content: "### Critical Reflection Question\n\nIf you were the only person on earth, would you still perform the good deeds you did today? Sit with that truth for 30 seconds." });
    blocks.push({ id: uid(), type: 'text', order: order++, content: "### The Scholarly Warning\n\nImam ash-Shafi'i warned: 'Knowledge is not what is memorized; knowledge is what benefits.' Ask yourself: how does this lesson benefit my family today?" });

    // 27. Guided Reflection
    blocks.push({ id: uid(), type: 'reflection', order: order++, content: { prompt: "Close your eyes and imagine your heart as a garden. What does it look like right now? What is the one weed you need to pull?", guiding_thought: "The gardener does not hate the weeds; they simply value the roses more." } });

    // 28. Action Plan
    blocks.push({ id: uid(), type: 'text', order: order++, content: "### Your 24-Hour Plan\n\n- **Hour 1:** Finalize your Niyyah (Intention).\n- **Hour 12:** Perform one invisible act of kindness.\n- **Hour 24:** Reflect on the peace gained." });

    // 29. Dua
    blocks.push({ id: uid(), type: 'reflection', order: order++, content: { translation: "O Allah, I seek refuge in You from knowledge that does not benefit.", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ" } });

    // 30. Conclusion
    blocks.push({ id: uid(), type: 'conclusion', order: order++, content: `You have successfully completed the deep-dive into **${title}**. You are no longer just an observer; you are a participant in the tradition. Carry this light forward.` });

    return blocks;
}

seedEliteWeek1().catch(e => console.error(e));


// ... logic to build blocks, target modules, and update database ...
