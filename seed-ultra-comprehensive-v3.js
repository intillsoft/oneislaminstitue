const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateQuizzes = (topic, type) => {
    const questions = {
        'pil1': [
            { "question": "Which dimension of Iman is considered the primary anchor of the soul?", "options": ["Verbal Testimony", "Heartfelt Conviction", "Outer Conformity"], "correctIndex": 1, "hint": "Focus on the 'Tasdiq' (Heart) element." },
            { "question": "True or False: Iman is static and does not fluctuate with actions.", "options": ["False", "True"], "correctIndex": 0, "hint": "Faith increases with obedience and decreases with sin." },
            { "question": "Where does the statement 'Iman increases and decreases' originate from?", "options": ["The Prophet (PBUH)", "Al-Hasan al-Basri", "Ibn Taymiyyah"], "correctIndex": 0, "hint": "It is a central tenet of the Sunnah." },
            { "question": "Which branch of Iman is considered the lowest?", "options": ["Modesty", "Removing harm from the road", "Feeding the poor"], "correctIndex": 1, "hint": "It is a physical act of consideration." },
            { "question": "What is the highest branch of Iman?", "options": ["Prayer", "Zakat", "Testimony of Monotheism"], "correctIndex": 2, "hint": "La ilaha illa Allah." }
        ],
        'pil2': [
            { "question": "Linguistically, which concept is closest to the root A-M-N?", "options": ["Wealth", "Security", "Honor"], "correctIndex": 1, "hint": "Think of 'Amn' (Safety)." },
            { "question": "Technical Iman requires which two distinct components?", "options": ["Power and Wealth", "Belief and Submission", "Knowledge and Writing"], "correctIndex": 1, "hint": "Certainty coupled with action." },
            { "question": "True or False: A-M-N also relates to 'Trust' (Amanah).", "options": ["True", "False"], "correctIndex": 0, "hint": "Faith and trust share the same semantic root." },
            { "question": "What is the linguistic opposite of 'Amn' (Security)?", "options": ["Hatred", "Fear (Khawf)", "Hunger"], "correctIndex": 1, "hint": "Faith removes what?" },
            { "question": "Does technical Iman exist without outward action?", "options": ["Yes", "No, it is incomplete", "Only in the grave"], "correctIndex": 1, "hint": "Action is the fruit of conviction." }
        ]
    };
    return questions[type] || questions['pil1'];
};

const generateLesson = (title, quote, author, objectives, contentBlocks, quizType) => ({
    title,
    blocks: [
        { "id": `c_${title.replace(/\s/g, '_')}`, "type": "callout", "content": quote, author, "order": 0 },
        { "id": `o_${title.replace(/\s/g, '_')}`, "type": "objectives", "items": objectives, "order": 1 },
        ...contentBlocks.map((b, i) => ({ ...b, "id": `b_${title.replace(/\s/g, '_')}_${i}`, "order": i + 2 })),
        ...generateQuizzes(title, quizType).map((q, i) => ({ ...q, "id": `qz_${title.replace(/\s/g, '_')}_${i}`, "type": "quiz", "order": 100 + i }))
    ]
});

const LESSONS = [
    generateLesson(
        'Definition of Iman in Qur’an and Sunnah',
        "Faith is a statement, a belief, and an action; it increases with obedience and decreases with disobedience.",
        "Al-Hasan al-Basri",
        ["Tripartite Definition", "Fluctuation of Faith", "Branches of Iman"],
        [
            { "type": "text", "content": `## The Living Definition of Faith\n\nTo understand the depths of the human soul, we must first define the light that guides it. Scholars define **Iman** as a tripartite reality: it is in the heart, on the tongue, and through the limbs. Without any one of these, the structure is incomplete.\n\n> [Q] "The believers are only those who, when Allah is mentioned, their hearts become fearful, and when His verses are recited to them, it increases them in faith..." (Surah Al-Anfal 8:2).\n\n### Foundations of Belief\nIn this introductory video, we explore how this definition was crystallized in the early generations of Muslim scholarship.` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { "type": "text", "content": `### The Fluctuation of the Heart\n\nHaving seen the definition, we must reflect on its behavior. Faith is not a static quantity; it is a dynamic state that breathes with your actions. The more one submits to the Divine, the brighter the light of Iman becomes.\n\n> [H] "Faith has over seventy branches. The highest is 'None has the right to be worshipped but Allah', and the lowest is removing a harmful object from the road." (Sahih Muslim).\n\nThis Hadith reminds us that even the smallest physical act is an extension of the soul's conviction. Below, we map these branches across your daily life.` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=vV77m6282YI" },
            { "type": "infographic", "layout": "grid", "items": [
                { "title": "Statement", "description": "Verbal testimony of the Truth.", "icon": "MessageSquare" },
                { "title": "Belief", "description": "Heartfelt conviction and certainty.", "icon": "Heart" },
                { "title": "Action", "description": "Physical manifestation of faith.", "icon": "Activity" }
            ]},
            { "type": "conclusion", "content": "Through this synthesis, we see that Iman is a holistic commitment. It is not just what you think, but what you say and, most importantly, what you do. Every righteous deed is a brick in the fortress of your faith." },
            { "type": "document", "title": "The Meaning of Iman", "description": "A foundational exploration of how Iman interacts with the modern soul.", "url": "https://yaqeeninstitute.org/read/paper/what-is-iman", "platform": "Yaqeen Institute" },
            { "type": "document", "title": "Branches of Faith Study", "description": "Detailed analysis of Imam al-Bayhaqi's collection.", "url": "https://sunnah.com/muslim:35", "platform": "Sunnah.com" }
        ],
        'pil1'
    ),
    generateLesson(
        'Linguistic vs Technical Meaning of Faith',
        "Linguistically, Iman is certainty. Technically, it is submission coupled with that certainty.",
        "Ibn Taymiyyah",
        ["The Root 'A-M-N'", "Security vs Faith", "Semantic Evolution"],
        [
            { "type": "text", "content": `## The Etymology of Certainty\n\nWords are the vessels of meaning. To truly grasp **Iman**, we must look at its linguistic ancestors. In the Arabic language, faith is inextricably linked with the concept of **safety** and **security**.\n\n> [Q] "He it is Who sent down as-Sakinah (calmness and tranquillity) into the hearts of the believers, that they may grow more in Faith along with their (present) Faith." (Surah Al-Fath 48:4).\n\n### From Language to Theology\nThis video explores how the feeling of safety (Amn) transforms into the spiritual state of Iman through the recognition of the Divine.` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU" },
            { "type": "text", "content": `### The Technical Boundaries\n\nWhile linguistically Iman implies trust, technically it carries a weight of responsibility. It is the 'Tasdiq' (confirmation) that demands submission. Without this submission, the claim to safety is hollow.\n\n> [H] "The Muslim is the one from whose tongue and hand the people are safe, and the believer is the one from whom the people's lives and wealth are safe." (An-Nasa'i).\n\nObserve how the Prophet (PBUH) links the internal state of belief with the external safety of the community.` },
            { "type": "video", "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q" },
            { "type": "infographic", "layout": "process", "items": [
                { "title": "Security (Amn)", "description": "The root of all trust.", "icon": "Shield" },
                { "title": "Confirmation (Tasdiq)", "description": "Accepting the truth internally.", "icon": "CheckCircle" },
                { "type": "Technical Iman", "description": "The final state of spiritual safety.", "icon": "Star" }
            ]},
            { "type": "conclusion", "content": "The linguistic root reveals a profound secret: there is no true security without faith. By understanding the language of the Qur'an, we begin to see faith not as a set of rules, but as an attainment of ultimate safety." },
            { "type": "document", "title": "Linguistic Roots of Faith", "description": "Understanding the semantic shifts in early Islamic history.", "url": "https://yaqeeninstitute.org/read/paper/the-linguistic-roots-of-faith", "platform": "Heritage Research" },
            { "type": "document", "title": "Security and Faith", "description": "How the concept of Amn shapes the believer.", "url": "https://yaqeeninstitute.org/read/paper/iman-and-the-soul", "platform": "Yaqeen Institute" }
        ],
        'pil2'
    )
];

async function seed() {
    console.log('--- SEEDING ULTRA-DETAILED NARRATIVE FLOW (5 QUIZZES, [Q]/[H] CARDS, HORIZONTAL DOCS) ---');
    const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
    if (!course) return console.log('Course not found');

    for (const item of LESSONS) {
        process.stdout.write(`Updating Lesson: "${item.title}"... `);
        const { error } = await supabase.from('course_lessons').update({ content_blocks: item.blocks }).eq('course_id', course.id).eq('title', item.title);
        if (error) console.log('ERR: ' + error.message);
        else console.log('DONE');
    }
}
seed();
