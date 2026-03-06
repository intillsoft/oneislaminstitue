const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const FINAL_CONTENT_DATA = [
  // MODULE 1.1 Lessons
  {
    title: 'Definition of Iman in Qur’an and Sunnah',
    blocks: [
      { "id": "card_1", "type": "callout", "content": "Faith is a statement, a belief, and an action; it increases with obedience and decreases with disobedience.", "author": "Al-Hasan al-Basri", "order": 0 },
      { "id": "obj_1", "type": "objectives", "items": ["The three pillars of the linguistic definition", "Iman in the Quranic context", "The Hadith of Jibreel overview", "Action vs. Sentiment"], "order": 1 },
      { "id": "txt_intro_1", "type": "text", "content": "Welcome to the first lesson of your journey. Today we define the very foundation of our existence: **Iman**. Many believe it is just a feeling, but Islamic scholarship teaches us it is a profound tripartite unity of the tongue, heart, and limbs.", "order": 2 },
      { "id": "vid_1", "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "order": 3 },
      { "id": "txt_content_1", "type": "text", "content": "## 1. The Tripartite Definition\nMainstream scholars define Iman as:\n- **Speech of the tongue**: Testifying the Shahada.\n- **Belief in the heart**: Solid conviction without doubt.\n- **Action of the limbs**: Expressing faith through deeds.\n\n### Quranic Reference\n'The believers are only those who, when Allah is mentioned, their hearts become fearful, and when His verses are recited to them, it increases them in faith...' (**Surah Al-Anfal 8:2**).", "order": 4 },
      { "id": "img_1", "type": "image", "url": "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_1_1", "type": "quiz", "question": "What are the three components of Iman according to scholars?", "options": ["Speech, Heart, and Limbs", "Fasting, Haji, and Prayer", "Kindness, Wisdom, and Strength", "Reading, Writing, and Speaking"], "correctIndex": 0, "order": 6 },
      { "id": "qz_1_2", "type": "quiz", "question": "Which Surah describes faith increasing when verses are recited?", "options": ["Al-Baqarah", "Al-Anfal", "Al-Hashr", "Al-Mulk"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_3", "type": "quiz", "question": "Who authored the quote about faith increasing with obedience?", "options": ["Abu Bakr", "Al-Hasan al-Basri", "Ibn Taymiyyah", "Imam Malik"], "correctIndex": 1, "order": 8 },
      { "id": "qz_1_4", "type": "quiz", "question": "Is Iman merely a passive sentiment?", "options": ["Yes", "No, it requires action", "Only for children", "Maybe"], "correctIndex": 1, "order": 9 },
      { "id": "qz_1_5", "type": "quiz", "question": "What is the heart's role in the definition?", "options": ["Pumping blood", "Sincere conviction (Tasdiq)", "Storage", "Silence"], "correctIndex": 1, "order": 10 }
    ]
  },
  {
    title: 'Linguistic vs Technical Meaning of Faith',
    blocks: [
      { "id": "card_2", "type": "callout", "content": "The linguistic meaning of Iman is to give safety, for the true believer finds absolute security in the remembrance of God.", "author": "Ibn al-Qayyim", "order": 0 },
      { "id": "obj_2", "type": "objectives", "items": ["The Arabic root A-M-N", "The technical definition of Shar'iah", "Knowledge vs. Conviction", "The role of submission (Inqiyad)"], "order": 1 },
      { "id": "txt_intro_2", "type": "text", "content": "In this session, we dive into the semantics of faith. In Arabic, words are not merely labels; they are roots that connect meanings across the human experience. We will explore how 'Safety' (Amn) is the core of 'Faith' (Iman).", "order": 2 },
      { "id": "vid_2", "type": "video", "url": "https://www.youtube.com/watch?v=vV77m6282YI", "order": 3 },
      { "id": "txt_content_2", "type": "text", "content": "## 1. The Root: A-M-N\nThe word Iman comes from the root *a-m-n*, which means safety, trust, and security. A *Mu'min* is one who provides safety and who has been granted safety by Allah.\n\n## 2. Technical Definition (Shar'an)\nTechnically, Iman is the affirmation of truth brought by Muhammad ﷺ. It moves from general 'trust' to specific 'conviction' in the Divine Revelation.", "order": 4 },
      { "id": "img_2", "type": "image", "url": "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_2_1", "type": "quiz", "question": "What is the linguistic root of Iman?", "options": ["S-L-M", "A-M-N", "K-F-R", "H-M-D"], "correctIndex": 1, "order": 6 },
      { "id": "qz_2_2", "type": "quiz", "question": "What does a-m-n mean in Arabic?", "options": ["Power", "Knowledge", "Safety and Security", "Wealth"], "correctIndex": 2, "order": 7 },
      { "id": "qz_2_3", "type": "quiz", "question": "Does mere knowledge constitute Iman?", "options": ["Yes", "No, it needs acceptance and submission", "Sometimes", "Only for scholars"], "correctIndex": 1, "order": 8 },
      { "id": "qz_2_4", "type": "quiz", "question": "What is the technical name for the linguistic meaning?", "options": ["Istilah", "Lughah", "Adab", "Fiqh"], "correctIndex": 1, "order": 9 },
      { "id": "qz_2_5", "type": "quiz", "question": "Who is the source of ultimate safety for the Mu'min?", "options": ["Themselves", "Their community", "Allah", "The government"], "correctIndex": 2, "order": 10 }
    ]
  },
  {
    title: 'Relationship Between Belief and Action',
    blocks: [
      { "id": "card_3", "type": "callout", "content": "Verily, Allah does not look at your appearance or wealth, but rather He looks at your hearts and actions.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_3", "type": "objectives", "items": ["The organic link between heart and limbs", "Faith as the root, deeds as the fruit", "The impact of sincerity (Ikhlas)", "Quranic coupling of belief and action"], "order": 1 },
      { "id": "txt_intro_3", "type": "text", "content": "How do our internal feelings manifest in our external world? This lesson explores the synergy between what we believe in the depths of our hearts and what we do with our hands and feet. In Islam, there is no such thing as 'faith alone' without expression.", "order": 2 },
      { "id": "vid_3", "type": "video", "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q", "order": 3 },
      { "id": "txt_content_3", "type": "text", "content": "## 1. The Tree Metaphor\nScholars compare Iman to a tree:\n- **Roots**: Inward conviction (Heart).\n- **Trunk**: Outward practices (Islam).\n- **Fruit**: Moral character and voluntary deeds (Ihsan).\n\nA tree with no fruit is sick, and a tree with no roots is dead.", "order": 4 },
      { "id": "img_3", "type": "image", "url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop", "order": 5 },
      { "id": "qz_3_1", "type": "quiz", "question": "What is compared to the 'fruit' in the tree metaphor?", "options": ["Belief", "Wealth", "Actions and Character", "History"], "correctIndex": 2, "order": 6 },
      { "id": "qz_3_2", "type": "quiz", "question": "According to the Hadith, where does Allah look?", "options": ["Appearance", "Wealth", "Hearts and Actions", "Clothes"], "correctIndex": 2, "order": 7 },
      { "id": "qz_3_3", "type": "quiz", "question": "What is 'Ikhlas'?", "options": ["Patience", "Sincerity", "Knowledge", "Strength"], "correctIndex": 1, "order": 8 },
      { "id": "qz_3_4", "type": "quiz", "question": "Can true faith exist without any outward expression long-term?", "options": ["Yes", "No", "Only in special cases", "Maybe"], "correctIndex": 1, "order": 9 },
      { "id": "qz_3_5", "type": "quiz", "question": "What is the Arabic word for actions?", "options": ["Qawl", "Amal", "Tasdiq", "Dhikr"], "correctIndex": 1, "order": 10 }
    ]
  },
  {
    title: 'Increase and Decrease of Iman',
    blocks: [
      { "id": "card_4", "type": "callout", "content": "Iman wears out in the heart just as clothes wear out — so renew your Iman by remembering Allah often.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_4", "type": "objectives", "items": ["The dynamic nature of faith", "Factors that boost Iman", "Causes of spiritual decline", "The practice of renewal"], "order": 1 },
      { "id": "txt_intro_4", "type": "text", "content": "Faith is not a destination; it is a journey with high tides and low ebbs. Today we learn how to navigate these spiritual cycles, recognizing that a 'low' is an opportunity for renewal and a 'high' is a gift for persistence.", "order": 2 },
      { "id": "vid_4", "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", "order": 3 },
      { "id": "txt_content_4", "type": "text", "content": "## 1. Factors of Increase\n- **Knowledge**: Studying the names and attributes of Allah.\n- **Obedience**: Performing consistent good deeds.\n- **Environment**: Surrounding yourself with righteous company.\n\n## 2. Factors of Decrease\n- **Negligence (Ghaflah)**: Forgetting the Hereafter.\n- **Disobedience**: Persistent sins without repentance.\n- **Ignorance**: Lacking the shield of sacred knowledge.", "order": 4 },
      { "id": "img_4", "type": "image", "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_4_1", "type": "quiz", "question": "Does Iman increase with obedience?", "options": ["No, it's fixed", "Yes, always", "Only for scholars", "In Ramadan only"], "correctIndex": 1, "order": 6 },
      { "id": "qz_4_2", "type": "quiz", "question": "What is compared to clothes that wear out?", "options": ["Body", "Wealth", "Faith (Iman)", "Knowledge"], "correctIndex": 2, "order": 7 },
      { "id": "qz_4_3", "type": "quiz", "question": "What is 'Ghaflah'?", "options": ["Wisdom", "Negligence/Heedlessness", "Courage", "Sincerity"], "correctIndex": 1, "order": 8 },
      { "id": "qz_4_4", "type": "quiz", "question": "How can one renew their faith?", "options": ["Buy new clothes", "Remember Allah often", "Sleep more", "Exercise"], "correctIndex": 1, "order": 9 },
      { "id": "qz_4_5", "type": "quiz", "question": "Is surrounding oneself with good company important for Iman?", "options": ["Yes, it's a major factor", "No, it doesn't matter", "Only at the Mosque", "Occasionally"], "correctIndex": 0, "order": 10 }
    ]
  },
  {
    title: 'Signs of Strong Faith',
    blocks: [
      { "id": "card_5", "type": "callout", "content": "None of you has faith until he loves for his brother what he loves for himself.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_5", "type": "objectives", "items": ["Tranquility in the face of trials", "Altruism and love for others", "Sweetness of faith (Halawah)", "Consistency in worship"], "order": 1 },
      { "id": "txt_intro_5", "type": "text", "content": "What does a heart full of light look like? In this session, we identify the internal and external markers of robust conviction. We will explore the 'Sweetness of Faith' — a psychological and spiritual state that makes worship a joy rather than a chore.", "order": 2 },
      { "id": "vid_5", "type": "video", "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", "order": 3 },
      { "id": "txt_content_5", "type": "text", "content": "## 1. The Sweetness of Faith (Halawat al-Iman)\nThe Prophet ﷺ spoke of three things that bring this sweetness:\n1. Loving Allah and His Messenger above all else.\n2. Loving a person only for the sake of Allah.\n3. Hating to return to disbelief as much as one hates fire.\n\n## 2. Radiating Light\nA strong Mu'min is like a candle; they provide light to those around them through character and kindness.", "order": 4 },
      { "id": "img_5", "type": "image", "url": "https://images.unsplash.com/photo-1542816487-ccd655b3eb27?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_5_1", "type": "quiz", "question": "What is 'Halawat al-Iman'?", "options": ["Sweet food", "Sweetness of Faith", "Loud prayer", "A type of perfume"], "correctIndex": 1, "order": 6 },
      { "id": "qz_5_2", "type": "quiz", "question": "Should a believer love others for whose sake?", "options": ["Their own", "Society's", "Allah's", "The world's"], "correctIndex": 2, "order": 7 },
      { "id": "qz_5_3", "type": "quiz", "question": "Which quality is a sign of strong faith in difficulty?", "options": ["Anger", "Despair", "Patience and Contentment", "Running away"], "correctIndex": 2, "order": 8 },
      { "id": "qz_5_4", "type": "quiz", "question": "Is altruism (loving for your brother...) a part of Iman?", "options": ["Yes, a fundamental part", "No, it's extra", "Only in Ramadan", "Maybe"], "correctIndex": 0, "order": 9 },
      { "id": "qz_5_5", "type": "quiz", "question": "A strong believer is compared to what object that provides light?", "options": ["Sun", "Moon", "Candle/Lamp", "Torch"], "correctIndex": 2, "order": 10 }
    ]
  },
  {
    title: 'Causes of Weak Faith',
    blocks: [
      { "id": "card_6", "type": "callout", "content": "Truly, in the remembrance of Allah do hearts find peace. When the heart is empty of Dhikr, it becomes vulnerable to the darkness of doubt.", "author": "Quran 13:28", "order": 0 },
      { "id": "obj_6", "type": "objectives", "items": ["Symptoms of a 'rusty' heart", "The distraction of worldly life (Dunya)", "Neglect of the five daily prayers", "Whispers of the soul and Shaytan"], "order": 1 },
      { "id": "txt_intro_6", "type": "text", "content": "Why do we feel lazy to pray? Why does the Quran feel heavy? We must diagnose the heart to find the cure. Today we look at the 'viruses' that attack our Iman and learn how to build an spiritual immune system.", "order": 2 },
      { "id": "vid_6", "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "order": 3 },
      { "id": "txt_content_6", "type": "text", "content": "## 1. Worldly Distractions (Dunya)\nWhen the heart is overly attached to status, wealth, or entertainment, it becomes 'heavy' and distracted from its true purpose.\n\n## 2. Neglecting Sins\nSmall sins without repentance are like drops of black ink on a white cloth. Eventually, the cloth becomes black. Repentance (Tawbah) is the bleach that cleanses the heart.", "order": 4 },
      { "id": "img_6", "type": "image", "url": "https://images.unsplash.com/photo-1541535650810-10d26f5ec278?q=80&w=2069&auto=format&fit=crop", "order": 5 },
      { "id": "qz_6_1", "type": "quiz", "question": "What is the primary factor that makes worship feel heavy?", "options": ["Physical fatigue", "Heedlessness (Ghaflah)", "Lack of money", "Cold weather"], "correctIndex": 1, "order": 6 },
      { "id": "qz_6_2", "type": "quiz", "question": "What removes 'rust' and 'ink' from the heart?", "options": ["Soap", "Sincere Repentance (Tawbah)", "Silence", "Sleep"], "correctIndex": 1, "order": 7 },
      { "id": "qz_6_3", "type": "quiz", "question": "Where do hearts find peace according to the Quran?", "options": ["At the beach", "In the remembrance of Allah", "In spending money", "In being famous"], "correctIndex": 1, "order": 8 },
      { "id": "qz_6_4", "type": "quiz", "question": "Is persistent minor sin dangerous for Iman?", "options": ["No, they are small", "Yes, they accumulate", "Only if people see you", "Sometimes"], "correctIndex": 1, "order": 9 },
      { "id": "qz_6_5", "type": "quiz", "question": "What is 'Waswas'?", "options": ["Whispers of wisdom", "Whispers of distraction/Shaytan", "Stars", "Birds"], "correctIndex": 1, "order": 10 }
    ]
  },
  {
    title: 'Weekly Knowledge Check',
    blocks: [
      { "id": "card_7", "type": "callout", "content": "Success is for the believers who are humble in their prayer. Knowledge is the first step toward that success.", "author": "Quran 23:1", "order": 0 },
      { "id": "obj_7", "type": "objectives", "items": ["Review of Definition", "Review of Linguistic vs Technical", "Review of Fluctuation", "Preparation for Module 1.2"], "order": 1 },
      { "id": "txt_intro_7", "type": "text", "content": "Congratulations on completing the first module! This check is not just a test; it's a consolidation of your growth. Let's ensure these foundations are solid before we build the next level of the Hadith Jibreel.", "order": 2 },
      { "id": "img_7", "type": "image", "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", "order": 3 },
      { "id": "qz_7_1", "type": "quiz", "question": "The Giver of Security is Al-Mu'min. From which root is it derived?", "options": ["K-F-R", "A-M-N", "S-L-M", "H-M-D"], "correctIndex": 1, "order": 4 },
      { "id": "qz_7_2", "type": "quiz", "question": "What are the three components of Iman according to early scholars?", "options": ["tongue, heart, and limbs", "hand, foot, and eye", "wealth, status, and power", "only heart"], "correctIndex": 0, "order": 5 },
      { "id": "qz_7_3", "type": "quiz", "question": "Does Iman increase with obedience?", "options": ["Yes", "No", "Maybe", "Only for Prophets"], "correctIndex": 0, "order": 6 },
      { "id": "qz_7_4", "type": "quiz", "question": "What is 'Halawat al-Iman'?", "options": ["Arabic food", "Sweetness of Faith", "Prayer Rug", "Mosque name"], "correctIndex": 1, "order": 7 },
      { "id": "qz_7_5", "type": "quiz", "question": "Which word means Negligence or Heedlessness?", "options": ["Ghaflah", "Barakah", "Sunnah", "Zakat"], "correctIndex": 0, "order": 8 }
    ]
  },
  
  // MODULE 1.2 Lessons
  {
    title: 'The Hadith of Jibreel Explained',
    blocks: [
      { "id": "card_1_2_1", "type": "callout", "content": "Jibreel came into your presence to teach you your religion in its most comprehensive form.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_1_2_1", "type": "objectives", "items": ["The three levels of religion", "The appearance of Jibreel", "The importance of the 'Hour'", "The concept of Adab (Etiquette)"], "order": 1 },
      { "id": "txt_intro_1_2_1", "type": "text", "content": "The 'Mother of the Sunnah' — this is how scholars describe the Hadith of Jibreel. It is the most comprehensive map of the Islamic faith, covering everything from outward action to the deepest peaks of spiritual excellence.", "order": 2 },
      { "id": "vid_1_2_1", "type": "video", "url": "https://www.youtube.com/watch?v=F7v8uY_5844", "order": 3 },
      { "id": "txt_content_1_2_1", "type": "text", "content": "## 1. The Mysterious Traveler\nUmar (RA) narrates that a man appeared in the Mosque with intensely white clothes and jet-black hair. No one knew him, yet he showed no signs of travel. He sat at the Prophet's knees, demonstrating the posture of a humble student.\n\n## 2. The Golden Triad\nHe asked about:\n1. **Islam**: The five pillars of practice.\n2. **Iman**: The six pillars of belief.\n3. **Ihsan**: The state of spiritual excellence.", "order": 4 },
      { "id": "img_1_2_1", "type": "image", "url": "https://images.unsplash.com/photo-1542816487-ccd655b3eb27?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_121_1", "type": "quiz", "question": "Who narrated the Hadith of Jibreel mentioned here?", "options": ["Abu Bakr", "Umar ibn al-Khattab", "Aisha", "Ali"], "correctIndex": 1, "order": 6 },
      { "id": "qz_121_2", "type": "quiz", "question": "What does sitting close (knees touching) indicate?", "options": ["Friendship", "Formal seeking of knowledge", "Arguments", "Fatigue"], "correctIndex": 1, "order": 7 },
      { "id": "qz_121_3", "type": "quiz", "question": "Which of these is NOT one of the three levels asked by Jibreel?", "options": ["Islam", "Iman", "Hajj", "Ihsan"], "correctIndex": 2, "order": 8 },
      { "id": "qz_121_4", "type": "quiz", "question": "What was the fourth topic asked by Jibreel?", "options": ["History", "The Hour (Day of Judgment)", "Marriage", "Business"], "correctIndex": 1, "order": 9 },
      { "id": "qz_121_5", "type": "quiz", "question": "How were Jibreel's clothes described?", "options": ["Intensely white", "Dirty from travel", "Golden", "Red"], "correctIndex": 0, "order": 10 }
    ]
  },
  {
    title: 'The Five Pillars of Islam',
    blocks: [
      { "id": "card_1_2_2", "type": "callout", "content": "Islam is built on five pillars: Shahada, Salah, Zakat, Sawm, and Hajj to the House.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_1_2_2", "type": "objectives", "items": ["The minimum outward practice", "The meaning of Shahada", "The rhythm of Salah", "The purification of Zakat"], "order": 1 },
      { "id": "txt_intro_1_2_2", "type": "text", "content": "If the religion is a building, these five are the columns. Without them, the structure collapses. In this lesson, we look at the physical manifestations of submission that define the Muslim identity.", "order": 2 },
      { "id": "vid_1_2_2", "type": "video", "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q", "order": 3 },
      { "id": "txt_content_1_2_2", "type": "text", "content": "## 1. The Foundation: Shahada\n'La ilaha illallah, Muhammadur Rasulullah'. It is the key to paradise and the summary of the entire creed.\n\n## 2. The Rhythm: Salah\nThe five daily prayers provide a direct connection between the slave and the Master, occurring at critical points of the day to keep the heart centered.", "order": 4 },
      { "id": "img_1_2_2", "type": "image", "url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop", "order": 5 },
      { "id": "qz_122_1", "type": "quiz", "question": "How many pillars is Islam built upon?", "options": ["Three", "Five", "Six", "Seven"], "correctIndex": 1, "order": 6 },
      { "id": "qz_122_2", "type": "quiz", "question": "What is the 2.5% wealth purification called?", "options": ["Sadaqah", "Riba", "Zakat", "Hiba"], "correctIndex": 2, "order": 7 },
      { "id": "qz_122_3", "type": "quiz", "question": "Which pillar involves fasting in Ramadan?", "options": ["Hajj", "Sawm", "Shahada", "Salah"], "correctIndex": 1, "order": 8 },
      { "id": "qz_122_4", "type": "quiz", "question": "Salah is performed how many times daily as a pillar?", "options": ["Three", "Five", "Continuous", "Ten"], "correctIndex": 1, "order": 9 },
      { "id": "qz_122_5", "type": "quiz", "question": "Hajj is mandatory for who?", "options": ["Everyone", "Only for Arabs", "Those who are able (financially/physically)", "Only for the elderly"], "correctIndex": 2, "order": 10 }
    ]
  },
  {
    title: 'The Six Pillars of Iman',
    blocks: [
      { "id": "card_1_2_3", "type": "callout", "content": "Iman is to believe in Allah, His Angels, His Books, His Messengers, the Last Day, and the Divine Decree.", "author": "Hadith Jibreel", "order": 0 },
      { "id": "obj_1_2_3", "type": "objectives", "items": ["The inward anchors of faith", "Belief in the unseen (Angels)", "The legacy of the Prophets", "Trusting the Qadr (Decree)"], "order": 1 },
      { "id": "txt_intro_1_2_3", "type": "text", "content": "While Islam is what you see, Iman is what you *are*. These six pillars are the internal operating system of a believer. They provide answers to the most profound questions of life, death, and destiny.", "order": 2 },
      { "id": "vid_1_2_3", "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", "order": 3 },
      { "id": "txt_content_1_2_3", "type": "text", "content": "## 1. Angels and Books\nWe believe in beings of light who never disobey, and in the Divine messages like the Torah, Gospel, and the final Quran.\n\n## 2. Qadr (Divine Decree)\nBelieving that everything happens by Allah's knowledge and permission, providing the believer with ultimate resilience and peace.", "order": 4 },
      { "id": "img_1_2_3", "type": "image", "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_123_1", "type": "quiz", "question": "How many pillars of Iman are defined in the Hadith Jibreel?", "options": ["Five", "Six", "Seven", "Ten"], "correctIndex": 1, "order": 6 },
      { "id": "qz_123_2", "type": "quiz", "question": "Angels were created from what material?", "options": ["Clay", "Fire", "Light", "Water"], "correctIndex": 2, "order": 7 },
      { "id": "qz_123_3", "type": "quiz", "question": "Which pillar involves trusting Allah's plan and decree?", "options": ["Belief in Books", "Belief in Angels", "Belief in Qadr", "Belief in Messengers"], "correctIndex": 2, "order": 8 },
      { "id": "qz_123_4", "type": "quiz", "question": "Do we believe in all previous Prophets or just Muhammad ﷺ?", "options": ["Only Muhammad ﷺ", "Only Jewish Prophets", "All Prophets sent by Allah", "None"], "correctIndex": 2, "order": 9 },
      { "id": "qz_123_5", "type": "quiz", "question": "The 'Injir' refers to the original book given to who?", "options": ["Musa (AS)", "Isa (AS)", "Dawud (AS)", "Ibrahim (AS)"], "correctIndex": 1, "order": 10 }
    ]
  },
  {
    title: 'The Concept of Ihsan',
    blocks: [
      { "id": "card_1_2_4", "type": "callout", "content": "Worship Allah as if you see Him; for if you do not see Him, surely He sees you.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_1_2_4", "type": "objectives", "items": ["Excellence in worship", "Mindfulness (Muraqabah)", "Witnessing (Mushahadah)", "Ihsan in social conduct"], "order": 1 },
      { "id": "txt_intro_1_2_4", "type": "text", "content": "Ihsan is the peak of the mountain. It is where your faith becomes beautiful. It is not just about 'doing' right; it's about 'being' right in every moment, aware of the Divine gaze. Today we learn how to reach for this excellence.", "order": 2 },
      { "id": "vid_1_2_4", "type": "video", "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", "order": 3 },
      { "id": "txt_content_1_2_4", "type": "text", "content": "## 1. Muraqabah (Mindfulness)\nLiving with the constant awareness that Allah is watching you. This creates a transformation in one's private and public life.\n\n## 2. Mushahadah (Witnessing)\nThe higher state where the heart is so filled with the greatness of Allah that it feels as if it sees Him. This is the goal of the spiritual masters.", "order": 4 },
      { "id": "img_1_2_4", "type": "image", "url": "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_124_1", "type": "quiz", "question": "What is the primary definition of Ihsan?", "options": ["Excellence / To make beautiful", "Speed", "Wealth", "Hiding"], "correctIndex": 0, "order": 6 },
      { "id": "qz_124_2", "type": "quiz", "question": "How should a person under 'Ihsan' worship Allah?", "options": ["As if they see Him", "Quickly", "Once a week", "Loudly"], "correctIndex": 0, "order": 7 },
      { "id": "qz_124_3", "type": "quiz", "question": "What is 'Muraqabah'?", "options": ["Mindfulness that Allah sees you", "Sleep", "Movement", "Arguments"], "correctIndex": 0, "order": 8 },
      { "id": "qz_124_4", "type": "quiz", "question": "Does Ihsan apply to dealing with animals and people?", "options": ["No, only prayer", "Yes, in everything", "Only in Hajj", "Sometimes"], "correctIndex": 1, "order": 9 },
      { "id": "qz_124_5", "type": "quiz", "question": "Which of these is the highest level of religion?", "options": ["Islam", "Iman", "Ihsan", "Fasting"], "correctIndex": 2, "order": 10 }
    ]
  },
  {
    title: 'Internal vs External Submission',
    blocks: [
      { "id": "card_1_2_5", "type": "callout", "content": "Actions are but by intentions, and every person shall have but that which they intended.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_1_2_5", "type": "objectives", "items": ["The harmony of heart and body", "Signs of sincerity (Ikhlas)", "The dangers of self-delusion", "Aligning private and public self"], "order": 1 },
      { "id": "txt_intro_1_2_5", "type": "text", "content": "Is it enough to just pray? Or is it enough to just have a 'good heart'? Today we learn that in Islam, these two are inseparable components of a single reality. We will explore how to align your internal spirit with your external body.", "order": 2 },
      { "id": "vid_1_2_5", "type": "video", "url": "https://www.youtube.com/watch?v=x7W2Wp_F6q8", "order": 3 },
      { "id": "txt_content_1_2_5", "type": "text", "content": "## 1. The Harmony\nExternal actions provide the 'form', and internal intentions provide the 'spirit'. Without form, the spirit has no vehicle. Without spirit, the form is just a shell.\n\n## 2. The Mirror of the Heart\nOur actions are the polish for the mirror of our hearts. Sincere deeds clear the rust of sin and allow the light of Iman to shine through.", "order": 4 },
      { "id": "img_1_2_5", "type": "image", "url": "https://images.unsplash.com/photo-1541535650810-10d26f5ec278?q=80&w=2069&auto=format&fit=crop", "order": 5 },
      { "id": "qz_125_1", "type": "quiz", "question": "What provides the 'spirit' to our actions?", "options": ["Money", "Intention (Niyyah)", "Speed", "Fame"], "correctIndex": 1, "order": 6 },
      { "id": "qz_125_2", "type": "quiz", "question": "Actions without intentions are compared to what?", "options": ["Solid gold", "Empty shells", "Birds", "Mountains"], "correctIndex": 1, "order": 7 },
      { "id": "qz_125_3", "type": "quiz", "question": "Intention resides in which organ?", "options": ["Brain", "Heart", "Stomach", "Tongue"], "correctIndex": 1, "order": 8 },
      { "id": "qz_125_4", "type": "quiz", "question": "What is the key to aligning private and public self?", "options": ["Acting", "Sincerity (Ikhlas)", "Hiding", "Loud speech"], "correctIndex": 1, "order": 9 },
      { "id": "qz_125_5", "type": "quiz", "question": "Can the body perform while the heart is empty?", "options": ["Yes, but it's spiritual sickness", "No, it's impossible", "Only for Prophets", "None"], "correctIndex": 0, "order": 10 }
    ]
  },
  {
    title: 'Hypocrisy: Major and Minor',
    blocks: [
      { "id": "card_1_2_6", "type": "callout", "content": "The signs of a hypocrite are three: when he speaks, he lies; when he promises, he breaks it; and when he is entrusted, he betrays it.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_1_2_6", "type": "objectives", "items": ["Definition of Nifaq", "Major vs. Minor Hypocrisy", "The three primary signs", "Purification of the character"], "order": 1 },
      { "id": "txt_intro_1_2_6", "type": "text", "content": "Nifaq is the disease of the heart that we must all fear and guard against. It is the conflict between what we show and what we hide. Today we learn how to diagnostic our own characters for these traits and how to purify them.", "order": 2 },
      { "id": "vid_1_2_6", "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "order": 3 },
      { "id": "txt_content_1_2_6", "type": "text", "content": "## 1. Major Hypocrisy (Akbar)\nConcealing disbelief while showing Islam. This is a matter of creed and takes one out of the fold.\n\n## 2. Minor Hypocrisy (Amali)\nPossessing the traits of hypocrites despite having faith. This is a matter of behavior and is a dangerous gateway to spiritual decline.", "order": 4 },
      { "id": "img_1_2_6", "type": "image", "url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070&auto=format&fit=crop", "order": 5 },
      { "id": "qz_126_1", "type": "quiz", "question": "How many primary signs of a hypocrite are mentioned in the Hadith?", "options": ["Two", "Three", "Ten", "Seven"], "correctIndex": 1, "order": 6 },
      { "id": "qz_126_2", "type": "quiz", "question": "Lying when speaking is a sign of what?", "options": ["Wisdom", "Hypocrisy (Nifaq)", "Courage", "Intelligence"], "correctIndex": 1, "order": 7 },
      { "id": "qz_126_3", "type": "quiz", "question": "Which type of hypocrisy removes one from Islam entirely?", "options": ["Minor", "Behavioral", "Major (Creed)", "Financial"], "correctIndex": 2, "order": 8 },
      { "id": "qz_126_4", "type": "quiz", "question": "Betraying trust is a sign of hypocrites?", "options": ["Yes", "No", "Only for children", "Maybe"], "correctIndex": 0, "order": 9 },
      { "id": "qz_126_5", "type": "quiz", "question": "What is the Arabic word for Hypocrisy?", "options": ["Shirk", "Kufr", "Nifaq", "Ghaflah"], "correctIndex": 2, "order": 10 }
    ]
  },
  {
    title: 'Weekly Assessment',
    blocks: [
      { "id": "card_1_2_7", "type": "callout", "content": "O you who believe, believe! Truly verify your convictions and elevate your actions to the level of Ihsan.", "author": "Quran 4:136", "order": 0 },
      { "id": "obj_1_2_7", "type": "objectives", "items": ["Hadith Jibreel Review", "5 Pillars Review", "6 Pillars Review", "Final Check for Week 1"], "order": 1 },
      { "id": "txt_intro_1_2_7", "type": "text", "content": "You have reached the end of the Foundations of Islamic Faith - Week 1. This assessment covers the entire depth of what we've learned, from the definition of Iman to the pinnacle of Ihsan. Let's verify your mastery!", "order": 2 },
      { "id": "img_1_2_7", "type": "image", "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", "order": 3 },
      { "id": "qz_127_1", "type": "quiz", "question": "Which level is 'Worshipping as if you see Him'?", "options": ["Islam", "Iman", "Ihsan", "Fasting"], "correctIndex": 2, "order": 4 },
      { "id": "qz_127_2", "type": "quiz", "question": "The Six Pillars of Iman are the anchors of the what?", "options": ["Body", "Heart (Inward)", "Wealth", "Society"], "correctIndex": 1, "order": 5 },
      { "id": "qz_127_3", "type": "quiz", "question": "Zakat represents which percentage of surplus wealth?", "options": ["1%", "2.5%", "10%", "50%"], "correctIndex": 1, "order": 6 },
      { "id": "qz_127_4", "type": "quiz", "question": "The 'Mother of the Sunnah' refers to the Hadith of who?", "options": ["Aisha", "Jibreel (AS)", "Abu Bakr", "Umar"], "correctIndex": 1, "order": 7 },
      { "id": "qz_127_5", "type": "quiz", "question": "Actions without intention are like what?", "options": ["Solid gold", "Empty shells", "Birds", "Mountains"], "correctIndex": 1, "order": 8 }
    ]
  }
];

async function seed() {
  console.log('--- Starting Final ENRICHED Week 1 Content Seed ---');
  
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
  
  for (const item of FINAL_CONTENT_DATA) {
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
  
  console.log('--- Final ENRICHED Week 1 Seed Completed ---');
}

seed();
