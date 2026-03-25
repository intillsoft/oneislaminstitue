const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    // 1. Find exact Lesson ID flawless Node coordinate right now Coordinate flawlessly node 
    const { data: lessonResult } = await supabase
        .from('course_lessons')
        .select('id')
        .or('title.ilike.%1.5%,title.ilike.%Creating%')
        .single();

    let lessonId = '553f2788-3e50-419d-99d3-0b14a84b49e9'; // Fallback node absolute flawless
    const { data: checkAll } = await supabase.from('course_lessons').select('id, title').or('title.ilike.%1.5%,title.ilike.%God%');
    
    if (checkAll && checkAll.length > 0) {
        const found = checkAll.find(l => l.title.includes('1.5') || l.title.toLowerCase().includes('god'));
        if (found) lessonId = found.id;
    }

    console.log(`TARGET LESSON ID: ${lessonId}`);

    const pages = [
      {
         "page_number": 1,
         "title": "Lesson Overview",
         "content": [
           {
              "id": "l15_p1_text",
              "type": "text",
              "content": "**Goal:** To explore the natural human inclination to believe in a Creator, examine the rational arguments for God's existence, and understand how the fitrah serves as an inner compass pointing toward the Divine.\n\n### Key Questions:\n- What is the fitrah and how does it point to God?\n- What are the main rational arguments for God's existence?\n- How does the Quran present signs of God in creation?\n- Why do some people deny God despite this intuition?\n- How can we strengthen our certainty in God's existence?\n\n--- \n\n**Time Estimate:** 40 minutes\n\n### Key Terms:\n- **Fitrah** – Innate natural disposition to believe in God and recognize truth.\n- **Dalil** – Proof, evidence.\n- **Ayat** – Signs (in the universe and in the Quran).\n- **Tawheed** – The oneness of God.\n- **Khaliq** – The Creator.\n- **Nidham** – Order, design.\n- **Sabab** – Cause.\n- **Ghayb** – The unseen.\n- **Yaqin** – Certainty.\n- **Shirk** – Associating partners with God.\n"
           }
         ]
      },
      {
         "page_number": 2,
         "title": "Core Video",
         "content": [
           {
              "id": "l15_p2_video",
              "type": "video",
              "url": "https://youtu.be/_U2a4dd3uno?si=1utv354dLUEDeuV6", // Mufti Menk
              "layoutSettings": { "width": "100%" }
           },
           {
              "id": "l15_p2_desc",
              "type": "text",
              "content": "### Mufti Menk – \"Signs of God in the Universe\"\n\n**Video Description:**\nIn this inspiring talk, Mufti Menk takes us on a journey through the natural world, showing how every aspect of creation points to the existence of a wise and powerful Creator.\n\n**Video Chapters:**\n- 0:00 – Introduction: The universal search for God\n- 4:20 – The fitrah: Born with belief\n- 9:15 – The order of the universe: A design requires a Designer\n- 15:40 – The complexity of life: Signs in our own bodies\n- 22:10 – The moral argument: Why we know right from wrong\n- 28:30 – Why some deny God: The veil over the fitrah\n- 34:45 – Strengthening your certainty\n- 40:00 – Conclusion and du'a\n"
           }
         ]
      },
      {
         "page_number": 3,
         "title": "Companion Guide",
         "content": [
           {
              "id": "l15_p3_intro",
              "type": "text",
              "content": "### Summary of Key Points\n\n- Every human is born with a fitrah – an innate awareness of God.\n- The universe displays overwhelming order, design, and fine‑tuning, pointing to a Creator.\n- Our own existence, consciousness, and moral sense also point to a transcendent source.\n- The Quran invites us to reflect on \"signs\" (ayat) in creation as evidence of the Creator.\n- While the fitrah is natural, it can be obscured by environment, culture, and personal choices.\n- Certainty grows through reflection, study, and sincere seeking.\n\n---\n\n## Deeper Explanation\n\n**The Fitrah – The Innate Compass**\nFitrah is the original, uncorrupted state in which humans are created – a pure nature that inclines toward belief in one God and moral goodness. It is like a compass that, when not tampered with, points to true north.\n"
           },
           {
              "id": "l15_p3_hadith_fitrah",
              "type": "hadith",
              "translation": "\"Every child is born upon the fitrah, then his parents make him a Jew, a Christian, or a Magian.\"",
              "arabic": "مَا مِنْ مَوْلُودٍ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ، فَأَبَوَاهُ يُهَوِّدَانِهِ أَوْ يُنَصِّرَانِهِ أَوْ يُمَجِّسَانِهِ"
           },
           {
              "id": "l15_p3_intro_2",
              "type": "text",
              "content": "This innate disposition explains why children naturally ask \"Who made the sky?\" and why even atheists in moments of extreme distress often cry out to a higher power.\n"
           },
           {
              "id": "l15_p3_quran_fitrah",
              "type": "quran",
              "translation": "\"So direct your face toward the religion, inclining to truth. [Adhere to] the fitrah of Allah upon which He has created [all] people. No change should there be in the creation of Allah.\"",
              "arabic": "فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا ۚ لَا تَبْدِيلَ لِخَلْقِ اللَّهِ"
           },
           {
              "id": "l15_p3_design_intro",
              "type": "text",
              "content": "**The Argument from Design (Teleological Argument)**\n\nImagine walking in a desert and finding a watch. You would never assume it came together by chance; its intricate parts demand a watchmaker. The universe is infinitely more complex than any watch. From spiral galaxies to DNA, everything points to intentional design.\n"
           },
           {
              "id": "l15_p3_quran_design",
              "type": "quran",
              "translation": "\"Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.\"",
              "arabic": "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ"
           },
           {
              "id": "l15_p3_cosmo_intro",
              "type": "text",
              "content": "**The Cosmological Argument**\n\nEverything that begins to exist has a cause. The universe began to exist. Therefore, the universe has a cause. That cause must be eternal, powerful, and beyond the universe – what we call God.\n"
           },
           {
              "id": "l15_p3_quran_cosmo",
              "type": "quran",
              "translation": "\"Were they created by nothing, or were they the creators [of themselves]? Or did they create the heavens and the earth? Rather, they are not certain.\"",
              "arabic": "أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ، أَمْ خَلَقُوا السَّمَاوَاتِ وَالْأَرْضَ ۚ بَل لَّا يُوقِنُونَ"
           },
           {
              "id": "l15_p3_moral_intro",
              "type": "text",
              "content": "**The Moral Argument**\n\nHumans have an innate sense of right and wrong. This objective morality points to a transcendent Moral Lawgiver.\n"
           },
           {
              "id": "l15_p3_quran_moral",
              "type": "quran",
              "translation": "\"And [by] the soul and He who proportioned it, and inspired it [with discernment of] its wickedness and its righteousness.\"",
              "arabic": "وَنَفْسٍ وَمَا سَوَّاهَا، فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا"
           },
           {
              "id": "l15_p3_deny_intro",
              "type": "text",
              "content": "### Why Do Some Deny God?\n\nDespite clear signs, some people reject belief in God. The Quran explains several causes:\n- **Arrogance and pride**\n- **Blind following**\n- **Love of this world**\n- **Sins clouding the heart**\n\n### Strengthening Your Certainty\nThe believer's certainty grows through:\n- Reflecting on nature and one's own body\n- Studying the Quran with its descriptions of creation\n- Making du'a for guidance and certainty\n"
           }
         ]
      },
      {
         "page_number": 4,
         "title": "Reflection Journal",
         "content": [
           {
              "id": "l15_p4_reflect",
              "type": "text",
              "content": "1. **Describe a moment in your life when you felt a strong sense of awe or wonder at nature.** What did that experience make you feel about the possibility of a Creator?\n\n2. **The fitrah is like an inner compass.** Do you feel that compass pointing you toward God? Write about what helps you feel that pull, and what distracts you from it.\n\n3. **Among the arguments for God's existence (design, causality, morality), which one resonates most with you?**\n\n4. **Write a short prayer (du'a) asking Allah to strengthen your certainty.**\n"
           }
         ]
      },
      {
         "page_number": 5,
         "title": "Knowledge Check",
         "content": [
           {
              "id": "qz_15_1",
              "type": "quiz",
              "question": "What is the fitrah?",
              "options": ["Type of prayer", "Innate human disposition to believe in God", "Soul after death", "Holy book"],
              "correctIndex": 1
           },
           {
              "id": "qz_15_2",
              "type": "quiz",
              "question": "Which argument for God's existence points to the order and complexity of light?",
              "options": ["Cosmological", "Teleological (design)", "Moral", "Ontological"],
              "correctIndex": 1
           },
           {
              "id": "qz_15_3",
              "type": "quiz",
              "question": "According to Surah Fussilat 41:53, where will Allah show His signs?",
              "options": ["Only in Quran", "In the horizons and within themselves", "Only in Makkah", "Only in dreams"],
              "correctIndex": 1
           },
           {
              "id": "qz_15_4",
              "type": "quiz",
              "question": "What primary reason does the Quran give for early rejections of truth?",
              "options": ["Lack of intelligence", "Arrogance and injustice", "No message received", "Misguidance"],
              "correctIndex": 1
           },
           {
              "id": "qz_15_5",
              "type": "quiz",
              "question": "True or False: The Quran says signs of God are only found in religious texts.",
              "options": ["True", "False"],
              "correctIndex": 1
           }
         ]
      }
    ];

    const { error } = await supabase
        .from('course_lessons')
        .update({ 
            content_data: { pages: pages },
            content_blocks: [] // Clean fallback stream flawslessly
        })
        .eq('id', lessonId);

    if (error) {
        fs.writeFileSync('seed_outputs.txt', JSON.stringify(error, null, 2), 'utf8');
        return;
    }

    fs.writeFileSync('seed_outputs.txt', 'SEED_OUTPUTS_OK', 'utf8');
    console.log('SEED OVERWRITE OK');
}

run();
