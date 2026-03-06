const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_DATA = [
    {
        id: "5e7601b5-e409-4f9b-aa13-0ba8b985f98b",
        title: "Hypocrisy: Major and Minor",
        blocks: [
            { type: "objectives", items: ["Differentiate conceptually between Major Hypocrisy (Nifaq Akbar) and Minor Hypocrisy (Nifaq Asghar).", "Analyze why the Qur'an positions the psychological architecture of the Munafiqeen (hypocrites) in Medina as the severest threat.", "Identify specific behavioral markers of Minor Hypocrisy outlined by the Prophet ﷺ.", "Employ 'Muhasabah' (self-reckoning) frameworks to detect and uproot signs of minor hypocrisy in daily life."] },
            { type: "concept", translation: "Nifaq Akbar: Major Hypocrisy; completely concealing internal disbelief while outwardly projecting Islam.", arabic: "نفاق أكبر" },
            { type: "concept", translation: "Nifaq Asghar: Minor/Behavioral Hypocrisy; possessing true internal faith but adopting behavioral traits of hypocrites.", arabic: "نفاق أصغر" },
            { type: "text", content: "### The Hidden Rot\nIf Shirk (association) is the grand rebellion, Hypocrisy (Nifaq) is the stealthy rot eating the foundation from the inside. The root word relates to 'nafaqa', specifically referencing the tunnel of a jerboa (a desert rodent) that has multiple hidden exits to escape danger. A hypocrite possesses 'two faces,' publicly showing one persona while hiding severe corruption internally." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Doctrinal Abyss: Major Hypocrisy\nMajor Hypocrisy (Nifaq Akbar, or doctrinal hypocrisy) completely ejects a person from the religion. It arose primarily in Medina. Facing a newly powerful Islamic state, individuals like Abdullah ibn Ubayy publicly recited the Shahada to secure political and social safety, while internally hating the Prophet ﷺ and plotting against the believers. The Qur'an reserves the lowest levels of Hellfire for this group, not the pagans, because treason from within is infinitely more destructive than an open enemy." },
            { type: "infographic", layout: "grid", items: [
                { title: "Nifaq Akbar", description: "Hiding pure disbelief (Kufr). The lowest pit of Hell (Al-Darak Al-Asfal). Destroys faith completely.", icon: "XOctagon" },
                { title: "Nifaq Asghar", description: "A believer adopting the behavioral traits of hypocrites (lying, betrayed trusts). Does not eject from Islam.", icon: "EyeOff" },
                { title: "Ghaflah", description: "Heedlessness; falling asleep at the wheel. Different from active, malicious hypocrisy.", icon: "Clock" },
                { title: "Sarih al-Iman", description: "Hating intrusive whispers of doubt. The exact opposite of Nifaq.", icon: "ShieldAlert" }
            ]},
            { type: "quran", translation: "Indeed, the hypocrites will be in the lowest depths of the Fire - and never will you find for them a helper. (Surah an-Nisa 4:145)", arabic: "إِنَّ الْمُنَافِقِينَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ وَلَن تَجِدَ لَهُمْ نَصِيرًا" },
            { type: "text", content: "### Minor Hypocrisy: The Behavioral Infection\nThe Prophet ﷺ warned believers against Nifaq Asghar (Minor/Practical hypocrisy). A person might genuinely love Allah, yet exhibit the social markers of a hypocrite. He stated: 'The signs of a hypocrite are three: whenever he speaks, he lies; whenever he makes a promise, he breaks it; and whenever he is trusted, he betrays his trust.' If a believer habituates these, they walk dangerously close to the precipice of Major Nifaq." },
            { type: "hadith", translation: "The signs of a hypocrite are three: whenever he speaks, he lies; whenever he makes a promise, he breaks it; and whenever he is trusted, he betrays his trust.", arabic: "آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ" },
            { type: "callout", content: "Integrity Audit: Think of a promise you made offhandedly to a child or colleague recently. Did you fulfill it? A believer treats every mundane word as a binding contract before Allah.", author: "Action Item" },
            { type: "quiz", question: "Why does the Qur'an position Major Hypocrites in the absolute lowest depth of the Hellfire?", options: ["Because they missed prayers", "Because they stole property", "Because internal treason, hiding pure disbelief while posing as a brother, is more severely destructive than a declared enemy", "Because they migrated to Medina late"], correctIndex: 2, hint: "Treason from within." },
            { type: "quiz", question: "What is the primary characteristic of Minor Hypocrisy (Nifaq Asghar)?", options: ["Worshipping statues in public", "Possessing true internal faith but adopting behavioral traits like habitual lying and breaking trusts", "Denying the Last Day", "Never reading the Qur'an"], correctIndex: 1, hint: "The three behavioral markers." },
            { type: "quiz", question: "In classical Arabic, what does the linguistic root of 'Nifaq' relate to?", options: ["A bright lantern", "A soaring bird", "The burrow of a desert rodent with multiple hidden exits to escape when threatened", "A deep well"], correctIndex: 2, hint: "Having two faces/exits." },
            { type: "reflection", translation: "The Prophet said another sign is 'when he quarrels, he acts abusively.' When you are deeply angry with someone, do you maintain justice, or do you instantly seek to emotionally destroy them?", arabic: "تفكر عميق" },
            { type: "document", title: "Curing the Disease of Hypocrisy", description: "A psychological approach to uprooting Nifaq Asghar.", url: "https://seekersguidance.org/", platform: "SeekersGuidance" }
        ]
    },
    {
        id: "5b1a1c9b-aa18-4b99-839c-2afdc9dae8e8",
        title: "Weekly Assessment",
        blocks: [
            { type: "objectives", items: ["Synthesize the historical and operational framework extracted from the Hadith of Jibril.", "Chart the developmental trajectory from external submission (Islam) to perfected contemplation (Ihsan).", "Categorize the six pillars of Iman and their specific psychological functions (e.g., Qadr and resilience).", "Distinguish and diagnose specific behaviors belonging to Minor Hypocrisy (Nifaq Asghar) versus simple heedlessness (Ghaflah)."] },
            { type: "concept", translation: "Muhasabah: Intensely rigorous self-accounting to ensure actions mirror intentions.", arabic: "محاسبة" },
            { type: "concept", translation: "Tajdid: The continuous, daily effort of 'polishing the heart' to renew the faded garment of faith.", arabic: "تجديد" },
            { type: "text", content: "### Review: The Architecture of Belief (Part 1)\n1. **The Comprehensive Map**: The Hadith of Jibril defines the structural totality of the Deen: Islam, Iman, Ihsan, and the signs of the final Hour.\n2. **The Posture of Seeking**: Extreme Adab (etiquette), proximity, and humility are required to receive sacred knowledge.\n3. **Islam (The Scaffolding)**: The five pillars execute the physical manifestation. They break the ego through regulated hunger, structured wealth distribution, and unified physical worship." },
            { type: "text", content: "### Review: The Architecture of Belief (Part 2)\n4. **Iman (The Roots)**: The six pillars regulate internal conviction. Belief in the Unseen establishes trust in the Divine; Qadr neutralizes despair.\n5. **Ihsan (The Pinnacle)**: The twin stations of Mushahadah (Loving Witnessing) and Muraqabah (Vigilant Awareness) transform standard actions into acts of immense spiritual light (Itqan).\n6. **The Danger of Nifaq (Hypocrisy)**: The silent rot. The true believer constantly fears hypocrisy, whereas only a hypocrite feels completely secure from it." },
            { type: "video", url: "https://www.youtube.com/watch?v=48yD3j0H9U8" },
            { type: "infographic", layout: "process", items: [
                { title: "Physical Submission", description: "Pillars of Islam (Zakat, Salah, Sawm, Hajj).", icon: "Activity" },
                { title: "Internal Conviction", description: "Pillars of Iman (Angels, Books, Messengers, Qadr).", icon: "Heart" },
                { title: "Flawless Execution", description: "Ihsan (Muraqabah and Mushahadah applied to daily life).", icon: "Star" },
                { title: "Character Check", description: "Eradicating Minor Hypocrisy (Lying, Breaking Trusts).", icon: "Shield" }
            ]},
            { type: "callout", content: "The Final Commitment: Review your 'Tear in the Garment.' Determine exactly which behavioral marker of minor hypocrisy (e.g. breaking promises) you possess, and execute one opposite action (fulfilling a long-overdue promise) immediately.", author: "Weekly Action" },
            { type: "quiz", question: "In the Hadith of Jibril, which element represents the 'outward/physical' boundaries of the religion?", options: ["Ihsan", "Iman", "Islam", "Qadr"], correctIndex: 2, hint: "The five pillars." },
            { type: "quiz", question: "Why does the 'Middle Way' (Ahl al-Sunnah) strongly assert that physical actions (Amal) and faith (Iman) are deeply interconnected?", options: ["Because they view actions as a separate religion", "Because actions are the undeniable proof (Burhan) or fruit proving the health of the hidden heart", "Because words alone are enough", "Because angels perform no actions"], correctIndex: 1, hint: "The roots and the fruit." },
            { type: "quiz", question: "Which psychological trap does belief in 'Al-Qadr' (Divine Decree) directly neutralize?", options: ["Anger", "Paralyzing anxiety over the 'What If' scenarios of the past or unforeseeable future disasters", "Lying", "Sleeping excessively"], correctIndex: 1, hint: "What hit you couldn't have missed you." },
            { type: "quiz", question: "According to the Prophet ﷺ, if a person consistently 'betrays trusts' and 'lies', they exist in what specific spiritual state?", options: ["Nifaq Akbar (Major Hypocrisy) immediately ejecting them from Islam", "Nifaq Asghar (Minor/Behavioral Hypocrisy), requiring urgent psychological repentance", "Perfect Ihsan", "Standard Ghaflah (forgetting)"], correctIndex: 1, hint: "The three behavioral markers." },
            { type: "quiz", question: "Muraqabah (the Station of Vigilance in Ihsan) implies what regarding the modern world?", options: ["Removing all technology permanently", "Knowing the 'Divine Panopticon' observes every private digital search, conversation, and intention", "It only applies inside a physical mosque", "Worshipping stars"], correctIndex: 1, hint: "Allah sees what the world doesn't." },
            { type: "reflection", translation: "If Jibril (as) were to walk into your home tomorrow and ask you to 'Tell me about your Ihsan', what specific daily acts or habits could you confidently present as your answer?", arabic: "تفكر عام" },
            { type: "document", title: "Module Two Recap & Foundations for Module Three", description: "Summarizing the architecture of belief to prepare for the deep dive into Tawheed.", url: "https://seekersguidance.org/", platform: "SeekersGuidance" }
        ]
    }
];

async function seedLessons() {
    console.log('Seeding Module 2 - Part 3...');
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
