const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const lessonId = '42ab766d-1a0d-48d7-98c1-42dcd9240ab9'; 
    
    const pages = [
      {
         "page_number": 1,
         "title": "Lesson Overview",
         "content": [
           {
              "id": "l15_p1_all",
              "type": "text",
              "content": "**Goal:** To explore the natural human inclination to believe in a Creator, examine the rational arguments for God's existence, and understand how the fitrah serves as an inner compass pointing toward the Divine.\n\n### Key Questions:\n- What is the fitrah and how does it point to God?\n- What are the main rational arguments for God's existence?\n- How does the Quran present signs of God in creation?\n- Why do some people deny God despite this intuition?\n- How can we strengthen our certainty in God's existence?\n\n**Time Estimate:** 40 minutes\n\n### Key Terms:\n- **Fitrah** – The innate, natural disposition to believe in God and recognize truth.\n- **Dalil** – Proof, evidence.\n- **Ayat** – Signs (in the universe and in the Quran).\n- **Tawheed** – The oneness of God.\n- **Khaliq** – The Creator.\n- **Nidham** – Order, design.\n- **Sabab** – Cause.\n- **Ghayb** – The unseen.\n- **Yaqin** – Certainty.\n- **Shirk** – Associating partners with God.\n"
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
              "url": "https://youtu.be/_U2a4dd3uno?si=1utv354dLUEDeuV6",
              "layoutSettings": { "width": "100%" }
           },
           {
              "id": "l15_p2_all",
              "type": "text",
              "content": "### Mufti Menk – \"Signs of God in the Universe\"\n\n**Video Description:**\nIn this inspiring talk, Mufti Menk takes us on a journey through the natural world, showing how every aspect of creation points to the existence of a wise and powerful Creator. He discusses the fitrah, the order of the universe, and the inner peace that comes with belief.\n\n**Video Chapters:**\n- 0:00 – Introduction: The universal search for God\n- 4:20 – The fitrah: Born with belief\n- 9:15 – The order of the universe: A design requires a Designer\n- 15:40 – The complexity of life: Signs in our own bodies\n- 22:10 – The moral argument: Why we know right from wrong\n- 28:30 – Why some deny God: The veil over the fitrah\n- 34:45 – Strengthening your certainty\n- 40:00 – Conclusion and du'a\n"
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
              "content": "### Summary of Key Points\n\n- Every human is born with a fitrah – an innate awareness of God.\n- The universe displays overwhelming order, design, and fine‑tuning, pointing to a Creator.\n- Our own existence, consciousness, and moral sense also point to a transcendent source.\n- The Quran invites us to reflect on \"signs\" (ayat) in creation as evidence of the Creator.\n- While the fitrah is natural, it can be obscured by environment, culture, and personal choices.\n- Certainty in God grows through reflection, study, and sincere seeking.\n- Rational arguments (cosmological, teleological, moral) support the intuitive knowledge of God.\n\n---\n\n## Deeper Explanation\n\n**The Fitrah – The Innate Compass**\n"
           },
           {
              "id": "l15_p3_hadith_1",
              "type": "hadith",
              "translation": "\"Every child is born upon the fitrah, then his parents make him a Jew, a Christian, or a Magian.\"",
              "arabic": "مَا مِنْ مَوْلُودٍ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ، فَأَبَوَاهُ يُهَوِّدَانِهِ أَوْ يُنَصِّرَانِهِ أَوْ يُمَجِّسَانِهِ"
           },
           {
              "id": "l15_p3_fitrah_desc",
              "type": "text",
              "content": "Fitrah is the original, uncorrupted state in which humans are created – a pure nature that inclines toward belief in one God and moral goodness. It is like a compass that, when not tampered with, points to true north.\n\nThis innate disposition explains why children naturally ask \"Who made the sky?\" and why even atheists in moments of extreme distress often cry out to a higher power. The fitrah is a direct witness to God within every soul. Allah says:\n"
           },
           {
              "id": "l15_p3_quran_1",
              "type": "quran",
              "translation": "\"So direct your face toward the religion, inclining to truth. [Adhere to] the fitrah of Allah upon which He has created [all] people. No change should there be in the creation of Allah.\"",
              "arabic": "فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا ۚ لَا تَبْدِيلَ لِخَلْقِ اللَّهِ"
           },
           {
              "id": "l15_p3_fitrah_end",
              "type": "text",
              "content": "However, the fitrah can be covered by layers of conditioning, culture, and sin – like a mirror covered with dust. When that dust is wiped away, the original reflection reappears.\n\n**The Argument from Design (Teleological Argument)**\n\nImagine walking in a desert and finding a watch on the ground. You would never assume it came together by chance; its intricate parts, working together to tell time, demand a watchmaker. The universe is infinitely more complex than any watch. From the spiral galaxies to the double‑helix of DNA, from the precise tilt of the earth to the constants of physics, everything points to intentional design.\n\nThe Quran draws attention to this:\n"
           },
           {
              "id": "l15_p3_quran_2",
              "type": "quran",
              "translation": "\"Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.\"",
              "arabic": "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ"
           },
           {
              "id": "l15_p3_design_end",
              "type": "text",
              "content": "The word \"signs\" (ayat) is the same used for verses of the Quran – creation itself is a book of signs pointing to its Author.\n\n**The Cosmological Argument**\n\nEverything that begins to exist has a cause. The universe began to exist (scientific evidence points to a beginning – the Big Bang). Therefore, the universe has a cause. That cause must be eternal, powerful, and beyond the universe – what we call God.\n\nThe Quran presents this argument succinctly:\n"
           },
           {
              "id": "l15_p3_quran_3",
              "type": "quran",
              "translation": "\"Were they created by nothing, or were they the creators [of themselves]? Or did they create the heavens and the earth? Rather, they are not certain.\"",
              "arabic": "أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ، أَمْ خَلَقُوا السَّمَاوَاتِ وَالْأَرْضَ ۚ بَل لَّا يُوقِنُونَ"
           },
           {
              "id": "l15_p3_cosmo_end",
              "type": "text",
              "content": "Either the universe came from nothing (impossible), or it created itself (absurd), or it has a Creator.\n\n**The Moral Argument**\n\nHumans have an innate sense of right and wrong. We believe that torturing children for fun is wrong, not just a matter of opinion. This objective morality cannot be explained by evolution alone; it points to a transcendent Moral Lawgiver. Allah describes this internal witness:\n"
           },
           {
              "id": "l15_p3_quran_4",
              "type": "quran",
              "translation": "\"And [by] the soul and He who proportioned it, and inspired it [with discernment of] its wickedness and its righteousness.\"",
              "arabic": "وَنَفْسٍ وَمَا سَوَّاهَا، فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا"
           },
           {
              "id": "l15_p3_moral_end",
              "type": "text",
              "content": "**Why Do Some Deny God?**\n\nDespite the clear signs, some people reject belief in God. The Quran explains several reasons:\n- **Arrogance and pride:** \"They denied them, although their souls were convinced thereof, out of injustice and haughtiness.\"\n- **Blind following:** \"Indeed, they found their fathers astray, so they hasten in their footsteps.\"\n- **Love of this world:** \"But you prefer the worldly life, while the Hereafter is better and more enduring.\"\n- **Sins clouding the heart:** \"No! Rather, the stain has covered their hearts of that which they were earning.\"\n\n**Strengthening Your Certainty**\n\nThe believer's certainty in God grows through:\n- Reflecting on nature and one's own body\n- Studying the Quran with its descriptions of creation\n- Reading the stories of prophets and their struggles\n- Making du'a for guidance and certainty\n- Surrounding oneself with righteous people\n- Removing distractions that harden the heart\n"
           },
           {
              "id": "l15_p3_quran_list_header",
              "type": "text",
              "content": "---\n## Supplemental Quranic Verses\n"
           },
           {
              "id": "l15_p3_quran_list_1",
              "type": "quran",
              "translation": "\"So direct your face toward the religion, inclining to truth. [Adhere to] the fitrah of Allah upon which He has created [all] people... That is the correct religion, but most of the people do not know.\"",
              "arabic": "فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا ۚ لَا تَبْدِيلَ لِخَلْقِ اللَّهِ ۚ ذَٰلِكَ الدِّينُ الْقَيِّمُ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ"
           },
           {
              "id": "l15_p3_quran_list_2",
              "type": "quran",
              "translation": "\"Indeed, in the creation of the heavens and the earth, and the alternation of the night and the day, and the [great] ships which sail through the sea... are signs for a people who use reason.\"",
              "arabic": "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ وَالْفُلْكِ الَّتِي تَجْرِي فِي الْبَحْرِ بِمَا يَنفَعُ النَّاسَ"
           },
           {
              "id": "l15_p3_quran_list_3",
              "type": "quran",
              "translation": "\"We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth.\"",
              "arabic": "سُنَرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ"
           },
           {
              "id": "l15_p3_quran_list_4",
              "type": "quran",
              "translation": "\"And on the earth are signs for the certain [in faith], and in yourselves. Then will you not see?\"",
              "arabic": "وَفِي الْأَرْضِ آيَاتٌ لِّلْمُوقِنِينَ، وَفِي أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ"
           },
           {
              "id": "l15_p3_quran_list_5",
              "type": "quran",
              "translation": "\"Then is He who creates like one who does not create? So will you not be reminded?\"",
              "arabic": "أَفَمَنْ يَخْلُقُ كَمَنْ لَّا يَخْلُقُ ۗ أَفَلَا تَذَكَّرُونَ"
           },
           {
              "id": "l15_p3_hadith_list_header",
              "type": "text",
              "content": "---\n## Supplemental Hadith References\n"
           },
           {
              "id": "l15_p3_hadith_list_1",
              "type": "hadith",
              "translation": "\"Every child is born upon the fitrah; his parents make him a Jew, a Christian, or a Magian.\"",
              "arabic": "مَا مِنْ مَوْلُودٍ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ، فَأَبَوَاهُ يُهَوِّدَانِهِ أَوْ يُنَصِّرَانِهِ أَوْ يُمَجِّسَانِهِ"
           },
           {
              "id": "l15_p3_hadith_list_2",
              "type": "hadith",
              "translation": "From Abu Hurairah: The Messenger of Allah said: \"There is no child born except that he is born upon the fitrah.\"",
              "arabic": "عَنْ أَبِي هُرَيْرَةَ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَا مِنْ مَوْلُودٍ إِلَّا يُولَدُ عَلَى الْفِطْرَةِ"
           },
           {
              "id": "l15_p3_hadith_list_3",
              "type": "hadith",
              "translation": "\"The strong believer is better and more beloved to Allah than the weak believer, but there is good in both.\"",
              "arabic": "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ"
           },
           {
              "id": "l15_p3_hadith_list_4",
              "type": "hadith",
              "translation": "\"Indeed, Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.\"",
              "arabic": "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ"
           },
           {
              "id": "l15_p3_stories_all",
              "type": "text",
              "content": "---\n## Stories and Examples\n\n**The Bedouin and the Camel**\n\nA Bedouin was once asked how he knew God existed. He replied: \"The camel's dung indicates the camel; footprints indicate the traveler. So the heavens with their stars, the earth with its mountains and valleys, and the oceans with their waves – do they not indicate the All‑Hearing, All‑Seeing?\" This simple analogy captures the argument from design.\n\n**The Story of Prophet Ibrahim (Abraham) Seeking God**\n\nProphet Ibrahim (peace be upon him) grew up in a society that worshipped idols. He used his reason to question this practice. The Quran narrates:\n\n> *\"فَلَمَّا جَنَّ عَلَيْهِ اللَّيْلُ رَأَىٰ كَوْكَبًا ۖ قَالَ هَـٰذَا رَبِّي ۖ فَلَمَّا أَفَلَ قَالَ لَا أُحِبُّ الْآفِلِينَ\"*\n> \"When the night covered him, he saw a star. He said, 'This is my lord.' But when it set, he said, 'I like not those that set.'\" (Quran 6:76)\n\nHe then observed the moon and the sun, each setting. He concluded that the true Lord is the One who never sets, the Creator of all.\n\n**The Astronaut's Testimony**\n\nMany astronauts, upon seeing the earth from space, have reported profound spiritual experiences. Soviet cosmonaut Alexei Leonov said, \"The Earth was small, light blue, and so touchingly alone. I felt a sudden overwhelming sense of awe and a conviction that there must be a Creator.\"\n\n**The Story of Abu Jahl's Admission**\n\nEven the staunchest enemies of the Prophet acknowledged a supreme Creator. Abu Jahl, when asked if he believed Muhammad was truthful, said: \"We know he is truthful, but we follow the ways of our fathers.\"\n\n**The Fine‑Tuning of the Universe**\n\nScientists have discovered that the constants of physics are precisely set to allow life. If gravity were slightly stronger, the universe would collapse. This fine‑tuning points to intentional design.\n\n--- \n\n### Key Takeaways\n\n1. **Fitrah is your inner compass.** You were born with an innate awareness of God.\n2. **Creation points to the Creator.** The universe is full of signs.\n3. **Rational arguments support faith.**\n4. **Denial often stems from the heart, not the mind.**\n5. **Certainty grows with reflection.**\n6. **Your body is a sign.**\n7. **Ask Allah for guidance.**\n\n--- \n\n### Vocabulary\n\n| Term | Definition |\n| :--- | :--- |\n| **Fitrah** | Innate human nature inclined to believe in God and recognize truth. |\n| **Dalil** | Proof, evidence. |\n| **Ayat** | Signs (in creation and revelation). |\n| **Tawheed** | Oneness of God. |\n| **Khaliq** | The Creator. |\n| **Nidham** | Order, design. |\n| **Sabab** | Cause. |\n| **Ghayb** | The unseen. |\n| **Yaqin** | Certainty. |\n| **Shirk** | Associating partners with God. |\n"
           }
         ]
      },
      {
         "page_number": 4,
         "title": "Reflection Journal",
         "content": [
           {
              "id": "l15_p4_all",
              "type": "text",
              "content": "1. **Describe a moment in your life when you felt a strong sense of awe or wonder at nature.** What did that experience make you feel about the possibility of a Creator?\n\n2. **The fitrah is like an inner compass.** Do you feel that compass pointing you toward God? Write about what helps you feel that pull, and what distracts you from it.\n\n3. **Among the arguments for God's existence (design, causality, morality), which one resonates most with you?**\n\n4. **Write a short prayer (du'a) asking Allah to strengthen your certainty and guide you to the truth.** Use your own words or this beautiful du'a from the Quran: \"Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.\" (3:8)\n"
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
              "question": "Which argument for God's existence points to the order and complexity in the universe?",
              "options": ["Cosmological argument", "Teleological (design) argument", "Moral argument", "Ontological argument"],
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
              "question": "What reason does the Quran give for some people denying the truth despite knowing it?",
              "options": ["Lack of intelligence", "Arrogance and injustice", "No message received", "God misled them"],
              "correctIndex": 1
           },
           {
              "id": "qz_15_5",
              "type": "quiz",
              "question": "True or False: The Quran says that signs of God are only found in religious texts.",
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
         console.error('ERROR SEEDING ULTIMATE:', error);
         return;
    }

    console.log('SEED ULTIMATE OK');
}

run();
