const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Understanding Allah's Names",
        blocks: [
            { type: "callout", content: "Allah's Names are the keys to His Mercy. To know His Names is to know Him; and to know Him is to love Him.", author: "Ibn Qayyim (Madarij as-Salikeen)" },
            { type: "objectives", items: ["Understand the significance of 'Al-Asma al-Husna' (The Most Beautiful Names)", "Identify the theological rules for affirming Allah's Names", "Explore the relationship between Names and Attributes", "Learn the concept of 'Ithbat' (Affirmation) without comparison"] },
            { type: "text", content: "## The Names of Perfection\n\nAllah has introduced Himself to us through His Names. These are not merely labels, but descriptions of His infinite perfection. Every Name is a 'Husna'—meaning it reached the absolute pinnacle of beauty and goodness." },
            { type: "quran", translation: "And to Allah belong the best names, so invoke Him by them. (Surah Al-A'raf 7:180)", arabic: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا" },
            { type: "concept", translation: "Al-Asma al-Husna: The most beautiful names of Allah, which signify His perfection, majesty, and beauty.", arabic: "الأسماء الحسنى" },
            { type: "infographic", layout: "grid", items: [
                { title: "Tawqifiyyah", description: "Names are limited to what is in the Quran and Sunnah.", icon: "Lock" },
                { title: "Non-comparative", description: "No Name implies a likeness to creation.", icon: "Shield" },
                { title: "Infinite", description: "The 99 names are just the beginning of His limitless perfection.", icon: "Zap" },
                { title: "Functional", description: "Used for Du'a and personal transformation.", icon: "Heart" }
            ]},
            { type: "text", content: "### The 99 Names Limitation?\n\nA common misunderstanding is that Allah *only* has 99 names. Scholars explain that the Hadith mentions 99 names as a specific subset that promises Paradise for those who comprehend them, but Allah's actual names are known only to Him in their entirety." },
            { type: "hadith", translation: "O Allah, I ask You by every name belonging to You... or which You have kept to Yourself in the knowledge of the Unseen with You. (Musnad Ahmad 3712, Authentic)", arabic: "أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ" },
            { type: "scholar", translation: "Every Name of Allah includes an Attribute. For example, 'Al-Alim' (The All-Knowing) includes the attribute of 'Ilm (Knowledge). (Ibn Taymiyyah)", arabic: "كل اسم يتضمن صفة" },
            { type: "infographic", layout: "process", items: [
                { title: "Ithbat (Affirmation)", description: "Affirming what Allah affirmed for Himself.", icon: "Check" },
                { title: "Tanzih (Exclusion)", description: "Excluding any deficiencies or likeness.", icon: "Shield" },
                { title: "I'badah (Worship)", description: "Worshipping Him through these names.", icon: "Sun" }
            ]},
            { type: "text", content: "### The Three Levels of 'Ihsah' (Counting)\n\nTo 'count' or 'comprehend' the names (as mentioned in the Hadith of 99 names) involves three levels: 1. Memorizing the words, 2. Understanding the meanings, and 3. Worshipping Allah through those meanings." },
            { type: "reflection", translation: "If I call Him 'Ar-Razzaq' (The Provider), why is my heart so anxious about my financial future?", arabic: "هل أثرت أسماؤه في يقيني؟" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Studying Allah's names is the most noble of all sciences because the nobility of a science is determined by the nobility of its subject. And there is nothing more noble than the Creator." },
            { type: "quiz", question: "Which Surah and verse commands us to 'invoke Him by them' regarding the best names?", options: ["Surah Al-Baqarah 2:255", "Surah At-Tawbah 9:128", "Surah Al-A'raf 7:180", "Surah Al-Ikhlas 112:1"], correctIndex: 2, hint: "Fal-ladhuuhu biha." },
            { type: "quiz", question: "Does the number 99 in the Hadith imply that Allah ONLY has 99 names and no more?", options: ["Yes, exactly 99", "No, it refers to a specific group with a specific reward", "The number is metaphorical", "Only 99 are mentioned in the Quran"], correctIndex: 1, hint: "Acknowledge the names hidden in the Unseen." },
            { type: "quiz", question: "What is the relationship between a Name (Ism) and an Attribute (Sifah) in Sunni theology?", options: ["They are identical", "Every Name implies an Attribute", "They are unrelated", "Only names matter"], correctIndex: 1, hint: "Names are derived from attributes." },
            { type: "quiz", question: "Which of these is NOT one of the three levels of 'Counting' (Ihsah) the names?", options: ["Memorization", "Understanding the meaning", "Acting upon the meaning", "Painting the names on a wall"], correctIndex: 3, hint: "The levels are intellectual and spiritual, not just decorative." },
            { type: "quiz", question: "In Musnad Ahmad 3712, what does the Prophet (PBUH) mention about some of Allah's names?", options: ["They are difficult to say", "Some are kept to Himself in the Unseen", "They are only for the Prophets", "They change over time"], correctIndex: 1, hint: "Ist’atharta bihi fi 'ilmi al-ghaybi 'indak." },
            { type: "document", title: "Introduction to Divine Names", description: "A comprehensive guide on the etiquette and rules of understanding Allah's names.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Beautiful Names of Allah", description: "Interactive site exploring the linguistic depth of each of the 99 names.", url: "https://99namesofallah.name/", platform: "External Resource" }
        ]
    },
    {
        title: "The Most Beautiful Names",
        blocks: [
            { type: "callout", content: "When you know His Majesty, you will find it easy to submit; and when you know His Beauty, you will find it impossible not to love.", author: "Classical Spiritual Maxim" },
            { type: "objectives", items: ["Explore the primary names of Majesty (Jalal) and Beauty (Jamal)", "Understand the name 'Allah' as the comprehensive name of divinity", "Learn the significance of 'Ar-Rahman' and 'Ar-Rahim'", "Identify how different names balance fear and hope in the heart"] },
            { type: "text", content: "## The Spectrum of Majesty and Beauty\n\nAllah's names are often categorized into those of Majesty (Jalal)—invoking awe and fear—and those of Beauty (Jamal)—invoking love and hope. A healthy believer flies toward Allah with two wings: the wing of fear and the wing of hope." },
            { type: "quran", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful. (Surah Al-Fatiha 1:1)", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
            { type: "concept", translation: "Al-Majd (Majesty): Names like Al-Jabbar (The Compeller), Al-Qahhar (The Subduer). Jamal (Beauty): Names like Al-Wadud (The Most Loving), Al-Ghaffar (The Forgiver).", arabic: "الجلال والجمال" },
            { type: "infographic", layout: "grid", items: [
                { title: "Ar-Rahman", description: "The Entirely Merciful (General mercy to all creation).", icon: "Sun" },
                { title: "Ar-Rahim", description: "The Especially Merciful (Specific mercy to the believers).", icon: "Heart" },
                { title: "Al-Aziz", description: "The Almighty (Possessing all power and honor).", icon: "Shield" },
                { title: "Al-Ghafoor", description: "The Often-Forgiving (He who covers and erases sins).", icon: "CloudSun" }
            ]},
            { type: "text", content: "### The Name 'Allah'\n\nScholars note that 'Allah' is the Greatest Name (Al-Ism al-A'zam) from which all other names flow. It is the only name that is never used for anyone else and is the comprehensive title of the One worthy of absolute worship." },
            { type: "hadith", translation: "O Allah, I ask You by every name belonging to You... (Musnad Ahmad 3712)", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ" },
            { type: "scholar", translation: "If the heart is filled with 'Allah', there is no room for the fear of creation. (Imam Ibn al-Qayyim)", arabic: "الله هو المعبود الجامع لصفات الكمال" },
            { type: "infographic", layout: "process", items: [
                { title: "Invoke", description: "Call Him by His specific names in need.", icon: "MessageCircle" },
                { title: "Reflect", description: "See His names in the creation around you.", icon: "Eye" },
                { title: "Emulate", description: "Acclimatize your character to the mercy and wisdom of His names.", icon: "Zap" }
            ]},
            { type: "text", content: "### Balancing the Attributes\n\nAllah is Al-Adl (The Just) but also Ar-Ra'uf (The Compassionate). We must not focus on His justice so much that we despair of His mercy, nor focus on His mercy so much that we become arrogant in our sins." },
            { type: "reflection", translation: "If He is 'As-Sami' (The All-Hearing), why do I only polish my words for people but speak carelessly when I am alone?", arabic: "هو السميع لكل نجوى" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "The Names of Allah are not just theology; they are the colors of your spiritual life. Paint your heart with the recognition of His Beauty and the awe of His Majesty." },
            { type: "quiz", question: "Which name of Allah is considered the 'comprehensive' name from which all others flow?", options: ["Ar-Rahman", "Al-Aziz", "Allah", "Al-Khaliq"], correctIndex: 2, hint: "It is His primary designation of divinity." },
            { type: "quiz", question: "What is the primary difference between 'Ar-Rahman' and 'Ar-Rahim'?", options: ["There is no difference", "Ar-Rahman is general mercy; Ar-Rahim is specific mercy for believers", "Ar-Rahman is for angels; Ar-Rahim is for humans", "One is only used on Fridays"], correctIndex: 1, hint: "One is 'Dhu Rahma' (Possessor of Mercy), one is 'Raahim' (Bower of Mercy)." },
            { type: "quiz", question: "Which names invoke 'Awe and Majesty' (Jalal)?", options: ["Al-Wadud (The Loving)", "Al-Lateef (The Subtle)", "Al-Jabbar (The Compeller)", "As-Salam (The Peace)"], correctIndex: 2, hint: "Names of strength and power." },
            { type: "quiz", question: "In the Hadith of Sahih Muslim, Allah has prescribed 'Ihsan' in all things. Which attribute does this most closely align with?", options: ["Al-Adl (The Just)", "Al-Muhsin (The Doer of Good/Excellence)", "Al-Malik (The King)", "Al-Qahhar"], correctIndex: 1, hint: "Derived from the same root." },
            { type: "quiz", question: "What should a believer do when they have sinned and feel despair?", options: ["Give up", "Invoke Al-Ghaffar and At-Tawwab", "Hide from everyone", "Ignore it"], correctIndex: 1, hint: "The Often-Forgiving and the Accepter of Repentance." },
            { type: "document", title: "Exploring the Names of Majesty", description: "An academic analysis of how the names of power shapes a believer's resilience.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "99 Names: Language and Logic", description: "A deeper dive into the Arabic roots of the primary 99 names.", url: "https://sunnah.com/", platform: "Linguistic Archives" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 4 (NAMES OF ALLAH) TO 20+ BLOCKS ---');
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
