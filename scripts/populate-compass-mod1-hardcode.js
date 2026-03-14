import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genId = () => `blk_${Date.now()}_${Math.floor(Math.random() * 99999)}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function generateStandardLesson(title, goal, imagePrompt, videoUrl, guideSummary, quranRef, hadithRef) {
  return [
    {
      page_number: 1, page_type: 'overview', completion_required: true,
      content: [
        { id: genId(), type: 'image', content: { url: imagePrompt } },
        { id: genId(), type: 'text', content: `# ${title}` },
        { id: genId(), type: 'text', content: `**Goal:** ${goal}` },
        { id: genId(), type: 'text', content: "### Time Estimate\n⏱️ 25 minutes" }
      ]
    },
    {
      page_number: 2, page_type: 'video', completion_required: true,
      content: [
        { id: genId(), type: 'text', content: `## Core Teaching on ${title}` },
        { id: genId(), type: 'video', content: { url: videoUrl } }
      ]
    },
    {
      page_number: 3, page_type: 'companion_guide', completion_required: true,
      content: [
        { id: genId(), type: 'text', content: `### Summary\n${guideSummary}` },
        { id: genId(), type: 'quran', content: quranRef },
        { id: genId(), type: 'hadith', content: hadithRef },
        { id: genId(), type: 'document', content: { title: "Full Guide PDF", description: "Download for offline study.", url: "#", platform: "PDF" } }
      ]
    },
    {
      page_number: 4, page_type: 'reflection_journal', completion_required: true,
      content: [
        { id: genId(), type: 'text', content: "## Reflection Journal" },
        { id: genId(), type: 'reflection', content: { prompt: "1. What resonated with you most in this lesson?" } },
        { id: genId(), type: 'reflection', content: { prompt: "2. How does this reality change your perspective?" } },
        { id: genId(), type: 'reflection', content: { prompt: "3. What is one action you can take based on this?" } },
        { id: genId(), type: 'reflection', content: { prompt: "4. What doubts do you still have?" } },
        { id: genId(), type: 'reflection', content: { prompt: "5. Write a short prayer related to this." } }
      ]
    },
    {
      page_number: 5, page_type: 'knowledge_check', completion_required: true,
      content: [
        { id: genId(), type: 'text', content: "## Knowledge Check" },
        { id: genId(), type: 'quiz', content: { question: "Did you watch the core video?", options: ["Yes", "No", "Skimmed", "Skip"], correctIndex: 0 } },
        { id: genId(), type: 'quiz', content: { question: "Did you read the guide material?", options: ["Yes", "No", "Skimmed", "Skip"], correctIndex: 0 } },
        { id: genId(), type: 'quiz', content: { question: "Is this concept clear to you?", options: ["Yes", "Mostly", "Working on it", "No"], correctIndex: 0 } },
        { id: genId(), type: 'quiz', content: { question: "Did you fill your reflection journal?", options: ["Yes", "No", "Halfway", "Skip"], correctIndex: 0 } },
        { id: genId(), type: 'quiz', content: { question: "Are you ready for the next section?", options: ["Yes", "Reviewing", "Not yet", "Need help"], correctIndex: 0 } }
      ]
    }
  ];
}

const lessonsText = [
  // 1.4: What is Truth? How Do We Know?
  generateStandardLesson(
    "What is Truth? How Do We Know?", 
    "Explore the epistemological foundations of Islam—how we determine what is objectively true.",
    "https://image.pollinations.ai/prompt/realistic%20islamic%20book%20library%20horizontal%20light?width=1200&height=600&nologo=true",
    "https://www.youtube.com/embed/Q0A2v3f6vYw",
    "Truth is not subjective. Islam establishes truth through intellect (Aql), pure human nature (Fitrah), and Divine Revelation (Wahy).",
    { reference: "Surah Al-Isra [17:81]", translation: "And say: 'Truth has (now) arrived, and Falsehood perished...'", arabic: "وَقُلْ جَآءَ ٱلْحَقُّ وَزَهَقَ ٱلْبَـٰطِلُ" },
    { reference: "Sahih Muslim", translation: "He who seeks a path to knowledge, Allah makes easy for him a path to Paradise.", arabic: "" }
  ),
  // 1.5: Is There a God? The Human Intuition
  generateStandardLesson(
    "Is There a God? The Human Intuition", 
    "Examine the rational and intuitive arguments for the existence of a Creator.",
    "https://image.pollinations.ai/prompt/realistic%20milky%20way%20stars%20desert%20horizontal?width=1200&height=600&nologo=true",
    "https://www.youtube.com/embed/q6C_G8E38xU",
    "The universe's intricate design, fine-tuning, and the human innate disposition inherently point toward a Singular, Supreme Creator.",
    { reference: "Surah At-Tur [52:35]", translation: "Or were they created by nothing, or were they the creators [of themselves]?", arabic: "أَمْ خُلِقُوا۟ مِنْ غَيْرِ شَىْءٍ أَمْ هُمُ ٱلْخَـٰلِقُونَ" },
    { reference: "Sahih Bukhari", translation: "Every soul is born upon the Fitrah...", arabic: "" }
  ),
  // 1.6: Why Do People Believe Differently?
  generateStandardLesson(
    "Why Do People Believe Differently?", 
    "Understand the diversity of human belief systems and the concept of free will and guided choice.",
    "https://image.pollinations.ai/prompt/realistic%20diverse%20group%20walking%20path%20horizontal?width=1200&height=600&nologo=true",
    "https://www.youtube.com/embed/1B4t1cE3Xow",
    "God gave mankind intellect and free will, meaning differences in belief are natural outcomes of human choice and environmental factors.",
    { reference: "Surah Yunus [10:99]", translation: "And had your Lord willed, those on earth would have believed - all of them entirely...", arabic: "وَلَوْ شَآءَ رَبُّكَ لَءَامَنَ مَن فِى ٱلْأَرْضِ كُلُّهُمْ جَمِيعًا" },
    { reference: "Sahih Muslim", translation: "Religion is sincerity...", arabic: "" }
  ),
  // 1.7: What is Success in This Life?
  generateStandardLesson(
    "What is Success in This Life?", 
    "Redefine success away from modern materialism toward the eternal paradigm of Islam.",
    "https://image.pollinations.ai/prompt/realistic%20sunrise%20over%20ocean%20horizontal?width=1200&height=600&nologo=true",
    "https://www.youtube.com/embed/T6k6JpWkP-g",
    "True success (Falah) is achieving the pleasure of God and peace of mind in this world, leading to eternal bliss in the Hereafter.",
    { reference: "Surah Al-A'la [87:14]", translation: "He has certainly succeeded who purifies himself.", arabic: "قَدْ أَفْلَحَ مَن تَزَكَّىٰ" },
    { reference: "Sahih Muslim", translation: "Richness does not lie in the abundance of (worldly) goods, but richness is the richness of the soul.", arabic: "" }
  ),
  // 1.8: What Happens After Death?
  generateStandardLesson(
    "What Happens After Death?", 
    "Delve deeper into the stages of the Barzakh and the promise of the Resurrection and accounting.",
    "https://image.pollinations.ai/prompt/realistic%20white%20light%20clouds%20horizontal?width=1200&height=600&nologo=true",
    "https://www.youtube.com/embed/5D2eH45W4H0",
    "Death is not the termination of existence, but a transition into the realm of Barzakh where souls await the Day of Judgment.",
    { reference: "Surah Al-Baqarah [2:156]", translation: "Indeed we belong to Allah, and indeed to Him we will return.", arabic: "إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ" },
    { reference: "Musnad Ahmad", translation: "When a believer is about to leave this world... angels with white faces come down to him...", arabic: "" }
  ),
  // 1.9: How Do I Find Answers?
  generateStandardLesson(
    "How Do I Find Answers?", 
    "A guide on how to approach learning, asking questions, and seeking authentic knowledge as a Muslim.",
    "https://image.pollinations.ai/prompt/realistic%20mosque%20courtyard%20reading%20horizontal?width=1200&height=600&nologo=true",
    "https://www.youtube.com/embed/Q0A2v3f6vYw",
    "Knowledge must be sought sincerely from authentic sources, verifying information, and honoring the scholars of the tradition.",
    { reference: "Surah An-Nahl [16:43]", translation: "So ask the people of the message if you do not know.", arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ" },
    { reference: "Sunan Ibn Majah", translation: "Seeking knowledge is a duty upon every Muslim.", arabic: "" }
  )
];

async function start() {
    const titlesWeWant = [
        "Lesson 1.4: What is Truth? How Do We Know?",
        "Lesson 1.5: Is There a God? The Human Intuition",
        "Lesson 1.6: Why Do People Believe Differently?",
        "Lesson 1.7: What is Success in This Life?",
        "Lesson 1.8: What Happens After Death?",
        "Lesson 1.9: How Do I Find Answers?"
    ];

    const { data: courses } = await supabase.from('jobs').select('id, title').eq('status', 'published');
    const compass = courses.find(c => c.title.includes('The Compass'));
    
    const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', compass.id).order('sort_order');
    const mod1Id = modules[0].id;

    const { data: dbLessons } = await supabase.from('course_lessons').select('id, sort_order').eq('module_id', mod1Id).order('sort_order');

    for (let i = 0; i < 6; i++) {
        // Lessons 4 to 9 map to indexes 3 to 8 in dbLessons
        const sortedLesson = dbLessons[i+3];
        const intendedTitle = titlesWeWant[i];
        const targetPages = lessonsText[i];
        
        console.log(`Writing: ${intendedTitle}`);

        const newContentData = { page_count: 5, is_time_gated: false, pages: targetPages };
        
        const { error } = await supabase.from('course_lessons').update({
            title: intendedTitle,
            content_data: newContentData
        }).eq('id', sortedLesson.id);
        
        if (error) console.error(error);
        else console.log(`✅ Saved ${intendedTitle} to DB.`);
    }
}

start();
