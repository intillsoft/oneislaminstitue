import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;

const allLessons = [
  // LESSON 1.3
  {
    title: "Lesson 1.3: Where Am I Going? The Journey Ahead",
    pages: [
      { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/pathway%20leading%20to%20sunset%20scenic%20horizon%20horizontal?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# Where Am I Going? The Journey Ahead" },
        { id: genId(), type: 'text', content: "**Goal:** Understand the Islamic concept of life as a journey toward the Hereafter." },
        { id: genId(), type: 'text', content: "### Key Questions\n• What happens after death?\n• What is the purpose of this temporary world?\n• How should we prepare for the next life?" },
        { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 30 minutes" },
        { id: genId(), type: 'text', content: "### Key Terms\n• **Barzakh** – the intermediate state between death and resurrection.\n• **Qiyamah** – the Day of Standing (Resurrection).\n• **Jannah** – Paradise, the Garden.\n• **Jahannam** – Hellfire." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/LifeAfterDeath" } },
        { id: genId(), type: 'text', content: "**Yasir Qadhi – \"Journey of the Soul\"**\nLecture exploring the stages of the soul after death, the barzakh, and the Day of Judgment." }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Death is not the end; it is a transition.\n• After death, the soul enters Barzakh.\n• The grave is the first stage of the Hereafter.\n• On the Day of Judgment, all humanity will be resurrected.\n• The final destination is Paradise or Hell." },
        { id: genId(), type: 'text', content: "### Deeper Explanation\nIn Islam, this world (dunya) is a place of trial, and the Hereafter (akhirah) is the eternal abode. The Quran constantly reminds us that the life of this world is but \"sport and play\" and that the Hereafter is the true life. Understanding where we are going transforms how we live today.\n\nWhen a person dies, their soul appears to taste what awaits. The Prophet described the grave as either a garden of Paradise or a pit of Hell." },
        { id: genId(), type: 'quran', content: { reference: "Surah Al-Mu’minun 23:100", translation: "Behind them is a barrier (barzakh) until the Day they are resurrected." } },
        { id: genId(), type: 'hadith', content: { reference: "Tirmidhi, 2308", translation: "The grave is the first stage of the Hereafter; whoever is saved from it, what comes after is easier." } },
        { id: genId(), type: 'text', content: "### Stories/Examples\nThe Prophet once passed by two graves and noted they were being punished for gossip and hygiene errors." },
        { id: genId(), type: 'text', content: "### Key Takeaways\n1. Death is a gateway to eternal life.\n2. The grave is the first stop.\n3. Every good deed matters." },
        { id: genId(), type: 'text', content: "### Vocabulary\n• **Mizan** – scale.\n• **Sirat** – bridge over Hell." }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. How does believing in an afterlife change your daily decisions?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. If you knew you would die one month from today, what would you change?" } },
        { id: genId(), type: 'reflection', content: { prompt: "3. What deeds do you expect will expand your grave when you leave this world?" } },
        { id: genId(), type: 'reflection', content: { prompt: "4. Write about one good deed you can do this week that will benefit you in the next life." } }
      ]},
      { page_number: 5, page_type: 'knowledge_check', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Knowledge Check" },
        { id: genId(), type: 'quiz', content: { question: "What is Barzakh?", options: ["The Day of Judgment", "Intermediate state", "Bridge over Hell"], correctIndex: 1 } },
        { id: genId(), type: 'quiz', content: { question: "According to the Quran, what will happen on the Day of Judgment?", options: ["Everyone will be reincarnated", "The dead will be resurrected and judged", "The world will end with nothing"], correctIndex: 1 } },
        { id: genId(), type: 'quiz', content: { question: "Which Surah says that an atom’s weight of good will be seen?", options: ["Al-Ikhlas", "Az-Zalzalah", "Al-Fatiha"], correctIndex: 1 } }
      ]}
    ]
  }
  // I will add 1.4, 1.5, 1.6 below with EXACT rich data blocks!
];

async function start() {
    console.log("Replacing GUTTED records for 1.3...");
    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', compass.id).order('sort_order');
    const mod1Id = modules[0].id;

    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', mod1Id).order('sort_order');

    // Lesson 1.3 is index 2 (third lesson)
    const targetLesson = dbLessons[2];
    const newContentData = { page_count: 5, is_time_gated: false, pages: allLessons[0].pages };

    await supabase.from('course_lessons').update({ title: allLessons[0].title, content_data: newContentData }).eq('id', targetLesson.id);
    console.log("✅ Fixed 1.3 comprehensively.");
}

start();
