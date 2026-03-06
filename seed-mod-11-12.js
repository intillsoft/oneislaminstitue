const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    // === MODULE 11: ANGELS ===
    {
        title: "Creation of Angels",
        blocks: [
            { type: "callout", content: "The angels were created from light, the jinn were created from a smokeless flame of fire, and Adam was created from that which has been described to you.", author: "Prophetic Hadith (Sahih Muslim 2996)" },
            { type: "objectives", items: ["Understand the origin and nature of 'Malaikah' (Angels)", "Contrast the creation of Angels, Jinn, and Humans", "Analyze the absolute obedience of Angels to Allah", "Correct cultural misconceptions regarding angels possessing free will"] },
            { type: "text", content: "## Beings of Light\n\nUnlike human beings who possess free will and desires, angels were created purely to execute the commands of Allah. They do not eat, sleep, or procreate. Their existence is a continuous state of worship and administration of the universe." },
            { type: "concept", translation: "Malaikah: The Angels. Created from Nur (light), they possess immense power and absolute submission. They never disobey a command.", arabic: "الملائكة" },
            { type: "quran", translation: "They do not disobey Allah in what He commands them but do what they are commanded. (Surah At-Tahrim 66:6)", arabic: "لَّا يَعْصُونَ اللَّهَ مَا أَمَرَهُمْ وَيَفْعَلُونَ مَا يُؤْمَرُونَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Material", description: "Created from pure Nur (Light).", icon: "Sun" },
                { title: "Desire", description: "No physical desires (no eating, drinking, or lust).", icon: "Shield" },
                { title: "Free Will", description: "They possess intellect but lack the inclination to sin.", icon: "CheckCircle" },
                { title: "Magnitude", description: "Their numbers are known only to Allah.", icon: "Users" }
            ]},
            { type: "text", content: "### The Concept of Free Will\n\nA common misunderstanding, often imported from other traditions, is the idea of 'fallen angels' like Lucifer. In Islamic creed, Iblis (Satan) was a Jinn, not an angel, because angels are incapable of rebellion. They are the perfect, flawless instruments of Divine Will." },
            { type: "reflection", translation: "If beings of pure light, who have never committed a single sin, worship Allah continuously out of awe, how much more should a flawed human being seek His forgiveness?", arabic: "يسبحون الليل والنهار لا يفترون" },
            { type: "quiz", question: "From what were the Angels created?", options: ["Fire", "Clay", "Light (Nur)", "Water"], correctIndex: 2, hint: "Sahih Muslim 2996." },
            { type: "quiz", question: "Can an angel disobey Allah or commit a sin?", options: ["Yes, if they are tricked", "No, they do exactly as commanded in absolute submission", "Only minor sins", "Yes, they have total free will"], correctIndex: 1, hint: "La ya'soona Allah..." },
            { type: "quiz", question: "In Islamic theology, was Satan (Iblis) a 'fallen angel'?", options: ["Yes", "No, he was a Jinn created from fire", "He was a human", "He was an alien"], correctIndex: 1, hint: "Surah Al-Kahf 18:50 explicitly states he was of the Jinn." }
        ]
    },
    {
        title: "Roles of Angels",
        blocks: [
            { type: "callout", content: "By those [angels] who extract with violence, and [by] those who remove with ease, and [by] those who glide [as if] swimming...", author: "Surah An-Nazi'at 79:1-3" },
            { type: "objectives", items: ["Identify the major Archangels and their specific duties", "Understand the administrative functions angels hold over nature", "Analyze the presence of angels in the daily life of a believer"] },
            { type: "text", content: "## The Administrators of the Universe\n\nAngels are heavily involved in the logistics of the known universe. Everything from the falling of rain, the movement of clouds, the shaping of the fetus, to the extraction of the soul at death is orchestrated by angels acting entirely under the command of Allah." },
            { type: "infographic", layout: "grid", items: [
                { title: "Mika'il", description: "Responsible for rain, sustenance (Rizq), and vegetation.", icon: "Droplet" },
                { title: "Israfil", description: "Tasked with blowing the Trumpet to initiate the Resurrection.", icon: "Wind" },
                { title: "Malik", description: "The stoic guardian and keeper of Hellfire.", icon: "Flame" },
                { title: "Ridwan", description: "The guardian and gatekeeper of Paradise.", icon: "Star" }
            ]},
            { type: "quiz", question: "Which Angel is primarily responsible for distributing sustenance (Rizq) and rain?", options: ["Jibreel", "Israfil", "Izra'il", "Mika'il"], correctIndex: 3, hint: "The angel of provision." },
            { type: "quiz", question: "Who is the gatekeeper of Hellfire?", options: ["Ridwan", "Malik", "Munkar", "Nakir"], correctIndex: 1, hint: "Mentioned in Surah Zukhruf." },
            { type: "conclusion", content: "By understanding the roles of angels, a believer realizes they are never truly alone. They are surrounded by a vast ecosystem of light working in tandem with the physical world." }
        ]
    },
    {
        title: "Jibreel and Revelation",
        blocks: [
            { type: "text", content: "## The Holy Spirit (Ruh al-Qudus)\n\nJibreel (Gabriel) is the absolute greatest of all angels. He is the bridge between the Divine Realm and the Human Realm. Every prophet, from Adam to Muhammad (PBUH), received their revelation through the mediation of Jibreel." },
            { type: "quran", translation: "Say, 'Whoever is an enemy to Jibreel - it is [none but] he who has brought the Qur'an down upon your heart, [O Muhammad], by permission of Allah...' (Surah Al-Baqarah 2:97)", arabic: "مَن كَانَ عَدُوًّا لِّجِبْرِيلَ" },
            { type: "hadith", translation: "The Prophet saw Jibreel in his true form; he had six hundred wings, each wing filling the horizon. (Sahih al-Bukhari 3232)", arabic: "رَأَى جِبْرِيلَ لَهُ سِتُّمِائَةِ جَنَاحٍ" },
            { type: "quiz", question: "What is another Quranic title for Jibreel?", options: ["The Angel of Death", "Ruh al-Qudus (The Holy Spirit/Spirit of Holiness)", "The Trumpet Blower", "The Keeper"], correctIndex: 1, hint: "Mentioned regarding Isa (Jesus) as well." },
            { type: "quiz", question: "How many wings did Jibreel have when the Prophet (PBUH) saw his true angelic form?", options: ["Two", "Six", "Sixty", "Six Hundred"], correctIndex: 3, hint: "Sahih Bukhari 3232." }
        ]
    },
    // Adding concise but elite versions for the rest to keep it robust and scalable
    {
        title: "Recording Deeds",
        blocks: [
            { type: "quran", translation: "Man does not utter any word except that with him is an observer prepared [to record]. (Surah Qaf 50:18)", arabic: "مَّا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ" },
            { type: "concept", translation: "Kiraman Katibin: The honorable, recording angels stationed on the right and left shoulders of every human.", arabic: "كراماً كاتبين" },
            { type: "text", content: "Every breath, text message, whisper, and thought acted upon is permanently recorded by the angels on the shoulders. The angel on the right records good deeds immediately. The angel on the left waits hours before recording a sin, hoping the person repents first." },
            { type: "quiz", question: "Who are the 'Kiraman Katibin'?", options: ["The angels of the grave", "The honorable recording angels on the shoulders", "The gatekeepers of Jannah", "The kings of the Jinn"], correctIndex: 1, hint: "Mentioned in Surah Infitar." }
        ]
    },
    {
        title: "Angels and Daily Life",
        blocks: [
            { type: "text", content: "Angels descend upon gatherings of knowledge (Halaqat), protect believers during sleep, and say 'Ameen' to the prayers made for absent friends. Their presence relies on purity; they avoid places containing impurities, dogs, or statues." },
            { type: "hadith", translation: "No people gather in a house of Allah, reciting the Book of Allah and studying it, except that tranquility descends upon them, mercy covers them, and the angels surround them. (Sahih Muslim 2699)", arabic: "وَحَفَّتْهُمُ الْمَلَائِكَةُ" },
            { type: "quiz", question: "What causes angels to surround a gathering in this world?", options: ["Loud music", "Studying the Book of Allah / Gatherings of remembrance", "Eating food", "Sleeping"], correctIndex: 1, hint: "Haffathum al-Malaikah." }
        ]
    },
    {
        title: "Belief Impact on Behavior",
        blocks: [
            { type: "text", content: "Belief in angels instills a profound sense of 'Ihsan' (Excellence). When you know beings of light are watching, recording, and supporting you, sins performed in 'secret' lose their illusion of secrecy. It brings immense comfort during loneliness, knowing a massive unseen army supports the truth." },
            { type: "reflection", translation: "How would my browsing history change if my screen was physically being watched by two high-ranking officials? They are.", arabic: "يعلمون ما تفعلون" },
            { type: "quiz", question: "How does belief in recording angels impact behavior?", options: ["It causes paranoia", "It instills 'Ihsan' (excellence/mindfulness) and prevents 'secret' sins", "It makes people arrogant", "It has no impact"], correctIndex: 1, hint: "A consciousness of observation." }
        ]
    },
    {
        title: "Module Assessment",
        blocks: [
            { type: "text", content: "Final week 3 assessment covering the unseen realms of beings of light." },
            { type: "quiz", question: "Were angels created from fire?", options: ["Yes", "No, they were created from Light (Nur)"], correctIndex: 1, hint: "Jinn are from fire." },
            { type: "quiz", question: "Who blows the Trumpet of Resurrection?", options: ["Jibreel", "Malik", "Israfil", "Mika'il"], correctIndex: 2, hint: "The blower of the Sur." }
        ]
    },
    
    // === MODULE 12: DIVINE DECREE (QADR) ===
    {
        title: "Meaning of Qadr",
        blocks: [
            { type: "quran", translation: "Indeed, all things We created with predestination. (Surah Al-Qamar 54:49)", arabic: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ" },
            { type: "text", content: "## The Sixth Pillar of Faith\n\nQadr is the absolute knowledge of Allah regarding what was, what is, what will be, and what could have been if it had been. Everything is written and measured. Understanding Qadr is the ultimate cure for anxiety." },
            { type: "concept", translation: "Qadr / Qadaa': Predestination and Divine Decree. The belief that Allah's will and power encompass all things.", arabic: "القضاء والقدر" },
            { type: "quiz", question: "What is 'Qadr'?", options: ["A type of prayer", "Divine Decree / Predestination", "Charity", "Fasting"], correctIndex: 1, hint: "The 6th pillar of Iman." }
        ]
    },
    {
        title: "Knowledge of Allah",
        blocks: [
            { type: "text", content: "The first level of Qadr is absolute Knowledge (Al-'Ilm). Allah operates outside of time. Therefore, He knows your choices before you make them. However, His 'knowing' does not force you to make the choice; it merely perfectly reflects what your independent choice will be." },
            { type: "reflection", translation: "If a teacher knows a student will fail because they never study, did the teacher force the student to fail? No. The teacher's knowledge is a result of the student's reality.", arabic: "وَاللَّهُ يَعْلَمُ" },
            { type: "quiz", question: "Does Allah's foreknowledge of our actions mean He 'forces' us to do them?", options: ["Yes", "No, His knowledge reflects our free choices; knowing is not forcing", "Maybe", "Only for bad deeds"], correctIndex: 1, hint: "The teacher analogy." }
        ]
    },
    {
        title: "Writing of Decree",
        blocks: [
            { type: "hadith", translation: "The first thing Allah created was the Pen. He commanded it to write... everything that will be until the Day of Resurrection. (Sunan Abi Dawud 4700)", arabic: "إِنَّ أَوَّلَ مَا خَلَقَ اللَّهُ الْقَلَمَ" },
            { type: "text", content: "The second level of Qadr is The Writing (Al-Kitabah). Fifty thousand years before the creation of the heavens and earth, Allah commanded the Pen to write the destiny of all things in 'Al-Lawh Al-Mahfuz' (The Preserved Tablet)." },
            { type: "quiz", question: "What was the very first thing Allah created according to the Hadith in Abu Dawud?", options: ["The stars", "The angels", "The Pen (Al-Qalam)", "The earth"], correctIndex: 2, hint: "It recorded the decree." }
        ]
    },
    {
        title: "Will of Allah",
        blocks: [
            { type: "text", content: "The third level of Qadr is The Will (Al-Mashi'ah). Nothing occurs in the universe, good or bad, without the permission of Allah. A leaf does not fall without His will. However, there is a difference between what He 'wills' (allows to happen) and what He 'loves'. He allowed disbelief to exist to test us, but He does not love disbelief." },
            { type: "quiz", question: "Is there a difference between what Allah 'wills' (permits to happen) and what Allah 'loves'?", options: ["No, they are identical", "Yes, He wills/allows tests and sins to occur (Mashi'ah), but He does not love sins (Mahabbah)", "Nobody knows", "He loves everything that happens"], correctIndex: 1, hint: "A doctor wills a painful surgery, but doesn't love the pain itself." }
        ]
    },
    {
        title: "Creation of Actions",
        blocks: [
            { type: "quran", translation: "While Allah created you and that which you do. (Surah As-Saffat 37:96)", arabic: "وَاللَّهُ خَلَقَكُمْ وَمَا تَعْمَلُونَ" },
            { type: "text", content: "The fourth level of Qadr is The Creation (Al-Khalq). You make the intention (Kasb/Acquisition), and Allah creates the physical action enabling you to carry it out. You are judged on the intention and the effort, while the execution remains firmly in Allah's power." },
            { type: "quiz", question: "Who creates the physical mechanism of human actions?", options: ["Humans create it independently", "Nature creates it", "Allah creates the action, the human merely makes the intention/choice (Kasb)", "Angels do it"], correctIndex: 2, hint: "Wallahu khalaqakum wa ma ta'maloon." }
        ]
    },
    {
        title: "Free Will vs Destiny",
        blocks: [
            { type: "text", content: "The ultimate balance: Caliph Umar was fleeing from a plague in Syria. Abu Ubaidah asked: 'Are you fleeing from the Decree of Allah?' Umar replied: 'Yes, I am fleeing from the Decree of Allah... to the Decree of Allah.' We exert our maximum effort to make good choices, knowing the end result is already managed by the Most Merciful." },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "quiz", question: "What was Umar's response when asked if he was fleeing from the Decree of Allah?", options: ["'I am not fleeing'", "'Yes, I am fleeing from the Decree of Allah to the Decree of Allah'", "'It is not a decree'", "'I forgot'"], correctIndex: 1, hint: "We use our free will within the parameters of His decree." }
        ]
    },
    {
        title: "Module Assessment",
        blocks: [
            { type: "text", content: "Final check for Qadr. A deep breath. Releasing control to the One who controls all." },
            { type: "quiz", question: "What is the Preserved Tablet called in Arabic?", options: ["Al-Qalam", "Al-Lawh Al-Mahfuz", "Al-Kitab", "Al-Mizan"], correctIndex: 1, hint: "The protected board." },
            { type: "quiz", question: "Which of these is NOT one of the 4 levels of Qadr?", options: ["Knowledge (Ilm)", "Writing (Kitabah)", "Will (Mashi'ah)", "Reincarnation (Tanasukh)"], correctIndex: 3, hint: "Tanasukh is not Islamic." }
        ]
    }
];

async function seedLessons() {
    let successCount = 0;
    
    const tryUpdate = async (item, retries = 3) => {
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

        // Use precise matching
        let cleanTitle = item.title.replace(' ﷺ', '').trim();
        
        try {
            const { error, data } = await supabase.from('course_lessons')
                .update({ content_blocks: finalBlocks })
                .eq('course_id', COURSE_ID)
                .ilike('title', `%${cleanTitle}%`)
                .select();
                
            if (error) throw error;
            if (data && data.length > 0) {
                console.log(`[OK] ${cleanTitle} (${finalBlocks.length} blks)`);
                successCount++;
                return true;
            } else {
                console.log(`[WARN] ${cleanTitle} - Title not found in DB`);
                return true; // Don't retry if it just doesn't match
            }
        } catch (e) {
            console.log(`[ERR] ${cleanTitle} (Attempts left: ${retries - 1}): ${e.message}`);
            if (retries > 1) {
                await new Promise(r => setTimeout(r, 2000));
                return tryUpdate(item, retries - 1);
            }
            return false;
        }
    }

    console.log('--- SEEDING MODULE 11 & 12 (Angels & Qadr) Robustly ---');
    for (const item of LESSON_DATA) {
        await tryUpdate(item);
    }
    console.log(`\nFinished Process. Successfully updated ${successCount}/${LESSON_DATA.length} lessons.`);
}

seedLessons();
