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
            { type: "callout", content: "The purpose of the revelation of all Books and the sending of all Messengers was to establish Tawheed al-Uluhiyyah.", author: "Valid scholarly consensus (Ibn Abu al-Izz, Sharh at-Tahawiyyah)" },
            { type: "objectives", items: ["Understand the central message of every Prophet", "Define 'Ibadah (Worship) comprehensively", "Recognize that 'Uluhiyyah is the primary reason for human existence", "Differentiate between recognizing God and worshipping God"] },
            { type: "text", content: "## The Core of Our Creation\n\nTawheed al-Uluhiyyah is also known as Tawheed al-'Ibadah (Oneness of Worship). It is the act of singling out Allah alone in the actions of the servant. This is the great dividing line between believers and polytheists, and the core subject of every prophetic mission." },
            { type: "quran", translation: "And I did not create the jinn and mankind except to worship Me. (Surah Adh-Dhariyat 51:56)", arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ" },
            { type: "concept", translation: "Ibadah (Worship): A comprehensive term for everything Allah loves and is pleased with of words and actions, outward and inward.", arabic: "العبادة: اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال الظاهرة والباطنة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Physical Acts", description: "Prayer, fasting, bowing.", icon: "Activity" },
                { title: "Verbal Acts", description: "Supplication (Dua), oaths, vows.", icon: "Command" },
                { title: "Heart Acts", description: "Fear, hope, reliance, absolute love.", icon: "Heart" },
                { title: "Financial Acts", description: "Zakat, charity, sacrifice.", icon: "Briefcase" }
            ]},
            { type: "text", content: "### Supplication as the Core of Worship\n\nMany misinterpret worship as merely physical rituals. However, directing one's absolute hope and reliance to a created being is a form of misdirected worship. Invoking the dead or absent entities for things only Allah can provide violates this Tawheed." },
            { type: "hadith", translation: "Supplication (Du'a) is the essence of worship. Then the Prophet recited: 'And your Lord says, Call upon Me; I will respond to you.' (Sunan Abi Dawud 1479, Authentic)", arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ، ثُمَّ قَرَأَ: وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ" },
            { type: "scholar", translation: "Whoever directs any form of worship to other than Allah has associated partners with Him (committed Shirk). (Ibn Taymiyyah, Al-Ubudiyyah)", arabic: "من صرف شيئا من العبادة لغير الله فقد أشرك" },
            { type: "quran", translation: "Say, 'Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.' (Surah Al-An'am 6:162)", arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ" },
            { type: "reflection", translation: "The declaration 'La ilaha illallah' is deeply rooted in Uluhiyyah. It means: 'There is absolutely no deity *worthy of worship* except Allah.'", arabic: "لا إله إلا الله: لا معبود بحق إلا الله" },
            { type: "video", url: "https://www.youtube.com/watch?v=RMBw94mksG8" },
            { type: "conclusion", content: "Uluhiyyah demands that our internal love, fear, and hope perfectly align with our external rituals of prayer, fasting, and charity—all directed exclusively to the heavens." },
            { type: "quiz", question: "Tawheed al-Uluhiyyah is also known as:", options: ["Tawheed al-Asma (Names)", "Tawheed al-'Ibadah (Worship)", "Tawheed ar-Rububiyyah (Lordship)", "Tawheed al-Hukm (Governance)"], correctIndex: 1, hint: "It is directly linked to the servant's actions." },
            { type: "quiz", question: "Which of the following is considered an act of worship in Islam?", options: ["Charity", "Supplication (Dua)", "Animal Sacrifice", "All of the above"], correctIndex: 3, hint: "Ibadah is a totally comprehensive term." },
            { type: "quiz", question: "According to Ibn Taymiyyah's famous definition, worship includes:", options: ["Only the 5 daily prayers", "Only physical actions", "Everything Allah loves and is pleased with (inward & outward)", "Only giving Zakat"], correctIndex: 2, hint: "See the Key Concept block." },
            { type: "quiz", question: "In the Hadith from Sunan Abi Dawud, what is declared to be the 'essence of worship'?", options: ["Fasting", "Giving money", "Supplication (Du'a)", "Performing Hajj"], correctIndex: 2, hint: "Ad-Du'a Huwa Al-Ibadah." },
            { type: "quiz", question: "According to Surah Adh-Dhariyat 51:56, why were jinn and mankind created?", options: ["To build civilizations", "To populate the earth", "Except to worship Allah", "To enjoy the Dunya"], correctIndex: 2, hint: "Wa ma khalaqtu al-jinna..." },
            { type: "document", title: "Enslavement to Allah", description: "A translation of Ibn Taymiyyah's fundamental treatise 'Al-Ubudiyyah', defining worship inside and out.", url: "https://kalamullah.com/ubudiyyah.html", platform: "Classical Works Translation" },
            { type: "document", title: "The Meaning of La Ilaha Illallah", description: "Academic breakdown of the conditions and implications of the declaration of faith.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Tawheed al-Asma wa Sifat",
        blocks: [
            { type: "callout", content: "To affirm what Allah has affirmed for Himself without distortion, without denial, without asking 'how', and without likening Him to creation.", author: "Ibn Taymiyyah (Al-Aqeedah Al-Wasitiyyah)" },
            { type: "objectives", items: ["Understand the orthodox rules regarding Allah's Names and Attributes", "Differentiate between the Creator and the created", "Learn how to understand verses dealing with Attributes (Sifat)", "Recognize the four theological errors to avoid"] },
            { type: "text", content: "## Knowing the Creator\n\nTawheed of Names and Attributes requires us to describe Allah exactly as He described Himself in the Qur'an and as His Messenger described Him in authentic Hadiths. We do this while strictly following the golden rule of the Qur'an: 'There is nothing like unto Him'." },
            { type: "quran", translation: "There is nothing like unto Him, and He is the Hearing, the Seeing. (Surah Ash-Shura 42:11)", arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ" },
            { type: "concept", translation: "Al-Asma wa Sifat (Names and Attributes): Belief in the 99+ excellent names of Allah and His perfect attributes without comparing them to human traits.", arabic: "الأسماء والصفات: إثبات ما أثبته الله لنفسه من غير تحريف ولا تعطيل ولا تكييف ولا تمثيل" },
            { type: "infographic", layout: "process", items: [
                { title: "Tahrif (Distortion)", description: "We do not twist the meanings away from their apparent literal sense.", icon: "X" },
                { title: "Ta'til (Denial)", description: "We do not strip Allah of His attributes or claim they are just metaphors.", icon: "X" },
                { title: "Takyif (Asking How)", description: "We affirm the meaning, but the 'how' or mechanism is unknown.", icon: "Check" },
                { title: "Tamthil (Likening)", description: "We vehemently deny any comparison to His creation.", icon: "Check" }
            ]},
            { type: "hadith", translation: "Allah has ninety-nine names, one hundred less one; whoever comprehends them will enter Paradise. (Sahih al-Bukhari 2736)", arabic: "إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلاَّ وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ" },
            { type: "scholar", translation: "Imam Malik on Allah's 'Istawa' (Rising above the Throne): 'The Rising is known, the 'how' is unknown, believing in it is obligatory, and asking about it is an innovation.' (Siyar A'lam al-Nubala)", arabic: "الاستواء غير مجهول، والكيف غير معقول، والإيمان به واجب، والسؤال عنه بدعة" },
            { type: "text", content: "### The Emotional Connection\n\nLearning Allah's names is not just a theological exercise; it is the fuel for our prayers. We invoke Ar-Rahman (The Merciful) when seeking forgiveness, and Ar-Razzaq (The Provider) when seeking sustenance." },
            { type: "quran", translation: "He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names. (Surah Al-Hashr 59:24)", arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ" },
            { type: "reflection", translation: "When you know His names: Ar-Rahman, As-Sami', Al-Baseer, your dua transcends from a daily ritual into a deeply personal conversation.", arabic: "عندما تعرف أسماءه: الرحمن السميع البصير، يتحول دعاؤك من طقوس إلى محادثة شخصية عميقة." },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Through His Names and Attributes, the Unseen God becomes intensely known and loved to the servant. We know Him precisely as He introduced Himself." },
            { type: "quiz", question: "What is the primary Qur'anic rule regarding Allah's attributes (found in Surah Ash-Shura 42:11)?", options: ["He is exactly like us", "There is nothing like unto Him", "He has no form or attributes at all", "We can only use metaphors to describe Him"], correctIndex: 1, hint: "Laysa ka-mithlihi shay'." },
            { type: "quiz", question: "When asked about the 'manner' (takyif) of Allah's attributes, Imam Malik famously said:", options: ["We must investigate it with science", "The 'how' is unknown (Ghayr Ma'qul)", "It is entirely a metaphor", "We should debate the scholars about it"], correctIndex: 1, hint: "The 'Rising' is known, but the 'how' is not." },
            { type: "quiz", question: "What does 'Ta'til' refer to in Islamic theology?", options: ["Affirming an attribute literally", "Likening Allah to creation", "Stripping or denying Allah of His established attributes", "Asking 'how' He does something"], correctIndex: 2, hint: "It means 'vacating' or denying." },
            { type: "quiz", question: "According to Sahih al-Bukhari 2736, what is the reward for the one who 'comprehends' (ahsaaha) the 99 names of Allah?", options: ["Wealth in this life", "They will enter Paradise", "They become a scholar", "Their sins are multiplied"], correctIndex: 1, hint: "Man ahsaha dakhalal jannah." },
            { type: "quiz", question: "What does 'Tamthil' mean?", options: ["Believing Allah is One", "Comparing or likening Allah's attributes to His creation", "Praising the Prophet", "Reading the Quran slowly"], correctIndex: 1, hint: "To make something like a mathal (example)." },
            { type: "document", title: "The 99 Names of Allah", description: "An interactive guide to deeply understanding and memorizing the beautiful names of the Creator.", url: "https://99namesofallah.name/", platform: "External Interactive Site" },
            { type: "document", title: "Aqeedah Al-Wasitiyyah", description: "Ibn Taymiyyah’s landmark book that systematically outlines the Sunni approach to the Names and Attributes.", url: "https://kalamullah.com/aqeedah-wasitiyyah.html", platform: "Kalamullah Library" }
        ]
    },
    {
        title: "Types of Shirk",
        blocks: [
            { type: "callout", content: "Shirk is the greatest injustice; it is to treat the creation as equal to the Creator in that which is unique to the Creator.", author: "Classical Theological Maxim" },
            { type: "objectives", items: ["Categorize Shirk into Major (Akbar) and Minor (Asghar)", "Understand the severe eternal consequences of Major Shirk", "Recognize Riyya' (showing off) as Minor Shirk", "Learn how to spot 'hidden shirk' in daily intentions"] },
            { type: "text", content: "## The Unforgivable Sin\n\nThe direct opposite of Tawheed is Shirk: associating partners with Allah. It is the only sin Allah explicitly states He will not forgive if a person dies without repenting from it. A believer must be acutely aware of its subtle and profound forms to truly protect their faith." },
            { type: "quran", translation: "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills. (Surah An-Nisa 4:48)", arabic: "إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ" },
            { type: "concept", translation: "Shirk Akbar (Major Shirk): Directing an act of worship to other than Allah. This completely nullifies Islam and sentences one to eternal fire if unrepented.", arabic: "الشرك الأكبر: صرف شيء من العبادة لغير الله، وهو مخرج من الملة" },
            { type: "infographic", layout: "grid", items: [
                { title: "Major Shirk (Akbar)", description: "Directing worship to others. Nullifies Islam entirely.", icon: "AlertTriangle" },
                { title: "Minor Shirk (Asghar)", description: "Showing off (Riya'), swearing by other than Allah. A major sin, but does not completely nullify Islam.", icon: "Eye" },
                { title: "Hidden Shirk (Khafi)", description: "Subtler than an ant crawling on a black stone in the dark of night.", icon: "Lock" },
                { title: "Amulets & Omens", description: "Believing charms can bring benefit or ward off evil.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Danger of Minor Shirk\n\nThe Prophet (PBUH) did not fear that his Ummah would return en masse to worshipping stone idols. Rather, he feared for them the subtler, psychological forms of idolatry—namely, performing good deeds specifically for the praise and validation of humanity." },
            { type: "hadith", translation: "The thing I fear for you the most is the minor shirk. They said: O Messenger of Allah, what is the minor shirk? He said: Ar-Riya' (showing off). (Musnad Ahmad 23630, Authentic)", arabic: "إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الأَصْغَرُ، قَالُوا: يَا رَسُولَ اللَّهِ، وَمَا الشِّرْكُ الأَصْغَرُ؟ قَالَ: الرِّيَاءُ" },
            { type: "scholar", translation: "Shirk in this Ummah is more hidden than the footsteps of an ant on a black rock in the dark of night. (Ibn Abbas)", arabic: "الشرك في هذه الأمة أخفى من دبيب النمل على الصفاة السوداء في ظلمة الليل" },
            { type: "quran", translation: "And [mention, O Muhammad], when Luqman said to his son while he was instructing him, 'O my son, do not associate [anything] with Allah. Indeed, association [with him] is great injustice.' (Surah Luqman 31:13)", arabic: "وَإِذْ قَالَ لُقْمَانُ لِابْنِهِ وَهُوَ يَعِظُهُ يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ ۖ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ" },
            { type: "reflection", translation: "True sincerity (Ikhlas) is treating praise and criticism from people as entirely equal. If your worship changes drastically when humans are watching, check your heart for the 'hidden ant'.", arabic: "الإخلاص الحقيقي هو أن يستوي المادح والذام عندك" },
            { type: "video", url: "https://www.youtube.com/watch?v=FqS2hH8DkE8" },
            { type: "conclusion", content: "Protecting our Tawheed requires constant vigilance over our intentions. Sincerity is the sword that slays the hidden idols residing in the chambers of our own hearts." },
            { type: "quiz", question: "Which sin will Allah absolutely not forgive if a person dies upon it?", options: ["Murder", "Theft", "Shirk (Associating partners with Him)", "Drinking alcohol"], correctIndex: 2, hint: "Surah An-Nisa 4:48." },
            { type: "quiz", question: "What did the Prophet (PBUH) explicitly define as 'Minor Shirk' in Musnad Ahmad 23630?", options: ["Idolatry", "Showing off (Ar-Riya')", "Missing a prayer", "Lying"], correctIndex: 1, hint: "Doing deeds purely for the praise of people." },
            { type: "quiz", question: "Does Minor Shirk (Asghar) completely remove a person from the fold of Islam?", options: ["Yes, immediately", "No, but it is one of the gravest major sins that nullifies that specific deed", "Only if done repeatedly", "It depends on their intention"], correctIndex: 1, hint: "It nullifies the specific deed it is attached to, not one's entire faith." },
            { type: "quiz", question: "What did Ibn Abbas compare the hidden nature of shirk to?", options: ["A needle in a haystack", "An ant crawling on a black rock in the dark of night", "A whisper in a hurricane", "A drop of poison in an ocean"], correctIndex: 1, hint: "It is incredibly subtle." },
            { type: "quiz", question: "According to Surah Luqman 31:13, what did Prophet Luqman describe shirk as to his son?", options: ["A minor mistake", "A great injustice (Zulm 'Azim)", "A temporary illusion", "A lack of intelligence"], correctIndex: 1, hint: "Inna ash-shirka la-dhulmun 'atheem." },
            { type: "document", title: "Sincerity vs Hypocrisy", description: "A detailed breakdown of how to identify and cure Riya' (showing off).", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute Monographs" },
            { type: "document", title: "Kitab At-Tawheed", description: "The definitive text on maintaining pure monotheism and avoiding the traps of modern and ancient shirk.", url: "https://kalamullah.com/kitab-atawheed.html", platform: "Kalamullah Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- ENHANCING MODULE 2 (LESSONS 3-5) WITH 20+ BLOCKS ---');
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
