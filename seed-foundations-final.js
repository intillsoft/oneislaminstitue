const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateFiveQuizzes = (topic) => [
    { "question": `Which factor primarily drives the increase of Iman in ${topic}?`, "options": ["Sincere Deeds", "Passive Observation", "Wealth Accumulation"], "correctIndex": 0, "hint": "Think of the correlation between prayer and peace." },
    { "question": `True or False: Doubt is the natural enemy of Iman in the context of ${topic}.`, "options": ["True", "False"], "correctIndex": 0, "hint": "Certainty (Yaqin) is the anchor." },
    { "question": `What is the role of the heart in ${topic}?`, "options": ["The seat of conviction", "A purely physical pump", "Irrelevant to faith"], "correctIndex": 0, "hint": "It is where Sakinah descends." },
    { "question": `Which pillar of Iman involves belief in the Unseen?`, "options": ["Belief in Angels", "Belief in physical laws", "Social contracts"], "correctIndex": 0, "hint": "Angels are Ghaib." },
    { "question": `How does studying ${topic} impact one's perspective on trials?`, "options": ["They are seen as tests", "They are seen as bad luck", "They are ignored"], "correctIndex": 0, "hint": "Recall the concept of Qadar." }
];

const generateLesson = (title, quote, author, objectives, contentBlocks) => ({
    title,
    blocks: [
        { "id": `c_${title.replace(/\s/g, '_')}`, "type": "callout", "content": quote, author, "order": 0 },
        { "id": `o_${title.replace(/\s/g, '_')}`, "type": "objectives", "items": objectives, "order": 1 },
        ...contentBlocks.map((b, i) => ({ ...b, "id": `b_{title.replace(/\s/g, '_')}_${i}`, "order": i + 2 })),
        ...generateFiveQuizzes(title).map((q, i) => ({ ...q, "id": `qz_${title.replace(/\s/g, '_')}_${i}`, "type": "quiz", "order": 100 + i }))
    ]
});

const FINAL_BATCH = [
    generateLesson(
        'The Increase and Decrease of Faith',
        "Faith is like a plant; it withers without the water of deeds and the sun of remembrance.",
        "Al-Ghazali",
        ["Mechanisms of Growth", "The Anatomy of Doubt", "Practical Maintenance of the Soul"],
        [
            { "type": "text", "content": `## The Ebb and Flow of the Heart\n\nOne of the most profound realizations in the life of a believer is that faith is not a flat line. It is a series of peaks and valleys. Understanding this dynamism prevents despair during 'low' periods and encourages vigilance during 'high' ones.\n\n> [Q] "It is He who sent down tranquility into the hearts of the believers that they would increase in faith along with their [present] faith..." (Surah Al-Fath 48:4) || هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَّعَ إِيمَانِهِمْ` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "title": "The Physiology of Faith", "description": "Why does my Iman feel low? An analysis of the internal environment of the soul." },
            { "type": "text", "content": `### The Nutrition of the Soul\n\nJust as the body requires specific nutrients, the soul requires specific actions to thrive. Sincere prayer, the recitation of the Qur'an, and the service of others act as catalysts for growth. Conversely, sins act as toxins that dim the light of the heart.\n\n> [H] "Whoever among you sees an evil, let him change it with his hand..." (Sahih Muslim). This action, the Prophet (PBUH) noted, represents the strength or weakness of one's Iman. || مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ... وَذَلِكَ أَضْعَفُ الإِيمَانِ.` },
            { "type": "infographic", "layout": "process", "items": [
                { "title": "Seed", "description": "The initial testimony and submission.", "icon": "Filter" },
                { "title": "Water", "description": "Righteous deeds and constant remembrance.", "icon": "Droplets" },
                { "title": "Harvest", "description": "The sweetness of faith and tranquility.", "icon": "Star" }
            ]},
            { "type": "text", "content": `### Practical Reflection\n\nWhen was the last time you felt a surge of certainty? What environment were you in? Who were you with? These are the variables that control the climate of your heart.\n\n> [R] Spend 5 minutes identifying one 'toxin' you can remove from your daily routine to allow your faith to breathe again. || اقضِ 5 دقائق في تحديد سم واحد يمكنك إزالته من روتينك اليومي للسماح لإيمانك بالتنفس مرة أخرى.` },
            { "type": "conclusion", "content": "The path of faith is a journey of constant repair. Do not be discouraged by the valleys; use the peaks to build the resilience needed for the climb." },
            { "type": "document", "title": "Maintaining Spiritual Momentum", "description": "A guide to daily practices that sustain the internal light.", "url": "https://yaqeeninstitute.org", "platform": "Scholarly Archive" }
        ]
    ),
    generateLesson(
        'The Six Pillars of Iman: An Overview',
        "Iman is to believe in Allah, His Angels, His Books, His Messengers, the Last Day, and the Divine Decree.",
        "The Hadith of Gabriel",
        ["The Pillars of Certainty", "Mapping the Unseen", "Foundational Credal Points"],
        [
            { "type": "text", "content": `## The Intellectual Framework of Faith\n\nWhile Islam is the house, the **Six Pillars of Iman** are the foundation stones. These pillars define the scope of the Muslim's worldview—stretching from the beginning of time to the eternity of the afterlife, and from the seen world to the vast realms of the unseen.\n\n> [Q] "Righteousness is not that you turn your faces toward the east or the west... but [true] righteousness is [in] one who believes in Allah, the Last Day, the angels, the Book, and the prophets..." (Surah Al-Baqarah 2:177) || لَّيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ قِبَلَ الْمَشْرِقِ وَالْمَغْرِبِ وَلَٰكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَالْمَلَائِكَةِ وَالْكِتَابِ وَالنَّبِيِّينَ` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", "title": "Mapping the Creed", "description": "A comprehensive overview of the pillars that support the entire structure of the Islamic belief system." },
            { "type": "text", "content": `### The Scope of Conviction\n\nEach pillar represents a distinct dimension of reality. Belief in Allah is the root; belief in the others is the fruit of that root. To understand one is to begin to understand the majesty of the Creator's plan.\n\n> [C] Concept: The Pillars are not independent ideas; they are an integrated network of truths. If one is removed, the entire structure of certainty collapses. || مفهوم: الأركان ليست أفكاراً مستقلة؛ إنها شبكة متكاملة من الحقائق. إذا تمت إزالة واحد، ينهار هيكل اليقين بالكامل.` },
            { "type": "infographic", "layout": "grid", "items": [
                { "title": "Allah", "description": "The absolute source of all existence.", "icon": "Crown" },
                { "title": "Angels", "description": "The noble workers of the Unseen.", "icon": "Sparkles" },
                { "title": "Books", "description": "The Divine light sent for guidance.", "icon": "Book" },
                { "title": "Prophets", "description": "The human archetypes of perfection.", "icon": "Users" },
                { "title": "Last Day", "description": "The ultimate return to justice.", "icon": "DoorOpen" },
                { "title": "Decree", "description": "Trusting the wisdom of the Plan.", "icon": "Target" }
            ]},
            { "type": "text", "content": `### The Legal Anchor\n\nFrom a juridical perspective, these pillars are the requirements for being recognized as a believer in this world. They are the 'minimum threshold' of the sacred covenant.\n\n> [L] Legal Principle: The denial of any single pillar is legally tantamount to the rejection of the entire creed. || القاعدة الفقهية: إنكار أي ركن واحد يعادل قانوناً رفض العقيدة بأكملها.` },
            { "type": "conclusion", "content": "These six pillars are the map of the believer's travels through existence. They provide the 'Why' behind our 'How', turning every breath into a testimony of Truth." },
            { "type": "document", "title": "The Pillars of Faith", "description": "A detailed technical breakdown of the 6 pillars and their rational proofs.", "url": "https://yaqeeninstitute.org", "platform": "Yaqeen Institute" }
        ]
    )
];

async function seed() {
    console.log('--- SEEDING FINAL BATCH OF COMPREHENSIVE LESSONS (1.4 & 1.6) ---');
    const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
    if (!course) return console.log('Course not found');

    for (const item of FINAL_BATCH) {
        process.stdout.write(`Syncing Narrative: "${item.title}"... `);
        const { error } = await supabase.from('course_lessons').update({ content_blocks: item.blocks }).eq('course_id', course.id).eq('title', item.title);
        if (error) console.log('ERR: ' + error.message);
        else console.log('DONE');
    }
}
seed();
