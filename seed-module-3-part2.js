const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_DATA = [
    {
        id: "2c64b633-5cdd-4add-8d96-c146e5ca93c0",
        title: "Tawheed al-Asma wa Sifat",
        blocks: [
            { type: "objectives", items: ["Define Tawheed al-Asma wa Sifat and demonstrate the Sunni methodology of affirming Allah’s attributes without distortion or anthropomorphism.", "Articulate the importance of the four negations: Tahreef, Ta'teel, Takyeef, and Tamtheel.", "Analyze the psychological impact of knowing Allah’s Names, like Al-Wadud and Al-Aziz.", "Explain the significance of 'Pairing' in Allah’s Names within the Qur’anic discourse."] },
            { type: "concept", translation: "Asma wa Sifat: Belief in Allah’s Names and Attributes exactly as He described Himself.", arabic: "الأسماء والصفات" },
            { type: "concept", translation: "Bila Kayf: Affirming the reality of an attribute while acknowledging its modality is beyond human comprehension.", arabic: "بلا كيف" },
            { type: "text", content: "### Knowing Who Allah Is\nTawheed al-Asma wa Sifat is the highest level of knowing Allah. Knowing He is one isn’t enough; we must know who He is. By learning the Names and Attributes revealed in the Qur’an and authentic Hadith, a believer transitions from an abstract intellectualism to a personal, intimate relationship with their Creator." },
            { type: "video", url: "https://www.youtube.com/watch?v=O-UoQW2_DDU" },
            { type: "text", content: "### The Sunni Methodology: Affirmation without Distortion\nThe Sunni methodology follows Ithbat (affirmation) coupled with Tanzeeh (transcendence). The primary rule is: 'There is nothing like Him, and He is the All-Hearing, All-Seeing.' We affirm the Attributes without negating any resemblance to creation." },
            { type: "infographic", layout: "grid", items: [
                { title: "No Tahreef", description: "No sorting or metaphorically explaining away attributes to avoid perceived difficulties.", icon: "XCircle" },
                { title: "No Ta'teel", description: "No complete denial or stripping Allah of His Attributes.", icon: "XCircle" },
                { title: "No Takyeef", description: "No speculating about the 'how' or physical modality of Attributes.", icon: "XCircle" },
                { title: "No Tamtheel", description: "No likening Allah’s Attributes to the flawed attributes of creation.", icon: "XCircle" }
            ]},
            { type: "quran", translation: "There is nothing like Him, and He is the All-Hearing, All-Seeing. (Surah ash-Shura 42:11)", arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ" },
            { type: "text", content: "### The Divine Wisdom of Pairing Names\nThe Qur’an deliberately pairs specific Names to address human emotional needs. Al-Aziz (The Almighty) is frequently paired with Al-Hakim (The All-Wise) to reassure believers that absolute power is governed by perfect wisdom. Al-Ghafoor (The Forgiving) is paired with Ar-Raheem (The Especially Merciful), demonstrating that forgiveness is rooted in love, not merely a legal transaction." },
            { type: "hadith", translation: "Allah has ninety-nine names... whoever preserves them will enter Paradise.", arabic: "إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ" },
            { type: "text", content: "### Psychological Impact & Character\nKnowing the Names provides the lens to interpret reality. Knowing Allah as Al-Wadud (The Loving) yields affection and mercy in every verse. Knowing He is Al-Basir prevents secret sins; knowing He is Al-Qadir provides courage in impossible situations. The believer models themselves after the permissible traits under His guidance." },
            { type: "callout", content: "Name of the Day: Choose one Name (e.g., Al-Lateef—The Most Subtle) and look for three examples of that attribute manifesting in your daily life.", author: "Action Item" },
            { type: "quiz", question: "Which term describes metaphorically changing the meaning of an attribute?", options: ["Ta'teel", "Tahreef", "Tamtheel", "Takyeef"], correctIndex: 1, hint: "Distortion." },
            { type: "quiz", question: "What is the meaning of 'Bila Kayf'?", options: ["God is human-like", "Without asking 'how' or seeking the modality", "Everything is symbolic", "Denying attributes completely"], correctIndex: 1, hint: "Accepting without specifying modality." },
            { type: "quiz", question: "Why does the Qur’an often pair Al-Aziz (The Almighty) with Al-Hakim (The All-Wise)?", options: ["To show Allah is angry", "To reassure that His power is always balanced with wisdom", "Because it is poetic", "To describe weather"], correctIndex: 1, hint: "Power governed by intent." },
            { type: "reflection", translation: "If you read the Qur’an viewing Allah primarily as Al-Wadud (The Loving), how would your feeling of 'obligation' to pray change into a feeling of 'longing'?", arabic: "الودود والتفكر" },
            { type: "document", title: "The Divine Wisdom Behind Pairing Allah's Names", description: "Why specific names frequently appear together in the Qur'an.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "e137bc38-2df8-45be-beb2-9cf5d06bde0a",
        title: "Major and Minor Shirk",
        blocks: [
            { type: "objectives", items: ["Define Shirk and differentiate between Major (Akbar) and Minor (Asghar).", "Analyze why Shirk is the 'greatest injustice' and the only unforgivable sin if unrepented.", "Identify common modern forms of Major Shirk.", "Evaluate 'Hidden Shirk' (Khafi) relative to intention and social behavior."] },
            { type: "concept", translation: "Shirk al-Akbar: Major Shirk; equating something with Allah, taking a person out of Islam.", arabic: "الشرك الأكبر" },
            { type: "concept", translation: "Shirk al-Asghar: Minor Shirk; acts leading toward Major Shirk or comprising sincerity, like Riya.", arabic: "الشرك الأصغر" },
            { type: "concept", translation: "Riya: 'Showing off' religious acts for human praise.", arabic: "الرياء" },
            { type: "text", content: "### Shirk: The Ultimate Spiritual Disaster\nShirk, linguistically meaning 'sharing' or 'associating,' is the giving of exclusive divine rights to something else. It is the heinous sin directly assaulting the core truth of existence: only one Sovereign Lord reigns. Shirk al-Akbar is the nullifier of Islam—believing that someone other than Allah can create, sustain, or holds independent power over life." },
            { type: "infographic", layout: "process", items: [
                { title: "Shirk al-Akbar", description: "Worshipping idols or dead saints. Nullifies all deeds. Exits Islam.", icon: "XOctagon" },
                { title: "Shirk al-Asghar", description: "Riya (showing off) or swearing by other than Allah. Major sin; stains the heart.", icon: "EyeOff" },
                { title: "Hidden Shirk", description: "Relying purely on material means (Asbabism) as the absolute cause of success.", icon: "ShieldAlert" }
            ]},
            { type: "text", content: "### The Subtle Ant: Minor Shirk\nShirk al-Asghar is often more dangerous for the practicing Muslim because it is 'more hidden than a crawling ant on a dark night.' It doesn’t expel one from Islam but nullifies the specific deed it stains. Examples include Riya—beautifying prayer for praise (which the Prophet feared most for his Companions), or superstitious belief in 'lucky charms' which diverts trust from Allah." },
            { type: "video", url: "https://www.youtube.com/watch?v=r0lF00gXbEU" },
            { type: "quran", translation: "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills. (Surah an-Nisa 4:48)", arabic: "إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ" },
            { type: "text", content: "### The Greatest Injustice (Dhulm)\nShirk is the ultimate act of Dhulm (putting something where it doesn't belong). Giving the credit for life, health, and air to a created being is monumental ingratitude. Furthermore, it degrades humanity: when a human bows to a stone or another mortal, they lower their divinely granted dignity. Tawheed elevates man to serve only True Greatness." },
            { type: "hadith", translation: "What I fear most for you is minor shirk (riya).", arabic: "إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الْأَصْغَرُ، الرِّيَاءُ" },
            { type: "text", content: "### The Danger of 'Means' (Asbab)\nIslam instructs us to utilize means—studying, medicine, work—but trusting the 'means' as the independent healer or provider is hidden shirk. The believer takes the medicine while their heart is fiercely attached to Ash-Shafi (The True Healer)." },
            { type: "callout", content: "Charity Anonymity: Perform one act of charity this week that absolutely no one knows about to aggressively counter any latent desire for human praise (Riya).", author: "Action Item" },
            { type: "quiz", question: "Which is the 'unforgivable sin' if a person dies without repenting?", options: ["Murder", "Major Shirk", "Missing a fast", "Lying"], correctIndex: 1, hint: "Associating partners with the Divine." },
            { type: "quiz", question: "Why is Riya considered 'Minor Shirk'?", options: ["It is not a sin", "It involves a hidden partner (human praise) in your primary intention", "It only happens in masjids", "It's an academic term"], correctIndex: 1, hint: "Showing off." },
            { type: "quiz", question: "What happens to the good deeds of one committing Major Shirk?", options: ["They double", "They are nullified entirely", "They remain valid if done previously", "They are hidden"], correctIndex: 1, hint: "Total spiritual bankruptcy." },
            { type: "reflection", translation: "If you performed a major good deed and no one ever learned of it or thanked you, would you feel the same satisfaction? Why or why not?", arabic: "تفكر حول الرياء" },
            { type: "document", title: "Why is Shirk the Greatest Sin?", description: "Understanding the gravity of associating partners with God.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "aab80e4c-4513-40ab-9db5-3237a2539c95",
        title: "Hidden Shirk in Modern Times",
        blocks: [
            { type: "objectives", items: ["Identify modern 'gods'—Celebrity Culture, Materialism, the Ego.", "Explain the spiritual dangers of Secularism as a worldview bypassing Divine sovereignty.", "Analyze 'Asbabism' and its psychological toll.", "Develop a strategy for maintaining a Tawheed-centered life in a digital age."] },
            { type: "concept", translation: "Al-Hawa: Deification of personal desires or ego.", arabic: "الهوى" },
            { type: "concept", translation: "Secularism: A worldview attempting to organize human life purely independent of God.", arabic: "علمنة / العلمانية" },
            { type: "concept", translation: "Asbabism: A psychological trap of believing material causes are the sole, independent masters of fate.", arabic: "الأسباب كغاية" },
            { type: "text", content: "### Modern Manifestations of Shirk\nIn the 21st century, Shirk has subtly migrated from statues to screens. Instead of bowing to wood, humanity often bows to the 'self,' 'celebrities,' or 'the market.' Because they are socially acceptable and culturally celebrated, these hidden idols are aggressively destructive to the Fitrah." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### Deification of Desires (Hawa)\nThe Qur'an warns against the one who 'takes his own desire as his god.' In extreme modern individualism, whatever a person 'feels' like doing becomes the ultimate truth. This replaces the sovereignty of Allah with the whims of the Nafs (ego), leading to a 'post-truth' culture grounded purely in transient human emotions." },
            { type: "infographic", layout: "grid", items: [
                { title: "Materialist Science", description: "Denies the Unseen, causing existential emptiness.", icon: "Database" },
                { title: "Social Media", description: "Cultivates Riya, fragmenting the soul for likes.", icon: "Smartphone" },
                { title: "Consumerism", description: "Links absolute security to continuous acquiring.", icon: "ShoppingCart" },
                { title: "Celebrity Worship", description: "Attributing absolute perfection or authority to mortals.", icon: "Star" }
            ]},
            { type: "text", content: "### The Vacuum of Secularism\nSecularism isn't just a political system; it's an ideological 'soup.' Filtering religious practice solely by emotional output (e.g., 'I will pray if I feel immediate benefit') inadvertently sets human feelings as more authoritative than divine command. It shifts the primary focus from submitting to 'Truth' to maximizing 'Experience.'" },
            { type: "quran", translation: "Have you seen he who has taken as his god his [own] desire? (Surah al-Jathiyah 45:23)", arabic: "أَفَرَأَيْتَ مَنِ اتَّخَذَ إِلَٰهَهُ هَوَاهُ" },
            { type: "text", content: "### The Anxiety of Asbabism\nAsbabism is an over-reliance on material causes (asbab)—believing a degree, an investment, or a specific treatment independently dictates our success or survival. When these 'means' fail, the modern individual suffers total psychological collapse because they have no transcendent anchor. The Muwahhid (monotheist) works immensely hard, yet sleeps soundly because the ultimate result always rests with the Lord." },
            { type: "hadith", translation: "Shirk in this Ummah is more hidden than the crawling of an ant.", arabic: "الشِّرْكُ فِي هَذِهِ الأُمَّةِ أَخْفَى مِنْ دَبِيبِ النَّمْلِ" },
            { type: "callout", content: "Digital Fast & Evaluation: Spend 24 hours entirely away from social media. Observe how your inherent craving for daily human praise or 'likes' reacts to a dry spell.", author: "Action Item" },
            { type: "quiz", question: "What is the modern manifestation of taking 'one's desire as a god'?", options: ["Studying extremely hard", "Al-Hawa—following personal whims over divine command", "Planting large gardens", "Traveling broadly"], correctIndex: 1, hint: "Deifying the self." },
            { type: "quiz", question: "Why is 'Asbabism' a profound threat to mental health?", options: ["It forces physical exhaustion", "It makes survival seemingly dependent entirely on fragile, breakable material causes", "It is scientifically complex", "It prevents learning"], correctIndex: 1, hint: "A broken portfolio ruins the heart." },
            { type: "quiz", question: "According to scholars, the myth of secularism is that it is:", options: ["A purely neutral space", "Extremely ancient", "A synonym for religious piety", "Geographically limited"], correctIndex: 0, hint: "It claims to be neutral but acts as a religion." },
            { type: "reflection", translation: "If your strongest social media profile was deleted tomorrow, would you feel you 'lost' your purpose or existential value? What does that reveal about your object of worship?", arabic: "تفكر عن الأصنام الحديثة" },
            { type: "document", title: "Breaking Free from Secular Thought", description: "Unshackling the Muslim mind from secular ideologies.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "0456c71d-bfb9-4254-92f4-44dbe5597727",
        title: "Weekly Assessment",
        blocks: [
            { type: "objectives", items: ["Synthesize the three categories of Tawheed (Rububiyyah, Uluhiyyah, Asma wa Sifat) into a unified narrative.", "Apply the 'Tawheed Self-Evaluation Checklist' to analyze personal spiritual states.", "Design an action plan to neutralize modern sources of hidden shirk.", "Demonstrate theoretical proficiency via the final conceptual assessment."] },
            { type: "concept", translation: "Muraqabah: Constant internal vigilance and awareness of the Divine presence.", arabic: "مراقبة" },
            { type: "concept", translation: "Tawheed as Axis: The central hub connecting all moral, ethical, and ritual practice.", arabic: "محور التوحيد" },
            { type: "text", content: "### Review: 10 Pillars of Tawheed (Part 1)\n1. **Tawheed is the Axis**: The central truth providing logical consistency and peace.\n2. **The Fitrah Compass**: Humans are born innately predisposed to recognize Allah.\n3. **Lordship (Rububiyyah) Necessitates Worship (Uluhiyyah)**: The sole Sustainer alone is worthy of our ultimate love and fear.\n4. **Active Sustenance**: Rejecting Deism; Allah actively sustains every atom at every millisecond." },
            { type: "text", content: "### Review: 10 Pillars of Tawheed (Part 2)\n5. **Names as Portals**: Knowing Asma wa Sifat creates profound, intimate relationship.\n6. **Sunni Methodology**: Affirming Attributes without Tamtheel (comparison) or Ta'teel (denial).\n7. **Shirk is the Greatest Dhulm (Injustice)**: Denying the Creator His absolute and exclusive right.\n8. **Minor Shirk's Subtle Poison**: Riya actively pollutes and nullifies individual deeds.\n9. **Ideological Idols**: Resisting Secularism, Nationalism, and the Ego as modern false deities.\n10. **Tawheed is Liberation**: By submitting to the One True Master, a person is utterly freed from the slavery of thousand lesser masters." },
            { type: "video", url: "https://www.youtube.com/watch?v=48yD3j0H9U8" },
            { type: "infographic", layout: "process", items: [
                { title: "Fitrah Awakened", description: "Recognizing the internal compass via Rububiyyah.", icon: "Compass" },
                { title: "Uluhiyyah Activated", description: "Directing all worship explicitly to the Lord.", icon: "Heart" },
                { title: "Hidden Shirk Eradicated", description: "Shielding the mind from 'Asbabism' and 'Riya'.", icon: "Shield" },
                { title: "Character Emulation", description: "Taking on the beautiful traits via Asma wa Sifat.", icon: "Star" }
            ]},
            { type: "text", content: "### Practical Checklist for the Believer\n- When a crisis hits, is my absolute first intellectual and vocal response a Dua or my bank account balance?\n- Am I as conscious of Allah’s Sight (Al-Basir) when I am isolated with my phone as I am sitting in the local mosque?\n- Do I use language identifying Allah as Mudabbir ('If Allah didn't allow it...'), or do I blame 'bad luck' unconditionally?" },
            { type: "callout", content: "The Final Commitment: Remove superstitious charms, perform daily anonymous charity, and deliberately select one 'Name of the Week' to intensely focus your worldview through.", author: "Weekly Action" },
            { type: "quiz", question: "Which category of Tawheed relates inherently to Allah's role as the active 'Disposer of Affairs'?", options: ["Uluhiyyah", "Asma wa Sifat", "Rububiyyah", "Akhlaq"], correctIndex: 2, hint: "Lordship and Control." },
            { type: "quiz", question: "The Meccan pagans generally accepted Tawheed ar-Rububiyyah, but structurally failed and opposed:", options: ["Historical accuracy", "Tawheed al-Uluhiyyah (Worship)", "Architecture", "Pilgrimage routing"], correctIndex: 1, hint: "They directed Dua to idols." },
            { type: "quiz", question: "Why is 'Minor Shirk' so phenomenally dangerous?", options: ["It ejects you from Islam instantaneously", "It is extremely subtle and stealthily nullifies the reward of excellent deeds", "It requires physical statues", "It involves historical debates"], correctIndex: 1, hint: "The crawling ant." },
            { type: "quiz", question: "How does 'Asbabism' operate?", options: ["Relying exclusively on prayers without action", "Believing material causes independently possess power over success or failure", "A method of philosophical deduction", "Refusing medical treatment altogether"], correctIndex: 1, hint: "Revering the 'mailman' above the 'Sender'." },
            { type: "quiz", question: "The 'Argument from Design' logically points to:", options: ["Blind luck and random mutations", "A solitary Supreme Intelligence managing precision laws", "Human ingenuity", "Multiple conflicting gods"], correctIndex: 1, hint: "Harmony requires singularity." },
            { type: "reflection", translation: "If you were deeply honest with yourself: are you currently a slave to the 'many' (approval, money, aesthetic trends), or a firmly integrated slave of the 'One'?", arabic: "تفكر عام" },
            { type: "document", title: "Complete Module Recap", description: "Revisiting foundational monotheistic principles before entering Module 4.", url: "https://seekersguidance.org/", platform: "SeekersGuidance" }
        ]
    }
];

async function seedLessons() {
    console.log('Seeding Module 3 - Part 2...');
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
