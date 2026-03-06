const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_DATA = [
    {
        id: "32e3535d-b752-48bd-999a-03b0294a2e59",
        title: "Definition of Iman in Qur’an and Sunnah",
        blocks: [
            { type: "objectives", items: ["Define the six pillars of faith (Arkan al-Iman) as categorized in the Hadith of Jibril.", "Analyze the relationship between Islam, Iman, and Ihsan as distinct but interconnected levels of the religion.", "Critique the historical and pedagogical significance of the Hadith of Jibril.", "Identify the scriptural evidence for faith being both an internal conviction and an outward manifestation."] },
            { type: "concept", translation: "Iman: A comprehensive term for belief that encompasses conviction in the heart, testimony by the tongue, and actions by the limbs.", arabic: "الإيمان" },
            { type: "concept", translation: "Arkan al-Iman: The six foundational pillars of faith—belief in Allah, His angels, His books, His messengers, the Last Day, and the Divine Decree.", arabic: "أركان الإيمان" },
            { type: "concept", translation: "Ghayb: The realm of the unseen; realities beyond human sensory perception affirmed through Divine revelation.", arabic: "غيب" },
            { type: "text", content: "### The Pedagogical Framework of the Hadith Jibril\nThe study of Islamic faith begins with the most significant educational encounter in the Prophetic biography: the Hadith of Jibril. Often called the \"Mother of the Sunnah,\" it maps out the entirety of the religion. When Jibril (as) appeared as a stranger with intensely white clothing and black hair, he sat before the Prophet ﷺ in a posture of humility, modeling the ultimate adab (etiquette) of a student seeking knowledge." },
            { type: "text", content: "### Islam, Iman, and Ihsan\nThe dialogue established three ascending levels of the religion. Islam represents the outward submission—the five pillars structuring a physical life. Iman represents the internal dimensions—the six pillars grounding the soul. Ihsan is the pinnacle, where internal belief and outward submission are perfected through constant awareness of the Divine Presence. These levels are profoundly interconnected; outward submission nurtures inner belief, which blossoms into spiritual excellence." },
            { type: "infographic", layout: "grid", items: [
                { title: "Islam", description: "Outward submission (5 Pillars).", icon: "Activity" },
                { title: "Iman", description: "Inward faith (6 Pillars).", icon: "Heart" },
                { title: "Ihsan", description: "Spiritual excellence & constant awareness.", icon: "Star" },
                { title: "Integration", description: "True faith requires all parts to function seamlessly.", icon: "Link" }
            ]},
            { type: "text", content: "### The Six Pillars: A Systemic Worldview\nThe six pillars of Iman represent a comprehensive worldview explaining human existence. Belief in Allah requires a deep recognition of His absolute Oneness (Tawheed). Belief in Angels expands consciousness to the spiritual hierarchy. Belief in Books and Messengers establishes the mechanism of Divine guidance. Belief in the Last Day provides the moral framework of accountability. Belief in Divine Decree (Qadr) reconciles human responsibility with Divine sovereignty." },
            { type: "text", content: "### Faith as a Multi-Dimensional Reality\nIman is more than intellectual acknowledgment. Classical Sunni scholarship defines it as \"affirmation in the heart and deeds with the limbs.\" The highest branch of faith is declaring \"There is no god but Allah,\" and the humblest is removing harm from a road. Every moral choice manifests one's faith." },
            { type: "quran", translation: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers... (Surah Al-Baqarah 2:285)", arabic: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ" },
            { type: "quran", translation: "O you who have believed, believe in Allah and His Messenger and the Book that He sent down... (Surah An-Nisa 4:136)", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ وَالْكِتَابِ الَّذِي نَزَّلَ عَلَىٰ رَسُولِهِ" },
            { type: "hadith", translation: "Sahih Muslim, Hadith 8: The Hadith of Jibril establishing Islam, Iman, Ihsan, and the signs of the Hour.", arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ..." },
            { type: "text", content: "### The Concept of the Unseen (Al-Ghayb)\nFaith requires trusting realities not accessible to human senses. The Qur'an describes the God-conscious as those who \"believe in the Unseen.\" This supra-rational belief is based on trust (Tasdiq) in the Messenger ﷺ. This orientation provides a psychological \"refuge\" from materialistic nihilism, offering deep security and focus on the eternal." },
            { type: "conclusion", content: "Iman is the foundation of inner security and intellectual peace. By affirming the Unseen and practicing its branches, the believer builds a fortress against despair, ensuring a balanced, holistic devotion." },
            { type: "callout", content: "Real Life Application:\n- Integrating the Pillars: Choose one pillar of faith each week to deeply reflect upon and observe its effects.\n- Practicing the Branches: Perform a 'humble' branch of faith, such as removing litter or smiling, specifically as an act of worship.\n- Active Inquiry: Cultivate the habit of asking sincere, meaningful questions that lead to religious growth.", author: "Action Items for True Understanding" },
            { type: "video", url: "https://www.youtube.com/watch?v=yWwOimr2D38" },
            { type: "quiz", question: "Which of the following is considered the 'Mother of the Sunnah' for defining the religion?", options: ["Farewell Sermon", "Hadith of Jibril", "Treaty of Hudaybiyyah", "Constitution of Medina"], correctIndex: 1, hint: "It involved an angel asking questions." },
            { type: "quiz", question: "How many branches of faith are mentioned in Prophetic narrations?", options: ["Five", "Six", "Over sixty or seventy", "Exactly ninety-nine"], correctIndex: 2, hint: "Bid'un wa Sab'un." },
            { type: "quiz", question: "Which pillar of faith provides a framework for moral accountability?", options: ["Belief in Angels", "Belief in the Last Day", "Belief in Books", "Belief in Messengers"], correctIndex: 1, hint: "Where deeds are weighed." },
            { type: "reflection", translation: "Explain why 'modesty' is considered a branch of faith rather than just a social etiquette. Describe the technical meaning of Iman according to Ahl al-Sunnah.", arabic: "مراجعة الذات" },
            { type: "reflection", translation: "Reflect on the posture of Jibril (as) when he sat before the Prophet ﷺ. What does this teach us about the relationship between physical state and spiritual receptiveness?", arabic: "تفكر" },
            { type: "document", title: "Resources for Lesson 1", description: "Links: Yaqeen Institute (Faith is Refuge, Climbing the Spiritual Mountain).", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "f5fa40cf-b949-4fed-82bd-34853909ba09",
        title: "Linguistic vs Technical Meaning of Faith",
        blocks: [
            { type: "objectives", items: ["Explicate the Arabic root of 'Iman' and its connection to security and trust.", "Distinguish between a general linguistic affirmation and the specific technical parameters of Islamic faith.", "Evaluate why 'Tasdiq' (affirmation) differentiates a believer from a mere knower.", "Describe the social implications of being a 'Mu’min'."] },
            { type: "concept", translation: "Al-Amn: The root meaning of security, safety, and freedom from fear.", arabic: "الأمن" },
            { type: "concept", translation: "Tasdiq: Sincere affirmation and acceptance of the truth in the heart.", arabic: "تصديق" },
            { type: "concept", translation: "Mu’min: A believer; linguistically, one who grants security or is safe.", arabic: "مؤمن" },
            { type: "text", content: "### The Etymological Foundation: Iman as Security\nThe Arabic word Iman is derived from the root a-m-n, meaning safety, security, and tranquility. Linguistically, Iman refers to an internal state of affirming truth that removes doubt and brings peace. A Mu’min enters a state of Amn (security) with Allah, trusting the Creator to find safety from existential anxieties, fear of death, and the terror of Judgment." },
            { type: "quran", translation: "[He] who has fed them, [saving them] from hunger and made them safe, [saving them] from fear. (Surah Quraysh 106:4)", arabic: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ" },
            { type: "text", content: "### The Mu’min as a Source of Security\nThis linguistic root also defines social impact. The Prophet ﷺ stated: \"The believer is the one from whom people's lives and property are safe.\" A Mu’min's identity requires horizontally committing to the safety of creation. If one is untrustworthy (Amanah) or induces fear in the community, they have violated the linguistic essence of their faith." },
            { type: "hadith", translation: "The believer is the one from whom people's lives and property are safe.", arabic: "الْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ عَلَى دِمَائِهِمْ وَأَمْوَالِهِمْ" },
            { type: "infographic", layout: "process", items: [
                { title: "Lughawi (Linguistic)", description: "Affirmation bringing internal security and social safety/trust.", icon: "Shield" },
                { title: "Istilah (Technical)", description: "Belief in heart, speech with tongue, action with limbs.", icon: "BookOpen" }
            ]},
            { type: "text", content: "### Technical Definition: Synthesis of Heart, Tongue, and Limbs\nWhile linguistic meaning highlights internal peace, the technical (Istilah) definition integrates a holistic system. Technical Iman is the coupling of heartfelt belief (Tasdiq), verbal testimony (Iqrar), and outward action (Amal). The heart establishes internal security; the tongue brings it into the social realm; and limbs validate trust through obedience." },
            { type: "text", content: "### Tasdiq vs. Knowledge: The Case of Iblis\nIslamic theology heavily distinguishes mere knowledge (Ma'rifah) from faith (Tasdiq). Knowing truth exists without willful submission is not Iman. Iblis (Satan) knew Allah with absolute certainty but lacked Iman because he lacked Tasdiq—willing submission and trust. Iman is a volitional act of the heart making an active spiritual commitment." },
            { type: "concept", translation: "Ma'rifah vs Iman: Knowledge alone is not faith; faith requires active, volitional submission.", arabic: "المعرفة والإيمان" },
            { type: "text", content: "### The Reality of Amanah (Trust)\nIman and Amanah (trust) share a root, meaning deficiency in one indicates deficiency in the other. The Prophet ﷺ said, \"There is no faith for the one who has no trust.\" Fulfilling trusts—whether duties, secrets, or wealth—measures internal faith. Iman acts as the foundational security deposit for participating morally in a community." },
            { type: "conclusion", content: "Recognizing Iman as both an internal sanctuary and a social responsibility ensures the believer is not just privately spiritual, but publicly reliable and protective." },
            { type: "callout", content: "Real Life Application:\n- Safety Audit: Evaluate if family, coworkers, and neighbors feel \"safe\" from your tongue and temper.\n- Fulfilling Amanah: Pick a specific trust (deadline, secret, parenting duty) and fulfill it with excellence this week.\n- Converting Knowledge: When learning a Divine attribute, internally ask how to take refuge (Tasdiq) in it.", author: "Action Items for True Faith" },
            { type: "video", url: "https://www.youtube.com/watch?v=T_T4EHV25e8" },
            { type: "quiz", question: "The Arabic root of Iman (a-m-n) is closest to what concept?", options: ["Power", "Safety and Trust", "Study", "Movement"], correctIndex: 1, hint: "Amn" },
            { type: "quiz", question: "Why did Iblis lack Iman despite knowing Allah?", options: ["Forgotten truth", "Lacked Tasdiq (affirmation and submission)", "Lacked information", "Didn't know the Last Day"], correctIndex: 1, hint: "Knowledge alone is not faith." },
            { type: "quiz", question: "According to Prophetic tradition, who is a 'Mu’min'?", options: ["Someone who reads extensively", "Someone from whom lives and property are safe", "Someone who never leaves the mosque", "Someone with no family"], correctIndex: 1, hint: "They grant security." },
            { type: "reflection", translation: "If Iman is 'safety', where do you currently feel most anxious? How can actively affirming Allah’s attributes address that fear?", arabic: "طمأنينة" },
            { type: "document", title: "Supplemental Reading", description: "Yaqeen Institute: The Faith Revival Series - Faith is Refuge", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "c1fb157f-bc72-48b7-af8a-ed52b0515aae",
        title: "Relationship Between Belief and Action",
        blocks: [
            { type: "objectives", items: ["Define the Sunni orthodox position on the necessity of actions as a vital component of faith.", "Compare the views of Ahl al-Sunnah with historical theological extremes.", "Illustrate the 'Tree Metaphor' of faith showing causal links.", "Identify how specific actions act as a 'proof' (Burhan) of sincerity."] },
            { type: "concept", translation: "Amal al-Jawarih: Physical actions performed by limbs, like prayer or charity.", arabic: "عمل الجوارح" },
            { type: "concept", translation: "Niyyah: Intention; the spiritual soul of every action.", arabic: "نية" },
            { type: "concept", translation: "Burhan: Decisive proof or evidence (e.g., charity).", arabic: "برهان" },
            { type: "text", content: "### The Ontological Inseparability of Faith and Action\nThe relationship between Iman and Amal is heavily addressed in Islamic history. Ahl al-Sunnah wal-Jama’ah concludes that faith is a triad: belief in the heart, testimony on the tongue, and actions with the limbs. Actions naturally and necessarily express the true internal state. If a heart is fully convinced, it organically drives obedience in the limbs. Total absence of righteous action calls the internal faith into severe question." },
            { type: "callout", content: "Navigating the Extremes: The Sunni Middle Way recognizes actions as part of faith, meaning sins diminish and weaken it, but do not destroy it (excluding Shirk). The Murji'ah claimed actions were completely irrelevant. Kharijites claimed any major sin destroyed faith completely, leading to extremism.", author: "Theological Balance" },
            { type: "infographic", layout: "grid", items: [
                { title: "Murji'ah (Extreme)", description: "Faith is only in the heart. Actions are totally irrelevant.", icon: "XCircle" },
                { title: "Kharijites (Extreme)", description: "Any major sin instantly destroys your faith (apostasy).", icon: "XCircle" },
                { title: "Ahl al-Sunnah (Middle)", description: "Faith & actions are linked. Sins diminish faith but don't erase it.", icon: "CheckCircle" },
                { title: "Burhan (Action)", description: "Deeds are the decisive proof of the heart's hidden state.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Tree Metaphor: Roots, Trunk, and Fruit\nFaith is conceptually like a tree. The Roots (Iman) represent deep conviction in the heart. The Trunk and Branches (Islam) represent outward pillars and duties—visible expressions of health. The Fruit (Ihsan) are beautiful character traits. A successful tree necessarily bears fruit from healthy roots and branches." },
            { type: "quran", translation: "And they were not commanded except to worship Allah, [being] sincere to Him in religion... (Surah Al-Bayyinah 98:5)", arabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ" },
            { type: "text", content: "### Action as a 'Proof' (Burhan)\nCharity is famously called a \"Burhan\" (decisive proof). Sacrificing wealth for an unseen God proves the heart's true belief in the Last Day. Actions are diagnostic tools. When righteous acts feel easy, faith is strong. When they feel incredibly burdensome, it reveals a disconnect in conviction." },
            { type: "hadith", translation: "The most complete of believers in faith are those with the best character.", arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا" },
            { type: "text", content: "### Intention: The Bridge\n\"Actions are by intentions\" bridges the internal and external. A physical act is only a \"deed of faith\" when animated by sincere Niyyah. A prostration without worship intent is meaningless movement. Intention makes the heart the master commander of the physical form." },
            { type: "conclusion", content: "Faith is never a dead concept; it is an active force. Without action, faith is a hollow claim. Action is the pulse proving the heart is still alive." },
            { type: "callout", content: "Real Life Application:\n- Intentionality Practice: Pause 5 seconds before working or praying to consciously dedicate it to Allah.\n- Charity as Diagnostic: Give charity when feeling spiritually stuck; use the physical act to wake the heart.\n- Self-Accountability: Monitor your actions as the observable ‘fruit’ of your hidden ‘roots.’", author: "Action Items for Active Faith" },
            { type: "video", url: "https://www.youtube.com/watch?v=r0lF00gXbEU" },
            { type: "quiz", question: "Which group argued faith is only in the heart and actions are irrelevant?", options: ["Kharijites", "Murji'ah", "Ahl al-Sunnah", "Ash'arites"], correctIndex: 1, hint: "Known for suspending judgment on actions." },
            { type: "quiz", question: "In the tree metaphor, what does the fruit represent?", options: ["Pillars of Islam", "Spiritual excellence (Ihsan)", "Prayer", "Arabic language"], correctIndex: 1, hint: "The beautiful manifestation of healthy roots." },
            { type: "quiz", question: "What did the Prophet ﷺ call charity?", options: ["A burden", "A decisive proof (Burhan)", "A tax", "Magic"], correctIndex: 1, hint: "Sadaqatu Burhan." },
            { type: "reflection", translation: "How does the middle path handle a believer who commits a major sin? Why is Niyyah the 'soul' of an action?", arabic: "تفكر" },
            { type: "reflection", translation: "If someone observed your physical actions for a week without knowing your thoughts, what 'roots' would they assume you have?", arabic: "شجرة الإيمان" }
        ]
    },
    {
        id: "c1985a7b-d7e6-4661-82da-bf1b70ee5e01",
        title: "Increase and Decrease of Iman",
        blocks: [
            { type: "objectives", items: ["Cite textual evidence proving the dynamic, non-static nature of faith.", "Explain the Prophetic analogy of faith 'wearing out like a garment'.", "Identify specific inputs that increase faith and toxins that decrease it.", "Analyze the concept of Tajdīd (renewal) as a continuous necessity."] },
            { type: "concept", translation: "Yazīdu wa Yanquṣ: Doctrinal concept that faith increases and decreases.", arabic: "يزيد وينقص" },
            { type: "concept", translation: "Tajdīd al-Īmān: Proactive renewal of faith through remembrance and repentance.", arabic: "تجديد الإيمان" },
            { type: "concept", translation: "Ghaflah: Heedlessness or spiritual forgetfulness.", arabic: "غفلة" },
            { type: "text", content: "### The Living Nature of Faith: Fluctuations and Flow\nFaith is not a binary switch but a living, dynamic entity. The Qur'an and Sunnah repeatedly emphasize that Iman is subject to change. It serves as a spiritual pulse. Recognizing this prevents despair when faith is low and arrogance when it runs high. Managing this fluctuation is the reality of the human condition." },
            { type: "hadith", translation: "Verily, the faith of one of you will diminish just as a garment becomes worn out; so ask Allah to renew faith in your hearts.", arabic: "إِنَّ الإِيمَانَ لَيَخْلَقُ فِي جَوْفِ أَحَدِكُمْ كَمَا يَخْلَقُ الثَّوْبُ ۖ فَاسْأَلُوا اللَّهَ أَنْ يُجَدِّدَ الإِيمَانَ فِي قُلُوبِكُمْ" },
            { type: "text", content: "### Factors of Increase (Ziyadah) and Decrease (Nanqus)\nFaith reacts to environments and inputs. Reciting Qur'an and sincere Dhikr polish the heart, causing Ziyadah (increase). Conversely, committing sins places dark stains on the heart, and persistent Ghaflah (heedlessness) wears out the garment silently, causing it to decrease (Nanqus)." },
            { type: "infographic", layout: "process", items: [
                { title: "Ziyadah (Increase)", description: "Qur'an, Dhikr, Good Company, Righteous Deeds.", icon: "TrendingUp" },
                { title: "Nanqus (Decrease)", description: "Sins, Ghaflah (Heedlessness), Toxic Environments.", icon: "TrendingDown" },
                { title: "Tajdid (Renewal)", description: "Immediate repentance and excessive Dhikr.", icon: "RefreshCw" }
            ]},
            { type: "text", content: "### Sa'atan wa Sa'a: Managing Expectations\nHanzalah (RA) worried he was a hypocrite because his spiritual high with the Prophet ﷺ dropped when he was home. The Prophet ﷺ responded calmly: \"There is a time for this and a time for that\" (Sa'atan wa sa'a). If humans sustained perpetual peak spiritual intensity, we would be angels." },
            { type: "text", content: "### Practical Renewal: The Polish of the Heart\nTo combat the wearing out of faith, we employ Tajdīd. The Prophetic advice is simple: \"Increase your recitation of 'La ilaha illa Allah'.\" This acts as a spiritual reset to re-center the heart. Adding Istighfar acts as the chemical solvent to dissolve the \"rust\" of unrepented sins." },
            { type: "quran", translation: "And whenever His verses are recited to them, it increases them in faith... (Surah Al-Anfal 8:2)", arabic: "وَإِذَا تُلِيَتْ عَلَيْهِمْ آيَاتُهُ زَادَتْهُمْ إِيمَانًا" },
            { type: "conclusion", content: "Accepting that faith fluctuates is the first step to spiritual maturity. It equips you with the stamina to seek renewal constantly instead of giving up entirely when feeling low." },
            { type: "callout", content: "Real Life Application:\n- Daily Renewal Ritual: Dedicate 5 mins to 'La ilaha illa Allah' after Fajr/Maghrib.\n- Environmental Awareness: Determine where your garment wears out most and limit access.\n- Post-Sin Recovery: Clean the stain immediately with a good deed.", author: "Action Items for Tajdid" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "quiz", question: "Which describes the Sunni view of faith?", options: ["Fixed amount", "Increases with obedience, decreases with disobedience", "Only increases", "Only changes for prophets"], correctIndex: 1, hint: "It is dynamic." },
            { type: "quiz", question: "What did the Prophet ﷺ compare the need for faith renewal to?", options: ["Iron", "A worn-out garment", "A fading sunset", "Dry well"], correctIndex: 1, hint: "It needs to be washed and renewed." },
            { type: "quiz", question: "What did the Prophet advise Hanzalah regarding fluctuating faith?", options: ["He was a hypocrite", "A time for this and a time for that", "Stay in the masjid", "Fast more"], correctIndex: 1, hint: "Sa'atan wa sa'a." },
            { type: "reflection", translation: "Define Ghaflah. Explain the role of reciting 'La ilaha illa Allah' in faith renewal.", arabic: "تجديد" },
            { type: "reflection", translation: "Where does your 'spiritual garment' feel most worn out? What specific 'friction' in life is causing it?", arabic: "تفكر" }
        ]
    },
    {
        id: "804a6164-dc4a-4f9c-bdbe-5605ff437ae6",
        title: "Signs of Strong Faith",
        blocks: [
            { type: "objectives", items: ["Identify the internal 'taste' of faith (Halawat al-Iman) and its preconditions.", "Describe outward signs of strong faith through character (Akhlaq) and social interactions.", "Analyze the metaphor of the 'radiating heart' (Ajrad).", "Evaluate 'gentleness' and 'trustworthiness' as objective spiritual metrics."] },
            { type: "concept", translation: "Halawat al-Iman: Sweetness of faith; a spiritual joy from devotion.", arabic: "حلاوة الإيمان" },
            { type: "concept", translation: "Ajrad: A heart polished and radiating light.", arabic: "أجرد" },
            { type: "concept", translation: "Haya': Modesty and dignified shame before Allah.", arabic: "حياء" },
            { type: "text", content: "### The Experiential Dimension: Tasting the Faith\nTrue faith includes tasting Halawat al-Iman—the sweetness of faith. Worship shifts from a burden to a source of joy. The Prophet ﷺ listed three preconditions: loving Allah and His Messenger above all else, loving others purely for the sake of Allah, and hating to revert to disbelief as one hates being thrown into fire." },
            { type: "hadith", translation: "Whoever processes three qualities will taste the sweetness of faith...", arabic: "ثَلَاثٌ مَنْ كُنَّ فِيهِ وَجَدَ حَلَاوَةَ الْإِيمَانِ..." },
            { type: "text", content: "### The Radiating Heart\nEarly scholars categorized hearts based on internal light. A polished heart (Ajrad) belongs to a true believer; it is a radiating lamp, transparent and brightly focused on Allah, illuminating their speech and character. Wrapped hearts belong to those rejecting truth." },
            { type: "infographic", layout: "grid", items: [
                { title: "Lutf", description: "Gentleness and compassion reflecting Divine Mercy.", icon: "Heart" },
                { title: "Truthfulness", description: "Fearing Allah more than mortals.", icon: "Shield" },
                { title: "Trustworthiness", description: "Honoring Amanah; making neighbors feel safe.", icon: "Lock" },
                { title: "Haya", description: "Deep internal modesty and shame before Allah.", icon: "Eye" }
            ]},
            { type: "text", content: "### Character as the Metric of Maturity\nThe most objective measure of Iman is Akhlaq. \"The most complete of believers in faith are those who are best in character.\" An individual praying tirelessly but exhibiting harshness and dishonesty possesses critically weak faith." },
            { type: "quran", translation: "But Allah has endeared to you the faith and has made it pleasing in your hearts... (Surah Al-Hujurat 49:7)", arabic: "وَلَٰكِنَّ اللَّهَ حَبَّبَ إِلَيْكُمُ الْإِيمَانَ وَزَيَّنَهُ فِي قُلُوبِكُمْ" },
            { type: "text", content: "### The Presence of Ihsan\nDeep faith culminates in Ihsan—worshipping as if witnessing Allah. This yields profound Haya' (modesty/shame before Allah), moving far beyond simple social shyness. It acts as an evergreen guard protecting sincerity (Ikhlas) and preventing disobedience." },
            { type: "conclusion", content: "Strong faith is not invisible. It is tangibly measured by the sweetness one feels internally and the safety and gentleness others feel externally around them." },
            { type: "callout", content: "Real Life Application:\n- Character Goal Setting: Practice specific Lutf (gentleness) with family.\n- Checking for Rust: If prayer feels heavy, correct your worldly attachments.\n- The Safety Check: Honestly ask yourself if your neighbors/colleagues feel safe from you.", author: "Action Items for True Character" },
            { type: "video", url: "https://www.youtube.com/watch?v=O-UoQW2_DDU" },
            { type: "quiz", question: "What is NOT a requirement to taste the sweetness of faith?", options: ["Loving Allah and His Messenger above all", "Loving people for Allah's sake", "Having a perfect record of zero sins", "Hating disbelief"], correctIndex: 2, hint: "Humans inevitably sin." },
            { type: "quiz", question: "Lutf refers to:", options: ["Physical strength", "Gentleness and kindness", "Knowing the dictionary", "Loud recitation"], correctIndex: 1, hint: "A trait of divine character." },
            { type: "quiz", question: "How is the believer's heart described?", options: ["Dim candle", "Radiating lamp (Ajrad)", "Cold stone", "Self-mirror"], correctIndex: 1, hint: "Ajrad." },
            { type: "reflection", translation: "Why is Akhlaq the best metric for measuring faith maturity? What distinguishes Haya' from social shyness?", arabic: "تفكر" },
            { type: "reflection", translation: "If your heart was a lamp radiating light, what 'shadows' in your character are currently blocking its light from others?", arabic: "القلب السليم" }
        ]
    },
    {
        id: "c0e82b4a-769c-4cb0-baac-784b5e05c97b",
        title: "Causes of Weak Faith",
        blocks: [
            { type: "objectives", items: ["Diagnose internal and external causes of spiritual decline.", "Distinguish between spiritual hardness of heart and psychological grief.", "Evaluate the role of 'Waswasa' (whispers) and respond without anxiety.", "Identify the impact of neural pathways and modern habits on repetitive sin."] },
            { type: "concept", translation: "Qasawat al-Qalb: Hardness of the heart.", arabic: "قسوة القلب" },
            { type: "concept", translation: "Rān: Rust or stain on the heart from unrepented sins.", arabic: "ران" },
            { type: "concept", translation: "Waswasa: Compulsive whispers/thoughts to induce doubt.", arabic: "وسوسة" },
            { type: "text", content: "### Anatomy of Spiritual Decline\nWeak faith usually stems from accumulating small toxins, not single catastrophes. The primary internal toxin is Rān (rust/stain). Habitual sin spreads this black spot until it coats the whole heart, leading to Qasawat (hardness) where empathy, prayer focus, and response to Divine reminders vanish." },
            { type: "quran", translation: "No! Rather, the stain has covered their hearts from that which they were earning. (Surah Al-Mutaffifin 83:14)", arabic: "كَلَّا ۖ بَلْ ۜ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا يَكْسِبُونَ" },
            { type: "text", content: "### Sadness vs. Weak Faith: A Crucial Distinction\nGrief or sadness is frequently confused with weak faith. The Prophetic tradition corrects this. Yaqub (AS) wept for his son; Muhammad ﷺ wept for his son Ibrahim, labeling it mercy. True grief is healthy emotion; weak faith is disconnection, distrust of Allah, and neglecting commandments during that pain." },
            { type: "hadith", translation: "The eyes shed tears and the heart is grieved, but we will not say except what pleases our Lord... (Sahih al-Bukhari)", arabic: "إِنَّ الْعَيْنَ تَدْمَعُ، وَالْقَلْبَ يَحْزَنُ..." },
            { type: "text", content: "### The Role of Habits and Neural Pathways\nBehavior constantly repeated forms robust neural pathways, entrenching habits. Every sinful gaze or lie strengthens a spiritual rut. Resolving weak faith requires actively developing new, righteous habits to overwrite old pathways through disciplined repetition." },
            { type: "infographic", layout: "process", items: [
                { title: "Remorse", description: "Feel true regret and guilt.", icon: "Heart" },
                { title: "Halt", description: "Stop the sin immediately.", icon: "XCircle" },
                { title: "Replace", description: "Perform an immediate replacement good deed.", icon: "ArrowRight" }
            ]},
            { type: "text", content: "### Waswasa: The Thief and the Treasure\nIntrusive doubts (Waswasa) regarding Allah distress many believers. The Prophet ﷺ deemed the Sahaba's revulsion to these thoughts as Sarih al-Iman (Clear faith). \"A thief only robs a house with treasure.\" Shaytan attacks hearts containing the treasure of Iman." },
            { type: "text", content: "### External Causes: Environment and Distraction\nFaith is molded by its Bi'ah (environment). The digital age's unrelenting noise blocks the silence vital for Tafakkur (contemplation). A person adopts the religion of their close friends, hence moderating digital intake and social environments is mandatory." },
            { type: "conclusion", content: "Spiritual decline happens by default; growth requires intentionality. Managing inputs and protecting the heart from rust is mandatory maintenance." },
            { type: "callout", content: "Real Life Application:\n- The 3-Step Habit Break: Remorse, Halt, Replace.\n- Waswasa Response: State 'Aamantu billahi' then physically distract yourself instead of debating the thought.\n- Digital Detox: Spend 15 screen-free minutes a day contemplating creation.", author: "Action Items for Protection" },
            { type: "video", url: "https://www.youtube.com/watch?v=Vl0XyB2C6o0" },
            { type: "quiz", question: "'Rust' (Rān) on the heart is primarily caused by:", options: ["Aging", "Unrepented sins", "Insomnia", "Too much knowledge"], correctIndex: 1, hint: "Accumulated disobedience." },
            { type: "quiz", question: "Anxiety regarding intrusive whispers is described by the Prophet ﷺ as:", options: ["Hypocrisy", "Clear sign of faith (Sarih al-Iman)", "Madness", "Ignorance"], correctIndex: 1, hint: "Proof that you care." },
            { type: "quiz", question: "Is profound sadness universally a sign of weak faith?", options: ["Always", "No, it's a human emotion and often a mercy", "Yes, if lasting over a day", "Only for non-prophets"], correctIndex: 1, hint: "Prophets grieved too." },
            { type: "reflection", translation: "Detail how 'neural pathways' impact breaking bad habits. Identify a major external cause of decreasing faith today.", arabic: "عادات" },
            { type: "reflection", translation: "When trapped in a repetitive sin, what hidden 'payoff' does the soul find? How can a Halal alternative supply that comfort?", arabic: "تفكر" }
        ]
    },
    {
        id: "e0f7ad66-37f6-42a9-b4ec-ea6f14a93281",
        title: "Module 1 Synthesis & Knowledge Check",
        blocks: [
            { type: "objectives", items: ["Synthesize theological, linguistic, and practical dimensions of faith.", "Construct a personalized 'Faith Plan' for continuous spiritual growth.", "Demonstrate mastery of core concepts via comprehensive assessment.", "Articulate the necessary synergy between internal belief and outward action."] },
            { type: "concept", translation: "Tazkiyah: The process of purifying soul and heart.", arabic: "تزكية" },
            { type: "concept", translation: "Muhasabah: Taking oneself to account and evaluating deeds.", arabic: "محاسبة" },
            { type: "text", content: "### Module Summary: Key Takeaways (Part 1)\n1. **Triple Definition:** Iman is belief (heart), testimony (tongue), and action (limbs).\n2. **Safety Root:** Iman shares linguistic roots with security (Amn).\n3. **The Tripod of Deen:** Islam (outward), Iman (inward), and Ihsan (spiritual excellence) form the three interdependent legs.\n4. **Middle Way:** Actions matter to faith; major sins diminish—not instantly destroy—a believer's faith.\n5. **Hadith of Jibril:** The pedagogical \"Mother of the Sunnah\"." },
            { type: "text", content: "### Module Summary: Key Takeaways (Part 2)\n6. **Dynamic Faith:** Iman increases with obedience and decreases with sin.\n7. **Spiritual Maintenance:** Faith wears out like a garment and demands Tajdid (renewal).\n8. **Proof of the Heart:** Good character and charity are the 'Burhan' of the heart.\n9. **Sweetness:** Access the delight of faith by loving Allah above all.\n10. **Integration:** Every Muhsin is a Mu'min, and every Mu'min is a Muslim." },
            { type: "infographic", layout: "grid", items: [
                { title: "Islam", description: "The outermost circle (broadest group). The physical submission.", icon: "Circle" },
                { title: "Iman", description: "The middle circle. Those with internal conviction and outward submission.", icon: "Target" },
                { title: "Ihsan", description: "The innermost, smallest circle. Constant vigilance and excellence.", icon: "Star" }
            ]},
            { type: "text", content: "### Pathways to the Divine\nPeople possess varying spiritual architectures. Some connect via rigid scholarship (Al-Ahkam), while others lean into experiential devotion (Ma’rifa al-Ahwal). Regardless of the specific path, an objective validation of spiritual maturity is flawless character—possessing a heart like a radiating lamp while operating with exquisite gentleness." },
            { type: "conclusion", content: "The ultimate goal is a heart that meets its Lord sound, peaceful, and fully submitted." },
            { type: "callout", content: "Moving Forward:\nKnowledge without integration remains passive data. Synthesizing these concepts means applying the reality of Muraqaba (vigilance) to our digital inputs, ensuring our daily Islam is fueled by robust Iman and decorated with Ihsan.", author: "Integration" },
            { type: "text", content: "### Personal Faith Plan Worksheet\n**Step 1: The Diagnostic**\nWhat is the biggest 'tear' in my spiritual garment right now?\n**Step 2: The Inputs**\nCommit to saying La ilaha illa Allah daily. Spend time screen-free reflecting on creation.\n**Step 3: The Proof**\nPerform one intentional humble act daily. Set a Lutf (gentleness) goal with someone difficult.\n**Step 4: The Safeguard**\nRemove one Digital Toxin. Visit a Faith Refuge (a class or book) weekly." },
            { type: "video", url: "https://www.youtube.com/watch?v=48yD3j0H9U8" },
            { type: "quiz", question: "Which level of religion is the 'pinnacle,' worshipping as if seeing Allah?", options: ["Islam", "Iman", "Ihsan", "Tawheed"], correctIndex: 2, hint: "Excellence." },
            { type: "quiz", question: "Linguistically, 'Iman' shares a root with:", options: ["Amanah (Trust)", "Jihad", "Qamar", "Ilm"], correctIndex: 0, hint: "Root a-m-n." },
            { type: "quiz", question: "What is the 'highest' branch of faith?", options: ["Modesty", "Removing harm", "Declaring La ilaha illa Allah", "Honoring a neighbor"], correctIndex: 2, hint: "The statement of Tawheed." },
            { type: "quiz", question: "Hating to return to disbelief as much as hating fire causes one to:", options: ["Become a scholar", "Taste the sweetness of faith", "Predict the future", "Erase all past bad deeds"], correctIndex: 1, hint: "Halawat al-Iman." },
            { type: "quiz", question: "'Clear faith' (Sarih al-Iman) regarding intrusive thoughts specifically refers to:", options: ["Having the thoughts", "Hating and finding anxiety over the thoughts", "Ignoring people", "Feeling pride"], correctIndex: 1, hint: "It shows you care." },
            { type: "quiz", question: "A person who commits a major sin according to Ahl al-Sunnah is:", options: ["A Kafir", "A believer with deficient/weak faith", "A perfect believer", "Outside of the community entirely"], correctIndex: 1, hint: "They are not ejected." },
            { type: "quiz", question: "In the 'Concentric Circles', which forms the innermost, smallest circle?", options: ["Islam", "Iman", "Ihsan", "Shahada"], correctIndex: 2, hint: "Achieved by the fewest." },
            { type: "reflection", translation: "Explain the 'Tripod Model' of the religion. Why is 'Removing harm from the road' part of Iman?", arabic: "مراجعة" },
            { type: "reflection", translation: "Draw three concentric circles representing your Islam, Iman, and Ihsan. Write one realistic goal for each circle for the upcoming month.", arabic: "التطبيق" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING EXACT IDS FOR ULTRA-COMPREHENSIVE FOUNDATIONS OF ISLAMIC FAITH MODULE 1 ---');

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
        
        if (error) {
            console.log('\nERR: ' + error.message);
        } else if (data.length === 0) {
            console.log('\nWARN: No lesson matched ID for ' + item.title);
        } else {
            console.log(`DONE! Seeded to ${data[0].id}`);
        }
    }
}

seedLessons();
