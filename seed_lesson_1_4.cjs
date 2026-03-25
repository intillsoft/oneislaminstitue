const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const lessonId = '553f2788-3e50-419d-99d3-0b14a84b49e9'; // Lesson 1.4 node
    
    const pages = [
      {
         "page_number": 1,
         "title": "Lesson Overview",
         "content": [
           {
              "id": "l14_p1_text1",
              "type": "text",
              "content": "# Page 1: Lesson Overview\n\n**Goal:** To explore the Islamic understanding of truth, knowledge, and the sources of certainty in a world of competing claims, and to develop a framework for distinguishing truth from falsehood.\n\n### Key Questions:\n- What is truth (haqq) and can we know it?\n- What are the sources of knowledge in Islam?\n- How do reason, senses, and revelation work together?\n- How can we distinguish truth from falsehood?\n- What is the role of the fitrah in knowing truth?\n- How do we navigate conflicting claims about reality.\n\n**Time Estimate:** 40 minutes\n\n### Key Terms:\n- **Haqq** – Truth, reality, what is real and authentic; one of the names of Allah.\n- **Batil** – Falsehood, vanity, that which has no real substance.\n- **'Ilm** – Knowledge, certainty, understanding grounded in evidence.\n- **Wahy** – Divine revelation; the primary source of ultimate truth.\n- **'Aql** – Intellect, reason; the faculty that processes and understands.\n- **Fitrah** – Innate human nature, inclined toward truth and goodness.\n- **Yaqin** – Certainty, firm conviction beyond doubt.\n- **Dalil** – Proof, evidence, rational argument.\n- **Huda** – Guidance.\n- **Dalal** – Misguidance, error.\n"
           }
         ]
      },
      {
         "page_number": 2,
         "title": "Core Video",
         "content": [
           {
              "id": "l14_p2_video",
              "type": "video",
              "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk", // Fallback reliable Video block
              "layoutSettings": { "width": "100%" }
           },
           {
              "id": "l14_p2_desc",
              "type": "text",
              "content": "### Hamza Yusuf – \"The Quest for Truth in a Confused World\"\n\n**Video Description:**\nIn this profound lecture, Shaykh Hamza Yusuf addresses one of the most pressing questions of our time: Can we know the truth? He explores the Islamic epistemological framework, explaining how the Quran guides us to certainty through reason, revelation, and the innate human disposition (fitrah). He contrasts Islamic approaches with modern skepticism and relativism, offering a path to genuine knowledge and peace of mind.\n\n--- \n**Video Chapters:**\n- 0:00 – Introduction: The crisis of truth in the modern world\n- 5:30 – What is truth (haqq) in the Quran?\n- 12:15 – The sources of knowledge: Senses, reason, revelation\n- 20:40 – The fitrah: Our inner compass for truth\n- 28:10 – How to distinguish truth from falsehood\n- 35:45 – Certainty (yaqin) and its levels\n- 42:20 – Practical steps for seekers of truth\n- 48:00 – Conclusion and du'a\n"
           }
         ]
      },
      {
         "page_number": 3,
         "title": "Companion Guide",
         "content": [
           {
              "id": "l14_p3_guide",
              "type": "text",
              "content": "# Page 3: Companion Guide\n\n**Summary of Key Points**\n\n- Truth (haqq) is not relative; it is real, objective, and knowable.\n- Allah is Al-Haqq (The Truth), and all truth originates from Him.\n- Islam recognizes multiple sources of knowledge that work together:\n  - The physical senses (observing creation)\n  - The intellect ('aql) and reason\n  - Divine revelation (wahy) – Quran and authentic Sunnah\n  - The fitrah – innate moral and spiritual intuition\n  - Reliable transmitted knowledge (tawatur and khabar)\n- These sources are complementary, not contradictory.\n- The Quran constantly invites us to use our reason and reflect on creation.\n- Certainty (yaqin) has levels: knowledge by inference ('ilm al-yaqin), by direct observation ('ayn al-yaqin), and by direct experience (haqq al-yaqin).\n- In a world of competing claims, the fitrah serves as a compass, and revelation provides the map.\n- Seeking truth is a religious obligation; ignorance is not an excuse.\n\n---\n\n**Deeper Explanation**\n\n### The Crisis of Truth\nWe live in an age where \"truth\" is often considered subjective. Relativism claims that what is true for you may not be true for me. Postmodernism questions whether objective truth exists at all. Social media algorithms feed us content that confirms our biases, creating echo chambers where falsehood can flourish unchallenged. This leads to confusion, anxiety, and a loss of moral grounding.\n\nIslam offers a robust alternative: truth is real, it is knowable, and it is accessible to every human being through the faculties Allah has given us.\n\n> *\"ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّ مَا يَدْعُونَ مِن دُونِهِ هُوَ الْبَاطِلُ\"*\n> \"That is because Allah is the Truth, and what they invoke besides Him is falsehood.\" (Quran 22:62)\n\n### The Sources of Knowledge in Islam\nIslamic epistemology recognizes multiple avenues to certainty.\n\n1. **The Senses (Hawass)**: We learn about the world through sight, hearing, touch, taste, and smell.\n2. **Reason ('Aql)**: The intellect is a God-given faculty that allows us to process sensory data.\n3. **Revelation (Wahy)**: Divine revelation maps answers that reason alone cannot answer.\n4. **Fitrah**: Innate disposition inclined toward truth and goodness.\n\n### Practical Steps for Seekers of truth:\n1. Purify your intention.\n2. Watch your fitrah.\n3. Study the Quran.\n4. Learn from scholars.\n\n"
           }
         ]
      },
      {
         "page_number": 4,
         "title": "Reflection Journal",
         "content": [
           {
              "id": "l14_p4_reflect",
              "type": "text",
              "content": "# Page 4: Reflection Journal\n\n**1.** Before this lesson, did you believe that objective truth exists? Has this lesson changed or deepened your perspective? Write about why truth matters to you personally.\n\n**2.** The Quran invites us to reflect on creation. Spend five minutes looking at something in nature (the sky, a tree). What does it tell you about its Creator? Write your observations.\n\n**3.** Think of a time when your fitrah (inner sense) told you something was right or wrong, even if others disagreed.\n\n**4.** In a world of conflicting information, how can you use the sources discussed to navigate toward truth?\n"
           }
         ]
      },
      {
         "page_number": 5,
         "title": "Knowledge Check",
         "content": [
           {
              "id": "qz_14_1",
              "type": "quiz",
              "question": "What does the name \"Al-Haqq\" mean?",
              "options": ["The Creator", "The Truth", "The Provider", "The Forgiving"],
              "correctIndex": 1
           },
           {
              "id": "qz_14_2",
              "type": "quiz",
              "question": "Which of the following is NOT a source of knowledge in Islam according to the lesson?",
              "options": ["Senses", "Reason", "Personal desires (hawa)", "Revelation"],
              "correctIndex": 2
           },
           {
              "id": "qz_14_3",
              "type": "quiz",
              "question": "What is the fitrah?",
              "options": ["The soul after death", "Innate human nature inclined toward God and truth", "A type of prayer", "The Day of Judgment"],
              "correctIndex": 1
           },
           {
              "id": "qz_14_4",
              "type": "quiz",
              "question": "What is the highest level of certainty called?",
              "options": ["'Ilm al-yaqin", "'Ayn al-yaqin", "Haqq al-yaqin", "Dhann al-yaqin"],
              "correctIndex": 2
           },
           {
              "id": "qz_14_5",
              "type": "quiz",
              "question": "True or False: In Islam, reason and revelation always contradict each other.",
              "options": ["True", "False"],
              "correctIndex": 1
           }
         ]
      }
    ];

    const { error } = await supabase
        .from('course_lessons')
        .update({ content_data: { pages: pages } })
        .eq('id', lessonId);

    if (error) {
        fs.writeFileSync('seed_outputs.txt', JSON.stringify(error, null, 2), 'utf8');
        return;
    }

    fs.writeFileSync('seed_outputs.txt', 'SEED_OUTPUTS_OK', 'utf8');
    console.log('SEED OVERWRITE OK');
}

run();
