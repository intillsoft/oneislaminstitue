-- ============================================================================
-- 🎓 ONE ISLAM INSTITUTE: COURSE SEED - Foundations of Islamic Faith
-- Week 1-6 Full Curriculum (210 Lessons)
-- ============================================================================

DO $$
DECLARE
    v_course_id UUID;
    v_instructor_id UUID;
    v_faculty_id UUID;
    v_module_id UUID;
    v_week_idx INT;
    v_mod_idx INT;
    v_lesson_idx INT;
BEGIN
    -- 0. SCHEMA REPAIR (Ensure all required columns exist for this script)
    -- Add columns to jobs table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'logo') THEN
        ALTER TABLE jobs ADD COLUMN logo TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'thumbnail') THEN
        ALTER TABLE jobs ADD COLUMN thumbnail TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'image') THEN
        ALTER TABLE jobs ADD COLUMN image TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'price') THEN
        ALTER TABLE jobs ADD COLUMN price NUMERIC(10,2) DEFAULT 0.00;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'featured') THEN
        ALTER TABLE jobs ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
        ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'active';
    END IF;

    -- Add columns to course_lessons table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'course_id') THEN
        ALTER TABLE course_lessons ADD COLUMN course_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'content_data') THEN
        ALTER TABLE course_lessons ADD COLUMN content_data JSONB;
    END IF;

    -- 1. IDENTIFY INSTRUCTOR (Fallback to first admin if no instructor exists)
    SELECT id INTO v_instructor_id FROM users WHERE role IN ('instructor', 'admin') ORDER BY created_at ASC LIMIT 1;
    
    -- 2. IDENTIFY/CREATE FACULTY
    SELECT id INTO v_faculty_id FROM faculties WHERE name = 'Department of Islamic Theology' LIMIT 1;
    IF v_faculty_id IS NULL THEN
        INSERT INTO faculties (name, slug, description, accreditation_status)
        VALUES ('Department of Islamic Theology', 'islamic-theology', 'Providing foundational knowledge in Aqeedah and Fiqh.', 'accredited')
        RETURNING id INTO v_faculty_id;
    END IF;

    -- 3. CREATE THE COURSE
    INSERT INTO jobs (
        title, company, location, description, 
        faculty_id, instructor_id, course_level, subject_area, 
        total_modules, total_lessons, credit_hours, enrollment_limit,
        status, price, featured
    ) VALUES (
        'Foundations of Islamic Faith', 
        'One Islam Institute', 
        'Remote / Online', 
        'A comprehensive 6-week certificate program exploring the core tenets of Islamic belief, rational foundations, and spiritual growth.',
        v_faculty_id,
        v_instructor_id,
        'beginner',
        'Aqeedah (Theology)',
        30, -- 6 weeks * 5 modules
        210, -- 30 modules * 7 lessons
        40,
        1000,
        'active',
        0.00,
        true
    ) RETURNING id INTO v_course_id;

    -- ========================================================================
    -- WEEK 1: The Nature of Faith & Tawheed
    -- ========================================================================
    
    -- Module 1.1: Understanding Iman
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Understanding Iman', 'Week 1 - Module 1: Foundations of belief in Islam.', 1)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Definition of Iman in Qur’an and Sunnah', 1),
    (v_module_id, v_course_id, 'Linguistic vs Technical Meaning of Faith', 2),
    (v_module_id, v_course_id, 'Relationship Between Belief and Action', 3),
    (v_module_id, v_course_id, 'Increase and Decrease of Iman', 4),
    (v_module_id, v_course_id, 'Signs of Strong Faith', 5),
    (v_module_id, v_course_id, 'Causes of Weak Faith', 6),
    (v_module_id, v_course_id, 'Weekly Knowledge Check', 7);

    -- Module 1.2: Islam, Iman & Ihsan
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Islam, Iman & Ihsan', 'Week 1 - Module 2: The hierarchy of spirituality.', 2)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'The Hadith of Jibreel Explained', 1),
    (v_module_id, v_course_id, 'The Five Pillars of Islam', 2),
    (v_module_id, v_course_id, 'The Six Pillars of Iman', 3),
    (v_module_id, v_course_id, 'The Concept of Ihsan', 4),
    (v_module_id, v_course_id, 'Internal vs External Submission', 5),
    (v_module_id, v_course_id, 'Hypocrisy: Major and Minor', 6),
    (v_module_id, v_course_id, 'Weekly Assessment', 7);

    -- Module 1.3: Tawheed – Oneness of Allah
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Tawheed – Oneness of Allah', 'Week 1 - Module 3: The central pillar of Islam.', 3)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Introduction to Tawheed', 1),
    (v_module_id, v_course_id, 'Tawheed ar-Rububiyyah', 2),
    (v_module_id, v_course_id, 'Tawheed al-Uluhiyyah', 3),
    (v_module_id, v_course_id, 'Tawheed al-Asma wa Sifat', 4),
    (v_module_id, v_course_id, 'Types of Shirk', 5),
    (v_module_id, v_course_id, 'Hidden Shirk in Modern Times', 6),
    (v_module_id, v_course_id, 'Weekly Assessment', 7);

    -- Module 1.4: Names & Attributes of Allah
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Names & Attributes of Allah', 'Week 1 - Module 4: Knowing the Creator.', 4)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Importance of Knowing Allah', 1),
    (v_module_id, v_course_id, 'Mercy and Compassion', 2),
    (v_module_id, v_course_id, 'Justice and Wisdom', 3),
    (v_module_id, v_course_id, 'Power and Authority', 4),
    (v_module_id, v_course_id, 'Love and Nearness', 5),
    (v_module_id, v_course_id, 'Balance Between Hope and Fear', 6),
    (v_module_id, v_course_id, 'Weekly Reflection', 7);

    -- Module 1.5: Fitrah and Natural Belief
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Fitrah and Natural Belief', 'Week 1 - Module 5: The innate disposition toward God.', 5)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'The Concept of Fitrah', 1),
    (v_module_id, v_course_id, 'Faith in Childhood', 2),
    (v_module_id, v_course_id, 'Cultural Influence on Belief', 3),
    (v_module_id, v_course_id, 'Protecting the Fitrah', 4),
    (v_module_id, v_course_id, 'Doubt vs Curiosity', 5),
    (v_module_id, v_course_id, 'Spiritual Awareness', 6),
    (v_module_id, v_course_id, 'Week 1 Final Assessment', 7);

    -- ========================================================================
    -- WEEK 2: Rational Foundations of Belief
    -- ========================================================================
    
    -- Module 2.1: Logical Proofs of God
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Logical Proofs of God', 'Week 2 - Module 1: Intellectual arguments for Islam.', 6)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'The Cosmological Argument', 1),
    (v_module_id, v_course_id, 'The Design Argument', 2),
    (v_module_id, v_course_id, 'The Moral Argument', 3),
    (v_module_id, v_course_id, 'The Argument from Contingency', 4),
    (v_module_id, v_course_id, 'The Argument from Consciousness', 5),
    (v_module_id, v_course_id, 'Refuting Randomness', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 2.2: Islam and Science
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Islam and Science', 'Week 2 - Module 2: History and compatibility.', 7)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'What Is Science?', 1),
    (v_module_id, v_course_id, 'Limits of Scientific Knowledge', 2),
    (v_module_id, v_course_id, 'Misconceptions About Islam and Science', 3),
    (v_module_id, v_course_id, 'Evolution Discussion', 4),
    (v_module_id, v_course_id, 'Miracles Debate', 5),
    (v_module_id, v_course_id, 'Harmony of Revelation and Reason', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 2.3: Revelation and Scripture
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Revelation and Scripture', 'Week 2 - Module 3: The divine source.', 8)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Why Humanity Needs Revelation', 1),
    (v_module_id, v_course_id, 'How Revelation Came', 2),
    (v_module_id, v_course_id, 'Compilation of the Qur’an', 3),
    (v_module_id, v_course_id, 'Preservation of the Qur’an', 4),
    (v_module_id, v_course_id, 'Authenticity of Hadith', 5),
    (v_module_id, v_course_id, 'Transmission Sciences', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 2.4: Prophethood
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Prophethood', 'Week 2 - Module 4: The messengers of Allah.', 9)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Why Prophets Are Necessary', 1),
    (v_module_id, v_course_id, 'Characteristics of Prophets', 2),
    (v_module_id, v_course_id, 'The Finality of Prophet Muhammad ﷺ', 3),
    (v_module_id, v_course_id, 'Proofs of His Prophethood', 4),
    (v_module_id, v_course_id, 'The Sunnah as Guidance', 5),
    (v_module_id, v_course_id, 'Following the Prophet in Modern Times', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 2.5: The Afterlife
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'The Afterlife', 'Week 2 - Module 5: Journey beyond death.', 10)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Death and the Grave', 1),
    (v_module_id, v_course_id, 'Barzakh', 2),
    (v_module_id, v_course_id, 'Resurrection', 3),
    (v_module_id, v_course_id, 'Judgment Day', 4),
    (v_module_id, v_course_id, 'Paradise', 5),
    (v_module_id, v_course_id, 'Hell', 6),
    (v_module_id, v_course_id, 'Week 2 Final Assessment', 7);

    -- ========================================================================
    -- WEEK 3: The Unseen & Divine Decree
    -- ========================================================================
    
    -- Module 3.1: Angels
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Angels', 'Week 3 - Module 1: Celestial beings.', 11)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Creation of Angels', 1),
    (v_module_id, v_course_id, 'Roles of Angels', 2),
    (v_module_id, v_course_id, 'Jibreel and Revelation', 3),
    (v_module_id, v_course_id, 'Recording Deeds', 4),
    (v_module_id, v_course_id, 'Angels and Daily Life', 5),
    (v_module_id, v_course_id, 'Belief Impact on Behavior', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 3.2: Divine Decree (Qadr)
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Divine Decree (Qadr)', 'Week 3 - Module 2: Fate and destiny.', 12)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Meaning of Qadr', 1),
    (v_module_id, v_course_id, 'Knowledge of Allah', 2),
    (v_module_id, v_course_id, 'Writing of Decree', 3),
    (v_module_id, v_course_id, 'Will of Allah', 4),
    (v_module_id, v_course_id, 'Creation of Actions', 5),
    (v_module_id, v_course_id, 'Free Will vs Destiny', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 3.3: Accountability
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Accountability', 'Week 3 - Module 3: Personal responsibility.', 13)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Human Responsibility', 1),
    (v_module_id, v_course_id, 'Minor and Major Sins', 2),
    (v_module_id, v_course_id, 'Repentance', 3),
    (v_module_id, v_course_id, 'Divine Justice', 4),
    (v_module_id, v_course_id, 'Mercy of Allah', 5),
    (v_module_id, v_course_id, 'Hope and Fear Balance', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 3.4: Spiritual Consequences
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Spiritual Consequences', 'Week 3 - Module 4: Impact of deeds.', 14)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Effects of Sin', 1),
    (v_module_id, v_course_id, 'Effects of Good Deeds', 2),
    (v_module_id, v_course_id, 'Barakah', 3),
    (v_module_id, v_course_id, 'Trials and Tests', 4),
    (v_module_id, v_course_id, 'Patience', 5),
    (v_module_id, v_course_id, 'Gratitude', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 3.5: Preparing for the Afterlife
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Preparing for the Afterlife', 'Week 3 - Module 5: Living for eternity.', 15)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Daily Self-Review', 1),
    (v_module_id, v_course_id, 'Building Good Deeds', 2),
    (v_module_id, v_course_id, 'Avoiding Major Sins', 3),
    (v_module_id, v_course_id, 'Making Sincere Tawbah', 4),
    (v_module_id, v_course_id, 'Maintaining Sincerity', 5),
    (v_module_id, v_course_id, 'End-of-Life Reflection', 6),
    (v_module_id, v_course_id, 'Week 3 Assessment', 7);

    -- ========================================================================
    -- WEEK 4: Modern Doubts & Challenges
    -- ========================================================================
    
    -- Module 4.1: Atheism & Secularism
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Atheism & Secularism', 'Week 4 - Module 1: Navigating modern philosophies.', 16)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'What Is Atheism?', 1),
    (v_module_id, v_course_id, 'Rise of Secularism', 2),
    (v_module_id, v_course_id, 'Moral Relativism', 3),
    (v_module_id, v_course_id, 'Responding to Common Claims', 4),
    (v_module_id, v_course_id, 'Faith and Rationality', 5),
    (v_module_id, v_course_id, 'Identity in Secular Society', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 4.2: The Problem of Evil
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'The Problem of Evil', 'Week 4 - Module 2: Why do bad things happen?', 17)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Understanding Suffering', 1),
    (v_module_id, v_course_id, 'Types of Evil', 2),
    (v_module_id, v_course_id, 'Divine Wisdom', 3),
    (v_module_id, v_course_id, 'Human Responsibility', 4),
    (v_module_id, v_course_id, 'Trials as Growth', 5),
    (v_module_id, v_course_id, 'Responding with Patience', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 4.3: Feminism & Islam
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Feminism & Islam', 'Week 4 - Module 3: Gender dynamics and rights.', 18)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Gender in Islam', 1),
    (v_module_id, v_course_id, 'Rights and Responsibilities', 2),
    (v_module_id, v_course_id, 'Misconceptions', 3),
    (v_module_id, v_course_id, 'Equality vs Equity', 4),
    (v_module_id, v_course_id, 'Marriage Roles', 5),
    (v_module_id, v_course_id, 'Modern Debates', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 4.4: Science-Based Doubts
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Science-Based Doubts', 'Week 4 - Module 4: Addressing specific conflicts.', 19)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Evolution Debate', 1),
    (v_module_id, v_course_id, 'Big Bang Theory', 2),
    (v_module_id, v_course_id, 'Scientific Method Limits', 3),
    (v_module_id, v_course_id, 'Philosophy of Science', 4),
    (v_module_id, v_course_id, 'Miracles and Laws', 5),
    (v_module_id, v_course_id, 'Balance Between Faith & Science', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 4.5: Identity Crisis
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Identity Crisis', 'Week 4 - Module 5: Maintaining faith in a globalized world.', 20)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Muslim Identity in West', 1),
    (v_module_id, v_course_id, 'Peer Pressure', 2),
    (v_module_id, v_course_id, 'Social Media Influence', 3),
    (v_module_id, v_course_id, 'Intellectual Arrogance', 4),
    (v_module_id, v_course_id, 'Building Confidence', 5),
    (v_module_id, v_course_id, 'Faith-Based Identity Plan', 6),
    (v_module_id, v_course_id, 'Week 4 Assessment', 7);

    -- ========================================================================
    -- WEEK 5: Strengthening Faith
    -- ========================================================================
    
    -- Module 5.1: Worship and Iman
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Worship and Iman', 'Week 5 - Module 1: Rituals as fuel for faith.', 21)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Salah and Spiritual Impact', 1),
    (v_module_id, v_course_id, 'Fasting and Discipline', 2),
    (v_module_id, v_course_id, 'Zakat and Social Justice', 3),
    (v_module_id, v_course_id, 'Hajj and Unity', 4),
    (v_module_id, v_course_id, 'Du’a and Connection', 5),
    (v_module_id, v_course_id, 'Dhikr and Remembrance', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 5.2: Knowledge and Faith
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Knowledge and Faith', 'Week 5 - Module 2: The power of intellectual clarity.', 22)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Seeking Knowledge', 1),
    (v_module_id, v_course_id, 'Avoiding Misinformation', 2),
    (v_module_id, v_course_id, 'Respecting Scholars', 3),
    (v_module_id, v_course_id, 'Critical Thinking', 4),
    (v_module_id, v_course_id, 'Balanced Understanding', 5),
    (v_module_id, v_course_id, 'Lifelong Learning', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 5.3: Companionship
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Companionship', 'Week 5 - Module 3: The social dimension of faith.', 23)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Choosing Friends', 1),
    (v_module_id, v_course_id, 'Influence of Company', 2),
    (v_module_id, v_course_id, 'Community Importance', 3),
    (v_module_id, v_course_id, 'Mentorship', 4),
    (v_module_id, v_course_id, 'Accountability Partners', 5),
    (v_module_id, v_course_id, 'Protecting Your Environment', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 5.4: Trials and Growth
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Trials and Growth', 'Week 5 - Module 4: Turning pain into purpose.', 24)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Personal Hardships', 1),
    (v_module_id, v_course_id, 'Financial Tests', 2),
    (v_module_id, v_course_id, 'Health Challenges', 3),
    (v_module_id, v_course_id, 'Social Struggles', 4),
    (v_module_id, v_course_id, 'Spiritual Burnout', 5),
    (v_module_id, v_course_id, 'Building Resilience', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 5.5: Consistency
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Consistency', 'Week 5 - Module 5: Habits of successful believers.', 25)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Small Consistent Deeds', 1),
    (v_module_id, v_course_id, 'Habit Formation', 2),
    (v_module_id, v_course_id, 'Avoiding Extremes', 3),
    (v_module_id, v_course_id, 'Balance in Worship', 4),
    (v_module_id, v_course_id, 'Avoiding Burnout', 5),
    (v_module_id, v_course_id, 'Staying Motivated', 6),
    (v_module_id, v_course_id, 'Week 5 Assessment', 7);

    -- ========================================================================
    -- WEEK 6: Living with Certainty
    -- ========================================================================
    
    -- Module 6.1: Applied Tawheed
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Applied Tawheed', 'Week 6 - Module 1: Practical submission.', 26)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Trusting Allah in Decisions', 1),
    (v_module_id, v_course_id, 'Dependence on Allah', 2),
    (v_module_id, v_course_id, 'Avoiding Superstitions', 3),
    (v_module_id, v_course_id, 'Tawheed in Daily Life', 4),
    (v_module_id, v_course_id, 'Gratitude Mindset', 5),
    (v_module_id, v_course_id, 'Accountability Mindset', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 6.2: Building Intellectual Strength
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Building Intellectual Strength', 'Week 6 - Module 2: Defending faith with wisdom.', 27)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Evaluating Arguments', 1),
    (v_module_id, v_course_id, 'Logical Fallacies', 2),
    (v_module_id, v_course_id, 'Debating Respectfully', 3),
    (v_module_id, v_course_id, 'Handling Difficult Questions', 4),
    (v_module_id, v_course_id, 'Maintaining Humility', 5),
    (v_module_id, v_course_id, 'Confidence Without Arrogance', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 6.3: Faith and Leadership
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Faith and Leadership', 'Week 6 - Module 3: Impact on the world.', 28)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Being a Role Model', 1),
    (v_module_id, v_course_id, 'Speaking About Islam', 2),
    (v_module_id, v_course_id, 'Engaging Society', 3),
    (v_module_id, v_course_id, 'Dawah Principles', 4),
    (v_module_id, v_course_id, 'Wisdom in Communication', 5),
    (v_module_id, v_course_id, 'Serving the Community', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 6.4: Personal Faith Blueprint
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Personal Faith Blueprint', 'Week 6 - Module 4: Growth mapping.', 29)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Assessing Your Iman', 1),
    (v_module_id, v_course_id, 'Identifying Weak Areas', 2),
    (v_module_id, v_course_id, 'Creating a 6-Month Plan', 3),
    (v_module_id, v_course_id, 'Setting Spiritual Goals', 4),
    (v_module_id, v_course_id, 'Monitoring Progress', 5),
    (v_module_id, v_course_id, 'Adjusting Your Plan', 6),
    (v_module_id, v_course_id, 'Module Assessment', 7);

    -- Module 6.5: Final Integration
    INSERT INTO course_modules (course_id, title, description, sort_order)
    VALUES (v_course_id, 'Final Integration', 'Week 6 - Module 5: Culmination of studies.', 30)
    RETURNING id INTO v_module_id;
    
    INSERT INTO course_lessons (module_id, course_id, title, sort_order) VALUES
    (v_module_id, v_course_id, 'Review of Key Concepts', 1),
    (v_module_id, v_course_id, 'Revisiting Core Beliefs', 2),
    (v_module_id, v_course_id, 'Personal Reflection', 3),
    (v_module_id, v_course_id, 'Written Faith Statement', 4),
    (v_module_id, v_course_id, 'Oral Presentation', 5),
    (v_module_id, v_course_id, 'Final Exam', 6),
    (v_module_id, v_course_id, 'Course Completion Assessment', 7);

    -- 4. UPDATE COURSE THUMBNAILS (Unsplash)
    -- Main Course Thumbnail
    UPDATE jobs SET 
        logo = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop'
    WHERE id = v_course_id;

    RAISE NOTICE 'Course Foundations of Islamic Faith (210 lessons) created with ID: %', v_course_id;
END $$;
