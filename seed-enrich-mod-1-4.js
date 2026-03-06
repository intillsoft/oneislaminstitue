const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = [
  {
    title: "Intro to Allah's Names",
    blocks: [
      { "id": "card_1_4_1", "type": "callout", "content": "And to Allah belong the best names, so invoke Him by them.", "author": "Quran 7:180", "order": 0 },
      { "id": "obj_1_4_1", "type": "objectives", "items": ["The concept of Asma al-Husna", "How to memorize and live by them", "Relationship between names and attributes", "Invocation through the Beautiful Names"], "order": 1 },
      { "id": "txt_intro_1_4_1", "type": "text", "content": "Knowing Allah is the highest form of knowledge. This lesson introduces the 99 Names — the window through which we understand Divine Perfection. Memorizing them is the first step; internalizing them is the goal.", "order": 2 },
      { "id": "vid_1_4_1", "type": "video", "url": "https://www.youtube.com/watch?v=S7bW7gKz82Q", "order": 3 },
      { "id": "qz_141_1", "type": "quiz", "question": "What is the collective term for Allah's names?", "options": ["Asma al-Husna", "Dua", "Sunnah", "History"], "correctIndex": 0, "order": 4 },
      { "id": "qz_141_2", "type": "quiz", "question": "In 7:180, what are we commanded to do with the names?", "options": ["Write them on walls only", "Invoke Him by them", "Hide them", "None"], "correctIndex": 1, "order": 5 },
      { "id": "qz_141_3", "type": "quiz", "question": "Does knowing the names change our relationship with Allah?", "options": ["Yes, it deepens love and awe", "No, it's just facts", "Only if you are a scholar", "Maybe"], "correctIndex": 0, "order": 6 },
      { "id": "qz_141_4", "type": "quiz", "question": "How many names are famously mentioned for preservation in the Hadith?", "options": ["7", "12", "99", "1000"], "correctIndex": 2, "order": 7 },
      { "id": "qz_141_5", "type": "quiz", "question": "Internalizing a name means:", "options": ["Just repeating it", "Acting upon its spiritual implications", "Screaming it", "None"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Ar-Rahman and Ar-Rahim',
    blocks: [
      { "id": "card_1_4_2", "type": "callout", "content": "My Mercy encompasses all things.", "author": "Quran 7:156", "order": 0 },
      { "id": "obj_1_4_2", "type": "objectives", "items": ["Differentiating Ar-Rahman and Ar-Rahim", "The intensity of Divine Mercy", "Rahma in the creation", "Applying mercy in our lives"], "order": 1 },
      { "id": "txt_intro_1_4_2", "type": "text", "content": "Mercy is the defining attribute of the Creator. In this lesson, we explore the subtle difference between 'The Entirely Merciful' and 'The Especially Merciful', and how this mercy flows through the universe.", "order": 2 },
      { "id": "vid_1_4_2", "type": "video", "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", "order": 3 },
      { "id": "qz_142_1", "type": "quiz", "question": "Which name signifies a mercy that is all-encompassing for everyone?", "options": ["Ar-Rahim", "Ar-Rahman", "Al-Malik", "Al-Alim"], "correctIndex": 1, "order": 4 },
      { "id": "qz_142_2", "type": "quiz", "question": "Ar-Rahim specifically refers to whose mercy?", "options": ["Enemies", "The Believers", "Animals only", "Everyone"], "correctIndex": 1, "order": 5 },
      { "id": "qz_142_3", "type": "quiz", "question": "In 7:156, what encompasses all things?", "options": ["Knowledge", "Mercy", "Patience", "Grief"], "correctIndex": 1, "order": 6 },
      { "id": "qz_142_4", "type": "quiz", "question": "Mercy on earth is described as a ______ of Divine Mercy.", "options": ["Small fraction (1 out of 100)", "Half", "All of it", "None"], "correctIndex": 0, "order": 7 },
      { "id": "qz_142_5", "type": "quiz", "question": "To receive mercy, we should be ______ to others.", "options": ["Rude", "Indifferent", "Merciful", "Competitive"], "correctIndex": 2, "order": 8 }
    ]
  },
  {
    title: 'Al-Malik and Al-Quddus',
    blocks: [
      { "id": "card_1_4_3", "type": "callout", "content": "He is Allah, besides Whom there is no god, the Sovereign (Al-Malik), the Pure (Al-Quddus).", "author": "Quran 59:23", "order": 0 },
      { "id": "obj_1_4_3", "type": "objectives", "items": ["The Source of Sovereignty", "Absolute Purity and Perfection", "Submission to the King of kings", "Dignity in worship"], "order": 1 },
      { "id": "txt_intro_1_4_3", "type": "text", "content": "Power and Purity. Al-Malik owns the universe, while Al-Quddus is free from any defect. Recognizing Allah as the Sovereign King frees the believer from the fear of man-made structures.", "order": 2 },
      { "id": "vid_1_4_3", "type": "video", "url": "https://www.youtube.com/watch?v=vV77m6282YI", "order": 3 },
      { "id": "qz_143_1", "type": "quiz", "question": "What does 'Al-Malik' mean?", "options": ["The Wise", "The Sovereign/The King", "The Patient", "The First"], "correctIndex": 1, "order": 4 },
      { "id": "qz_143_2", "type": "quiz", "question": "Al-Quddus signifies that Allah is free from:", "options": ["Time", "Defects/Imperfections", "Space", "Color"], "correctIndex": 1, "order": 5 },
      { "id": "qz_143_3", "type": "quiz", "question": "Where is 59:23 located in the Quran?", "options": ["Al-Baqarah", "Al-Hashr", "Al-Ikhlas", "Al-Anfal"], "correctIndex": 1, "order": 6 },
      { "id": "qz_143_4", "type": "quiz", "question": "If Allah is the Absolute King, what should we fear?", "options": ["Everyone", "Nothing but Him", "Shadows", "Money"], "correctIndex": 1, "order": 7 },
      { "id": "qz_143_5", "type": "quiz", "question": "Proper behavior before the King of kings is:", "options": ["Adab (Etiquette)", "Arrogance", "Silence", "Speed"], "correctIndex": 0, "order": 8 }
    ]
  },
  {
    title: 'Al-Alim and Al-Hakim',
    blocks: [
      { "id": "card_1_4_4", "type": "callout", "content": "Glorious are You! We have no knowledge except what You have taught us.", "author": "Quran 2:32", "order": 0 },
      { "id": "obj_1_4_4", "type": "objectives", "items": ["Omniscience vs. Human knowledge", "The wisdom behind the tests", "Trusting the All-Wise", "Concealing and revealing knowledge"], "order": 1 },
      { "id": "txt_intro_1_4_4", "type": "text", "content": "Allah knows the past, present, and the future — even that which never was, and how it would have been if it were. Al-Alim knows everything; Al-Hakim places everything in its perfect place.", "order": 2 },
      { "id": "vid_1_4_4", "type": "video", "url": "https://www.youtube.com/watch?v=8p_hS4o_7_k", "order": 3 },
      { "id": "qz_144_1", "type": "quiz", "question": "What does 'Al-Hakim' mean?", "options": ["The King", "The All-Wise", "The All-Powerful", "The Peace"], "correctIndex": 1, "order": 4 },
      { "id": "qz_144_2", "type": "quiz", "question": "Is anything hidden from 'Al-Alim'?", "options": ["Yes, the future", "No, nothing", "Only small things", "Maybe"], "correctIndex": 1, "order": 5 },
      { "id": "qz_144_3", "type": "quiz", "question": "Whose knowledge is limited?", "options": ["Allah's", "Humans and Creation", "None", "Unknown"], "correctIndex": 1, "order": 6 },
      { "id": "qz_144_4", "type": "quiz", "question": "The response of the Angels in 2:32 shows:", "options": ["Humility", "Arrogance", "Knowledge", "Strength"], "correctIndex": 0, "order": 7 },
      { "id": "qz_144_5", "type": "quiz", "question": "Wisdom is putting things in their:", "options": ["Boxes", "Rightful Place", "Wrong place", "Randomness"], "correctIndex": 1, "order": 8 }
    ]
  },
  {
    title: 'Al-Khaliq and Al-Bari',
    blocks: [
      { "id": "card_1_4_5", "type": "callout", "content": "He is Allah, the Creator (Al-Khaliq), the Evolver (Al-Bari), the Fashioner (Al-Musawwir).", "author": "Quran 59:24", "order": 0 },
      { "id": "obj_1_4_5", "type": "objectives", "items": ["Bringing into existence from nothing", "Giving proportion and order", "Fashioning the unique forms", "Reflecting on the self and nature"], "order": 1 },
      { "id": "txt_intro_1_4_5", "type": "text", "content": "How did we get here? From the vast galaxies to the intricate DNA, everything is the work of Al-Khaliq. He didn't just 'create'; He 'evolved' and 'fashioned' with infinite precision.", "order": 2 },
      { "id": "vid_1_4_5", "type": "video", "url": "https://www.youtube.com/watch?v=F07p1mU7-eU", "order": 3 },
      { "id": "qz_145_1", "type": "quiz", "question": "What does 'Al-Khaliq' mean?", "options": ["The Shaper", "The Creator", "The Wise", "The King"], "correctIndex": 1, "order": 4 },
      { "id": "qz_145_2", "type": "quiz", "question": "Which name signifies bringing things from chaos into order?", "options": ["Al-Bari", "Al-Malik", "Al-Quddus", "Al-Alim"], "correctIndex": 0, "order": 5 },
      { "id": "qz_145_3", "type": "quiz", "question": "Allah creates everything according to a:", "options": ["Measure and Proportion (Qadr)", "Mistake", "History", "Song"], "correctIndex": 0, "order": 6 },
      { "id": "qz_145_4", "type": "quiz", "question": "Is there anything in creation without a purpose?", "options": ["Yes, many things", "No, everything has purpose", "Only in the ocean", "Maybe"], "correctIndex": 1, "order": 7 },
      { "id": "qz_145_5", "type": "quiz", "question": "Al-Musawwir means:", "options": ["The Fashioner/Artist", "The Strong", "The First", "The Last"], "correctIndex": 0, "order": 8 }
    ]
  },
  {
    title: 'Meaning of Tawheed',
    blocks: [
      { "id": "card_1_4_6", "type": "callout", "content": "Say: He is Allah, [who is] One.", "author": "Quran 112:1", "order": 0 },
      { "id": "obj_1_4_6", "type": "objectives", "items": ["The three types of Tawheed", "The absolute Oneness", "Avoiding Shirk", "The impact on the soul"], "order": 1 },
      { "id": "txt_intro_1_4_6", "type": "text", "content": "Tawheed is the core of our creed. It is not just the number 'one'; it's the 'unification' of our love, fear, and worship toward the only One who deserves it. This lesson defines the boundaries of our belief.", "order": 2 },
      { "id": "vid_1_4_6", "type": "video", "url": "https://www.youtube.com/watch?v=F7v8uY_5844", "order": 3 },
      { "id": "qz_146_1", "type": "quiz", "question": "What is 'Tawheed'?", "options": ["The Oneness of Allah", "History", "Magic", "Travel"], "correctIndex": 0, "order": 4 },
      { "id": "qz_146_2", "type": "quiz", "question": "Which Surah is equivalent to 1/3 of the Quran regarding Tawheed?", "options": ["Al-Fatiha", "Al-Ikhlas", "Al-Mulk", "Al-Nasr"], "correctIndex": 1, "order": 5 },
      { "id": "qz_146_3", "type": "quiz", "question": "Tawheed al-Uluhiyyah refers to Oneness in:", "options": ["Creation", "Worship/Gestation", "Names", "Speed"], "correctIndex": 1, "order": 6 },
      { "id": "qz_146_4", "type": "quiz", "question": "What is the opposite of Tawheed?", "options": ["Sunnah", "Shirk (Associating partners)", "History", "Wisdom"], "correctIndex": 1, "order": 7 },
      { "id": "qz_146_5", "type": "quiz", "question": "Does Tawheed provide freedom to the human soul?", "options": ["Yes, from worshipping creation", "No, it's restrictive", "Only for scholars", "Maybe"], "correctIndex": 0, "order": 8 }
    ]
  },
  {
    title: 'Weekly Review',
    blocks: [
      { "id": "card_1_4_7", "type": "callout", "content": "To Him belongs the command and to Him you will be returned.", "author": "Quran 28:88", "order": 0 },
      { "id": "obj_1_4_7", "type": "objectives", "items": ["Asma al-Husna summary", "Mercy and Purity Review", "Knowledge and Creation Review", "Tawheed final review"], "order": 1 },
      { "id": "txt_intro_1_4_7", "type": "text", "content": "A week of deep contemplation on the Divine. Let's wrap up our understanding of the Attributes before we begin the modules on prophecy and the unseen.", "order": 2 },
      { "id": "img_147", "type": "image", "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", "order": 3 },
      { "id": "qz_147_1", "type": "quiz", "question": "Final Match: The merciful Name for every creature is:", "options": ["Ar-Rahim", "Ar-Rahman", "Al-Alim", "None"], "correctIndex": 1, "order": 4 },
      { "id": "qz_147_2", "type": "quiz", "question": "Which name means 'The All-Wise'?", "options": ["Al-Alim", "Al-Hakim", "Al-Malik", "Al-Quddus"], "correctIndex": 1, "order": 5 },
      { "id": "qz_147_3", "type": "quiz", "question": "Submission to Allah as King is:", "options": ["Al-Malik", "Al-Bari", "Al-Alim", "None"], "correctIndex": 0, "order": 6 },
      { "id": "qz_147_4", "type": "quiz", "question": "Tawheed means:", "options": ["Unification of worship", "Associating partners", "Scientific study", "Travel"], "correctIndex": 0, "order": 7 },
      { "id": "qz_147_5", "type": "quiz", "question": "Is knowing Allah's names mandatory for seekers of truth?", "options": ["No", "Yes, it is the foundation", "Only on Saturdays", "Maybe"], "correctIndex": 1, "order": 8 }
    ]
  }
];

async function seed() {
  console.log('--- Seeding Module 1.4 Content ---');
  const { data: course } = await supabase.from('jobs').select('id').eq('title', 'Foundations of Islamic Faith').single();
  if (!course) return console.error('Course not found');
  for (const item of DATA) {
    process.stdout.write(`Updating "${item.title}"... `);
    const { error } = await supabase.from('course_lessons').update({ content_blocks: item.blocks }).eq('course_id', course.id).eq('title', item.title);
    if (error) console.log('FAILED: ' + error.message);
    else console.log('SUCCESS');
  }
}
seed();
