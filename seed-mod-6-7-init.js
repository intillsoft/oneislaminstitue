const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Module Assessment", // For Module 6 (Akhirah)
        blocks: [
            { type: "callout", content: "The world is a bridge; cross it, but do not build upon it.", author: "Isa ibn Maryam (as quoted in Islamic spiritual literature)" },
            { type: "objectives", items: ["Demonstrate understanding of the proofs for Resurrection", "Differentiate between Minor and Major signs of the Hour", "Describe the process of the Grave and Barzakh", "Synthesize the ultimate fates of Jannah and Jahannam"] },
            { type: "text", content: "## Preparation for the Infinite\n\nYou have traversed the journey of the soul from death to eternity. This assessment verifies your understanding of the stages of the Hereafter (Al-Akhirah), the signs that lead to it, and the absolute justice that governs it." },
            { type: "infographic", layout: "grid", items: [
                { title: "The Signs", description: "Minor and Major indicators.", icon: "Activity" },
                { title: "The Transition", description: "Grave and Barzakh.", icon: "Clock" },
                { title: "The Judgment", description: "Resurrection, Records, and Scale.", icon: "Scale" },
                { title: "The Destination", description: "Jannah or Jahannam.", icon: "Star" }
            ]},
            { type: "quran", translation: "Every soul will taste death, and you will only be given your [full] compensation on the Day of Resurrection. (Surah Ali 'Imran 3:185)", arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ" },
            { type: "text", content: "### Final Knowledge Verification\n\nPlease answer the following questions to verify your completion of Module 6." },
            { type: "quiz", question: "What is the primary rational argument for the necessity of an after-life?", options: ["It's just a tradition", "Worldly justice is incomplete, so absolute justice requires a second life", "Because humans are scared of death", "There is no rational argument"], correctIndex: 1, hint: "Justice is the key." },
            { type: "quiz", question: "Which major sign involves the Sun rising from a different direction?", options: ["Dajjal", "The Smoke", "Sun rising from the West", "Gog and Magog"], correctIndex: 2, hint: "A cosmological reversal." },
            { type: "quiz", question: "What are the three questions of the grave?", options: ["Name, Age, Job", "Who is your Lord? What is your Deen? Who is this Prophet?", "How much money? Where is your home? Who is your family?", "Only one question: Did you pray?"], correctIndex: 1, hint: "Review Module 6, Lesson 4." },
            { type: "quiz", question: "In the 'Great Standing' (Hashr), how many years will people stand according to some traditions?", options: ["100 years", "50,000 years", "One day", "10 years"], correctIndex: 1, hint: "A terrifyingly long day." },
            { type: "quiz", question: "What is the 'Greatest Blessing' of Paradise?", options: ["Eternal youth", "Golden plates", "The Vision of Allah's Countenance", "Flying"], correctIndex: 2, hint: "An-Nazaru ila wajhillah." },
            { type: "quiz", question: "The Dajjal is described as being 'one-eyed'. What did the Prophet (PBUH) say to contrast him with Allah?", options: ["Allah has three eyes", "Allah is not one-eyed", "Allah has no eyes", "Allah is hidden"], correctIndex: 1, hint: "Inna Rabbakum laysa bi-a'war." },
            { type: "quiz", question: "Which Surah should be memorized (the first ten verses) for protection against the Dajjal?", options: ["Surah Al-Baqarah", "Surah Al-Kahf", "Surah Yasin", "Surah Al-Ikhlas"], correctIndex: 1, hint: "The Cave." },
            { type: "quiz", question: "Does the Quran mention 'fingertips' as a sign of Allah's power to resurrect perfectly?", options: ["Yes", "No", "Only the heart", "Only the skull"], correctIndex: 0, hint: "Surah Al-Qiyamah 75:4." },
            { type: "conclusion", content: "Congratulations. You have completed the study of the Hereafter. You are now prepared to address the challenges of the modern age: Module 7 - Modern Challenges to Faith." },
            { type: "document", title: "Module 6 Synthesis Guide", description: "Summary of eschatological events and definitions.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    },
    {
        title: "Atheism & Materialism",
        blocks: [
            { type: "callout", content: "To claim the universe exists without a Creator is like claiming a 500-page book of poetry wrote itself because the ink and paper happened to fall in the right order.", author: "Modern Rationalist Defense" },
            { type: "objectives", items: ["Identify the philosophical roots of modern Atheism and Materialism", "Analyze the 'Argument from Fine-Tuning' of the universe", "Evaluate the incoherence of 'Infinite Regress'", "Understand the Islamic response to the claim that 'Matter is all there is'"] },
            { type: "text", content: "## The Myth of Self-Creation\n\nIn the 21st century, the primary challenge to faith is not other religions, but the denial of the Divine altogether. Atheism and Materialism claim that the universe is a closed system of matter and energy that 'just happened'. Islam offers a rigorous intellectual response to these claims." },
            { type: "concept", translation: "Naturalism: The belief that only natural laws and forces (as opposed to supernatural or spiritual ones) operate in the world.", arabic: "المادية" },
            { type: "quran", translation: "Or were they created by nothing, or were they the creators [of themselves]? (Surah At-Tur 52:35)", arabic: "أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Fine-Tuning", description: "The laws of physics are so precise that a 0.0001% change would make life impossible.", icon: "Settings" },
                { title: "First Cause", description: "Everything that begins to exist must have a cause.", icon: "Key" },
                { title: "Consciousness", description: "Matter cannot explain the subjective experience of a 'soul'.", icon: "Brain" },
                { title: "Objective Morality", description: "If there is no God, 'right' and 'wrong' are just evolutionary opinions.", icon: "Gavel" }
            ]},
            { type: "text", content: "### The Dilemma of At-Tur\n\nAllah presents a powerful logical trilemma in Surah At-Tur. Regarding the existence of humans (and the universe), there are only three possibilities: 1. They were created by nothing (Impossible). 2. They created themselves (Impossible). 3. They were created by a Creator (Necessity). Logic leaves only the third option." },
            { type: "scholar", translation: "Science can tell you 'how' the stove works, but it can never tell you 'why' someone put the kettle on to make tea. God is the Answer to the 'Why'. (Modern Apologetics)", arabic: "العلم والواجب الوجود" },
            { type: "text", content: "### The Illusion of Materialism\n\nMaterialism falls short when explaining the human soul. If we are just 'chemical accidents', why do we feel love, seek justice, and wonder about eternity? Molecules don't wonder about molecules. The spirit (Ruh) is the evidence that we are more than meat and bone." },
            { type: "quran", translation: "And they ask you, [O Muhammad], about the soul. Say, 'The soul is of the affair of my Lord. And mankind have not been given of knowledge except a little.' (Surah Al-Isra 17:85)", arabic: "وَيَسْأَلُونَكَ عَنِ الرُّوحِ ۖ قُلِ الرُّوحُ مِنْ أَمْرِ رَبِّي" },
            { type: "infographic", layout: "process", items: [
                { title: "Observation", description: "Seeing the complexity of the cell.", icon: "Eye" },
                { title: "Inference", description: "Recognizing that design requires a Designer.", icon: "Zap" },
                { title: "Certainty", description: "Realizing that 'Nothing' cannot produce 'Something'.", icon: "Check" }
            ]},
            { type: "reflection", translation: "If my brain is just a collection of random chemical reactions governed by evolution, why should I trust my own thoughts about truth?", arabic: "هل العقل مادي محض؟" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Atheism is not the result of science, but a philosophical choice to ignore the Caller. The universe is a signpost pointing to its Originator." },
            { type: "quiz", question: "What is the logical trilemma presented in Surah At-Tur 52:35?", options: ["Knowledge, Action, Reward", "Created by nothing, Self-created, or Created by a Creator", "Heaven, Hell, or Earth", "Yesterday, Today, or Tomorrow"], correctIndex: 1, hint: "Am khuliqu min ghayri shay'..." },
            { type: "quiz", question: "What does 'Fine-Tuning' of the universe refer to?", options: ["The universe is very old", "The laws of physics are extremely precise to allow for life", "The universe is making music", "Humans are perfect"], correctIndex: 1, hint: "A settings/precision argument." },
            { type: "quiz", question: "Why is 'Infinite Regress' (the idea of an infinite chain of causes) problematic?", options: ["It's too long to count", "It means there is no 'First Cause', so nothing could have ever started", "It's a mathematical error", "The Quran doesn't mention it"], correctIndex: 1, hint: "If a line of dominos is infinite, the first one never fell." },
            { type: "quiz", question: "According to Surah Al-Isra 17:85, what is the status of our knowledge regarding the 'soul' (Ruh)?", options: ["We know everything about it", "It is of the affair of our Lord, and we have little knowledge of it", "It is made of light", "It doesn't exist"], correctIndex: 1, hint: "Qul al-roohu min amri Rabbi." },
            { type: "quiz", question: "If there is no God, what happens to the concept of 'Objective Morality' (Right vs Wrong)?", options: ["Nothing, it stays the same", "It becomes a subjective opinion or evolutionary tool of survival", "It becomes stronger", "It is discovered by science"], correctIndex: 1, hint: "Without a Lawgiver, there is no absolute Law." },
            { type: "document", title: "Responding to Atheism", description: "A contemporary manual for young Muslims facing intellectual challenges.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Fine-Tuning of the Universe", description: "Academic paper on the 26 physical constants that suggest design.", url: "https://yaqeeninstitute.org/", platform: "Science & Faith Series" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MOD 6 ASSESSMENT & MOD 7 LESSON 1 ---');
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
