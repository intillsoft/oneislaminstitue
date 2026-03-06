const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = [
  // RETRY: Module 1.3
  {
    title: 'The Cosmological Argument',
    blocks: [
      { "id": "card_1_3_3", "type": "callout", "content": "Were they created by nothing, or were they the creators of themselves?", "author": "Quran 52:35", "order": 0 },
      { "id": "obj_1_3_3", "type": "objectives", "items": ["Logic and Faith", "The argument from beginning", "Cause and Effect", "Intellectual Foundations"], "order": 1 },
      { "id": "txt_intro_1_3_3", "type": "text", "content": "Logic is a gift from Allah to recognize His signs. Today we explore the intellectual necessity of a Creator.", "order": 2 },
      { "id": "vid_1_3_3", "type": "video", "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q", "order": 3 },
      { "id": "qz_133_1", "type": "quiz", "question": "Can nothingness create existence?", "options": ["Yes", "No", "Maybe", "Only in theories"], "correctIndex": 1, "order": 4 },
      { "id": "qz_133_2", "type": "quiz", "question": "Quran 52:35 uses which method?", "options": ["Logical inquiry", "Hidden magic", "Poetry only", "None"], "correctIndex": 0, "order": 5 },
      { "id": "qz_133_3", "type": "quiz", "question": "A cause must be _______ than the effect.", "options": ["Greater/Independent", "Smaller", "Equal", "Same"], "correctIndex": 0, "order": 6 },
      { "id": "qz_133_4", "type": "quiz", "question": "Does the universe have a beginning?", "options": ["No", "Yes", "Depends on weather", "Unknown"], "correctIndex": 1, "order": 7 },
      { "id": "qz_133_5", "type": "quiz", "question": "Intellectual conviction is a part of:", "options": ["Islam", "Iman", "Ihsan", "All of above"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Why Humanity Needs Revelation',
    blocks: [
      { "id": "card_1_3_4", "type": "callout", "content": "He has sent down to you the Book in truth, confirming what was before it.", "author": "Quran 3:3", "order": 0 },
      { "id": "obj_1_3_4", "type": "objectives", "items": ["Limitations of the human mind", "The role of Prophethood", "Divine Guidance vs Man-made laws", "The preservation of truth"], "order": 1 },
      { "id": "txt_intro_1_3_4", "type": "text", "content": "While logic tells us *that* there is a God, only Revelation tells us *who* God is and *what* He wants. This lesson explores why human reason alone is insufficient for ultimate morality.", "order": 2 },
      { "id": "vid_1_3_4", "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "order": 3 },
      { "id": "qz_134_1", "type": "quiz", "question": "Can reason alone tell us how to worship Allah?", "options": ["Yes", "No, we need Revelation", "Maybe", "Only for scholars"], "correctIndex": 1, "order": 4 },
      { "id": "qz_134_2", "type": "quiz", "question": "Revelation is compared to what for a traveler?", "options": ["Food", "A Compass/Light", "Heavy luggage", "A Mirror"], "correctIndex": 1, "order": 5 },
      { "id": "qz_134_3", "type": "quiz", "question": "What does 'Hikmah' usually mean in this context?", "options": ["Speed", "Wisdom", "Wealth", "History"], "correctIndex": 1, "order": 6 },
      { "id": "qz_134_4", "type": "quiz", "question": "Is the Quran the final Revelation?", "options": ["Yes", "No", "One of many ongoing", "None"], "correctIndex": 0, "order": 7 },
      { "id": "qz_134_5", "type": "quiz", "question": "Prophets were sent to provide what?", "options": ["Tax advice", "Divine Guidance", "Military secrets", "Music"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'The Purpose of Life',
    blocks: [
      { "id": "card_1_3_5", "type": "callout", "content": "I did not create the Jinn and humans except to worship Me.", "author": "Quran 51:56", "order": 0 },
      { "id": "obj_1_3_5", "type": "objectives", "items": ["The definition of Ibadah", "Existential meaning in Islam", "Test and Trial (Bala')", "Success in both worlds"], "order": 1 },
      { "id": "txt_intro_1_3_5", "type": "text", "content": "Why are we here? Is life a random occurrence or a purposeful design? Today we define 'Ibadah' not just as ritual, but as a holistic life of devotion.", "order": 2 },
      { "id": "vid_1_3_5", "type": "video", "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", "order": 3 },
      { "id": "qz_135_1", "type": "quiz", "question": "What is the primary purpose of life according to 51:56?", "options": ["To collect wealth", "To worship Allah (Ibadah)", "To be famous", "To travel"], "correctIndex": 1, "order": 4 },
      { "id": "qz_135_2", "type": "quiz", "question": "Does Ibadah include being good to parents?", "options": ["Yes", "No, only prayer", "Only on Fridays", "Maybe"], "correctIndex": 0, "order": 5 },
      { "id": "qz_135_3", "type": "quiz", "question": "Life is described in the Quran as a place of:", "options": ["Rest", "Trials and Tests", "Arguments", "Sleep"], "correctIndex": 1, "order": 6 },
      { "id": "qz_135_4", "type": "quiz", "question": "True success (Falah) is found in:", "options": ["Money", "Submission to the Creator", "Winning games", "Politics"], "correctIndex": 1, "order": 7 },
      { "id": "qz_135_5", "type": "quiz", "question": "Is our presence here intentional?", "options": ["Yes, designed", "No, random", "Only for some", "None"], "correctIndex": 0, "order": 8 }
    ]
  },
  {
    title: 'Confronting Doubts (Shak)',
    blocks: [
      { "id": "card_1_3_6", "type": "callout", "content": "That is a sign of clear faith.", "author": "Prophet Muhammad (ﷺ) on the Sahaba's fear of doubts", "order": 0 },
      { "id": "obj_1_3_6", "type": "objectives", "items": ["Distinguishing whispers from doubt", "The intellectual response to skepticism", "Protecting the heart", "Seeking knowledge as a cure"], "order": 1 },
      { "id": "txt_intro_1_3_6", "type": "text", "content": "Doubts are not the end of faith; they are often the beginning of a deeper inquiry. Today we learn how to handle intrusive thoughts (Waswas) and build a resilient intellectual shield.", "order": 2 },
      { "id": "vid_1_3_6", "type": "video", "url": "https://www.youtube.com/watch?v=F7v8uY_5844", "order": 3 },
      { "id": "qz_136_1", "type": "quiz", "question": "Is feeling bad about a doubt a sign of faith?", "options": ["Yes, it shows the heart cares", "No, it shows disbelief", "Maybe", "Only for kids"], "correctIndex": 0, "order": 4 },
      { "id": "qz_136_2", "type": "quiz", "question": "What is the cure for ignorance?", "options": ["Sleeping", "Seeking Knowledge", "Arguing", "Money"], "correctIndex": 1, "order": 5 },
      { "id": "qz_136_3", "type": "quiz", "question": "What is 'Waswas'?", "options": ["Wisdom", "Whispers/Intrusive thoughts", "Stars", "Birds"], "correctIndex": 1, "order": 6 },
      { "id": "qz_136_4", "type": "quiz", "question": "Should one talk to a knowledgeable person about doubts?", "options": ["Yes, it's recommended", "No, stay silent", "Only in private diaries", "Maybe"], "correctIndex": 0, "order": 7 },
      { "id": "qz_136_5", "type": "quiz", "question": "Certitude is reached through:", "options": ["Evidence and Prayer", "Guessing", "Hiding", "Magic"], "correctIndex": 0, "order": 8 }
    ]
  },
  {
    title: 'Module 1.3 Reflection',
    blocks: [
      { "id": "card_1_3_7", "type": "callout", "content": "Behold! In the creation of the heavens and the earth... are signs for people of understanding.", "author": "Quran 3:190", "order": 0 },
      { "id": "obj_1_3_7", "type": "objectives", "items": ["Summarizing the logic of faith", "Acknowledge the Fitrah", "Recommitting to purpose", "Review of Module 1.3"], "order": 1 },
      { "id": "txt_intro_1_3_7", "type": "text", "content": "You have explored the logic, the nature, and the purpose of existence. Let's consolidate these insights before we move to the specific Names of our Creator.", "order": 2 },
      { "id": "img_137", "type": "image", "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", "order": 3 },
      { "id": "qz_137_1", "type": "quiz", "question": "What is the natural inclination to God called?", "options": ["Fitrah", "History", "Logic", "Wealth"], "correctIndex": 0, "order": 4 },
      { "id": "qz_137_2", "type": "quiz", "question": "Revelation is needed to bridge the gap of human ____.", "options": ["Speed", "Limitations", "Wealth", "Vision"], "correctIndex": 1, "order": 5 },
      { "id": "qz_137_3", "type": "quiz", "question": "Are there signs in nature according to 3:190?", "options": ["Yes, for those who understand", "No, nature is random", "Only in the desert", "None"], "correctIndex": 0, "order": 6 },
      { "id": "qz_137_4", "type": "quiz", "question": "Can logic prove the necessity of a First Cause?", "options": ["Yes", "No", "Only for math", "Maybe"], "correctIndex": 0, "order": 7 },
      { "id": "qz_137_5", "type": "quiz", "question": "The goal of life is:", "options": ["Earning money", "Worshipping Allah", "Competing", "None"], "correctIndex": 1, "order": 8 }
    ]
  }
];

async function seed() {
  console.log('--- Seeding More Module 1.3 Content ---');
  const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
  if (!course) return console.error('Course not found');
  for (const item of DATA) {
    process.stdout.write(`Updating "${item.title}"... `);
    const { error } = await supabase.from('course_lessons').update({ content_blocks: item.blocks }).eq('course_id', course.id).eq('title', item.title);
    if (error) console.log('FAILED: ' + error.message);
    else console.log('SUCCESS');
  }
  console.log('--- Complete ---');
}
seed();
