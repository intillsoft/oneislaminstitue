import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;

const lessons = [
  // 1.4 What is Truth? How Do We Know?
  {
    title: "Lesson 1.4: What is Truth? How Do We Know?",
    is_time_gated: false,
    pages: [
      { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/realistic%20islamic%20book%20library%20horizontal%20light?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# What is Truth? How Do We Know?" },
        { id: genId(), type: 'text', content: "**Goal:** Understand the Islamic approach to knowledge and truth, and the sources of certainty." },
        { id: genId(), type: 'text', content: "### Key Questions\n• What is truth and can we know it?\n• What are the sources of knowledge in Islam?\n• How does reason, revelation, and senses work together?" },
        { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 30 minutes" },
        { id: genId(), type: 'text', content: "### Key Terms\n• **Haqq** – truth, reality.\n• **‘Ilm** – knowledge.\n• **Wahy** – divine revelation.\n• **‘Aql** – intellect, reason." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/QuestForTruth" } },
        { id: genId(), type: 'text', content: "**Hamza Yusuf – \"The Quest for Truth\"**\nLecture discussing the search for truth and how Islam integrates reason, revelation, and spiritual insight." }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Islam affirms that truth exists and is knowable.\n• Main sources of knowledge: Senses, Reason, Revelation, and Fitrah.\n• Revelation is the ultimate source of certainty about metaphysical realities.\n• Truth is one; reason and revelation do not conflict when properly understood." },
        { id: genId(), type: 'text', content: "### Deeper Explanation\nIn a world of relativism, many question whether absolute truth exists. Islam firmly asserts that truth (haqq) is real and comes from Allah, who is Al-Haqq (The Truth). The Quran says, \"And say, 'Truth has come, and falsehood has perished.'\" (17:81).\n\nThe senses give us information about the physical world. Reason allows us to process that information. But there are realities beyond the physical – God, angels, the Hereafter – which cannot be accessed by senses alone. For these, we need revelation. Revelation is not irrational; it is supra‑rational." },
        { id: genId(), type: 'quran', content: { reference: "Surah Al-Isra 17:81", translation: "And say, 'Truth has come, and falsehood has perished. Indeed, falsehood is ever bound to perish.'" } },
        { id: genId(), type: 'hadith', content: { reference: "Ibn Majah", translation: "Seeking knowledge is an obligation upon every Muslim." } },
        { id: genId(), type: 'text', content: "### Key Takeaways\n1. Truth exists and is knowable.\n2. Revelation is the ultimate source of certainty concerning the unseen." }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. Have you ever struggled with the question of whether absolute truth exists? What did you conclude?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. How do you typically decide what is true?" } },
        { id: genId(), type: 'reflection', content: { prompt: "3. List one area of knowledge you would like to pursue to strengthen your faith." } }
      ]},
      { page_number: 5, page_type: 'knowledge_check', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Knowledge Check" },
        { id: genId(), type: 'quiz', content: { question: "Which of the following is NOT a source of knowledge in Islam?", options: ["Senses", "Reason", "Dreams only", "Revelation"], correctIndex: 2 } },
        { id: genId(), type: 'quiz', content: { question: "The first word revealed in the Quran was \"Iqra,\" which means:", options: ["Pray", "Read", "Believe"], correctIndex: 1 } }
      ]}
    ]
  },
  
  // 1.5 Is There a God? The Human Intuition
  {
    title: "Lesson 1.5: Is There a God? The Human Intuition",
    pages: [
      { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/stars%20desert%20night%20sky%20universe%20horizontal?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# Is There a God? The Human Intuition" },
        { id: genId(), type: 'text', content: "**Goal:** Explore the natural human inclination to believe in a Creator and the rational arguments for God’s existence." },
        { id: genId(), type: 'text', content: "### Key Questions\n• What is the fitrah’s role in belief in God?\n• What are some simple rational arguments for God’s existence?\n• How does the Quran present the signs of God in creation?" },
        { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 30 minutes" },
        { id: genId(), type: 'text', content: "### Key Terms\n• **Fitrah** – innate disposition to believe.\n• **Dalil** – proof, evidence.\n• **Ayat** – signs (in universe and Quran)." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/SignsOfGod" } },
        { id: genId(), type: 'text', content: "**Mufti Menk – \"Signs of God\"**\nTalk on the beauty and order of the universe pointing to the Creator." }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Belief in God is natural (fitrah).\n• Complex design implies a Designer.\n• The moral conscience suggests a transcendent source.\n• Quran invites reflection on nature as signs (ayat)." },
        { id: genId(), type: 'text', content: "### Deeper Explanation\nEvery human is born with innate awareness of God (fitrah). Intuition with rational arguments (teleological) point to design. The Bedouin replied with: \"The camel's dung indicates the camel... the universe with signs indicates the All-Hearing.\"" },
        { id: genId(), type: 'quran', content: { reference: "Surah Ar-Rum 30:30", translation: "So direct your face toward the religion... [Adhere to] the fitrah of Allah." } },
        { id: genId(), type: 'hadith', content: { reference: "Bukhari", translation: "Every child is born upon the fitrah..." } }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. Think of a moment in your life when you felt awe at nature. What did it reveal about a possible Creator?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. The fitrah is like a compass. Describe your pull toward God." } },
        { id: genId(), type: 'reflection', content: { prompt: "3. Write a short prayer expressing your desire to know the truth about Him." } }
      ]},
      { page_number: 5, page_type: 'knowledge_check', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Knowledge Check" },
        { id: genId(), type: 'quiz', content: { question: "The fitrah refers to:", options: ["The ability to memorize Quran", "Innate human nature inclined to believe in God", "A type of prayer"], correctIndex: 1 } },
        { id: genId(), type: 'quiz', content: { question: "Which argument for God's existence points to order and design in the universe?", options: ["Cosmological", "Teleological", "Moral"], correctIndex: 1 } }
      ]}
    ]
  },

  // 1.6 Why Do People Believe Differently?
  {
    title: "Lesson 1.6: Why Do People Believe Differently?",
    pages: [
      { page_number: 1, page_type: 'overview', completion_required: true, content: [
        { id: genId(), type: 'image', content: { url: "https://image.pollinations.ai/prompt/diverse%20group%20walking%20scenic%20pathway%20horizontal?width=1200&height=600&nologo=true" } },
        { id: genId(), type: 'text', content: "# Why Do People Believe Differently?" },
        { id: genId(), type: 'text', content: "**Goal:** Understand factors leading people to different religious beliefs, and the Islamic perspective on religious diversity." },
        { id: genId(), type: 'text', content: "### Key Questions\n• Why are there so many religions?\n• How does Islam view other faiths?\n• What is the role of culture and upbringing in belief?" },
        { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 30 minutes" },
        { id: genId(), type: 'text', content: "### Key Terms\n• **Taqlid** – blind following of ancestors.\n• **Hidayah** – divine guidance." }
      ]},
      { page_number: 2, page_type: 'video', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Core Video" },
        { id: genId(), type: 'video', content: { url: "https://www.youtube.com/embed/DiversityOfBelief" } },
        { id: genId(), type: 'text', content: "**Yasir Qadhi – \"Why Are There So Many Religions?\"**\nLecture explaining religious diversity from fitrah obstruction and historical framing." }
      ]},
      { page_number: 3, page_type: 'companion_guide', completion_required: true, content: [
        { id: genId(), type: 'text', content: "### Summary of Key Points\n• Environment can obscure fitrah.\n• Original prophet messages were altered with time.\n• Diversity is part of divine wisdom and test.\n• Engagement with other faiths should be done kindly." },
        { id: genId(), type: 'text', content: "### Deeper Explanation\nIslam points to historical corruption of scripts and societal pressure. Treaties in Medina prove tolerance. Engaging means preaching wise guidelines gentle way." },
        { id: genId(), type: 'quran', content: { reference: "Surah Al-Baqarah 2:256", translation: "There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong." } },
        { id: genId(), type: 'hadith', content: { reference: "Bukhari, 3443", translation: "The prophets are like brothers from one father; their mothers are different, but their religion is one." } }
      ]},
      { page_number: 4, page_type: 'reflection_journal', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. What factors (family, culture, personal experience) most shaped your beliefs?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. How does holding the principle that there is no compulsion in religion affect you?" } }
      ]},
      { page_number: 5, page_type: 'knowledge_check', completion_required: true, content: [
        { id: genId(), type: 'text', content: "## Knowledge Check" },
        { id: genId(), type: 'quiz', content: { question: "What does fitrah mean in the context of children?", options: ["Born with potential for God", "Born sinless", "All of the above"], correctIndex: 2 } },
        { id: genId(), type: 'quiz', content: { question: "What is the Islamic ruling on forcing someone to convert?", options: ["It is allowed", "It is forbidden", "It is recommended"], correctIndex: 1 } }
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
        const dbIndex = i + 3; // 1.4 maps to index 3
        const targetLesson = dbLessons[dbIndex];
        const newContentData = { page_count: 5, is_time_gated: false, pages: lessonData.pages };

        await supabase.from('course_lessons').update({ title: lessonData.title, content_data: newContentData }).eq('id', targetLesson.id);
        console.log(`✅ Loaded ${lessonData.title} completely into DB.`);
    }
}

start();
