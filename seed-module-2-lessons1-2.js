const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Introduction to Tawheed",
        blocks: [
            { type: "callout", content: "Tawheed is the first command in religion, the purpose of creation, and the key to Paradise.", author: "Ibn Taymiyyah (Majmu' al-Fatawa)" },
            { type: "objectives", items: ["Understand the linguistic and technical meaning of Tawheed", "Recognize its absolute centrality in Islam", "Identify the core categories of Tawheed", "Explore scholarly consensus on the divisions of Tawheed"] },
            { type: "text", content: "## The Foundation of Existence\n\nThe Arabic root w-ḥ-d (و-ح-د) signifies 'to make one' or 'to unify.' In theology, Tawheed is realizing and maintaining the absolute Oneness of Allah in all of His rights. It is the core axis around which all of Islam revolves. Every prophet, from Adam to Muhammad (peace be upon them all), came with this singular message." },
            { type: "quran", translation: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge.' (Surah Al-Ikhlas 112:1-2)", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ - اللَّهُ الصَّمَدُ" },
            { type: "concept", translation: "Tawheed (Islamic Monotheism): To single out Allah alone for worship, alongside the affirmation of what He affirmed for Himself of divine attributes.", arabic: "التوحيد: إفراد الله بالعبادة مع إثبات ما أثبته لنفسه من الصفات" },
            { type: "infographic", layout: "grid", items: [
                { title: "Rububiyyah", description: "Oneness in His Actions (Creator, Sustainer).", icon: "Globe" },
                { title: "Uluhiyyah", description: "Oneness in Our Actions (Worship exclusively for Him).", icon: "Heart" },
                { title: "Asma wa Sifat", description: "Oneness in His Names and Attributes.", icon: "BookOpen" }
            ]},
            { type: "text", content: "### The First Obligation\n\nTawheed is the very first obligation upon a responsible human being. The Prophet prioritized it above all other commandments. When assigning his companions to teach new communities, the first instruction was always the establishment of Tawheed before prayer or charity." },
            { type: "hadith", translation: "Let the first thing to which you invite them be the Tawheed (Oneness) of Allah. (Sahih al-Bukhari 7372)", arabic: "فَلْيَكُنْ أَوَّلَ مَا تَدْعُوهُمْ إِلَيْهِ تَوْحِيدُ اللَّهِ" },
            { type: "scholar", translation: "All of the Qur'an is about Tawheed, its rights, its rewards, and the fate of those who oppose it. (Ibn Qayyim, Madarij as-Salikeen)", arabic: "القرآن كله في التوحيد وحقوقه وجزائه، وفي شأن الشرك وأهله وجزائهم" },
            { type: "text", content: "Without Tawheed, all other actions are built on a compromised foundation. Fasting, prayer, and charity are accepted only when the core belief in Allah's absolute oneness is sound." },
            { type: "reflection", translation: "Tawheed liberates the human heart from the slavery of creation to the freedom of worshipping the Creator alone.", arabic: "التوحيد يحرر قلب الإنسان من عبودية المخلوق إلى حرية عبادة الخالق وحده" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Tawheed is the most liberating force in existence. It unifies one's purpose, simplifies life's complex demands, and ties the heart directly to the Sustainer." },
            { type: "quiz", question: "What does the Arabic root 'w-h-d' signify?", options: ["To worship", "To make one or unify", "To fear", "To love"], correctIndex: 1, hint: "Look at the word 'Wahid' (One)." },
            { type: "quiz", question: "In the famous Hadith in Sahih al-Bukhari, what was Mu'adh bin Jabal told to invite the people of Yemen to first?", options: ["Zakat", "Hajj", "Tawheed of Allah", "Fasting"], correctIndex: 2, hint: "The first condition of Islam." },
            { type: "quiz", question: "Which of these is NOT one of the three primary categories of Tawheed?", options: ["Tawheed al-Hukm (Governance)", "Tawheed ar-Rububiyyah (Lordship)", "Tawheed al-Uluhiyyah (Worship)", "Tawheed al-Asma wa Sifat (Names)"], correctIndex: 0, hint: "Look at the infographic grid." },
            { type: "quiz", question: "According to Ibn Qayyim, how much of the Qur'an discusses Tawheed?", options: ["Only the short Surahs", "All of the Qur'an", "Half of it", "Only the Makkan Surahs"], correctIndex: 1, hint: "He stated that every ruling and story returns to it." },
            { type: "quiz", question: "Which concise Surah is considered the pure manifesto of Tawheed?", options: ["Surah Al-Baqarah", "Surah Yasin", "Surah Al-Ikhlas", "Surah Al-Kahf"], correctIndex: 2, hint: "Say, 'He is Allah, One...'" },
            { type: "document", title: "The Fundamentals of Tawheed", description: "Dr. Bilal Philips comprehensive book breaking down the categories of Monotheism.", url: "https://kalamullah.com/Books/Fundamentals%20Of%20Tawheed.pdf", platform: "Kalamullah Library" },
            { type: "document", title: "Aqeedah at-Tahawiyyah", description: "A classical text representing the consensus of the early scholars on Tawheed.", url: "https://sunnah.com/", platform: "Classical Archives" }
        ]
    },
    {
        title: "Tawheed ar-Rububiyyah",
        blocks: [
            { type: "callout", content: "To acknowledge that He is the sole Creator, Sovereign, and Disposer of all affairs.", author: "Classical Theological Maxim" },
            { type: "objectives", items: ["Define Tawheed ar-Rububiyyah based on textual evidence", "Understand why recognizing Rububiyyah is necessary but insufficient for salvation", "Examine how even the Quraysh acknowledged this element", "Reflect on how this belief practically removes anxiety"] },
            { type: "text", content: "## The Lordship of Allah\n\nTawheed ar-Rububiyyah (Oneness of Lordship) is to single out Allah concerning His actions. This means firmly believing that He alone is the Creator (Al-Khaliq), the Provider (Ar-Razzaq), the Sovereign (Al-Malik), and the Director of all affairs. Nothing moves, lives, or dies except by His decree." },
            { type: "quran", translation: "Allah is the Creator of all things, and He is, over all things, Disposer of affairs. (Surah Az-Zumar 39:62)", arabic: "اللَّهُ خَالِقُ كُلِّ شَيْءٍ ۖ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ وَكِيلٌ" },
            { type: "concept", translation: "Al-Rububiyyah (Lordship): Stemming from 'Rabb', meaning the One who creates, owns, sustains, and commands everything.", arabic: "الربوبية: الإقرار بأن الله هو الخالق المالك المدبر لجميع الأمور" },
            { type: "infographic", layout: "process", items: [
                { title: "Al-Khaliq", description: "He brings things from non-existence into existence.", icon: "Activity" },
                { title: "Al-Malik", description: "He has absolute ownership over everything.", icon: "Shield" },
                { title: "Al-Mudabbir", description: "He regulates and disposes of all physical laws and events.", icon: "Command" }
            ]},
            { type: "text", content: "### The Belief of the Pre-Islamic Arabs\n\nA critical point in Islamic theology is that the pagan Arabs at the time of the Prophet actually believed in Tawheed ar-Rububiyyah! They knew Allah created the heavens and the earth, but they directed their worship to idols *as intercessors*." },
            { type: "quran", translation: "And if you asked them, 'Who created the heavens and earth?' they would surely say, 'Allah.' (Surah Luqman 31:25)", arabic: "وَلَئِن سَأَلْتَهُم مَّنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ لَيَقُولُنَّ اللَّهُ" },
            { type: "scholar", translation: "Affirming Rububiyyah alone is not enough to make someone a Muslim, for even the polytheists affirmed it. (Ibn Kathir, Tafsir Surah Al-An'am)", arabic: "توحيد الربوبية لا يكفي لإدخال العبد في الإسلام، فإن المشركين كانوا مقرين به" },
            { type: "text", content: "Therefore, acknowledging that God exists and created everything is only the first step. True monotheism requires aligning one's actions to that reality." },
            { type: "hadith", translation: "Know that if the whole world were to gather together to benefit you, they could not benefit you except with something that Allah has written for you... (Sunan at-Tirmidhi 2516, Authentic)", arabic: "وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ" },
            { type: "reflection", translation: "When you stress about your provision or future, remind yourself: My Lord is Ar-Razzaq (The Provider) and Al-Mudabbir (The Disposer of Affairs).", arabic: "عندما تقلق بشأن رزقك، تذكر: ربي هو الرزاق والمدبر" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "Recognizing that Allah is the singular Lord over creation destroys fear and anxiety, replacing them with absolute reliance (Tawakkul) upon Him." },
            { type: "quiz", question: "Tawheed ar-Rububiyyah refers to Singling out Allah in:", options: ["His Names", "Our Actions", "His Actions (Creation, Sustenance)", "The direction of prayer"], correctIndex: 2, hint: "Lordship implies actions from the Lord." },
            { type: "quiz", question: "Did the pagan Arabs of Quraysh at the time of the Prophet believe that Allah created the universe?", options: ["No, they thought idols created the universe", "Yes, they acknowledged Allah as the Supreme Creator", "They were atheists", "They believed the universe was infinite"], correctIndex: 1, hint: "Look at Surah Luqman 31:25." },
            { type: "quiz", question: "Is believing in Tawheed ar-Rububiyyah alone sufficient to automatically make someone a complete Muslim?", options: ["Yes, completely", "Only if combined with fasting", "No, one must also establish Uluhiyyah (Worship)", "Yes, it is the highest form"], correctIndex: 2, hint: "See the Scholarly Insight block by Ibn Kathir." },
            { type: "quiz", question: "In the famous Hadith in Tirmidhi, if the whole world gathered to benefit you, what would happen?", options: ["They would succeed in everything", "They could only benefit you with what Allah has decreed", "They would fail utterly", "They would forget why they gathered"], correctIndex: 1, hint: "Nothing moves except by His decree." },
            { type: "quiz", question: "Which attribute refers to Allah's role as the 'Disposer of Affairs'?", options: ["Al-Khaliq", "Al-Malik", "Al-Mudabbir", "Ar-Rahman"], correctIndex: 2, hint: "It means the one who manages and regulates." },
            { type: "document", title: "Knowing Allah's Lordship", description: "An article exploring the emotional and psychological benefits of trusting in Allah's decree.", url: "https://yaqeeninstitute.org/read/paper/the-divine-decree-predestination", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 2 (LESSONS 1-2) WITH 18+ BLOCKS ---');
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
