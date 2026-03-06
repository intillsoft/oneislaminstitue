const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Why Prophets Are Necessary",
        blocks: [
            { type: "callout", content: "Mankind was [of] one religion [before their deviation]; then Allah sent the prophets as bringers of good tidings and warners.", author: "Surah Al-Baqarah 2:213" },
            { type: "objectives", items: ["Understand the logical necessity of divine guidance", "Differentiate between Nabi (Prophet) and Rasul (Messenger)", "Identify the core message of all Prophets (Tawheed)", "Analyze the historical flow of Prophethood"] },
            { type: "text", content: "## The Need for Guidance\n\nIf a Creator perfectly designs a universe and places human beings in it, it is illogical for Him to leave them without instructions on how to live. Prophethood is the bridge of communication between the unseen Divine and the visible world." },
            { type: "concept", translation: "Nubuwwah (Prophethood): The state of receiving divine revelation (Wahy) from Allah to guide humanity to the truth.", arabic: "النبوة" },
            { type: "quran", translation: "And We certainly sent into every nation a messenger, [saying], 'Worship Allah and avoid Taghut.' (Surah An-Nahl 16:36)", arabic: "وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَّسُولًا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Nabi (Prophet)", description: "Receives revelation, follows the law of a previous Messenger.", icon: "BookOpen" },
                { title: "Rasul (Messenger)", description: "Receives a new Book or new set of laws.", icon: "Book" },
                { title: "The Core Message", description: "All Prophets taught Tawheed (Oneness of God).", icon: "Sun" },
                { title: "The Warner", description: "Warning against injustice and idolatry.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Unity of the Message\n\nFrom Adam to Nuh, Ibrahim, Musa, Isa, and Muhammad (PBUH), the fundamental message never changed: Worship the Creator, not the creation. The specific laws (Shariah) varied based on the time and people, but the theology (Aqidah) remained identical." },
            { type: "hadith", translation: "The Prophets are paternal brothers; their mothers are different, but their religion is one. (Sahih al-Bukhari 3443)", arabic: "الأَنْبِيَاءُ إِخْوَةٌ لِعَلاَّتٍ... وَدِينُهُمْ وَاحِدٌ" },
            { type: "scholar", translation: "Prophethood is not a rank achieved through extreme effort or meditation; it is a direct, unearned selection by Allah based on His infinite wisdom. (Standard Ash'ari/Maturidi Creed)", arabic: "النبوة اصطفاء" },
            { type: "infographic", layout: "process", items: [
                { title: "Selection", description: "Allah chooses a person of pure character.", icon: "User" },
                { title: "Revelation", description: "Jibreel delivers the Wahy.", icon: "Zap" },
                { title: "Action", description: "The Prophet establishes the community on truth.", icon: "Globe" }
            ]},
            { type: "text", content: "### Without Prophets\n\nWithout Prophets, human intellect might deduce the existence of a Creator, but it would never know His Names, His specific commands, or the details of the Afterlife. The intellect needs the compass of Revelation." },
            { type: "reflection", translation: "If I was given a complex machine without a user manual, I would ruin it. Am I trying to run my life without reading the manual brought by the Prophets?", arabic: "وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Prophethood is the ultimate manifestation of Allah's mercy. He did not create us and abandon us; He sent the best of humanity to lead us back Home." },
            { type: "quiz", question: "What is the primary difference between a Nabi (Prophet) and a Rasul (Messenger)?", options: ["A Rasul receives a new law/book, while a Nabi follows the law of a previous Rasul", "A Nabi is an angel, a Rasul is a human", "There is no difference", "A Nabi is a king"], correctIndex: 0, hint: "Review the definition grid." },
            { type: "quiz", question: "What was the core message of ALL the Prophets according to Surah An-Nahl 16:36?", options: ["Build large cities", "Worship Allah and avoid Taghut (false deities)", "Conquer neighboring lands", "Study science"], correctIndex: 1, hint: "Tawheed is universal." },
            { type: "quiz", question: "According to the Hadith, what did the Prophet (PBUH) compare the Prophets to?", options: ["Birds flying together", "Paternal brothers (same religion, different laws/mothers)", "Stars in the sky", "Trees in a forest"], correctIndex: 1, hint: "Sahih Bukhari 3443." },
            { type: "quiz", question: "Can a person 'achieve' prophethood by praying a lot or meditating?", options: ["Yes, if they are sincere", "No, it is purely a divine selection (Istifa) by Allah", "Only in ancient times", "Yes, if they find a secret book"], correctIndex: 1, hint: "You cannot earn it." },
            { type: "quiz", question: "Without Prophets, what is human intellect incapable of knowing?", options: ["That objects fall down (gravity)", "The exact details of the Afterlife and specific forms of worship", "How to build a house", "Basic moral instincts"], correctIndex: 1, hint: "The intellect knows a Creator exists, but not His specific commands." },
            { type: "document", title: "The Need for Prophethood", description: "Al-Ghazali's argument for why reason alone is insufficient for salvation.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Stories of the Prophets", description: "Ibn Kathir's classic compilation (Qasas al-Anbiya).", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Characteristics of Prophets",
        blocks: [
            { type: "callout", content: "Indeed, in the Messenger of Allah you have an excellent example for whoever has hope in Allah and the Last Day and remembers Allah often.", author: "Surah Al-Ahzab 33:21" },
            { type: "objectives", items: ["Understand the concept of 'Ismah' (Infallibility/Protection from sin)", "Identify the four core traits of a Prophet: Truthfulness, Trustworthiness, Delivery, Intelligence", "Analyze the human nature of Prophets (eating, sleeping, feeling sadness)", "Reflect on Prophets as role models, not demigods"] },
            { type: "text", content: "## The Best of Humanity\n\nProphets are human beings, but they are the absolute pinnacle of human character. They possess specific traits that make them capable of carrying the heaviest burden in existence: the Speech of the Creator." },
            { type: "concept", translation: "Ismah: Infallibility or protection. Prophets are protected by Allah from committing major sins, and from errors in delivering the message.", arabic: "العصمة" },
            { type: "quran", translation: "Say, 'I am only a man like you, to whom has been revealed that your god is one God.' (Surah Al-Kahf 18:110)", arabic: "قُلْ إِنَّمَا أَنَا بَشَرٌ مِّثْلُكُمْ يُوحَىٰ إِلَيَّ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Sidq (Truthfulness)", description: "They never lie, especially concerning God.", icon: "Check" },
                { title: "Amanah (Trustworthiness)", description: "They protect the revelation without alteration.", icon: "Shield" },
                { title: "Tabligh (Delivery)", description: "They deliver the message completely, hiding nothing.", icon: "Mic" },
                { title: "Fatanah (Intelligence)", description: "They possess sharp intellects to debate and lead.", icon: "Brain" }
            ]},
            { type: "text", content: "### Fully Human\n\nUnlike other religions that deified their prophets, Islam insists on their humanity. They fall ill, they forget worldly things, they experience deep sorrow, and they die. This makes them perfect role models; an angel would not be a relatable example for a struggling human." },
            { type: "hadith", translation: "I am only a human being. I can be angry just as a human is angry. (Sahih Muslim 2603)", arabic: "إِنَّمَا أَنَا بَشَرٌ أَرْضَى كَمَا يَرْضَى الْبَشَرُ" },
            { type: "scholar", translation: "If the Prophet were not human, his patience in the face of suffering would not be a proof for us to follow. His humanity is the canvas of his perfection. (Contemporary Seerah Analysis)", arabic: "بشريته كمال" },
            { type: "infographic", layout: "process", items: [
                { title: "The Trial", description: "Prophets face the hardest tests (Loss, Poverty, Rejection).", icon: "Activity" },
                { title: "The Patience", description: "They maintain perfect trust in Allah.", icon: "Anchor" },
                { title: "The Example", description: "They become an eternal template of behavior.", icon: "Star" }
            ]},
            { type: "text", content: "### The Concept of Ismah (Protection)\n\nProphets are protected (Ma'sum) from major sins (like idolatry, murder, adultery) before and after prophethood. They are also absolutely protected from making any mistake when transmitting the Quran or the law. However, they can make minor misjudgments in worldly affairs (like military strategy), which Allah swiftly corrects." },
            { type: "reflection", translation: "When faced with a difficulty, do I remember the Year of Sorrow of the Prophet (PBUH) to find comfort in the fact that suffering is not a sign of Allah's anger?", arabic: "أشد الناس بلاء الأنبياء" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "To love the Prophets is to follow their example. They were not sent to be worshipped; they were sent to teach us how to worship." },
            { type: "quiz", question: "What does 'Ismah' mean in the context of Prophets?", options: ["Ability to fly", "Infallibility/Protection from major sins and errors in revelation", "Being wealthy", "Never feeling pain"], correctIndex: 1, hint: "They are protected by Allah." },
            { type: "quiz", question: "Which of the following is NOT one of the four necessary traits of a Prophet?", options: ["Sidq (Truthfulness)", "Amanah (Trustworthiness)", "Ghina (Immense Wealth)", "Tabligh (Delivery)"], correctIndex: 2, hint: "Many prophets were poor." },
            { type: "quiz", question: "Why is it important that Prophets were highly intelligent (Fatanah)?", options: ["To make money", "To memorize poetry", "To debate polytheists and clearly articulate complex divine truths", "To build pyramids"], correctIndex: 2, hint: "They needed to argue against deeply rooted falsehoods." },
            { type: "quiz", question: "Does Islam teach that Prophet Muhammad (PBUH) or Prophet Isa (Jesus) contained a 'divine' spark?", options: ["Yes", "No, they were 100% human (Bashar)", "Only Isa", "Only Muhammad"], correctIndex: 1, hint: "Qul innama ana basharun mithlukum." },
            { type: "quiz", question: "Can a Prophet forget a verse of the Quran and leave it out permanently?", options: ["Yes, occasionally", "No, they are protected (Ma'sum) in the delivery of the message", "Only if it's a short verse", "Yes, if they are old"], correctIndex: 1, hint: "Amanah and Tabligh prevent this." },
            { type: "document", title: "The Infallibility of the Prophets", description: "A theological defense of Ismah by classical scholars.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Al-Shifa bi Ta'rif Huquq al-Mustafa", description: "Qadi Iyad's masterpiece on the rights and characteristics of the Prophet.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 9 (LESSON 1-2) ---');
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
