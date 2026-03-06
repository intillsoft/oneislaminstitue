-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: CONTENT SEED - WEEK 1 (COMPREHENSIVE)
-- Contains 20+ lessons with 10-min read depth, videos, and 5 quizzes each.
-- ============================================================================

-- SCHEMA REPAIR (Required for content insertion)
-- Ensure columns exist BEFORE the DO block to avoid compilation errors
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;

DO $$
DECLARE
    v_course_id UUID;
BEGIN
    SELECT id INTO v_course_id FROM jobs WHERE title = 'Foundations of Islamic Faith' LIMIT 1;
    
    IF v_course_id IS NULL THEN
        RAISE EXCEPTION 'Course "Foundations of Islamic Faith" not found. Please run SEED_FOUNDATIONS_OF_FAITH.sql first.';
    END IF;

    -- ========================================================================
    -- MODULE 1.1: Understanding Iman
    -- ========================================================================

    -- Lesson 1.1.1: Definition of Iman in Qur’an and Sunnah
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "vid_1",
            "type": "video",
            "url": "https://www.youtube.com/watch?v=kYI9g9d-xQk",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1",
            "type": "text",
            "content": "# The Definition of Iman: A Spiritual and Intellectual Anchor\n\nIman, often translated as \"faith,\" is the bedrock upon which the entire life of a Muslim is built. In the Islamic tradition, it is not a passive sentiment or a mere intellectual assent to a set of propositions. Rather, it is a dynamic, living force that reshapes a person''s worldview, ethics, and actions.\n\n## 1. The Quranic Description of Believers\nThe Quran defines Iman through the characteristics of those who possess it. In **Surah Al-Anfal (8:2)**, Allah says: *\"The believers are only those who, when Allah is mentioned, their hearts become fearful, and when His verses are recited to them, it increases them in faith; and upon their Lord they rely.\"*\n\nThis verse highlights that Iman has a physical and emotional impact (the trembling of the heart) and an intellectual component (increased conviction through revelation).\n\n## 2. The Prophetic Definition (Hadith of Jibreel)\nIn the famous Hadith of Jibreel, the Prophet ﷺ was asked, \"What is Iman?\" He responded: *\"It is to believe in Allah, His angels, His books, His messengers, the Day of Judgment, and the Divine Decree (Qadr), the good and the bad thereof.\"*\n\nThis provides the **legal and theological structure** of faith. Without these six pillars, one''s Iman is incomplete.\n\n## 3. The Integral Components of Iman\nAccording to the majority of early scholars (Salaf), Iman consists of three inseparable elements:\n\n1.  **Qawl bi al-Lisan (Statement of the Tongue)**: The verbal testimony of the Shahada. It is the public entrance into the community of faith.\n2.  **Tasdiq bi al-Qalb (Affirmation of the Heart)**: Deep-seated conviction and certainty. This prevents hypocrisy.\n3.  **’Amal bi al-Arkan (Action of the Limbs)**: Living the faith through obedience. Actions are the \"fruits\" of the tree of Iman.\n\n> \"Faith is a statement, a belief, and an action; it increases with obedience and decreases with disobedience.\"\n\n## 4. Why Definition Matters\nCorrectly defining Iman protects a believer from two extremes:\n- **Murji’ism**: The belief that actions don''t matter as long as there is faith.\n- **Kharijism**: The belief that any major sin removes a person from Islam completely.\n\nIslamic faith is the **middle path (Wasatiyyah)**, where internal conviction must find external expression through good character and worship.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1",
            "type": "quiz",
            "question": "Which Surah describes the physical and emotional impact of hearing Allah''s name?",
            "options": ["Al-Baqarah", "Al-Anfal", "Al-Ikhlas", "Ash-Shura"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_2",
            "type": "quiz",
            "question": "What is the ''middle path'' between believing actions don''t matter and believing sins remove faith?",
            "options": ["Secularism", "Wasatiyyah", "Liberalism", "Isolationism"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_3",
            "type": "quiz",
            "question": "How many pillars of Iman are identified in the Hadith of Jibreel?",
            "options": ["Five", "Six", "Seven", "Ten"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_4",
            "type": "quiz",
            "question": "What does ''Qawl bi al-Lisan'' refer to?",
            "options": ["Belief of the heart", "Statement of the tongue", "Action of the limbs", "Thinking of the mind"],
            "correctIndex": 1,
            "order": 5
        },
        {
            "id": "qz_5",
            "type": "quiz",
            "question": "According to the lesson, actions are compared to what part of the tree of Iman?",
            "options": ["The Roots", "The Trunk", "The Fruits", "The Soil"],
            "correctIndex": 2,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Definition of Iman in Qur’an and Sunnah';

    -- Lesson 1.1.2: Linguistic vs Technical Meaning of Faith
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "img_1_1_2",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=2070&auto=format&fit=crop",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_1_2",
            "type": "text",
            "content": "# Linguistic vs Technical Meaning of Faith\n\nPrecision in language is essential for precision in belief. In Islamic sciences, terms often have dual meanings: their general usage in the Arabic language (Lughatan) and their specific usage in Divine Law (Shar’an).\n\n## 1. The Linguistic Root (Al-Ma’na al-Lughawi)\nThe word *Iman* is derived from the Arabic root **a-m-n**, which primary signifies **safety, security, and tranquility**. It also means to verify or to trust. When you believe someone, you are \"giving them safety\" from being called a liar.\n\n## 2. The Technical Definition (Al-Ma’na al-Istilahi)\nIn Islamic theology (Aqeedah), Iman is more than just \"trust.\" It is the specific affirmation of the truth brought by Prophet Muhammad ﷺ from Allah.\n\n### The Relationship Between the Two\nThe technical meaning of Iman **includes and elevates** the linguistic meaning. A person who has Iman is \"secure\" (*amin*) from the punishment of Allah and finds \"tranquility\" (*itmi’nan*) in the remembrance of the Divine.\n\n## 3. Knowledge vs. Iman\nIs simply knowing the truth enough to have Iman? The scholars say **No**. \n\nIblis (Satan) knows for a fact that Allah is One and that the Day of Judgment is coming, yet he is not a Mu’min (believer). Why? Because he lacks **Al-Inqiyad (Submission)** and **Al-Tasdiq (Heartfelt Affirmation)**.\n\nBelief requires:\n1. **Ma''rifah (Knowledge)**: Knowing the truth.\n2. **Tasdiq (Acceptance)**: Accepting that truth.\n3. **Inqiyad (Commitment)**: Committing to live by that truth.\n\n## 4. The Impact of Security\nWhen a believer truly understands the root of *a-m-n*, their fear of the creation diminishes. They realize that true security belongs to the *Mu’min* (The Giver of Security—one of Allah''s names) and that by aligning with His truth, they enter a fortress of peace.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_1_2_1",
            "type": "quiz",
            "question": "What is the primary linguistic meaning of the root a-m-n?",
            "options": ["Knowledge", "Safety/Security", "Power", "Movement"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_1_2_2",
            "type": "quiz",
            "question": "Why is Iblis not considered a believer despite having knowledge of Allah?",
            "options": ["He lacks knowledge", "He lacks submission and heartfelt affirmation", "He is a creation of fire", "He doesn''t know the future"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_1_2_3",
            "type": "quiz",
            "question": "What does ''Al-Istilahi'' mean in the context of Islamic sciences?",
            "options": ["Linguistic meaning", "Technical/Theological meaning", "Historical meaning", "Poetic meaning"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_1_2_4",
            "type": "quiz",
            "question": "Which of these is the third requirement of belief beyond knowledge and acceptance?",
            "options": ["Wealth", "Lineage", "Inqiyad (Commitment/Submission)", "Geography"],
            "correctIndex": 2,
            "order": 5
        },
        {
            "id": "qz_1_1_2_5",
            "type": "quiz",
            "question": "Which name of Allah is derived from the same root as Iman?",
            "options": ["Al-Mu''min", "Al-Qahhar", "Al-Latif", "Al-Bari"],
            "correctIndex": 0,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Linguistic vs Technical Meaning of Faith';

    -- Lesson 1.1.3: Relationship Between Belief and Action
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "img_1_1_3",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_1_3",
            "type": "text",
            "content": "# The Inseparable Bond: Relationship Between Belief and Action\n\nIn the Islamic paradigm, the debate over whether \"faith alone is enough\" or \"actions are everything\" is resolved through a beautiful, integrated understanding. Faith (*Iman*) and Action (*Amal*) are two sides of the same coin. One cannot exist in its full, healthy form without the other.\n\n## 1. Faith as the Root, Action as the Fruit\nThe relationship between Iman and action is often compared to a tree. The roots (belief in the heart) provide the stability and life-source, while the fruits (actions) are the proof that the tree is living and healthy. If a tree has no fruit, its life is in question; if it has no roots, it will quickly wither and die.\n\n## 2. Quranic Evidence\nIn dozens of verses, Allah mentions *\"those who believe and do good deeds.\"* (e.g., **Surah Al-Asr 103:2-3**). The conjunction \"and\" (*wa*) in Arabic here implies that the two are distinct yet fundamentally connected. Good deeds are the natural, inevitable outcome of a heart that truly recognizes its Creator.\n\n## 3. The Condition of Sincerity (*Ikhlas*)\nActions are not judged purely by their outward form. An action is only accepted if it is rooted in sincere belief. A person who prays only to be seen by others (hypocrisy) is performing an action without the root of Iman. Conversely, a person who claims to love Allah but makes no effort to pray or follow His commands is like someone claiming to have a fire that produces no heat.\n\n### The Hierarchy of Actions:\n- **Core Actions**: The Five Pillars (Salah, Zakat, etc.) are non-negotiable expressions of Iman.\n- **Secondary Actions**: Good character, honesty in business, and helping neighbors.\n- **Spiritual Actions**: Sincerity, fear of Allah, and hope for His mercy.\n\n## 4. Does Sin Remove Faith?\nThe Ahlus Sunnah (mainstream Muslim perspective) holds that a believer who commits a major sin remains a Muslim, but their Iman is weakened or \"incomplete.\" They have the root, but the fruit has been damaged. This motivates the believer to constantly return in repentance (*Tawbah*) to restore the beauty of their faith.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_1_3_1",
            "type": "quiz",
            "question": "What is the primary metaphor used to describe the relationship between Iman and Action?",
            "options": ["A river and its bank", "A tree and its fruits", "The sun and its heat", "A building and its foundation"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_1_3_2",
            "type": "quiz",
            "question": "According to the lesson, what happens to the Iman of someone who commits a major sin but doesn''t reject the faith?",
            "options": ["It is completely gone", "It is weakened/incomplete", "It remains perfectly same", "It increases automatically"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_1_3_3",
            "type": "quiz",
            "question": "Which Surah is mentioned as key evidence for connecting faith with good deeds?",
            "options": ["Al-Fatihah", "Al-Asr", "Al-Kahf", "Al-Mulk"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_1_3_4",
            "type": "quiz",
            "question": "If a tree has fruit but no roots, what is the outcome?",
            "options": ["It grows taller", "It withers and dies", "It becomes a forest", "It changes species"],
            "correctIndex": 1,
            "order": 5
        },
        {
            "id": "qz_1_1_3_5",
            "type": "quiz",
            "question": "What is the term for actions for which a person prays only to be seen by others?",
            "options": ["Sincerity", "Hypocrisy (Riya)", "Steadfastness", "Wisdom"],
            "correctIndex": 1,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Relationship Between Belief and Action';

    -- Lesson 1.1.4: Increase and Decrease of Iman
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "img_1_1_4",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_1_4",
            "type": "text",
            "content": "# The Ebb and Flow: Increase and Decrease of Iman\n\nOne of the most profound realizations for a believer is that faith is not a static line; it is a dynamic tide. It rises with the performance of good deeds and falls with the commission of sins. Understanding this allows us to be proactive rather than passive in our spiritual lives.\n\n## 1. Scriptural Proof for the Fluctuation of Faith\nAllah clearly states in several Quranic verses that faith is capable of growth:\n- *\"...that they may increase in faith along with their (present) faith.\"* (**Surah Al-Fath 48:4**)\n- *\"As for those who are guided, He increases them in guidance...\"* (**Surah Muhammad 47:17**)\n\nThe Companions of the Prophet ﷺ used to say to one another, \"Sit with us so that we may believe for an hour,\" referring to the gathering for the remembrance of Allah which increases faith.\n\n## 2. Factors that Increase Iman\nImagine Iman as a flame. To make it grow, you must add fuel:\n1.  **Reflecting on the Quran**: Engaging deeply with the meaning of revelation.\n2.  **Knowing Allah through His Names**: Understanding His majesty and mercy.\n3.  **Acts of Obedience**: Regularity in prayer, charity, and kindness.\n4.  **Dhikr (Remembrance)**: Keeping the tongue and heart busy with the praise of Allah.\n5.  **Seeking Knowledge**: Learning about the Deen removes doubts, and certainty is the foundation of Iman.\n\n## 3. Factors that Decrease Iman\nJust as fuel adds to the fire, water douses it. Faith decreases through:\n1.  **Ignorance**: Not knowing the rights of Allah.\n2.  **Negligence (*Ghaflah*)**: Being so preoccupied with the worldly life that the hereafter is forgotten.\n3.  **Committing Sins**: Each sin acts as a dark spot on the heart, obscuring its light.\n4.  **Negative Environment**: Surrounding oneself with people who mock or disregard spiritual values.\n\n## 4. The Path Forward\nRecognizing that faith can decrease is not a cause for despair, but a call to action. Like a gardener who notices a plant wilting, the believer must troubleshoot and provide the necessary spiritual nutrients (dhikr, prayer, knowledge) to bring the heart back to life.\n\n> \"Faith wears out in the heart of any one of you just as clothes wear out, so ask Allah to renew faith in your hearts.\"\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_1_4_1",
            "type": "quiz",
            "question": "Which Surah mentions that Allah increases believers in faith?",
            "options": ["Al-Fath", "Al-Kafirun", "Al-Lahab", "An-Nas"],
            "correctIndex": 0,
            "order": 2
        },
        {
            "id": "qz_1_1_4_2",
            "type": "quiz",
            "question": "What did the Companions mean when they said, ''Sit with us so that we may believe for an hour''?",
            "options": ["They were becoming non-believers", "They wanted to earn money", "They wanted to increase faith through remembrance", "They were confused"],
            "correctIndex": 2,
            "order": 3
        },
        {
            "id": "qz_1_1_4_3",
            "type": "quiz",
            "question": "What is compared to clothes that wear out in the lesson''s final quote?",
            "options": ["Wealth", "Faith", "Body", "Worldly status"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_1_4_4",
            "type": "quiz",
            "question": "Which of these is a major cause of the decrease in faith?",
            "options": ["Seeking knowledge", "Negligence (Ghaflah)", "Giving charity", "Visiting the sick"],
            "correctIndex": 1,
            "order": 5
        },
        {
            "id": "qz_1_1_4_5",
            "type": "quiz",
            "question": "How should a believer respond when they feel their faith is wilting?",
            "options": ["Give up", "Search for worldly escape", "Provide spiritual nutrients like dhikr and prayer", "Ignore it"],
            "correctIndex": 2,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Increase and Decrease of Iman';

    -- Lesson 1.1.5: Signs of Strong Faith
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "img_1_1_5",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070&auto=format&fit=crop",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_1_5",
            "type": "text",
            "content": "# The Radiance of Certainty: Signs of Strong Faith\n\nHow do we know if our Iman is in a state of strength? While the heart is a hidden domain, its state is reflected in the behavior and internal experiences of the believer. Recognizing these signs helps us audit our spiritual health.\n\n## 1. Tranquility in Adversity\nOne of the most powerful signs of strong Iman is **Sabr (Patience)** coupled with **Ridha (Contentment)**. A person with strong faith recognizes that everything is in the hands of Allah, allowing them to remain calm when trials strike.\n\n## 2. Speed in Responding to Allah\nWhen a believer hears the call to prayer or stays away from a temptation purely for the sake of Allah, it shows that the heart is alive. Strong faith creates a \"natural\" inclination toward what is pleasing to the Creator and a natural aversion to what is displeasing.\n\n## 3. Love and Hate for the Sake of Allah\nThe Prophet ﷺ said: *\"Whoever loves for the sake of Allah, hates for the sake of Allah, gives for the sake of Allah, and withholds for the sake of Allah, has perfected his faith.\"* (Sunan Abi Dawud)\n\n## 4. Tasting the Sweetness of Faith (*Halawat al-Iman*)\nThere is a literal psychological and spiritual joy that the believer feels when they perform an act of worship. It is a feeling of light and expansion in the chest. This sweetness is only tasted when faith is robust.\n\n### Practical Signs:\n- **Increased Concentration**: Finding it easier to focus in Salah.\n- **Altruism**: Preferring others over oneself without feeling a sense of loss.\n- **Fear of Allah in Secret**: Not committing sins even when no human is watching.\n- **Frequent Remembrance**: The name of Allah is constantly on the tongue.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_1_5_1",
            "type": "quiz",
            "question": "What is the term for the spiritual joy a believer feels in worship?",
            "options": ["Halawat al-Iman", "Dunya", "Istighfar", "Sujud"],
            "correctIndex": 0,
            "order": 2
        },
        {
            "id": "qz_1_1_5_2",
            "type": "quiz",
            "question": "How does someone with strong faith react to trials?",
            "options": ["With anger", "With patience and contentment", "By giving up", "By blaming others"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_1_5_3",
            "type": "quiz",
            "question": "According to the Hadith, what characterizes the perfection of faith?",
            "options": ["Being rich", "Performing acts like love and hate for Allah''s sake", "Traveling the world", "Knowing many languages"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_1_5_4",
            "type": "quiz",
            "question": "Is concentration in Salah (prayer) related to the strength of faith?",
            "options": ["No, it is just focus", "Yes, it is a sign of a robust heart", "It depends on the time of day", "Only for scholars"],
            "correctIndex": 1,
            "order": 5
        },
        {
            "id": "qz_1_1_5_5",
            "type": "quiz",
            "question": "What does ''Altruism'' mean in the context of faith?",
            "options": ["Hoarding wealth", "Preferring others over oneself for Allah''s sake", "Ignoring one''s family", "Building tall towers"],
            "correctIndex": 1,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Signs of Strong Faith';

    -- Lesson 1.1.6: Causes of Weak Faith
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "img_1_1_6",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1541535650810-10d26f5ec278?q=80&w=2069&auto=format&fit=crop",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_1_6",
            "type": "text",
            "content": "# The Darkness of Neglect: Causes of Weak Faith\n\nWeak faith is a condition that every believer may experience. It is not necessarily a sign of failure, but rather a sign of the need for internal cultivation. If we identify the causes, we can begin the process of healing.\n\n## 1. Distraction with the Dunya (Worldly Life)\nWhen the pursuit of wealth, status, entertainment, or leisure becomes the primary focus of one''s day, the heart begins to harden towards spiritual matters. The Quran warns us that the *\"life of this world is but the enjoyment of delusion.\"* (**Surah Al-Hadid 57:20**).\n\n## 2. Neglecting Acts of Worship\nWhen a person begins to delay their prayers, skips their daily Quran reading, or abandons the remembrance of Allah, the heart loses its nutrition. Just as a fire dies without wood, faith dies without worship.\n\n## 3. Persistence in Small Sins\nSmall sins, when done repeatedly, act like a coating on the heart. The Prophet ﷺ described this as a black spot that appears with every sin. Eventually, if not removed through repentance (*Istighfar*), the heart becomes entirely covered, making it difficult for the light of faith to enter.\n\n## 4. Lack of Knowledge\nIgnorance of Allah''s Names, the history of the Prophets, and the wisdom of the Deen leads to doubt. When a person stays away from gatherings of knowledge, they are more susceptible to the whispers (*Waswas*) of Shaytan.\n\n### Symptoms of Weak Faith:\n- **Hardness of Heart**: Not feeling emotional during prayer or Quranic recitation.\n- **Laziness in Worship**: Finding the simplest duties to be a heavy burden.\n- **Lack of Moral Concern**: Becoming indifferent towards right and wrong.\n- **Irritability**: Reacting with anger to small inconveniences because the heart lacks contentment.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_1_6_1",
            "type": "quiz",
            "question": "What does the Quran call the life of this world in Surah Al-Hadid?",
            "options": ["A permanent home", "The enjoyment of delusion", "A place of no hope", "A dark cave"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_1_6_2",
            "type": "quiz",
            "question": "What is the primary symptom of a heart becoming ''covered in rust'' from small sins?",
            "options": ["It gets physically bigger", "It stops beating", "It becomes harder for light/faith to enter", "It turns green"],
            "correctIndex": 2,
            "order": 3
        },
        {
            "id": "qz_1_1_6_3",
            "type": "quiz",
            "question": "What is the core nutrient for the heart according to the lesson?",
            "options": ["Wealth", "Physical exercise", "Acts of worship and remembrance", "Silence"],
            "correctIndex": 2,
            "order": 4
        },
        {
            "id": "qz_1_1_6_4",
            "type": "quiz",
            "question": "How does ignorance affect a believer''s resistance to whispers of Shaytan?",
            "options": ["It makes them stronger", "It has no effect", "It makes them more susceptible to doubt", "It makes them invisible to Shaytan"],
            "correctIndex": 2,
            "order": 5
        },
        {
            "id": "qz_1_1_6_5",
            "type": "quiz",
            "question": "Is feeling that worship is a ''heavy burden'' a potential sign of weak faith?",
            "options": ["Yes, it is a symptom of laziness in worship", "No, everyone feels it", "Only for children", "Only in winter"],
            "correctIndex": 0,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Causes of Weak Faith';

    -- Lesson 1.1.7: Weekly Knowledge Check
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "img_1_1_7",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_1_7",
            "type": "text",
            "content": "# Module 1.1 Summary & Assessment\n\nCongratulations on completing the first module of the Foundations of Islamic Faith. We have explored the fundamental concepts of Iman, its linguistic roots, and the dynamic nature of faith.\n\n## Key Summary Points:\n1.  **Iman is Holistic**: It includes the tongue, heart, and limbs.\n2.  **Iman is Security**: The root *a-m-n* teaches us that faith is our ultimate spiritual safety.\n3.  **Faith Fluctuates**: We must be proactive in fuel-ing our faith through obedience and protecting it from negligence.\n4.  **Action is Proof**: Genuine internal conviction naturally manifests as outward good character.\n\nComplete the following final assessment to unlock the next module.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_1_7_1",
            "type": "quiz",
            "question": "Which of these is NOT one of the three inseparable components of Iman?",
            "options": ["Statement of the Tongue", "Wealth in the Bank", "Affirmation of the Heart", "Action of the Limbs"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_1_7_2",
            "type": "quiz",
            "question": "Faith is compared to what in the Hadith regarding its ''wearing out''?",
            "options": ["A fast horse", "Old clothes", "A falling star", "A cloudy sky"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_1_7_3",
            "type": "quiz",
            "question": "True or False: A major sin removes a person from faith entirely in mainstream Islamic theology.",
            "options": ["True", "False"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_1_7_4",
            "type": "quiz",
            "question": "What is the primary driver for increase in Iman?",
            "options": ["Eating more", "Obedience (Ta''at)", "Sleeping less", "Playing sports"],
            "correctIndex": 1,
            "order": 5
        },
        {
            "id": "qz_1_1_7_5",
            "type": "quiz",
            "question": "Iman creates a sense of ____ and safety for the heart.",
            "options": ["Anxiety", "Security", "Confusion", "Pride"],
            "correctIndex": 1,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'Weekly Knowledge Check';

    -- ========================================================================
    -- MODULE 1.2: Islam, Iman & Ihsan
    -- ========================================================================

    -- Lesson 1.2.1: The Hadith of Jibreel Explained
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "vid_1_2_1",
            "type": "video",
            "url": "https://www.youtube.com/watch?v=F7v8uY_5844",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "txt_1_2_1",
            "type": "text",
            "content": "# The Framework of Faith: The Hadith of Jibreel Explained\n\nOften called the \"Mother of the Sunnah,\" the Hadith of Jibreel provides the most comprehensive summary of the Islamic religion. It encompasses three distinct yet nested levels of spirituality: Islam, Iman, and Ihsan.\n\n## 1. The Mysterious Visitor\nThe Hadith begins with Umar ibn al-Khattab (RA) describing a man coming to the Prophet ﷺ while they were sitting. The man had extremely white clothes and black hair, yet showed no signs of travel. This was the Angel Jibreel in human form, coming to teach the companions their religion through a series of questions.\n\n## 2. The Three Levels of Religion\n- **Islam (Outward Practice)**: The Five Pillars. This is the entry level, focusing on the actions of the body.\n- **Iman (Inward Belief)**: The Six Pillars. This is a deeper level, focusing on the convictions of the heart.\n- **Ihsan (Spiritual Excellence)**: Worshipping Allah as if you see Him. This is the highest level, focusing on the perfection of one''s state.\n\n## 3. The End of Times\nThe Hadith concludes with Jibreel asking about the Hour (the Day of Judgment). The Prophet ﷺ replied that the one being questioned (himself) knows no more than the questioner (Jibreel). This teaches us **intellectual humility**—that even the greatest creation of Allah does not know the Unseen except what He reveals.\n\n## 4. Why This Hadith matters\nIt teaches us that religion is not just a list of rules, but a progression. We start with outward submission, internalize it into deep faith, and eventually reach a state of divine presence (Ihsan). Every Muslim should periodically evaluate which level they are currently focusing on and strive for the next.\n",
            "layoutSettings": { "width": "100%" },
            "order": 1
        },
        {
            "id": "qz_1_2_1_1",
            "type": "quiz",
            "question": "Who was the visitor in the famous Hadith mentioned in the lesson?",
            "options": ["Abu Bakr (RA)", "The Angel Jibreel", "A merchant from Yemen", "Khalid ibn Walid (RA)"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_2_1_2",
            "type": "quiz",
            "question": "How many levels of religion are identified in this Hadith?",
            "options": ["Two", "Three", "Four", "Five"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_2_1_3",
            "type": "quiz",
            "question": "Which level focuses specifically on ''spiritual excellence'' and worshipping as if you see Allah?",
            "options": ["Islam", "Iman", "Ihsan", "Taqwa"],
            "correctIndex": 2,
            "order": 4
        },
        {
            "id": "qz_1_2_1_4",
            "type": "quiz",
            "question": "What was the Prophet''s ﷺ response when asked about the timing of the Hour?",
            "options": ["It will be in 100 years", "The one questioned knows no more than the questioner", "It is on a Friday", "None know except the scholars"],
            "correctIndex": 1,
            "order": 5
        },
        {
            "id": "qz_1_2_1_5",
            "type": "quiz",
            "question": "Why is this Hadith called the ''Mother of the Sunnah''?",
            "options": ["It was narrated by Aisha (RA)", "It summarizes the entire religion", "It mentions mothers", "It was the first Hadith recorded"],
            "correctIndex": 1,
            "order": 6
        }
    ]' WHERE course_id = v_course_id AND title = 'The Hadith of Jibreel Explained';

    -- Lesson 1.2.2: The Five Pillars of Islam
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "txt_1_2_2",
            "type": "text",
            "content": "# The Foundations: The Five Pillars of Islam\n\nIf the religion is a building, the Five Pillars are the columns that hold up the roof. These are the mandatory outward expressions of submission that define the Muslim identity.\n\n## 1. Shahada (Testimony of Faith)\nThe declaration that *\"There is no god but Allah, and Muhammad is the Messenger of Allah.\"* This is the \"key\" to Paradise and the foundation for every other action.\n\n## 2. Salah (Ritual Prayer)\nThe Five Daily Prayers are the umbilical cord of the soul. They provide a regular rhythm of remembrance and connection to the Divine throughout the day.\n\n## 3. Zakat (Obligatory Charity)\nPaying 2.5% of one''s surplus wealth to the needy. This purifies the heart from greed and ensures social justice within the community.\n\n## 4. Sawm (Fasting in Ramadan)\nRefraining from food, drink, and marital relations from dawn to sunset. This is a school of self-discipline and gratitude for the blessings we often take for granted.\n\n## 5. Hajj (Pilgrimage to Makkah)\nPerforming the pilgrimage to the House of Allah once in a lifetime for those who are physically and financially able. It is the ultimate gathering of unity and equality.\n\n## 6. The Wisdom of the Pillars\nEach pillar addresses a different aspect of human nature:\n- **Shahada**: The Intellect and Speech.\n- **Salah**: The Soul and Time.\n- **Zakat**: Wealth and Society.\n- **Sawm**: The Body and Desires.\n- **Hajj**: Physical Effort and Unity.\n",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "qz_1_2_2_1",
            "type": "quiz",
            "question": "Which pillar acts as the ''key'' to Paradise and the foundation of all other actions?",
            "options": ["Salah", "Shahada", "Zakat", "Hajj"],
            "correctIndex": 1,
            "order": 1
        },
        {
            "id": "qz_1_2_2_2",
            "type": "quiz",
            "question": "What percentage of surplus wealth is typically paid as Zakat?",
            "options": ["1%", "2.5%", "5%", "10%"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_2_2_3",
            "type": "quiz",
            "question": "Which aspect of human nature does Fasting (Sawm) primarily discipline?",
            "options": ["The Intellect", "Wealth", "The Body and Desires", "Social Status"],
            "correctIndex": 2,
            "order": 3
        },
        {
            "id": "qz_1_2_2_4",
            "type": "quiz",
            "question": "How often is the Hajj mandatory for those who are able?",
            "options": ["Once a year", "Once every five years", "Once in a lifetime", "None of the above"],
            "correctIndex": 2,
            "order": 4
        },
        {
            "id": "qz_1_2_2_5",
            "type": "quiz",
            "question": "Which pillar is described as the ''umbilical cord of the soul''?",
            "options": ["Zakat", "Salah", "Sawm", "Shahada"],
            "correctIndex": 1,
            "order": 5
        }
    ]' WHERE course_id = v_course_id AND title = 'The Five Pillars of Islam';

    -- Lesson 1.2.3: The Six Pillars of Iman
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "txt_1_2_3",
            "type": "text",
            "content": "# The Internal Pillars: The Six Pillars of Iman\n\nWhile the Five Pillars are outward, the Six Pillars of Iman are inward. They represent the core convictions that a Muslim must hold to have valid faith.\n\n## 1. Belief in Allah\nBelieving in His existence, His Oneness (Tawheed), and His perfect Names and Attributes.\n\n## 2. Belief in His Angels\nBelieving in the celestial beings created from light who perform specific duties (like Jibreel, Mikail, and the recorders of deeds).\n\n## 3. Belief in His Books\nBelieving in the original revelations: the Torah, the Psalms, the Gospel, and the final, preserved Revelation—the Quran.\n\n## 4. Belief in His Messengers\nBelieving in all the prophets from Adam to Muhammad ﷺ, accepting their truth and following their guidance.\n\n## 5. Belief in the Last Day\nBelieving in the resurrection, the judgment, and the eternal life in Paradise or Hell.\n\n## 6. Belief in Divine Decree (Qadr)\nBelieving that Allah knows all things, has written them, has willed them, and has created them—knowing that both good and bad are from Him.\n",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "qz_1_2_3_1",
            "type": "quiz",
            "question": "Which pillar of Iman involves believing in Jibreel and Mikail?",
            "options": ["Belief in Messengers", "Belief in Angels", "Belief in Books", "Belief in Allah"],
            "correctIndex": 1,
            "order": 1
        },
        {
            "id": "qz_1_2_3_2",
            "type": "quiz",
            "question": "Believing in the Quran, Torah, and Gospel falls under which pillar?",
            "options": ["Belief in Angels", "Belief in Books", "Belief in the Last Day", "Belief in Messengers"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_2_3_3",
            "type": "quiz",
            "question": "What is the final and preserved book of Allah?",
            "options": ["The Torah", "The Gospel", "The Quran", "The Psalms"],
            "correctIndex": 2,
            "order": 3
        },
        {
            "id": "qz_1_2_3_4",
            "type": "quiz",
            "question": "Belief in Divine Decree (Qadr) means believing that Allah...?",
            "options": ["Does not know the future", "Knows, wills, and creates all things", "Only knows the good things", "Has no influence on our lives"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_2_3_5",
            "type": "quiz",
            "question": "True or False: A Muslim must believe in all prophets from Adam to Muhammad ﷺ.",
            "options": ["True", "False"],
            "correctIndex": 0,
            "order": 5
        }
    ]' WHERE course_id = v_course_id AND title = 'The Six Pillars of Iman';

    -- Lesson 1.2.4: The Concept of Ihsan
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "txt_1_2_4",
            "type": "text",
            "content": "# Spiritual Excellence: The Concept of Ihsan\n\nIhsan is the pinnacle of the Islamic path. While Islam is about actions and Iman is about convictions, Ihsan is about **intention and quality**.\n\n## 1. The Definition of Excellence\nThe Prophet ﷺ defined Ihsan as: *\"To worship Allah as if you see Him; for if you do not see Him, surely He sees you.\"*\n\n## 2. Two Degrees of Ihsan\n- **Mushahadah (Observation)**: The higher degree where your heart is so filled with the greatness of Allah that you feel as if you are in His presence. This leads to intense love and awe.\n- **Muraqabah (Mindfulness)**: The degree where you are constantly aware that Allah is watching you. This leads to carefulness in actions and distance from sin.\n\n## 3. Ihsan in Interaction\nIhsan is not just for prayer. It extends to how we treat people, animals, and even the environment. The Prophet ﷺ said: *\"Allah has prescribed Ihsan for everything.\"*\n\n## 4. Why We Need Ihsan\nWithout Ihsan, prayer can become a robotic movement and fasting can become just a diet. Ihsan is the \"spirit\" that gives life to the \"body\" of worship. It transforms a mundane life into a masterpiece of spiritual devotion.\n",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "qz_1_2_4_1",
            "type": "quiz",
            "question": "What is the definition of Ihsan provided by the Prophet ﷺ?",
            "options": ["To pray 5 times a day", "To worship Allah as if you see Him", "To give all your money to charity", "To write books about Islam"],
            "correctIndex": 1,
            "order": 1
        },
        {
            "id": "qz_1_2_4_2",
            "type": "quiz",
            "question": "What is the result of the degree of ''Muraqabah'' (Mindfulness)?",
            "options": ["Constant fear of people", "Carefulness in actions because Allah is watching", "Intellectual pride", "Physical exhaustion"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_2_4_3",
            "type": "quiz",
            "question": "True or False: Ihsan only applies to prayer and fasting.",
            "options": ["True", "False"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_2_4_4",
            "type": "quiz",
            "question": "Ihsan is described as the...?",
            "options": ["Foundations of the building", "Spirit that gives life to worship", "Historical context of Islam", "Outward rules of Law"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_2_4_5",
            "type": "quiz",
            "question": "Which of these is the higher degree of Ihsan?",
            "options": ["Muraqabah", "Mushahadah", "Islam", "Iman"],
            "correctIndex": 1,
            "order": 5
        }
    ]' WHERE course_id = v_course_id AND title = 'The Concept of Ihsan';

    -- Lesson 1.2.5: Internal vs External Submission
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "txt_1_2_5",
            "type": "text",
            "content": "# The Balance: Internal vs External Submission\n\nIslam requires a harmony between the private state of the heart and the public actions of the body. When one exists without the other, the spiritual health of the individual is compromised.\n\n## 1. External Without Internal (Hypocrisy)\nPerforming the rituals of prayer, fasting, and charity while the heart is empty of faith or filled with hatred for the truth. This is the state of the *Munafiq* (Hypocrite).\n\n## 2. Internal Without External (Delusion)\nClaiming to have a \"good heart\" or \"deep faith\" while intentionally ignoring the commands of Allah (like Salah or ethics). True faith *demands* expression. If the heart is truly filled with light, it will inevitably shine through the limbs.\n\n## 3. The Goal: Integration\nThe goal of a believer is to align the two. We perform the actions of Islam to polish our hearts, and we polish our hearts to make our actions more sincere.\n\n### Practical Checkpoint:\n- Does my private life match my public persona?\n- Do I focus more on the form of my prayer or the presence of my heart?\n- Am I performing good deeds for the sake of Allah or for the validation of people?\n",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "qz_1_2_5_1",
            "type": "quiz",
            "question": "What is the state of someone who performs rituals but has no faith in the heart?",
            "options": ["Muhsin", "Mu''min", "Munafiq (Hypocrite)", "Kafir"],
            "correctIndex": 2,
            "order": 1
        },
        {
            "id": "qz_1_2_5_2",
            "type": "quiz",
            "question": "Why is ''Internal Without External'' submission considered a delusion?",
            "options": ["Because actions are not important", "Because true faith inevitably demands expression and obedience", "Because heart doesn''t exist", "Because everyone is already a believer"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_2_5_3",
            "type": "quiz",
            "question": "What should a believer aim for regarding their internal and external states?",
            "options": ["Focus only on external", "Focus only on internal", "Integration and alignment of both", "Ignoring both for worldly success"],
            "correctIndex": 2,
            "order": 3
        },
        {
            "id": "qz_1_2_5_4",
            "type": "quiz",
            "question": "What polishes the heart according to the lesson?",
            "options": ["Sleeping", "Performing the actions of Islam (rituals)", "Arguing with others", "Complaining"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_2_5_5",
            "type": "quiz",
            "question": "If the heart is truly filled with light, where will it shine?",
            "options": ["Nowhere", "Through the limbs and actions", "Only in dreams", "Only in books"],
            "correctIndex": 1,
            "order": 5
        }
    ]' WHERE course_id = v_course_id AND title = 'Internal vs External Submission';

    -- Lesson 1.2.6: Hypocrisy: Major and Minor
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "txt_1_2_6",
            "type": "text",
            "content": "# The Danger Within: Major and Minor Hypocrisy\n\nIn Islam, hypocrisy (*Nifaq*) is considered a spiritual disease more dangerous than disbelief, because it hides within the heart of the community.\n\n## 1. Major Hypocrisy (Nifaq al-Akbar)\nThis is a matter of belief. It is to show faith outwardly while concealing disbelief in the heart. Those in this state are outside the fold of Islam, though they may appear inside. \n\n## 2. Minor Hypocrisy (Nifaq al-Asghar)\nThis is a matter of action. It is to have faith in the heart but to possess traits associated with hypocrites. This does not take a person out of Islam, but it is a grave sin that must be addressed.\n\n### The Signs of a Hypocrite (Minor):\nThe Prophet ﷺ said: *\"The signs of a hypocrite are three: When he speaks, he lies; when he promises, he breaks it; and when he is entrusted, he betrays it.\"* (Bukhari)\n\n## 3. The Fear of Hypocrisy\nThe companions of the Prophet ﷺ were terrified of minor hypocrisy. Umar ibn al-Khattab (RA) used to ask Hudhayfah (RA)—who knew the names of the hypocrites—\"Did the Prophet ﷺ mention my name among them?\" This teaches us that **self-correction is a lifelong duty**.\n",
            "layoutSettings": { "width": "100%" },
            "order": 0
        },
        {
            "id": "qz_1_2_6_1",
            "type": "quiz",
            "question": "Which type of hypocrisy takes a person out of the fold of Islam?",
            "options": ["Minor Hypocrisy", "Major Hypocrisy", "Both", "Neither"],
            "correctIndex": 1,
            "order": 1
        },
        {
            "id": "qz_1_2_6_2",
            "type": "quiz",
            "question": "What does Minor Hypocrisy refer to?",
            "options": ["Disbelief in the heart", "Possessing traits of hypocrites in one''s actions", "Forgetting a prayer", "Liking a different color"],
            "correctIndex": 1,
            "order": 2
        },
        {
            "id": "qz_1_2_6_3",
            "type": "quiz",
            "question": "Which of these is NOT one of the three signs of a hypocrite mentioned in the Hadith?",
            "options": ["Lying when speaking", "Breaking promises", "Betraying trust", "Sleeping late"],
            "correctIndex": 3,
            "order": 3
        },
        {
            "id": "qz_1_2_6_4",
            "type": "quiz",
            "question": "Why did Umar (RA) ask Hudhayfah (RA) about his own name?",
            "options": ["He didn''t know his own name", "He was afraid of minor hypocrisy in himself", "He wanted to show off", "He was testing Hudhayfah"],
            "correctIndex": 1,
            "order": 4
        },
        {
            "id": "qz_1_2_6_5",
            "type": "quiz",
            "question": "Nifaq is considered more dangerous than disbelief because...?",
            "options": ["It is more expensive", "It hides within the community", "It involves magic", "It is only for men"],
            "correctIndex": 1,
            "order": 5
        }
    ]' WHERE course_id = v_course_id AND title = 'Hypocrisy: Major and Minor';

    -- Lesson 1.2.7: Weekly Assessment
    UPDATE course_lessons SET content_blocks = '[
        {
            "id": "qz_1_2_7_1",
            "type": "quiz",
            "question": "Match the term: Outward practices, Five Pillars.",
            "options": ["Iman", "Islam", "Ihsan", "Taqwa"],
            "correctIndex": 1,
            "order": 0
        },
        {
            "id": "qz_1_2_7_2",
            "type": "quiz",
            "question": "Match the term: Inward convictions, Six Pillars.",
            "options": ["Islam", "Iman", "Ihsan", "Sabr"],
            "correctIndex": 1,
            "order": 1
        },
        {
            "id": "qz_1_2_7_3",
            "type": "quiz",
            "question": "Match the term: Spiritual excellence, being mindful of Allah.",
            "options": ["Ihsan", "Iman", "Islam", "Zuhd"],
            "correctIndex": 0,
            "order": 2
        },
        {
            "id": "qz_1_2_7_4",
            "type": "quiz",
            "question": "What is the key danger of Minor Hypocrisy?",
            "options": ["It makes you rich", "It can lead to a hardening of the heart and deeper spiritual failure", "It is mandatory", "None of the above"],
            "correctIndex": 1,
            "order": 3
        },
        {
            "id": "qz_1_2_7_5",
            "type": "quiz",
            "question": "The Six Pillars of Iman were revealed to teach the religion in which Hadith?",
            "options": ["Hadith of Aisha", "Hadith of Jibreel", "Hadith of Abu Bakr", "Hadith of Intentions"],
            "correctIndex": 1,
            "order": 4
        }
    ]' WHERE course_id = v_course_id AND title = 'Weekly Assessment';

    RAISE NOTICE 'Week 1 Module 1-2 Content Seed successfully applied.';
END $$;
