import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;

const lessonsToLoad = [
  {
    title: "Lesson 1.1: Who Am I? The Human Search for Identity",
    pages: [
      {
        page_number: 1,
        page_type: "overview",
        completion_required: true,
        content: [
          { id: genId(), type: "image", content: { url: "https://image.pollinations.ai/prompt/realistic%20silhouette%20person%20stars%20spark%20horizontal?width=1200&height=600&nologo=true" } },
          { id: genId(), type: "text", content: "# Who Am I? The Human Search for Identity" },
          { id: genId(), type: "text", content: "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
          { id: genId(), type: "text", content: "### Key Questions\n• What does it mean to be human?\n• How do different worldviews define human identity?\n• What does Islam say about our origin and purpose?" },
          { id: genId(), type: "text", content: "### Time Estimate\n⏱️ 30 minutes" },
          { id: genId(), type: "text", content: "### Key Terms\n• **Fitrah** – the innate, natural disposition to believe in God and do good.\n• **Ruh** – the soul or spirit breathed into humans by Allah.\n• **Nafs** – the self, ego, or soul; can refer to the lower self or the higher self." }
        ]
      },
      {
        page_number: 2,
        page_type: "video",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "## Core Video" },
          { id: genId(), type: "video", content: { url: "https://www.youtube.com/embed/4K6xYv8P7Hw" } },
          { id: genId(), type: "text", content: "**Nouman Ali Khan – \"The Purpose of Life\"**\nIn this talk, Nouman Ali Khan explores the human search for meaning and how the Quran addresses it. He discusses the fitrah and the innate human need to connect with the Creator." },
          { id: genId(), type: "text", content: "### Chapters\n• 0:00 – Introduction\n• 2:15 – The human need for purpose\n• 7:40 – The fitrah explained\n• 12:20 – How the Quran guides us\n• 18:00 – Conclusion\n\n[Download Transcript Button Placeholder]" }
        ]
      },
      {
        page_number: 3,
        page_type: "companion_guide",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "### Summary of Key Points\n• Humans are unique asking deep questions.\n• Identity included intellect, a soul, and a purpose.\n• Fitrah gives innate awareness of God.\n• Quran affirms human dignity.\n• Ultimate identity is as servants of Allah." },
          { id: genId(), type: "text", content: "### Deeper Explanation\nThe question \"Who am I?\" is the most fundamental question of human existence. Islam offers a holistic answer: we are created beings fashioned by a wise Creator, endowed with a soul that gives us dignity, free will, and moral responsibility. The divine breath distinguishes humans from all other creatures.\n\nServanthood to Allah is not demeaning; it is liberating. Worth is not determined by wealth or status, but by our relationship with our Creator." },
          { id: genId(), type: "quran", content: { reference: "Surah Al-Isra 17:70", translation: "And We have certainly honored the children of Adam..." } },
          { id: genId(), type: "quran", content: { reference: "Surah Adh-Dhariyat 51:56", translation: "And I did not create the jinn and mankind except to worship Me." } },
          { id: genId(), type: "quran", content: { reference: "Surah At-Tin 95:4", translation: "We have certainly created man in the best of stature." } },
          { id: genId(), type: "hadith", content: { reference: "Sahih al-Bukhari, 1358", translation: "Every child is born upon the fitrah..." } },
          { id: genId(), type: "text", content: "### Stories/Examples\nConsider the story of Prophet Adam (peace be upon him). After creating him, Allah commanded the angels to prostrate to him as a sign of respect for this new creation." },
          { id: genId(), type: "text", content: "### Key Takeaways\n1. Identity includes body, mind, and soul.\n2. Born with a fitrah.\n3. Worth comes from being a servant of Allah.\n4. Purpose is to worship Creator.\n5. Honor fitrah means seeking truth." }
        ]
      },
      {
        page_number: 4,
        page_type: "reflection_journal",
        completion_required: true,
        content: [
          { id: genId(), type: "reflection", content: { prompt: "1. Before this lesson, how did you define your own identity? What factors (culture, family, experiences) shaped that definition?" } },
          { id: genId(), type: "reflection", content: { prompt: "2. What does it mean to you personally that you were created with a fitrah? Can you recall a moment when you felt that innate pull toward truth or goodness?" } },
          { id: genId(), type: "reflection", content: { prompt: "3. How does the Quranic statement that humans are \"honored\" affect your self-esteem and how you treat others?" } },
          { id: genId(), type: "reflection", content: { prompt: "4. Write one sentence describing your purpose in life based on this lesson." } }
        ]
      },
      {
        page_number: 5,
        page_type: "knowledge_check",
        completion_required: true,
        content: [
          { id: genId(), type: "quiz", content: { question: "According to the Quran, how did Allah describe the creation of humans?", options: ["Evolved from apes", "Created in the best of stature", "Created from clay only", "Created as accidental beings"], correctIndex: 1 } },
          { id: genId(), type: "quiz", content: { question: "What is fitrah?", options: ["The soul after death", "Innate human nature inclined toward God", "The physical body", "A type of prayer"], correctIndex: 1 } },
          { id: genId(), type: "quiz", content: { question: "Which Surah states that humans and jinn were created to worship?", options: ["Al-Fatiha", "Al-Ikhlas", "Adh-Dhariyat", "Al-Baqarah"], correctIndex: 2 } },
          { id: genId(), type: "quiz", content: { question: "The story of which prophet’s creation illustrates human honor?", options: ["Nuh", "Ibrahim", "Adam", "Musa"], correctIndex: 2 } },
          { id: genId(), type: "quiz", content: { question: "True or False: According to Islam, humans are purely physical beings with no spiritual component.", options: ["True", "False"], correctIndex: 1 } }
        ]
      }
    ]
  },
  {
    title: "Lesson 1.2: Why Am I Here? The Purpose of Existence",
    pages: [
      {
        page_number: 1,
        page_type: "overview",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "# Why Am I Here? The Purpose of Existence" },
          { id: genId(), type: "text", content: "**Goal:** Understand the Islamic answer to life’s ultimate question." },
          { id: genId(), type: "text", content: "### Key Questions\n• What do other philosophies say about purpose?\n• How does the Quran define our purpose?\n• What does \"worship\" mean in a broad sense?" },
          { id: genId(), type: "text", content: "### Time Estimate\n⏱️ 30 minutes" },
          { id: genId(), type: "text", content: "### Key Terms\n• **‘Ibadah** – worship, service.\n• **Khalifah** – vicegerent, steward.\n• **Dunya** – this world.\n• **Akhirah** – the Hereafter." }
        ]
      },
      {
        page_number: 2,
        page_type: "video",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "## Core Video" },
          { id: genId(), type: "video", content: { url: "https://www.youtube.com/embed/AnA_xY6Z664" } }, // Dummy link placeholder
          { id: genId(), type: "text", content: "**Omar Suleiman – \"Why Did God Create Us?\"**\nExplains the purpose of creation, emphasizing that life is a test and opportunity to know Allah." }
        ]
      },
      {
        page_number: 3,
        page_type: "companion_guide",
        completion_required: true,
        content: [
          { id: genId(), type: "text", content: "### Summary of Key Points\n• Purpose given by Creator.\n• Worship encompasses regular life done with intention.\n• Caretakers of the earth (Khalifah).\n• Life is a Test." },
          { id: genId(), type: "quran", content: { reference: "Surah Adh-Dhariyat 51:56", translation: "And I did not create the jinn and mankind except to worship Me." } },
          { id: genId(), type: "quran", content: { reference: "Surah Al-Baqarah 2:30", translation: "Indeed, I will make upon the earth a successive authority." } }
        ]
      },
      {
        page_number: 4,
        page_type: "reflection_journal",
        completion_required: true,
        content: [
          { id: genId(), type: "reflection", content: { prompt: "1. Before learning about Islam, what did you think was the purpose of life? Has this lesson changed your perspective?" } },
          { id: genId(), type: "reflection", content: { prompt: "2. How does the idea that your daily work can be worship change your attitude toward your job or studies?" } }
        ]
      },
      {
        page_number: 5,
        page_type: "knowledge_check",
        completion_required: true,
        content: [
          { id: genId(), type: "quiz", content: { question: "According to Surah Adh-Dhariyat, why did Allah create humans and jinn?", options: ["To enjoy life", "To worship Him", "To populate the earth"], correctIndex: 1 } },
          { id: genId(), type: "quiz", content: { question: "The term \"khalifah\" refers to:", options: ["A prophet", "A vicegerent or steward on earth", "A type of prayer"], correctIndex: 1 } }
        ]
      }
    ]
  }
];

async function start() {
    console.log("Finding Course & Module...");
    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    
    const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', compass.id).order('sort_order');
    const mod1Id = modules[0].id; // First module
    
    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', mod1Id).order('sort_order');

    for (let i = 0; i < lessonsToLoad.length; i++) {
         const lesson = lessonsToLoad[i];
         const targetDbLesson = dbLessons[i]; // 0 -> 1.1, 1 -> 1.2
         
         const newContentData = {
              page_count: lesson.pages.length,
              is_time_gated: false,
              pages: lesson.pages
         };
         
         const { error } = await supabase.from('course_lessons').update({
             title: lesson.title,
             content_data: newContentData
         }).eq('id', targetDbLesson.id);
         
         if (error) {
             console.error(`Error loading ${lesson.title}:`, error);
         } else {
             console.log(`✅ Loaded ${lesson.title} comprehensively.`);
         }
    }
}

start();
