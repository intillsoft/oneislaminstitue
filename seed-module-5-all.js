const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_ID = 'e3f3d8ac-41bb-4eb6-ab3a-ca93d4b705bd';

const LESSON_DATA = [
    {
        id: "8386da0e-8873-4a8d-9c1a-6790e2be3b83",
        title: "The Meaning of Fitrah in Islam",
        blocks: [
            { type: "callout", content: "So direct your face toward the religion, inclining to truth. Adhere to the fitrah of Allah upon which He has created all people.", author: "Surah Ar-Rum 30:30" },
            { type: "objectives", items: ["Understand the linguistic and theological dimensions of the fitrah.", "Distinguish between the Islamic paradigm of innate disposition and Western concepts of the 'blank slate'.", "Explore the epistemological role of the fitrah as a primary source of knowledge.", "Identify the relationship between fitrah, conscience, and external divine guidance."] },
            { type: "concept", translation: "Fa-ta-ra: The Arabic tri-literal root signifying the act of cleaving, splitting, or originating something for the first time.", arabic: "فطر" },
            { type: "concept", translation: "Hanif: A person who naturally inclines toward monotheism and the truth, turning away from all forms of polytheism and falsehood.", arabic: "حنيف" },
            { type: "text", content: "### The Myth of the Blank Slate\nThe discourse on the fitrah begins with its linguistic etymology. Derived from the root 'fa-ta-ra' (cleaving open or originating), it suggests a creation brought forth into its first state of existence perfectly suited for its purpose. Unlike the 'tabula rasa' (blank slate) notion, the Islamic tradition asserts that the human being enters the world with sophisticated 'factory settings'. These constitute an innate predisposition toward recognizing a Creator and an instinctive inclination toward moral goodness." },
            { type: "scholar", translation: "The fitrah is not merely a passive capacity to accept information but an active, positive inclination toward Tawhid. The truths established by the fitrah require no external logical proof. (Ibn Taymiyyah)", arabic: "ابن تيمية" },
            { type: "infographic", layout: "grid", items: [
                { title: "Cognitive", description: "Recognition of causality and first principles. Rational basis for the necessity of a Creator.", icon: "Brain" },
                { title: "Affective", description: "Innate love for justice, mercy, and compassion. Alignment with Divine Names.", icon: "Heart" },
                { title: "Ethical", description: "Feeling of guilt after wrongdoing; drive for truth. Moral accountability.", icon: "Shield" },
                { title: "Physical", description: "Natural inclination toward cleanliness and hygiene.", icon: "Activity" }
            ]},
            { type: "text", content: "### The Covenant of Alast\nThe genesis of this innate disposition is the primordial event known as the Covenant of Alast. Before the material universe, Allah drew forth all human souls and asked: 'Am I not your Lord?' Every soul responded, 'Yes, we testify.' The earthly experience is therefore a process of 'recollecting' this ancient truth. When the fitrah is exposed to revelation, it experiences profound familiarity because it aligns perfectly with its internal programming." },
            { type: "hadith", translation: "Allah created all servants as Hunafa (upright monotheists), but the devils (Shayatin) led them away from their true nature... (Hadith Qudsi)", arabic: "وإني خلقت عبادي حنفاء كلهم..." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Internal Compass and the Map\nThe fitrah operates as an internal moral compass. Just as the physical body has an innate aversion to harmful substances, the spiritually healthy fitrah possesses an inherent aversion to falsehood and injustice. However, the compass alone is insufficient. It points north, but it requires the detailed 'map' of revelation (the Qur'an and Sunnah) to navigate the complexities of life." },
            { type: "callout", content: "The Echo Exercise: Dedicate 10 minutes to sit in absolute silence in nature. Observe the order and beauty, and attempt to quiet daily 'noise' to allow the internal 'echo' of the fitrah to surface.", author: "Action Item" },
            { type: "quiz", question: "What does the Arabic root 'fa-ta-ra' linguistically imply?", options: ["To hide or cover something", "To cleave open or originate for the first time", "To repeat a previous action", "To sleep deeply"], correctIndex: 1, hint: "It refers to the beginning of creation." },
            { type: "quiz", question: "How does the Islamic concept of fitrah differ from the 'tabula rasa' (blank slate) theory?", options: ["It is exactly the same.", "Tabula rasa suggests humans are born without innate content; fitrah posits an active inclination toward monotheism from birth.", "Fitrah means humans are born with all knowledge already downloaded.", "Tabula rasa is a religious concept; fitrah is scientific."], correctIndex: 1, hint: "You are not born empty." },
            { type: "quiz", question: "According to Ibn Taymiyyah, the foundational truths of the fitrah:", options: ["Require intense philosophical proof.", "Are the basis for all other knowledge and require no external proof.", "Are weak and easily forgotten.", "Are only found in certain cultures."], correctIndex: 1, hint: "They are the 'factory settings'." },
            { type: "quiz", question: "What does the concept of 'Din al-Fitrah' imply about Islam?", options: ["It is a religion only for people living in the wilderness.", "Islamic teachings are in perfect harmony with the uncorrupted human state.", "It rejects all forms of science and technology.", "It requires a complete denial of human nature."], correctIndex: 1, hint: "It fits like a tailored glove." },
            { type: "reflection", translation: "If the fitrah is a perfectly calibrated compass, what 'magnetic fields' (e.g., media, habits) in your routine might be disrupting its ability to point toward 'True North'?", arabic: "تفكر عن الفطرة" },
            { type: "document", title: "The Fitrah: The Innate Disposition toward God", description: "Yaqeen Institute paper exploring the theological nuances of human nature.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "0c5b29d2-8668-4bec-b350-9c2c285c389f",
        title: "The Hadith of Fitrah Explained",
        blocks: [
            { type: "objectives", items: ["Analyze the seminal Prophetic statement regarding the fitrah and parenting.", "Explore the nuances of the 'mutilation' analogy used by the Prophet.", "Evaluate different scholarly viewpoints on the legal status of children who die in infancy.", "Understand the severe prophetic warning regarding environmental influences on faith."] },
            { type: "concept", translation: "Mutilation (Jad’a): A Prophetic analogy describing external corruption of a child’s perfect spiritual state.", arabic: "جدعاء" },
            { type: "concept", translation: "Millah: A term referring to a religious creed or community.", arabic: "ملة" },
            { type: "text", content: "### The Seminal Hadith\nThe Prophet Muhammad ﷺ provided the most famous articulation of this concept: 'Every child is born upon the fitrah. It is their parents who make them into a Jew, Christian, or Magian'. This hadith is pivotal as it establishes the baseline of human existence as one of purity and monotheism." },
            { type: "hadith", translation: "Every child is born upon the fitrah. It is their parents who make them into a Jew, Christian, or Magian... just as an animal delivers a perfect baby animal. Do you find it mutilated (before you mutilate it yourselves)?", arabic: "كُلُّ مَوْلُودٍ يُولَدُ عَلَى الْفِطْرَةِ، فَأَبَوَاهُ يُهَوِّدَانِهِ، أَوْ يُنَصِّرَانِهِ، أَوْ يُمَجِّسَانِهِ" },
            { type: "infographic", layout: "process", items: [
                { title: "Imam Nawawi", description: "An 'unconfirmed state' of potential. Children are innocent.", icon: "Check" },
                { title: "Ibn Taymiyyah", description: "A 'positive inclination'. The soul actively seeks Allah unless blocked.", icon: "ArrowUp" },
                { title: "Ibn al-Mubarak", description: "The 'Ultimate Destiny' decreed by Allah regarding the person's end.", icon: "Compass" }
            ]},
            { type: "text", content: "### The Omission of 'Muslim'\nA critical nuance is that the Prophet did not say parents 'make the child a Muslim'. This omission implies that submitting to the Creator (being a Muslim) is the natural, default state requiring no external conversion. Judaism, Christianity, etc., are examples of specific 'enculturation' that divert the child. This highlights parents as primary 'socializing agents'." },
            { type: "quran", translation: "And [mention] when your Lord took from the children of Adam... their descendants and made them testify of themselves, [saying to them], 'Am I not your Lord?' They said, 'Yes, we have testified.' (Surah al-A'raf 7:172)", arabic: "أَلَسْتُ بِرَبِّكُمْ ۖ قَالُوا بَلَىٰ" },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "text", content: "### The Danger of Cultural Amputation\nThe 'mutilation' analogy warns against cultural and ideological amputation. Just as cutting an animal's ear permanently alters its natural form, exposure to corrupt creeds creates deep-seated distortions. Fortunately, unlike physical amputation, the spiritual fitrah is resilient and can be rediscovered through Dawah (invitation) and Tazkiyah (purification)." },
            { type: "callout", content: "Educational Shift: For parents and educators, this shifts the goal from 'indoctrination' to 'preservation'. The task is not to force something unnatural, but to protect the natural purity the child already possesses.", author: "Application" },
            { type: "quiz", question: "The Prophet's analogy of the animal offspring emphasizes that:", options: ["Children are born with physical defects.", "Children are born spiritually 'whole' and 'perfect' before society mutilates them.", "Animals and humans are the same in Islamic law.", "Animals should not be used in farming."], correctIndex: 1, hint: "They are born without 'cut ears'." },
            { type: "quiz", question: "In the famous hadith, why is 'Muslim' NOT listed as something parents 'make' their child?", options: ["Because the Prophet forgot to mention it.", "Because being a Muslim (submitting to God) is the natural, default state that requires no external conversion.", "Because children cannot be Muslims until they are 18.", "Because it is implied earlier in the sentence."], correctIndex: 1, hint: "A child does not need to be 'converted' to their factory settings." },
            { type: "quiz", question: "According to the majority of Sunni scholars, what is the fate of the children of non-Muslims who die in infancy?", options: ["They are punished for their parents' beliefs.", "They are granted Paradise because they died upon the uncorrupted fitrah.", "They are judged based on what they would have done.", "They cease to exist."], correctIndex: 1, hint: "They never reached accountability to reject the fitrah." },
            { type: "reflection", translation: "If every child is born in a state of absolute purity, how does this change the way you view and interact with children—even teenagers or those from different backgrounds?", arabic: "كل مولود يولد على الفطرة" },
            { type: "document", title: "Imam an-Nawawi's Commentary on Sahih Muslim", description: "Classical perspectives on the innocence of children and the theology of human nature.", url: "https://sunnah.com/", platform: "Sunnah.com" }
        ]
    },
    {
        id: "017ff482-870d-4d3f-a39a-1e39596b5d0b",
        title: "Children and Natural Belief",
        blocks: [
            { type: "objectives", items: ["Bridge the gap between Islamic theology and developmental psychology.", "Analyze contemporary research on innate morality in children.", "Identify the layers of environment (family, peers, society) that influence a child's religious identity.", "Understand Self-Determination Theory (SDT) in the context of internalizing faith."] },
            { type: "concept", translation: "Ahd al-Alast: The 'Covenant of Alast,' where all souls testified to Allah’s Lordship before the beginning of time.", arabic: "عهد ألست" },
            { type: "concept", translation: "Observational Spiritual Learning: The process of children internalizing the spiritual practices watched from primary caregivers.", arabic: "تعلم روحي" },
            { type: "text", content: "### Scientific Validation of Innate Morality\nThe Qur'anic concept of the Ahd al-Alast creates a deep-seated recognition of the Divine that manifests as an innate moral compass in children. Contemporary psychology supports this. The 'Baby Lab' studies at Yale demonstrate that infants as young as 5 months have an inherent preference for 'helpers' over 'hinderers', proving morality is 'built-in', not purely a social construct." },
            { type: "quran", translation: "O you who have believed, protect yourselves and your families from a Fire whose fuel is people and stones... (Surah at-Tahrim 66:6)", arabic: "قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Family", description: "Most proximal influence. Observational learning and parental modeling.", icon: "Home" },
                { title: "The Neighborhood", description: "Schools, mosques, peers. Provides a feeling of belonging (Ummah).", icon: "Users" },
                { title: "The Society", description: "Media, secularism. Challenges the 'salience' of religious identity.", icon: "Globe" }
            ]},
            { type: "text", content: "### Internalizing Faith (SDT)\nFor a child to move from external obedience to internal conviction, scholars apply Self-Determination Theory. Children need three things: 1. **Competence** (feeling 'good' at practicing faith, not just constantly criticized). 2. **Autonomy** (freedom to enact identity authentically). 3. **Relatedness** (a strong sense of belonging to the family and community)." },
            { type: "video", url: "https://www.youtube.com/watch?v=yJb1qNn_2tI" },
            { type: "text", content: "### The Danger of Bulldozer Parenting\nA major challenge is religious instability during adolescence. If the parent-child relationship is built on 'secure attachment', the child is more likely to maintain a secure attachment to Allah. 'Bulldozer' or 'helicopter' parenting—removing every obstacle—hinders the child's ability to develop the resilience needed to face spiritual challenges later." },
            { type: "callout", content: "Coactivity Practice: Engage in religious acts WITH the child rather than just telling them to do it. Take them to the mosque to experience a 'village', not just for prayer.", author: "Action Item" },
            { type: "quiz", question: "What is the 'Ahd al-Alast'?", options: ["A modern book on parenting.", "The primordial covenant where all souls testified to God's Lordship before physical creation.", "The name of a famous Islamic scholar.", "A physical document signed in Mecca."], correctIndex: 1, hint: "The 'Am I not your Lord?' event." },
            { type: "quiz", question: "According to Self-Determination Theory (SDT), what three things do teens need to truly internalize faith?", options: ["Rewards, punishments, and strict rules.", "Technology, money, and social status.", "Competence, autonomy, and relatedness.", "Fear, anxiety, and guilt."], correctIndex: 2, hint: "They need to feel capable, free, and connected." },
            { type: "quiz", question: "What did the 'Baby Lab' studies at Yale demonstrate regarding human nature?", options: ["Infants have absolutely no sense of morality until age 10.", "Infants possess an inherent, built-in preference for helpful behavior and justice.", "Infants are naturally malicious.", "Morality is 100% created by the school system."], correctIndex: 1, hint: "Validation of the fitrah's moral compass." },
            { type: "reflection", translation: "Think of a child or youth you interact with. How can you encourage their 'competence' in faith today? What small genuine encouragement could you give them instead of criticism?", arabic: "التربية الإسلامية" },
            { type: "document", title: "Will My Children Be Muslim?", description: "Yaqeen Institute research on the factors that lead to the internalizing or rejecting of faith in youth.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "89fa1cbc-f935-440a-9a60-0bd5cf633771",
        title: "How Society Shapes Faith",
        blocks: [
            { type: "objectives", items: ["Analyze the sociological forces that 'veil' the fitrah in the modern era.", "Evaluate the impact of 'Scientism' on spiritual intuition.", "Analyze Abdal Hakim Murad's critique of 'linear time' versus 'cyclical time'.", "Understand how modern identity politics challenges the concept of a fixed human nature."] },
            { type: "concept", translation: "Scientism: The ideology that material science is the ONLY valid source of knowledge, dismissing spiritual or intuitive truths.", arabic: "العلموية" },
            { type: "concept", translation: "Hawa: Lowly or base egoistic desires that warp the human disposition.", arabic: "هوى" },
            { type: "text", content: "### The Veils of Ghaflah\nWhile the fitrah is a natural orientation, it can be veiled. In Islam, 'Kufr' linguistically implies 'covering'. Society acts as a mechanism that places layers of 'filth' over the heart’s natural light, producing Ghaflah (heedlessness). Modernity is uniquely efficient at this due to constant digital stimulation, preventing the silence required for the fitrah to be heard." },
            { type: "quran", translation: "And be not like those who forgot Allah, so He made them forget themselves. Those are the defiantly disobedient. (Surah al-Hashr 59:19)", arabic: "وَلَا تَكُونُوا كَالَّذِينَ نَسُوا اللَّهَ فَأَنسَاهُمْ أَنفُسَهُمْ" },
            { type: "infographic", layout: "process", items: [
                { title: "Scientism", description: "Disconnects mind from spiritual reality -> Focus on 'Signs' in nature.", icon: "Briefcase" },
                { title: "Linear Time", description: "Causes anxiety and loss of presence -> Return to cyclical prayer rhythms.", icon: "Clock" },
                { title: "Consumer Desires", description: "Prioritizes physical appetite -> Practice self-restraint (Fasting).", icon: "ShoppingCart" }
            ]},
            { type: "text", content: "### Linear vs. Cyclical Time\nShaykh Abdal Hakim Murad identifies a modern disease: the tyranny of 'linear time'. The 'ticking clock' creates an artificial, stressful pace that snatches us from our natural selves. 'Cyclical time'—the time of the sun, moon, and five daily prayers—reconnects us to the cosmic matrix, allowing the soul to find rest and rhythm." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Myth of Fluid Identity\nModernity increasingly argues that nature is fluid—that the 'true self' is found by following passing 'feelings' (Hawa). Islam argues the opposite: the true self is found by aligning one's temporary feelings with the eternal, vertical First Principles. Furthermore, the 'necrophiliac' modern architecture (steel/glass/concrete) distances us from our 'mother'—the earth, dampening our contemplation." },
            { type: "callout", content: "Intentional Naturalness: To counter these veils, seek out natural environments. Observe the moon to track the Islamic months. When a desire arises, ask if it aligns with Allah's will before submitting to the 'Just do it' culture.", author: "Action Item" },
            { type: "quiz", question: "The ideology of 'Scientism' teaches that:", options: ["Science and Islam are perfectly compatible.", "Only things that can be physically measured or observed in a lab constitute true knowledge.", "The fitrah is the highest form of scientific study.", "We should abandon all medicine."], correctIndex: 1, hint: "It dismisses intuition and revelation." },
            { type: "quiz", question: "According to Shaykh Abdal Hakim Murad, how does 'linear time' (the ticking clock) affect the human soul?", options: ["It provides greater spiritual focus.", "It creates artificial haste, anxiety, and snatches us away from our natural biological and spiritual rhythms.", "It connects us better to the moon.", "It improves our Khushu in prayer."], correctIndex: 1, hint: "The industrial revolution mindset." },
            { type: "quiz", question: "Why is the Arabic word for disbelief ('Kufr') linguistically linked to the act of 'covering'?", options: ["Because they wore heavy coats.", "Because the truth of God is already present in the fitrah; disbelief is the act of covering that natural internal light with pride or ignorance.", "Because it relates to covering one's face.", "It is just a coincidence."], correctIndex: 1, hint: "You can't cover what isn't already there." },
            { type: "reflection", translation: "Identify one 'veil' in your current social environment (e.g., spending 3 hours on a specific app). How does it affect your ability to feel 'connected' and present in your prayers?", arabic: "تفكر عن الغفلة" },
            { type: "document", title: "When The World Makes You Forget", description: "An analysis of Ghaflah (heedlessness) in the modern era.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "70047b4b-53a1-4a41-8fd3-d75f7fdd1680",
        title: "Doubt vs. Curiosity",
        blocks: [
            { type: "objectives", items: ["Understand the epistemological difference between productive curiosity and destructive doubt.", "Apply the Islamic methodology for handling 'Waswasah' (intrusive Satanic whispers).", "Understand the principle that 'Certainty is not lifted by doubt'.", "Identify the three primary 'nodes of doubt' in the modern era."] },
            { type: "concept", translation: "Waswasah: Repetitive, baseless, and distressing intrusive whispers that aim to cause anxiety and paralysis.", arabic: "وسوسة" },
            { type: "concept", translation: "Yaqin: Certainty; a state of firm conviction that is the opposite of Shakk (destructive doubt).", arabic: "يقين" },
            { type: "text", content: "### Curiosity vs. Destructive Doubt\nCuriosity is inherent to the fitrah; it drives the search for knowledge to submit to the truth. Destructive doubt (Shakk) or Waswasah, however, is a paralyzing state that relishes skepticism and aims to induce depression. When the Sahaba experienced blasphemous intrusive thoughts that terrified them, the Prophet ﷺ reassured them saying, 'That is clear faith.' A dead heart feels no pain when poison enters it; the anxiety proves the fitrah is alive and resisting." },
            { type: "hadith", translation: "Satan comes to one of you and says, 'Who created this? Who created that?' until he says, 'Who created your Lord?' When he reaches that, one should seek refuge in Allah and stop.", arabic: "فَلْيَسْتَعِذْ بِاللَّهِ وَلْيَنْتَهِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "1. Istia'dhah", description: "Say 'A'udhu billah'. Acknowledge the thought is an external attack, not your internal truth.", icon: "Shield" },
                { title: "2. Reaffirm", description: "State 'Amantu billah' (I believe in Allah). Re-anchoring to the baseline.", icon: "Anchor" },
                { title: "3. Disengage", description: "Do NOT argue with the whisper. Shift physical focus to a productive task.", icon: "XCircle" },
                { title: "4. Inquiry", description: "If a genuine knowledge gap exists, write it down and ask a scholar later.", icon: "BookOpen" }
            ]},
            { type: "text", content: "### The Crying Baby Analogy\nA critical legal and spiritual maxim is 'Certainty is not lifted by doubt' (Al-Yaqinu la yazulu bish-shakk). Shaykh Faraz Rabbani compares an intrusive doubt to a crying baby on an airplane. It is highly annoying, but it doesn't mean the plane is crashing or that you should jump out. You simply ignore it until you reach your destination." },
            { type: "video", url: "https://www.youtube.com/watch?v=kY6I2GZg_Xo" },
            { type: "text", content: "### The Three Nodes of Doubt\nResearch shows that modern 'crises of faith' rarely stem purely from intellectual philosophy. They emerge from three nodes: 1. Moral/Social Concerns (confusion over modern views on gender/law). 2. Philosophical (evolution, problem of evil). 3. Personal Trauma (negative religious experiences, abusive figures). Healing requires addressing the root trauma, not just debating philosophy." },
            { type: "callout", content: "The Defense Strategy: When a disturbing 'What if?' arises, do not panic. Do not engage in an endless internal debate (which validates the whisper). Seek refuge, physically change your location or task, and occupy your tongue with Dhikr.", author: "Action Item" },
            { type: "quiz", question: "How did the Prophet Muhammad ﷺ respond to Companions who were terrified of the blasphemous intrusive thoughts they were experiencing?", options: ["He told them they were hypocrites.", "He said 'That is clear faith' because their sheer hatred of the thoughts proved their hearts were alive.", "He told them they needed to memorize more Qur'an.", "He ignored them."], correctIndex: 1, hint: "A dead heart doesn't feel the sting of poison." },
            { type: "quiz", question: "What is the RECOMMENDED Islamic response to an intrusive Satanic whisper (Waswasah)?", options: ["Engaging in a long, exhaustive internal philosophical debate.", "Seeking refuge in Allah, stopping the train of thought, and deliberately shifting focus.", "Telling all your friends about it on social media.", "Leaving the religion temporarily."], correctIndex: 1, hint: "Do not feed the troll in your mind." },
            { type: "quiz", question: "Which of the following describes the principle 'Certainty is not lifted by doubt'?", options: ["A passing thought cannot destroy the massive foundation of belief you have already established.", "You are never allowed to ask questions.", "If you have one doubt, you are no longer a Muslim.", "Science overrides everything."], correctIndex: 0, hint: "The airplane analogy." },
            { type: "reflection", translation: "Have you ever confused an irrational, anxiety-inducing 'whisper' with a genuine, logical inquiry? How does recognizing the source (Shaytan vs. intellect) change your response?", arabic: "تفكر عن الوسوسة" },
            { type: "document", title: "The Spiritual Disease of Doubt", description: "A comprehensive guide to managing Waswasah and Shakk in the modern world.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "061f5d30-66db-4089-87f5-e0bcdcfe96d9",
        title: "Spiritual Awareness",
        blocks: [
            { type: "objectives", items: ["Provide a practical toolkit for spiritual self-care to protect the fitrah.", "Master the steps of Tazkiyah (purification of the soul).", "Understand the critical importance of Tawbah (repentance) as 'polishing the heart'.", "Learn the prophetic 'Musk Seller' strategy for environmental design."] },
            { type: "concept", translation: "Tazkiyah: The process of purifying the soul by removing negative traits (rust) and nurturing positive ones.", arabic: "تزكية" },
            { type: "concept", translation: "Muraqabah: Watchfulness; the constant awareness that Allah is observing one's internal heart and actions.", arabic: "مراقبة" },
            { type: "text", content: "### Polishing the Mirror\nThe fitrah is incredibly resilient but delicate. If neglect or sin creates 'black dots' on the heart, it must be restored through Tazkiyah (purification). The first element is Tawbah (Repentance). Tawbah is not just for major crimes; it is a daily 'polishing' of the heart's mirror to remove the stains of Ghaflah (heedlessness), allowing the light of the fitrah to shine clearly again." },
            { type: "hadith", translation: "When a servant commits a sin, a black spot appears on his heart. If he abandons the sin, seeks forgiveness, and repents, then his heart will be polished... (Sunan al-Tirmidhi)", arabic: "نُكِتَ فِي قَلْبِهِ نُكْتَةٌ سَوْدَاءُ..." },
            { type: "infographic", layout: "grid", items: [
                { title: "Dhikr (Remembrance)", description: "Drowns out 'mental noise' and softens a hardened heart.", icon: "MessageCircle" },
                { title: "Salah (Prayer)", description: "Re-establishes the 'vertical connection' to the Divine.", icon: "ArrowUpCircle" },
                { title: "Nature Connection", description: "Reconnects the fitrah to a non-egotistic, worshipful creation.", icon: "Sun" },
                { title: "Muraqabah (Mindfulness)", description: "Assessment: 'What did I do today that pleased Allah?'", icon: "Eye" }
            ]},
            { type: "text", content: "### Consistency Over Intensity\nThe Prophet taught that the deeds most beloved to Allah are the consistent ones, even if small. A single, focused Dhikr or one highly attentive daily prayer (Salah) is vastly more restorative than an intense temporary burst of worship that results in months of burnout. The goal is to establish a sustainable 'baseline' of spiritual hygiene." },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "text", content: "### The Musk Seller Strategy\nWe must protect our peace via the 'Musk Seller' strategy. Your environment dictates your energy. If you surround yourself with the 'scent' of light—dhikr, reminders, and sincere friends (Suhbah)—your fitrah stays vibrant. If you 'open the door to a small vice' or toxic company, a large corruption will eventually enter. Tazkiyah is as much about what you remove as what you add." },
            { type: "callout", content: "The 3x3 Routine: Implement three minutes of silence/Du'a before Fajr, three minutes of focused Dhikr in the afternoon, and three minutes of Muraqabah (accounting) before bed as a shield.", author: "Action Item" },
            { type: "quiz", question: "What is the primary spiritual function of 'Tawbah' (Repentance) in relation to the heart?", options: ["It erases the physical body.", "It acts as a 'polish' that removes the black spots/rust of sin, allowing the fitrah to reflect truth clearly again.", "It is only required once in a lifetime.", "It makes a person wealthy."], correctIndex: 1, hint: "Cleaning the mirror." },
            { type: "quiz", question: "The famous Prophetic analogy of the 'Musk Seller' refers to:", options: ["The importance of starting a profitable business.", "The profound impact of righteous companionship (Suhbah); you absorb the 'scent' (worldview) of those you spend time with.", "The rules for wearing perfume in the mosque.", "The avoidance of all markets."], correctIndex: 1, hint: "Community and environment." },
            { type: "quiz", question: "Regarding spiritual practices, the Prophet ﷺ advised that the most beloved deeds to Allah are:", options: ["The most difficult and painful ones.", "The ones done consistently, even if they are small in quantity.", "Those done publicly.", "Those that require zero effort."], correctIndex: 1, hint: "Consistency prevents burnout." },
            { type: "reflection", translation: "If your heart is a mirror, what specific 'dust' (a certain app, a specific anxiety, a bad habit) has collected on it this week? What one specific act will you do today to 'polish' it?", arabic: "تزكية النفس" },
            { type: "document", title: "Protecting the Heart: A Practical Guide", description: "A synthesis of classical Imam al-Ghazali methods adapted for modern challenges.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        id: "ab9a1178-ac9e-462a-8df1-f9feab431be0",
        title: "Week 1 Final Assessment",
        blocks: [
            { type: "callout", content: "The fitrah is the compass of the human soul. While the storms of modernity and the whispers of the Nafs may try to throw it off course, the 'factory settings' provided by the Creator remain intact.", author: "Module Conclusion" },
            { type: "objectives", items: ["Review the foundational concepts of the Fitrah and its origins.", "Synthesize the defense strategies against modern heedlessness (Ghaflah).", "Complete the final assessment to test mastery of the module's core tenets."] },
            { type: "text", content: "### Module 5 Summary Review\n1. **The Primordial Imprint:** Fitrah is the uncorrupted disposition toward recognizing Allah.\n2. **The Covenant of Alast:** The pre-temporal event establishing the spiritual memory of Allah’s Lordship.\n3. **The Internal Compass:** The fitrah points to truth, but requires the 'map' of revelation to navigate safely.\n4. **Environmental Mutilation:** Society does not 'make' a Muslim, but can 'mutilate' a child into false ideologies.\n5. **Warping of Modernity:** Scientism and linear time act as veils suppressing natural spiritual intuitions.\n6. **Wisdom of Doubt:** Distressing Waswasa are often a sign of 'clear faith' and should be ignored, not debated.\n7. **Method of Polishing:** The heart is polished through Tawbah, consistent Dhikr, and righteous company (Suhbah)." },
            { type: "quiz", question: "The Arabic word 'Fitrah' comes from a root ('fa-ta-ra') meaning:", options: ["To close or seal", "To cleave, split open, or originate for the first time", "To grow or expand", "To hide away"], correctIndex: 1, hint: "The first creation." },
            { type: "quiz", question: "Which scholar prominently described the fitrah not just as a blank slate, but as an 'active, positive inclination' toward monotheism?", options: ["John Locke", "Imam Malik", "Ibn Taymiyyah", "Aristotle"], correctIndex: 2, hint: "The famous Damascene theologian." },
            { type: "quiz", question: "The 'mutilation' analogy (cutting the ears of an animal) in the famous hadith refers to:", options: ["Physical surgery", "The external corruption of a child's natural faith by parents or society", "The necessity of strict rules", "Hunting practices"], correctIndex: 1, hint: "Alteration of the perfect factory setting." },
            { type: "quiz", question: "According to Self-Determination Theory (SDT), 'competence' in developing a child's faith means:", options: ["They feel they are better than non-Muslims.", "They feel capable of successfully practicing their faith without constant criticism.", "They know more theology than their parents.", "They win all arguments."], correctIndex: 1, hint: "Feeling good at doing the practice." },
            { type: "quiz", question: "The ideology of 'Scientism' (different from science) asserts that:", options: ["Science and Islam are the same.", "Only what is physically measurable in a lab is true knowledge, dismissing spiritual intuition.", "Religion should guide all science.", "The fitrah is the highest form of science."], correctIndex: 1, hint: "Dismissing the unseen." },
            { type: "quiz", question: "The 'crying baby' analogy for Waswasa (intrusive doubts) suggests that a believer should:", options: ["Try to answer every illogical thought deeply.", "Ignore the annoying intrusive thoughts and continue their journey.", "Stop praying until the thoughts go away completely.", "Panic and jump off the plane."], correctIndex: 1, hint: "Don't engage the noise." },
            { type: "quiz", question: "In Islamic law and theology, a child who dies before the age of maturity (puberty) is generally considered to be:", options: ["Punished if their parents were not Muslim.", "Forgiven and entered into Paradise because they died upon the fitrah.", "Held in a neutral place.", "Judged based on their future potential."], correctIndex: 1, hint: "Divine Mercy for the unaccountable." },
            { type: "quiz", question: "The term 'Muraqabah' best translates to:", options: ["Fasting on Mondays", "Spiritual vigilance and constant awareness that Allah is observing you", "Memorizing the Qur'an", "Going into seclusion for 40 days"], correctIndex: 1, hint: "Watching your own heart." },
            { type: "reflection", translation: "Review the 'Spiritual Reset' concepts from this module. What is the ONE 'small but consistent' deed you commit to adding to your daily routine starting tomorrow?", arabic: "قليل دائم خير من كثير منقطع" },
            { type: "document", title: "The Return to the Fitrah", description: "A final summary paper on integrating the Fitrah into psychological well-being.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 5 (FITRAH) ---');
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
