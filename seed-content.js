const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_DATA = [
  // MODULE 1.1
  {
    title: 'Definition of Iman in Qur’an and Sunnah',
    blocks: [
      { "id": "vid_1", "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "order": 0 },
      { "id": "txt_1", "type": "text", "content": "# The Definition of Iman: A Spiritual and Intellectual Anchor\n\nIman, often translated as \"faith,\" is the bedrock upon which the entire life of a Muslim is built...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "Which Surah describes the physical and emotional impact of hearing Allah's name?", "options": ["Al-Baqarah", "Al-Anfal", "Al-Ikhlas", "Ash-Shura"], "correctIndex": 1, "order": 2 }
    ]
  },
  {
    title: 'Linguistic vs Technical Meaning of Faith',
    blocks: [
      { "id": "img_1_1_2", "type": "image", "url": "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=2070&auto=format&fit=crop", "order": 0 },
      { "id": "txt_1_1_2", "type": "text", "content": "# Linguistic vs Technical Meaning of Faith\n\nPrecision in language is essential for precision in belief...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "What is the primary linguistic meaning of the root a-m-n?", "options": ["Knowledge", "Safety/Security", "Power", "Movement"], "correctIndex": 1, "order": 2 }
    ]
  },
  {
    title: 'Relationship Between Belief and Action',
    blocks: [
      { "id": "img_1_1_3", "type": "image", "url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop", "order": 0 },
      { "id": "txt_1_1_3", "type": "text", "content": "# The Inseparable Bond: Relationship Between Belief and Action...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "What is the primary metaphor used to describe the relationship between Iman and Action?", "options": ["A river and its bank", "A tree and its fruits", "The sun and its heat", "A building and its foundation"], "correctIndex": 1, "order": 2 }
    ]
  },
  {
    title: 'Increase and Decrease of Iman',
    blocks: [
      { "id": "img_1_1_4", "type": "image", "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop", "order": 0 },
      { "id": "txt_1_1_4", "type": "text", "content": "# The Ebb and Flow: Increase and Decrease of Iman...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "Which Surah mentions that Allah increases believers in faith?", "options": ["Al-Fath", "Al-Kafirun", "Al-Lahab", "An-Nas"], "correctIndex": 0, "order": 2 }
    ]
  },
  {
    title: 'Signs of Strong Faith',
    blocks: [
      { "id": "img_1_1_5", "type": "image", "url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070&auto=format&fit=crop", "order": 0 },
      { "id": "txt_1_1_5", "type": "text", "content": "# The Radiance of Certainty: Signs of Strong Faith...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "What is the term for the spiritual joy a believer feels in worship?", "options": ["Halawat al-Iman", "Dunya", "Istighfar", "Sujud"], "correctIndex": 0, "order": 2 }
    ]
  },
  {
    title: 'Causes of Weak Faith',
    blocks: [
      { "id": "img_1_1_6", "type": "image", "url": "https://images.unsplash.com/photo-1541535650810-10d26f5ec278?q=80&w=2069&auto=format&fit=crop", "order": 0 },
      { "id": "txt_1_1_6", "type": "text", "content": "# The Darkness of Neglect: Causes of Weak Faith...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "What does the Quran call the life of this world in Surah Al-Hadid?", "options": ["A permanent home", "The enjoyment of delusion", "A place of no hope", "A dark cave"], "correctIndex": 1, "order": 2 }
    ]
  },
  {
    title: 'Weekly Knowledge Check',
    blocks: [
      { "id": "img_1_1_7", "type": "image", "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", "order": 0 },
      { "id": "txt_1_1_7", "type": "text", "content": "# Module 1.1 Summary & Assessment...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "Which of these is NOT one of the three inseparable components of Iman?", "options": ["Statement of the Tongue", "Wealth in the Bank", "Affirmation of the Heart", "Action of the Limbs"], "correctIndex": 1, "order": 2 }
    ]
  },
  // MODULE 1.2
  {
    title: 'The Hadith of Jibreel Explained',
    blocks: [
      { "id": "vid_1_2_1", "type": "video", "url": "https://www.youtube.com/watch?v=F7v8uY_5844", "order": 0 },
      { "id": "txt_1_2_1", "type": "text", "content": "# The Framework of Faith: The Hadith of Jibreel Explained...", "order": 1 },
      { "id": "qz_1", "type": "quiz", "question": "Who was the visitor in the famous Hadith mentioned in the lesson?", "options": ["Abu Bakr (RA)", "The Angel Jibreel", "A merchant from Yemen", "Khalid ibn Walid (RA)"], "correctIndex": 1, "order": 2 }
    ]
  },
  {
    title: 'The Five Pillars of Islam',
    blocks: [
      { "id": "txt_1_2_2", "type": "text", "content": "# The Foundations: The Five Pillars of Islam...", "order": 0 },
      { "id": "qz_1", "type": "quiz", "question": "Which pillar acts as the 'key' to Paradise and the foundation of all other actions?", "options": ["Salah", "Shahada", "Zakat", "Hajj"], "correctIndex": 1, "order": 1 }
    ]
  },
  {
    title: 'The Six Pillars of Iman',
    blocks: [
      { "id": "txt_1_2_3", "type": "text", "content": "# The Internal Pillars: The Six Pillars of Iman...", "order": 0 },
      { "id": "qz_1", "type": "quiz", "question": "Which pillar of Iman involves believing in Jibreel and Mikail?", "options": ["Belief in Messengers", "Belief in Angels", "Belief in Books", "Belief in Allah"], "correctIndex": 1, "order": 1 }
    ]
  },
  {
    title: 'The Concept of Ihsan',
    blocks: [
      { "id": "txt_1_2_4", "type": "text", "content": "# Spiritual Excellence: The Concept of Ihsan...", "order": 0 },
      { "id": "qz_1", "type": "quiz", "question": "What is the definition of Ihsan provided by the Prophet ﷺ?", "options": ["To pray 5 times a day", "To worship Allah as if you see Him", "To give all your money to charity", "To write books about Islam"], "correctIndex": 1, "order": 1 }
    ]
  },
  {
    title: 'Internal vs External Submission',
    blocks: [
      { "id": "txt_1_2_5", "type": "text", "content": "# The Balance: Internal vs External Submission...", "order": 0 },
      { "id": "qz_1", "type": "quiz", "question": "What is the state of someone who performs rituals but has no faith in the heart?", "options": ["Muhsin", "Mu'min", "Munafiq (Hypocrite)", "Kafir"], "correctIndex": 2, "order": 1 }
    ]
  },
  {
    title: 'Hypocrisy: Major and Minor',
    blocks: [
      { "id": "txt_1_2_6", "type": "text", "content": "# The Danger Within: Major and Minor Hypocrisy...", "order": 0 },
      { "id": "qz_1", "type": "quiz", "question": "Which type of hypocrisy takes a person out of the fold of Islam?", "options": ["Minor Hypocrisy", "Major Hypocrisy", "Both", "Neither"], "correctIndex": 1, "order": 1 }
    ]
  },
  {
    title: 'Weekly Assessment',
    blocks: [
      { "id": "qz_1", "type": "quiz", "question": "Match the term: Outward practices, Five Pillars.", "options": ["Iman", "Islam", "Ihsan", "Taqwa"], "correctIndex": 1, "order": 0 },
      { "id": "qz_2", "type": "quiz", "question": "Match the term: Inward convictions, Six Pillars.", "options": ["Islam", "Iman", "Ihsan", "Sabr"], "correctIndex": 1, "order": 1 }
    ]
  }
];

async function seed() {
  console.log('--- Starting Comprehensive Week 1 Content Seed ---');
  
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
  
  for (const item of SEED_DATA) {
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
  
  console.log('--- Comprehensive Seed Completed ---');
}

seed();
