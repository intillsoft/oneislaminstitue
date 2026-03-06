const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "The Finality of Prophet Muhammad", /* Note: check structure has "The Finality of Prophet Muhammad ﷺ" but we use a loose ilike match */
        blocks: [
            { type: "callout", content: "Muhammad is not the father of [any] one of your men, but [he is] the Messenger of Allah and last of the prophets.", author: "Surah Al-Ahzab 33:40" },
            { type: "objectives", items: ["Understand the concept of 'Khatam an-Nabiyyin' (Seal of the Prophets)", "Analyze why a final prophet was needed after previous revelations were altered", "Identify the logical and theological proofs that Prophethood ended", "Address modern claims of new prophets or continuing revelation"] },
            { type: "text", content: "## The Final Brick\n\nThe Prophet (PBUH) compared the history of Prophethood to a beautiful house built by many people. However, the house was missing one corner brick. People would walk around it, admiring its beauty, but asking: 'Why has this brick not been placed?' He said: 'I am that brick, and I am the seal of the prophets.'" },
            { type: "concept", translation: "Khatm an-Nubuwwah: The absolute closure and finality of Prophethood with Muhammad (PBUH). No new prophet will come after him, and his law is the final law until the Day of Judgment.", arabic: "ختم النبوة" },
            { type: "quran", translation: "This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion. (Surah Al-Ma'idah 5:3)", arabic: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي" },
            { type: "infographic", layout: "grid", items: [
                { title: "Universal Message", description: "Sent to all of humanity, not just one specific tribe.", icon: "Globe" },
                { title: "Preserved Book", description: "The Quran is protected from corruption, removing the need for a 'corrector' prophet.", icon: "BookOpen" },
                { title: "Perfected Law", description: "The Shariah is final and applicable until the Hour.", icon: "CheckCircle" },
                { title: "The Seal (Khatam)", description: "Closing the door of revelation forever.", icon: "Lock" }
            ]},
            { type: "text", content: "### Why No More Prophets?\n\nPreviously, a new prophet was sent for three reasons: 1. The previous scripture was lost or corrupted. 2. A specific nation needed specific guidance. 3. The previous law needed updating. With the coming of Muhammad (PBUH), the Quran was divinely protected (eliminating reason 1), his message was universal (eliminating reason 2), and his law perfected (eliminating reason 3)." },
            { type: "hadith", translation: "There will be no Prophet after me. (Sahih al-Bukhari 3455)", arabic: "لاَ نَبِيَّ بَعْدِي" },
            { type: "scholar", translation: "Belief in the finality of prophethood is known from the religion by necessity (Ma'lum min al-Din bi'l-Darurah). Anyone who denies it has stepped outside the fold of Islam. (Consensus of Scholars)", arabic: "معلوم من الدين بالضرورة" },
            { type: "infographic", layout: "process", items: [
                { title: "The Claim", description: "False prophets will appear (approx. 30 'Dajjals').", icon: "Activity" },
                { title: "The Rejection", description: "The Ummah universally rejects their claims.", icon: "Shield" },
                { title: "The Preservation", description: "The finality preserves the unity of the Muslims.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Return of Isa (Jesus)\n\nMuslims believe Isa ibn Maryam (Jesus) will return near the end of times. However, he will not return as a *new* prophet with a *new* law. He will return as a follower and leader of the Ummah of Muhammad (PBUH), ruling by the Shariah of the final message." },
            { type: "reflection", translation: "Do I realize that because I am part of the final Ummah, the responsibility of sharing the message (Dawah) now rests directly on my shoulders, since no more prophets are coming?", arabic: "كنتم خير أمة أخرجت للناس" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "The door of Prophethood is closed, but the door of righteous action and drawing near to Allah (Wilayah) remains open." },
            { type: "quiz", question: "What does 'Khatam an-Nabiyyin' mean?", options: ["The first of the prophets", "The seal (last) of the prophets", "The best of the prophets", "The writer of the prophets"], correctIndex: 1, hint: "Review Surah Al-Ahzab 33:40." },
            { type: "quiz", question: "What parable did the Prophet (PBUH) use to describe his role in the lineage of Prophethood?", options: ["A tree with many branches", "A beautiful house missing a single corner brick", "A fleet of ships", "A line of stars"], correctIndex: 1, hint: "Ana al-labinah (I am the brick)." },
            { type: "quiz", question: "Why is an entirely new prophet NOT needed after Muhammad (PBUH)?", options: ["Because the world is ending soon", "Because the Quran is preserved and the message is universal/perfected", "Because people stopped listening", "Because no one is worthy"], correctIndex: 1, hint: "If the book isn't broken, you don't need a new author." },
            { type: "quiz", question: "If Isa (Jesus) returns, does that contradict the finality of Muhammad's prophethood?", options: ["Yes, it's a contradiction", "No, because he will not bring a new revelation or law, but will follow Islam", "Only if he brings a book", "It means there are two final prophets"], correctIndex: 1, hint: "He returns as a follower of the final Shariah." },
            { type: "quiz", question: "What is the scholarly ruling on someone who claims a new prophet has arrived after Muhammad (PBUH)?", options: ["They are just a new sect", "They have stepped outside the fold of Islam", "They are highly spiritual", "They are correct"], correctIndex: 1, hint: "It denies a fundamental verse of the Quran." },
            { type: "document", title: "The Seal of Prophethood", description: "Detailed analysis of the finality and the rebuttal of modern false claims.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Al-Aqidah Al-Tahawiyyah", description: "The classic creed manual highlighting 'Khatm an-Nubuwwah'.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Proofs of His Prophethood",
        blocks: [
            { type: "callout", content: "He is the one who sent among the unlettered a Messenger from themselves, reciting to them His verses, purifying them, and teaching them the Book and wisdom.", author: "Surah Al-Jumu'ah 62:2" },
            { type: "objectives", items: ["Examine the greatest miracle of the Prophet (PBUH): The Inimitable Quran", "Analyze his unlettered nature (Ummi) as proof of divine source", "Review his physical and character miracles (perfect ethics, answered prayers)", "Investigate classical prophecies foretelling his inevitable arrival"] },
            { type: "text", content: "## Delail al-Nubuwwah (Signs of Prophethood)\n\nEvery prophet was given miracles corresponding to the mastery of their age. Musa (AS) was given magic-defeating signs. Isa (AS) was given medical signs. The Arabs of the 7th century were masters of language and poetry, so Allah gave Muhammad (PBUH) a literary miracle that could not be matched." },
            { type: "concept", translation: "I'jaz al-Quran: The inimitability of the Quran. The belief that its linguistic perfection, historical accuracy, and scientific foresight cannot be matched by any human.", arabic: "إعجاز القرآن" },
            { type: "quran", translation: "Say, 'If mankind and the jinn gathered in order to produce the like of this Qur'an, they could not produce the like of it, even if they were to each other assistants.' (Surah Al-Isra 17:88)", arabic: "لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَٰذَا الْقُرْآنِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Quran", description: "The living miracle that remains on Earth.", icon: "BookOpen" },
                { title: "His Character", description: "Even enemies called him 'Al-Amin' (The Trustworthy).", icon: "Check" },
                { title: "Prophecies", description: "Foretelling major political and social events accurately.", icon: "Eye" },
                { title: "Physical Miracles", description: "Splitting the moon, water flowing from fingers.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Unlettered Prophet\n\nThe Prophet (PBUH) could not read or write (he was 'Ummi'). He grew up in the desert, far from libraries and philosophical schools. Yet he suddenly produced a book detailing the histories of past nations, correct theology, complex legal systems, and descriptions of embryology. Where could he have copied this from?" },
            { type: "hadith", translation: "The miracles of the Prophets were such that the people believed. And the miracle given to me is a Revelation from Allah. (Sahih al-Bukhari 4981)", arabic: "وَإِنَّمَا كَانَ الَّذِي أُوتِيتُ وَحْيًا أَوْحَاهُ اللَّهُ إِلَىَّ" },
            { type: "scholar", translation: "If a person studies the biography of the Prophet fairly, they require no other miracle to know he was sent by God. His life itself is the miracle. (Ibn Taymiyyah)", arabic: "حياتُه معجزة" },
            { type: "infographic", layout: "process", items: [
                { title: "The Challenge", description: "Produce one chapter like it (Surah Al-Baqarah 2:23).", icon: "Activity" },
                { title: "The Failure", description: "The greatest poets of Arabia failed.", icon: "Shield" },
                { title: "The Submission", description: "Millions recognized the divine source.", icon: "Heart" }
            ]},
            { type: "text", content: "### Prophecies Realized\n\nThe Prophet (PBUH) made incredibly specific predictions. He predicted the defeat of the Persians by the Romans within a specific timeframe (Surah Ar-Rum). He predicted barefoot bedouins competing in building tall buildings (signs of the Hour). Every single prophecy has come true or is unfolding." },
            { type: "reflection", translation: "Does my belief rest on blind faith, or am I constantly renewing it by studying the undeniable proofs of his Prophethood?", arabic: "قل هاتوا برهانكم" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "His miracles are overwhelmingly numerous. The greatest is the Book you hold in your hands—an unbroken chain of divine voice." },
            { type: "quiz", question: "What is the primary significance of the Prophet (PBUH) being 'Ummi' (unlettered/unable to read and write)?", options: ["He was disadvantaged", "It proves the Quran could not have been drafted or copied from other books by him", "He didn't like reading", "He spoke slowly"], correctIndex: 1, hint: "A man who cannot read cannot copy ancient scriptures." },
            { type: "quiz", question: "What is considered the GREATEST miracle of Prophet Muhammad (PBUH)?", options: ["Splitting the moon", "Water flowing from his fingers", "The Holy Quran", "Talking to animals"], correctIndex: 2, hint: "The living miracle we still have today." },
            { type: "quiz", question: "What is the term for the 'inimitability' of the Quran (the fact that no one can produce another like it)?", options: ["I'jaz al-Quran", "Tafsir", "Tajweed", "Khatam"], correctIndex: 0, hint: "From the root 'ajaza' (to be unable)." },
            { type: "quiz", question: "Which major world empires did the Quran prophesy a war outcome for in Surah Ar-Rum?", options: ["The British and French", "The Romans and the Persians", "The Greeks and the Egyptians", "The Mongols and the Turks"], correctIndex: 1, hint: "The Byzantines and Sassanids." },
            { type: "quiz", question: "According to Ibn Taymiyyah, what serves as a miracle even if one did not see the physical ones?", options: ["His sword", "His wealth", "His entire life and biography", "His clothing"], correctIndex: 2, hint: "His perfect character and achievements are impossible without divine aid." },
            { type: "document", title: "Proofs of Prophethood", description: "A contemporary analysis of the historical and scientific signs validating his claim.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Clear Evidence", description: "Understanding the challenge of the Quran: The Dala'il al-Nubuwwah.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "The Sunnah as Guidance",
        blocks: [
            { type: "callout", content: "He who obeys the Messenger has obeyed Allah.", author: "Surah An-Nisa 4:80" },
            { type: "objectives", items: ["Define the 'Sunnah' (Statements, Actions, and Approvals of the Prophet)", "Understand why the Quran cannot be practiced without the Sunnah", "Identify the divine protection over the Sunnah as part of 'The Reminder' (Ad-Dhikr)", "Address the 'Quran-Only' fallacy"] },
            { type: "text", content: "## The Living Quran\n\nWhen Aisha (RA) was asked about the character of the Prophet (PBUH), she summarized it perfectly: 'His character was the Quran.' The Sunnah is the practical, living, breathing explanation of the divine text. You cannot have the theory without the application." },
            { type: "concept", translation: "Sunnah: Literally 'The Path'. Technically, it refers to everything firmly attributed to the Prophet (PBUH) from his statements, actions, and approvals.", arabic: "السنة" },
            { type: "quran", translation: "And whatever the Messenger has given you - take; and what he has forbidden you - refrain from. And fear Allah. (Surah Al-Hashr 59:7)", arabic: "وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Qawl (Statements)", description: "What he explicitly said (e.g., 'Actions are by intentions').", icon: "Mic" },
                { title: "Fi'l (Actions)", description: "How he explicitly acted (e.g., How to perform Hajj).", icon: "Activity" },
                { title: "Taqrir (Approvals)", description: "Things done in his presence that he did not forbid.", icon: "Check" },
                { title: "Sifah (Attributes)", description: "His physical and character traits (Shamail).", icon: "User" }
            ]},
            { type: "text", content: "### The 'Quran-Only' Fallacy\n\nSome modern movements claim we only need the Quran. But the Quran repeatedly commands 'Obey Allah and obey the Messenger'. Furthermore, the Quran says 'Establish Prayer', but it NEVER explains how to pray (how many Rakat, when to bow, what to say). The Sunnah provides the 'How' to the Quran's 'What'." },
            { type: "hadith", translation: "I have been given the Quran and something similar to it along with it. (Sunan Abi Dawud 4604)", arabic: "أَلاَ إِنِّي أُوتِيتُ الْقُرْآنَ وَمِثْلَهُ مَعَهُ" },
            { type: "scholar", translation: "The Sunnah is a judge over the Quran, but the Quran is not a judge over the Sunnah. (Yahya ibn Abi Kathir) meaning: The Sunnah specifies, restricts, and clarifies the general verses of the Quran.", arabic: "السنة قاضية على الكتاب" },
            { type: "infographic", layout: "process", items: [
                { title: "The Text", description: "Quran: 'Pay Zakat'.", icon: "BookOpen" },
                { title: "The Explanation", description: "Sunnah: Detailing the exact percentage (2.5%).", icon: "Search" },
                { title: "The Execution", description: "Believer: Acts based on both.", icon: "CheckCircle" }
            ]},
            { type: "text", content: "### Preservation of the Sunnah\n\nAllah promised to preserve the 'Dhikr' (Reminder). Scholars understand this includes the Sunnah, because preserving a text without preserving its authorized explanation would leave the religion corrupted. This birthed the incredible science of Hadith verification (Mustalah)." },
            { type: "reflection", translation: "Do I view following the Sunnah as an 'extra credit' hobby, or as the mandatory path to accessing Allah's love?", arabic: "فاتبعوني يحببكم الله" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "The Prophet's footsteps are the only footprints that safely lead across the bridge of life to the gates of Paradise." },
            { type: "quiz", question: "What are the three main components of the Sunnah?", options: ["History, Poetry, Law", "Statements (Qawl), Actions (Fi'l), and Approvals (Taqrir)", "Fasting, Praying, Charity", "Sunnah, Wajib, Makruh"], correctIndex: 1, hint: "What he said, what he did, what he approved." },
            { type: "quiz", question: "What is the primary danger of the 'Quran-Only' ideology?", options: ["It reads too slowly", "It makes it impossible to know how to perform basic acts of worship like Salat and Zakat", "It is an old religion", "It memorizes the Quran wrong"], correctIndex: 1, hint: "The Quran says 'pray', the Sunnah shows 'how'." },
            { type: "quiz", question: "In Surah Al-Hashr 59:7, what are believers instructed to do regarding the Messenger?", options: ["Only listen to his stories", "Take whatever he gives, and refrain from whatever he forbids", "Ignore him when reading Quran", "Draw pictures of him"], correctIndex: 1, hint: "Wa ma atakum ar-rasulu fakhudhoohu..." },
            { type: "quiz", question: "According to the Hadith in Sunan Abi Dawud, what did the Prophet say he was given along with the Quran?", options: ["A sword", "Wealth", "'Something similar to it' (The Sunnah/Wisdom)", "A physical crown"], correctIndex: 2, hint: "Uteetu al-qur'ana wa mithlahu ma'ahu." },
            { type: "quiz", question: "When Aisha was asked about the Prophet's character, what was her short response?", options: ["He was kind", "He was silent", "'His character was the Quran'", "He was strict"], correctIndex: 2, hint: "He was the living embodiment of the text." },
            { type: "document", title: "The Authority of Sunnah", description: "Imam Ash-Shafi'i's 'Al-Risalah' - defining the necessity of prophetic tradition.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Introduction to Hadith Sciences", description: "How the Ummah historically preserved the Sunnah flawlessly.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 9 (LESSON 3-5) ---');
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

        // Using precise string matching because "The Finality of Prophet Muhammad ﷺ" has a special character
        const { error } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title.replace(' ﷺ', '')}%`);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE (${finalBlocks.length} Blocks Seeded)`);
        }
    }
}

seedLessons();
