const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = [
    // MODULE 4: NAMES & ATTRIBUTES
    {
        id: "95e4db43-1e8c-425f-a19f-058caeafc844",
        title: "Understanding Allah's Names",
        blocks: [
            { type: "callout", content: "Allah has ninety-nine names, one hundred less one. Whoever 'ahsaha' (memorizes, understands, and lives by them) will enter Paradise.", author: "Prophetic Hadith (Sahih al-Bukhari 2736)" },
            { type: "objectives", items: ["Understand the linguistic and spiritual importance of Allah's Names", "Differentiate between the Name (Ism) and the Named (Musamma)", "Explore the concept of 'Ihsan' in relation to Divine Names", "Identify the first steps in building a relationship with the Creator through His names"] },
            { type: "text", content: "## Why Know the Names?\n\nTo love someone, you must know them. To trust someone, you must understand their character. Allah has introduced Himself to us through His Names and Attributes so that we can find our way back to Him with certainty and love." },
            { type: "concept", translation: "Al-Ism wa al-Musamma: The relationship between the Name and the One who is named. In Allah's case, His names are not just labels; they are descriptions of His perfection.", arabic: "الاسم والمسمى" },
            { type: "quran", translation: "And to Allah belong the best names, so invoke Him by them. (Surah Al-A'raf 7:180)", arabic: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Recognition", description: "Knowing the meaning of the name.", icon: "Eye" },
                { title: "Supplication", description: "Calling upon Allah using that specific name.", icon: "Mic" },
                { title: "Transformation", description: "Letting the name change your behavior.", icon: "RefreshCw" },
                { title: "Certainty", description: "Finding peace in the attribute's reality.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Golden Rule of Affirmation\n\nWhen we learn about Allah's Names, we follow the principle: 'Nothing is like unto Him.' We affirm the meaning of the name (e.g., He Sees) but we deny any likeness to the creation (e.g., He does not see with biological eyes like ours)." },
            { type: "scholar", translation: "Knowledge of Allah is the most honorable of all sciences because the honor of a science is based on the honor of its subject. (Imam Al-Ghazali)", arabic: "شرف العلم بشرف المعلوم" },
            { type: "infographic", layout: "process", items: [
                { title: "Learn", description: "Study the 99 Names one by one.", icon: "BookOpen" },
                { title: "Reflect", description: "See the effects of the name in the world.", icon: "Sun" },
                { title: "Act", description: "Embody the qualities Allah loves (like Mercy).", icon: "Heart" }
            ]},
            { type: "text", content: "### The Breadth of Mercy\n\nNearly every chapter of the Quran begins with 'Bismillah al-Rahman al-Rahim' (In the name of Allah, the Most Merciful, the Especially Merciful). This teaches us that the primary lens through which we should view God is one of infinite compassion." },
            { type: "reflection", translation: "If I truly believe Allah is 'As-Sami' (The All-Hearing), how would that change the way I speak when I am angry?", arabic: "ألم يعلم بأن الله يرى" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Understanding the names of Allah is a lifelong journey. Every name is a door to a new level of spiritual intimacy with your Creator." },
            { type: "quiz", question: "According to the Hadith, what is the reward for 'counting/guarding' (Ahsaha) the 99 names of Allah?", options: ["Wealth", "Long life", "Paradise", "Worldly power"], correctIndex: 2, hint: "Dakhala al-Jannah." },
            { type: "quiz", question: "In Surah Al-A'raf 7:180, what does Allah command us to do with His 'best names'?", options: ["Ignore them", "Invoke Him by them (make Dua)", "Write them on walls only", "Keep them secret"], correctIndex: 1, hint: "Fa-d'oohu biha." },
            { type: "quiz", question: "What is the meaning of 'Musamma'?", options: ["The Name", "The One who is named", "A type of prayer", "A beautiful poem"], correctIndex: 1, hint: "It refers to the Being described by the name." },
            { type: "quiz", question: "Which lens does the 'Basmalah' suggest we use to view our relationship with Allah?", options: ["Vengeance", "Mercy and Compassion", "Indifference", "Pure Logic"], correctIndex: 1, hint: "Ar-Rahman Ar-Rahim." },
            { type: "quiz", question: "According to Imam Al-Ghazali, why is the science of knowing Allah the most honorable?", options: ["Because it's the hardest", "Because its subject (Allah) is the most honorable", "Because few people know it", "Because it's ancient"], correctIndex: 1, hint: "Sharaf al-ilm..." },
            { type: "document", title: "The 99 Names List", description: "A consolidated list of the names found in the Quran and Sunnah.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Understanding Divine Mercy", description: "A deep dive into the names Ar-Rahman and Ar-Rahim.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        id: "5c002634-f1e3-4d0d-b75a-a1a60a55f544",
        title: "The Most Beautiful Names",
        blocks: [
            { type: "callout", content: "He is Allah, the Creator, the Producer, the Fashioner; to Him belong the best names.", author: "Surah Al-Hashr 59:24" },
            { type: "objectives", items: ["Analyze specific names related to Creation: Al-Khaliq, Al-Bari, Al-Musawwir", "Understand the depth of names related to Sovereignty: Al-Malik, Al-Quddus", "Explore the names of Peace and Security: As-Salam, Al-Mu'min", "Reflect on how these names manifest in the physical universe"] },
            { type: "text", content: "## The Artist of Calibration\n\nWhen we look at the complexity of a single cell or the vastness of a galaxy, we see three specific names of Allah in action: Al-Khaliq (The one who plans creation), Al-Bari (The one who brings it into existence), and Al-Musawwir (The one who gives it its unique form and beauty)." },
            { type: "concept", translation: "Al-Khaliq, Al-Bari, Al-Musawwir: These three names represent the stages of bringing something into being—from design to existence to final aesthetic form.", arabic: "الخالق البارئ المصور" },
            { type: "infographic", layout: "grid", items: [
                { title: "Al-Quddus", description: "The Pure and Holy, far removed from any imperfection.", icon: "Sunrise" },
                { title: "As-Salam", description: "The Source of Peace who grants security to the fearful.", icon: "Shield" },
                { title: "Al-Aziz", description: "The Almighty who is never overcome.", icon: "Zap" },
                { title: "Al-Jabbar", description: "The Restorer who mends what is broken in our lives.", icon: "Heart" }
            ]},
            { type: "quran", translation: "He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer... (Surah Al-Hashr 59:23)", arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ" },
            { type: "text", content: "### The Name 'As-Salam'\n\nAllah is the Source of Peace. This means not only that He is free from any conflict or defect, but that any peace found in this world or the next is a gift from Him. When we say 'Assalamu Alaikum', we are invoking this Divine Name to protect and bring peace to our brother." },
            { type: "hadith", translation: "O Allah, You are Peace (As-Salam) and from You is Peace. Blessed are You, O Possessor of Majesty and Honor. (Sahih Muslim 591)", arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ" },
            { type: "scholar", translation: "The name Al-Jabbar is often misunderstood as 'The Tyrant', but its root also means 'The One who mends a broken bone'. He is the one who repairs your heart after a tragedy. (Classical Etymology)", arabic: "الجبار: الذي يجبر القلوب" },
            { type: "infographic", layout: "process", items: [
                { title: "Al-Mu'min", description: "He grants us the light of Faith.", icon: "Lock" },
                { title: "Al-Muhaymin", description: "He watches over and protects us.", icon: "Eye" },
                { title: "Al-Aziz", description: "He gives us strength through His might.", icon: "Zap" }
            ]},
            { type: "text", content: "### Sovereignty (Al-Malik)\n\nEverything we 'own' in this world is a temporary loan. The true King (Al-Malik) is the One who has absolute authority over the beginning and end of all things. Realizing this removes the fear of human tyrants from the heart." },
            { type: "reflection", translation: "If Allah is 'Al-Musawwir' (The Fashioner), and He fashioned me exactly as I am, why do I struggle with self-image or envy of others?", arabic: "في أي صورة ما شاء ركبك" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "The names of Allah are not just to be memorized; they are to be felt. To know Him as As-Salam is to find peace amidst the storm." },
            { type: "quiz", question: "Which Name refers to Allah's ability to 'mend' or 'restore' what is broken?", options: ["Al-Aziz", "Al-Jabbar", "Al-Malik", "Al-Khaliq"], correctIndex: 1, hint: "Think of 'Jibarah' (a splint for a bone)." },
            { type: "quiz", question: "In Surah Al-Hashr, three names related to creation are mentioned together. Which one refers to giving 'form and beauty'?", options: ["Al-Khaliq", "Al-Bari", "Al-Musawwir", "As-Salam"], correctIndex: 2, hint: "The Fashioner." },
            { type: "quiz", question: "What is the primary spiritual benefit of knowing Allah as 'Al-Malik' (The King)?", options: ["Gaining wealth", "Removing the fear of human power from the heart", "Becoming a ruler", "Learning history"], correctIndex: 1, hint: "Only He has absolute authority." },
            { type: "quiz", question: "According to the Hadith, what should we say after prayer regarding 'As-Salam'?", options: ["None of these", "Allahumma Antas-Salam wa minkas-Salam", "SubhanAllah", "Alhamdulillah"], correctIndex: 1, hint: "You are Peace and from You is Peace." },
            { type: "quiz", question: "Which Name means 'The Pure' or 'The Holy', far removed from any defect?", options: ["Al-Quddus", "Al-Muhaymin", "Al-Mutakabbir", "Al-Khaliq"], correctIndex: 0, hint: "Review 59:23." },
            { type: "document", title: "The Names of Majesty", description: "Exploring the names that describe Allah's Power and Sovereignty.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Source of Peace", description: "A meditation on the name As-Salam in times of anxiety.", url: "https://kalamullah.com/", platform: "Spirituality" }
        ]
    }
];

async function seed() {
    console.log('--- SEEDING MODULE 4 BY ID ---');
    for (const item of DATA) {
        process.stdout.write(`Updating Lesson ${item.id} (${item.title})... `);
        
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

        const { error } = await supabase.from('course_lessons').update({ 
            content_blocks: finalBlocks,
            title: item.title 
        }).eq('id', item.id);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE`);
        }
    }
}

seed();
