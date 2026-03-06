const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateFiveQuizzes = (topic) => {
    // Generate 5 quizzes based on the topic
    const quizzes = [
        { "question": `What is the primary theme of the lesson on ${topic}?`, "options": ["Spiritual Growth", "Historical Dates", "Financial Literacy"], "correctIndex": 0, "hint": "Focus on the internal development." },
        { "question": `How should one apply the concepts of ${topic} to daily life?`, "options": ["Through sincere action", "By only reading", "By ignoring challenges"], "correctIndex": 0, "hint": "Action is the fruit of conviction." },
        { "question": `True or False: The concepts of ${topic} are purely academic.`, "options": ["False", "True"], "correctIndex": 0, "hint": "Islamic knowledge is a light meant for practice." },
        { "question": `In the hierarchy of ${topic}, which element resides at the peak?`, "options": ["Sincerity (Ikhlas)", "Logic", "Wealth"], "correctIndex": 0, "hint": "It is the soul's purity." },
        { "question": `What is the ultimate goal of studying ${topic}?`, "options": ["Divine Proximity", "Social Recognition", "Physical Strength"], "correctIndex": 0, "hint": "It is the 'Qurb' to the Creator." }
    ];
    return quizzes;
};

const generateLesson = (title, quote, author, objectives, contentBlocks) => ({
    title,
    blocks: [
        { "id": `c_${title.replace(/\s/g, '_')}`, "type": "callout", "content": quote, author, "order": 0 },
        { "id": `o_${title.replace(/\s/g, '_')}`, "type": "objectives", "items": objectives, "order": 1 },
        ...contentBlocks.map((b, i) => ({ ...b, "id": `b_{title.replace(/\s/g, '_')}_${i}`, "order": i + 2 })),
        ...generateFiveQuizzes(title).map((q, i) => ({ ...q, "id": `qz_${title.replace(/\s/g, '_')}_${i}`, "type": "quiz", "order": 100 + i }))
    ]
});

const NEW_LESSONS = [
    generateLesson(
        'The Relationship between Iman and Islam',
        "Islam is the outward submission, while Iman is the inward conviction. They are distinct yet inseparable.",
        "Imam Shafi'i",
        ["Inward vs Outward Submission", "The Hadith of Gabriel", "Legal vs Spiritual Implications"],
        [
            { "type": "text", "content": `## The Two Halves of One Whole\n\nA building is made of its visible structure and its internal framework. **Islam** and **Iman** function in the same way. Islam represents the physical surrender—the prayer, the fasting, the testimony. Iman represents the spiritual engine—the belief, the certainty, the devotion.\n\n> [Q] "The bedouins say, 'We have believed.' Say, 'You have not [yet] believed; but say [instead], \"We have submitted,\" for faith has not yet entered your hearts...'" (Surah Al-Hujurat 49:14) || قَالَتِ الْأَعْرَابُ آمَنَّا ۖ قُل لَّمْ تُؤْمِنُوا وَلَٰكِن قُولُوا أَسْلَمْنَا وَلَمَّا يَدْخُلِ الْإِيمَانُ فِي قُلُوبِكُمْ` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", "title": "The Duality of Submission", "description": "Understanding the interplay between the external law and the internal state." },
            { "type": "text", "content": `### The Hierarchy of Excellence\n\nWhen we study the **Hadith of Jibril**, we see a clear progression. First comes Islam (the basics), then Iman (the internal world), and finally Ihsan (the peak). This hierarchy shows that while everyone who is a *Mu'min* (believer) is a *Muslim*, not every *Muslim* has yet attained the full rank of *Iman*.\n\n> [H] "Islam is built upon five [pillars]... Iman is to believe in Allah, His angels, His books..." (Sahih Bukhari) || بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ... وَالإِيمَانُ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلاَئِكَتِهِ...` },
            { "type": "infographic", "layout": "process", "items": [
                { "title": "Islam", "description": "Physical Submission (Pillars).", "icon": "Activity" },
                { "title": "Iman", "description": "Spiritual Conviction (Pillars).", "icon": "Heart" },
                { "title": "Ihsan", "description": "Spiritual Excellence (Highest Rank).", "icon": "Sparkles" }
            ]},
            { "type": "text", "content": `### Scholarly Reflections on the Soul\n\nScholars have long noted that when used together, Islam refers to action and Iman to belief. When used alone, each implies the other. This semantic beauty reflects the integrated nature of the Muslim personality.\n\n> [S] Technical analysis: Iman is the soul, Islam is the body. One cannot live without the other in this world. || التحليل الفني: الإيمان هو الروح، والإسلام هو الجسد. لا يمكن لأحدهما أن يعيش بدون الآخر في هذا العالم.` },
            { "type": "conclusion", "content": "To conclude, our journey from submission to conviction is a path of deepening sincerity. We begin with the limbs in Islam and anchor ourselves with the heart in Iman." },
            { "type": "document", "title": "Islam & Iman: The Integration", "description": "A scholarly paper on the nuances of the Hadith involving Archangel Gabriel.", "url": "https://yaqeeninstitute.org", "platform": "Yaqeen Institute" }
        ]
    ),
    generateLesson(
        'The Concept of Ihsan (Excellence)',
        "Ihsan is to worship Allah as if you see Him; and if you do not see Him, [know that] He sees you.",
        "The Prophet (PBUH)",
        ["Definition of Excellence", "The State of Mushahadah", "Impact on Character"],
        [
            { "type": "text", "content": `## The Peak of Human Potential\n\n**Ihsan** is the highest stage of the triad (Islam, Iman, Ihsan). It is the bridge between the human and the Divine, where the believer moves from mere obedience to a state of constant mindfulness. It is not an addition to faith, but the perfection of it.\n\n> [Q] "And who is better in religion than one who submits himself to Allah while being a doer of good (Muhsin)..." (Surah An-Nisa 4:125) || وَمَنْ أَحْسَنُ دِينًا مِّمَّنْ أَسْلَمَ وَجْهَهُ لِلَّهِ وَهُوَ مُحْسِنٌ` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "title": "Living with Presence", "description": "How the Muhsin (person of Ihsan) transforms every mundane act into an act of worship." },
            { "type": "text", "content": `### The Two Degrees of Ihsan\n\nScholars explain that Ihsan has two degrees. The first is **Mushahadah** (Contemplation), where the heart is so full of Allah that it is as if the eyes are seeing Him. The second is **Muraqabah** (Watchfulness), where you act with the constant awareness that Allah is watching you.\n\n> [R] Spend a moment today reflecting: If you could see your Creator, how would your posture, your speech, and your thoughts change? || تأمل لحظة اليوم: لو كنت ترى خالقك، كيف ستتغير وقفتك وكلامك وأفكارك؟` },
            { "type": "infographic", "layout": "grid", "items": [
                { "title": "Presence", "description": "Worshipping as if you see Him.", "icon": "Target" },
                { "title": "Mindfulness", "description": "The certainty that He sees you.", "icon": "Eye" },
                { "title": "Quality", "description": "Doing everything with perfection.", "icon": "Sparkles" }
            ]},
            { "type": "text", "content": `### Excellence in Conduct\n\nIhsan is not limited to prayer. It extends to how you treat your parents, how you conduct your business, and even how you treat animals and the environment. It is the signature of the believer.\n\n> [L] The Legal Maxim: The Muhsin is one who gives more than what is required and takes less than what is owed. || القاعدة الفقهية: المحسن هو من يعطي أكثر مما يجب ويأخذ أقل مما يستحق.` },
            { "type": "conclusion", "content": "Ihsan is the fragrance of faith. It is the difference between a mechanical ritual and a spiritual encounter. May we all strive for the rank of the Muhsineen." },
            { "type": "document", "title": "The Path to Ihsan", "description": "Reflections on spiritual purification and the stations of the seekers.", "url": "https://yaqeeninstitute.org", "platform": "Scholarly Archive" }
        ]
    )
];

async function seed() {
    console.log('--- SEEDING COMPREHENSIVE NARRATIVE LESSONS (1.3 & 1.5) ---');
    const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
    if (!course) return console.log('Course not found');

    for (const item of NEW_LESSONS) {
        process.stdout.write(`Syncing Narrative: "${item.title}"... `);
        // Note: Using title to match. Ensure titles match exactly in DB.
        const { error } = await supabase.from('course_lessons').update({ content_blocks: item.blocks }).eq('course_id', course.id).eq('title', item.title);
        if (error) console.log('ERR: ' + error.message);
        else console.log('DONE');
    }
}
seed();
