/**
 * SEED_COURSE_1_WEEK_2 — Foundations of Faith
 * Implements "Elite Flow" architecture for Modules 6-10.
 * 
 * Includes: Anchor, Core Map, Evidence Weighing, Objections & Steelman, 
 * Integration, Practice, and Mastery Checks.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const COURSE_TITLE = 'Foundations of Faith';

// Helpers to build block IDs
const id = () => `blk_${Date.now()}_${Math.floor(Math.random() * 999999)}`;

async function seedWeek2() {
  console.log('\n============================================');
  console.log('SEEDING WEEK 2 — Intellectual Anchors');
  console.log('============================================\n');

  // 1. Find Course
  const { data: course, error: findErr } = await supabase
    .from('jobs')
    .select('id, title')
    .ilike('title', 'Foundations of Faith')
    .single();

  if (findErr || !course) { 
    console.error('❌ Course "Foundations of Faith" not found. Error:', findErr?.message); 
    const { data: all } = await supabase.from('jobs').select('title').limit(5);
    console.log('Available similar courses:', all?.map(a=>a.title));
    return; 
  }

  // 2. Fetch Modules for Week 2 (Sort Order 6 to 10)
  const { data: modules } = await supabase.from('course_modules')
    .select('id, title, sort_order')
    .eq('course_id', course.id)
    .gte('sort_order', 6)
    .lte('sort_order', 10)
    .order('sort_order', { ascending: true });

  if (!modules || modules.length === 0) { console.error('❌ Modules 6-10 not found'); return; }

  const contentMap = {
    // MODULE 6: Logical Proofs of God
    6: {
      lessons: [
        {
          title: "The Cosmological Argument",
          anchor: "If contingent reality exists, it is rational to ask for an ultimate explanation beyond the chain of dependent causes.",
          coreMap: "Cosmological arguments infer from features of the cosmos (existence, causation, dependency, change) to a foundational explanation (first cause, necessary being, sustaining cause). The Stanford overview emphasises that “cosmological argument” names a type of argument, not one single syllogism.",
          evidence: "This is primarily metaphysical reasoning: it seeks explanatory adequacy for why anything exists and why dependent beings exist at all, rather than a laboratory finding.",
          objections: "A major challenge is whether an infinite regress of causes is possible, and whether positing God merely “moves the question back” (why God?). The SEP entry highlights how different versions respond differently (e.g., by arguing that the explanatory terminus is not just “first in time,” but “necessary” or “non-dependent”).",
          integration: "The SEP notes that classical kalām thinkers such as al-Ghazali argued that the world’s temporal phenomena cannot regress infinitely and therefore require a beginning and a cause.",
          practice: "Write a two-column “premise audit”: Column A lists the argument’s premises; Column B states what would need to be true for each premise to fail (e.g., “actual infinites are possible,” “causation is illusory,” “the universe is necessary”).",
          quizzes: [
            { q: "Explain the difference between “first cause” and “necessary being.”", o: ["First cause is temporal, necessary being is ontological", "They are identical", "First cause is social, necessary is physical", "Necessary being is a choice"], a: 0 },
            { q: "Identify one cosmological argument that depends on temporal beginning and one that does not.", o: ["Kalam; Leibnizian", "Design; Moral", "Evolution; Big Bang", "None"], a: 0 }
          ]
        },
        {
          title: "The Design Argument",
          anchor: "Apparent order and purposive structure in nature can legitimately prompt design inferences, but the strength of the inference depends on which “design signal” is being used.",
          coreMap: "Teleological arguments range from classical analogies (artefacts imply designers) to modern fine-tuning arguments (life-permitting ranges of physical parameters). The SEP entry frames teleological reasoning as identifying “traces of the operation of a mind” in natural structures.",
          evidence: "Fine-tuning, as analysed in SEP, concerns parameter sensitivity: a model is “fine-tuned” when it yields life-permitting phenomena only within extremely narrow parameter ranges.",
          objections: "A significant critique is probabilistic: if we cannot justify probability assignments over possible universes, then “improbability” claims may be unstable. A well-known philosophical critique targets exactly these probability moves.",
          integration: "Islamic philosophy includes arguments from providence and order; the broader Islamic tradition also treats nature as āyāt (signs), encouraging reflection on creation.",
          practice: "Analyse two case studies: A) a snowflake’s symmetry; B) a coded software programme. Articulate which features are (and are not) legitimate “design indicators” and why.",
          quizzes: [
            { q: "Distinguish “argument from complexity” from “argument from fine-tuning.”", o: ["Complexity looks at parts; fine-tuning looks at physical laws", "They are the same", "One is for plants, one for stars", "None"], a: 0 },
            { q: "Name one strong objection to fine-tuning arguments that is not simply “evolution explains it.”", o: ["The Multiverse hypothesis", "It's too simple", "It is illegal", "None"], a: 0 }
          ]
        },
        {
          title: "The Moral Argument",
          anchor: "If objective moral obligations are real (not merely preferences), it is rational to ask what grounds their authority.",
          coreMap: "Moral arguments are a “family” of arguments from moral facts, moral experience, or moral knowledge to God (often as a morally perfect source or ground). The SEP entry emphasises their diversity and links their assessment to core issues in metaethics.",
          evidence: "This lesson relies on moral phenomenology (“some acts really are wrong”) plus metaethical reasoning (what makes them wrong, and why moral duties have a binding “ought”).",
          objections: "A central fork is the Euthyphro-style worry: are acts good because God commands them, or does God command them because they are good? Moral arguments must clarify whether God is the cause of morality, the knower of morality, or the ground of moral value in divine nature.",
          integration: "kalām schools historically discussed reason’s capacity to know moral truths and the relation between divine command and human moral judgement, with differing emphases among theological traditions.",
          practice: "Build a three-layer “moral grounding stack”: (1) moral facts; (2) moral authority; (3) moral accountability (linking forward to the afterlife module).",
          quizzes: [
            { q: "Define “objective moral duty” in one sentence.", o: ["A duty that is true regardless of human opinion", "A personal preference", "A law made by the state", "A cultural habit"], a: 0 },
            { q: "Give one theistic account of moral realism.", o: ["Morality is grounded in Divine Nature", "Morality is a myth", "Morality is evolved instinct", "None"], a: 0 }
          ]
        },
        {
          title: "The Argument from Contingency",
          anchor: "Even if the universe had no beginning, the existence of contingent reality still calls for an explanation in terms of a necessary being.",
          coreMap: "Contingency arguments focus on dependence: contingent beings do not contain the reason for their existence within themselves. The SEP cosmological entry explicitly distinguishes a “deductive argument from contingency.”",
          evidence: "The argument is not mainly about time but about ontological dependence (what must be true for contingent existence to be intelligible).",
          objections: "Critics challenge whether “the whole set of contingent things” needs an explanation beyond its members, and whether “necessary being” is coherent.",
          integration: "Ibn Sina held that metaphysics (not physics) must establish a First Principle and developed influential reasoning around necessary versus contingent existence.",
          practice: "Rewrite the contingency argument in two forms: a) a strict syllogism; b) an “inference to best explanation” version. Compare which is easier to challenge and why.",
          quizzes: [
            { q: "Explain why contingency arguments remain relevant even if the universe is eternal.", o: ["They deal with dependence, not birth", "They don't", "Because atoms are old", "None"], a: 0 },
            { q: "What is a 'contingent' being?", o: ["A being that could not-exist", "A being that must exist", "A human", "An angel"], a: 0 }
          ]
        },
        {
          title: "The Argument from Consciousness",
          anchor: "Conscious experience and intentionality raise deep explanatory questions that some philosophers argue are evidence for theism (or at least against simple reductive accounts).",
          coreMap: "The “argument from consciousness” is typically abductive: given consciousness, which worldview better explains it—naturalism, dualism, theism, or some hybrid? The SEP overview presents consciousness as both familiar and theoretically puzzling.",
          evidence: "This lesson requires distinguishing: (1) brain/mental correlations vs (2) why there is “something it is like” to be a subject.",
          objections: "A serious objection is “promissory materialism”: future neuroscience may close the explanatory gap. The argument is framed probabilistically as “substantial evidence.”",
          integration: "Islamic intellectual history includes extensive debate about intellect, soul, and human nature; the key is to avoid “God of the gaps” reasoning while still taking consciousness seriously.",
          practice: "“Worldview scorecard”: compare how four positions explain consciousness (reductive physicalism, nonreductive physicalism, substance dualism, theism) and give one best argument for each.",
          quizzes: [
            { q: "Define “intentionality” in mental states.", o: ["The 'aboutness' of thoughts", "Hard work", "Conscious choice", "None"], a: 0 },
            { q: "Why might consciousness be treated as evidence rather than proof?", o: ["Because it is subjective", "Because it is difficult to measure", "Because it lacks a lab finding", "None"], a: 0 }
          ]
        },
        {
          title: "Refuting Randomness",
          anchor: "“Random” is not a single explanation; it can mean unpredictability, lack of pattern, or objective chance—none of which automatically implies meaninglessness or “no cause.”",
          coreMap: "This lesson corrects a common modern confusion: “random” is often used as a worldview conclusion rather than a carefully defined concept. The SEP entry on chance and randomness explicitly distinguishes kinds of probability.",
          evidence: "Where “randomness” appears in science (e.g., quantum), it is typically embedded inside lawful statistical structure.",
          objections: "A strong objection argues that invoking “design” merely replaces one unknown with another. We target bad inferences (random => no explanation) rather than denying chance processes.",
          integration: "In a theistic frame, “chance” can describe our epistemic situation (what we can predict) without describing ultimate reality exhaustively.",
          practice: "Analyse three statements and label them as (A) scientific, (B) philosophical, or (C) rhetorical: 1. Mutations are random. 2. Therefore life is meaningless. 3. Our model uses random variables.",
          quizzes: [
            { q: "Explain why “unpredictable” does not imply “uncaused.”", o: ["Because we just can't see the causes", "Because everything has a cause", "Because math is hard", "None"], a: 0 },
            { q: "What is 'epistemic' randomness?", o: ["Randomness based on our lack of knowledge", "Physical randomness", "God's choice", "None"], a: 0 }
          ]
        },
        {
            title: "Module 6 Assessment",
            anchor: "Consolidating the cumulative case for Divine Reality through logic.",
            coreMap: "A comprehensive review of deductive and abductive arguments.",
            evidence: "Synthesis of Week 2 Module 1.",
            objections: "Addressing the 'Ultimate Objection' for each argument.",
            integration: "The legacy of the Kalam tradition as an intellectual spine.",
            practice: "Write a 500-word brief defending theism using two arguments of your choice.",
            quizzes: [{q: "What is 'Itqan' in reasoning?", o: ["Excellence and precision", "Speed", "Volume", "None"], a: 0}]
        }
      ]
    },
    // MODULE 7: Islam and science
    7: {
        lessons: [
            {
                title: "What Is Science?",
                anchor: "Science is a disciplined way of building testable explanations and predictions about natural phenomena, not a complete worldview.",
                coreMap: "The National Academies frame science as evidence-based construction of testable explanations and predictions, and as the knowledge generated through that process.",
                evidence: "Science is strongest where hypotheses are testable and where multiple lines of evidence converge; it is weaker where questions are less testable or more value-laden.",
                objections: "A common confusion is to equate “science” with “whatever is true,” but demarcation debates show the difficulty of cleanly separating science from non-science.",
                integration: "A faith-based tradition can embrace scientific methods as a tool for studying the created order while resisting “scientism”.",
                practice: "Design a study question (e.g., “Does sleep affect memory?”) and identify: hypothesis, variables, evidence, and what science cannot say about it.",
                quizzes: [
                    {q: "Give one example of a question that is meaningful but not scientific.", o: ["Is lying morally wrong?", "How fast is light?", "How many cells in a leaf?", "None"], a: 0},
                    {q: "What is the core of scientific method?", o: ["Testability", "Certainty", "Faith", "None"], a: 0}
                ]
            },
            {
                title: "Limits of Scientific Knowledge",
                anchor: "Science is powerful, but it is not epistemically unlimited; evidence can underdetermine theory, and observation is not theory-free.",
                coreMap: "Underdetermination: evidence may be insufficient to determine theory. Theory-ladenness: observation is shaped by frameworks. Demarcation: not everything meaningful is decidable.",
                evidence: "The limit claim is not “science is unreliable,” but “science has a domain.” A mature approach acknowledges limits in inference and interpretation.",
                objections: "Proponents of scientism argue that science will eventually explain everything. We point out metaphysical categories that aren't empirical.",
                integration: "This creates space for revelation and metaphysics without denying science; it prevents treating science as a rival “religion.”",
                practice: "“Domain sorting”: categorise a list of claims (e.g., “the universe began,” “God exists,” “vaccines reduce risk”) into: empirical, philosophy, ethics, or mixed.",
                quizzes: [
                    {q: "Define 'underdetermination'.", o: ["Evidence is insufficient to pick one theory", "Science is wrong", "Science is slow", "None"], a: 0},
                    {q: "What is 'Theory-ladenness'?", o: ["Observation is shaped by prior theory", "Theory is heavy", "Observations are facts", "None"], a: 0}
                ]
            },
            {
                title: "Misconceptions About Islam and Science",
                anchor: "The real tension is rarely “Islam vs science”; it is more often “bad theology vs bad philosophy of science.”",
                coreMap: "Interactions between Islam and the sciences are historically rich; recent scholarship frames these as methodological and hermeneutic questions.",
                evidence: "Historical record (Baghdad, House of Wisdom) vs modern concordist attempts.",
                objections: "Concordism (scripture predicts modern science) can become unstable if science changes. This lesson warns against superficial 'scientific miracles' discourse.",
                integration: "A disciplined approach treats the Qur’an’s primary intent as guidance and signs (ayat), while allowing science to proceed on its own methods.",
                practice: "“Claim audit”: pick a popular “scientific miracle” and test it: Is Arabic meaning stable? Did earlier exegetes read it this way? Is the science settled?",
                quizzes: [
                    {q: "What is 'concordism'?", o: ["Interpreting scripture to fit modern science", "Conflict of interest", "Musical theory", "None"], a: 0},
                    {q: "Name a historical center of Islamic science.", o: ["House of Wisdom", "Oxford", "NASA", "None"], a: 0}
                ]
            },
            {
                title: "Evolution Discussion",
                anchor: "Understanding evolution scientifically and engaging it theologically are distinct tasks; treating them as identical creates unnecessary conflict.",
                coreMap: "The National Academies present evolution as central to modern biological science. Theological claims are assessed through revelation and hermeneutics.",
                evidence: "Scientific claims are assessed through converging evidence; theological through scripture and reasoning.",
                objections: "Fear that evolution implies purposelessness or denies Adamic origins. Sceptics claim evolution implies atheism. A mature framework rejects both leaps.",
                integration: "Contemporary Muslim scholarship frames this as involving methodological and hermeneutic dimensions, not just biological mechanisms.",
                practice: "Seminar on four positions: A) accepted common ancestry; B) broad acceptance with special human origins; C) micro-only; D) rejection. State what evidence changes your mind.",
                quizzes: [
                    {q: "Why does evolution not entail atheism?", o: ["Because science is not metaphysics", "Because evolution is a myth", "Because Darwin was a priest", "None"], a: 0},
                    {q: "What is a 'hermeneutic' question?", o: ["A question of interpretation", "A question of biology", "A question of fossils", "None"], a: 0}
                ]
            },
            {
                title: "Miracles Debate",
                anchor: "Miracles are not “violations of science”; they are claims about events not explicable by natural causes alone, raising questions about testimony and laws.",
                coreMap: "A miracle is an event not explicable by natural causes. Debates center on whether testimony can justify believing such events (Hume's challenge).",
                evidence: "Metaphysical possibility of divine action vs the uniformity of scientific experience.",
                objections: "David Hume argued that testimony is always outweighed by uniform experience. Al-Ghazali rejected strict causal entailment between created causes to protect miracles.",
                integration: "Medieval Islamic theology engaged causation debates to preserve the logical possibility of miracles as reported in scripture.",
                practice: "“Testimony tribunal”: construct a standard for accepting extraordinary testimony and critique it using defeaters (alternative explanation, etc).",
                quizzes: [
                    {q: "How did Al-Ghazali defend miracles?", o: ["Denied necessary causal links between objects", "Said they were magic", "Accepted Hume's view", "None"], a: 0},
                    {q: "Define 'miracle' correctly.", o: ["Event not explicable by natural causes alone", "An impossible event", "A lucky break", "None"], a: 0}
                ]
            },
            {
                title: "Harmony of Revelation and Reason",
                anchor: "Classical Sunni theology treats reason as a tool for recognising God, while revelation guides where reason alone is insufficient or biased.",
                coreMap: "Ash'ari theology supports the use of reason (kalam) to defend faith. Ibn Taymiyya saw revelation as completing and perfecting fitra.",
                evidence: "Historical synthesis of Greek logic and Islamic revelation.",
                objections: "Fideism (ignoring reason) vs Scientism (ignoring revelation). We seek the middle path.",
                integration: "Reason is the judge of the credentials of revelation, but once credentials are established, revelation is the source of knowledge.",
                practice: "Contrast (1) scientism and (2) fideism, then propose a balanced 'Third Path' for a modern student.",
                quizzes: [
                    {q: "Give an example of a claim compatible with but not provable by science.", o: ["The soul exists", "Water is H2O", "Gravity pulls down", "None"], a: 0},
                    {q: "How does Kalam use reason?", o: ["Defensively to protect faith", "To replace the Quran", "As a form of poetry", "None"], a: 0}
                ]
            },
            {
                title: "Module Seven Assessment",
                anchor: "Navigating the intersection of discovery and revelation.",
                coreMap: "Review of science limits, concordism, and the miracles debate.",
                evidence: "Synthesizing Week 2 Module 2.",
                objections: "Analyzing the 'Warfare Thesis' between science and religion.",
                integration: "The legacy of Islamic science as a form of worship.",
                practice: "Submit a 5-minute video presentation on 'Why Science Needs Philosophy'.",
                quizzes: [{q: "What is 'scientism'?", o: ["Belief that only science yields knowledge", "The study of science", "Scientific excellence", "None"], a: 0}]
            }
        ]
    },
    // MODULE 8: Revelation and scripture
    8: {
        lessons: [
            {
                title: "Why Humanity Needs Revelation",
                anchor: "Human reason can reach important truths, but revelation is needed for reliable guidance, correction of bias, and knowledge of the unseen.",
                coreMap: "Revelation complements reason. It addresses 'Existential Decisives' like the afterlife and ultimate accountability which are beyond empirical reach.",
                evidence: "Epistemic humility: cognitivie bias and the underdetermination of metaphysical inquiry require a higher-authority communication.",
                objections: "Secular humanism argues that empathy and reason are enough. We argue they are unstable without a transcendent anchor.",
                integration: "Prophets perfect and complete what the fitra already anticipates.",
                practice: "“Needs list”: Categorise questions as: (A) empirically answerable, (B) value-laden/partly answerable, (C) existentially decisive/non-empirical.",
                quizzes: [
                    {q: "Give a limitation of human reason that makes revelation necessary.", o: ["Cognitive bias and lack of unseen knowledge", "Lack of memory", "Social pressure", "None"], a: 0},
                    {q: "Why isn't 'unprovable by science' the same as 'irrational'?", o: ["Because logic and aesthetics aren't scientific but are rational", "Science is bad", "Atheism is a myth", "None"], a: 0}
                ]
            },
            {
                title: "How Revelation Came",
                anchor: "Islamic tradition holds that the Qur’an was revealed in stages and preserved through both memory and writing in the earliest community.",
                coreMap: "Began in 610. Staged revelation allowed for pedagogical growth and community stabilization.",
                evidence: "Historical-theological: transmitted reports, communal memory, and internal scripture evidence.",
                objections: "Claims of 7th-century orality suggest a later fixity. We point to early scribal markers and memorization traditions.",
                integration: "The 'Staged' nature shows God's mercy in teaching a community gradually.",
                practice: "Create a timeline schematic: revelation -> memorisation/writing -> compilation -> recitations.",
                quizzes: [
                    {q: "When did revelation begin?", o: ["610 AD", "570 AD", "632 AD", "None"], a: 0},
                    {q: "Why was staged revelation important?", o: ["Gradual teaching and community building", "The Prophet was busy", "Paper was expensive", "None"], a: 0}
                ]
            },
            {
                title: "Compilation of the Qur’an",
                anchor: "Early Islamic sources describe a rapid movement from dispersed recordings to compilation under Zayd ibn Thābit and caliphal stewardship.",
                coreMap: "Diverse materials (parchment, bone, date palms) were standardized to avoid community fractures.",
                evidence: "Historiography and tradition: manuscript records + transmitted syntheses.",
                objections: "Academic skeptics once doubted the Uthmanic standardization. Manuscript findings (Birmingham/Sanaa) have shifted the consensus back to an early date.",
                integration: "The preservation effort was a state-level priority to protect the integrity of the Word.",
                practice: "“Claim boundaries”: separate (A) what tradition asserts, (B) what manuscripts show, (C) what is inferred.",
                quizzes: [
                    {q: "Who was the primary scribe of compilation?", o: ["Zayd ibn Thabit", "Abu Bakr", "Ali", "None"], a: 0},
                    {q: "What materials were used for early records?", o: ["Parchment, bone, stone", "Only paper", "Digital folders", "None"], a: 0}
                ]
            },
            {
                title: "Preservation of the Qur’an",
                anchor: "Qur’anic preservation is a multi-layered phenomenon: communal memorisation, textual standardisation, and a verifiable manuscript tradition.",
                coreMap: "Birmingham manuscript (AD 568–645) and Tübingen fragment place text within decades of the Prophet.",
                evidence: "Radiocarbon dating and palaeography. Note: C14 dates parchment, not ink directly (requires codicological judge).",
                objections: "Sanaa palimpsest lower text shows non-standard variants. Integration: this witness confirms early textual history alongside the standardizing effort.",
                integration: "Preservation is both a faith claim and a historical claim that yields evidence.",
                practice: "Commentary using three lenses: (1) devotional, (2) historical evidence, (3) methodological-testing.",
                quizzes: [
                    {q: "What did the Birmingham manuscript prove?", o: ["Text existed close to the Prophet's time", "It was written by Zayd", "Nothing", "None"], a: 0},
                    {q: "What does C14 date?", o: ["The parchment material", "The ink", "The scribe's age", "None"], a: 0}
                ]
            },
            {
                title: "Authenticity of Hadith",
                anchor: "Ḥadīth credibility is assessed through developed sciences of transmission (isnad), narrator evaluation, and textual scrutiny.",
                coreMap: "Hadith is the corpus of Prophetic sayings. Compilation peaked with Bukhari and Muslim.",
                evidence: "Testimony epistemology: criteria for evaluating reports via Isnad chains.",
                objections: "Fabractions and political pressure are the target of the science. Isnad filters for reliability.",
                integration: "Sunni hadith criticism is one of the world's most rigorous testimonial evaluation systems.",
                practice: "“Hadith credibility interview”: test a report for chain continuity, narrator reliability, and textual consistency.",
                quizzes: [
                    {q: "Define 'Isnad'.", o: ["Chain of transmitters", "The text itself", "The reward", "None"], a: 0},
                    {q: "Who is the most famous hadith compiler?", o: ["Al-Bukhari", "Ibn Sina", "Al-Ghazali", "None"], a: 0}
                ]
            },
            {
                title: "Transmission Sciences",
                anchor: "Preservation is institutional: specialised disciplines preserve recitation, reports, and meaning across generations.",
                coreMap: "Codicology, Hadith Science, and Recitation (Tajwid) traditions.",
                evidence: "Institutional testimony functions in religious epistemology.",
                objections: "How do we know the meanings haven't changed? The 'Tawatur' (mass-transmission) standard.",
                integration: "The 'Golden Chain' of knowledge transmission.",
                practice: "Create a “transmission pipeline diagram” showing failure modes (copying errors, etc) and which science fixes them.",
                quizzes: [
                    {q: "What science deals with the physical manuscript?", o: ["Codicology", "Kalam", "Fiqh", "None"], a: 0},
                    {q: "Theological vs Historical claims - can they be both?", o: ["Yes", "No", "Only on Fridays", "None"], a: 0}
                ]
            },
            {
                title: "Module Eight Assessment",
                anchor: "Securing the transmission of the Divine Word.",
                coreMap: "Review of manuscript evidence, compilation history, and hadith sciences.",
                evidence: "Synthesizing Week 2 Module 3.",
                objections: "Addressing Orientalist and Revisionist critiques of early Islam.",
                integration: "The concept of 'Isnad is from the religion'.",
                practice: "Map the journey of a verse from the Prophet's tongue to a modern app.",
                quizzes: [{q: "Why is Isnad important?", o: ["To ensure reliability and source", "For decoration", "To make it longer", "None"], a: 0}]
            }
        ]
    },
    // MODULE 9: Prophethood
    9: {
        lessons: [
            {
                title: "Why Prophets Are Necessary",
                anchor: "Prophets clarify God’s will, guide moral life, and anchor communities in accountable truth—beyond just foretelling.",
                coreMap: "Prophets provide the 'Legislative Guidance' that logic alone cannot provide (e.g., how to worship, details of the soul).",
                evidence: "Functional necessity of embodied exemplars for moral training.",
                objections: "Deism (God exists but doesn't talk). We argue a communicative God is a logical necessity of Mercy.",
                integration: "Prophethood as the bridge between the Infinite and the Finite.",
                practice: "Write a “prophet function list”: moral clarity, social justice, examples, eschatology.",
                quizzes: [
                    {q: "What is the primary role of a prophet?", o: ["Clarifying God's will and moral guidance", "Fortune telling", "Magic", "None"], a: 0},
                    {q: "Why is an 'example' better than just a 'text'?", o: ["Because it shows 'how' to live", "It isn't", "Texts are boring", "None"], a: 0}
                ]
            },
            {
                title: "Characteristics of Prophets",
                anchor: "A prophet’s credibility depends on moral integrity, clarity of message, and consistency between teaching and life.",
                coreMap: "Sidq (Truthfulness), Amanah (Trustworthiness), Tabligh (Delivery), and Fatanah (Wisdom).",
                evidence: "Intertwined nature of trust and message credibility.",
                objections: "Claims of prophets being 'inspired geniuses'. We distinguish between human creativity and Divine Wahy.",
                integration: "The concept of 'Ma'sum' (infallible in delivering the message).",
                practice: "Define a “credibility standard” for a moral guide and compare to Prophetic claims.",
                quizzes: [
                    {q: "What is 'Sidq'?", o: ["Truthfulness", "Power", "Wealth", "None"], a: 0},
                    {q: "Why must a prophet be trustworthy before the message?", o: ["So people believe the report", "It's just a tradition", "No reason", "None"], a: 0}
                ]
            },
            {
                title: "The Finality of Prophet Muhammad ﷺ",
                anchor: "Mainstream Islam understands Muhammad as the final prophet, grounded in Qur’anic 'Seal of the Prophets' and mass-transmitted reports.",
                coreMap: "Quran 33:40 and the closure of legislative revelation.",
                evidence: "Consensus (Ijma) and explicit textual finality.",
                objections: "Minority reinterpretations of 'Seal'. Mainstream ground: closure of divine law.",
                integration: "Guidance continues through scholarship, but revelation is complete.",
                practice: "Build a “finality argument map”: Quranic wording -> reports -> doctrinal implications.",
                quizzes: [
                    {q: "Which verse names Muhammad the 'Seal'?", o: ["33:40", "2:285", "1:1", "None"], a: 0},
                    {q: "What does 'Seal' mean for law?", o: ["No new divine law", "No more religion", "No more kings", "None"], a: 0}
                ]
            },
            {
                title: "Proofs of His Prophethood",
                anchor: "Proofs are cumulative: moral excellence, historical impact, the Qur’an’s inimitability (I'jaz), and miracle claims.",
                coreMap: "Prophethood is verified by character, literary miracle (Quran), and physical signs (Miraj).",
                evidence: "Social-epistemological analysis of testimonial arguments for inimitability.",
                objections: "Claims that 'miracles' are just legends. We point back to the rigour of transmission.",
                integration: "The 'Miracle of the Word' is perpetual, unlike the physical miracles of past prophets.",
                practice: "“Multi-evidence brief”: defend prophethood using Character, Impact, and the Quranic Challenge.",
                quizzes: [
                    {q: "What is 'I'jaz'?", o: ["Inimitability of the Quran", "Quickness", "A type of sword", "None"], a: 0},
                    {q: "Is the character of the Prophet a 'proof'?", o: ["Yes, his known honesty (Al-Amin)", "No", "Maybe", "None"], a: 0}
                ]
            },
            {
                title: "The Sunnah as Guidance",
                anchor: "The Sunnah translates principles into lived practice; hadith serves as the major access point to this legacy.",
                coreMap: "Operationalising revelation. Fulfilling the 'How-To' of the Quran.",
                evidence: "Canonical hadith as meta-guidance.",
                objections: "Quran-only movements. We argue the Quran itself commands following the Prophet.",
                integration: "The Sunnah is the 'Living Quran'.",
                practice: "Pick one theme (honesty) and show it moving from Quranic Principle to Prophetic Practice.",
                quizzes: [
                    {q: "What is the relation of Sunnah to Quran?", o: ["Operationalises and explains it", "Replaces it", "Contradicts it", "None"], a: 0},
                    {q: "Can you understand the Quran fully without Sunnah?", o: ["No, many details like Salah come from Sunnah", "Yes", "Maybe", "None"], a: 0}
                ]
            },
            {
                title: "Following the Prophet in Modern Times",
                anchor: "Following is not imitation without thinking; it is context-aware application of guidance anchored in reliable sources.",
                coreMap: "Principled continuity. Navigating modern dilemmas with Prophetic adab.",
                evidence: "Modern interpretations and context-sensitive application.",
                objections: "Claims that Sunnah is 7th-century specific. We distinguish between 'Form' and 'Function/Principle'.",
                integration: "Lived Islam as the most powerful dawah.",
                practice: "“Modern dilemma lab”: Apply Sunnah to: Social Media ethics, Workplace justice, Family conflict.",
                quizzes: [
                    {q: "How should we apply Sunnah in 2024?", o: ["Principled and context-aware application", "Blind copy-paste", "Ignore it", "None"], a: 0},
                    {q: "What is 'Adab'?", o: ["Prophetic Manners/Etiquette", "A type of book", "Speed", "None"], a: 0}
                ]
            },
            {
                title: "Module Nine Assessment",
                anchor: "Believing in the Messenger as the gate to the Message.",
                coreMap: "Review of prophetic necessity, finality, and proofs.",
                evidence: "Synthesizing Week 2 Module 4.",
                objections: "Address the 'False Prophet' vs 'True Prophet' criteria.",
                integration: "The Prophet ﷺ as the 'Jewel in the Center' of Islamic Life.",
                practice: "Draft a letter to an enquirer explaining why Muhammad ﷺ is a Prophet.",
                quizzes: [{q: "Why is character central to Prophethood?", o: ["Trust builds the bridge for the message", "It isn't", "For fame", "None"], a: 0}]
            }
        ]
    },
    // MODULE 10: The afterlife
    10: {
        lessons: [
            {
                title: "Death and the Grave",
                anchor: "Death is transition, not annihilation; the grave phase involves a moral-spiritual test and questioning.",
                coreMap: "Munkar and Nakir questioning: Who is your Lord? What is your religion? Who is your Prophet?",
                evidence: "Testimony of the Unseen (Ghaib) reported in mass-transmitted (Mutawatir) or sound reports.",
                objections: "Materialism says consciousness stops. We rely on the authority of the Prophet.",
                integration: "Urgency of ethical repair (rights of others) before the transition.",
                practice: "“Grave readiness plan”: Belief clarity, ethical repair, and worship consistency.",
                quizzes: [
                    {q: "Who are the two angels in the grave?", o: ["Munkar and Nakir", "Jibreel and Mikaeel", "Ridwan and Malik", "None"], a: 0},
                    {q: "What are the three questions?", o: ["Lord, Religion, Prophet", "Name, Age, Wealth", "Favorite food, book, place", "None"], a: 0}
                ]
            },
            {
                title: "Barzakh",
                anchor: "Barzakh is the intermediate barrier/state between death and resurrection; a Quranic term for the 'Waiting Room'.",
                coreMap: "Quran 23:100. A moral and physical barrier.",
                evidence: "Lexical and metaphysical meanings of 'barrier' in scripture.",
                objections: "Can we communicate with the dead? Mainstream: No, Barzakh is a one-way barrier.",
                integration: "Reflecting on the 'Dream-like' nature of Barzakh.",
                practice: "Create a “state diagram”: Dunya -> Barzakh -> Resurrection -> Final Abode.",
                quizzes: [
                    {q: "What does 'Barzakh' mean?", o: ["Barrier/Interval", "Victory", "Hell", "None"], a: 0},
                    {q: "Which verse mentions the barrier?", o: ["23:100", "1:1", "114:1", "None"], a: 0}
                ]
            },
            {
                title: "Resurrection",
                anchor: "Resurrection grounds moral seriousness: deeds are not lost; personal identity is restored for final judgement.",
                coreMap: "Quran 36:51. The Trumpet and the rising from the graves (Ba'th).",
                evidence: "Theological necessity for ultimate justice.",
                objections: "How can dust become person again? Quran answers: He who created first can create again.",
                integration: "Accountability for the body and the soul.",
                practice: "“Justice thought experiment”: Evaluation of ultimate justice in an afterlife-less world.",
                quizzes: [
                    {q: "What is 'Ba'th'?", o: ["Resurrection", "Sleeping", "War", "None"], a: 0},
                    {q: "What signal starts the resurrection?", o: ["The Trumpet", "Lightning", "Earthquake", "None"], a: 0}
                ]
            },
            {
                title: "Judgment Day",
                anchor: "The ethical centre: deeds are presented, weighed (Mizan), and accounted for with divine justice and mercy.",
                coreMap: "The Scale (Mizan), the Bridge (Sirat), and the Book of Deeds.",
                evidence: "Creedal vocabulary of Tahawi: reckoning and the Scale.",
                objections: "How can one day be enough for billions? We point to the Divine transcendency over time.",
                integration: "The balance between Hope and Fear at the Scale.",
                practice: "“Deeds portfolio”: Identify vulnerable vs hopeful deeds in your current life.",
                quizzes: [
                    {q: "What is the 'Mizan'?", o: ["The Scale for deeds", "The Bridge", "A sword", "None"], a: 0},
                    {q: "On what basis are people judged?", o: ["Faith and Deeds", "Wealth", "Looks", "None"], a: 0}
                ]
            },
            {
                title: "Paradise",
                anchor: "Paradise is completion of moral meaning: reward, peace, and nearness to God as the fulfilment of faith.",
                coreMap: "Abode of happiness. Jannah as a garden and a state of being.",
                evidence: "Rich scriptural imagery of ultimate reward.",
                objections: "Is it just 'consumerism'? Theology: nearness to God and Divine Pleasure (Ridwan) are the highest rewards.",
                integration: "The end of toil and the beginning of Eternal Peace.",
                practice: "“Paradise maturity check”: Replace consumerist misconceptions with theological meanings (Peace, Presence).",
                quizzes: [
                    {q: "What is the highest reward in Jannah?", o: ["Pleasure of Allah and seeing Him", "Fruit", "Houses", "None"], a: 0},
                    {q: "Does Paradise have sorrow?", o: ["No, it is the abode of peace", "Yes", "Maybe", "None"], a: 0}
                ]
            },
            {
                title: "Hell",
                anchor: "Hell functions as moral warning and manifestation of divine justice; part of a coherent accountability framework.",
                coreMap: "Jahannam. A witness to God's sovereignty and a warning for the definitively unjust.",
                evidence: "Ethical logic: severe injustice requires ultimate consequence.",
                objections: "Infinite punishment for finite sins? Scholars discuss 'essential nature' and divine justice.",
                integration: "Hell is the absence of Mercy for those who refused Mercy.",
                practice: "“Moral logic” exercise: evaluate the 'Moral Universe' without consequence for tyrants.",
                quizzes: [
                    {q: "Why does Hell exist?", o: ["Manifestation of Justice and warning", "For no reason", "God is angry", "None"], a: 0},
                    {q: "What should follow a reminder of Hell?", o: ["Repentance and hope in Mercy", "Despair", "Anger", "None"], a: 0}
                ]
            },
            {
                title: "Week Two Final Assessment",
                anchor: "Completing the intellectual and eschatological journey.",
                coreMap: "Review of all Week 2 content from Logic to Afterlife.",
                evidence: "Cumulative synthesis of Modules 6-10.",
                objections: "Capstone challenge: Reconciling Science/Logic with Revelation.",
                integration: "The 'Whole Muslim' - intellectually sharp and spiritually grounded.",
                practice: "Submit a 1000-word 'Life Manifesto' based on these 35 lessons.",
                quizzes: [{q: "What is the ultimate 'Anchor' of faith?", o: ["Submission to the Truth of Allah", "Logic", "Fear", "None"], a: 0}]
            }
        ]
    }
  };

  for (const mod of modules) {
    const modContent = contentMap[mod.sort_order];
    if (!modContent) continue;

    process.stdout.write(`📚 Updating Module ${mod.sort_order}: "${mod.title}"... `);

    // Fetch lessons for this module
    const { data: lessons } = await supabase.from('course_lessons')
      .select('id, title, sort_order')
      .eq('module_id', mod.id)
      .order('sort_order', { ascending: true });

    if (!lessons) { console.log('❌ No lessons found'); continue; }

    for (let i = 0; i < 7; i++) {
      const lessonMeta = modContent.lessons[i];
      if (!lessonMeta) continue;

      // Find identifying lesson (some titles might be slightly different like "Final Assessment")
      const lesson = lessons[i];
      if (!lesson) continue;

      // Update Title to match user request exactly if needed
      if (lesson.title !== lessonMeta.title) {
          await supabase.from('course_lessons').update({ title: lessonMeta.title }).eq('id', lesson.id);
      }

      const blocks = [
        {
          id: id(), type: 'objectives', order: 0,
          content: {
            items: [
              `Analyze the foundational anchor of "${lessonMeta.title}".`,
              `Evaluate objections and evidence weighing for this topic.`,
              `Integrate this concept into the broader Islamic worldview.`,
              `Practice applying the "Elite Flow" framework to "${lessonMeta.title}".`
            ]
          }
        },
        {
          id: id(), type: 'concept', order: 1,
          content: { translation: lessonMeta.anchor, arabic: "القاعدة الفكرية" }
        },
        {
          id: id(), type: 'text', order: 2,
          content: `### Core Map: The Intellectual Scaffold\n\n${lessonMeta.coreMap}`
        },
        {
          id: id(), type: 'infographic', order: 3,
          content: {
            layout: 'grid',
            items: [
              { title: 'Evidence', description: lessonMeta.evidence, icon: 'ShieldCheck' },
              { title: 'Goal', description: 'Rational certainty and spiritual peace.', icon: 'Zap' },
            ]
          }
        },
        {
            id: id(), type: 'callout', order: 4,
            content: `**Objections & Steelman:**\n\n${lessonMeta.objections}`,
            author: "The Intellectual Challenge"
        },
        {
          id: id(), type: 'text', order: 5,
          content: `### Islamic Integration: The Scholarly Lens\n\n${lessonMeta.integration}`
        },
        {
          id: id(), type: 'reflection', order: 6,
          content: {
            translation: `**Elite Practice Session:**\n\n${lessonMeta.practice}`,
            arabic: "الممارسة العملية"
          }
        },
        {
          id: id(), type: 'text', order: 7,
          content: `### Reference Verification\n\nEvidence in this lesson is weighed based on: ${lessonMeta.evidence}. We seek *Itqan* (excellence) in reasoning to ensure a mature, bulletproof faith.`
        },
        {
          id: id(), type: 'video', order: 8,
          content: { url: "https://www.youtube.com/watch?v=yWwOimr2D38" } // Yaqeen General Placeholder
        }
      ];

      // Add Quizzes as Mastery Checks
      lessonMeta.quizzes.forEach((q, qIndex) => {
        blocks.push({
          id: id(), type: 'quiz', order: 9 + qIndex,
          content: {
            question: q.q,
            options: q.o,
            correctIndex: q.a,
            hint: "Review the Anchor and Core Map."
          }
        });
      });

      blocks.push({
        id: id(), type: 'conclusion', order: 20,
        content: `You have completed the elite study of **${lessonMeta.title}**. This anchor now forms part of your cumulative case for the truth of the Islamic worldview. Continue with excellence.`
      });

      await supabase.from('course_lessons').update({ content_blocks: blocks }).eq('id', lesson.id);
    }
    console.log('✅');
  }

  console.log('\n✅ WEEK 2 "ELITE FLOW" COMPLETE — 35 Lessons Updated.');
}

seedWeek2().catch(e => { console.error('Fatal:', e); process.exit(1); });
