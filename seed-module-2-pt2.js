const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Tawheed al-Uluhiyyah",
        blocks: [
            { type: "callout", content: "The purpose of the revelation of all Books and the sending of all Messengers was to establish Tawheed al-Uluhiyyah.", author: "Ibn Abu al-Izz" },
            { type: "objectives", items: ["Understand the central message of every Prophet", "Define 'Ibadah (Worship) correctly", "Recognize that 'Uluhiyyah is the primary reason for human existence"] },
            { type: "text", content: "## The Core of Our Creation\n\nTawheed al-Uluhiyyah is also known as Tawheed al-'Ibadah (Oneness of Worship). It is the act of singling out Allah alone in the actions of the servant. This is the great dividing line between believers and polytheists, and the subject of every prophetic mission." },
            { type: "quran", translation: "And I did not create the jinn and mankind except to worship Me.", arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ" },
            { type: "concept", translation: "Ibadah (Worship): A comprehensive term for everything Allah loves and is pleased with of words and actions, outward and inward.", arabic: "العبادة: اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال الظاهرة والباطنة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Physical Acts", description: "Prayer, fasting, bowing.", icon: "Activity" },
                { title: "Verbal Acts", description: "Supplication (Dua), oaths, vows.", icon: "Command" },
                { title: "Heart Acts", description: "Fear, hope, reliance, absolute love.", icon: "Heart" }
            ]},
            { type: "hadith", translation: "Supplication (Du'a) is the essence of worship.", arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ" },
            { type: "scholar", translation: "Whoever directs any form of worship to other than Allah has associated partners with Him (committed Shirk).", arabic: "من صرف شيئا من العبادة لغير الله فقد أشرك" },
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "The declaration 'La ilaha illallah' is deeply rooted in Uluhiyyah. It means: 'There is no deity worthy of worship except Allah.'" },
            { type: "quiz", question: "Tawheed al-Uluhiyyah is also known as:", options: ["Tawheed al-Asma", "Tawheed al-'Ibadah (Worship)", "Tawheed ar-Rububiyyah", "Tawheed al-Hukm"], correctIndex: 1, hint: "It is directly linked to the servant's actions." },
            { type: "quiz", question: "Which of the following is considered an act of worship in Islam?", options: ["Charity", "Supplication (Dua)", "Animal Sacrifice", "All of the above"], correctIndex: 3, hint: "Ibadah is a comprehensive term." },
            { type: "quiz", question: "According to Ibn Taymiyyah's famous definition, worship is a comprehensive word that includes:", options: ["Only the 5 daily prayers", "Only physical actions", "Everything Allah loves and is pleased with (inward & outward)", "Only giving Zakat"], correctIndex: 2, hint: "See the Key Concept block." }
        ]
    },
    {
        title: "Tawheed al-Asma wa Sifat",
        blocks: [
            { type: "callout", content: "To affirm what Allah has affirmed for Himself without distortion, without denial, without asking 'how', and without likening Him to creation.", author: "Aqeedah al-Wasitiyyah" },
            { type: "objectives", items: ["Understand the classical rules regarding Allah's Names and Attributes", "Differentiate between the Creator and the created", "Learn how to understand the verses dealing with Attributes (Sifat)"] },
            { type: "text", content: "## Knowing the Creator\n\nTawheed of Names and Attributes requires us to describe Allah exactly as He described Himself and as His Messenger described Him. We do this following the golden rule of the Qur'an: 'There is nothing like unto Him'." },
            { type: "quran", translation: "There is nothing like unto Him, and He is the Hearing, the Seeing.", arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ" },
            { type: "infographic", layout: "process", items: [
                { title: "Tahrif (Distortion)", description: "We do not twist the meanings.", icon: "X" },
                { title: "Ta'til (Denial)", description: "We do not strip Allah of His attributes.", icon: "X" },
                { title: "Takyif (Asking How)", description: "We affirm the meaning, but the 'how' is unknown.", icon: "Check" },
                { title: "Tamthil (Likening)", description: "We do not compare His attributes to His creation.", icon: "Check" }
            ]},
            { type: "scholar", translation: "Imam Malik on Allah's 'Istidwa' (Rising above the Throne): 'The Rising is known, the 'how' is unknown, believing in it is obligatory, and asking about it is an innovation.'", arabic: "الاستواء غير مجهول، والكيف غير معقول، والإيمان به واجب، والسؤال عنه بدعة" },
            { type: "reflection", translation: "When you know His names: Ar-Rahman, As-Sami', Al-Baseer, your dua transcends from a ritual into a deeply personal conversation.", arabic: "عندما تعرف أسماءه: الرحمن السميع البصير، يتحول دعاؤك من طقوس إلى محادثة شخصية عميقة." },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Through His Names and Attributes, the Unseen God becomes intensely known and loved to the servant." },
            { type: "quiz", question: "What is the primary Qur'anic rule regarding Allah's attributes?", options: ["He is exactly like us", "There is nothing like unto Him", "He has no form or attributes at all", "We can only use metaphors"], correctIndex: 1, hint: "Surah Ash-Shura 42:11." },
            { type: "quiz", question: "When asked about the 'manner' (takyif) of Allah's attributes, Imam Malik said:", options: ["We must investigate it", "The 'how' is unknown (Ghayr Ma'qul)", "It is a metaphor", "We should ask the scholars"], correctIndex: 1, hint: "The 'Rising' is known, but the 'how' is not." },
            { type: "quiz", question: "What does Ta'til refer to in Islamic theology?", options: ["Affirming an attribute", "Likening Allah to creation", "Stripping or denying Allah of His established attributes", "Asking 'how'"], correctIndex: 2, hint: "It means 'vacating' or denying." }
        ]
    },
    {
        title: "Types of Shirk",
        blocks: [
            { type: "callout", content: "Shirk is the greatest injustice; it is to treat the creation as equal to the Creator in that which is unique to the Creator.", author: "Classical Maxim" },
            { type: "objectives", items: ["Categorize Shirk into Major (Akbar) and Minor (Asghar)", "Understand the severe consequences of Major Shirk", "Recognize Riyya' (showing off) as Minor Shirk"] },
            { type: "text", content: "## The Unforgivable Sin\n\nThe direct opposite of Tawheed is Shirk: associating partners with Allah. It is the only sin Allah will not forgive if a person dies without repenting from it. A believer must be acutely aware of its subtle and profound forms." },
            { type: "quran", translation: "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.", arabic: "إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Major Shirk (Akbar)", description: "Directing worship to others. Nullifies Islam entirely.", icon: "AlertTriangle" },
                { title: "Minor Shirk (Asghar)", description: "Showing off (Riya'), swearing by other than Allah. A major sin, but does not completely nullify Islam.", icon: "Eye" },
                { title: "Hidden Shirk (Khafi)", description: "Subtler than an ant crawling on a black stone in the dark of night.", icon: "Lock" }
            ]},
            { type: "hadith", translation: "The thing I fear for you the most is the minor shirk. They said: O Messenger of Allah, what is the minor shirk? He said: Ar-Riya' (showing off).", arabic: "إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الأَصْغَرُ قَالُوا يَا رَسُولَ اللَّهِ وَمَا الشِّرْكُ الأَصْغَرُ قَالَ الرِّيَاءُ" },
            { type: "reflection", translation: "True sincerity (Ikhlas) is treating praise and criticism from people as equal. If your worship changes when humans watch, check your heart for the 'hidden ant'.", arabic: "الإخلاص الحقيقي هو أن يستوي المادح والذام عندك" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "Protecting our Tawheed requires constant vigilance over our intentions. Sincerity is the sword that slays the hidden idols in our hearts." },
            { type: "quiz", question: "Which sin will Allah absolutely not forgive if a person dies upon it?", options: ["Murder", "Theft", "Shirk (Associating partners with Him)", "Drinking alcohol"], correctIndex: 2, hint: "Surah An-Nisa 4:48." },
            { type: "quiz", question: "What did the Prophet (PBUH) explicitly define as 'Minor Shirk'?", options: ["Idolatry", "Showing off (Ar-Riya')", "Missing a prayer", "Lying"], correctIndex: 1, hint: "Doing deeds for the praise of people." },
            { type: "quiz", question: "Does Minor Shirk (Asghar) completely remove a person from the fold of Islam?", options: ["Yes", "No, but it is one of the gravest major sins", "Only if done repeatedly", "It depends on the intention"], correctIndex: 1, hint: "It nullifies the specific deed, not one's entire faith." }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING LESSONS PT 6 (MODULE 2 Part 2) ---');
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
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title}%`);
        console.log('DONE');
    }
}

seedLessons();
