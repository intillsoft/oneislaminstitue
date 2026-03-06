const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Definition & Need for Prophethood",
        blocks: [
            { type: "callout", content: "Mankind is like a sick person who knows they are sick but does not know the medicine. The Prophets are the divine physicians who bring the prescription for the soul.", author: "Imam Al-Ghazali (Al-Munqidh min al-Dalal)" },
            { type: "objectives", items: ["Differentiate between a Nabi (Prophet) and a Rasul (Messenger)", "Analyze why human reason alone is insufficient to guide society", "Understand the concept of 'Wahiy' (Revelation)", "Identify the primary message shared by all prophets: Tawheed"] },
            { type: "text", content: "## Why Do We Need Prophets?\n\nWhile the human mind can deduce that there is a Creator (Tawheed ar-Rububiyyah), it cannot know *how* to worship that Creator or what He loves and hates. Without revelation, morality would be a matter of opinion, and the purpose of life would remain a mystery." },
            { type: "concept", translation: "Nabi vs Rasul: A Nabi is one given revelation for himself; a Rasul is a Nabi sent with a specific law/message to a people.", arabic: "النبي والرسول" },
            { type: "quran", translation: "And We sent not before you any messenger except that We revealed to him that, 'There is no deity except Me, so worship Me.' (Surah Al-Anbiya 21:25)", arabic: "وَمَا أَرْسَلْنَا مِن قَبْلِكَ مِن رَّسُولٍ إِلَّا نُوحِي إِلَيْهِ أَنَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدُونِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Wahiy (Revelation)", description: "The descending of divine speech to a human heart.", icon: "Download" },
                { title: "Moral Law", description: "Providing a clear standard of right and wrong.", icon: "Gavel" },
                { title: "The Afterlife", description: "Informing us of what happens after death.", icon: "Sunrise" },
                { title: "Divine Mercy", description: "Sending a guide is the ultimate act of kindness.", icon: "Heart" }
            ]},
            { type: "text", content: "### The Mechanism of Wahiy\n\nProphethood is not an 'achievement' one can work for; it is a 'selection' by Allah. The revelation comes through the Angel Jibreel, or through dreams, or direct speech. It is a weight that settles on the heart, clear and unmistakable." },
            { type: "hadith", translation: "Prophethood has gone, but there remain 'Al-Mubashshirat' (Glad tidings). They said: What are they? He said: Good dreams. (Sahih al-Bukhari 6990)", arabic: "لَمْ يَبْقَ مِنَ النُّبُوَّةِ إِلاَّ الْمُبَشِّرَاتُ" },
            { type: "scholar", translation: "If people were left to their own devices, they would fall into darkness. The Prophets are the sun that illuminates the path of the heart. (Ibn al-Qayyim)", arabic: "الرسل وسائط بين الله وبين خلقه" },
            { type: "infographic", layout: "process", items: [
                { title: "Mankind in Darkness", description: "Lost in confusion and conflicting desires.", icon: "UserX" },
                { title: "Divine Selection", description: "Allah chooses an individual of perfect character.", icon: "Star" },
                { title: "The Message", description: "Revelation is delivered for the guidance of all.", icon: "MessageCircle" }
            ]},
            { type: "text", content: "### The Unity of the Message\n\nFrom Adam to Muhammad (peace be upon them all), the core message has never changed: 'Worship Allah alone and avoid false gods.' Only the specific legal details (Shariat) changed to suit different times and places." },
            { type: "reflection", translation: "If I was lost in a vast desert at night, how much would I value a guide with a light? This life is that desert, and the Prophets are the light.", arabic: "رسلا مبشرين ومنذرين" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Prophethood is the bridge between the finite and the infinite. It is through these human examples that we learn how to walk the path of spiritual success." },
            { type: "quiz", question: "What is the primary difference between a 'Nabi' and a 'Rasul'?", options: ["A Rasul is higher and comes with a specific new law/message", "A Nabi is only for the family", "A Rasul is only mentioned in the Old Testament", "There is no difference"], correctIndex: 0, hint: "Every Rasul is a Nabi, but not every Nabi is a Rasul." },
            { type: "quiz", question: "According to Surah Al-Anbiya 21:25, what was the core message given to EVERY messenger?", options: ["The rules of fasting", "There is no deity except Me, so worship Me", "How to build a Masjid", "History lessons"], correctIndex: 1, hint: "Lailaha illa Ana fa'budoon." },
            { type: "quiz", question: "Is Prophethood something a person can attain by studying hard or meditating long?", options: ["Yes, with enough effort", "No, it is a divine gift and selection by Allah", "Only if they are from a specific family", "Only in ancient times"], correctIndex: 1, hint: "It is 'Ikhtiyar' (Divine Selection)." },
            { type: "quiz", question: "Which Angel is primarily responsible for delivering 'Wahiy' (Revelation)?", options: ["Mikail", "Israfil", "Jibreel", "Malik"], correctIndex: 2, hint: "The Holy Spirit (Ruh al-Qudus)." },
            { type: "quiz", question: "What did Al-Ghazali compare the Prophets to in the opening quote?", options: ["Kings", "Physicians (Doctors)", "Scientists", "Architects"], correctIndex: 1, hint: "They bring medicine for the soul." },
            { type: "document", title: "The Need for Revelation", description: "A philosophical defense of why human reason requires the aid of Prophethood.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Prophets in the Quran", description: "Summary of the 25 prophets mentioned by name in the Quran.", url: "https://quran.com/", platform: "Quranic Resources" }
        ]
    },
    {
        title: "Attributes of Messengers",
        blocks: [
            { type: "callout", content: "The Prophets are the most perfect of human beings in their knowledge, their actions, and their character. They are the golden link between humanity and the Divine.", author: "Ibn Taymiyyah (Al-Nubuwat)" },
            { type: "objectives", items: ["Identify the four essential qualities of all prophets: Sincerity, Truthfulness, Trustworthiness, and Conveyance", "Understand the concept of 'Ismah' (Infallibility) in delivering the message", "Analyze the 'Humanity' of prophets versus 'Divinity'", "Examine the wisdom behind Prophets being chosen from among their own people"] },
            { type: "text", content: "## Human but Perfected\n\nThe Prophets are not divine beings or demigods. They are humans who eat, drink, marry, and die. However, they are perfected humans, protected by Allah from major sins and mistakes that would compromise the delivery of the message." },
            { type: "concept", translation: "Ismah (Infallibility): The protection granted by Allah to the Prophets from falling into sin or error in anything related to the religion.", arabic: "العصمة" },
            { type: "quran", translation: "Say, 'I am only a man like you, to whom has been revealed that your god is one God.' (Surah Al-Kahf 18:110)", arabic: "قُلْ إِنَّمَا أَنَا بَشَرٌ مِّثْلُكُمْ يُوحَىٰ إِلَيَّ أَنَّمَا إِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Sidq (Truthfulness)", description: "They never lie, even before their call to prophethood.", icon: "Check" },
                { title: "Amanah (Trust)", description: "They are the most trustworthy keepers of the message.", icon: "Shield" },
                { title: "Tabligh (Conveyance)", description: "They deliver every word without hiding any part.", icon: "MessageCircle" },
                { title: "Fatanah (Wisdom)", description: "They possess high intellect to guide and debate.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Four Pillars of Prophetic Character\n\nScholars have historically summarized the qualities of messengers into four. 1. Sidq: absolute truthfulness. 2. Amanah: absolute integrity. 3. Tabligh: courageous delivery. 4. Fatanah: sharp intelligence. These four ensure that the bridge between Allah and humanity is never compromised." },
            { type: "hadith", translation: "The Prophets are brothers of different mothers; their religion is one and their laws are different. (Sahih al-Bukhari 3443 / Muslim 2365)", arabic: "الأَنْبِيَاءُ إِخْوَةٌ لِعَلاَّتٍ دِينُهُمْ وَاحِدٌ" },
            { type: "scholar", translation: "A Prophet must be free from any physical or character flaw that would cause people to flee from him. (Scholars of Creed)", arabic: "المنزهون عن كل منقصة" },
            { type: "infographic", layout: "process", items: [
                { title: "Human Limits", description: "They sleep, eat, and feel pain.", icon: "User" },
                { title: "Divine Guard", description: "They are protected from sins.", icon: "Shield" },
                { title: "Perfect Sample", description: "A living example of the Quran.", icon: "Star" }
            ]},
            { type: "text", content: "### Infallibility (Ismah)\n\nIsmah doesn't mean they never made any minor 'judgment errors' in worldly affairs, but it means they are protected from anything that would discredit their status or the accuracy of the revelation. This is necessary because they are the 'Ulwa' (Patterns) for all of mankind." },
            { type: "reflection", translation: "If my role model is perfect, my progress can be infinite. If my role model is flawed, I will settle for mediocrity. The Prophets provide the perfect ceiling.", arabic: "لقد كان لكم في رسول الله أسوة حسنة" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "The Messengers were chosen for their character first. They were the most truthful of their people even before the first word of revelation descended upon them." },
            { type: "quiz", question: "What does 'Tabligh' mean in the context of prophetic attributes?", options: ["Strength", "Conveyance (delivering the message perfectly)", "Fasting", "Traveling"], correctIndex: 1, hint: "Delivering the trust to the people." },
            { type: "quiz", question: "According to Surah Al-Kahf 18:110, what must a Prophet emphasize to the people regarding his nature?", options: ["I am a god", "I am only a man like you, to whom has been revealed...", "I am an angel", "I have no needs"], correctIndex: 1, hint: "Qul innama ana basharun mithlukum..." },
            { type: "quiz", question: "What is the term for the 'Protection' Allah provides Prophets from sin?", options: ["Ijtihad", "Ismah", "Ihsan", "Iman"], correctIndex: 1, hint: "It means infallibility or preservation." },
            { type: "quiz", question: "Were all Prophets of the same 'brotherhood' of creed according to the Hadith?", options: ["No, they all had different religions", "Yes, they are brothers of different mothers; their religion is one", "Only the last three", "They were competitors"], correctIndex: 1, hint: "Ad-deenu wahidun wa shara'i'uhum shatta." },
            { type: "quiz", question: "Which attribute refers to the 'Intelligence and Wisdom' of the messengers?", options: ["Sidq", "Amanah", "Fatanah", "Tabligh"], correctIndex: 2, hint: "Derived from 'Fatin' (Smart/Sharp)." },
            { type: "document", title: "Infallibility of the Prophets", description: "A theological analysis of 'Ismah' and the nature of prophetic mistakes.", url: "https://kalamullah.com/", platform: "Classical Archives" },
            { type: "document", title: "Character of the Messenger", description: "Exploring the 'Sidq' (Truthfulness) of Muhammad (PBUH) before revelation.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Miracles of the Prophets",
        blocks: [
            { type: "callout", content: "A miracle is a sign that challenges the laws of nature to prove that the Message is not coming from the Messenger, but from the One who created nature itself.", author: "Classical Definition of Mu'jizah" },
            { type: "objectives", items: ["Define 'Mu'jizah' (Miracle) and differentiate it from magic or coincident", "Analyze why miracles were specific to the mastery of each prophet's people", "Understand the 'Eternal Miracle' of the Quran", "Learn about the miracles of Moses, Jesus, and Muhammad (Peace be upon them)"] },
            { type: "text", content: "## Signs for the Intellect\n\nWhen a man appears and claims to speak for the Creator of the Universe, the people naturally demand proof. Allah provided this proof through 'Mu'jizat'—events that break the normal patterns of cause and effect (Kharq al-'Adah) to validate the Prophet's sincerity." },
            { type: "concept", translation: "Mu'jizah (Miracle): An extraordinary event that defies the laws of nature, brought by a Prophet as a challenge and proof of his truthfulness.", arabic: "المعجزة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Prophet Musa", description: "Staff turning into a serpent (Mastery over magic).", icon: "Zap" },
                { title: "Prophet 'Isa", description: "Healing the blind and raising the dead (Mastery over medicine).", icon: "Heart" },
                { title: "Prophet Muhammad", description: "The Quran (Mastery over language).", icon: "Book" },
                { title: "Splitting of the Moon", description: "A celestial sign witnessed by the Quraysh.", icon: "Moon" }
            ]},
            { type: "quran", translation: "And We have certainly sent down to you verses [which are] clear signs, and no one denies them except the defiantly disobedient. (Surah Al-Baqarah 2:99)", arabic: "وَلَقَدْ أَنزَلْنَا إِلَيْكَ آيَاتٍ بَيِّنَاتٍ" },
            { type: "text", content: "### Tailored to the Audience\n\nAllah in His wisdom sent miracles that matched the peak of what a people excelled in. In Egypt, where magic was a science, Musa's staff defeated all magic. In the time of Jesus, where medicine was respected, he healed the incurable. For the Arabs, who were masters of poetry, the Quran was the ultimate linguistic defeat." },
            { type: "scholar", translation: "The greatest miracle of Prophet Muhammad is the Quran, because unlike other miracles that pass with time, the Quran remains for every generation to witness. (Ibn Khaldun)", arabic: "المعجزة الخالدة" },
            { type: "hadith", translation: "Every Prophet was given miracles because of which people believed, but what I have been given is Divine Inspiration (the Quran)... so I hope that I will have the most followers on the Day of Resurrection. (Sahih al-Bukhari 4981)", arabic: "إِنَّمَا كَانَ الَّذِي أُوتِيتُهُ وَحْيًا أَوْحَاهُ اللَّهُ إِلَيَّ" },
            { type: "infographic", layout: "process", items: [
                { title: "Kharq al-'Adah", description: "Breaking the laws of nature.", icon: "Activity" },
                { title: "At-Tahaddi", description: "Challenging the disbelievers to match it.", icon: "Command" },
                { title: "Failure", description: "The human inability to replicate the sign.", icon: "Shield" }
            ]},
            { type: "text", content: "### Beyond the Physical\n\nWhile we believe in the splitting of the moon and water flowing from the Prophet's fingers, the primary miracle of Islam is intellectual: the Quran. It challenges the mind rather than just the eyes. It is the miracle that lives in your home." },
            { type: "reflection", translation: "If a staff turning into a snake would make me believe, why does the Quran—the greatest miracle—often stay closed on my shelf?", arabic: "أفلا يتدبرون القرآن" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "Miracles are the proof of the Message. They remind us that the One who made the fire 'hot' has the power to make it 'cool and safe' for Ibrahim, and the One who made the sea 'liquid' can make it a 'solid path' for Musa." },
            { type: "quiz", question: "What is the technical term for a 'Miracle' in Islamic theology?", options: ["Karamah", "Mu'jizah", "Sihr", "Khayal"], correctIndex: 1, hint: "Something that 'incapacitates' others from matching it." },
            { type: "quiz", question: "Which Miracle is considered the 'Eternal Miracle' (Al-Mu'jizah al-Khalidah)?", options: ["Splitting of the Moon", "The Quran", "The Night Journey (Isra)", "The Staff of Moses"], correctIndex: 1, hint: "It remains with us today." },
            { type: "quiz", question: "Why were the miracles of Jesus (Isa) focused on healing and raising the dead?", options: ["Because his people excelled in medicine", "Because he liked doctors", "It was random", "Because he was a doctor himself"], correctIndex: 0, hint: "Allah matched the miracle to the people's expertise." },
            { type: "quiz", question: "According to Sahih al-Bukhari 4981, what did the Prophet (PBUH) hope would be the result of his 'Divine Inspiration' miracle?", options: ["He would be wealthy", "He would have the most followers on the Day of Resurrection", "He would travel the world", "He would live forever"], correctIndex: 1, hint: "Fa-arju an akuna aktharahum tabi'an." },
            { type: "quiz", question: "What is 'Kharq al-'Adah'?", options: ["Normal tradition", "Breaking the established laws of nature", "Building a house", "Writing a poem"], correctIndex: 1, hint: "The core mechanic of a miracle." },
            { type: "document", title: "Scientific Miracles of the Quran", description: "A contemporary look at the linguistic and empirical signs in the Quran.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Prophetic Signs", description: "Comprehensive list of the physical miracles of Prophet Muhammad recorded in the Hadith.", url: "https://sunnah.com/", platform: "Hadith Collections" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 5 (RISALAH) TO 20+ BLOCKS ---');
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
