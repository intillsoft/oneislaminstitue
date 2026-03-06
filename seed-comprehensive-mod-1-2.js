const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const COMPREHENSIVE_DATA = [
  {
    title: 'The Hadith of Jibreel Explained',
    blocks: [
      {
        "id": "vid_1_2_1_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=F7v8uY_5844", // One Islam Productions - Hadith Jibreel
        "order": 0
      },
      {
        "id": "txt_1_2_1_a",
        "type": "text",
        "content": "# The Mother of the Sunnah: Hadith Jibreel\n\nThe Hadith of Jibreel is often described as the 'Mother of the Sunnah' because it contains the entire essential structure of the Islamic religion. It was a formal teaching session conducted by an Angel in the presence of the Sahaba.\n\n## 1. The Mysterious Traveler\nUmar ibn al-Khattab (RA) narrates that a man appeared with intensely white clothes and jet-black hair. He sat so close to the Prophet ﷺ that their knees touched. This posture indicated a formal 'seeking of knowledge'.\n\n## 2. The Four Questions\nJibreel (AS) asked about four fundamental topics:\n1. **Islam**: The outward practice.\n2. **Iman**: The inward conviction.\n3. **Ihsan**: Spiritual excellence.\n4. **The Hour**: The proximity of the Day of Judgment.",
        "order": 1
      },
      {
        "id": "img_1_2_1_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_2_1_b",
        "type": "text",
        "content": "## 3. The Nested Nature of Faith\nScholars explain that these levels are like concentric circles. Every Mu'min (believer) is a Muslim, but not every Muslim reaches the level of Iman. Furthermore, Ihsan is the pinnacle—worshipping Allah as if you see Him.\n\n### Deep Dive Resource:\n[Read: The Hadith of Gabriel (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/the-hadith-of-gabriel-islam-iman-ihsan)",
        "order": 3
      },
      {
        "id": "vid_1_2_1_yaqeen",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", // Yaqeen - Hadith Jibreel
        "order": 4
      },
      { "id": "qz_1_2_1_1", "type": "quiz", "question": "Who narrated the Hadith of Jibreel mentioned here?", "options": ["Abu Bakr", "Umar ibn al-Khattab", "Ali ibn Abi Talib", "Aisha"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_2_1_2", "type": "quiz", "question": "What does sitting close (knees touching) indicate in this context?", "options": ["Friendship", "Formal seeking of knowledge", "Fatigue", "Secret meeting"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_2_1_3", "type": "quiz", "question": "Which of these is NOT one of the four questions asked by Jibreel?", "options": ["Islam", "Iman", "Ihsan", "Zakat"], "correctIndex": 3, "order": 7 },
      { "id": "qz_1_2_1_4", "type": "quiz", "question": "What is the highest level mentioned in the Hadith?", "options": ["Islam", "Iman", "Ihsan", "The Hour"], "correctIndex": 2, "order": 8 },
      { "id": "qz_1_2_1_5", "type": "quiz", "question": "Why is it called the 'Mother of the Sunnah'?", "options": ["Narrated by a mother", "Contains the core structure of the religion", "Mentioned in the Quran", "First Hadith recorded"], "correctIndex": 1, "order": 9 }
    ]
  },
  {
    title: 'The Five Pillars of Islam',
    blocks: [
      {
        "id": "vid_1_2_2_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q", // One Islam - 5 Pillars
        "order": 0
      },
      {
        "id": "txt_1_2_2_a",
        "type": "text",
        "content": "# The Columns of Submission\n\nIf the religion is a building, the Five Pillars are the columns that sustain its physical presence in the world. They are the essential 'Minimum Viable Practice' for a Muslim.\n\n## 1. Shahada (The Testimony)\nThe foundation of everything. 'Lailaha illallah Muhammadur Rasulullah'. It is the key to the fortress.\n\n## 2. Salah (The Prayer)\nThe Five daily prayers represent the rhythm of the soul. No religion is valid without prayer.",
        "order": 1
      },
      {
        "id": "img_1_2_2_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_2_2_b",
        "type": "text",
        "content": "## 3. Zakat, Sawm, and Hajj\n- **Zakat**: Purifying wealth through charity (2.5%).\n- **Sawm**: Fasting in Ramadan to build Taqwa.\n- **Hajj**: The pilgrimage to the House of Allah.\n\n### Deep Dive Resource:\n[Read: The Five Pillars (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/the-five-pillars-of-islam)",
        "order": 3
      },
      {
        "id": "vid_1_2_2_onepath",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=x7W2Wp_F6q8", // OnePath - Pillars
        "order": 4
      },
      { "id": "qz_1_2_2_1", "type": "quiz", "question": "What is the 2.5% wealth purification called?", "options": ["Sadaqah", "Zakat", "Riba", "Fitrana"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_2_2_2", "type": "quiz", "question": "Which pillar involves fasting from dawn to sunset?", "options": ["Salah", "Shahada", "Sawm", "Hajj"], "correctIndex": 2, "order": 6 },
      { "id": "qz_1_2_2_4", "type": "quiz", "question": "The Shahada consists of how many parts of testimony?", "options": ["One", "Two (Allah and Messenger)", "Three", "Five"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_2_2_4", "type": "quiz", "question": "Salah is performed how many times daily as a pillar?", "options": ["Three", "Five", "Ten", "Optional"], "correctIndex": 1, "order": 8 },
      { "id": "qz_1_2_2_5", "type": "quiz", "question": "Hajj is mandatory for those who are:", "options": ["Rich", "Physically/Financially Able", "Living in Arabia", "Born Muslim"], "correctIndex": 1, "order": 9 }
    ]
  },
  {
    title: 'The Six Pillars of Iman',
    blocks: [
      {
        "id": "vid_1_2_3_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", // One Islam - 6 Pillars
        "order": 0
      },
      {
        "id": "txt_1_2_3_a",
        "type": "text",
        "content": "# The Internal Anchors of the Heart\n\nWhile Islam is outward, Iman is the inward reality. The Six Pillars of Iman are the required convictions that define the world-view of a believer.\n\n## 1. Belief in Allah\nTawhid (Oneness) in Lordship, Worship, and Names/Attributes.\n\n## 2. Belief in the Angels\nCelestial beings created from light, following Allah's commands without fail.",
        "order": 1
      },
      {
        "id": "img_1_2_3_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_2_3_b",
        "type": "text",
        "content": "## 3. Books, Messengers, Day of Judgment, and Qadr\nAccepting the Divine Revelations, all Prophets from Adam to Muhammad ﷺ, the certain reality of Resurrection, and the Decree of Allah (both the good and 'evil' outcomes).\n\n### Deep Dive Resource:\n[Read: The Six Articles of Faith (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/the-articles-of-faith-iman-explained)",
        "order": 3
      },
      {
        "id": "vid_1_2_3_yaqeen",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=Y7_7iY2I_mY", // Yaqeen - 6 Pillars
        "order": 4
      },
      { "id": "qz_1_2_3_1", "type": "quiz", "question": "Belief in Angels involves beings created from what?", "options": ["Clay", "Fire", "Light", "Water"], "correctIndex": 2, "order": 5 },
      { "id": "qz_1_2_3_2", "type": "quiz", "question": "Which pillar involves believing in predestination?", "options": ["Day of Judgment", "Qadr (Divine Decree)", "Messengers", "Books"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_2_3_3", "type": "quiz", "question": "Are we required to believe in all previous messengers or just Muhammad ﷺ?", "options": ["Only Muhammad ﷺ", "All messengers ever sent", "Only Arabian prophets", "None"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_2_3_4", "type": "quiz", "question": "The 'Injir' refers to the original book given to who?", "options": ["Musa (AS)", "Isa (AS)", "Ibrahim (AS)", "Dawud (AS)"], "correctIndex": 1, "order": 8 },
      { "id": "qz_1_2_3_5", "type": "quiz", "question": "Belief in the 'Last Day' includes:", "options": ["Death", "Resurrection", "Judgment", "All of the above"], "correctIndex": 3, "order": 9 }
    ]
  },
  {
    title: 'The Concept of Ihsan',
    blocks: [
      {
        "id": "vid_1_2_4_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", // One Islam - Ihsan
        "order": 0
      },
      {
        "id": "txt_1_2_4_a",
        "type": "text",
        "content": "# The Pinnacle of Presence: Ihsan\n\nIhsan is translated as 'excellence' or 'perfection'. It is the state where the believer is so spiritually attuned that their actions are performed with absolute presence.\n\n## 1. The Prophetic Definition\n'To worship Allah as if you see Him; for if you do not see Him, surely He sees you.'\n\n## 2. Mushahadah and Muraqabah\n- **Mushahadah**: The higher state of 'witnessing' the greatness of Allah in the heart.\n- **Muraqabah**: The state of 'mindfulness' that Allah is watching you at all times.",
        "order": 1
      },
      {
        "id": "img_1_2_4_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_2_4_b",
        "type": "text",
        "content": "## 3. Ihsan Toward the Creation\nIhsan is not just about prayer. It extends to 'Ihsan al-Khalq'—excellence in dealing with people, animals, and the environment. 'Allah has prescribed Ihsan in everything.'\n\n### Deep Dive Resource:\n[Read: The Concept of Ihsan (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/excellence-in-action-the-concept-of-ihsan)",
        "order": 3
      },
      {
        "id": "vid_1_2_4_onepath",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", // OnePath - Ihsan
        "order": 4
      },
      { "id": "qz_1_2_4_1", "type": "quiz", "question": "What is the primary definition of Ihsan?", "options": ["Praying more", "Worshipping Allah as if you see Him", "Giving charity", "Knowledge"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_2_4_2", "type": "quiz", "question": "What is 'Muraqabah'?", "options": ["Witnessing", "Mindfulness/Awareness that Allah sees you", "Sleep", "Movement"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_2_4_3", "type": "quiz", "question": "Does Ihsan apply to dealing with animals?", "options": ["Yes, everything", "No, only humans", "No, only prayer", "Only in Hajj"], "correctIndex": 0, "order": 7 },
      { "id": "qz_1_2_4_4", "type": "quiz", "question": "What is the linguistic meaning of Ihsan?", "options": ["To make something beautiful/excellent", "To hide", "To hurry", "To win"], "correctIndex": 0, "order": 8 },
      { "id": "qz_1_2_4_5", "type": "quiz", "question": "According to the Hadith, if you don't see Him, what is the certain reality?", "options": ["He is not there", "He surely sees you", "It doesn't matter", "None"], "correctIndex": 1, "order": 9 }
    ]
  },
  {
    title: 'Internal vs External Submission',
    blocks: [
      {
        "id": "vid_1_2_5_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=x7W2Wp_F6q8", // One Islam productions - Heart vs Body
        "order": 0
      },
      {
        "id": "txt_1_2_5_a",
        "type": "text",
        "content": "# The Harmony of Heart and Body\n\nIslam requires a seamless integration of the internal and the external. When these two are in conflict, spiritual ailments such as hypocrisy or self-delusion arise.\n\n## 1. External Practice (Body)\nThe rituals, the speech, and the social conduct. This provides the 'skeleton' of the religion.\n\n## 2. Internal Reality (Heart)\nThe intention, the sincerity, and the love. This provides the 'blood and spirit' of the religion.\n\n## 3. The Dangerous Imbalance\nIf the body performs while the heart is empty, it is hypocrisy. If the heart claims while the body neglects, it is delusion (*Ghurur*).",
        "order": 1
      },
      {
        "id": "img_1_2_5_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1541535650810-10d26f5ec278?q=80&w=2069&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_2_5_b",
        "type": "text",
        "content": "## 4. Polishing the Mirror\nThe heart is compared to a mirror. Actions are the polish. Consistent good deeds done with correct intention keep the heart reflecting the light of Iman.\n\n### Deep Dive Resource:\n[Read: Al-Ghazali on the Wonders of the Heart (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/al-ghazali-and-the-modern-search-for-the-heart)",
        "order": 3
      },
      { "id": "qz_1_2_5_1", "type": "quiz", "question": "What is external practice in Islam often compared to in this lesson?", "options": ["The Soul", "The Skeleton/Form", "The Color", "The Air"], "correctIndex": 1, "order": 4 },
      { "id": "qz_1_2_5_2", "type": "quiz", "question": "What is the spiritual state of claiming faith but neglecting body commands?", "options": ["Ihsan", "Delusion (Ghurur)", "Wisdom", "Perfection"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_2_5_3", "type": "quiz", "question": "Intention resides in which organ?", "options": ["Brain", "Lungs", "Heart", "Tongue"], "correctIndex": 2, "order": 6 },
      { "id": "qz_1_2_5_4", "type": "quiz", "question": "Actions without intention are compared to:", "options": ["Solid gold", "Empty shells", "Birds", "Mountains"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_2_5_5", "type": "quiz", "question": "What ensures the 'mirror' of the heart reflects light?", "options": ["Dust", "Consistent good deeds with intention", "Wealth", "Silence"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Hypocrisy: Major and Minor',
    blocks: [
      {
        "id": "vid_1_2_6_oneislam",
        "type": "video",
        "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", // One Islam - Hypocrisy
        "order": 0
      },
      {
        "id": "txt_1_2_6_a",
        "type": "text",
        "content": "# The Enemy Within: Hypocrisy (Nifaq)\n\Hypocrisy is described in the Quran as more dangerous than outward disbelief because it hides within the heart of the community.\n\n## 1. Major Hypocrisy (Nifaq al-Akbar)\nThis is a matter of belief. It is to show faith but conceal disbelief. This takes a person out of the fold of Islam entirely.\n\n## 2. Minor Hypocrisy (Nifaq al-Amali)\nThis is a matter of actions. It is to have faith but possess the traits of a hypocrite (lying, breaking promises).",
        "order": 1
      },
      {
        "id": "img_1_2_6_a",
        "type": "image",
        "url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070&auto=format&fit=crop",
        "order": 2
      },
      {
        "id": "txt_1_2_6_b",
        "type": "text",
        "content": "## 3. The Three Signs\nThe Prophet ﷺ said: 'The signs of a hypocrite are three: When he speaks, he lies; when he promises, he breaks it; and when he is entrusted, he betrays it.'\n\n### Deep Dive Resource:\n[Read: The Concept of Sincerity vs Hypocrisy (Yaqeen Institute)](https://yaqeeninstitute.org/read/paper/sincerity-vs-hypocrisy-in-the-quran)",
        "order": 3
      },
      { "id": "qz_1_2_6_1", "type": "quiz", "question": "Which type of hypocrisy removes one from the fold of Islam?", "options": ["Minor", "Major", "Both", "Neither"], "correctIndex": 1, "order": 4 },
      { "id": "qz_1_2_6_2", "type": "quiz", "question": "How many signs of a hypocrite are mentioned in the primary Hadith?", "options": ["Two", "Three", "Five", "Ten"], "correctIndex": 1, "order": 5 },
      { "id": "qz_1_2_6_3", "type": "quiz", "question": "Lying when speaking is a sign of:", "options": ["Intelligence", "Nifaq (Hypocrisy)", "Wisdom", "Bravery"], "correctIndex": 1, "order": 6 },
      { "id": "qz_1_2_6_4", "type": "quiz", "question": "Minor hypocrisy is primarily a disease of:", "options": ["Belief", "Action/Behavior", "Nutrition", "Sleep"], "correctIndex": 1, "order": 7 },
      { "id": "qz_1_2_6_5", "type": "quiz", "question": "What is the Arabic word for Hypocrisy?", "options": ["Kufr", "Nifaq", "Shirk", "Fisq"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Weekly Assessment',
    blocks: [
      {
        "id": "txt_1_2_7_a",
        "type": "text",
        "content": "# Week 1 Comprehensive Review\n\nYou have journeyed through the foundations of the Islamic Creed. This final assessment for Week 1 covers the Hadith of Jibreel, the core pillars, and the spiritual excellence of Ihsan.\n\n## Final Mastery Points:\n- Distinguishing Islam, Iman, and Ihsan.\n- Understanding the 5 outward pillars and 6 inward anchors.\n- Guarding against Nifaq (hypocrisy).\n- Striving for continuous spiritual presence.",
        "order": 0
      },
      { "id": "qz_1_2_7_1", "type": "quiz", "question": "Which level of religion is 'Worshipping as if you see Him'?", "options": ["Islam", "Iman", "Ihsan", "Taqwa"], "correctIndex": 2, "order": 1 },
      { "id": "qz_1_2_7_2", "type": "quiz", "question": "The Six Pillars of Iman are the anchors of the:", "options": ["Body", "Heart (Inward)", "Society", "Wealth"], "correctIndex": 1, "order": 2 },
      { "id": "qz_1_2_7_3", "type": "quiz", "question": "Zakat represents which percentage of surplus wealth?", "options": ["1%", "2.5%", "10%", "50%"], "correctIndex": 1, "order": 3 },
      { "id": "qz_1_2_7_4", "type": "quiz", "question": "The 'Mother of the Sunnah' refers to the Hadith of:", "options": ["Aisha", "Jibreel", "Abu Bakr", "Intentions"], "correctIndex": 1, "order": 4 },
      { "id": "qz_1_2_7_5", "type": "quiz", "question": "True or False: Iman is a static state that never changes.", "options": ["True", "False"], "correctIndex": 1, "order": 5 }
    ]
  }
];

async function seed() {
  console.log('--- Starting Final Comprehensive Module 1.2 Content Seed ---');
  
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
  
  console.log('--- Comprehensive Module 1.2 Seed Completed ---');
}

seed();
