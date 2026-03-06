const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Attributes of Essence",
        blocks: [
            { type: "callout", content: "The Attributes of Essence (Sifat al-Dhat) are those that Allah is never without. They are inseparable from His very being.", author: "Valid theological definition (Al-Laalkaa'i, Usul al-I'tiqad)" },
            { type: "objectives", items: ["Define Sifat al-Dhat (Attributes of Essence) and differentiate them from Attributes of Action", "Understand attributes like Knowledge, Life, Power, and Hearing", "Explore the concept of 'Qidam' (Eternal Existence) and 'Baqa' (Eternal Subsistence)", "Analyze textual evidences for these essential attributes"] },
            { type: "text", content: "## The Inseparable Qualities\n\nScholars categorize Allah's attributes into two major groups. The first group is Sifat al-Dhat (Attributes of the Essence). These are the qualities that Allah has always possessed and will always possess. He is never without them, even for a blink of an eye." },
            { type: "concept", translation: "Sifat al-Dhat (Attributes of Essence): Qualities inseparable from Allah's being, such as Life, Knowledge, Power, Sight, and Hearing.", arabic: "صفات الذات" },
            { type: "quran", translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. (Surah Al-Baqarah 2:255)", arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Al-Hayah (Life)", description: "A life that has no beginning and no end. Perfect and absolute.", icon: "Activity" },
                { title: "Al-Ilm (Knowledge)", description: "Knowing the past, present, future, and what never was.", icon: "Brain" },
                { title: "Al-Qudrah (Power)", description: "Infinite ability to do anything that is logically possible.", icon: "Zap" },
                { title: "Al-Baqi (Endurance)", description: "The One who remains after all else perishes.", icon: "Clock" }
            ]},
            { type: "text", content: "### Attributes of the Senses?\n\nAllah attributes to Himself Sight (Basar) and Hearing (Sam'). However, we must follow the golden rule of 'Nothing is like unto Him.' We affirm that He hears and sees, but without ears, eyes, or a biological sensory system as we know it. His hearing and seeing are absolute and perfect." },
            { type: "quran", translation: "There is nothing like unto Him, and He is the Hearing, the Seeing. (Surah Ash-Shura 42:11)", arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ" },
            { type: "scholar", translation: "Whoever denies an attribute that Allah has affirmed for Himself is a Mu'attil (Denier). (Ibn Taymiyyah, Al-Aqeedah al-Wasitiyyah)", arabic: "الإثبات من غير تمثيل" },
            { type: "infographic", layout: "process", items: [
                { title: "Affirm", description: "State that Allah has Life, Sight, and Hearing.", icon: "Check" },
                { title: "Exalt", description: "Distance Him from human likeness (Tanzih).", icon: "ArrowUp" },
                { title: "Trust", description: "Rely on His absolute knowledge and power.", icon: "Shield" }
            ]},
            { type: "text", content: "### Self-Subsistence (Al-Qayyumiyyah)\n\nOne of the most profound essential attributes is that Allah is 'Al-Qayyum'—the One who sustains everything else but does not need anything to sustain Him. He is independent (Ghani), and all else is dependent (Faqir) upon Him." },
            { type: "reflection", translation: "If I truly believe Allah is 'Al-Alim' (All-Knowing), how can I justify a hidden sin that He is witnessing at this very moment?", arabic: "ألم يعلم بأن الله يرى؟" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Understanding the Attributes of Essence is the foundation of Awe. It makes us realize the gap between the finite creation and the infinite Creator." },
            { type: "quiz", question: "What does 'Sifat al-Dhat' mean?", options: ["Attributes of Action", "Attributes of Essence (inseparable from His being)", "Attributes of the Prophets", "Metaphorical names"], correctIndex: 1, hint: "They are qualities Allah is never without." },
            { type: "quiz", question: "In Surah Al-Baqarah 2:255 (Ayat al-Kursi), which two essential attributes are mentioned first?", options: ["The Forgiving, The Merciful", "The Ever-Living, The Sustainer (Al-Hayy, Al-Qayyum)", "The Just, The Wise", "The Creator, The Maker"], correctIndex: 1, hint: "Al-Hayy al-Qayyum." },
            { type: "quiz", question: "Does the attribute of 'Hearing' (As-Sam') in Allah mean He has ears like humans?", options: ["Yes, exactly", "No, we affirm the attribute but deny any likeness to creation", "It is only a metaphor for knowing", "It is not an attribute of Allah"], correctIndex: 1, hint: "Laysa ka-mithlihi shay'." },
            { type: "quiz", question: "Which attribute refers to Allah's absolute independence and His role in sustaining all existence?", options: ["Al-Alim", "Al-Qayyum", "Al-Qadir", "Al-Basir"], correctIndex: 1, hint: "See the concept of Self-Subsistence." },
            { type: "quiz", question: "If a person denies that Allah hears or sees, what are they called in classical theology?", options: ["Muhsin", "Mu'attil (Denier/Excluder)", "Zahid", "Muhaddith"], correctIndex: 1, hint: "Derived from 'Ta'til'." },
            { type: "document", title: "The Attributes of Perfection", description: "A detailed breakdown of the 7 essential attributes in classical Sunni theology.", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "Inseparable Names", description: "Understanding the list of Names that never change or diminish.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Attributes of Action",
        blocks: [
            { type: "callout", content: "Attributes of Action (Sifat al-Fi'liyyah) are those that Allah does when He wills. He rose over the Throne, He descends in a manner that suits His majesty, and He speaks to whomever He wills.", author: "Traditional Creed of the Salaf" },
            { type: "objectives", items: ["Define Sifat al-Fi'liyyah (Attributes of Action) and how they relate to Allah's will", "Learn about attributes like Istiwa' (Rising), Nuzul (Descending), and Speech", "Understand why these attributes do not imply 'change' in Allah's essence", "Explore the concept of 'Kalam Allah' (The Speech of Allah)"] },
            { type: "text", content: "## Divine Action and Will\n\nAttributes of Action (Sifat al-Fi'liyyah) are qualities that Allah is described with based on His choice. He does them whenever He wills. For example, He creates when He wills, He gives life and death when He wills, and He speaks whenever He wills." },
            { type: "concept", translation: "Sifat al-Fi'liyyah (Attributes of Action): Qualities related to Allah's will and power, which occur at times and not at others, such as Coming, Descending, and Creating.", arabic: "صفات الأفعال" },
            { type: "quran", translation: "The Most Merciful [who is] above the Throne established (Istiwa'). (Surah Taha 20:5)", arabic: "الرَّحْمَنُ عَلَى الْعَرْشِ اسْتَوَى" },
            { type: "infographic", layout: "grid", items: [
                { title: "Istiwa' (Rising)", description: "His elevation over the Throne in a manner befitting Him.", icon: "ArrowUp" },
                { title: "Nuzul (Descending)", description: "His descent to the lowest heaven in the last third of the night.", icon: "ArrowDown" },
                { title: "Mahabbah (Love)", description: "His love for those who do good.", icon: "Heart" },
                { title: "Kalam (Speech)", description: "His speaking to Moses and the revealers of Books.", icon: "Mic" }
            ]},
            { type: "text", content: "### The Speech of Allah\n\nUnlike created sound that emerges from vocal cords, Allah's speech (Kalam) is an attribute of action. He spoke to Ibrahim, He spoke to Musa, and the Qur'an we recite is His literal word—not a created sound or a translation from an angel." },
            { type: "quran", translation: "And Allah spoke to Moses with [direct] speech. (Surah An-Nisa 4:164)", arabic: "وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا" },
            { type: "hadith", translation: "Our Lord descends every night to the lowest heaven in the last third of the night... saying 'Who is calling upon Me that I may answer him?' (Sahih al-Bukhari 1145 / Muslim 758)", arabic: "يَنْزِلُ رَبُّنَا كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا" },
            { type: "scholar", translation: "The speech of Allah is not created. Whoever claims the Quran is created has committed disbelief. (Imam Ahmad)", arabic: "القرآن كلام الله غير مخلوق" },
            { type: "infographic", layout: "process", items: [
                { title: "Will", description: "He chooses to act.", icon: "Zap" },
                { title: "Command", description: "He says 'Be' (Kun).", icon: "Command" },
                { title: "Result", description: "The creation or event occurs.", icon: "Check" }
            ]},
            { type: "text", content: "### The Rule of Bi-la Kayf\n\nWhen we hear descriptions like 'Descending' or 'Rising', the human mind immediately thinks of physical movement. The scholars of the Sunnah cautioned: 'The meaning is known, but the 'how' (Kayf) is unknown.' We affirm the action without imagining a physical mechanism or comparing it to human movement." },
            { type: "reflection", translation: "If my Lord descends in the last third of the night to answer my calls, why am I asleep during my greatest opportunity?", arabic: "ساعة الاستجابة" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "Attributes of Action remind us that Allah is not a distant, static concept. He is an Active God who interacts with His creation, listens to their pleas, and acts according to His perfect wisdom." },
            { type: "quiz", question: "What is the key difference between Attributes of Essence and Attributes of Action?", options: ["Essence attributes are always there; Action attributes depend on His Will", "Action attributes are more important", "There is no difference", "Action attributes are only for angels"], correctIndex: 0, hint: "Action = whenever He wills." },
            { type: "quiz", question: "In Surah Taha 20:5, what is the attribute of action mentioned regarding the Throne?", options: ["Creation", "Istiwa' (Rising/Establishing)", "Forgiveness", "Anger"], correctIndex: 1, hint: "Ar-Rahmanu 'ala al-'arshi istawa." },
            { type: "quiz", question: "What is the orthodox Sunni position regarding the Qur'an?", options: ["It is a creation of Allah", "It is the literal, uncreated speech of Allah", "It was written by the Prophet", "It is only a translation of the message"], correctIndex: 1, hint: "Al-Qur'anu Kalamullahi ghayru makhluq." },
            { type: "quiz", question: "When does the 'Nuzul' (Descent) of Allah to the lowest heaven occur every night?", options: ["At sunset", "In the first third of the night", "In the last third of the night", "At sunrise"], correctIndex: 2, hint: "The time for Tahajjud." },
            { type: "quiz", question: "According to Surah An-Nisa 4:164, which Prophet had the unique honor of Allah speaking to him 'with direct speech'?", options: ["Prophet Ibrahim", "Prophet Musa (Moses)", "Prophet 'Isa", "Prophet Nuh"], correctIndex: 1, hint: "Wakal-lama Allahu Musa takleema." },
            { type: "document", title: "Speech and Revelation", description: "Historical account of the 'Createdness of the Quran' controversy and its resolution.", url: "https://kalamullah.com/", platform: "Classical History" },
            { type: "document", title: "Descending and Rising: A Guide", description: "Theological treatise on the 'Attributes of Action' in Sunni creed.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 4 (ATTRIBUTES) TO 20+ BLOCKS ---');
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
