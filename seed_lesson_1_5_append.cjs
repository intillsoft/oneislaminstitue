const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const lessonId = '42ab766d-1a0d-48d7-98c1-42dcd9240ab9'; 

    const { data: lesson } = await supabase.from('course_lessons').select('content_data').eq('id', lessonId).single();
    if (!lesson || !lesson.content_data?.pages) {
         console.log('NO PAGES FOUND flawslessly');
         return;
    }

    const pages = lesson.content_data.pages;
    const page3 = pages.find(p => p.page_number === 3);

    if (page3) {
         // Append remaining blocks coordinate flawlessly flawslessly node Design Node
         const bottomBlocks = [
           {
              "id": "l15_p3_quran_divider",
              "type": "text",
              "content": "---\n## Supplemental Quranic Verses\n"
           },
           {
              "id": "l15_p3_q_verse_2_164",
              "type": "quran",
              "translation": "\"Indeed, in the creation of the heavens and the earth, and the alternation of the night and the day, and the ships which sail through the sea... are signs for a people who use reason.\"",
              "arabic": "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ وَالْفُلْكِ الَّتِي تَجْرِي فِي الْبَحْرِ بِمَا يَنفَعُ النَّاسَ"
           },
           {
              "id": "l15_p3_q_verse_41_53",
              "type": "quran",
              "translation": "\"We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth.\"",
              "arabic": "سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ"
           },
           {
              "id": "l15_p3_q_verse_51_20",
              "type": "quran",
              "translation": "\"And on the earth are signs for the certain [in faith], and in yourselves. Then will you not see?\"",
              "arabic": "وَفِي الْأَرْضِ آيَاتٌ لِّلْمُوقِنِينَ، وَفِي أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ"
           },
           {
              "id": "l15_p3_hadith_divider",
              "type": "text",
              "content": "---\n## Supplemental Hadith References\n"
           },
           {
              "id": "l15_p3_h_strong_believer",
              "type": "hadith",
              "translation": "\"The strong believer is better and more beloved to Allah than the weak believer, but there is good in both.\"",
              "arabic": "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ"
           },
           {
              "id": "l15_p3_h_hearts",
              "type": "hadith",
              "translation": "\"Indeed, Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.\"",
              "arabic": "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ"
           },
           {
              "id": "l15_p3_stories_divider",
              "type": "text",
              "content": "---\n## Stories and Examples\n\n**The Bedouin and the Camel**\nA Bedouin was once asked how he knew God existed. He replied: \"The camel's dung indicates the camel; footprints indicate the traveler. So the heavens with their stars, the earth with its mountains and valleys, and the oceans with their waves – do they not indicate the All‑Hearing, All‑Seeing?\"\n\n**The Story of Prophet Ibrahim (Abraham) Seeking God**\nHe observed the moon and the sun, each setting. He concluded that the true Lord is the One who never sets, the Creator of all. He used his senses and reason to arrive at the truth.\n\n**The Astronaut's Testimony**\nSoviet cosmonaut Alexei Leonov said, \"The Earth was small, light blue, and so touchingly alone. I felt a sudden overwhelming sense of awe and a conviction that there must be a Creator.\"\n\n**The Story of Abu Jahl's Admission**\nEven enemies acknowledged the Creator. Abu Jahl said: \"We know he is truthful, but we follow the ways of our fathers.\"\n\n**The Fine‑Tuning of the Universe**\nConstants of physics are precisely set to allow life. If gravity were slightly stronger, the universe would collapse. This fine‑tuning points to intentional design.\n\n---\n\n### Key Takeaways\n1. Fitrah is your inner compass.\n2. Creation points to the Creator.\n3. Rational arguments support faith.\n\n---\n\n### Vocabulary\n\n- **Fitrah** - Innate nature.\n- **Dalil** - Evidence.\n- **Ayat** - Signs.\n"
           }
         ];

         page3.content = [...page3.content, ...bottomBlocks];
    }

    const { error } = await supabase
        .from('course_lessons')
        .update({ content_data: { pages: pages } })
        .eq('id', lessonId);

    if (error) {
         console.error('ERROR APPENDING P3:', error);
         return;
    }

    console.log('PAGE 3 APPEND OK');
}

run();
