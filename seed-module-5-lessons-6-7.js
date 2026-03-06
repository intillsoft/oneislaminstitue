const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Love for the Prophet",
        blocks: [
            { type: "callout", content: "None of you truly believes until I am more beloved to him than his father, his child, and all of mankind.", author: "Prophetic Hadith (Sahih al-Bukhari 15 / Muslim 44)" },
            { type: "objectives", items: ["Understand the legal requirement of loving the Prophet Muhammad (PBUH)", "Differentiate between emotional love and the love of obedience and following", "Identify the signs of true love for the Messenger", "Analyze the relationship between loving the Prophet and loving Allah"] },
            { type: "text", content: "## A Pillar of the Soul\n\nIn Islamic theology, loving the Prophet (PBUH) is not a 'bonus' or an optional spiritual extra. it is a fundamental requirement of faith. This love is the fuel for obedience and the bridge to the love of Allah Himself." },
            { type: "concept", translation: "Mahabbah (Love): A spiritual state of the heart that involves extreme preference, admiration, and a desire to follow and defend the beloved.", arabic: "محبة النبي ﷺ" },
            { type: "quran", translation: "Say, [O Muhammad], 'If you should love Allah, then follow me, [so] Allah will love you and forgive you your sins.' (Surah Ali 'Imran 3:31)", arabic: "قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Obedience", description: "Doing what he commanded and avoiding what he forbade.", icon: "Check" },
                { title: "Veneration", description: "Respecting his status and sending Salawat.", icon: "Sunrise" },
                { title: "Defense", description: "Protecting his honor and his Sunnah.", icon: "Shield" },
                { title: "Longing", description: "Desiring to meet him and be in his company in Jannah.", icon: "Heart" }
            ]},
            { type: "text", content: "### The Hierarchy of Love\n\nThere is 'Natural Love' (for parents/children) and there is 'Spiritual Love'. The Prophet (PBUH) must occupy the highest space of our spiritual love. Even Umar ibn al-Khattab had to adjust his heart to realize that he must love the Prophet even more than himself." },
            { type: "hadith", translation: "Umar said: 'O Messenger of Allah, you are more beloved to me than everything except myself.' He said: 'No... until I am more beloved to you than yourself.' Umar said: 'Now, by Allah, you are more beloved to me than myself.' (Sahih al-Bukhari 6632)", arabic: "الآنَ يَا رَسُولَ اللَّهِ لأَنْتَ أَحَبُّ إِلَيَّ مِنْ نَفْسِي" },
            { type: "scholar", translation: "The one who truly loves the Prophet is the one who revives his Sunnah when it has been forgotten by people. (Al-Hasan al-Basri)", arabic: "من أحيا سنتي فقد أحبني" },
            { type: "infographic", layout: "process", items: [
                { title: "Knowledge", description: "Reading his Seerah (Biography).", icon: "BookOpen" },
                { title: "Salawat", description: "Sending blessings upon him frequently.", icon: "Volume2" },
                { title: "Following", description: "Applying his character and rituals.", icon: "UserCheck" }
            ]},
            { type: "text", content: "### Signs of True Love\n\nTrue love is not just a claim of the tongue. Its signs are: 1. Preferring his command over one's own desires. 2. Mentioning him frequently with respect. 3. Caring deeply about the state of his Ummah. 4. Following the Sunnah in private and in public." },
            { type: "reflection", translation: "If the Prophet Muhammad (PBUH) walked into my house right now, would I feel joy, or would I feel the need to hide part of my life?", arabic: "هل يسرني لقاؤه؟" },
            { type: "hadith", translation: "Whoever sends blessings upon me once, Allah will send blessings upon him ten times. (Sahih Muslim 408)", arabic: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "To love the Prophet is to love the Light. He is the window through which we see the attributes of Allah. The more you know him, the more you will love him." },
            { type: "quiz", question: "What is the legal status of loving the Prophet more than one's family and self?", options: ["It is optional", "It is a requirement for complete faith", "It is discouraged", "It is only for scholars"], correctIndex: 1, hint: "Review the Hadith of Sahih al-Bukhari 15." },
            { type: "quiz", question: "According to Surah Ali 'Imran 3:31, what is the proof/evidence of loving Allah?", options: ["Just saying it with the tongue", "Following the Messenger", "Reading only the Torah", "Meditation in a cave"], correctIndex: 1, hint: "Fattabi'ooni yuhbibkumul-Lah." },
            { type: "quiz", question: "What was Umar ibn al-Khattab's realization in his conversation with the Prophet?", options: ["He should love the Prophet as much as his parents", "He must love the Prophet even more than his own self", "He didn't need to change", "He should go on Hajj"], correctIndex: 1, hint: "Al-Aana ya Rasool Allah..." },
            { type: "quiz", question: "What is the reward for sending Salawat (blessings) upon the Prophet once?", options: ["1000 dollars", "Allah sends 10 blessings upon you", "You become a Prophet", "Nothing"], correctIndex: 1, hint: "Salla Allahu 'alayhi 'ashran." },
            { type: "quiz", question: "Which of the following is a 'branch of love' according to scholars?", options: ["Ignoring the Sunnah", "Reviving the Sunnah when it's forgotten", "Arguing with people", "Collecting old coins"], correctIndex: 1, hint: "True love results in action/imitation." },
            { type: "document", title: "The Theology of Love", description: "Exploring the concept of 'Mahabbah' in the Sunni tradition.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Summary of Salawat", description: "The benefits and legal rulings of sending blessings on the Prophet.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Module Assessment", // For Module 5 (Risalah)
        blocks: [
            { type: "callout", content: "To believe in the Messengers is to believe in the mercy of Allah, for He did not leave us to wander alone in the dark.", author: "Spiritual Reflection" },
            { type: "objectives", items: ["Demonstrate understanding of the necessity of Prophethood", "Identify the core attributes and miracles of the messengers", "Verify belief in the finality of Muhammad's prophethood", "Reflect on the obligation and manifestations of prophetic love"] },
            { type: "text", content: "## Synthesis of Prophethood\n\nThis assessment concludes your study of Risalah (Prophethood). You have learned why humanity needs divine guidance, the impeccable character of those chosen to deliver it, and the finality of the message brought by Muhammad (PBUH)." },
            { type: "infographic", layout: "grid", items: [
                { title: "Necessity", description: "Reason alone is not enough.", icon: "Key" },
                { title: "Attributes", description: "Trust, Truth, Wisdom, Delivery.", icon: "Shield" },
                { title: "Miracles", description: "Proof of divinity (Mu'jizah).", icon: "Zap" },
                { title: "Love", description: "The essence of following.", icon: "Heart" }
            ]},
            { type: "quran", translation: "Indeed, Allah and His angels send blessings upon the Prophet. O you who have believed, ask [Allah to confer] blessing upon him and ask [Allah to grant him] peace. (Surah Al-Ahzab 33:56)", arabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا" },
            { type: "text", content: "### Final Knowledge Verification\n\nPlease answer the following questions to verify your mastery of Module 5." },
            { type: "quiz", question: "What is the technical definition of 'Wahiy'?", options: ["Guessing", "Revelation/Communication from Allah to a human heart", "A type of perfume", "A political speech"], correctIndex: 1, hint: "A descending of divine speech." },
            { type: "quiz", question: "Which of these is one of the 'Ulul 'Azm' (Prophets of Firm Resolve)?", options: ["Prophet Dawud", "Prophet Ibrahim", "Prophet Yunus", "Prophet Yusuf"], correctIndex: 1, hint: "There are five of them." },
            { type: "quiz", question: "Which Miracle is special to Prophet Muhammad and remains accessible to everyone today?", options: ["The Night Journey", "The Quran", "The Splitting of the Moon", "Healing of the sick"], correctIndex: 1, hint: "It is the living miracle." },
            { type: "quiz", question: "What does the term 'Khatm an-Nubuwwah' signify?", options: ["The beginning of faith", "The Seal/Finality of Prophethood", "A type of prayer", "The birth of a prophet"], correctIndex: 1, hint: "The locked door of revelation." },
            { type: "quiz", question: "If a person claims to believe in Muhammad but denies the prophethood of Isa (Jesus), what is their status in Islamic creed?", options: ["They are still believers", "Their faith is incomplete/invalid because we must believe in all prophets", "They are saints", "It doesn't matter"], correctIndex: 1, hint: "La nufarriqu bayna ahadin min rusulih." },
            { type: "quiz", question: "What is 'Ismah'?", options: ["A type of charity", "Infallibility (protection from sin for prophets)", "A name of a companion", "A physical strength"], correctIndex: 1, hint: "Protection of the message." },
            { type: "quiz", question: "Which quality refers to the 'Trustworthiness' of a messenger?", options: ["Tableegh", "Amanah", "Fatanah", "Sidq"], correctIndex: 1, hint: "Derived from 'Ameen' (Trustworthy)." },
            { type: "quiz", question: "According to the Hadith Jibreel, belief in the Prophets is:", options: ["One of the pillars of Islam", "One of the pillars of Iman", "An optional act of Ihsan", "Not mentioned"], correctIndex: 1, hint: "It's the 4th article of faith listed." },
            { type: "conclusion", content: "You have verified your scholarship on Prophethood. Now we move to the final horizon: Module 6 - The Afterlife (Al-Akhirah)." },
            { type: "document", title: "Module 5 Summary", description: "Consolidated rules and definitions of Prophethood.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 5 (FINAL) TO 20+ BLOCKS ---');
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
