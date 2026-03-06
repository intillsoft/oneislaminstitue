const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Ethical Character (Akhlaq)",
        blocks: [
            { type: "callout", content: "I was only sent to perfect noble character.", author: "Prophetic Hadith (Al-Muwatta 47 / Musnad Ahmad 8952)" },
            { type: "objectives", items: ["Understand the central role of Akhlaq (Character) in Islamic Creed", "Differentiate between 'Husn al-Khuluq' and mere manners", "Identify key prophetic traits: Humility, Courage, and Gentleness", "Analyze how inward belief manifests as outward behavior"] },
            { type: "text", content: "## Faith is Character\n\nIn Islam, 'Aqidah' (Creed) and 'Akhlaq' (Character) are two sides of the same coin. A person with correct theology but abusive character has a defect in their faith. The Prophet (PBUH) linked the weight of faith directly to the quality of one's treatment of others." },
            { type: "concept", translation: "Akhlaq (Character): The inward state of the soul that produces actions without the need for reflection or deliberation.", arabic: "الأخلاق" },
            { type: "quran", translation: "And indeed, you are of a great moral character. (Surah Al-Qalam 68:4)", arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ" },
            { type: "infographic", layout: "grid", items: [
                { title: "Rifa' (Gentleness)", description: "Allah is gentle and He loves gentleness in all matters.", icon: "Sunrise" },
                { title: "Haya' (Modesty)", description: "Modesty is a branch of faith.", icon: "Shield" },
                { title: "Karam (Generosity)", description: "Being broad-handed and selfless.", icon: "Hand" },
                { title: "Sadaqah (Sincerity)", description: "Truthfulness in speech and heart.", icon: "CheckCircle" }
            ]},
            { type: "text", content: "### The Weight of a Smile\n\nIslamic ethics are not just for grand occasions; they are for the smallest interactions. The Prophet (PBUH) taught that even a smile in the face of your brother is a charity (Sadaqah). This creates a culture of kindness that is rooted in the fear and love of Allah." },
            { type: "hadith", translation: "The most beloved of Allah's servants to Allah are those with the best character. (Al-Tabarani, Authentic)", arabic: "أَحَبُّ عِبَادِ اللَّهِ إِلَى اللَّهِ أَحْسَنُهُمْ خُلُقًا" },
            { type: "scholar", translation: "Religion is entirely character. Whoever surpasses you in character has surpassed you in religion. (Ibn al-Qayyim)", arabic: "الدين هو الخلق" },
            { type: "infographic", layout: "process", items: [
                { title: "Contemplation", description: "Recognizing one's own flaws.", icon: "Search" },
                { title: "Mujahadah", description: "Struggling against the ego (Nafs) to improve.", icon: "Zap" },
                { title: "Habituation", description: "Repeating a good deed until it becomes natural.", icon: "RefreshCw" }
            ]},
            { type: "text", content: "### Character with the Creator and Creation\n\nAkhlaq is twofold: Character with Allah (Patience, Gratitude, Sincerity) and Character with People (Forgiveness, Honesty, Helpfulness). Both are required for the 'Sound Heart' (Qalb Saleem) that enters Paradise." },
            { type: "reflection", translation: "If my children grew up to be EXACTLY like me in character, would that be a success or a tragedy?", arabic: "وإنك لعلى خلق عظيم" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Your character is the true advertisement for your faith. People may not read your books, but they will always read your behavior." },
            { type: "quiz", question: "What did the Prophet (PBUH) say was the primary reason for his being sent?", options: ["To build cities", "To perfect noble character", "To teach math", "To travel"], correctIndex: 1, hint: "Li-utammima makarima al-akhlaq." },
            { type: "quiz", question: "According to Ibn al-Qayyim, what happens if someone surpasses you in character?", options: ["They are just luckier", "They have surpassed you in religion (Deen)", "They are probably lying", "Nothing"], correctIndex: 1, hint: "Religion = Character." },
            { type: "quiz", question: "What is 'Haya''?", options: ["Pride", "Modesty/Shame (in a positive sense)", "Hunger", "Speed"], correctIndex: 1, hint: "A branch of faith." },
            { type: "quiz", question: "Is a smile considered a form of worship (Charity) in Islam?", options: ["No, it's just a facial expression", "Yes, 'Your smile in the face of your brother is a charity'", "Only if you are a scholar", "Only on Fridays"], correctIndex: 1, hint: "Review the Lesson 8.1 text." },
            { type: "quiz", question: "Which Surah describes the Prophet's character as 'Great' (Azim)?", options: ["Surah Al-Baqarah", "Surah Yasin", "Surah Al-Qalam", "Surah Al-Fatihah"], correctIndex: 2, hint: "Surah Number 68." },
            { type: "document", title: "Prophetic Ethics", description: "A summary of the 'Shamail' - the physical and character traits of the Prophet.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Character Development Manual", description: "Practical exercises for improving patience and removing anger.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Social Responsibility",
        blocks: [
            { type: "callout", content: "The believers in their mutual kindness, compassion, and sympathy are just like one body. When one limb is afflicted, the whole body responds with wakefulness and fever.", author: "Prophetic Hadith (Sahih al-Bukhari 6011 / Muslim 2586)" },
            { type: "objectives", items: ["Understand the concept of 'Ummah' (Global Community) and social cohesion", "Identify the Islamic duty toward neighbors, orphans, and the elderly", "Learn about the institution of Zakat and its role in social justice", "Analyze the concept of 'Enjoining Good and Forbidding Evil' (Al-Amr bi al-Ma'ruf)"] },
            { type: "text", content: "## Beyond the Self\n\nIslam is not a 'solitary' religion. It is a social contract. A Muslim is responsible for the well-being of their community. If a neighbor stays hungry while you are full, the Prophet (PBUH) stated that your faith is incomplete." },
            { type: "quran", translation: "And worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy... (Surah An-Nisa 4:36)", arabic: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا" },
            { type: "concept", translation: "Huquq al-Ibad (Rights of the Servants): The obligations a person owes to other humans, which Allah may not forgive unless the person themselves forgives.", arabic: "حقوق العباد" },
            { type: "infographic", layout: "grid", items: [
                { title: "Zakat", description: "The mandatory bridge between the rich and the poor.", icon: "DollarSign" },
                { title: "Neighbor's Rights", description: "Gabriel emphasized neighbors until the Prophet thought they might inherit.", icon: "Home" },
                { title: "Truth to Power", description: "Speaking out against injustice and oppression.", icon: "Volume2" },
                { title: "Orphan Care", description: "The highest status near the Prophet in Paradise.", icon: "Heart" }
            ]},
            { type: "text", content: "### The One Body\n\nThe metaphor of the 'Body' is fundamental. When a Muslim in another part of the world suffers, the rest of the world and community should feel the pain and act. This 'Ummah' identity transcends race, language, and borders." },
            { type: "hadith", translation: "He is not a believer who eats his fill while his neighbor is hungry by his side. (Al-Adab al-Mufrad 112, Authentic)", arabic: "لَيْسَ الْمُؤْمِنُ بِالَّذِي يَشْبَعُ وَجَارُهُ جَائِعٌ إِلَى جَنْبِهِ" },
            { type: "scholar", translation: "Seeking social justice is not a political choice for a Muslim; it is an act of Tawheed. (Modern scholars)", arabic: "العدل أساس الملك" },
            { type: "infographic", layout: "process", items: [
                { title: "Awareness", description: "Knowing the needs of the local community.", icon: "Search" },
                { title: "Action", description: "Volunteering and giving without being asked.", icon: "Hand" },
                { title: "Transformation", description: "Building a society of mutual support.", icon: "CloudRain" }
            ]},
            { type: "text", content: "### Enjoining Good and Forbidding Evil\n\nA healthy society is one that self-corrects. When the community sees goodness, they encourage it. When they see harm, they act to stop it. This 'Social Maintenance' is what made the Ummah 'the best of people'." },
            { type: "quran", translation: "You are the best nation produced [as an example] for mankind. You enjoin what is right and forbid what is wrong and believe in Allah. (Surah Ali 'Imran 3:110)", arabic: "كُنتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ" },
            { type: "reflection", translation: "Do I know the name of the person who lives three doors down from me? If not, am I following the Sunnah of social connection?", arabic: "حق الجار" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "Your relationship with Allah is validated by your relationship with His creation. To serve the Creator is to serve His servants." },
            { type: "quiz", question: "What metaphor did the Prophet (PBUH) use for the 'Global Community' (Ummah)?", options: ["A forest", "A single body", "A swarm of bees", "A mountain range"], correctIndex: 1, hint: "Review Sahih al-Bukhari 6011." },
            { type: "quiz", question: "What is the status of a person who is full while their neighbor is hungry (according to the Hadith)?", options: ["They are a smart saver", "The Prophet said 'He is not a believer' (in the complete sense)", "They are normal", "It's optional"], correctIndex: 1, hint: "Faith requires compassion." },
            { type: "quiz", question: "What does 'Al-Amr bi al-Ma'ruf' mean?", options: ["Cooking for others", "Enjoining/Encouraging what is good/right", "Studying law", "Silent meditation"], correctIndex: 1, hint: "Promotion of virtue." },
            { type: "quiz", question: "Which right is often mentioned alongside the worship of Allah in Surah An-Nisa 4:36?", options: ["Right to travel", "Right of parents and relatives", "Right to be wealthy", "Right to sleep"], correctIndex: 1, hint: "Wa bil-walidayni ihsana..." },
            { type: "quiz", question: "According to Surah Ali 'Imran 3:110, what makes the Ummah 'the best nation'?", options: ["Their race", "Their money", "Enjoining right, forbidding wrong, and belief in Allah", "Their military"], correctIndex: 2, hint: "The three conditions mentioned." },
            { type: "document", title: "Zakat and Social Justice", description: "How the Islamic tax system solves poverty and wealth inequality.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Rights of the Neighbor", description: "A comprehensive guide to Islamic etiquette in a diverse society.", url: "https://yaqeeninstitute.org/", platform: "Islamic Ethics" }
        ]
    },
    {
        title: "Environmental Stewardship",
        blocks: [
            { type: "callout", content: "The world is sweet and green, and verily Allah is going to install you as vicegerents in it in order to see how you act.", author: "Prophetic Hadith (Sahih Muslim 2742)" },
            { type: "objectives", items: ["Understand the concept of 'Khalifah' (Steward/Successor) on Earth", "Analyze the Islamic prohibition of wastefulness (Israf)", "Explore the prophetic teachings on animal rights and water conservation", "Learn how caring for nature is an act of 'Tasbih' (Praise)"] },
            { type: "text", content: "## Trustees of the Earth\n\nIn secular thought, the Earth is a resource to be exploited. In Islam, the Earth is an 'Amanah' (Trust) from the Creator. We do not 'own' it; we are its temporary guardians. Every tree, every animal, and every drop of water is a sign of God that must be respected." },
            { type: "concept", translation: "Mizan (Ecological Balance): The principle that Allah created nature in a state of perfect equilibrium, and humans must not disrupt it.", arabic: "الميزان الكوني" },
            { type: "quran", translation: "And the heaven He raised and imposed the balance. That you not transgress within the balance. (Surah Ar-Rahman 55:7-8)", arabic: "وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ۞ أَلَّا تَطْغَوْا فِي الْمِيزَانِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "No Waste", description: "Even if you are performing Wudu at a flowing river, do not waste water.", icon: "Droplet" },
                { title: "Planting Trees", description: "If the Hour comes and you have a sapling, plant it.", icon: "Sunrise" },
                { title: "Animal Rights", description: "A woman was forgiven for quenching the thirst of a dog.", icon: "Heart" },
                { title: "Common Rights", description: "People share in three: Water, Pasture, and Fire.", icon: "Shield" }
            ]},
            { type: "text", content: "### The Sapling at the End of the World\n\nThe Prophet (PBUH) gave a profound teaching: 'If the Last Hour comes upon any of you while he has a sapling in his hand, let him plant it.' This teaches that the act of nurturing life is good in itself, regardless of whether you will see its fruit. It is an act of hope and worship." },
            { type: "hadith", translation: "If a Muslim plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, it is regarded as a charitable gift (Sadaqah) for him. (Sahih al-Bukhari 2320)", arabic: "إِلاَّ كَانَ لَهُ بِهِ صَدَقَةٌ" },
            { type: "scholar", translation: "Corruption has appeared on land and sea because of what the hands of people have earned... Nature is reacting to human sin. (Classical commentary on 30:41)", arabic: "ظهر الفساد في البر والبحر" },
            { type: "infographic", layout: "process", items: [
                { title: "Respect", description: "Recognizing nature as a creation of Allah.", icon: "Eye" },
                { title: "Moderation", description: "Consuming without Israf (Excess).", icon: "Check" },
                { title: "Preservation", description: "Leaving a better world for the next generation.", icon: "Sunrise" }
            ]},
            { type: "text", content: "### Animal Welfare\n\nThe Prophet (PBUH) forbade using animals for target practice, overloading them, or even sharpening a knife in front of an animal that is about to be slaughtered. He recognized that animals are nations like us, that praise Allah in their own way." },
            { type: "reflection", translation: "When I use a single-use plastic or waste food, am I being a 'Khalifah' (Steward) or am I being an exploiter?", arabic: "ولا تسرفوا" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "To love Allah is to love His handiwork. Environmentalism is not a modern political trend; it is an ancient prophetic mandate." },
            { type: "quiz", question: "What is the technical term for the 'Stewardship' humans have over the Earth?", options: ["Sultan", "Khalifah", "Malik", "Amir"], correctIndex: 1, hint: "Innee ja'ilun fil-ardi khalifah." },
            { type: "quiz", question: "If the Last Hour begins while you are holding a sapling, what did the Prophet (PBUH) tell you to do?", options: ["Throw it away", "Plant it", "Run for help", "Hide it"], correctIndex: 1, hint: "A final act of hope." },
            { type: "quiz", question: "What is the Islamic ruling on wasting water, even during Wudu (ablution)?", options: ["It's okay if you have plenty", "It is prohibited (Israf is forbidden)", "It's only for dry countries", "It's allowed"], correctIndex: 1, hint: "Innovation in the river." },
            { type: "quiz", question: "According to Surah Ar-Rahman 55:7-8, what did Allah 'impose' or 'place' in creation that we must not transgress?", options: ["Mountains", "The Balance (Mizan)", "The Oceans", "Wealth"], correctIndex: 1, hint: "La tatghaw fil-mizan." },
            { type: "quiz", question: "If an animal eats from a tree you planted, what is it considered for you?", options: ["A loss", "Sadaqah (Charitable gift)", "An accident", "A sin"], correctIndex: 1, hint: "Everything in nature is connected." },
            { type: "document", title: "Islamic Environmentalism", description: "A theological framework for climate action and ecological preservation.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Animal Rights in Islam", description: "Compendium of hadiths regarding the kind treatment of creatures.", url: "https://yaqeeninstitute.org/", platform: "Islamic Ethics" }
        ]
    },
    {
        title: "Future of the Ummah",
        blocks: [
            { type: "callout", content: "My Ummah is like the rain; it is not known whether its beginning is better or its end.", author: "Prophetic Hadith (Sunan at-Tirmidhi 2869)" },
            { type: "objectives", items: ["Understand the cyclical nature of history from an Islamic perspective", "Identify the strengths of the Ummah in the modern technological world", "Analyze the concept of 'Tajdid' (Renewal) of the faith every century", "Discuss the role of the individual in contributing to the collective success (Falah)"] },
            { type: "text", content: "## A Legacy in Motion\n\nThe Ummah is not a relic of the past; it is a dynamic, global force that continues to evolve. While we face challenges, we also possess unprecedented tools for spreading the truth and serving humanity." },
            { type: "concept", translation: "Tajdid (Renewal): The process by which the vitality and correct understanding of the faith are revived at the turn of every century.", arabic: "التجديد" },
            { type: "quran", translation: "And thus we have made you a median/just nation (Ummah Wasat) that you will be witnesses over the people. (Surah Al-Baqarah 2:143)", arabic: "وَكَذَٰلِكَ جَعَلْنَاكُمْ أُمَّةً وَسَطًا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Digital Dawah", description: "Using technology to reach millions instantly.", icon: "Cpu" },
                { title: "Unity in Diversity", description: "Transcending borders through the shared Arabic of the Quran.", icon: "Globe" },
                { title: "Scientific Revival", description: "Renewing the legacy of inquiry and ethics.", icon: "Zap" },
                { title: "Hope", description: "Believing in the ultimate prevailing of truth.", icon: "Sunrise" }
            ]},
            { type: "text", content: "### The Concept of the 'Median Nation'\n\nBeing an 'Ummah Wasat' means being a balanced nation. We avoid the extremes of pure materialism and pure monasticism. The future of the Ummah depends on our ability to maintain this balance—being masters of the world while remaining servants of Allah." },
            { type: "hadith", translation: "Allah will send for this Ummah, at the turn of every hundred years, one who will renovate for it its religion. (Sunun Abi Dawud 4291, Authentic)", arabic: "يَبْعَثُ لِهَذِهِ الأُمَّةِ عَلَى رَأْسِ كُلِّ مِائَةِ سَنَةٍ مَنْ يُجَدِّدُ لَهَا دِينَهَا" },
            { type: "scholar", translation: "The future belongs to the faith that can provide the most meaning to a confused world. Islam is that faith. (Modern sociological observation)", arabic: "الإسلام هو الحل" },
            { type: "infographic", layout: "process", items: [
                { title: "Education", description: "Reviving authentic knowledge.", icon: "BookOpen" },
                { title: "Application", description: "Turning knowledge into community projects.", icon: "Zap" },
                { title: "Impact", description: "Global recognition of Islamic ethics.", icon: "Globe" }
            ]},
            { type: "text", content: "### Your Role\n\nThe Ummah is not 'them'; it is 'you'. Every student who masters their field for the sake of Allah, every parent who raises a sincere child, and every business owner who is honest, is building the future of the Ummah. Success is local before it is global." },
            { type: "reflection", translation: "When people look at my life and my career, do they see a 'median nation' person (Balanced, Ethical, Powerful) or something else?", arabic: "ولا تهنوا ولا تحزنوا" },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "conclusion", content: "The rain of the Ummah will continue until the end of time. The question is: will you be a drop that brings life to the desert?", author: "Prophetic Hope" },
            { type: "quiz", question: "What does 'Ummah Wasat' mean in Surah Al-Baqarah 2:143?", options: ["The first nation", "The median/just/balanced nation", "The wealthiest nation", "The smallest nation"], correctIndex: 1, hint: "Middle ground." },
            { type: "quiz", question: "According to the Hadith, how often does Allah send a 'Renovator' (Mujaddid) for the deen?", options: ["Every year", "Every 10 years", "Every 100 years", "Only once"], correctIndex: 2, hint: "Ra'si kulli mi'ati sanah." },
            { type: "quiz", question: "What comparison did the Prophet (PBUH) use for his Ummah in terms of its goodness?", options: ["Like a solid rock", "Like the rain (benefit throughout)", "Like a fire", "Like a shadow"], correctIndex: 1, hint: "Review Lesson 8.4 callout." },
            { type: "quiz", question: "What is 'Tajdid'?", options: ["Changing the religion", "Renewing the vitality and correct understanding of the faith", "Writing a new book", "Building a mosque"], correctIndex: 1, hint: "Revitalization." },
            { type: "quiz", question: "Is the future success of the Ummah dependent on world leaders or on individuals?", options: ["Only world leaders", "It begins with individual integrity and local action", "It's random", "It's purely mystical"], correctIndex: 1, hint: "The individual is the cell of the Ummah." },
            { type: "document", title: "Future Trends in the Ummah", description: "Demographic and spiritual analysis of Islam in the 21st century.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "How to become a Mujaddid", description: "Exploring the qualities of those who revived the deen in history.", url: "https://yaqeeninstitute.org/", platform: "Islamic History" }
        ]
    },
    {
        title: "Final Project & Certification",
        blocks: [
            { type: "callout", content: "Knowledge is not that which is memorized; knowledge is that which benefits and is transformed into action.", author: "Imam Ash-Shafi'i" },
            { type: "objectives", items: ["Consolidate the entire course into a personal 'Map of Faith'", "Develop an action plan for spiritual growth based on the 8 modules", "Verify eligibility for the completion certificate", "Reflect on the growth achieved during the course"] },
            { type: "text", content: "## From Theory to Practice\n\nYou have completed the theoretical journey. Now it is time to ground that knowledge in your reality. This lesson guides you through the final reflective project and explains the certification process." },
            { type: "infographic", layout: "grid", items: [
                { title: "Module 1-2 Review", description: "Iman and submission.", icon: "Check" },
                { title: "Module 3-4 Review", description: "Tawheed and the Names.", icon: "Sun" },
                { title: "Module 5-6 Review", description: "Prophets and the Afterlife.", icon: "Star" },
                { title: "Module 7-8 Review", description: "Modernity and Character.", icon: "Zap" }
            ]},
            { type: "text", content: "### The Final Capstone Task\n\nTo earn your certificate, you must create a 'Personal Statement of Faith'. This is an internal document where you identify: 1. Your primary name of Allah for this year. 2. One prophetic habit you will adopt. 3. One modern challenge you now feel equipped to answer." },
            { type: "scholar", translation: "A person with one book they have lived by is better than a person with a thousand books they have only read. (Traditional wisdom)", arabic: "العلم بالعمل" },
            { type: "infographic", layout: "process", items: [
                { title: "Reflect", description: "Reviewing your notes and quiz scores.", icon: "Search" },
                { title: "Synthesize", description: "Finding the thread that connects the dots.", icon: "Zap" },
                { title: "Commit", description: "Pledging to continue seeking knowledge.", icon: "Award" }
            ]},
            { type: "text", content: "### Certification Requirements\n\nTo download your certificate, ensure that you have: 1. Passed all Module Assessments with 80% or higher. 2. Viewed all video content. 3. Engaged with the interactive cards. Your certificate of 'Foundations in Islamic Faith' is a testimony to your commitment." },
            { type: "reflection", translation: "I started this course as one version of myself. Who am I as I finish it?", arabic: "رب زدني علما" },
            { type: "conclusion", content: "This is not an 'End'. it is a 'Graduation' to a higher level of living. May Allah bless your path.", author: "Course Faculty" },
            { type: "quiz", question: "What is the true measure of knowledge according to Imam Ash-Shafi'i?", options: ["Memorization count", "The benefit it brings and its transformation into action", "The number of certificates you have", "The speed of reciting it"], correctIndex: 1, hint: "Al-ilmu ma nafa'a." },
            { type: "quiz", question: "What is the 'Capstone Task' for this course?", options: ["Building a website", "Creating a Personal Statement of Faith and Action Plan", "Writing a poem", "Taking a final 1000-question test"], correctIndex: 1, hint: "Review Lesson 8.5 text." },
            { type: "quiz", question: "What is the minimum score required on Module Assessments for certification in this platform?", options: ["50%", "80%", "100%", "No minimum"], correctIndex: 1, hint: "Academic excellence standard." },
            { type: "quiz", question: "In the final infographic, what connects the dots?", options: ["A robot", "The Synthesis of your path", "A straight line", "Money"], correctIndex: 1, hint: "Bringing the modules together." },
            { type: "quiz", question: "Finish the quote: 'A person with one book they have ___ is better than...'", options: ["Read", "Lived by", "Bought", "Stolen"], correctIndex: 1, hint: "Knowledge + Action." },
            { type: "document", title: "Certification Packet", description: "Details on how to receive your physical certificate and further study paths.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    },
    {
        title: "Course Completion",
        blocks: [
            { type: "callout", content: "O Allah, benefit me with what You have taught me, and teach me that which will benefit me, and increase me in knowledge.", author: "Prophetic Dua (Sunan at-Tirmidhi 3599)" },
            { type: "text", content: "# Congratulations!\n\nYou have successfully completed the 'Foundations of Islamic Faith' (Aqidah) course. You have journeyed through the depths of theology and the heights of spiritual reflection. Your journey doesn't end here; it is the foundation for everything that comes next." },
            { type: "infographic", layout: "grid", items: [
                { title: "Next: Fiqh", description: "The study of the laws and rituals of worship.", icon: "Book" },
                { title: "Next: Seerah", description: "The deep dive into the life of the Prophet.", icon: "Sunrise" },
                { title: "Next: Tazkiyah", description: "The science of heart purification.", icon: "Heart" },
                { title: "Mentorship", description: "Finding a teacher to refine your path.", icon: "Users" }
            ]},
            { type: "quran", translation: "My Lord, increase me in knowledge. (Surah Taha 20:114)", arabic: "رَّبِّ زِدْنِي عِلْمًا" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "You are now a graduate of the Foundations series. Take this light and share it with the world. Subhanak Allahumma wa bihamdika, ash-hadu alla ilaha illa anta, astaghfiruka wa atubu ilayka." },
            { type: "document", title: "Further Reading List", description: "Recommended books for deeper study in Aqidah.", url: "https://kalamullah.com/", platform: "Library" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 8 (LIVING FAITH) & FINISHING COURSE ---');
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
