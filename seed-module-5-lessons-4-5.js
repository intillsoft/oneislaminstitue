const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Finality of Muhammad's Prophethood",
        blocks: [
            { type: "callout", content: "The position of Muhammad (PBUH) among the Prophets is like the final brick in a beautiful palace. Without it, the palace is incomplete; with it, the structure is sealed forever.", author: "Prophetic Metaphor (Sahih al-Bukhari 3535)" },
            { type: "objectives", items: ["Understand the concept of 'Khatm an-Nubuwwah' (Seal of Prophethood)", "Analyze why a final prophet was necessary for the perfection of religion", "Identify the textual proofs from Quran and Sunnah for the finality of Muhammad", "Differentiate between the message of previous prophets (territorial/temporary) and Muhammad (universal/eternal)"] },
            { type: "text", content: "## The Final Seal\n\nMuhammad (PBUH) is not just 'one of' the prophets; he is the final chapter of divine revelation. To believe in him is to believe that the gates of Prophethood are now closed, and that the guidance he brought is sufficient for humanity until the end of time." },
            { type: "concept", translation: "Khatm an-Nubuwwah (Seal of Prophethood): The theological boundary stating that no new Prophet or Messenger will come after Muhammad (PBUH).", arabic: "ختم النبوة" },
            { type: "quran", translation: "Muhammad is not the father of [any] one of your men, but [he is] the Messenger of Allah and Seal of the prophets. (Surah Al-Ahzab 33:40)", arabic: "مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Universal Message", description: "Sent to all mankind, not just a specific tribe.", icon: "Globe" },
                { title: "Preserved Text", description: "The Quran is divinely protected from changes.", icon: "Shield" },
                { title: "Complete Law", description: "The deen was perfected on the day of Arafah.", icon: "CheckCircle" },
                { title: "Final Seal", description: "No prophet after him until the Hour.", icon: "Lock" }
            ]},
            { type: "text", content: "### The Parable of the Final Brick\n\nThe Prophet (PBUH) described the chain of prophets as a building. People walked around it and admired its beauty, but noticed one missing brick. He said, 'I am that brick, and I am the seal of the prophets.'" },
            { type: "hadith", translation: "I am the last of the prophets and there is no prophet after me. (Sahih Muslim 523 / Sunan at-Tirmidhi 2219)", arabic: "أَنَا خَاتَمُ النَّبِيِّينَ لاَ نَبِيَّ بَعْدِي" },
            { type: "scholar", translation: "Claiming prophethood after Muhammad (PBUH) is a form of disbelief (Kufr) because it denies the explicit words of the Quran. (Consensus of the Ummah)", arabic: "إجماع الأمة على ختم النبوة" },
            { type: "quran", translation: "This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion. (Surah Al-Ma'idah 5:3)", arabic: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُونَ نِعْمَتِي" },
            { type: "infographic", layout: "process", items: [
                { title: "Ancient Guidance", description: "Local messages for specific tribes.", icon: "Map" },
                { title: "The Transition", description: "Prophethood becomes universal with Muhammad.", icon: "RefreshCw" },
                { title: "The Seal", description: "The message is perfected and locked.", icon: "Lock" }
            ]},
            { type: "text", content: "### Implications of the Seal\n\nBecause the message is final, it must be universal. It must contain principles that apply to every culture and every century. This is why the Prophet was given 'Jawami' al-Kalim' (Comprehensive Speech)—few words with vast meanings." },
            { type: "reflection", translation: "If I am part of the final Ummah, I possess the final distilled truth of all humanity. Do I live like a person who holds the ultimate answer?", arabic: "كنتم خير أمة أخرجت للناس" },
            { type: "hadith", translation: "My position in relation to the prophets who came before me is that of a man who built a house and did a great job and decorated it, but he left the space of one brick... I am that brick. (Sahih al-Bukhari 3535)", arabic: "فَأَنَا اللَّبِنَةُ، وَأَنَا خَاتَمُ النَّبِيِّينَ" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "To follow Muhammad is to follow the culmination of all divine wisdom. The search for 'new' prophets is born of a failure to appreciate the perfection of the final one." },
            { type: "quiz", question: "Which term refers to the 'Seal of Prophethood'?", options: ["Wahiy", "Khatm an-Nubuwwah", "Tawheed", "Risalah"], correctIndex: 1, hint: "Finality or sealing." },
            { type: "quiz", question: "In Surah Al-Ahzab 33:40, what is Muhammad (PBUH) explicitly called?", options: ["The first Prophet", "The father of the believers", "The Messenger of Allah and Seal of the prophets", "An angel"], correctIndex: 2, hint: "Khataman-Nabiyyeen." },
            { type: "quiz", question: "According to Surah Al-Ma'idah 5:3, when was the religion 'perfected'?", options: ["During the life of Musa", "At the birth of Jesus", "On the day of the Prophet's final pilgrimage (Arafah)", "It is still being perfected"], correctIndex: 2, hint: "Al-yawma akmaltu lakum deenakum." },
            { type: "quiz", question: "If someone claims to be a new prophet today, what is the stance of Islamic theology?", options: ["We should listen and check their ideas", "They are considered a 'Dajjal' (Liar) and are outside Islam", "It's optional to believe them", "We wait for a sign"], correctIndex: 1, hint: "Finality is a core pillar of the creed." },
            { type: "quiz", question: "What did the Prophet compare himself to in the house construction parable?", options: ["The foundation", "The missing final brick", "The architect", "The door"], correctIndex: 1, hint: "Ana al-labinah." },
            { type: "document", title: "The Finality of Guidance", description: "Scholarly refutation of modern claimants to prophethood.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Universal Prophet", description: "How the life of Muhammad (PBUH) serves as a guide for all cultures.", url: "https://yaqeeninstitute.org/", platform: "Islamic History Series" }
        ]
    },
    {
        title: "Belief in Other Prophets",
        blocks: [
            { type: "callout", content: "We do not make distinction between any of His messengers. To believe in Muhammad is to believe in the brotherhood of all the prophets.", author: "Quranic Principle (Surah Al-Baqarah 2:285)" },
            { type: "objectives", items: ["Understand the obligation of believing in all previous prophets", "Identify the prophets mentioned in the Quran by name", "Learn about the concept of 'Ulul 'Azm' (The Prophets of Resolve)", "Analyze the relationship between the previous scriptures and the Quran"] },
            { type: "text", content: "## An Unbroken Chain\n\nA Muslim's faith is not complete until they believe in all the prophets of Allah. Denying one prophet is akin to denying all of them, for they all emerged from the same divine source with the same core purpose." },
            { type: "quran", translation: "The Messenger has believed in what was revealed to him from his Lord... all of them have believed in Allah and His angels and His books and His messengers, [saying], 'We make no distinction between any of His messengers.' (Surah Al-Baqarah 2:285)", arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ... لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ" },
            { type: "concept", translation: "Ulul 'Azm (Prophets of Firm Resolve): The five greatest messengers who bore the most severe trials: Nuh, Ibrahim, Musa, 'Isa, and Muhammad (Peace be upon them).", arabic: "أولو العزم من الرسل" },
            { type: "infographic", layout: "grid", items: [
                { title: "Nuh (Noah)", description: "The Prophet of patience and the Flood.", icon: "Activity" },
                { title: "Ibrahim (Abraham)", description: "The Father of the Prophets and Friend of Allah.", icon: "Heart" },
                { title: "Musa (Moses)", description: "The one to whom Allah spoke directly.", icon: "Zap" },
                { title: "Isa (Jesus)", description: "The Word of Allah and the miraculous spirit.", icon: "Sunrise" }
            ]},
            { type: "text", content: "### The Number of Prophets\n\nThe Quran mentions 25 prophets by name, but we know there were many more. According to a Hadith, there were 124,000 prophets sent to every nation on earth. We believe in the 25 explicitly and in the rest generally." },
            { type: "hadith", translation: "I asked 'O Messenger of Allah, how many prophets were there?' He said: '124,000', and messengers among them were '315, a large group.' (Musnad Ahmad / Sahih Ibn Hibban, Sahih)", arabic: "مِائَةُ أَلْفٍ وَأَرْبَعَةٌ وَعِشْرُونَ أَلْفًا" },
            { type: "scholar", translation: "Whoever removes Adam, Noah, or any established Prophet from the status of Prophethood is a disbeliever. (Imam An-Nawawi)", arabic: "الإيمان بجميع الرسل ركن" },
            { type: "infographic", layout: "process", items: [
                { title: "Adam", description: "The first prophet and father of humanity.", icon: "User" },
                { title: "The Chain", description: "Prophets for every nation (Israelites, Arabs, others).", icon: "Link" },
                { title: "Muhammad", description: "The final seal for all nations.", icon: "Star" }
            ]},
            { type: "text", content: "### The Relationship of Scriptures\n\nWe believe in the Torah given to Musa, the Psalms (Zabur) of Daud, and the Gospel (Injeel) of 'Isa. However, we believe that the current versions of these books have been altered by man, and the Quran was sent as a 'Muhaymin' (Criterion/Guardian) to confirm what is true in them and correct what was changed." },
            { type: "quran", translation: "And We have revealed to you, [O Muhammad], the Book in truth, confirming that which preceded it of the Scripture and as a criterion over it. (Surah Al-Ma'idah 5:48)", arabic: "وَأَنزَلْنَا إِلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ الْكِتَابِ وَمُهَيْمِنًا عَلَيْهِ" },
            { type: "reflection", translation: "When I see a fellow human from another culture, do I remember that Allah likely sent a guidance to their ancestors through a prophet I might not even know the name of?", arabic: "وإن من أمة إلا خلا فيها نذير" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "Islam is the ultimate inclusive faith in its ancestry. It honors the spiritual history of all mankind and unites them under the banner of the final revelation." },
            { type: "quiz", question: "How many prophets are mentioned by name in the Quran?", options: ["5", "12", "25", "99"], correctIndex: 2, hint: "A quarter of a hundred." },
            { type: "quiz", question: "Who are the 'Ulul 'Azm'?", options: ["The first 5 prophets", "The 5 Prophets of Firm Resolve (Nuh, Ibrahim, Musa, Isa, Muhammad)", "The last 10 prophets", "The prophets sent to Mecca"], correctIndex: 1, hint: "Prophets who faced the greatest hardships." },
            { type: "quiz", question: "According to Surah Al-Baqarah 2:285, what is the believer's stance toward the messengers?", options: ["Some are better than others so we only follow the best", "We make no distinction between any of His messengers in our belief", "We only believe in those mentioned in our language", "We only believe in Muhammad"], correctIndex: 1, hint: "La nufarriqu bayna ahadin min rusulih." },
            { type: "quiz", question: "What is the status of the Quran in relation to previous scriptures (Torah, Injeel)?", options: ["A complete replacement with no connection", "A confirmation and a 'Criterion' (Muhaymin) over them", "A translation of them", "It is unrelated to them"], correctIndex: 1, hint: "Musaddiqan lima bayna yadayhi." },
            { type: "quiz", question: "According to the Hadith, approximately how many prophets were sent in total throughout history?", options: ["313", "1,000", "124,000", "Uncountable"], correctIndex: 2, hint: "Mi'atu alf wa arba'un wa 'ishruna alf." },
            { type: "document", title: "The Brotherhood of Prophets", description: "How Islam views Jesus, Moses, and Abraham compared to other religions.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Prophets and Scriptures", description: "Academic breakdown of the lost scriptures and the preservation of the Quran.", url: "https://kalamullah.com/", platform: "Classical Archives" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 5 (FINISH) TO 20+ BLOCKS ---');
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
