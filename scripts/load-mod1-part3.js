import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;

const lessons = [
  // 1.7 What is Success in This Life?
  {
    title: "Lesson 1.7: What is Success in This Life?",
    pages: [
       { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/sunrise%20over%20ocean%20natural%20horizontal?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# What is Success in This Life?" },
        { id: genId(), type: 'text', content: "**Goal:** Redefine success from an Islamic perspective, balancing worldly achievements with spiritual growth." },
        { id: genId(), type: 'text', content: "### Key Questions\n• How does modern culture define success?\n• What is true success according to the Quran?\n• Can a Muslim be wealthy and successful?" },
        { id: genId(), type: 'text', content: "### Key Terms\n• **Falah** – success, salvation.\n• **Barakah** – blessing.\n• **Zuhd** – detachment." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/FalahSuccess" } },
        { id: genId(), type: 'text', content: "**Nouman Ali Khan – \"The Definition of Success\"**\nLecture discussing how cultural success differs from Quranic definitions (Falah) using opening of Surah Al-Mu'minun." }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Modern culture defines success by materialism.\n• Islam defines success as Falah.\n• Detachment (Zuhd) means holding are held hand not heart." },
        { id: genId(), type: 'text', content: "### Deeper Explanation\nTraditional farming uses cultivation. Intending Zakah and funding creates balance. The love of dunya causes anxiety. Richness isn't things but mind." },
        { id: genId(), type: 'quran', content: { reference: "Surah Al-Mu’minun 23:1-4", translation: "Successful indeed are the believers: those who are humble in their prayers..." } },
        { id: genId(), type: 'hadith', content: { reference: "Muslim, 1054", translation: "He has succeeded who accepts Islam, is provided with sufficient sustenance..." } }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. How do you define success in your life right now? Is it aligned with Falah?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. Describe rich spirituality when you felt rich inside instead of material things." } }
      ]}
    ]
  },

  // 1.8 What Happens After Death?
  {
    title: "Lesson 1.8: What Happens After Death?",
    pages: [
       { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/hourglass%20natural%20clouds%20white%20horizontal?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# What Happens After Death?" },
        { id: genId(), type: 'text', content: "**Goal:** Study the specific stages of the soul from the moment of death to entering Paradise or Hellfire." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/JourneyOfTheSoul" } },
        { id: genId(), type: 'text', content: "**Yasir Qadhi – \"Journey of the Soul Part 2\"**\nLecture discussing moments of death and ascent into the heavens." }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Death is managed by Malak al-Mawt and assisting angels.\n• Questions arise with Angel Munkar and Nakir asking 3 discrete test items.\n• Expanses expand fully righteous while tightening on non-righteous." },
        { id: genId(), type: 'quran', content: { reference: "Surah As-Sajdah 32:11", translation: "Say, 'The Angel of Death who has been entrusted with you will take you.'" } },
        { id: genId(), type: 'hadith', content: { reference: "Muslim", translation: "Rest, O peaceful soul, come out to the mercy of Allah..." } }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. How do you feel about the three questions in the grave?" } }
      ]}
    ]
  },

  // 1.9 How Do I Find Answers?
  {
    title: "Lesson 1.9: How Do I Find Answers?",
    pages: [
       { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/question%20mark%20symbol%20on%20scroll%20lit%20book%20horizontal?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# How Do I Find Answers?" },
        { id: genId(), type: 'text', content: "**Goal:** Learn the methodology for seeking guidance, asking questions, and avoiding doubts." }
       ]},
       { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/DoubtsInIslam" } },
        { id: genId(), type: 'text', content: "**Omar Suleiman – \"How to Handle Doubts\"**\nCritical thinking applied with fitrah humility." }
       ]},
       { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
         { id: genId(), type: 'text', content: "### Summary of Key Points\n• Questions are optimal in Islam for unlocking wisdom (Hikmah).\n• Doubts resolves with evidence ask qualified scholars." },
         { id: genId(), type: 'quran', content: { reference: "Surah An-Nahl 16:43", translation: "So ask the people of the message if you do not know." } },
         { id: genId(), type: 'hadith', content: { reference: "Abu Dawud, 337", translation: "The cure for ignorance is to ask." } }
       ]}
    ]
  },

  // 1.10 Weekly Integration Task
  {
    title: "Lesson 1.10: Weekly Integration Task – The Big Questions",
    is_time_gated: true,
    pages: [
       { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'text', content: "# Weekly Integration Task – The Big Questions" },
        { id: genId(), type: 'text', content: "**Goal:** Apply the concepts learned in Module 1 to reflect on personal growth." }
       ]},
       { page_number: 2, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Integration Framework\nWe have explored four core dimensions:\n1. Identity (Fitrah)\n2. Purpose (Ibadah)\n3. Destination (Akhirah)\n4. Truth (Revelation)" }
       ]}
    ]
  }
];

async function start() {
    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', compass.id).order('sort_order');
    const mod1Id = modules[0].id;
    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', mod1Id).order('sort_order');

    for (let i = 0; i < lessons.length; i++) {
        const lessonData = lessons[i];
        const dbIndex = i + 6; // 1.7 maps to index 6
        const targetLesson = dbLessons[dbIndex];
        const newContentData = { page_count: 5, is_time_gated: lessonData.is_time_gated || false, pages: lessonData.pages };

        await supabase.from('course_lessons').update({ title: lessonData.title, content_data: newContentData }).eq('id', targetLesson.id);
        console.log(`✅ Loaded ${lessonData.title} completely into DB.`);
    }
}

start();
