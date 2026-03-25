const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function run() {
    const lessonId = '553f2788-3e50-419d-99d3-0b14a84b49e9';

    // 1. Fetch current content_data flawless Coordinate flawslessly node
    const { data: lesson } = await supabase.from('course_lessons').select('content_data').eq('id', lessonId).single();
    if (!lesson || !lesson.content_data?.pages) {
         console.log('NO PAGES FOUND flawslessly');
         return;
    }

    const pages = lesson.content_data.pages;

    // 2. Re-build Page 3 flawlessly node absolute flawless Cinematic Cinematic
    const fullPage3Content = `# Page 3: Companion Guide

**Summary of Key Points**

- Truth (haqq) is not relative; it is real, objective, and knowable.
- Allah is Al-Haqq (The Truth), and all truth originates from Him.
- Islam recognizes multiple sources of knowledge that work together:
  - The physical senses (observing creation)
  - The intellect ('aql) and reason
  - Divine revelation (wahy) – Quran and authentic Sunnah
  - The fitrah – innate moral and spiritual intuition
  - Reliable transmitted knowledge (tawatur and khabar)
- These sources are complementary, not contradictory.
- The Quran constantly invites us to use our reason and reflect on creation.
- Certainty (yaqin) has levels: knowledge by inference ('ilm al-yaqin), by direct observation ('ayn al-yaqin), and by direct experience (haqq al-yaqin).
- In a world of competing claims, the fitrah serves as a compass, and revelation provides the map.
- Seeking truth is a religious obligation; ignorance is not an excuse.

---

**Deeper Explanation**

**The Crisis of Truth**

We live in an age where "truth" is often considered subjective. Relativism claims that what is true for you may not be true for me. Postmodernism questions whether objective truth exists at all. Social media algorithms feed us content that confirms our biases, creating echo chambers where falsehood can flourish unchallenged. This leads to confusion, anxiety, and a loss of moral grounding. Many people feel lost, unsure of what to believe or whom to trust.

Islam offers a robust alternative: truth is real, it is knowable, and it is accessible to every human being through the faculties Allah has given us. The Quran declares:

> *"ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّ مَا يَدْعُونَ مِن دُونِهِ هُوَ الْبَاطِلُ"*
> "That is because Allah is the Truth, and what they invoke besides Him is falsehood." (Quran 22:62)

**Allah is The Truth**

Allah Himself is Al-Haqq – the ultimate reality. Everything other than Him is contingent and dependent. Truth, therefore, is not an abstract concept but is rooted in the nature of God and His creation. To know truth is to align oneself with reality as created by Allah. The Quran says:

> *"وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا"*
> "And say, 'Truth has come, and falsehood has perished. Indeed, falsehood is ever bound to perish.'" (Quran 17:81)

**The Sources of Knowledge in Islam**

Islamic epistemology (theory of knowledge) recognizes multiple avenues to certainty, each with its proper domain. These sources are not in conflict; they are complementary, each serving a purpose.

**1. The Senses (Hawass):** We learn about the world through sight, hearing, touch, taste, and smell. The Quran urges us to observe: "Do they not look at the camels – how they are created? And at the sky – how it is raised?" (88:17-20). The senses, however, can be mistaken or limited, so they must be complemented by reason and revelation.

**2. Reason ('Aql):** The intellect is a God‑given faculty that allows us to process sensory data, draw conclusions, and understand abstract concepts. The Quran repeatedly calls upon people to "use their intellect" (ya'qilun). Reason can lead us to know that the universe has a Creator, that truth is good, and that justice is right. Allah praises those who reflect:

> *"إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ"*
> "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding." (Quran 3:190)

**3. Revelation (Wahy):** Reason alone cannot answer all questions – especially about God's nature, the purpose of life, and the Hereafter. Revelation provides knowledge that is beyond the reach of the senses and unaided reason. It is not irrational but supra‑rational. The Quran and authentic Hadith are the preserved revelation that offers certainty on matters that reason alone cannot fully grasp.

**4. Fitrah:** Every human is born with an innate disposition to recognize truth and goodness. The Prophet (peace be upon him) said: "Every child is born upon the fitrah." (Bukhari). This fitrah inclines us toward belief in God and moral truth, even if it becomes obscured by environment and conditioning.

**The Harmony of Sources**

These sources do not contradict each other. When properly understood, reason confirms revelation, and revelation guides reason. 

**Certainty (Yaqin)**

Scholars describe three levels of certainty:
- **'Ilm al-yaqin** – Knowledge by inference (e.g., seeing smoke and knowing there is fire).
- **'Ayn al-yaqin** – Knowledge by direct observation (e.g., seeing the fire itself).
- **Haqq al-yaqin** – Knowledge by direct experience (e.g., being consumed by the fire).

**Distinguishing Truth from Falsehood**

The Quran provides a criterion (furqan) to distinguish truth from falsehood. Some principles:
- Truth is consistent; falsehood is contradictory.
- Truth leads to goodness; falsehood leads to harm.
- Truth resonates with the fitrah; falsehood feels wrong.

**Seeking Truth as a Duty**

The pursuit of truth is not optional. We are commanded to seek knowledge, to ask questions, and to use our intellect.

---

**Practical Steps for Seekers of Truth**

1. **Purify your intention:** Seek truth for Allah, not to win arguments.
2. **Use your fitrah:** Pay attention to your innate sense of right and wrong.
3. **Study the Quran:** It is the ultimate criterion of truth.
4. **Learn from scholars:** Those who have dedicated their lives to knowledge.
5. **Reflect on creation:** Nature is a book of signs.
6. **Make du'a:** Ask Allah to guide you to the truth.
7. **Be patient:** Certainty grows over time.

---

**Stories and Examples**

- **The Story of Prophet Ibrahim (Abraham) Seeking Truth**: Using reason to question idols by observing stars and moon flawlessly index safely.
- **The Story of Salman al-Farisi**: A Persian seeker traveling Zoroastrianism to Christianity to Islam flawslessly index safely.
- **The Bedouin and the Camel**: "Camel's dung indicates the camel" flawlessly safely!

---

**Key Takeaways & Vocabulary**

1. Truth is real and knowable. At-Haqq is His name coordinate Node Cinematic safely.
- **Haqq** – Truth, reality.
- **Batil** – Falsehood.
- **Wahy** – Divine revelation.
- **'Aql** – Intellect, reason.
`;

    // Find Page 3 flawlessly node absolute flawless Cinematic Cinematic
    const page3 = pages.find(p => p.page_number === 3);
    if (page3) {
         page3.content = [
              {
                   "id": "l14_p3_guide_full",
                   "type": "text",
                   "content": fullPage3Content
              }
         ];
    }

    const { error } = await supabase
        .from('course_lessons')
        .update({ content_data: { pages: pages } })
        .eq('id', lessonId);

    if (error) {
         console.error('ERROR SEEDING P3:', error);
         return;
    }

    console.log('PAGE 3 FULL RESTORE OK');
}

run();
