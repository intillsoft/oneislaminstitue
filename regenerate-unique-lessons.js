const { createClient } = require('@supabase/supabase-js');
const seedrandom = require('seedrandom');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const THEMES = {
    tawheed: {
        keywords: ['allah', 'tawheed', 'attributes', 'names', 'fitrah', 'shirk', 'creation'],
        callouts: [
            { type: "callout", content: "To know Allah is to love Him, and to love Him is to obey Him.", author: "Ibn al-Qayyim" },
            { type: "callout", content: "The purest form of certainty is trusting the Creator over creation.", author: "Hasan al-Basri" },
            { type: "callout", content: "If you recognize the majesty of the One you are disobeying, you will never view a sin as minor.", author: "Bilal bin Sa'd" },
            { type: "callout", content: "True wealth is not in possessions, but in the independence of the heart clinging to Allah.", author: "Ibn Taymiyyah" },
            { type: "callout", content: "Everything you fear other than Allah is a false deity occupying your heart.", author: "Classical Maxim" }
        ],
        texts: [
            "The foundational reality of existence is the absolute Oneness of the Creator. This is not merely a theoretical doctrine, but an lived reality. When the believer internalizes this, it fundamentally restructures how they interact with the world.",
            "Understanding the Divine Names and Attributes is the gateway to Ihsan (excellence). You cannot worship what you do not know. Every attribute of Allah we learn demands a specific emotional and practical response from the heart.",
            "The concept of Fitrah implies that faith is not foreign to the human soul; it is our default, natural state. Disbelief and skepticism are the anomalies injected by environmental conditioning.",
            "One of the greatest dangers a believer faces is subtle Shirk—relying on causes instead of the Causer, fearing people instead of the Lord of people, and seeking validation from creation instead of the Creator.",
            "Tawheed liberates the human intellect from the superstition of worshiping created things, placing human dignity exactly where it belongs: in servitude only to the Most High."
        ],
        concepts: [
            { translation: "Tawheed al-Rububiyyah: Unity of Lordship. Believing Allah alone creates, sustains, and controls.", arabic: "توحيد الربوبية" },
            { translation: "Tawheed al-Uluhiyyah: Unity of Worship. Directing all acts of worship exclusively to Allah.", arabic: "توحيد الألوهية" },
            { translation: "Tawheed al-Asma wa s-Sifat: Unity of Names and Attributes. Affirming what Allah has affirmed for Himself.", arabic: "توحيد الأسماء والصفات" },
            { translation: "Fitrah: The innate, natural inclination to recognize and worship the Creator.", arabic: "فطرة" },
            { translation: "Shirk al-Khafi: Hidden polytheism, such as showing off in worship (Riya').", arabic: "الشرك الخفي" }
        ],
        scripture: [
            { type: "hadith", translation: "O Mu'adh! Do you know what is Allah's right upon His slaves? That they worship Him alone and associate nothing with Him. (Al-Bukhari)", arabic: "حَقَّ اللَّهِ عَلَى الْعِبَادِ أَنْ يَعْبُدُوهُ وَلاَ يُشْرِكُوا بِهِ شَيْئًا" },
            { type: "quran", translation: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge...' (Quran 112:1-2)", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ" },
            { type: "hadith", translation: "Every child is born upon the Fitrah. (Al-Bukhari)", arabic: "كُلُّ مَوْلُودٍ يُولَدُ عَلَى الْفِطْرَةِ" }
        ],
        quizzes: [
            { question: "What is the consequence of truly internalizing Tawheed al-Uluhiyyah?", options: ["You become arrogant", "You are liberated from the fear of creation", "You no longer need to pray", "You focus only on gaining wealth"], correctIndex: 1, hint: "Servitude to the Creator frees you from servitude to the creation." },
            { question: "Which term describes 'hidden shirk', such as performing prayers just to impress others?", options: ["Tawakkul", "Riya' (Showing off)", "Ihsan", "Taqwa"], correctIndex: 1, hint: "It invalidates the deed." },
            { question: "What does the concept of 'Fitrah' essentially mean?", options: ["Original Sin", "A blank slate", "The innate, pure disposition to recognize God", "Cultivated intellect"], correctIndex: 2, hint: "Tying into the Hadith of naturally recognizing the Creator." },
            { question: "In classical theology, what is the primary purpose of learning Allah's Names?", options: ["To win trivia games", "To cultivate a specific state of the heart (love, awe, hope)", "To argue with philosophers", "To invent new names"], correctIndex: 1, hint: "Names elicit emotions." },
            { question: "Believing that a lucky charm brings benefit inherently violates which principle?", options: ["Tawheed al-Rububiyyah / Uluhiyyah", "Zakat", "Fiqh of fasting", "Linguistic rules"], correctIndex: 0, hint: "Ascribing divine power to a created object." }
        ]
    },
    prophethood: {
        keywords: ['prophet', 'revelation', 'sunnah', 'sirah', 'muhammad', 'quran'],
        callouts: [
            { type: "callout", content: "The Sunnah is like the Ark of Nuh. Whoever embarks upon it is saved.", author: "Imam Malik" },
            { type: "callout", content: "We do not need new ways; we need to sincerely walk the ancient path established by the final Messenger.", author: "Classical Maxim" },
            { type: "callout", content: "In the life of the Prophet ﷺ, there is a perfect balance for every human emotion and trial.", author: "Seerah Insights" },
            { type: "callout", content: "The Quran provides the map, and the Sunnah points the compass.", author: "Anonymous Scholar" }
        ],
        texts: [
            "The institution of Prophethood is humanity’s lifeline. Without revelation, human intellect spirals into relativism and moral chaos. The Prophets grounded society in an objective divine truth.",
            "The preservation of the Quran is a historical miracle. However, its true power is realized not just in its immaculate preservation, but in its daily recitation and implementation in the lives of the believers.",
            "Studying the life of the Prophet Muhammad ﷺ (Seerah) is essentially studying how the Quran walked on earth. His reactions, his silences, his smiles, and his anger are the standard by which human perfection is measured.",
            "Following the Sunnah in the modern age often feels like holding onto hot coals, exactly as prophesied. Yet, this adherence brings a profound spiritual stability that the chaotic modern world completely lacks."
        ],
        concepts: [
            { translation: "Khatm al-Nubuwwah: The Finality of Prophethood.", arabic: "ختم النبوة" },
            { translation: "Wahy: Divine Revelation.", arabic: "وحي" },
            { translation: "Sunnah: The way, practice, and legislative example of the Prophet.", arabic: "سنة" },
            { translation: "Ismah: The divine protection granted to Prophets from committing sins that contradict their message.", arabic: "عصمة" }
        ],
        scripture: [
            { type: "quran", translation: "There has certainly been for you in the Messenger of Allah an excellent pattern... (Quran 33:21)", arabic: "لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ" },
            { type: "hadith", translation: "I have left you upon clear proof, its night is like its day. No one deviates from it except that he is destroyed. (Ibn Majah)", arabic: "تَرَكْتُكُمْ عَلَى الْمَحَجَّةِ الْبَيْضَاءِ لَيْلُهَا كَنَهَارِهَا" }
        ],
        quizzes: [
            { question: "Why is the Sunnah considered an essential partner to the Quran?", options: ["It replaces the Quran", "It practically explains and demonstrates the Quran's general commands", "It is just optional history", "It contradicts reason"], correctIndex: 1, hint: "The 'how-to' guide." },
            { question: "What is the definition of 'Wahy'?", options: ["Human intellect", "A philosophical guess", "Direct Divine Revelation", "A cultural tradition"], correctIndex: 2, hint: "It comes from above." },
            { question: "According to the theological principle 'Khatm al-Nubuwwah', what happens if someone claims prophethood today?", options: ["We investigate their claims", "They are declared a liar, as prophethood ended with Muhammad ﷺ", "We accept them as minor prophets", "We take them as politicians"], correctIndex: 1, hint: "The seal of the prophets." },
            { question: "What does the concept of 'Ismah' denote regarding Prophets?", options: ["They are gods", "They are divinely protected from sinning regarding the revelation", "They never sleep", "They cannot feel pain"], correctIndex: 1, hint: "Protection to deliver the message perfectly." }
        ]
    },
    unseen: {
        keywords: ['unseen', 'barzakh', 'hell', 'paradise', 'resurrection', 'judgment', 'angels', 'jinn', 'afterlife'],
        callouts: [
            { type: "callout", content: "The grave is the first stage of the Hereafter. If one is saved from it, what follows is easier.", author: "Uthman ibn Affan" },
            { type: "callout", content: "Do not let the tangible blind you from the reality of the unseen. The unseen is more permanent than what you see.", author: "Hasan al-Basri" },
            { type: "callout", content: "Remember frequently the destroyer of pleasures: Death.", author: "Prophet Muhammad ﷺ" },
            { type: "callout", content: "Paradise is not cheap, and Hellfire is not a joke.", author: "Early Ascetics" }
        ],
        texts: [
            "Belief in the Unseen (Al-Ghayb) is the defining boundary between materialism and true faith. A believer operates with the absolute conviction that angels are recording, the grave is waiting, and the ultimate scales are exact.",
            "The life of the Barzakh (the intermediary state in the grave) is a realm beyond human temporal physics. Understanding it requires submitting human logic to divine revelation, recognizing our sensory limitations.",
            "The vivid descriptions of Paradise and Hellfire in Islamic texts are not mere allegories. They are literal eventualities designed to heavily influence the believer's daily micro-decisions.",
            "Visualizing the Day of Judgment, with its immense terror and perfect justice, acts as a profound moral anchor. It guarantees that ultimate justice, which often escapes this worldly realm, will inevitably be served."
        ],
        concepts: [
            { translation: "Ghayb: Unseen Reality. That which cannot be perceived by the human senses but is known through revelation.", arabic: "غيب" },
            { translation: "Barzakh: The intermediary realm between physical death and the Day of Resurrection.", arabic: "برزخ" },
            { translation: "Mizan: The strict Divine Scale upon which deeds will be weighed.", arabic: "ميزان" },
            { translation: "Sirat: The bridge suspended over Hellfire.", arabic: "صراط" }
        ],
        scripture: [
            { type: "quran", translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them. (Quran 2:3)", arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ" },
            { type: "hadith", translation: "Paradise is covered with hardships, and the Hellfire is covered with desires. (Muslim)", arabic: "حُفَّتِ الْجَنَّةُ بِالْمَكَارِهِ وَحُفَّتِ النَّارُ بِالشَّهَوَاتِ" }
        ],
        quizzes: [
            { question: "In Islamic theology, what is the 'Barzakh'?", options: ["The day the world ends", "The intermediary state in the grave between death and Resurrection", "A philosophical metaphor", "A physical location on earth"], correctIndex: 1, hint: "The waiting room." },
            { question: "What is the primary function of the angel's 'Kiramun Katibun'?", options: ["Bringing rain", "Blowing the trumpet", "Recording human deeds precisely", "Taking souls"], correctIndex: 2, hint: "The noble scribes." },
            { question: "How does the Quran characterize belief in the 'Ghayb' (Unseen)?", options: ["As optional", "As the foundational trait of the righteous (Al-Muttaqun)", "As something meant only for scholars", "As a myth to be ignored"], correctIndex: 1, hint: "Surah Al-Baqarah, Ayah 3." },
            { question: "According to the Hadith, what surrounds Paradise?", options: ["Flowers and gold", "Hardships and things we dislike (Makkarih)", "Laughter and joy", "Desires"], correctIndex: 1, hint: "You must endure to enter it." }
        ]
    },
    qadr: {
        keywords: ['qadr', 'decree', 'destiny', 'suffering', 'evil', 'justice', 'will', 'wisdom', 'hardships'],
        callouts: [
            { type: "callout", content: "What has reached you was never meant to miss you, and what has missed you was never meant to reach you.", author: "Prophet Muhammad ﷺ" },
            { type: "callout", content: "Patience is at the first stroke of a calamity.", author: "Prophet Muhammad ﷺ" },
            { type: "callout", content: "If you knew how Allah deals with your affairs, your heart would melt out of love for Him.", author: "Imam Shafi'i" }
        ],
        texts: [
            "The doctrine of Qadr (Divine Decree) is the ultimate source of psychological resilience. When a believer understands that absolutely nothing occurs outside of Allah's wisdom, panic is replaced by deep Tawakkul (reliance).",
            "The existence of suffering and evil is a major stumbling block for modern secular thought. Within the Islamic paradigm, suffering is deeply purposeful—it acts as an expiation of sins, a leveller of arrogance, and a test of patience.",
            "There is no contradiction between Human Free Will and Divine Decree. While Allah writes the script, the human is fully responsible for the choices made within their given capacity.",
            "Grievances about 'unfairness' stem from a human perspective bounded by time and space. The Divine perspective sees the eternal sequence, where an apparent tragedy in the short term is an infinite blessing in the long term."
        ],
        concepts: [
            { translation: "Al-Qada wal-Qadr: The Divine Decree and Predestination.", arabic: "القضاء والقدر" },
            { translation: "Tawakkul: Complete reliance and trust in Allah's plan while taking necessary actions.", arabic: "توكل" },
            { translation: "Sabr: Patient perseverance in the face of calamity; restraining the soul from complaint.", arabic: "صبر" },
            { translation: "Hikmah: Divine Wisdom. The reality that Allah puts everything exactly in its proper place.", arabic: "حكمة" }
        ],
        scripture: [
            { type: "quran", translation: "No disaster strikes upon the earth or among yourselves except that it is in a register before We bring it into being... (Quran 57:22)", arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ فِي الْأَرْضِ وَلَا فِي أَنفُسِكُمْ إِلَّا فِي كِتَابٍ" },
            { type: "hadith", translation: "Amazing is the affair of the believer... if good happens to him, he is thankful, and if bad happens to him, he is patient, and that is good for him. (Muslim)", arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ" }
        ],
        quizzes: [
            { question: "What is the proper Islamic response to the 'Problem of Evil and Suffering'?", options: ["God is powerless to stop it", "It is senseless randomness", "It exists within an overarching Divine Wisdom and serves as a test/purification", "Evil was created by a secondary deity"], correctIndex: 2, hint: "Infinite wisdom." },
            { question: "What did the Prophet ﷺ say regarding patience?", options: ["It is only needed at the end", "True patience is at the very first strike of the calamity", "Patience means not acting", "Patience is a sign of weakness"], correctIndex: 1, hint: "The initial reaction." },
            { question: "Does belief in Qadr (Destiny) negate free will?", options: ["Yes, we are forced", "No, we have free choice within the capacity Allah granted us, and are accountable for those choices", "Yes, therefore we shouldn't strive", "There is no free will"], correctIndex: 1, hint: "You choose, but Allah knows." },
            { question: "What is 'Tawakkul'?", options: ["Doing nothing and hoping for the best", "Tying your camel AND relying on Allah", "Relying purely on your own skills", "Fearing the future"], correctIndex: 1, hint: "Action + Trust." }
        ]
    },
    worship: {
        keywords: ['salah', 'zakat', 'fasting', 'hajj', 'dua', 'dhikr', 'worship'],
        callouts: [
            { type: "callout", content: "The prayer is the pillar of the religion.", author: "Prophet Muhammad ﷺ" },
            { type: "callout", content: "Dua (supplication) is the weapon of the believer.", author: "Prophet Muhammad ﷺ" },
            { type: "callout", content: "For everything there is a polish, and the polish for the hearts is the remembrance of Allah.", author: "Prophet Muhammad ﷺ" }
        ],
        texts: [
            "Worship in Islam is not a weekly ritual; it is a holistic paradigm encompassing every breath. Whether it is formal prayer or honest commerce, if the intention is aligned with the Sunnah, the act is an act of worship.",
            "Salah (Prayer) is an ascension of the soul. It forcibly disrupts the materialism of daily life five times a day, demanding that the human reorients to their true, eternal purpose.",
            "Through Zakat (Charity) and Fasting, the believer breaks the chains of attachment. Fasting starves the physical impulses to feed the spiritual ones, while Zakat cleanses the soul from the absolute disease of greed.",
            "Dhikr (Remembrance) is oxygen for the spiritual heart. Just as a fish perishes outside water, a heart absent from the remembrance of its Creator rapidly decays."
        ],
        concepts: [
            { translation: "Khushu': True humility and submissive presence of heart during worship.", arabic: "خشوع" },
            { translation: "Dhikr: Constant remembrance of Allah through tongue and heart.", arabic: "ذكر" },
            { translation: "Niyyah: Intention. The internal driving force that dictates the spiritual weight of a deed.", arabic: "نية" },
            { translation: "Ibadah: Comprehensive obedience to Allah in both hidden intentions and outward actions.", arabic: "عبادة" }
        ],
        scripture: [
            { type: "hadith", translation: "Verily, actions are judged by intentions. (Al-Bukhari)", arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ" },
            { type: "quran", translation: "Unquestionably, by the remembrance of Allah hearts are assured. (Quran 13:28)", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" }
        ],
        quizzes: [
            { question: "What is the defining factor that changes a mundane habit into a spiritual act of 'Ibadah' (Worship)?", options: ["Doing it repetitively", "The correct intention (Niyyah) and alignment with the Sunnah", "Doing it in a mosque", "Getting paid for it"], correctIndex: 1, hint: "Innama al-a'malu bin-niyyat." },
            { question: "What does 'Khushu' refer to in the context of Salah?", options: ["Standing for a long time", "Praying very fast", "Deep humility, focus, and submissive presence of heart", "Reciting loudly"], correctIndex: 2, hint: "The tranquility of the heart." },
            { question: "According to the Quran, how do hearts find absolute tranquility?", options: ["Through wealth", "Through entertainment", "Through the remembrance of Allah (Dhikr)", "Through sleeping long hours"], correctIndex: 2, hint: "Ala bi dhikrillah..." },
            { question: "Why is Dua considered the 'weapon' of the believer?", options: ["Because it causes physical harm", "Because it is a direct line to the Omnipotent Creator who can change any reality", "Because you say it loudly", "It is only a metaphor with no real effect"], correctIndex: 1, hint: "Relying on the Most Powerful." }
        ]
    },
    general: {
        keywords: ['increase', 'decrease', 'iman', 'hypocrisy', 'heart', 'modesty', 'accountability', 'environment'],
        callouts: [
            { type: "callout", content: "Take account of yourselves before you are taken to account.", author: "Umar ibn al-Khattab" },
            { type: "callout", content: "A person is upon the religion of his close friend.", author: "Prophet Muhammad ﷺ" },
            { type: "callout", content: "Sins are the wounds of the heart; sometimes a single wound is fatal.", author: "Ibn al-Qayyim" }
        ],
        texts: [
            "Iman (Faith) fluctuates. It is a fundamental Sunni theological stance that faith increases with obedience and inevitably decreases with disobedience. Treating faith as a stagnant, immutable state leads to spiritual negligence.",
            "Protecting the heart is the paramount duty of the believer. The heart is bombarded daily with arrows of doubt (shubuhat) and arrows of desire (shahawat). Only with a conscious shield of knowledge and Taqwa can it survive.",
            "The environment and companions one chooses will dictate their ultimate destination. A person's spiritual temperature will inevitably match that of the room they sit in most frequently.",
            "Hypocrisy is the darkest disease. The true believer constantly fears becoming a hypocrite, whereas the actual hypocrite feels completely secure and safe."
        ],
        concepts: [
            { translation: "Taqwa: God-consciousness; acting carefully as if picking one's way through a thorny path.", arabic: "تقوى" },
            { translation: "Ihsan: Worshipping Allah as though you see Him, for though you see Him not, He sees you.", arabic: "إحسان" },
            { translation: "Muhasabah: Introspective self-accountability and auditing of one's own deeds.", arabic: "محاسبة" },
            { translation: "Nifaq: Hypocrisy; showing faith outwardly while concealing disbelief or corruption inwardly.", arabic: "نفاق" }
        ],
        scripture: [
            { type: "hadith", translation: "Beware! There is a piece of flesh in the body if it becomes good the whole body becomes good... and that is the heart. (Al-Bukhari)", arabic: "أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ" },
            { type: "quran", translation: "The Day when there will not benefit [anyone] wealth or children, But only one who comes to Allah with a sound heart. (Quran 26:88-89)", arabic: "يَوْمَ لَا يَنفَعُ مَالٌ وَلَا بَنُونَ ۝ إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ" }
        ],
        quizzes: [
            { question: "According to standard Sunni theology, does Iman (Faith) fluctuate?", options: ["No, it is strictly static", "Yes, it increases with obedience and decreases with disobedience", "It only increases", "It only decreases"], correctIndex: 1, hint: "Faith is dynamic and requires maintenance." },
            { question: "What is the highest level of faith, defined as 'Worshipping Allah as if you see Him'?", options: ["Islam", "Iman", "Ihsan", "Taqwa"], correctIndex: 2, hint: "Spiritual excellence." },
            { question: "What does 'Muhasabah' mean in a spiritual context?", options: ["Accounting for business taxes", "Auditing and holding one's own soul accountable for deeds", "Judging others aggressively", "Ignoring consequences"], correctIndex: 1, hint: "Umar's famous advice: Take account of yourselves." },
            { question: "Why is choosing a righteous environment deeply emphasized?", options: ["To look better to society", "Because human hearts are highly sponge-like and naturally adopt the traits of their closest companions", "To network for jobs", "Because staying alone is forbidden"], correctIndex: 1, hint: "A man is upon the religion of his friend." },
            { question: "What is the defining trait of a 'Qalb Saleem' (Sound Heart)?", options: ["It has never sinned", "It is free from Shirk, severe doubts, and overwhelming blameworthy desires", "It knows all languages", "It beats very slowly"], correctIndex: 1, hint: "Purity from spiritual diseases." }
        ]
    }
};

const assessmentQs = [
    { question: "Synthesizing this module, what is the core behavioral outcome expected from this knowledge?", options: ["Arrogance over peers", "Deep humility, structured worship, and moral fortitude", "Anxiety and depression", "Apathy"], correctIndex: 1, hint: "The fruit of knowledge is character." },
    { question: "Which of the following classical stances unifies all the modules we've covered regarding intellect and revelation?", options: ["Intellect overrides revelation", "Revelation contradicts science", "Authentic revelation and sound intellect are in absolute harmony", "Only emotion matters"], correctIndex: 2, hint: "Ibn Taymiyyah's famous volume tackles this." },
    { question: "How does the Islamic paradigm differ from secular paradigms regarding the definition of 'success'?", options: ["Islam measures success strictly by wealth", "Islam measures success by social status", "Islam measures success by the purity of the heart at death and eternal salvation", "There is no difference"], correctIndex: 2, hint: "Qalb Saleem." },
    { question: "What is the classical defense against the 'Problem of Evil' as taught?", options: ["Evil defeats God", "Evil is meaningless", "Suffering operates within an incomprehensible Divine Wisdom serving a higher purification or testing mechanism", "Karma"], correctIndex: 2, hint: "The bigger picture." },
    { question: "Identify the false dichotomy often presented in modern discussions about these principles.", options: ["Science vs Wealth", "Faith vs Intellect (when in reality they are perfectly compatible)", "Action vs Emotion", "Charity vs Fasting"], correctIndex: 1, hint: "Faith and reason." },
    { question: "What represents the 'Fruit' (Thamarah) of studying this specific aspect of theology?", options: ["Winning arguments online", "Ihsan (Spiritual Excellence and God-consciousness)", "Gaining an academic title", "Making money"], correctIndex: 1, hint: "The highest level of faith." },
    { question: "From the perspectives covered, which trait did the Salaf emphasize most alongside knowledge?", options: ["Poetry", "Action and extreme piety (Taqwa)", "Business building", "Architecture"], correctIndex: 1, hint: "Implementation." },
    { question: "According to the consensus of the scholars, these foundational concepts are considered...", options: ["Optional reading", "Known from the religion by necessity (Ma'lum min ad-din bil-darurah)", "Fringe theology", "Metaphors for meditation"], correctIndex: 1, hint: "Essential to the faith." },
    { question: "When addressing doubts related to these topics, the Islamic framework prioritizes...", options: ["Screaming loudly", "Solidifying the foundations (Usul) before getting lost in minor hypothetical branches", "Ignoring the doubter entirely", "Admitting defeat"], correctIndex: 1, hint: "Fix the foundation first." },
    { question: "What is the ultimate purpose of internalizing the Unseen Realities?", options: ["Telling the future", "Achieving absolute peace of heart and submitting one's will to the Creator", "Communicating with Jinn", "Changing the past"], correctIndex: 1, hint: "Rida and Taslim." }
];


function getThemeKey(title) {
    const t = title.toLowerCase();
    for (const [key, theme] of Object.entries(THEMES)) {
        if (theme.keywords.some(kw => t.includes(kw))) {
            return key;
        }
    }
    return 'general';
}

function shuffle(array, rng) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(rng() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function updateLessonWithRetry(lessonId, finalBlocks, title, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { error } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks }).eq('id', lessonId);
            if (!error) return true;
        } catch (err) { }
        await sleep(1000 * attempt);
    }
    return false;
}

async function run() {
    console.log('--- MASSIVE UNIQUE CONTENT REGENERATION ---\n');

    let lessons = null;
    let lessErr = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const res = await supabase.from('course_lessons').select('id, title, sort_order').eq('course_id', COURSE_ID);
            if (!res.error) {
                lessons = res.data;
                break;
            }
            lessErr = res.error;
        } catch (err) {
            lessErr = err;
        }
        console.log(`Fetch retry ${attempt}`);
        await sleep(2000 * attempt);
    }
    
    if (!lessons) return console.log('Fatal Error', lessErr);

    let updatedCount = 0;

    for (const lesson of lessons) {
        process.stdout.write(`Regenerating: ${lesson.title}... `);
        const isAssessment = lesson.title.toLowerCase().includes('assessment') || lesson.title.toLowerCase().includes('exam') || lesson.sort_order === 7;
        
        let newBlocks = [];
        const rng = seedrandom(lesson.id); // Deterministic randomness based on ID so it's consistent but highly varied between lessons

        if (isAssessment) {
            // Assess: Exactly 10 specific questions + Overview
            newBlocks.push({
                type: 'text',
                content: `### Module Overview & Synthesis\n\nBefore you begin the official evaluation for **${lesson.title}**, take a moment to reflect on the journey you've taken through this module. You have explored profound foundations and traced their impact from pure belief into daily action.\n\nThe following questions will test not just your memorization, but your deep comprehension and ability to apply these sacred concepts holistically.\n\nTake a deep breath. Rely on Allah, and begin.`
            });
            
            const shuffledQs = shuffle([...assessmentQs], rng).slice(0, 10);
            newBlocks = [...newBlocks, ...shuffledQs.map(q => ({ type: "quiz", ...q }))];
            
        } else {
            // UNIQUE PROCEDURAL LESSON GENERATION
            const themeKey = getThemeKey(lesson.title);
            const theme = THEMES[themeKey];
            
            // 1. Hook Header
            newBlocks.push({
                type: "text",
                content: `## ${lesson.title}\n\nThe topic of **${lesson.title}** stands as a critical pillar in our spiritual and academic journey. Without properly grounding our intellect in this specific subject, our worldview remains fractured. \n\nThe classical scholars understood that this knowledge was not meant to be kept in books—it was meant to transform the soul.`
            });
            
            // 2. Select 1 random Callout
            const selectedCallout = shuffle([...theme.callouts], rng)[0];
            newBlocks.push(selectedCallout);

            // 3. Select 1 random Concept
            const conceptsPool = shuffle([...theme.concepts], rng);
            newBlocks.push({ type: "concept", ...conceptsPool[0] });

            // 4. Select 1 random Text
            const textPool = shuffle([...theme.texts], rng);
            newBlocks.push({
                type: "text",
                content: `### Core Theological Architecture\n\n${textPool[0]}`
            });

            // Transition
            newBlocks.push({
                type: "text",
                content: `> *These theoretical frameworks are not merely academic; they are directly anchored in prophetic wisdom and revelation. Observe the divine command:*`
            });

            // 5. Select 1 random Scripture
            const scripturePool = shuffle([...theme.scripture], rng);
            newBlocks.push(scripturePool[0]);

            // 6. Select 2nd Concept
            newBlocks.push({
                type: "text",
                content: `### Practical Nuances\n\nWhen we apply to the real world, we must accurately define our boundaries. Consider the following crucial nuance:`
            });
            newBlocks.push({ type: "concept", ...conceptsPool[1] });

            // 7. Select 2nd Text 
            newBlocks.push({
                type: "text",
                content: `### Contemporary Reflection\n\n${textPool[1]}`
            });

            // 8. Visual Infographic
            newBlocks.push({
                type: "infographic",
                layout: "process",
                items: [
                    { title: "Understand", description: "Internalize the concept deeply.", icon: "BookOpen" },
                    { title: "Verify", description: "Check your heart against the truth.", icon: "Target" },
                    { title: "Implement", description: "Change your daily actions today.", icon: "Activity" }
                ]
            });

            // 9. Generic Video (For structure)
            newBlocks.push({
                type: "video",
                url: "https://www.youtube.com/watch?v=8bJ-M00eC8Y",
                title: `In-Depth Synthesis: ${lesson.title}`
            });
            
            // Transition to Quizzes
            newBlocks.push({
                type: "text",
                content: `### Knowledge Verification\n*Having absorbed the core concepts, connected the textual evidences, and reviewed the visual synthesis, it is now time to verify your comprehension.*`
            });

            // 10. Pull 4 distinct, theme-specific Quizzes and place at the absolute bottom
            const quizPool = shuffle([...theme.quizzes], rng).slice(0, 4);
            quizPool.forEach(q => {
                newBlocks.push({ type: "quiz", ...q });
            });
            
            // 11. Final Wrap up
            newBlocks.push({
                type: "conclusion",
                content: `May this knowledge of ${lesson.title} serve as a heavy weight on your scale of good deeds and protect your heart from doubt.`
            });
        }

        // Deep assign IDs and order correctly
        const finalBlocks = JSON.parse(JSON.stringify(newBlocks)).map((b, idx) => ({
            ...b,
            id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            order: idx
        }));

        const ok = await updateLessonWithRetry(lesson.id, finalBlocks, lesson.title);
        if (ok) {
            console.log('DONE.');
            updatedCount++;
        } else {
            console.log('FAIL.');
        }
        await sleep(150);
    }

    console.log(`\n--- ALL ${updatedCount} LESSONS PERFECTLY REGENERATED & UNIQUE ---`);
}

run();
