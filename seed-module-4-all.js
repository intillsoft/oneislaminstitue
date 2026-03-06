const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_ID = '397c5a91-b9b5-4649-aa00-6cc07a58e46e';

const LESSON_DATA = [
    {
        id: "95e4db43-1e8c-425f-a19f-058caeafc844",
        title: "The Nobility of Divine Knowledge",
        blocks: [
            { type: "objectives", items: ["Establish the ontological and epistemological priority of studying the Names and Attributes of Allah.", "Analyze the relationship between the nobility of a subject and the nobility of the science itself.", "Define the concept of ihsa’ (enumeration) as a comprehensive spiritual and intellectual process.", "Synthesize the concept of Ma’rifah moving beyond rote memorization toward deep experiential knowledge."] },
            { type: "concept", translation: "Tawhid al-Asma’ wa al-Sifat: The Oneness of Allah in His Names and Attributes.", arabic: "توحيد الأسماء والصفات" },
            { type: "concept", translation: "Ihsa’: The comprehensive process of counting, understanding, and acting upon the Divine Names.", arabic: "إحصاء" },
            { type: "text", content: "### The Most Noble Science\nThe study of the Names and Attributes of Allah is categorized by scholars as the most noble of all sciences. This status is derived from a fundamental principle in Islamic epistemology: the nobility of a science is directly proportional to the nobility of its subject matter. Since there is nothing more exalted than the Creator, the science dedicated to understanding His Essence (Dhat), His Names (Asma’), and His Attributes (Sifat) stands at the pinnacle of the religious disciplines." },
            { type: "scholar", translation: "Knowledge of Allah through His Attributes is the very essence of the call of the Messengers; it is the basis for all commands and the lens through which all creation is understood. (Ibn al-Qayyim, Al-Sawaa'iq al-Mursalah)", arabic: "ابن القيم" },
            { type: "quran", translation: "Allah, who created seven heavens and of the earth the like of them... so you may know that Allah is over all things competent and that Allah has encompassed all things in knowledge. (Surah al-Talaq 65:12)", arabic: "اللَّهُ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ... لِتَعْلَمُوا أَنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Foundational (Ilm)", description: "Intellectual grasp of the Names and textual proofs; corrects the creed.", icon: "Book" },
                { title: "Interpretive (Fahm)", description: "Grasping the depth, nuance, and pairings; increases awe.", icon: "Brain" },
                { title: "Devotional (Dua)", description: "Directing specific requests using relevant Names; builds intimacy.", icon: "Heart" },
                { title: "Transformative (Takhalluq)", description: "Modeling character after praiseworthy meanings; achieves Ihsan.", icon: "Star" }
            ]},
            { type: "text", content: "### The Concept of Ihsa’ (Enumeration)\nThe Prophetic tradition states: 'Allah has ninety-nine names... whoever ahsaha (enumerates them) enters Paradise.' Traditional commentaries clarify that ihsa’ is a multi-dimensional process. It involves the linguistic/cognitive dimension (memorizing & understanding), the spiritual/supplicatory dimension (calling upon Him by them), and the moral/behavioral dimension (taking upon the beautiful traits within human limits)." },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "text", content: "### The Greatest Name (Ism al-A'zam)\nThe etymological origin of the Name 'Allah' itself is often discussed by scholars as the 'Greatest Name' because it is the comprehensive Name that points to the Essence and encompasses the meanings of all other Names. Unlike other Names referring to a specific action (e.g., Al-Khaliq), 'Allah' signifies the One worshipped by right." },
            { type: "hadith", translation: "I call upon You by every one of the beautiful names by which You have described Yourself, or which You have revealed in Your Book, or have taught any one of Your creatures...", arabic: "أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ..." },
            { type: "callout", content: "The Name that Resonates: Select one Name of Allah that addresses a current personal struggle. How does the literal meaning of this Name change your perception of this 'impassable' problem?", author: "Application" },
            { type: "quiz", question: "Why is the science of Divine Names considered the 'most noble'?", options: ["Because it is the easiest to learn.", "Because the nobility of a science is proportional to its subject matter, and its subject is the Creator.", "Because it was the last science revealed.", "Because it requires no memorization."], correctIndex: 1, hint: "Nobility is linked to the subject." },
            { type: "quiz", question: "In classical scholarship (like Al-Ghazali), what is 'Ihsa'?", options: ["Merely memorizing the 99 names.", "Painting the names on a wall.", "A multi-dimensional process involving understanding, supplicating by, and acting upon the Names.", "Only reading them during Ramadan."], correctIndex: 2, hint: "It encompasses cognition, devotion, and transformation." },
            { type: "quiz", question: "Why does the Name 'Allah' stand as the most comprehensive Name?", options: ["It is the shortest.", "It points to the Essence and encompasses the meanings of all other Names and attributes of perfection.", "It is only a structural prefix.", "It applies to specific actions only."], correctIndex: 1, hint: "It encompasses all meanings." },
            { type: "reflection", translation: "If knowledge of Allah is the primary purpose of creation as suggested by Surah al-Talaq, how much of your daily intellectual effort is dedicated to this purpose?", arabic: "تفكر حول الغاية من الخلق" },
            { type: "document", title: "Approaching the Quran Through the Names of Allah", description: "Yaqeen Institute guide to understanding the Divine Names.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "5c002634-f1e3-4d0d-b75a-a1a60a55f544",
        title: "Safeguarding the Creed",
        blocks: [
            { type: "objectives", items: ["Master the four fundamental prohibitions regarding the Attributes: Tahrif, Ta'til, Takyif, Tamthil.", "Understand how the Sunni methodology avoids both the abstraction of philosophers and the anthropomorphism of literalists.", "Differentiate between Essential Attributes (Dhatiyyah) and Active Attributes (Fi'liyyah).", "Comprehend the principle of Tawqifiyyah concerning Divine Names."] },
            { type: "concept", translation: "Tahrif: Distortion; changing the text or its primary meaning without evidence.", arabic: "تحريف" },
            { type: "concept", translation: "Ta’til: Negation; denying the existence or the meaning of an attribute for Allah.", arabic: "تعطيل" },
            { type: "concept", translation: "Takyif: Specifying modality; attempting to describe the 'how' of a Divine Attribute.", arabic: "تكييف" },
            { type: "concept", translation: "Tamthil: Comparison; likening Allah's Attributes to the attributes of His creation.", arabic: "تمثيل" },
            { type: "text", content: "### The Golden Principle of Verification\nThe methodology of Ahl al-Sunnah regarding the Attributes is defined by a strict adherence to scriptural texts while upholding Divine transcendence: 'Affirmation without Likening, and Exaltation without Negation.' This path is anchored in Surah al-Shura: 'There is nothing like unto Him, and He is the All-Hearing, the All-Seeing' (42:11)." },
            { type: "quran", translation: "There is nothing like unto Him, and He is the Hearing, the Seeing. (Surah al-Shura 42:11)", arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### Navigating the Prohibitions\nThe four prohibitions safeguard belief. **Tahrif** alters meaning (e.g., claiming 'Hand' only means 'Power'). **Ta'til** denies the attribute entirely. **Takyif** is the dangerous attempt to explain the physical 'how' of an attribute. **Tamthil** is comparing Allah strictly to creation. The famous statement of Imam Malik regarding Allah rising over the Throne (Istiwa’) perfectly summarizes the Sunni approach: 'The meaning is known, but the how is unknown.'" },
            { type: "infographic", layout: "process", items: [
                { title: "Tahrif", description: "Distorting meaning -> Loss of guidance.", icon: "Edit3" },
                { title: "Ta'til", description: "Denying attribute -> Worshipping an abstract nothingness.", icon: "XCircle" },
                { title: "Takyif", description: "Asking 'How' -> Falling into speculative biology/physics.", icon: "HelpCircle" },
                { title: "Tamthil", description: "Comparing to creation -> Anthropomorphism (Shirk).", icon: "Users" }
            ]},
            { type: "text", content: "### Essential vs. Active Attributes\nAttributes are categorized into Essential Attributes (Sifat al-Dhatiyyah) which Allah is eternally described with (e.g., Life, Knowledge, Power), and Active Attributes (Sifat al-Fi’liyyah) which are related to His Will and Power (e.g., Rising over the Throne, His Coming, His Laughter). He acts upon the active attributes when and how He wills." },
            { type: "scholar", translation: "Whoever likens Allah to His creation has disbelieved, and whoever denies what Allah has described Himself with has disbelieved. (Nu’aym ibn Hammad)", arabic: "نعيم بن حماد" },
            { type: "callout", content: "Critique Exercise: A deviant text denies Allah's 'Hearing' saying it just means 'Knowing'. Write a critique identifying this as Ta'til (negation) disguised by Tahrif (distortion).", author: "Application" },
            { type: "quiz", question: "What does Surah al-Shura 42:11 ('There is nothing like unto Him, and He is the Hearing, the Seeing') ultimately balance?", options: ["Life and Death", "Total rejection of Tamthil (comparison) alongside total rejection of Ta'til (negation).", "Angels and Jinn", "Night and Day"], correctIndex: 1, hint: "Affirming without comparing." },
            { type: "quiz", question: "What is the difference between Tamthil and Takyif?", options: ["They are the exact same thing.", "Tamthil is comparing to creation; Takyif is attempting to explain the exact physical mechanism or 'how'.", "Tamthil means denying; Takyif means accepting.", "Tamthil is for angels, Takyif is for humans."], correctIndex: 1, hint: "Likening vs Specifying Modality." },
            { type: "quiz", question: "Which of the following is an example of an Active Attribute (Sifat al-Fi’liyyah)?", options: ["Life (Hayat)", "Knowledge (Ilm)", "Rising over the Throne (Istiwa’)", "Power (Qudrah)"], correctIndex: 2, hint: "It is related to His will and action." },
            { type: "reflection", translation: "Reflect on the theological danger of 'logic-first' approaches to the Attributes. Why must we rely on Revelation to describe Allah rather than our limited human imagination?", arabic: "تفكر منهجي" },
            { type: "document", title: "Aqeedah al-Tahawiyyah", description: "The definitive Sunni creed text clarifying the boundaries of the Attributes.", url: "https://kalamullah.com/", platform: "Aqeedah" }
        ]
    },
    {
        id: "4b0d39cc-c922-4e3a-9c04-14fe2ba7f287",
        title: "Names of Mercy: Ar-Rahman, Ar-Rahim",
        blocks: [
            { type: "objectives", items: ["Differentiate between the vastness of Al-Rahman and the particularity of Al-Rahim.", "Explore the Name Al-Wadud (The Loving), distinguishing Divine Love from human emotional fluctuation.", "Understand the theological concept of the 'One Hundred Parts of Mercy'.", "Implement the practical implications of mercy in daily human interactions."] },
            { type: "concept", translation: "Ar-Rahman: The Entirely Merciful; an attribute of the Essence, vast and all-encompassing for all creations.", arabic: "الرحمن" },
            { type: "concept", translation: "Ar-Rahim: The Especially Merciful; an attribute of action, particular to the believers.", arabic: "الرحيم" },
            { type: "concept", translation: "Al-Wadud: The Loving; the one who bestows affection, approval, and honor.", arabic: "الودود" },
            { type: "text", content: "### The Definitive Quality\nMercy is not merely one attribute among many; it is the definitive quality Allah prescribed for Himself. The Names Ar-Rahman and Ar-Rahim derive from the root R-H-M, which is the same root for 'womb' (rahim). Just as a womb provides an all-encompassing environment of protection and nourishment, Allah’s Rahmah provides the necessary conditions for all existence." },
            { type: "quran", translation: "And My mercy encompasses all things. (Surah Al-A'raf 7:156)", arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Ar-Rahman", description: "Vast, immediate, essential. Provides 'sun and rain' for believers and disbelievers alike.", icon: "Sun" },
                { title: "Ar-Rahim", description: "Permanent, active, specific. Provides 'guidance and salvation' specifically for believers.", icon: "Shield" },
                { title: "Al-Wadud", description: "The Loving. Divine love manifested through praise, reward, and intimacy.", icon: "Heart" },
                { title: "Al-Rau'f", description: "Intense pity, removal of hardship, and extreme kindness.", icon: "CloudRain" }
            ]},
            { type: "text", content: "### The One Hundred Parts of Mercy\nThe Prophet ﷺ explained that Allah divided mercy into one hundred portions, sending only one portion down to the earth. From this single portion originates every act of compassion in history (even a mother animal protecting her young). The remaining ninety-nine parts are reserved for the Day of Judgment to be showered upon the believers, serving as the ultimate antidote against despair." },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "hadith", translation: "Allah is more merciful to His servants than this mother is to her child.", arabic: "لَلَّهُ أَرْحَمُ بِعِبَادِهِ مِنْ هَذِهِ بِوَلَدِهَا" },
            { type: "text", content: "### Al-Wadud: True Divine Love\nHuman love often involves a 'softening' stemming from a need for companionship. Allah, being Al-Ghani (Self-Sufficient), loves in a transcendently different manner. His love (Al-Wadud) involves praising His servants, rewarding them, and granting them honor. Al-Wadud is often paired with Al-Ghafur (The Oft-Forgiving), showing that His love is not withdrawn upon making mistakes, as long as the servant returns to Him." },
            { type: "callout", content: "Cycle of Mercy: Identify one person or creature you feel 'indifferent' toward and perform an act of kindness for them today. Be a vehicle for Ar-Rahman.", author: "Action Item" },
            { type: "quiz", question: "What is the primary difference between Ar-Rahman and Ar-Rahim in Sunni theology?", options: ["There is no difference.", "Ar-Rahman is for the afterlife, Ar-Rahim is for this life.", "Ar-Rahman is vast, essential mercy for all creation; Ar-Rahim is active, specific mercy for believers.", "Ar-Rahman means angry, Ar-Rahim means calm."], correctIndex: 2, hint: "General vs. Specific." },
            { type: "quiz", question: "What does the root word of Rahman/Rahim (r-h-m) share its linguistic origin with?", options: ["The Arabic word for 'Womb'", "The Arabic word for 'Rain'", "The Arabic word for 'Light'", "The Arabic word for 'Food'"], correctIndex: 0, hint: "A place of protection and nourishment." },
            { type: "quiz", question: "Where are the remaining ninety-nine parts of Allah's mercy?", options: ["Hidden in the ocean.", "Given entirely to the angels.", "Reserved for the Day of Judgment to shower upon the believers.", "Distributed equally across all planets."], correctIndex: 2, hint: "To be used in the afterlife." },
            { type: "reflection", translation: "If Allah says 'My mercy prevails over My wrath,' why do we often focus on His wrath first when considering our own mistakes?", arabic: "تفكر عن سعة الرحمة" },
            { type: "document", title: "Al-Rahman: An Encompassing Wardship", description: "SeekersGuidance article exploring the vastness of Divine Mercy.", url: "https://seekersguidance.org/", platform: "SeekersGuidance" }
        ]
    },
    {
        id: "a4ae690f-7611-49d5-ba64-71afca0bec42",
        title: "Names of Majesty and Sovereignty",
        blocks: [
            { type: "objectives", items: ["Explore the Divine Attributes of Authority: Al-Malik, Al-Quddus, and Al-Aziz.", "Distinguish between worldly authority and absolute Divine Sovereignty.", "Understand the concept of Izzah (true honor) stemming from Al-Aziz.", "Analyze how the Names of Majesty generate humility and psychological security."] },
            { type: "concept", translation: "Al-Malik: The King; the Absolute Sovereign who possesses all things.", arabic: "الملك" },
            { type: "concept", translation: "Al-Quddus: The Most Holy; the One free from all defects and anthropomorphic flaws.", arabic: "القدوس" },
            { type: "concept", translation: "Al-Aziz: The Almighty; the Invincible whose power none can match.", arabic: "العزيز" },
            { type: "text", content: "### The Absolute Sovereign\nThe Names of Majesty (Jalal) establish the universe's hierarchy, placing Allah as the Source of all power. Al-Malik (The King) signifies absolute and eternal ownership. Knowing Allah as Al-Malik demands that the believer acts with accountability, realizing they are merely a guest and steward in His Kingdom." },
            { type: "quran", translation: "He is Allah, besides whom there is no god, the King (Al-Malik), the Most Holy (Al-Quddus), the Source of Peace (As-Salam)... (Surah al-Hashr 59:23)", arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ" },
            { type: "text", content: "### The Purity of the King\nWhy is Al-Quddus (The Holy/Pure) mentioned immediately after Al-Malik? Human kings are often associated with flaws, greed, and corruption. By stating He is Al-Quddus, Allah clarifies that His sovereignty is utterly pure and free from injustice or defect. He transcends human projections of authority." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "infographic", layout: "process", items: [
                { title: "Al-Malik", description: "Absolute Possession. Result: Humility.", icon: "Crown" },
                { title: "Al-Quddus", description: "Flawless Purity. Result: Restoring awe and reverence.", icon: "Star" },
                { title: "Al-Aziz", description: "Invincible Might. Result: True honor (Izzah) and courage.", icon: "Shield" },
                { title: "Al-Jabbar", description: "The Compeller/Mender. Result: Healing brokenness.", icon: "Activity" }
            ]},
            { type: "text", content: "### Finding True Honor (Izzah)\nAl-Aziz translates to The Almighty, but in Arabic, it also carries the meaning of being 'rare' or 'noble'. It is the source of all Izzah (honor). Seeking dignity through worldly status or human approval is futile. True Izzah is found entirely in being a devoted servant ('abd) to the Almighty." },
            { type: "scholar", translation: "Whoever desires honor (Izzah)—then to Allah belongs all honor. (Quran 35:10)", arabic: "مَن كَانَ يُرِيدُ الْعِزَّةَ فَلِلَّهِ الْعِزَّةُ جَمِيعًا" },
            { type: "callout", content: "Sovereignty Audit: List three things you 'fear' (a boss, a bill). Next to each, write how the attributes of Al-Malik and Al-Aziz render those fears manageable by transferring authority back to the Creator.", author: "Action Item" },
            { type: "quiz", question: "How does the Name Al-Quddus dynamically correct human understanding of the Name Al-Malik (The King)?", options: ["It proves He is far away.", "It clarifies that unlike human kings who have flaws and corruption, the Divine King is completely pure and free of any defect.", "It limits His kingdom.", "It states that He is peaceful."], correctIndex: 1, hint: "Purity alongside power." },
            { type: "quiz", question: "Where must a believer seek true 'Izzah' (Honor/Might) according to the Qur'an?", options: ["Through accumulating wealth.", "Through social media fame.", "To Allah belongs all honor; it is found in servitude to Al-Aziz.", "Through political connections."], correctIndex: 2, hint: "Quran 35:10." },
            { type: "quiz", question: "What are the two profound meanings of the Name Al-Jabbar?", options: ["The Small and The Quiet.", "The Compeller (who enforces His will) and the Mender (who restores broken souls and bones).", "The Creator and The Destroyer.", "The First and The Last."], correctIndex: 1, hint: "Power and Care." },
            { type: "reflection", translation: "How does acknowledging the 'Almighty' provide an 'antidote to defeatism' when facing massive worldly challenges?", arabic: "تفكر عن العزة" },
            { type: "document", title: "Dignity Through Obedience: Reflecting on Al-Aziz", description: "Yaqeen Institute paper on discovering spiritual worth.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "daa93f19-6972-47a9-9ebb-971e9c13a2d5",
        title: "Names of Knowledge, Wisdom, and Justice",
        blocks: [
            { type: "objectives", items: ["Explore the cognitive attributes: Al-Alim (The All-Knowing), Al-Hakim (The Wise), and Al-Adl (The Just).", "Analyze the significance of attribute pairings in the Quran (e.g., Aziz Hakim).", "Understand the difference between general knowledge (Al-Alim) and subtle inner awareness (Al-Khabir).", "Develop a theological framework for accepting Divine Justice and Decree (Qadar)."] },
            { type: "concept", translation: "Al-Alim: The All-Knowing; whose knowledge encompasses the seen and unseen, past and future.", arabic: "العليم" },
            { type: "concept", translation: "Al-Khabir: The All-Aware; who knows the inner, subtle details and reality of all things.", arabic: "الخبير" },
            { type: "text", content: "### The Architecture of Supreme Logic\nThe Attributes of Knowledge and Wisdom provide the structural logic of the universe. Allah is Al-Alim; His knowledge is absolute, not preceded by ignorance, and encompasses the 'hidden' (Ghayb) and the 'witnessed'. He knows the counter-factual—what would have happened if things were different." },
            { type: "quran", translation: "Does He who created not know, while He is the Subtle (Al-Latif), the Aware (Al-Khabir)? (Surah al-Mulk 67:14)", arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Al-Alim", description: "General, absolute knowledge. Fosters trust in His choices.", icon: "Globe" },
                { title: "Al-Khabir", description: "Awareness of the subtle 'inner' reality. Fosters absolute sincerity.", icon: "Eye" },
                { title: "Al-Hakim", description: "The Wise; applying knowledge with perfect purpose.", icon: "Brain" },
                { title: "Al-Adl", description: "Absolute Fairness. Free from oppression (Zulm).", icon: "Scale" }
            ]},
            { type: "text", content: "### Wisdom (Al-Hakim) and Peace of Mind\nWisdom is the application of knowledge with perfect purpose. The Quran frequently pairs Al-Hakim (The Wise) with Al-Aziz (The Almighty). This ensures the believer that while Allah has the power to do absolutely anything, He only does that which is wise. This Name provides solace in 'unanswered prayers' and 'unexplained trials', trusting there is profound purpose." },
            { type: "hadith", translation: "O My servants, I have forbidden oppression (zulm) for Myself and have made it forbidden among you... (Sahih Muslim)", arabic: "يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي" },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "text", content: "### Justice (Al-Adl) and Forgiveness\nOppression (Zulm) stems from a lack of knowledge, a lack of power, or a lack of wisdom—all impossible for Allah. He never punishes more than deserved, and never lets a good deed go lost. Paired with Al-Ghafur (The Forgiving), it teaches that His Justice operates within the massive framework of His Mercy." },
            { type: "callout", content: "Decree Exercise: Analyze a 'Difficult Decree' from your past. Note your limited knowledge at the time (Fear/Anger) versus the Wisdom (Hikmah) you can see now, acknowledging Al-Hakim.", author: "Action Item" },
            { type: "quiz", question: "What is the specific nuanced difference between Al-Alim and Al-Khabir?", options: ["Al-Alim knows the future; Al-Khabir knows the past.", "Al-Alim refers to general absolute knowledge; Al-Khabir refers to deep, expert awareness of the hidden subtle, inner workings.", "Al-Alim is for humans; Al-Khabir is for animals.", "They mean exactly the same thing."], correctIndex: 1, hint: "Knowledge vs. Subtle Awareness." },
            { type: "quiz", question: "Why is the pairing of Al-Aziz (Almighty) and Al-Hakim (The Wise) so critical for the believer's peace of mind?", options: ["It proves He has boundless power but ONLY uses it with perfect, purposeful wisdom.", "It proves He is harsh.", "It shows He is distant.", "It means we don't have to pray."], correctIndex: 0, hint: "Power checked by Wisdom." },
            { type: "quiz", question: "Why is it logically impossible for Allah to commit 'Zulm' (Oppression/Injustice)?", options: ["Because oppression comes from ignorance or weakness, which are impossible for Him.", "Because the angels prevent Him.", "Because He promised humans He wouldn't.", "None of the above."], correctIndex: 0, hint: "Lack of knowledge or power." },
            { type: "reflection", translation: "If you truly lived with the awareness of Al-Sami' (The Hearing) and Al-Basir (The Seeing), how would your private actions change today?", arabic: "تفكر عن المراقبة" },
            { type: "document", title: "Cambridge Muslim College: Names of Knowledge", description: "Academic breakdown of Allah's omniscience.", url: "https://cambridgemuslimcollege.ac.uk/", platform: "CMC Library" }
        ]
    },
    {
        id: "2f488fd7-5e38-4df6-adc1-91c1164f68fd",
        title: "Spiritual Psychology of the Names",
        blocks: [
            { type: "objectives", items: ["Analyze the balance of Khawf (Fear) and Raja’ (Hope) as the 'two wings' of faith.", "Apply modern attachment theory to the 'God Image'.", "Identify how Names like Al-Mu'min and Al-Muhaymin foster a secure attachment to the Divine.", "Understand the spiritual concept of 'Al-Firar' (Fleeing to Allah)."] },
            { type: "concept", translation: "Khawf: Reverent fear of Allah’s justice and the loss of His pleasure (preventing arrogance).", arabic: "خوف" },
            { type: "concept", translation: "Raja’: Sincere hope in Allah’s mercy and reward (preventing despair).", arabic: "رجاء" },
            { type: "text", content: "### The Bird of Faith\nThe classical metaphor for the human spirit is the 'Bird of Faith'. Its head is Love (Mahabbah), and its two wings are Fear (Khawf) and Hope (Raja’). If the head is missing, the bird is dead. If one wing is missing, it cannot fly. Excessive fear leads to despair; excessive hope leads to complacency and sin. True hope actively works while trusting the Generous Employer." },
            { type: "quran", translation: "So flee to Allah! Indeed, I am to you from Him a clear warner. (Surah Adh-Dhariyat 51:50)", arabic: "فَفِرُّوا إِلَى اللَّهِ ۖ إِنِّي لَكُم مِّنْهُ نَذِيرٌ مُّبِينٌ" },
            { type: "infographic", layout: "process", items: [
                { title: "Secure Attachment", description: "Focus: Al-Wadud, Al-Mu'min. Result: Balanced peace, reliance.", icon: "ShieldCheck" },
                { title: "Anxious Attachment", description: "Focus: Exclusively Al-Qahhar. Result: Guilt-driven, burnout.", icon: "AlertTriangle" },
                { title: "Avoidant Attachment", description: "Focus: Al-Ghani (Misunderstood). Result: Emotional distance, ritualism.", icon: "UserMinus" }
            ]},
            { type: "text", content: "### Secure Attachment and Al-Mu'min\nResearch shows a believer's 'God Image' impacts their mental health. Viewing Allah through Names of benevolence fosters a Secure Attachment—viewing Allah as a 'Safe Haven'. The Name Al-Mu'min (The Giver of Security/Faith) signifies an inner sanctuary that no worldly crisis can shake. This state is known as Al-Firar (Fleeing to Allah)—fleeing from His justice, directly to His mercy." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "hadith", translation: "Allah says: 'I am as My servant thinks of Me...' (Sahih Muslim)", arabic: "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي" },
            { type: "callout", content: "God-Image Assessment: Are you more prone to despair or complacency? Decide if you need to meditate on a 'Mercy Name' to cure anxiety, or a 'Majesty Name' to cure laziness.", author: "Action Item" },
            { type: "quiz", question: "In the 'Bird of Faith' metaphor, what represents the head and what represents the two wings?", options: ["Head: Knowledge, Wings: Money and Health.", "Head: Love (Mahabbah), Wings: Fear (Khawf) and Hope (Raja’).", "Head: Fear, Wings: Angels.", "Head: The Prophet, Wings: The Companions."], correctIndex: 1, hint: "Love drives it, fear and hope guide it." },
            { type: "quiz", question: "What is the spiritual danger of having only the wing of 'Fear'?", options: ["It leads to deep, paralyzing despair (qunut), which is prohibited.", "It makes you too nice.", "It forces you to read too much.", "It leads to sin."], correctIndex: 0, hint: "Losing hope in God." },
            { type: "quiz", question: "What does the phrase 'Al-Firar' (Fleeing to Allah) signify?", options: ["Running away from the mosque.", "Unlike fleeing from a human threat which takes you away, fleeing from Allah's justice takes you directly towards His protection and mercy.", "Running in a physical circle.", "Avoiding responsibilities."], correctIndex: 1, hint: "Fleeing TO Him, not FROM Him." },
            { type: "reflection", translation: "Reflect on 'I am as My servant thinks of me.' If you consciously chose to think of Allah as your primary protector (Al-Wali) today, what anxieties would vanish?", arabic: "أنا عند ظن عبدي بي" },
            { type: "document", title: "Belief in Divine Love: Attachment Theory", description: "Using modern psychology to understand our relationship with the Divine Names.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "72dddc6c-20f2-4366-a7a5-568caacb7eb2",
        title: "Living the Names (Culmination)",
        blocks: [
            { type: "objectives", items: ["Synthesize the module's themes into a practical framework for character development (takhalluq).", "Differentiate between attributes of emulation (e.g., Al-Karim) versus attributes of submission (e.g., Al-Khaliq).", "Solidify the practice of 'Dhikr' as living constantly aware of the Divine Names.", "Complete the final assessment of the module."] },
            { type: "concept", translation: "Takhalluq: Modeling one’s character after the praiseworthy, relative meanings of Divine Names.", arabic: "التخلق" },
            { type: "concept", translation: "Ubudiyyah: The state of complete servitude and love for Allah.", arabic: "عبودية" },
            { type: "text", content: "### The Goal is Transformation\nThe ultimate objective of knowing the Names and Attributes is the transformation of the human soul (takhalluq). It involves looking at the 'Beauty' of Allah's attributes and allowing them to polish one's own character. Because He is Al-Afuww (The Pardoner), the believer strives to pardon. Because He is Al-Karim (The Generous), the believer must be generous." },
            { type: "quran", translation: "And to Allah belong the best names, so invoke Him by them... (Surah Al-A'raf 7:180)", arabic: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Emulate (Takhalluq)", description: "Names of mercy, patience, and generosity. We adopt these traits.", icon: "UserCheck" },
                { title: "Submit (Ubudiyyah)", description: "Names of supremacy (Al-Khaliq, Al-Mutakabbir). We submit to these.", icon: "ArrowDownCircle" },
                { title: "Reflect (Dhikr)", description: "Seeing the effects of His Names in constant daily events.", icon: "Eye" },
                { title: "Supplicate (Dua)", description: "Calling upon Him using the specific Name needed for the specific request.", icon: "MessageSquare" }
            ]},
            { type: "text", content: "### The Limit of Emulation\nTakhalluq must be balanced with Ubudiyyah (servitude). Certain Names are exclusive. A human attempting to emulate Al-Mutakabbir (The Supreme/Proud) falls into the sin of arrogance. The perfection of the human lies in being a perfect servant to the perfect Lord, as Imam Al-Ghazali detailed in his counsels." },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "callout", content: "The Final Plan: Choose one 'Emulatable Name' (e.g. As-Sabur, the Patient) and commit to one specific action today that physically manifests that attribute to someone around you.", author: "Weekly Action" },
            { type: "quiz", question: "What does 'Takhalluq' mean in the context of Allah's Names?", options: ["Memorizing the names perfectly.", "Modeling and beautifying one's own character based on the praiseworthy meanings of the Names.", "Speaking Arabic.", "Avoiding all worldly actions."], correctIndex: 1, hint: "Taking on the character traits." },
            { type: "quiz", question: "Why should a believer NOT attempt to emulate the Name 'Al-Mutakabbir' (The Supreme/Proud)?", options: ["Because it is too long a name.", "Because the perfection of a human is in Ubudiyyah (servitude), and attributes of supreme pride belong only to the Creator; emulation here is arrogance.", "Because angels possess it.", "None of the above."], correctIndex: 1, hint: "A servant wears the garment of humility." },
            { type: "quiz", question: "According to the final summary, how does constant 'Dhikr' change our daily reality?", options: ["It turns the whole physical world into a mirror reflecting the effects of the Divine Attributes.", "It gives us loud voices.", "It prevents us from eating.", "It guarantees immediate wealth."], correctIndex: 0, hint: "Seeing His signs everywhere." },
            { type: "reflection", translation: "If your heart is a mirror, how clean is it right now? How much of the Divine Beauty (mercy, justice, love) is actually reflecting off of your actions?", arabic: "إن الله جميل يحب الجمال" },
            { type: "document", title: "Al-Maqsid al-Asna", description: "Imam al-Ghazali on the 99 Beautiful Names of God.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 4 (NAMES AND ATTRIBUTES) ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
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

        const { error } = await supabase.from('course_lessons').update({ 
            content_blocks: finalBlocks,
            title: item.title 
        }).eq('id', item.id);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE (${finalBlocks.length} Blocks Seeded)`);
        }
    }
}

seedLessons();
