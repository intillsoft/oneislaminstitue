/**
 * SEED_COURSE_1_WEEK_2_ELITE — Foundations of Faith
 * PART 1: MODULE 6 (Logical Proofs of God)
 * 25-Block Benchmark Implementation
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const id = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;

async function seedModule6Elite() {
  console.log('\n============================================');
  console.log('ELITE SEEDING — Module 6: Logical Proofs of God');
  console.log('============================================\n');

  const { data: course } = await supabase.from('jobs').select('id').ilike('title', '%Foundations of Faith%').single();
  if (!course) { console.error('❌ Course not found'); return; }

  const { data: module } = await supabase.from('course_modules').select('id').eq('course_id', course.id).eq('sort_order', 6).single();
  if (!module) { console.error('❌ Module 6 not found'); return; }

  const lessons = [
    {
      title: "The Cosmological Argument",
      blocks: [
        { type: 'objectives', content: { items: ["Analyze the logical necessity of a first cause.", "Distinguish between temporal and ontological cosmological arguments.", "Evaluate the problem of infinite regress.", "Integrate Al-Ghazali’s Kalam argument into modern physics."] } },
        { type: 'concept', content: { translation: "If contingent reality exists, it is rational to ask for an ultimate explanation beyond the chain of dependent causes.", arabic: "الدليل الكوني" } },
        { type: 'text', content: "### The Human Quest for Origin\nEvery human culture has asked: 'Why is there something rather than nothing?' The Cosmological Argument is not just one proof, but a family of arguments that infer from the existence of the universe to a necessary cause." },
        { type: 'text', content: "### The Principle of Sufficient Reason (PSR)\nThe foundation of this argument is the PSR: for every fact, there must be an explanation for why that fact is so. If the universe is a 'fact', it requires an explanation that is not itself part of the universe." },
        { type: 'infographic', content: { layout: 'process', items: [{ title: 'Contingency', description: 'Everything depends on something else.' }, { title: 'Dependency', description: 'A chain of dependencies cannot be infinite.' }, { title: 'Necessity', description: 'There must be an independent anchor.' }] } },
        { type: 'text', content: "### Al-Ghazali and the Kalam Argument\nAl-Ghazali argued that an actual infinite cannot exist in the real world. If the past was infinite, we would never have reached 'today'. Therefore, the universe must have had a beginning, and everything that begins requires a Beginner." },
        { type: 'text', content: "### The Regress Problem\nCritics often ask: 'Who created God?' This is a category mistake. The argument doesn't say 'Everything has a cause,' but 'Everything that *begins* or is *dependent* has a cause.' A Necessary Being, by definition, has no beginning." },
        { type: 'callout', content: "Steelmann Objection: If an infinite regress of numbers is possible in math, why not in reality? Response: Mathematical 'infinity' is an abstract concept; physical infinite causes lead to logical absurdities like the 'Hilbert's Hotel' paradox.", author: "Intellectual Rigor" },
        { type: 'quran', content: { translation: "Or were they created by nothing, or were they the creators [of themselves]?", arabic: "أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ" } },
        { type: 'hadith', content: { translation: "The Prophet ﷺ said: 'People will keep asking questions until they say: Allah created the creation, but who created Allah? If anyone finds themselves in that state, let them seek refuge in Allah and stop.'", arabic: "لَا يَزَالُ النَّاسُ يَتَسَاءَلُونَ..." } },
        { type: 'text', content: "### Historical Context: Ibn Sina’s Wajib al-Wujud\nIbn Sina (Avicenna) took a different approach. He argued that even if the universe was eternal, it would still be *contingent*. It needs a 'Necessary Being' (Wajib al-Wujud) to sustain its existence at every moment." },
        { type: 'text', content: "### Evidence Weighing\nThis is metaphysical reasoning. It seeks 'Explanatory Adequacy'. While it doesn't give us a physical laboratory finding, it provides the only logical alternative to Nihilism." },
        { type: 'reflection', content: { translation: "Look at a simple object like a cup. It exists because of clay, fire, and a potter. Now look at the ocean. Now look at the stars. Where does the dependency end for you?", arabic: "تفكر في الخلق" } },
        { type: 'text', content: "### The 'Explanatory Terminus'\nIn logic, we must reach a terminus. If the explanation for the universe is 'another universe', we have merely moved the question back. We must reach a cause that is simple, necessary, and independent." },
        { type: 'callout', content: "Practice Session: Create a Premise Audit. Write down 'Whatever begins to exist has a cause'. Now try to imagine a world where things pop into existence with zero cause. Does that world look like ours?", author: "Elite Practice" },
        { type: 'text', content: "### Modern Physics and the Big Bang\nWhile the Kalam argument is logical, modern cosmology (The Big Bang) provides empirical support for the universe having a temporal beginning, matching the Prophetic account." },
        { type: 'infographic', content: { layout: 'grid', items: [{ title: 'Deductive', description: 'Must be true if premises are.' }, { title: 'Abductive', description: 'Best explanation for the data.' }] } },
        { type: 'text', content: "### The Attribute of Will\nBecause the creator chose to bring the universe into existence at a specific moment, this cause must possess 'Will'. This moves us from an abstract force to a Personal God." },
        { type: 'reflection', content: { translation: "Reflect on the word 'Necessary'. If God were not 'Necessary', would anything at all be possible? Or would we have an endless void?", arabic: "الواجب الوجود" } },
        { type: 'text', content: "### Interconnectedness\nThis lesson anchors our faith in reason. It ensures that our worship is not based on blind following (Taqlid) but on intellectual certainty (Yaqeen)." },
        { type: 'callout', content: "Mastery Task: Explain the difference between a 'First Cause' (Time) and a 'Necessary Being' (Ontology) to someone who doesn't believe.", author: "Leadership Task" },
        { type: 'conclusion', content: "The Cosmological Argument isn't just a puzzle; it's a mirror. It shows us that we are dependent, and invites us to connect with the One who is Independent." },
        { type: 'video', content: { url: "https://www.youtube.com/watch?v=yWwOimr2D38" } },
        { type: 'quiz', content: { question: "What is the heart of the Principle of Sufficient Reason?", options: ["Everything is a dream", "Every fact requires an explanation", "Facts are irrelevant", "Everything is random"], correctIndex: 1, hint: "PSR" } },
        { type: 'quiz', content: { question: "What did Al-Ghazali argue about an infinite past?", options: ["It is possible", "It leads to logical absurdities", "It is only for prophets", "Science likes it"], correctIndex: 1, hint: "Hilbert's Hotel" } },
        { type: 'quiz', content: { question: "A Necessary Being is one that...", options: ["Might exist", "Could not-exist", "Cannot NOT-exist", "Wants to exist"], correctIndex: 2, hint: "Ibn Sina's definition" } }
      ]
    },
    {
      title: "The Design Argument",
      blocks: [
        { type: 'objectives', content: { items: ["Identify 'Design Signals' in nature.", "Analyze Fine-Tuning as a modern designer-inference.", "Contrast Teleological arguments with simple probability.", "Evaluate the Multi-verse objection."] } },
        { type: 'concept', content: { translation: "Apparent order and purposive structure in nature can legitimately prompt design inferences, but the strength of the inference depends on which “design signal” is being used.", arabic: "دليل الإتقان" } },
        { type: 'text', content: "### The Recognition of Mind\nWhen we see a coded software, we don't ask if wind blew it into existence. We recognize the signature of a mind. The Design Argument applies this same logic to the biological and physical world." },
        { type: 'text', content: "### Traces of Operation\nTeleological reasoning is about identifying 'traces of the operation of a mind'. This is not just 'complexity', but 'specified complexity'—complexity that serves a clear, life-permitting purpose." },
        { type: 'infographic', content: { layout: 'grid', items: [{ title: 'Complexity', description: 'Random piles have complexity.' }, { title: 'Order', description: 'Repeating patterns (snowflakes).' }, { title: 'Design', description: 'Functional, coded complexity.' }] } },
        { type: 'text', content: "### Fine-Tuning: The Goldilocks Universe\nModern physics shows that constants like gravity and electromagnetism exist within extremely narrow ranges. If they were off by a hair's breadth, stars wouldn't form and life would be impossible." },
        { type: 'text', content: "### Probability vs Inference\nThe SEP frames this as 'Inference to Best Explanation'. While the probability of a life-permitting universe is near zero, the existence of a Designer makes that outcome 100% expected." },
        { type: 'callout', content: "Steelman Objection: The 'Multiverse' says if there are infinite universes, one *must* look like ours by chance. Response: There is zero evidence for other universes, making it an act of blind faith to avoid the Designers conclusion.", author: "Debate Brief" },
        { type: 'quran', content: { translation: "Indeed, in the creation of the heavens and the earth... are signs for a people who use reason. (Surah Al-Baqarah 2:164)", arabic: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ..." } },
        { type: 'hadith', content: { translation: "The Prophet ﷺ used to look at the sky and recite: 'Our Lord, You did not create all this in vain.'", arabic: "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا" } },
        { type: 'text', content: "### The Concept of 'Ayat'\nIn Islam, nature is not a machine, but a book. Every physical law is an 'Ayat' (Sign) pointing to the 'Muqaddir' (Determiner/Designer)." },
        { type: 'text', content: "### Evidence Weighing\nWe weigh this lesson against the 'Probabilistic Objection'. If you don't believe in a designer, the existence of life is a miracle of luck. If you do, it is a masterpiece of intent." },
        { type: 'reflection', content: { translation: "Compare a snowflake (symmetry) with a DNA strand (code). Which one requires a more intelligent explanation? Why?", arabic: "آيات الله" } },
        { type: 'text', content: "### The 'Old Watchmaker' Fallacy\nCritics often attack Paley's 18th-century watch analogy. However, modern fine-tuning is far more robust because it deals with the laws of physics themselves, not just biological parts." },
        { type: 'callout', content: "Practice Session: Case Study. Examine a coded software program. List the features that prove it was written. Now apply that list to the human eye. Where does the logic fail? Or does it hold?", author: "Elite Case Study" },
        { type: 'text', content: "### Beyond 'God of the Gaps'\nWe don't use 'Design' to fill gaps in our science. We use 'Design' to explain why science works in the first place—why the universe follows laws at all." },
        { type: 'infographic', content: { layout: 'process', items: [{ title: 'Information', description: 'Coded blueprints (DNA).' }, { title: 'Function', description: 'Purposeful systems (Vision).' }, { title: 'Designer', description: 'The only logical source.' }] } },
        { type: 'text', content: "### The Aesthetic Argument\nDesign is not just about function; it's about beauty. Why is the sunset beautiful? Why is music moving? A purposeful creator explains beauty; blind evolution does not." },
        { type: 'reflection', content: { translation: "Do you ever feel like the world 'fits' together? How does that feeling connect to your belief in a merciful designer?", arabic: "الإتقان في الخلق" } },
        { type: 'text', content: "### Interconnectedness\nThe Design argument connects the 'Necessary Being' from Lesson 1 to an 'Intelligent Provider'. It adds character to the First Cause." },
        { type: 'callout', content: "Mastery Task: Define 'Specfied Complexity' in two sentences. Why is it different from a random pile of rocks?", author: "Definition Task" },
        { type: 'conclusion', content: "The universe is not silent; it is singing. It is a symphony written by a composer whose intent is reflected in every pixel of reality." },
        { type: 'video', content: { url: "https://www.youtube.com/watch?v=EE76nwierT0" } },
        { type: 'quiz', content: { question: "What is 'fine-tuning' and how does it relate to physical laws?", options: ["Adjusting a radio", "Parameters being in a narrow life-permitting range", "Changing the weather", "None"], correctIndex: 1, hint: "Goldilocks" } },
        { type: 'quiz', content: { question: "Why is the Multiverse theory often seen as an 'escape'?", options: ["It provides proof", "It creates an infinite lottery to avoid a designer", "It makes religion easier", "None"], correctIndex: 1, hint: "Infinite chances" } },
        { type: 'quiz', content: { question: "What is the difference between an 'Ayat' and a 'Fact'?", options: ["No difference", "An Ayat is a fact with a message/direction", "Facts are longer", "None"], correctIndex: 1, hint: "A Sign" } }
      ]
    },
    // Adding more lessons follows the same pattern to hit the 25-block mark.
  ];

  // We loop and update the first two lessons as a proof of depth before continuing.
  for (const lessonData of lessons) {
    process.stdout.write(`💎 Updating Lesson: "${lessonData.title}" (25+ Blocks)... `);
    
    // Find identifying lesson
    const { data: lesson } = await supabase.from('course_lessons')
      .select('id')
      .eq('module_id', module.id)
      .eq('title', lessonData.title)
      .single();

    if (!lesson) { console.log('❌ Not found'); continue; }

    // Transform blocks with unique IDs
    const finalBlocks = lessonData.blocks.map((b, idx) => ({
      id: id(),
      type: b.type,
      order: idx,
      content: b.content
    }));

    const { error: updateErr } = await supabase.from('course_lessons')
      .update({ content_blocks: finalBlocks, duration_minutes: 30 })
      .eq('id', lesson.id);

    if (updateErr) console.log(`❌ ${updateErr.message}`);
    else console.log('✅ ELITE');
  }
}

seedModule6Elite().catch(e => { console.error('Fatal:', e); process.exit(1); });
