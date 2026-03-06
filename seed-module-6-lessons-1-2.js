const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Proofs for the Day of Judgment",
        blocks: [
            { type: "callout", content: "If there were no Day of Judgment, then the entire universe would be a cruel joke where justice is never served. Reason itself demands an after-life for the rectification of this life.", author: "Traditional Philosophic Argument" },
            { type: "objectives", items: ["Identify the rational necessity for Life after Death", "Analyze Quranic analogies for resurrection (e.g., the revival of dead land)", "Differentiate between 'Absolute Justice' and 'Wordly Justice'", "Understand the concept of 'Al-Yaum al-Akhir' (The Last Day)"] },
            { type: "text", content: "## A Justice Beyond the Grave\n\nMany people struggle with the concept of being brought back to life after their bones have withered. However, the Quran presents a very simple logic: The One who created you from nothing the first time is more than capable of bringing you back the second time." },
            { type: "quran", translation: "Does man think that We will not assemble his bones? Yes. [We are] Able [even] to proportion his fingertips. (Surah Al-Qiyamah 75:3-4)", arabic: "أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُ ۞ بَلَىٰ قَادِرِينَ عَلَىٰ أَن نُّسَوِّيَ بَنَانَهُ" },
            { type: "concept", translation: "Al-Akhirah (The Hereafter): The belief in a second life where every soul is held accountable for its deeds and justice is perfectly served.", arabic: "اليوم الآخر" },
            { type: "infographic", layout: "grid", items: [
                { title: "First Creation", description: "If He made you once, He can make you again.", icon: "Zap" },
                { title: "Revival of Land", description: "Watch how He brings life to dead soil after rain.", icon: "CloudRain" },
                { title: "Universal Justice", description: "The oppressor and oppressed cannot have the same final fate.", icon: "Scale" },
                { title: "Divine Promise", description: "The promise of the Creator who never lies.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Analogy of Dead Earth\n\nFrequently, the Quran points our attention to the physical world. Just as a dry, dead desert blooms with life when water touches it, so too will the 'dead' human be resurrected when the command is given. Nature is a constant reminder of our own return." },
            { type: "quran", translation: "And you see the earth barren, but when We send down upon it rain, it quivers and swells and grows [something] of every beautiful kind. (Surah Al-Hajj 22:5)", arabic: "وَتَرَى الْأَرْضَ هَامِدَةً فَإِذَا أَنزَلْنَا عَلَيْهَا الْمَاءَ اهْتَزَّتْ وَرَبَتْ" },
            { type: "scholar", translation: "Belief in the Last Day is what transforms a person's behavior from being animalistic and selfish to being responsible and ethical. (Classical scholars)", arabic: "الإيمان بالمعاد زاجر عن المعاصي" },
            { type: "hadith", translation: "None of you will move on the Day of Resurrection until he is asked about four things: his life and how he spent it, his knowledge and what he did with it... (Sunan at-Tirmidhi 2417, Authentic)", arabic: "لاَ تَزُولُ قَدَمَا عَبْدٍ يَوْمَ الْقِيَامَةِ حَتَّى يُسْأَلَ عَنْ أَرْبَعٍ" },
            { type: "infographic", layout: "process", items: [
                { title: "Death", description: "The transition from our world.", icon: "Moon" },
                { title: "Barzakh", description: "The waiting period in the grave.", icon: "Clock" },
                { title: "Ba'th", description: "The Great Resurrection.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Fingertip Miracle\n\nIn Surah Al-Qiyamah, Allah explicitly mentions the 'fingertips' (banan). Modern science tells us that every human has a unique fingerprint. To highlight that He can recreate even the most microscopic, unique details of our bodies is a profound sign of His power." },
            { type: "reflection", translation: "If I was told a judge was recording every single second of my workday for a future review, how much better would I work? The 'Last Day' is that review.", arabic: "فمن يعمل مثقال ذرة خيرا يره" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Belief in the Afterlife is the cornerstone of Islamic morality. It provides a frame of reference that makes the hardships of this life bearable and its pleasures temporary." },
            { type: "quiz", question: "What is the primary argument the Quran uses against those who deny resurrection?", options: ["It is impossible", "The One who created you once can create you again", "Logic is useless", "You will be turned into stone"], correctIndex: 1, hint: "Review Module 6, Lesson 1 text." },
            { type: "quiz", question: "Which unique part of the human body did Allah mention He is able to 'proportion' or reconstruct (75:4)?", options: ["The heart", "The eyes", "The fingertips", "The brain"], correctIndex: 2, hint: "Bananahu." },
            { type: "quiz", question: "In the Hadith of Tirmidhi 2417, how many things will a servant be asked about before their feet can move?", options: ["One", "Two", "Four", "Seven"], correctIndex: 2, hint: "Life, Knowledge, Wealth, Body." },
            { type: "quiz", question: "What natural phenomenon does the Quran use as an analogy for Resurrection?", options: ["The sunset", "The rain reviving dead earth", "The wind", "The mountains"], correctIndex: 1, hint: "A quiver and a swell... (Surah Al-Hajj)." },
            { type: "quiz", question: "Does reason alone (Aql) suggest that an after-life is necessary for justice?", options: ["No, it says life is random", "Yes, because worldly justice is often incomplete", "Reason is against faith", "Only if you are a philosopher"], correctIndex: 1, hint: "Think of an oppressor who dies without punishment." },
            { type: "document", title: "Proofs for Life after Death", description: "A philosophical and Quranic analysis of the necessity of the Hereafter.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Return to Allah", description: "Analyzing the psychological shift that occurs when one truly believes in the Last Day.", url: "https://kalamullah.com/", platform: "Spirituality Library" }
        ]
    },
    {
        title: "The Minor Signs",
        blocks: [
            { type: "callout", content: "I was sent and the Hour are like these two - and he joined his index and middle fingers.", author: "Prophetic Hadith (Sahih al-Bukhari 6504 / Muslim 2951)" },
            { type: "objectives", items: ["Categorize the signs of the hour: Past, Current, and Future", "Identify significant minor signs like the spread of knowledge versus ignorance", "Learn about the social and moral changes predicted 1400 years ago", "Understand why these signs are described as a 'Mercy' to the believer"] },
            { type: "text", content: "## A Looming Reality\n\nThe Prophet (PBUH) described himself as the 'Prophet of the Hour'. The end of time is not a sudden accident, but a gradual process. The 'Minor Signs' (Ashrat al-Sa'ah al-Sughra) are behavioral and physical indicators that the final chapter of humanity is unfolding." },
            { type: "concept", translation: "Ashrat al-Sa'ah (Signs of the Hour): The indicators provided by revelation that the Day of Judgment is approaching.", arabic: "أشراط الساعة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Past Signs", description: "The sending of the final Prophet.", icon: "Check" },
                { title: "Knowledge", description: "Knowledge will be lifted and ignorance will prevail.", icon: "Book" },
                { title: "Architecture", description: "Barefoot shepherds competing in tall buildings.", icon: "Home" },
                { title: "Morality", description: "Time will move faster and trust will be lost.", icon: "Clock" }
            ]},
            { type: "quran", translation: "Do they wait then for anything except that the Hour should come upon them suddenly? But already have come its signs. (Surah Muhammad 47:18)", arabic: "فَقَدْ جَاءَ أَشْرَاطُهَا" },
            { type: "hadith", translation: "From the signs of the Hour are... that you will see barefooted, naked, poor shepherds competing with one another in constructing tall buildings. (Sahih Muslim 8)", arabic: "أَنْ تَرَى الْحُفَاةَ الْعُرَاةَ الْعَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي الْبُنْيَانِ" },
            { type: "scholar", translation: "The purpose of these signs is to alert the negligent heart and move it back to repentance before it is too late. (Imam Al-Qurtubi)", arabic: "الإنذار قبل الآذان" },
            { type: "text", content: "### The Social Transformation\n\nMany of the minor signs deal with the breakdown of family and social trust. Sincerity will decrease, honesty will be considered a 'miracle', and people will sell their religion for a small portion of the world. These signs serve as a roadmap for the believer to navigate times of 'Fitna' (Trials)." },
            { type: "hadith", translation: "Time will pass rapidly, good deeds will decrease, and miserliness will be thrown (into the hearts of people). (Sahih al-Bukhari 6037)", arabic: "يَتَقَارَبُ الزَّمَانُ وَيَنْقُصُ الْعَمَلُ" },
            { type: "infographic", layout: "process", items: [
                { title: "Awareness", description: "Seeing the signs in the world.", icon: "Eye" },
                { title: "Prioritize", description: "Focusing on what remains.", icon: "Zap" },
                { title: "Preparedness", description: "Living every day as if the Hour is here.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Paradox of Progress\n\nWhile the world might seem to 'progress' in technology (tall buildings, fast travel), the Prophet warned of a 'regression' in spirit and character. This paradox is a hallmark of the end times: rich bodies and starving souls." },
            { type: "reflection", translation: "If I see the signs of the Hour appearing around me, why is my 'to-do list' for the next 20 years so long, and my list for the Hereafter so short?", arabic: "قرب للناس حسابهم" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "The minor signs are not meant to cause panic, but to cause purpose. They are a divine wake-up call to the soul." },
            { type: "quiz", question: "According to the Hadith in Sahih Muslim 8, which group of people will compete in constructing tall buildings?", options: ["Kings and Emperors", "Professional Architects", "Barefoot, poor shepherds", "Angels"], correctIndex: 2, hint: "Al-hufah al-urah..." },
            { type: "quiz", question: "What is the status of 'Time' according to the signs of the Hour?", options: ["It will move slower", "It will stay the same", "It will pass rapidly (Yataqarabu al-Zaman)", "It will stop"], correctIndex: 2, hint: "A year will feel like a month." },
            { type: "quiz", question: "Which sign is considered to have ALREADY happened (the first of the signs)?", options: ["The Dajjal", "The sending of Prophet Muhammad (PBUH)", "The Sun rising from the West", "The Beast"], correctIndex: 1, hint: "I was sent and the Hour are like these two." },
            { type: "quiz", question: "What happens to 'Sacred Knowledge' as the Hour approaches?", options: ["It will be available on every phone", "It will be taken away (lifted) with the death of scholars", "Everyone will become a scholar", "It will never change"], correctIndex: 1, hint: "Yurbafu al-Ilm wa yathbutu al-Jahl." },
            { type: "quiz", question: "What is the purpose of the signs of the Hour according to scholars?", options: ["To make us scared and hide", "To wake up the heart and encourage repentance", "To predict the exact date of world end", "They have no purpose"], correctIndex: 1, hint: "Spiritual alarms." },
            { type: "document", title: "Minor Signs: A Detailed List", description: "Exhaustive compilation of over 50 minor signs found in authentic hadith.", url: "https://sunnah.com/", platform: "Hadith Studies" },
            { type: "document", title: "Social Evolution and the Signs", description: "Analyzing 21st-century social trends through the lens of prophetic predictions.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 6 (AKHIRAH) TO 20+ BLOCKS ---');
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
