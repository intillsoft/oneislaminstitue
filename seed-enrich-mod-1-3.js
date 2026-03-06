const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_1_3_4_DATA = [
  // MODULE 1.3: The Science of Certainty
  {
    title: 'What is Certainty (Yaqeen)?',
    blocks: [
      { "id": "card_1_3_1", "type": "callout", "content": "Worship your Lord until there comes to you the Certainty.", "author": "Quran 15:99", "order": 0 },
      { "id": "obj_1_3_1", "type": "objectives", "items": ["The three levels of Yaqeen", "Certainty vs. Doubt", "The role of the senses and the heart", "Seeking light through clarity"], "order": 1 },
      { "id": "txt_intro_1_3_1", "type": "text", "content": "Welcome to the science of certainty. In a world full of noise, how do we anchor our hearts in truth? Today we explore the concept of Yaqeen — that unshakeable conviction that transforms a person's life from doubt to absolute clarity.", "order": 2 },
      { "id": "vid_1_3_1", "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", "order": 3 },
      { "id": "qz_131_1", "type": "quiz", "question": "What is the Arabic word for absolute certainty?", "options": ["Shakk", "Yaqeen", "Ghalabah", "Fisq"], "correctIndex": 1, "order": 4 },
      { "id": "qz_131_2", "type": "quiz", "question": "The verse 15:99 commands worship until what arrives?", "options": ["Death/Certainty", "Morning", "Rain", "Wealth"], "correctIndex": 0, "order": 5 },
      { "id": "qz_131_3", "type": "quiz", "question": "Can doubt and true Yaqeen coexist in the same moment for the same point?", "options": ["Yes", "No, they are opposites", "Sometimes", "Maybe"], "correctIndex": 1, "order": 6 },
      { "id": "qz_131_4", "type": "quiz", "question": "Certainty is a state of the:", "options": ["Hand", "Heart", "Foot", "Tongue"], "correctIndex": 1, "order": 7 },
      { "id": "qz_131_5", "type": "quiz", "question": "Does Yaqeen require intellectual evidence or spiritual experience?", "options": ["Only evidence", "Only experience", "Both", "Neither"], "correctIndex": 2, "order": 8 }
    ]
  },
  {
    title: 'The Concept of Fitrah',
    blocks: [
      { "id": "card_1_3_2", "type": "callout", "content": "Every child is born upon the Fitrah (natural inclination); then his parents make him into a Jew, a Christian, or a Magian.", "author": "Prophet Muhammad (ﷺ)", "order": 0 },
      { "id": "obj_1_3_2", "type": "objectives", "items": ["The primordial nature of the human soul", "The covenant of Alast", "Intuition vs. External conditioning", "Returning to the core"], "order": 1 },
      { "id": "txt_intro_1_3_2", "type": "text", "content": "Are we born as blank slates? Islam teaches no. We are born with a compass — a Fitrah. This lesson explores the spiritual DNA that predisposes every human to recognize the One Creator.", "order": 2 },
      { "id": "vid_1_3_2", "type": "video", "url": "https://www.youtube.com/watch?v=vV77m6282YI", "order": 3 },
      { "id": "qz_132_1", "type": "quiz", "question": "What is 'Fitrah'?", "options": ["History", "Natural disposition/inclination", "A type of food", "A city"], "correctIndex": 1, "order": 4 },
      { "id": "qz_132_2", "type": "quiz", "question": "According to the Hadith, what influences the child's later religious path?", "options": ["The stars", "The parents and environment", "Physical strength", "Luck"], "correctIndex": 1, "order": 5 },
      { "id": "qz_132_3", "type": "quiz", "question": "Is the Fitrah ever completely destroyed in a human?", "options": ["Yes, easily", "No, it can only be buried or obscured", "Only if they forget to eat", "Maybe"], "correctIndex": 1, "order": 6 },
      { "id": "qz_132_4", "type": "quiz", "question": "What is the 'Covenant of Alast'?", "options": ["A business deal", "The primordial recognition of Allah by all souls", "A type of prayer", "A historical war"], "correctIndex": 1, "order": 7 },
      { "id": "qz_132_5", "type": "quiz", "question": "Fitrah leads naturally toward:", "options": ["Multiple gods", "The Oneness of Allah (Tawheed)", "Atheism", "Confusion"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'The Cosmological Argument',
    blocks: [
      { "id": "card_1_3_3", "type": "callout", "content": "Were they created by nothing, or were they the creators of themselves?", "author": "Quran 52:35", "order": 0 },
      { "id": "obj_1_3_3", "type": "objectives", "items": ["Logic and Faith", "The argument from beginning", "Cause and Effect in creation", "Intellectual foundations of belief"], "order": 1 },
      { "id": "txt_intro_1_3_3", "type": "text", "content": "Islam does not ask for blind faith. It asks for reflection. Today we look at the intellectual pillars of certainty through the Cosmological Argument — the logical necessity of a First Cause for the universe.", "order": 2 },
      { "id": "vid_1_3_3", "type": "video", "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", "order": 3 },
      { "id": "qz_133_1", "type": "quiz", "question": "Quran 52:35 poses a logical challenge about what?", "options": ["Food", "Creation and Origins", "Travel", "Sleep"], "correctIndex": 1, "order": 4 },
      { "id": "qz_133_2", "type": "quiz", "question": "Can 'nothing' produce 'something' according to logic?", "options": ["Yes", "No", "Only in space", "Maybe"], "correctIndex": 1, "order": 5 },
      { "id": "qz_133_3", "type": "quiz", "question": "The First Cause must be ________ the universe itself.", "options": ["Smaller than", "Part of", "Independent and Outside of", "Inside a black hole"], "correctIndex": 2, "order": 6 },
      { "id": "qz_133_4", "type": "quiz", "question": "Is use of logic encouraged in the Quran?", "options": ["No, it's forbidden", "Yes, extensively", "Only for scholars", "In certain days only"], "correctIndex": 1, "order": 7 },
      { "id": "qz_133_5", "type": "quiz", "question": "What is the Arabic term for reflection/thinking?", "options": ["Tafakkur", "Ghaflah", "Nifaq", "Shirk"], "correctIndex": 0, "order": 8 }
    ]
  }
  // ... Simplified for this turn to show progress
];

async function seed() {
  console.log('--- Seeding Module 1.3 Content ---');
  const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
  if (!course) return console.error('Course not found');

  for (const item of MODULE_1_3_4_DATA) {
    process.stdout.write(`Updating "${item.title}"... `);
    const { error } = await supabase.from('course_lessons').update({ content_blocks: item.blocks }).eq('course_id', course.id).eq('title', item.title);
    if (error) console.log('FAILED: ' + error.message);
    else console.log('SUCCESS');
  }
}

seed();
