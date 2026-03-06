const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const COMPREHENSIVE_DATA = [
  {
    title: 'Definition of Iman in Qur’an and Sunnah',
    blocks: [
      {
        "id": "vid_1_1_1_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", // One Islam Productions - What is Iman?
        "order": 0
      },
      {
        "id": "txt_1_1_1_a",
        "type": "text",
        "content": "# The Definition of Iman: A Holistic Understanding\n\nIman is not merely 'faith' in the sense of a passive acknowledgment. In the Quranic and Sunnah context, it is a dynamic state of being. \n\n## 1. The Tripartite Definition\nAccording to the mainstream scholars of Ahlus Sunnah, Iman is defined by three essential pillars:\n1. **Qawl bi al-Lisan** (Statement of the Tongue): The verbal testimony of faith.\n2. **Tasdiq bi al-Qalb** (Conviction of the Heart): Sincere belief and affirmation.\n3. **Amal bi al-Arkan** (Action of the Limbs): The practice of righteous deeds.\n\nWithout all three, the tree of faith cannot produce its spiritual fruits.",
        "order": 1
      },
      {
        "id": "img_1_1_1_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_1_1_b",
        "type": "text",
        "content": "## 2. Quranic Evidences\nThe Quran frequently describes believers as those whose hearts 'tremble' at the mention of Allah and whose faith increases when His verses are recited (**Surah Al-Anfal 8:2**). This indicates that Iman is both an emotional and intellectual engagement.\n\n## 3. The Hadith of Jibreel\nWhen Angel Jibreel came to the Prophet ﷺ and asked about Iman, the reply established the six articles: Belief in Allah, His Angels, His Books, His Messengers, the Last Day, and Qadr (Predestination).\n\n### Deep Dive Resource:\n[Read: Climbing the Spiritual Mountain (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/islam-iman-ihsan-climbing-the-spiritual-mountain)",
        "order": 3
      },
      {
        "id": "vid_1_1_1_onepath",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=F7v8uY_5844", // OnePath Network - Level of Faith
        "order": 4
      },
      {
        "id": "qz_1_1_1_1", "type": "quiz", "question": "What is the heart's role in the definition of Iman?", "options": ["Passive observer", "Tasdiq (Sincere Conviction)", "Just regular beating", "None"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_1_1_2", "type": "quiz", "question": "Which Surah mentions faith increasing through Quranic verses?", "options": ["Al-Baqarah", "Al-Anfal", "Al-Hashr", "Al-Mulk"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_1_1_3", "type": "quiz", "question": "How many components are required for the mainstream definition of Iman?", "options": ["One", "Two", "Three", "Six"], "correctIndex": 2, "order": 7 },
      { "id": "qz_1_1_1_4", "type": "quiz", "question": "Which Hadith establishes the six articles of faith?", "options": ["Hadith of Intentions", "Hadith of Jibreel", "Hadith of Ethics", "Hadith of Knowledge"], "correctIndex": 1, "order": 8 },
      { "id": "qz_1_1_1_5", "type": "quiz", "question": "In the tripartite definition, what does 'Amal' refer to?", "options": ["Speech", "Intention", "Actions", "Wealth"], "correctIndex": 2, "order": 9 }
    ]
  },
  {
    title: 'Linguistic vs Technical Meaning of Faith',
    blocks: [
      {
        "id": "img_1_1_2_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=2070&auto=format&fit=crop",
        "order": 0
      },
      {
        "id": "txt_1_1_2_a",
        "type": "text",
        "content": "# Linguistic and Technical Nuances\n\nTo truly understand Iman, we must understand the language of the Revelation. Arabic is a language of deep roots, where every word carries a cluster of meanings.\n\n## 1. Linguistic Meaning (Lughatan)\nThe root **A-M-N** refers to safety and security. To 'Amin' someone is to grant them safety from betrayal or falsehood. Thus, Iman is fundamentally about finding **spiritual sanctuary**.\n\n## 2. Technical Meaning (Shar'an)\nTechnically, Iman is the specific affirmation of everything the Prophet ﷺ brought. It is the bridge between human finitude and Divine Infinite.",
        "order": 1
      },
      {
        "id": "vid_1_1_2_onepath",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=vV77m6282YI", // OnePath - What is Faith?
        "order": 2
      },
      {
        "id": "txt_1_1_2_b",
        "type": "text",
        "content": "## 3. The Distinction from 'Ma'rifah' (Knowledge)\nScholars distinguish between mere knowledge and Iman. Iblis (Satan) had knowledge of Allah, but he lacked **Submission (Inqiyad)**. True Iman requires the heart to acknowledge and the will to submit.\n\n### Deep Dive Resource:\n[Read: Pursuing Yaqeen: Building Unshakeable Faith (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/pursuing-yaqeen-how-to-build-unshakeable-faith-and-trust-in-god)",
        "order": 3
      },
      { "id": "qz_1_1_2_1", "type": "quiz", "question": "What is the linguistic root of Iman (A-M-N) related to?", "options": ["Wealth", "Safety and Security", "Power", "Movement"], "correctIndex": 1, "order": 4 },
      { "id": "qz_1_1_2_2", "type": "quiz", "question": "What did Iblis lack that prevented him from having Iman?", "options": ["Knowledge", "Submission (Inqiyad)", "Strength", "Time"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_1_2_3", "type": "quiz", "question": "Technical meaning of a word in Islam is called?", "options": ["Lughawi", "Istilahi", "Adabi", "Amali"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_1_2_4", "type": "quiz", "question": "True or False: Mere knowledge is the same as Iman.", "options": ["True", "False"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_1_2_5", "type": "quiz", "question": "The believer is an 'Amin' because they find safety in:", "options": ["Their house", "Rememberance of Allah", "Money", "Hiding"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Relationship Between Belief and Action',
    blocks: [
      {
        "id": "vid_1_1_3_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q", // One Islam productions - Faith and Deeds
        "order": 0
      },
      {
        "id": "txt_1_1_3_a",
        "type": "text",
        "content": "# The Synergy of Faith and Deeds\n\nIn Islam, belief and action are inseparable. They are often compared to the relationship between a tree and its fruits. \n\n## 1. Organic Connection\nA tree with no fruit is a sign of sickness, while fruit cannot exist without the tree. In the Quran, the phrase *'alladhina amanu wa 'amilu as-salihat'* (those who believe and do good deeds) appears over 50 times.",
        "order": 1
      },
      {
        "id": "img_1_1_3_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_1_3_b",
        "type": "text",
        "content": "## 2. Sincerity: The Soul of Action\nActions are empty shells without sincerity (*Ikhlas*). If one prays only for public praise, the action is technically present but spiritually void. Sincerity is the fuel that allows actions to increase Iman.\n\n### Deep Dive Resource:\n[Read: The Nature of Iman: Faith as a Spectrum (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/the-nature-of-iman-faith-as-a-spectrum)",
        "order": 3
      },
      { "id": "qz_1_1_3_1", "type": "quiz", "question": "How many times does 'believe and do good deeds' appear in the Quran roughly?", "options": ["None", "Over 50", "Over 500", "Twice"], "correctIndex": 1, "order": 4 },
      { "id": "qz_1_1_3_2", "type": "quiz", "question": "What is the metaphor for action in this lesson?", "options": ["The Seed", "The Roots", "The Fruit", "The Sky"], "correctIndex": 2, "order": 5 },
      { "id": "qz_1_1_3_3", "type": "quiz", "question": "What is 'Ikhlas'?", "options": ["Patience", "Sincerity", "History", "Wisdom"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_1_3_4", "type": "quiz", "question": "Can true faith exist without any outward expression long-term?", "options": ["Yes", "No, it demands expression", "Only in space", "Maybe"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_1_3_5", "type": "quiz", "question": "Which of these is a spiritual action of the heart?", "options": ["Zakat", "Tawakkul (Reliance on Allah)", "Hajj", "Wudu"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Increase and Decrease of Iman',
    blocks: [
      {
        "id": "vid_1_1_4_onepath",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", // OnePath Network - Do you feel low in Imaan?
        "order": 0
      },
      {
        "id": "txt_1_1_4_a",
        "type": "text",
        "content": "# The Dynamic Tide of Faith\n\nFaith is not a static property; it is a dynamic state that fluctuates like a tide. Understanding this prevents despair during spiritual 'lows' and encourages proactive growth during 'highs'.\n\n## 1. Scriptural Proof for Fluctuation\nAllah states: *'The believers are only those who... when His verses are recited to them, it increases them in faith'* (**8:2**). The Sahaba (companions) recognized this by gathering specifically to 'believe for an hour' by remembering Allah.",
        "order": 1
      },
      {
        "id": "img_1_1_4_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_1_4_b",
        "type": "text",
        "content": "## 2. Factors of Increase and Decrease\n- **Increase**: Knowledge, Dhikr, Obedience, and Good Environment.\n- **Decrease**: Ignorance, Sin, Negligence (*Ghaflah*), and Bad Company.\n\n### Deep Dive Resource:\n[Read: The Faith Revival (Yaqeen Institute)](https://yaqeeninstitute.org/series/the-faith-revival)",
        "order": 3
      },
      { "id": "qz_1_1_4_1", "type": "quiz", "question": "Does Iman increase with obedience?", "options": ["Yes", "No", "Only for scholars", "In winter only"], "correctIndex": 0, "order": 4 },
      { "id": "qz_1_1_4_2", "type": "quiz", "question": "What is 'Ghaflah'?", "options": ["Wisdom", "Negligence", "Courage", "Sincerity"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_1_4_3", "type": "quiz", "question": "How did the Sahaba describe gathering for remembrance?", "options": ["To eat", "To believe for an hour", "To argue", "To sleep"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_1_4_4", "type": "quiz", "question": "What is compared to clothes that wear out?", "options": ["Money", "Faith", "Body", "Worldly status"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_1_4_5", "type": "quiz", "question": "Which of these decreases faith?",
        "options": ["Reading Quran", "Sins", "Charity", "Kindness"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Signs of Strong Faith',
    blocks: [
      {
        "id": "vid_1_1_5_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", // One Islam Productions - Prophetic Secret
        "order": 0
      },
      {
        "id": "txt_1_1_5_a",
        "type": "text",
        "content": "# Marks of the Mu'min\n\nStrong faith leaves visible marks on the character and internal state of a person. It is not just about quantity of worship, but the quality of presence.\n\n## 1. Tranquility in Hardship\nA sign of strong faith is *Sabr* (patience) and *Ridha* (contentment) when trials strike. The heart is anchored in the trust overlap with Allah.\n\n## 2. Speed in Response\nStrong faith creates an urgency to do good. When a command is known, the believer responds with 'Sami'na wa Ata'na' (We hear and we obey).",
        "order": 1
      },
      {
        "id": "img_1_1_5_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1542816487-ccd655b3eb27?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_1_5_b",
        "type": "text",
        "content": "## 3. Sweetness of Faith (Halawat al-Iman)\nThere is a literal psychological joy that felt when performing worship or prioritizing Allah over desires. This 'sweetness' is the goal of spiritual growth.\n\n### Deep Dive Resource:\n[Read: Pursuing Yaqeen (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/pursuing-yaqeen-how-to-build-unshakeable-faith-and-trust-in-god)",
        "order": 3
      },
      { "id": "qz_1_1_5_1", "type": "quiz", "question": "What is the term for 'sweetness of faith'?", "options": ["Halawat al-Iman", "Sujud", "Zakat", "Hajj"], "correctIndex": 0, "order": 4 },
      { "id": "qz_1_1_5_2", "type": "quiz", "question": "Which characteristic is a sign of strong faith during trials?", "options": ["Anger", "Patience (Sabr)", "Despair", "Blaming others"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_1_5_3", "type": "quiz", "question": "How does a strong believer respond to a command?", "options": ["We hear and we argue", "We hear and we obey", "We hear and we ignore", "None"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_1_5_4", "type": "quiz", "question": "Strong faith enables which social quality?", "options": ["Greed", "Altruism (Prefering others)", "Arrogance", "Rudeness"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_1_5_5", "type": "quiz", "question": "What is 'Ridha'?", "options": ["Anger", "Contentment", "Hunger", "Thirst"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Causes of Weak Faith',
    blocks: [
      {
        "id": "vid_1_1_6_onepath",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", // OnePath Network - Why don't you pray?
        "order": 0
      },
      {
        "id": "txt_1_1_6_a",
        "type": "text",
        "content": "# The Erosion of Conviction\n\nWeak faith (*da'f al-iman*) is a condition that every seeker may experience. Identifying its root causes is the first step toward spiritual rehabilitation.\n\n## 1. Preoccupation with the Dunya\nThe primary cause of weak faith is allowing the worldly life to obscure the Hereafter. When status, money, and entertainment take center stage, the heart hardens.\n\n## 2. Neglect of Sins\nPersistence in small sins without repentance adds layers of 'rust' to the heart, slowly dimming the light of Iman.",
        "order": 1
      },
      {
        "id": "img_1_1_6_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1541535650810-10d26f5ec278?q=80&w=2069&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_1_6_b",
        "type": "text",
        "content": "## 3. Lack of Sacred Knowledge\nIgnorance of Allah's attributes and the history of the Messengers makes the heart susceptible to doubts and whispers (*Waswas*). Knowledge is the shield of faith.\n\n### Deep Dive Resource:\n[Read: The Causes and Cures of Spiritual Stagnation (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/the-causes-and-cures-of-spiritual-stagnation)",
        "order": 3
      },
      { "id": "qz_1_1_6_1", "type": "quiz", "question": "What is the primary factor that hardens the heart?", "options": ["Water", "Preoccupation with the Dunya", "Sleep", "Movement"], "correctIndex": 1, "order": 4 },
      { "id": "qz_1_1_6_2", "type": "quiz", "question": "Small sins without repentance cause what to form on the heart?", "options": ["Gold", "Rust/Dark spots", "Armor", "Light"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_1_6_3", "type": "quiz", "question": "What are 'Waswas'?", "options": ["Whispers of Shaytan", "Wisdom", "Stars", "Clouds"], "correctIndex": 0, "order": 6 },
      { "id": "qz_1_1_6_4", "type": "quiz", "question": "Is laziness in worship a symptom of weak faith?", "options": ["Yes", "No", "Only for kids", "In summer only"], "correctIndex": 0, "order": 7 },
      { "id": "qz_1_1_6_5", "type": "quiz", "question": "What is the 'shield' of faith mentioned here?", "options": ["Sword", "Knowledge", "Armor", "Wall"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Weekly Knowledge Check',
    blocks: [
      {
        "id": "txt_1_1_7_a",
        "type": "text",
        "content": "# Module 1.1 Mastery Assessment\n\nYou have completed the first week of the Foundations of Islamic Faith. This assessment covers the core definitions, the relationship between words and deeds, and the dynamic nature of Imaan.\n\n## Key Concepts Reviewed:\n- Iman as a holistic state (Tongue, Heart, Limbs).\n- The root of Iman meaning security.\n- Fluctuation of faith based on deeds.\n- The distinction between mere knowledge and true conviction.",
        "order": 0
      },
      {
        "id": "img_1_1_7_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
        "order": 1
      },
      {
        "id": "txt_1_1_7_b",
        "type": "text",
        "content": "Complete this final check to proceed to Module 1.2: Islam, Iman, and Ihsan.",
        "order": 2
      },
      { "id": "qz_1_1_7_1", "type": "quiz", "question": "Final Match: Outward Practice is to Islam as Inward Conviction is to:", "options": ["Hajj", "Iman", "Sujud", "Zakat"], "correctIndex": 1, "order": 3 },
      { "id": "qz_1_1_7_2", "type": "quiz", "question": "What signifies the highest level of faith ( Excellence)?", "options": ["Islam", "Iman", "Ihsan", "Wudu"], "correctIndex": 2, "order": 4 },
      { "id": "qz_1_1_7_3", "type": "quiz", "question": "The Giver of Security is Al-Mu'min. From which root is it derived?", "options": ["K-F-R", "A-M-N", "S-L-M", "H-M-D"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_1_7_4", "type": "quiz", "question": "Which of these is NOT an article of faith from the Hadith of Jibreel?", "options": ["Angels", "Books", "Wealth", "Last Day"], "correctIndex": 2, "order": 6 },
      { "id": "qz_1_1_7_5", "type": "quiz", "question": "Faith in the heart without submission is the state of who?", "options": ["Abu Bakr", "Umar", "Iblis", "Bilal"], "correctIndex": 2, "order": 7 }
    ]
  }
];

async function seed() {
  console.log('--- Starting Final Comprehensive Module 1.1 Content Seed ---');
  
  const { data: course } = await supabase
    .from('jobs')
    .select('id')
    .eq('title', 'Foundations of Islamic Faith')
    .single();
    
  if (!course) {
    console.error('Course not found!');
    return;
  }
  
  const courseId = course.id;
  console.log(`Course Found: ${courseId}`);
  
  for (const item of COMPREHENSIVE_DATA) {
    process.stdout.write(`Updating "${item.title}"... `);
    const { error } = await supabase
      .from('course_lessons')
      .update({ content_blocks: item.blocks })
      .eq('course_id', courseId)
      .eq('title', item.title);
      
    if (error) {
      console.log('FAILED: ' + error.message);
    } else {
      console.log('SUCCESS');
    }
  }
  
  console.log('--- Comprehensive Module 1.1 Seed Completed ---');
}

seed();
