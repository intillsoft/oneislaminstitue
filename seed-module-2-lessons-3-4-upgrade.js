const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "The Six Pillars of Iman",
        blocks: [
            { type: "callout", content: "Faith is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in Divine Decree - both the good and the bad.", author: "Prophetic Hadith (Sahih Muslim 8)" },
            { type: "objectives", items: ["Enumerate the six essential articles of faith", "Understand the vertical relationship between belief in Allah and the other five pillars", "Explore the implications of belief in the Unseen (Al-Ghayb)", "Analyze the connective tissue between the Books and the Messengers"] },
            { type: "text", content: "## Beyond the Visible World\n\nWhile Islam deals with the submissive actions of the body, Iman deals with the total conviction of the heart in realities that the eyes cannot see. These are the six foundations upon which the entire intellect of a believer is built." },
            { type: "concept", translation: "Arkan al-Iman (Pillars of Faith): The six fundamental beliefs required to be a 'Mu'min' (Believer).", arabic: "أركان الإيمان الستة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Allah", description: "The source and center of all belief.", icon: "Sun" },
                { title: "Angels", description: "The administrative beings of the Unseen.", icon: "Sunrise" },
                { title: "Books", description: "The verbal communication from Divine to Creation.", icon: "Book" },
                { title: "Messengers", description: "The human examples of the Books in action.", icon: "User" },
                { title: "Last Day", description: "The final accountability and justice.", icon: "Clock" },
                { title: "Decree (Qadr)", description: "The absolute sovereignty over all events.", icon: "Zap" }
            ]},
            { type: "quran", translation: "Righteousness is not that you turn your faces toward the east or the west... but [true] righteousness is [in] one who believes in Allah, the Last Day, the angels, the Book, and the prophets. (Surah Al-Baqarah 2:177)", arabic: "لَّيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ قِبَلَ الْمَشْرِقِ وَالْمَغْرِبِ وَلَٰكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَالْمَلَائِكَةِ وَالْكِتَابِ وَالنَّبِيِّينَ" },
            { type: "text", content: "### The Hierarchy of Belief\n\nBelief in Allah is the 'Root Pillar'. All other pillars depend on it. We believe in Angels because Allah told us about them. We believe in the Day of Judgment because He promised it. Everything flows from the recognition of the Divine." },
            { type: "hadith", translation: "Tell me about Iman. He (the Prophet) said: It is to believe in Allah, His angels, His books... (Sahih Muslim 8)", arabic: "قَالَ فَأَخْبِرْنِي عَنِ الإِيمَانِ... قَالَ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ" },
            { type: "scholar", translation: "Faith in the Unseen (Ghayb) is the first psychological breakthrough in becoming a believer. It elevates the mind above the purely material. (Classical scholars commentary on Surah Al-Baqarah)", arabic: "الإيمان بالغيب أساس التقوى" },
            { type: "infographic", layout: "process", items: [
                { title: "Knowledge", description: "Learning about the six pillars.", icon: "BookOpen" },
                { title: "Verification", description: "The heart finding certainty in them.", icon: "Check" },
                { title: "Application", description: "Living with the awareness of the Unseen.", icon: "UserCheck" }
            ]},
            { type: "text", content: "### Qadr: The Final Frontier\n\nBelief in Divine Decree (Qadr) is often the most difficult pillar for the human ego. It requires accepting that Allah's wisdom transcends our limited perception of 'good' and 'bad'. It is the ultimate test of trust in the Lordship of Allah." },
            { type: "reflection", translation: "When I say I believe in Angels, do I act like a person who is constantly being recorded? When I say I believe in the Last Day, does my spending change?", arabic: "هل إيماني باليوم الآخر يغير سلوكي؟" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "The six pillars create a 360-degree spiritual environment. They answer where you came from, why you are here, what guides you, and where you are going." },
            { type: "quiz", question: "Which of the following is NOT one of the six pillars of Iman?", options: ["Belief in the Angels", "Giving Zakat", "Belief in the Books", "Belief in Divine Decree"], correctIndex: 1, hint: "Zakat is a pillar of Islam (action), not of Iman (inner heart)." },
            { type: "quiz", question: "In which verse of Surah Al-Baqarah does Allah list five of the pillars of Iman in sequence?", options: ["Verse 1", "Verse 177", "Verse 255", "Verse 286"], correctIndex: 1, hint: "The 'Verse of Righteousness' (Laysa al-birra...)." },
            { type: "quiz", question: "What is the 'root' pillar of Iman from which all others branch out?", options: ["Belief in Angels", "Belief in Allah", "Belief in Messengers", "Belief in Qadr"], correctIndex: 1, hint: "All other articles of faith are predicated on His existence and truth." },
            { type: "quiz", question: "Faith in the 'Unseen' (Al-Ghayb) is a defining characteristic mentioned in the beginning of which Surah?", options: ["Surah Yasin", "Surah Al-Mulk", "Surah Al-Baqarah", "Surah An-Nas"], correctIndex: 2, hint: "Alif-Lam-Mim... alladhina yu'minuna bil-ghaybi." },
            { type: "quiz", question: "What must a believer believe regarding Divine Decree (Qadr)?", options: ["Only the good parts", "Only the bad parts", "Both the good and the bad come from Allah", "That we have no choice at all"], correctIndex: 2, hint: "Wa tu'minu bil-qadari khayrihi wa sharrihi." },
            { type: "document", title: "The Six Pillars of Faith", description: "Dr. Saleh al-Fawzan's systematic breakdown of the articles of the Islamic creed.", url: "https://kalamullah.com/", platform: "Classical Archives" },
            { type: "document", title: "Understanding Divine Decree", description: "A philosophical and theological guide to the concept of Qadr.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "The Concept of Ihsan",
        blocks: [
            { type: "callout", content: "Ihsan is to worship Allah as if you see Him; and if you do not see Him, then surely He sees you.", author: "Prophetic Hadith (Sahih Muslim 8)" },
            { type: "objectives", items: ["Define Ihsan linguistically and technically", "Identify the two levels of Ihsan: Vision and Awareness", "Learn how Ihsan transforms daily mundane tasks into spiritual excellence", "Examine historical examples of Ihsan in the life of the Prophet and his companions"] },
            { type: "text", content: "## The Pinnacle of Religion\n\nIf Islam is the body and Iman is the heart, Ihsan (إحسان) is the soul. It is the height of spiritual consciousness where the servant lives in a constant state of awareness of the Divine. It is the transition from doing things 'correctly' to doing things 'beautifully'." },
            { type: "concept", translation: "Ihsan (Spiritual Excellence): To excel in everything you do, especially in your internal awareness of Allah's watchfulness.", arabic: "الإحسان: أن تعبد الله كأنك تراه" },
            { type: "quran", translation: "Indeed, Allah is with those who fear Him and those who are doers of good (Ihsan). (Surah An-Nahl 16:128)", arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ" },
            { type: "infographic", layout: "process", items: [
                { title: "Mushahadah (Vision)", description: "Worshipping Him as if you see Him (The highest state).", icon: "Eye" },
                { title: "Muraqabah (Awareness)", description: "Worshipping Him knowing He sees you.", icon: "Shield" },
                { title: "Itqan (Mastery)", description: "Doing every worldly action with excellence.", icon: "Check" }
            ]},
            { type: "text", content: "### The Two Stations of Ihsan\n\nThe first station is that of *Contemplation*: your focus on Allah is so intense it is as if you see Him. If you cannot reach that, you fall back to the second station: *Vigilance*. You are acutely aware that the King of Kings is watching your every heartbeat." },
            { type: "hadith", translation: "Verily, Allah has prescribed Ihsan (excellence/profficiency) in all things. So if you kill, kill well; and if you slaughter, slaughter well... (Sahih Muslim 1955)", arabic: "إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ" },
            { type: "scholar", translation: "Islam is for the common people, Iman is for the seekers, and Ihsan is for the elite of the elite. (Ibn al-Qayyim)", arabic: "الإحسان هو لب الإيمان وروحه" },
            { type: "text", content: "### Ihsan in Mundane Life\n\nIhsan is not limited to prayer. A student who studies with Ihsan does so knowing Allah loves excellence. A worker who works with Ihsan does so with honesty because their employer is ultimately Allah. It is the cure for mediocrity." },
            { type: "quran", translation: "And who is better in religion than one who submits himself to Allah while being a doer of good (Muhsin)... (Surah An-Nisa 4:125)", arabic: "وَمَنْ أَحْسَنُ دِينًا مِّمَّنْ أَسْلَمَ وَجْهَهُ لِلَّهِ وَهُوَ مُحْسِنٌ" },
            { type: "reflection", translation: "If a camera was filming my internal thoughts and projected them on a screen, would I be ashamed? Ihsan is living as if that screen is always on.", arabic: "الله مطلع علي، الله شاهدي" },
            { type: "infographic", layout: "grid", items: [
                { title: "Excellence in Prayer", description: "Focus (Khushu') and patience.", icon: "Sunrise" },
                { title: "Excellence in Service", description: "Helping without being asked.", icon: "Heart" },
                { title: "Excellence in Speech", description: "Saying only what is good.", icon: "MessageCircle" },
                { title: "Excellence in Character", description: "Forbearing when angry.", icon: "ShieldAlert" }
            ]},
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Ihsan is the secret ingredient that turns dry rituals into vibrant spiritual experiences. It is the goal of every serious traveler on the path to Allah." },
            { type: "quiz", question: "What is the highest 'station' of Ihsan mentioned in the Hadith Jibreel?", options: ["Worshipping for reward", "Worshipping because you have to", "Worshipping Allah as if you see Him", "Worshipping to be seen by people"], correctIndex: 2, hint: "Ka-annaka tarahu." },
            { type: "quiz", question: "According to Sahih Muslim 1955, in how many things has Allah prescribed Ihsan?", options: ["Only in Salah", "Only in Hajj", "In all things", "Only in dealing with parents"], correctIndex: 2, hint: "Inna Allaha kataba al-ihsana 'ala kulli shay'." },
            { type: "quiz", question: "If 'Mushahadah' is the level of Vision, what is 'Muraqabah'?", options: ["The level of distraction", "The level of knowing Allah sees you", "The level of ignoring sins", "The level of talking about faith"], correctIndex: 1, hint: "It means watchfulness or observation." },
            { type: "quiz", question: "In Surah An-Nahl 16:128, who does Allah say He is 'with'?", options: ["Only the rich", "Those who have fear of Him and those who do ihsan", "Those who are famous", "Those who never make mistakes"], correctIndex: 1, hint: "Innallaha ma'alladhina-ttaqaw walladhina hum muhsinun." },
            { type: "quiz", question: "What is the linguistic meaning of Ihsan?", options: ["To force", "To beautify or make excellent", "To memorize", "To wait"], correctIndex: 1, hint: "It comes from the root H-S-N (Husn/Beauty)." },
            { type: "document", title: "The Station of Watchfulness", description: "A deep dive into the spiritual state of Muraqabah in the works of Al-Ghazali.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Itqan: The Islamic Work Ethic", description: "How the concept of Ihsan translates into professional and academic excellence.", url: "https://yaqeeninstitute.org/", platform: "Islamic Ethics Series" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 2 LESSONS 3 & 4 TO 22+ BLOCKS ---');
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
