const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_DATA = [
    {
        id: "3c5f9d05-431f-49da-a21b-e2b9975de0c0",
        title: "The Hadith of Jibreel Explained",
        blocks: [
            { type: "objectives", items: ["Understand the contextual, historical, and pedagogical significance of the Hadith of Jibril.", "Identify the three ascending levels of the religion: Islam, Iman, and Ihsan.", "Analyze the etiquette of a student seeking knowledge from the posture of Jibril (as).", "Synthesize the interconnected relationship between outward action, inward conviction, and spiritual excellence."] },
            { type: "concept", translation: "Deen: The complete 'way of life' or religion, encompassing law, creed, and spiritual excellence.", arabic: "دين" },
            { type: "concept", translation: "Hadith Jibril: Known as the 'Mother of the Sunnah' because it contains the foundational definitions of the faith.", arabic: "حديث جبريل" },
            { type: "text", content: "### The Foundational Map of the Faith\nThe encounter between Archangel Jibril (Gabriel) and the Prophet ﷺ is a watershed moment in Islamic pedagogy. Nearing the end of the Prophetic mission, this event served to crystalize the entire religion into a cohesive structure. Jibril arrived disguised as an impossibly clean traveler with intensely dark hair, prompting awe and confusion among the Companions. He proceeded to map out the religion (Deen) through a series of specific questions." },
            { type: "scholar", translation: "Umar ibn Al-Khattab: One day, while we were sitting with the Messenger of Allah, there appeared before us a man whose clothes were exceedingly white and whose hair was exceedingly black... he sat down opposite the Prophet, rested his knees against his knees, and placed his palms on his thighs.", arabic: "عُمَرَ بْنِ الْخَطَّابِ..." },
            { type: "text", content: "### Pedagogical Brilliance & Etiquette\nJibril's physical posture—knees touching the Prophet's knees, hands on thighs—was not merely conversational. It established the absolute Adab (etiquette) required for a student seeking sacred knowledge: extreme humility, proximity to the teacher, undisturbed focus, and profound respect. The angels model the behavior required to receive divine light." },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "infographic", layout: "process", items: [
                { title: "Islam", description: "The outward physical submission (The 5 Pillars). Forms the bodily framework.", icon: "Activity" },
                { title: "Iman", description: "The inward spiritual conviction (The 6 Pillars). Gives the framework a heart.", icon: "Heart" },
                { title: "Ihsan", description: "The perfected spiritual awareness. The soul's constant vigilance.", icon: "Eye" }
            ]},
            { type: "text", content: "### The Concentric Spheres of Belief\nThe religion is not a flat list of rules; it consists of concentric, ascending spheres. Every Muhsin (one who reaches Ihsan) is implicitly a Mu’min (a believer) and a Muslim. However, not every Muslim has achieved the depths of Iman or the heights of Ihsan. The Hadith provides the roadmap for a lifelong ascent toward absolute presence with the Divine." },
            { type: "callout", content: "Knowledge Application: When you ask a question about the religion, is your intention to challenge the teacher, or like Jibril, to benefit the people listening around you?", author: "Action Item" },
            { type: "quran", translation: "This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion. (Surah al-Ma'idah 5:3)", arabic: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا" },
            { type: "text", content: "### The Importance of Q&A in Islam\nThe Prophet's response to Jibril departing was, 'That was Jibril, he came to teach you your religion.' Although Jibril was asking the questions, he was fundamentally acting as a teacher. The Socratic method of question and answer is deeply embedded in the Prophetic tradition to stimulate active intellectual engagement." },
            { type: "quiz", question: "Why is the Hadith of Jibril occasionally referred to as the 'Mother of the Sunnah'?", options: ["It is the oldest recorded hadith", "It systematically maps out the entirety of the religion's structure (Islam, Iman, Ihsan)", "It is exclusively focused on jurisprudence", "It was narrated solely by Aisha"], correctIndex: 1, hint: "It contains the full map." },
            { type: "quiz", question: "What Adab (etiquette) did Jibril model by resting his knees against the Prophet's knees?", options: ["Aggression", "Boredom", "Extreme humility, focus, and proximity to the teacher", "Trying to take the Prophet's place"], correctIndex: 2, hint: "The posture of an ideal student." },
            { type: "quiz", question: "In the context of the concentric spheres of belief, which statement is true?", options: ["Every Muslim is a Muhsin", "Every Muhsin acts completely independent of Islam", "Every Muhsin is necessarily a Mu'min and a Muslim", "Iman is completely separate from Ihsan"], correctIndex: 2, hint: "The highest sphere contains the lower ones." },
            { type: "reflection", translation: "If your religion was evaluated solely by observing your physical actions by an outsider, would they see the 'Islam', the 'Iman', or the 'Ihsan'?", arabic: "تفكر عميق" },
            { type: "document", title: "The Mother of the Sunnah", description: "A detailed exegesis of the Hadith of Jibril by Imam an-Nawawi.", url: "https://sunnah.com/nawawi40:2", platform: "Sunnah.com" }
        ]
    },
    {
        id: "00d6e8ac-54c7-45ed-b435-c9824a74bcf7",
        title: "The Five Pillars of Islam",
        blocks: [
            { type: "objectives", items: ["Categorize the five pillars of Islam as the structural, physical framework of a Muslim's life.", "Analyze the profound psychological and social impact of Shahada, Salah, Zakah, Sawm, and Hajj.", "Recognize why Islam differentiates between the 'Deen' itself and the 'Pillars' holding it up.", "Assess how the pillars cultivate personal discipline and collective community welfare."] },
            { type: "concept", translation: "Arkan al-Islam: The five fundamental physical practices mandated for a Muslim.", arabic: "أركان الإسلام" },
            { type: "concept", translation: "Shahada: The declaration of faith; the gateway and ultimate foundation of the remaining four pillars.", arabic: "الشهادة" },
            { type: "text", content: "### The Architectural Framework of Submission\nThe Prophet ﷺ explicitly stated, 'Islam is built upon five.' This architectural metaphor is critical. The five pillars are not the entirety of the religion; they are the load-bearing columns. If the columns are missing, the structure collapses. If they are present but hollow (performed without sincerity), the building remains unsafe." },
            { type: "infographic", layout: "grid", items: [
                { title: "Shahada (Testimony)", description: "The foundational commitment of the heart, voiced by the tongue.", icon: "MessageSquare" },
                { title: "Salah (Prayer)", description: "The five daily anchors keeping the soul connected to the Creator.", icon: "Clock" },
                { title: "Zakat (Alms)", description: "The purification of wealth, cultivating detachment and social equity.", icon: "CreditCard" },
                { title: "Sawm (Fasting)", description: "The school of Taqwa, proving the soul can master the bodily appetites.", icon: "Sun" },
                { title: "Hajj (Pilgrimage)", description: "The ultimate journey of sacrifice, mimicking the great assembly of Judgment Day.", icon: "Globe" }
            ]},
            { type: "text", content: "### Beyond Ritual: The Psychological Impact\nThese pillars act as a comprehensive training program to dismantle the ego. **Salah** shatters the illusion of self-sufficiency daily. **Zakat** attacks hidden greed and the false belief that we 'own' our provisions. **Sawm** proves to the Nafs (ego) that it can survive without base desires, building tremendous willpower. **Hajj** strips the believer of status symbols, reducing an emperor to two white sheets standing side-by-side with a janitor." },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "quran", translation: "Recite what is sent of the Book by inspiration to thee, and establish regular Prayer: for Prayer restrains from shameful and unjust deeds. (Surah al-Ankabut 29:45)", arabic: "اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ" },
            { type: "text", content: "### The Litmus Test of the Heart\nAlthough the pillars of Islam involve physical action (wudu, bowing, dispensing money, travel), they are functionally useless if disconnected from the internal pillars of Iman. Merely starving during Ramadan without internal reflection is just 'hunger and thirst'. The physical pillars are the diagnostic tests proving the invisible sincerity of the heart." },
            { type: "hadith", translation: "Islam is built upon five: testifying that there is no true god except Allah and that Muhammad is the Messenger of Allah, performing Salah, paying Zakah, making the pilgrimage to the House, and fasting in Ramadan.", arabic: "بُنِيَ الإِسْلامُ عَلَى خَمْسٍ..." },
            { type: "callout", content: "Pillar Audit: Evaluate your Salah. Does it feel like a heavy tax you are forced to pay, or a desperately needed break from the anxieties of the world?", author: "Action Item" },
            { type: "quiz", question: "Why did the Prophet ﷺ use the metaphor 'built UPON five'?", options: ["Because there are only five things in Islam", "Because the pillars are the critical supports, but the 'house' (religion) contains much more (ethics, character, law)", "Because houses in Arabia had five pillars", "He meant something purely literal regarding construction"], correctIndex: 1, hint: "Columns are not the whole building." },
            { type: "quiz", question: "What specific psychological flaw does Zakat directly attack?", options: ["Lack of sleep", "The illusion of self-sufficiency and the greed of absolute ownership", "Fear of water", "Forgetfulness"], correctIndex: 1, hint: "Attachment to wealth." },
            { type: "quiz", question: "Fasting (Sawm) is designed to cultivate:", options: ["Weight loss", "Taqwa (God-consciousness) and mastery over bodily appetites", "Anger", "Exhaustion"], correctIndex: 1, hint: "Discipline of the Nafs." },
            { type: "reflection", translation: "If a non-Muslim asked you how your five daily prayers concretely change your behavior between 1pm and 4pm, what honest answer would you give?", arabic: "تفكر عن الصلاة" },
            { type: "document", title: "The Wisdom Behind the Pillars", description: "Exploring the socio-spiritual benefits of the Arkan.", url: "https://seekersguidance.org/", platform: "SeekersGuidance" }
        ]
    },
    {
        id: "765a2821-a9bf-4eb3-930d-b43c3a0af7b3",
        title: "The Six Pillars of Iman",
        blocks: [
            { type: "objectives", items: ["Define the six pillars of Iman (Faith) and distinguish them from the physical pillars of Islam.", "Articulate the rational and spiritual necessity of believing in the Unseen (Al-Ghayb).", "Explain how belief in Qadr (Divine Decree) functions as the ultimate psychological stabilizer.", "Connect the belief in Messengers and Books to the concept of continuous divine mercy."] },
            { type: "concept", translation: "Arkan al-Iman: The six foundational inner convictions required for true faith.", arabic: "أركان الإيمان" },
            { type: "concept", translation: "Al-Ghayb: The Unseen realm; realities beyond human sensory perception but affirmed by revelation.", arabic: "الغيب" },
            { type: "concept", translation: "Al-Qadr: The Divine Decree; affirming that Allah's will encompasses all that occurs.", arabic: "القدر" },
            { type: "text", content: "### Accessing the Deep Source Code\nIf the five pillars of Islam are the hardware (the body), the six pillars of Iman are the operating system (the soul). Iman is inherently an internal reality. It requires Tasdiq (profound heartfelt affirmation). In the Hadith of Jibril, when asked to define Iman, the Prophet ﷺ listed six exact realities that must be accepted to orient the human mind toward truth." },
            { type: "infographic", layout: "process", items: [
                { title: "Allah", description: "His Lordship, Worship, and Perfect Names.", icon: "Sun" },
                { title: "Angels", description: "Luminous beings executing Divine commands without fail.", icon: "Wind" },
                { title: "Books", description: "The manuals of truth revealed throughout history to guide humanity.", icon: "BookOpen" },
                { title: "Messengers", description: "Human exemplars chosen out of mercy to model the Books.", icon: "Users" },
                { title: "The Last Day", description: "The ultimate reckoning enforcing absolute cosmic justice.", icon: "Eye" },
                { title: "Divine Decree", description: "Trusting the wisdom in the unfolding of all events, good and seemingly bad.", icon: "Activity" }
            ]},
            { type: "text", content: "### The Radical Shift: Believing in the Unseen\nThe modern secular worldview demands absolute Empirical proof—if you can't measure it, it isn't real. Iman boldly rejects this limitation. The Qur'an praises 'those who believe in the unseen' (Ghayb). Believing in Angels or the Last Day is not blind faith; it is deeply rational trust in the truthful Messenger who delivered the information." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "quran", translation: "O you who have believed, believe in Allah and His Messenger and the Book that He sent down upon His Messenger and the Scripture which He sent down before. And whoever disbelieves in Allah, His angels, His books, His messengers, and the Last Day has certainly gone far astray. (Surah an-Nisa 4:136)", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ وَالْكِتَابِ..." },
            { type: "text", content: "### Qadr: The Antidote to Despair\nPerhaps nothing tests Iman more fiercely than Qadr (Predestination/Divine Decree). Deep belief that a hardship was perfectly scripted by the All-Wise Creator removes the burning 'What Ifs' that destroy human sanity. The believer exerts maximum physical effort but anchors their emotional stability purely in Allah's overarching plan." },
            { type: "hadith", translation: "Iman is that you believe in Allah, His Angels, His Books, His Messengers, the Last Day, and you believe in the divine decree, both the good of it and the evil of it.", arabic: "أَنْ تُؤْمِنَ بِاللَّهِ وَمَلائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ..." },
            { type: "callout", content: "Qadr Check: The next time an unexpected inconvenience occurs (e.g., car won't start), physically say 'Qaddar Allahu wa ma sha’a fa’al' (Allah decreed it, and what He willed occurred) to preempt anxiety.", author: "Action Item" },
            { type: "quiz", question: "What does 'Belief in the Unseen' (Al-Ghayb) signify?", options: ["A rejection of all science", "Believing blindly without any proof", "A mature trust in realities beyond sensory observation based on the credibility of the Messenger", "Believing in magic tricks"], correctIndex: 2, hint: "A reliance on the truthful transmission." },
            { type: "quiz", question: "How does the pillar of 'The Last Day' directly affect a Muslim's current behavior?", options: ["It makes them fearful of sleeping", "It demands absolute accountability and justice for every atom of good or evil done in this life", "It encourages reckless living", "It only affects the elderly"], correctIndex: 1, hint: "Consequences for all actions." },
            { type: "quiz", question: "Why is Qadr (Divine Decree) crucial for mental resilience?", options: ["It provides an excuse for laziness", "It removes the paralyzing anxiety of 'What If' by recognizing a higher Wisdom in all events", "It allows a person to blame others", "It guarantees financial wealth"], correctIndex: 1, hint: "What hit you was never meant to miss." },
            { type: "reflection", translation: "Which of the six pillars do you find your heart naturally resonating with the most during hardship? Which one do you tend to forget?", arabic: "تفكر عن أركان الإيمان" },
            { type: "document", title: "Comprehensive Breakdown of Iman", description: "A theological dive into the requirements of the six pillars.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('Seeding Module 2 - Part 1...');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}" with ${item.blocks.length} blocks... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}_${Math.floor(Math.random()*10000)}`, order: i };
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

        const { error, data } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks, title: item.title })
            .eq('id', item.id).select();
        
        if (error) console.log('\nERR: ' + error.message);
        else console.log(`DONE! Seeded to ${item.title}`);
    }
}

seedLessons();
