// scripts/populate-compass-mod1-verbatim.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;

const allLessons = [
  // 1.1 Who Am I?
  {
    title: "Lesson 1.1: Who Am I? The Human Search for Identity",
    is_time_gated: false,
    pages: [
      { page_number: 1, page_type: 'overview', completion_required: true, content: [
          { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/silhouette%20silhouette%20of%20a%20person%20reading%20quran%20horizontal%20natural?width=1200&height=600&nologo=true" } },
          { id: genId(), type: 'text', content: "# Who Am I? The Human Search for Identity" },
          { id: genId(), type: 'text', content: "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
          { id: genId(), type: 'text', content: "### Key Questions\n• What does it mean to be human?\n• How do different worldviews define human identity?\n• What does Islam say about our origin and purpose?" },
          { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 30 minutes" },
          { id: genId(), type: 'text', content: "### Key Terms\n• **Fitrah** – the innate, natural disposition to believe in God and do good.\n• **Ruh** – the soul or spirit breathed into humans by Allah.\n• **Nafs** – the self, ego, or soul; can refer to the lower self or the higher self." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
          { id: genId(), type: 'text', content: "## Core Video" },
          { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/4K6xYv8P7Hw" } },
          { id: genId(), type: 'text', content: "**Nouman Ali Khan – \"The Purpose of Life\"**\nIn this talk, Nouman Ali Khan explores the human search for meaning and how the Quran addresses it. He discusses the fitrah and the innate human need to connect with the Creator.\n\n**Chapters:**\n• 0:00 – Introduction\n• 2:15 – The human need for purpose\n• 7:40 – The fitrah explained\n• 12:20 – How the Quran guides us\n• 18:00 – Conclusion" }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
          { id: genId(), type: 'text', content: "### Summary of Key Points\n• Humans are unique among creation because we ask deep questions about existence.\n• Our identity is not limited to the physical body; it includes an intellect, a soul, and a purpose.\n• The Islamic concept of fitrah teaches that every human is born with an innate awareness of God and a natural inclination toward truth and goodness.\n• The Quran affirms the dignity of human beings: 'We have certainly honored the children of Adam.' (17:70)\n• Our ultimate identity is as servants (‘abd) of Allah, and this gives life meaning." },
          { id: genId(), type: 'text', content: "### Deeper Explanation\nThe question \"Who am I?\" is perhaps the most fundamental question of human existence. Philosophers, psychologists, and theologians have offered various answers. Some say we are merely biological machines, products of chance. Others define us by our thoughts, our culture, or our achievements. Islam offers a holistic answer: we are created beings, fashioned by a wise and merciful Creator, and we are endowed with a soul that gives us dignity, free will, and moral responsibility.\n\nThe Quran teaches that Allah created Adam with His own hands and breathed into him of His spirit (ruh). This divine breath distinguishes humans from all other creatures. It gives us the capacity for knowledge, love, and moral choice. Yet we are also weak and forgetful; we need guidance. The fitrah is that original, uncorrupted nature that inclines us toward truth. The Prophet Muhammad (peace be upon him) said, \"Every child is born upon the fitrah, then his parents make him a Jew, a Christian, or a Magian.\" (Bukhari). So our environment can shape our identity, but deep down, we are seekers of God.\n\nUnderstanding that we are servants of Allah is not demeaning; it is liberating. It means our worth is not determined by wealth, status, or appearance, but by our relationship with our Creator. We are here to know Him, love Him, and worship Him. This gives every moment of life significance." },
          { id: genId(), type: 'quran', content: { reference: "Surah Al-Isra 17:70", translation: "And We have certainly honored the children of Adam and carried them on the land and sea and provided for them of the good things..." } },
          { id: genId(), type: 'quran', content: { reference: "Surah Adh-Dhariyat 51:56", translation: "And I did not create the jinn and mankind except to worship Me." } },
          { id: genId(), type: 'quran', content: { reference: "Surah At-Tin 95:4", translation: "We have certainly created man in the best of stature." } },
          { id: genId(), type: 'hadith', content: { reference: "Sahih al-Bukhari, 1358; Sahih Muslim, 2658", translation: "Every child is born upon the fitrah; his parents make him a Jew, a Christian, or a Magian." } },
          { id: genId(), type: 'hadith', content: { reference: "Sahih Muslim, 2664", translation: "The strong believer is better and more beloved to Allah than the weak believer..." } },
          { id: genId(), type: 'text', content: "### Stories/Examples\nConsider the story of Prophet Adam (peace be upon him). After creating him, Allah commanded the angels to prostrate to him as a sign of respect for this new creation. Iblis (Satan) refused out of arrogance, showing that true identity is not about origin but about humility and obedience. Adam later forgot Allah's command and ate from the forbidden tree, but then he repented and Allah accepted his repentance." },
          { id: genId(), type: 'text', content: "### Key Takeaways\n1. Your identity includes body, mind, and soul.\n2. You were born with a fitrah.\n3. Your true worth comes from being a servant of Allah.\n4. Life’s purpose is to know and worship your Creator.\n5. Honoring your fitrah means seeking truth and living in alignment with your nature." }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
          { id: genId(), type: 'text', content: "## Reflection Journal" },
          { id: genId(), type: 'reflection', content: { prompt: "1. Before this lesson, how did you define your own identity? What factors (culture, family, experiences) shaped that definition?" } },
          { id: genId(), type: 'reflection', content: { prompt: "2. What does it mean to you personally that you were created with a fitrah? Can you recall a moment when you felt that innate pull toward truth or goodness?" } },
          { id: genId(), type: 'reflection', content: { prompt: "3. How does the Quranic statement that humans are 'honored' affect your self-esteem and how you treat others?" } },
          { id: genId(), type: 'reflection', content: { prompt: "4. Write one sentence describing your purpose in life based on this lesson." } },
          { id: genId(), type: 'reflection', content: { prompt: "5. What is one question about human identity that you still have or would like to explore further?" } }
      ]},
      { page_number: 5, page_type: 'knowledge_check', completion_required: true, content: [
          { id: genId(), type: 'text', content: "## Knowledge Check" },
          { id: genId(), type: 'quiz', content: { question: "According to the Quran, how did Allah describe the creation of humans?", options: ["Evolved from apes", "Created in the best of stature", "Created from clay only", "Created as accidental beings"], correctIndex: 1 } },
          { id: genId(), type: 'quiz', content: { question: "What is fitrah?", options: ["The soul after death", "Innate human nature inclined toward God", "The physical body", "A type of prayer"], correctIndex: 1 } },
          { id: genId(), type: 'quiz', content: { question: "Which Surah states that humans and jinn were created to worship?", options: ["Al-Fatiha", "Al-Ikhlas", "Adh-Dhariyat", "Al-Baqarah"], correctIndex: 2 } },
          { id: genId(), type: 'quiz', content: { question: "The story of which prophet’s creation illustrates human honor?", options: ["Nuh", "Ibrahim", "Adam", "Musa"], correctIndex: 2 } },
          { id: genId(), type: 'quiz', content: { question: "True or False: According to Islam, humans are purely physical beings with no spiritual component.", options: ["True", "False"], correctIndex: 1 } }
      ]}
    ]
  }
];

// Wait, I will split the load of the 10 item arrays into chunks or append loops so I can write them without hitting output file limit thresholds easily if it got too large.
// I'll append Lesson 1.2 to 1.10 fully.
export async function push() {
     const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
     const compass = courses.find(c => c.title.includes('The Compass'));
     const { data: modules } = await supabase.from('course_modules').select('id, title').eq('course_id', compass.id).order('sort_order');
     const { data: lessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', modules[0].id).order('sort_order');

     for (let i = 0; i < allLessons.length; i++) {
         const l = allLessons[i];
         const target = lessons[i];
         if (!target) continue;
         await supabase.from('course_lessons').update({ title: l.title, content_data: { page_count: 5, is_time_gated: l.is_time_gated, pages: l.pages } }).eq('id', target.id);
         console.log(`✅ Saved ${l.title}`);
     }
}

// I will create the other files with the full mapped lesson contents of 1.2-1.10 appended sequentially so we don't drop anything.
// Let me write the JSON files and parse loop so I can LOAD them sequentially.
