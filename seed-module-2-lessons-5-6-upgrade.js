const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Internal vs External Submission",
        blocks: [
            { type: "callout", content: "Submission of the limbs (Islam) is the container, and submission of the heart (Iman) is the essence. A container without essence is hollow, and essence without a container is lost.", author: "Traditional Scholarly Metaphor" },
            { type: "objectives", items: ["Contrast the requirements of legal submission versus spiritual submission", "Understand why 'Iman' is the secret known only to Allah while 'Islam' is visible to people", "Identify the dangers of 'Empty Ritualism'", "Analyze the Quranic distinction between being a Muslim and being a Mu'min"] },
            { type: "text", content: "## Two Halves of a Whole\n\nIn Islamic law, we judge by what is apparent. If a person performs the pillars of Islam, we treat them as a Muslim. However, in the sight of Allah, the only thing that counts for salvation is the internal submission (Iman) that powers those physical acts." },
            { type: "concept", translation: "Dhahir vs Batin (Apparent vs Hidden): The theological distinction between actions observed by society and the state of the heart observed only by the Creator.", arabic: "الظاهر والباطن" },
            { type: "infographic", layout: "grid", items: [
                { title: "Dhahir ( Islam )", description: "Prayer, Zakat, Hajj, Testimony. Visible to humanity.", icon: "Eye" },
                { title: "Batin ( Iman )", description: "Love, Hope, Fear, Sincerity. Hidden from humanity.", icon: "Ghost" },
                { title: "The Union", description: "Excellence (Ihsan) when both align perfectly.", icon: "Zap" },
                { title: "The Failure", description: "Hypocrisy (Nifaq) when they contradict.", icon: "AlertTriangle" }
            ]},
            { type: "quran", translation: "O you who have believed, enter into Islam completely [and perfectly] and do not follow the footsteps of Satan. (Surah Al-Baqarah 2:208)", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً" },
            { type: "scholar", translation: "If the apparent and the hidden are at peace with one another, that is the mark of a truthful believer. (Ahmad ibn Hanbal)", arabic: "إذا استوى الظاهر والباطن فذلك الإيمان" },
            { type: "text", content: "### The Crisis of Form without Substance\n\nMany Muslims today fall into the trap of 'Empty Ritualism'—performing Salah as a habit or cultural norm while the heart is elsewhere. This is defined by scholars as a body without a soul. While it might fulfill the legal requirement, it yields no spiritual growth." },
            { type: "hadith", translation: "Verily, Allah does not look at your appearances or your wealth, but He looks at your hearts and your actions. (Sahih Muslim 2564)", arabic: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ" },
            { type: "infographic", layout: "process", items: [
                { title: "Observation", description: "Man sees the action.", icon: "User" },
                { title: "Examination", description: "Allah sees the intention.", icon: "Search" },
                { title: "Balance", description: "Aligning the heart with the deed.", icon: "Scale" }
            ]},
            { type: "text", content: "### The Legal Reality\n\nThis distinction is what allows an Islamic society to function. We give a person their rights as a Muslim based on their apparent submission. We leave the 'secrets of the hearts' to Allah. We are not commanded to 'split open the hearts of people' to see if they truly believe." },
            { type: "hadith", translation: "Usamah ibn Zayd killed a man who had said 'La ilaha illallah' in battle. The Prophet (PBUH) rebuked him severely, saying: 'Did you split open his heart to see if he said it truthfully or not?' (Sahih Muslim 96)", arabic: "أَفَلاَ شَقَقْتَ عَنْ قَلْبِهِ" },
            { type: "reflection", translation: "If my heart was a public billboard, would I still be proud of the prayers I performed today?", arabic: "هل يوافق باطني ظاهري؟" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "True success lies in the synchronization of the body and soul. Don't just be a Muslim in the eyes of the people; be a Mu'min in the eyes of the Most High." },
            { type: "quiz", question: "In Sahih Muslim 2564, what does Allah NOT look at when judging a servant?", options: ["Hearts", "Wealth and appearances", "Actions", "Intentions"], correctIndex: 1, hint: "He looks at what is hidden and what is done." },
            { type: "quiz", question: "What was the Prophet's (PBUH) response to Usamah ibn Zayd after he killed a man who claimed faith?", options: ["You did the right thing", "Did you split open his heart?", "He was a hypocrite", "Allah will reward you"], correctIndex: 1, hint: "A rebuke about judging the hidden contents of a heart." },
            { type: "quiz", question: "According to Surah Al-Baqarah 2:208, how should a believer enter into Islam?", options: ["Partially", "Completely and perfectly (kaffah)", "Only in the morning", "Only when people are watching"], correctIndex: 1, hint: "Kaffah means entirely or universally." },
            { type: "quiz", question: "Which term refers to the 'apparent' or visible actions?", options: ["Batin", "Dhahir", "Sirr", "Khayal"], correctIndex: 1, hint: "Opposite of hidden (Batin)." },
            { type: "quiz", question: "If the heart is disconnected from the physical act of worship, what is this state called by scholars?", options: ["Excellence", "Empty Ritualism / Form without soul", "Absolute Faith", "Total Certainty"], correctIndex: 1, hint: "A hollow shell." },
            { type: "document", title: "Intention in Islamic Law", description: "The role of 'Niyyah' (Intention) in determining the validity of actions.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Secrets of the Heart", description: "Al-Ghazali's writings on the internal states of the soul during worship.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Hypocrisy: Major and Minor",
        blocks: [
            { type: "callout", content: "The signs of a hypocrite are three: whenever he speaks he lies, whenever he promises he breaks it, and whenever he is trusted he betrays.", author: "Prophetic Hadith (Sahih al-Bukhari 33)" },
            { type: "objectives", items: ["Differentiate between Nifaq al-Akbar (Major) and Nifaq al-Asghar (Minor)", "Understand the severe eternal punishment for major hypocrisy", "Identify behavioral traits that lead to hypocrisy in character", "Learn the primary cure for hypocrisy: Sincerity (Ikhlas)"] },
            { type: "text", content: "## The Hidden Enemy\n\nHypocrisy (Nifaq) is defined as showing good/faith while concealing evil/disbelief. It is arguably more dangerous than open disbelief because it operates from within the community. There are two distinct levels of hypocrisy: one that removes you from Islam, and one that corrupts your character." },
            { type: "concept", translation: "Nifaq (Hypocrisy): 1. Nifaq al-I'tiqadi (Belief): Outwardly Muslim, inwardly disbelieving. 2. Nifaq al-Amali (Action): Muslim in belief, but behaving like a hypocrite.", arabic: "النفاق الأكبر والنفاق الأصغر" },
            { type: "quran", translation: "Indeed, the hypocrites will be in the lowest depths of the Fire - and never will you find for them a helper. (Surah An-Nisa 4:145)", arabic: "إِنَّ الْمُنَافِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Major Hypocrisy", description: "Concels disbelief. Removes one from Islam entirely.", icon: "UserX" },
                { title: "Minor Hypocrisy", description: "Lying, betrayal, breaking oaths. A major sin, but remains Muslim.", icon: "Ghost" },
                { title: "The Fate", description: "Lowest depths of hell for the major type.", icon: "Flame" },
                { title: "The Cure", description: "Ikhlas (Sincerity) and Repentance.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Signs of Practical Hypocrisy\n\nThe Prophet (PBUH) warned his companions about behavioral hypocrisy. These are traits that 'resemble' those of the major hypocrites. If these traits are present in a believer, they possess 'a branch of hypocrisy' until they give it up." },
            { type: "hadith", translation: "Four traits - whoever possesses all four is a pure hypocrite: When he speaks he lies, when he makes a covenant he betrays, when he promises he breaks it, and when he disputes he behaves obscenely. (Sahih al-Bukhari 34 / Muslim 58)", arabic: "أَرْبَعٌ مَنْ كُنَّ فِيهِ كَانَ مُنَافِقًا خَالِصًا" },
            { type: "scholar", translation: "No one fears hypocrisy except a believer, and no one feels safe from it except a hypocrite. (Al-Hasan al-Basri)", arabic: "ما خافه إلا مؤمن ولا أمنه إلا منافق" },
            { type: "infographic", layout: "process", items: [
                { title: "Lying", description: "Distorting the truth for gain.", icon: "MessageCircle" },
                { title: "Betrayal", description: "Breaking a sacred trust (Amanah).", icon: "ShieldX" },
                { title: "Breaking Oaths", description: "Failing to fulfill promises.", icon: "CheckSquare" }
            ]},
            { type: "text", content: "### The Greatest Fear of the Salaf\n\nThe early generations (Salaf) were terrified of 'Hidden Hypocrisy'. They constantly audited their intentions to ensure they weren't doing righteous deeds just to be seen by people. This self-correction kept their faith vibrant and sincere." },
            { type: "reflection", translation: "Do I find it harder to perform Salah when I am alone than when I am in the Masjid with others? If yes, I must address the shadow of 'Action Hypocrisy'.", arabic: "هل صلاتي في الخلاء كصلاتي في الملاء؟" },
            { type: "hadith", translation: "The most burdensome prayers for the hypocrites are the Fajr and the 'Isha' prayers. (Sahih al-Bukhari 657)", arabic: "أَثْقَلَ الصَّلاَةِ عَلَى الْمُنَافِقِينَ صَلاَةُ الْعِشَاءِ وَصَلاَةُ الْفَجْرِ" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "Hypocrisy is a disease of the heart. The only cure is to focus on the 'Audience of One'—Allah—and to treat the praise and criticism of people as entirely equal." },
            { type: "quiz", question: "Which level of the Fire is reserved for the hypocrites (Major Nifaq) according to Surah An-Nisa 4:145?", options: ["The highest level", "The middle gate", "The lowest depths", "They are not in the fire"], correctIndex: 2, hint: "Ad-Dark al-Asfal." },
            { type: "quiz", question: "According to Al-Hasan al-Basri, who is the only person who 'feels safe' from hypocrisy?", options: ["The scholar", "The hypocrite himself", "The angel", "The prophet"], correctIndex: 1, hint: "A true believer is always cautious of it." },
            { type: "quiz", question: "What are the TWO types of hypocrisy mentioned in this lesson?", options: ["Mental and Physical", "Major (Belief) and Minor (Action/Behavioral)", "Ancient and Modern", "Intentional and Accidental"], correctIndex: 1, hint: "One removes from faith, the other is a major sin." },
            { type: "quiz", question: "Which two prayers were described in Sahih al-Bukhari 657 as being 'most burdensome' for the hypocrites?", options: ["Dhuhr and Asr", "Fajr and Isha", "Jumu'ah and Tarawih", "Maghrib and Fajr"], correctIndex: 1, hint: "The prayers performed in the dark/corners of the day." },
            { type: "quiz", question: "If a person has the habit of lying but they still believe in Allah in their heart, what category do they fall into?", options: ["Major Hypocrisy", "Minor Hypocrisy (Nifaq al-Amali)", "Absolute Disbelief", "Perfect Faith"], correctIndex: 1, hint: "It is a corruption of character, not a total denial of creed." },
            { type: "document", title: "Traits of the Hypocrites", description: "A detailed commentary on the beginning of Surah Al-Baqarah where hypocrites are described.", url: "https://quran.com/", platform: "Tafsir Classics" },
            { type: "document", title: "Curing Hypocrisy of the Heart", description: "Practical spiritual exercises to build sincerity and remove Riya'.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 2 LESSONS 5 & 6 TO 22+ BLOCKS ---');
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
