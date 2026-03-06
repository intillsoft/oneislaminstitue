const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_DATA = [
    {
        id: "d493d5ec-9a1c-43f5-bfca-8f0a28f8ac4f",
        title: "Introduction to Tawheed",
        blocks: [
            { type: "objectives", items: ["Articulate the linguistic and technical definitions of Tawheed.", "Evaluate the role of the Fitrah as an innate predisposition toward monotheism.", "Analyze Tawheed as a comprehensive worldview informing moral and psychological dimensions.", "Demonstrate an understanding of the ontological necessity of God’s oneness."] },
            { type: "concept", translation: "Tawheed: Realization and maintenance of Allah’s unity in all actions.", arabic: "توحيد" },
            { type: "concept", translation: "Fitrah: The innate, primordial disposition recognizing the Creator.", arabic: "فطرة" },
            { type: "concept", translation: "Alast: The primal covenant where souls testified to Allah’s Lordship.", arabic: "ألست" },
            { type: "text", content: "### The Core of the Faith\nThe study of Tawheed represents the highest form of knowledge in Islam, serving as the foundational pillar upon which the entire edifice of the faith is constructed. Linguistically, the term is derived from the Arabic root w-h-d, which signifies making something one or asserting its uniqueness. In theology, Tawheed is the firm conviction that Allah is uniquely One in His Lordship, His right to be worshipped, and His perfect Names and Attributes." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Innate Predisposition: Fitrah\nUnlike secular philosophies that view the human mind as a tabula rasa or blank slate, Islam teaches that every human is born with an inherent, pure natural disposition toward recognizing a higher power. This Fitrah is a profound ontological imprint causing individuals to embark on spiritual journeys in pursuit of truth." },
            { type: "quran", translation: "So turn your face toward the true natural way of life—God's chosen fitrah upon which He has formed humanity. (Surah ar-Rum 30:30)", arabic: "فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا" },
            { type: "text", content: "### The Primal Covenant\nThis innate recognition is rooted in a pre-temporal event known as the Covenant of Alast. Before the physical world was created, Allah gathered all human souls and asked them, 'Am I not your Lord?' to which all responded, 'Yes, we testify.' The call of Prophets is simply to 'remind' the soul of this original testimony." },
            { type: "infographic", layout: "process", items: [
                { title: "Alast Covenant", description: "Souls testify to Lordship before physical creation.", icon: "Globe" },
                { title: "Fitrah Imprint", description: "The soul is born with an innate recognition of the Creator.", icon: "Heart" },
                { title: "Prophetic Reminder", description: "Revelation awakens the innate Fitrah to conscious Tawheed.", icon: "BookOpen" }
            ]},
            { type: "text", content: "### Tawheed as a Comprehensive Worldview\nTawheed is a totalizing worldview that shapes every facet of existence. By grounding the self in the oneness of God, a person moves from being fragmented among worldly masters—wealth, status, validation—to being unified with a singular, noble purpose." },
            { type: "callout", content: "Worldview Audit: Identify one area of your life where you prioritize human approval over Divine pleasure, and consciously reset your intention.", author: "Action Item" },
            { type: "text", content: "### Ontological Necessity of Oneness\nSunni theologians employ scripture and reason to demonstrate Tawheed. Logically, multiple 'gods' would clash over nature's laws. The harmony seen in the cosmos testifies to a singular Supreme Controller. Furthermore, internalizing that only Allah creates and sustains frees the human mind from submitting to myths, superstitions, and tyrants." },
            { type: "hadith", translation: "Every child is born upon the fitrah (natural inclination), and then his parents make him a Jew, a Christian, or a Magian.", arabic: "كُلُّ مَوْلُودٍ يُولَدُ عَلَى الْفِطْرَةِ، فَأَبَوَاهُ يُهَوِّدَانِهِ أَوْ يُنَصِّرَانِهِ أَوْ يُمَجِّسَانِهِ" },
            { type: "quiz", question: "What is the meaning of the linguistic root w-h-d?", options: ["To read", "To make something one or assert uniqueness", "To pray in congregation", "To travel"], correctIndex: 1, hint: "It means to unify or single out." },
            { type: "quiz", question: "The concept of Fitrah suggests that humans are:", options: ["Born into sin", "Born with an innate predisposition toward monotheism", "Inherently evil", "Blank slates"], correctIndex: 1, hint: "They recognize the Creator naturally." },
            { type: "quiz", question: "Why is Tawheed considered a 'liberating' force?", options: ["It lets people do what they want", "It frees the mind from false idols and human tyrants", "It removes all rules", "It makes people wealthy"], correctIndex: 1, hint: "You only submit to One." },
            { type: "reflection", translation: "If you were isolated on a desert island with no societal influence, would your heart naturally call out to a single Creator? Why?", arabic: "تفكر" },
            { type: "document", title: "Tawheed as a Worldview", description: "Exploring the overarching paradigm of Islamic monotheism.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "3e83ba87-3ce9-4b67-bd1c-a1d283afbe7c",
        title: "Tawheed ar-Rububiyyah",
        blocks: [
            { type: "objectives", items: ["Define Tawheed ar-Rububiyyah and its three pillars: Creation, Ownership, and Governance.", "Distinguish between the Islamic 'Living Sustainer' and Deism.", "Explain the teleological arguments for a single Supreme Controller.", "Connect Allah’s absolute Lordship to psychological security (rizq and tawakkul)."] },
            { type: "concept", translation: "Rububiyyah: Monotheistic belief that Allah alone is the Creator, Owner, and Sustainer.", arabic: "ربوبية" },
            { type: "concept", translation: "Al-Khaliq: The Creator who brings things into existence from nothing.", arabic: "الخالق" },
            { type: "concept", translation: "Al-Qayyum: The Self-Sustaining One who maintains existence every second.", arabic: "القيوم" },
            { type: "text", content: "### The Singular Lord of Existence\nTawheed ar-Rububiyyah is the foundational acknowledgment that Allah is the singular Lord (Rabb) of all that exists. It entails creating, owning, sustaining, and directing the universe. No other entity shares even a fraction of these divine prerogatives." },
            { type: "infographic", layout: "grid", items: [
                { title: "Creation (Al-Khalq)", description: "Bringing from non-existence into existence.", icon: "Sun" },
                { title: "Ownership (Al-Mulk)", description: "Absolute and eternal possession of all resources.", icon: "Lock" },
                { title: "Governance (Al-Tadbir)", description: "Active management of all cosmic and microscopic affairs.", icon: "Activity" },
                { title: "Sustenance (Rizq)", description: "Guaranteed provision for every living being.", icon: "Heart" }
            ]},
            { type: "text", content: "### Islam vs. Deism: The Living Sustainer\nDeism posits that God wound up the universe like a clock and walked away. Islam vigorously rejects this. The universe is contingent upon Allah every single moment. If Allah ceased sustaining it for a blink of an eye, it would vanish. He is Al-Qayyum, actively ever-near and responding to supplication." },
            { type: "video", url: "https://www.youtube.com/watch?v=yWwOimr2D38" },
            { type: "quran", translation: "All praise is [due] to Allah, Lord of the worlds. (Surah al-Fatiha 1:2)", arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
            { type: "text", content: "### Rational Proofs: The Argument from Design\nThe Qur’an appeals to the intellect, noting the universe's precision—day and night, invisible barriers between fresh and saltwater. These are not coincidences but signs of a Supreme Controller. As the Bedouin said, 'Does not a sky with stars and a land with fairways testify to the Most Kind, Most Knowing?'" },
            { type: "hadith", translation: "Know that if the whole world were to gather together to help you, they could only help you with what Allah has written for you.", arabic: "وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ..." },
            { type: "text", content: "### Psychological Security and Sustenance\nInternalizing Rububiyyah cures modern anxiety. Knowing that rizq (provision) is guaranteed and written establishes profound peace. The believer stands firm during calamities, realizing no harm reaches them except by the Lord’s permission. Trust shifts from worldly means (the 'mailman') to the Creator (the 'Sender')." },
            { type: "callout", content: "Gratitude Reset: When receiving a paycheck or passing an exam, consciously acknowledge Allah as the True Provider before thanking your boss or teacher.", author: "Action Item" },
            { type: "quiz", question: "Which pillar of Rububiyyah emphasizes that true ownership belongs solely to Allah?", options: ["Al-Khalq", "Al-Mulk", "Al-Tadbir", "Al-Ihya"], correctIndex: 1, hint: "Mulk means kingdom or ownership." },
            { type: "quiz", question: "Why is the Name Al-Qayyum central to refuting Deism?", options: ["It means God is resting", "It means Allah actively maintains existence every second", "It means God only created the world once", "It means God is far away"], correctIndex: 1, hint: "He is the Sustainer." },
            { type: "quiz", question: "How does belief in pre-determined rizq reduce anxiety?", options: ["It abolishes hard work", "It removes fear of loss and shifts trust to the Infinite Provider", "It ensures lottery wins", "It makes studying unnecessary"], correctIndex: 1, hint: "It brings peace of mind." },
            { type: "reflection", translation: "Look at your own hand. Can you identify the specific 'signs' of governance that keep it functioning right now?", arabic: "تفكر في الخلق" },
            { type: "document", title: "The Oneness of Lordship", description: "Comprehensive theological breakdown of Rububiyyah.", url: "https://www.abuaminaelias.com/", platform: "Article" }
        ]
    },
    {
        id: "ff96abfe-d748-4eac-bb55-eb5dc146747b",
        title: "Tawheed al-Uluhiyyah",
        blocks: [
            { type: "objectives", items: ["Define Tawheed al-Uluhiyyah and its exclusivity to Allah.", "Demonstrate how Rububiyyah is the logical imperative for Uluhiyyah.", "Categorize acts of worship into internal, verbal, and physical dimensions.", "Analyze the concept of Servanthood (Uboodiyyah) as the highest freedom."] },
            { type: "concept", translation: "Uluhiyyah: Singling out Allah for all acts of worship.", arabic: "ألوهية" },
            { type: "concept", translation: "Ibadah: Comprehensive term for everything Allah loves of inward/outward deeds.", arabic: "عبادة" },
            { type: "concept", translation: "Uboodiyyah: Servanthood or complete submission to the Creator.", arabic: "عبودية" },
            { type: "text", content: "### The Essence of Worship\nTawheed al-Uluhiyyah is the practical core of the Islamic message. While many intellectually accept a Creator, directing all devotion, love, and submission solely to Him is the true test. This was the primary mission of every Prophet: 'O my people, worship Allah; you have no deity other than Him.'" },
            { type: "video", url: "https://www.youtube.com/watch?v=T_T4EHV25e8" },
            { type: "text", content: "### Rububiyyah as Proof for Uluhiyyah\nLordship is the evidence for Worship. If Allah alone creates, owns, and sustains, it is logically inconsistent to worship anything else. The Benefactor mapping out life deserves the sole gratitude and submission of the beneficiary." },
            { type: "quran", translation: "And I did not create the jinn and mankind except to worship Me. (Surah adh-Dhariyat 51:56)", arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ" },
            { type: "infographic", layout: "process", items: [
                { title: "Internal Acts", description: "Love, fear, hope, and trust directed solely to Allah.", icon: "Heart" },
                { title: "Verbal Acts", description: "Supplication (Dua), oaths, and dhikr meant only for Him.", icon: "MessageCircle" },
                { title: "Physical Acts", description: "Prostration, fasting, and charity performed for His pleasure.", icon: "Activity" }
            ]},
            { type: "text", content: "### The Liberation of Servanthood\nModern secularism views 'servanthood' negatively, but Islamic theology presents Uboodiyyah to Allah as ultimate liberation. By becoming a slave to the One True God, a person is freed from slavery to the 'many'—social pressures, consumerism, and human tyrants." },
            { type: "hadith", translation: "Supplication (Dua) is worship.", arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ" },
            { type: "text", content: "### Ikhlas: The Soul of Worship\nAny deed depends on Ikhlas (sincerity). Praying beautifully just to be praised by people is 'minor shirk' (riya) and rejected. True Uluhiyyah requires a heart free of all but Allah, elevating even worldly actions like working or studying into acts of worship when the intention is pure." },
            { type: "callout", content: "Peer Pressure Shield: When tempted to do wrong to 'fit in,' ask: 'Who is more worthy of my fear and love right now: these people or my Lord?'", author: "Action Item" },
            { type: "quiz", question: "What is the literal meaning of the term Ilaah?", options: ["Creator", "The One who is worshipped and loved", "The King", "The Judge"], correctIndex: 1, hint: "It refers to the object of devotion." },
            { type: "quiz", question: "Why is Dua called the 'essence of worship'?", options: ["It's easy", "It's a direct admission of dependence on the Creator", "Everyone does it", "It is spoken aloud"], correctIndex: 1, hint: "It shows utter reliance." },
            { type: "quiz", question: "True Servanthood (Uboodiyyah) leads to:", options: ["Oppression", "Freedom from becoming a slave to human whims and desires", "Laziness", "Confusion"], correctIndex: 1, hint: "It liberates the soul." },
            { type: "reflection", translation: "Identify one 'worldly lord' (career, social status) competing for your heart. How can you reclaim your heart for Allah alone?", arabic: "تفكر" },
            { type: "document", title: "Why Does God Ask for Worship?", description: "Understanding the divine wisdom behind Uluhiyyah.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('Seeding Module 3 - Part 1...');
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

        const { error, data } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('module_id', 'c5727a8e-ef64-4ce3-a075-2cf4d2bac2a4')
            .eq('title', item.title === 'Major and Minor Shirk' ? 'Types of Shirk' : item.title).select();
        
        if (error) console.log('\nERR: ' + error.message);
        else console.log(`DONE! Seeded ${item.title}`);
    }
}

seedLessons();
