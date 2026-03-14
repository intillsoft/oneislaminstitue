// safest-course-restructure.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: 'backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// We need exactly 10 lessons per module.
function expandToTenLessons(moduleTitle, existingLessons) {
  const normalLessons = existingLessons.filter(l => !l.toLowerCase().includes('weekly'));
  const weeklyTask = existingLessons.find(l => l.toLowerCase().includes('weekly'));
  
  // Create exactly 9 standard lessons
  const newLessons = [];
  for (let i = 1; i <= 9; i++) {
    if (i <= normalLessons.length) {
      newLessons.push(normalLessons[i - 1].replace(/Lesson \d+\.\d+: /, `Lesson ${i}: `));
    } else {
      newLessons.push(`Lesson ${i}: Deep Dive - Expanding on ${moduleTitle.split(': ')[1] || 'Core Concepts'}`);
    }
  }
  
  // 10th lesson is the Weekly Integration Task
  if (weeklyTask) {
    newLessons.push(weeklyTask.replace(/Lesson \d+\.\d+: /, "Lesson 10: "));
  } else {
    newLessons.push(`Lesson 10: Weekly Integration Task - ${moduleTitle.split(': ')[1] || 'Core Concepts'}`);
  }
  
  return newLessons;
}

const COURSES_BASE = [
  {
    title: "The Compass - A Complete Introduction to Islam",
    description: "Your first step. Your solid foundation. A 6-week journey into the core beliefs and practices of Islam.",
    estimated_duration_hours: 6,
    price: 0,
    subject_area: "Foundations",
    modules: [
       { title: "Module 1: The Big Questions", lessons: expandToTenLessons("Module 1: The Big Questions", ["Lesson 1.1: Who Am I? The Human Search for Identity", "Lesson 1.2: Why Am I Here? The Purpose of Existence", "Lesson 1.3: Where Am I Going? The Journey Ahead", "Lesson 1.4: Weekly Integration Task - My Life Purpose Statement"]) },
       { title: "Module 2: The Concept of God", lessons: expandToTenLessons("Module 2: The Concept of God", ["Lesson 2.1: Who is Allah? Introducing the Creator", "Lesson 2.2: Tawheed Explained - The Heart of Islamic Belief", "Lesson 2.3: The 99 Names - An Overview", "Lesson 2.4: Weekly Integration Task - Recognizing God in My Day"]) },
       { title: "Module 3: The Divine Message", lessons: expandToTenLessons("Module 3: The Divine Message", ["Lesson 3.1: What is the Quran? An Introduction", "Lesson 3.2: How the Quran Was Revealed", "Lesson 3.3: The Structure of the Quran", "Lesson 3.4: Weekly Integration Task - Reading Quran with Fresh Eyes"]) },
       { title: "Module 4: The Final Messenger", lessons: expandToTenLessons("Module 4: The Final Messenger", ["Lesson 4.1: Who Was Muhammad (PBUH)? His Character Before Prophethood", "Lesson 4.2: The Prophetic Mission - An Overview", "Lesson 4.3: Why He Matters Today", "Lesson 4.4: Weekly Integration Task - Emulating One Prophetic Trait"]) },
       { title: "Module 5: The Path of Practice", lessons: expandToTenLessons("Module 5: The Path of Practice", ["Lesson 5.1: The Shahada - The Doorway to Islam", "Lesson 5.2: Salah - The Daily Connection", "Lesson 5.3: Zakat, Sawm, Hajj - The Other Pillars", "Lesson 5.4: Weekly Integration Task - One Small Practice, One Week"]) },
       { title: "Module 6: The Journey Ahead", lessons: expandToTenLessons("Module 6: The Journey Ahead", ["Lesson 6.1: How to Grow After This Course", "Lesson 6.2: Common Challenges for Beginners", "Lesson 6.3: Resources for Lifelong Learning", "Lesson 6.4: Weekly Integration Task - My 90-Day Growth Plan"]) }
    ]
  },
  {
    title: "The Divine Speech - Understanding the Quran",
    description: "Learn to love the Book that changed the world. An 8-week exploration of the Quran's structure, themes, and significance.",
    estimated_duration_hours: 8,
    price: 59,
    subject_area: "Foundations",
    modules: [
       { title: "Module 1: What Makes the Quran Unique?", lessons: expandToTenLessons("Module 1: What Makes the Quran Unique?", ["Lesson 1.1: The Linguistic Miracle", "Lesson 1.2: Literary Excellence and Inimitability", "Lesson 1.3: Preservation Through History", "Lesson 1.4: Weekly Integration Task - Listening with Intention"]) },
       { title: "Module 2: The Revelation Journey", lessons: expandToTenLessons("Module 2: The Revelation Journey", ["Lesson 2.1: How Revelation Came", "Lesson 2.2: The First Revelation", "Lesson 2.3: Gradual Revelation - Wisdom and Purpose", "Lesson 2.4: Weekly Integration Task - Reflecting on Revelation"]) },
       { title: "Module 3: Makkan vs. Madinan Revelations", lessons: expandToTenLessons("Module 3: Makkan vs. Madinan Revelations", ["Lesson 3.1: Characteristics of Makkan Surahs", "Lesson 3.2: Characteristics of Madinan Surahs", "Lesson 3.3: Why the Distinction Matters", "Lesson 3.4: Weekly Integration Task - Comparing Two Surahs"]) },
       { title: "Module 4: The Structure of the Quran", lessons: expandToTenLessons("Module 4: The Structure of the Quran", ["Lesson 4.1: Understanding Surahs and Ayahs", "Lesson 4.2: The Names of the Surahs", "Lesson 4.3: The Logical Flow of the Quran", "Lesson 4.4: Weekly Integration Task - Mapping a Juz"]) },
       { title: "Module 5: Stories of the Prophets in the Quran", lessons: expandToTenLessons("Module 5: Stories of the Prophets in the Quran", ["Lesson 5.1: The Purpose of Prophetic Stories", "Lesson 5.2: Adam, Noah, and Abraham (AS)", "Lesson 5.3: Moses and Jesus (AS)", "Lesson 5.4: Weekly Integration Task - Lessons from One Prophet's Story"]) },
       { title: "Module 6: The Hereafter in the Quran", lessons: expandToTenLessons("Module 6: The Hereafter in the Quran", ["Lesson 6.1: Descriptions of Paradise", "Lesson 6.2: Descriptions of Hell", "Lesson 6.3: The Day of Judgment", "Lesson 6.4: Weekly Integration Task - Living with the Hereafter in Mind"]) },
       { title: "Module 7: Laws and Guidance in the Quran", lessons: expandToTenLessons("Module 7: Laws and Guidance in the Quran", ["Lesson 7.1: Worship and Ritual Laws", "Lesson 7.2: Family and Social Laws", "Lesson 7.3: Economic and Justice Principles", "Lesson 7.4: Weekly Integration Task - Identifying a Quranic Value in My Life"]) },
       { title: "Module 8: How to Approach the Quran Today", lessons: expandToTenLessons("Module 8: How to Approach the Quran Today", ["Lesson 8.1: Etiquettes of Reading", "Lesson 8.2: Finding Personal Connection", "Lesson 8.3: Answering Common Questions", "Lesson 8.4: Weekly Integration Task - My Quran Journey Plan"]) }
    ]
  },
  {
    title: "The Prophet's Way - Life & Lessons from Muhammad (PBUH)",
    description: "The man who changed history. The model for your life. An 8-week journey through the Seerah.",
    estimated_duration_hours: 8,
    price: 69,
    subject_area: "Foundations",
    modules: [
       { title: "Module 1: The World Before Him", lessons: expandToTenLessons("Module 1: The World Before Him", ["Lesson 1.1: Arabia Before Islam - Social Context", "Lesson 1.2: Religious Landscape of the Time", "Lesson 1.3: Political and Economic Conditions", "Lesson 1.4: Weekly Integration Task - Understanding Pre-Islamic Mindset"]) },
       { title: "Module 2: The Early Years", lessons: expandToTenLessons("Module 2: The Early Years", ["Lesson 2.1: Birth and Childhood", "Lesson 2.2: Youth and Young Adulthood", "Lesson 2.3: Marriage to Khadijah", "Lesson 2.4: Weekly Integration Task - Emulating \"Al-Amin\" in Daily Life"]) },
       { title: "Module 3: The Revelation", lessons: expandToTenLessons("Module 3: The Revelation", ["Lesson 3.1: The First Revelation in the Cave", "Lesson 3.2: The Pause and Return of Revelation", "Lesson 3.3: The Command to Preach", "Lesson 3.4: Weekly Integration Task - Responding to a Call"]) },
       { title: "Module 4: The Meccan Period", lessons: expandToTenLessons("Module 4: The Meccan Period", ["Lesson 4.1: Public Preaching and Early Converts", "Lesson 4.2: Persecution and Patience", "Lesson 4.3: The Year of Sorrow", "Lesson 4.4: Weekly Integration Task - Finding Strength in Hardship"]) },
       { title: "Module 5: The Migration (Hijrah)", lessons: expandToTenLessons("Module 5: The Migration (Hijrah)", ["Lesson 5.1: The Plan to Migrate", "Lesson 5.2: The Cave of Thawr", "Lesson 5.3: Arrival in Medina", "Lesson 5.4: Weekly Integration Task - Leaving Something for Allah"]) },
       { title: "Module 6: The Madinan Period", lessons: expandToTenLessons("Module 6: The Madinan Period", ["Lesson 6.1: Building a Community", "Lesson 6.2: Key Battles and Their Lessons", "Lesson 6.3: Treaties and Diplomacy", "Lesson 6.4: Weekly Integration Task - Leadership Lessons"]) },
       { title: "Module 7: The Final Years", lessons: expandToTenLessons("Module 7: The Final Years", ["Lesson 7.1: The Farewell Pilgrimage", "Lesson 7.2: The Final Sermon", "Lesson 7.3: His Final Days and Death", "Lesson 7.4: Weekly Integration Task - Living His Final Advice"]) },
       { title: "Module 8: The Legacy", lessons: expandToTenLessons("Module 8: The Legacy", ["Lesson 8.1: His Character Summarized", "Lesson 8.2: How He Is Loved", "Lesson 8.3: Universal Lessons for Today", "Lesson 8.4: Weekly Integration Task - One Trait to Carry Forward"]) }
    ]
  },
  {
    title: "The Architecture of Prayer - Mastering Salah with Mindfulness",
    description: "From ritual to connection. Transform your prayer. A 6-week course on the inner and outer dimensions of Salah.",
    estimated_duration_hours: 6,
    price: 49,
    subject_area: "Practical Life",
    modules: [
       { title: "Module 1: Why We Pray", lessons: expandToTenLessons("Module 1: Why We Pray", ["Lesson 1.1: The Purpose of Creation", "Lesson 1.2: The Night Journey Story", "Lesson 1.3: The Spiritual Benefits of Prayer", "Lesson 1.4: Weekly Integration Task - 7-Day Prayer Intention Journal"]) },
       { title: "Module 2: The Outer Form", lessons: expandToTenLessons("Module 2: The Outer Form", ["Lesson 2.1: Purity (Wudu) - Inner and Outer Cleanliness", "Lesson 2.2: Conditions of Prayer (Shuruut)", "Lesson 2.3: Physical Movements (Arkaan)", "Lesson 2.4: Weekly Integration Task - Perfecting One Prayer Physically"]) },
       { title: "Module 3: The Inner Dimensions", lessons: expandToTenLessons("Module 3: The Inner Dimensions", ["Lesson 3.1: What is Khushu?", "Lesson 3.2: The State of the Heart in Prayer", "Lesson 3.3: Presence Before God", "Lesson 3.4: Weekly Integration Task - Visualizing Standing Before Allah"]) },
       { title: "Module 4: Understanding What We Say", lessons: expandToTenLessons("Module 4: Understanding What We Say", ["Lesson 4.1: Word-by-Word Meaning of Al-Fatihah", "Lesson 4.2: Meanings of Tashahhud", "Lesson 4.3: Meanings of Common Supplications", "Lesson 4.4: Weekly Integration Task - Reciting with Understanding"]) },
       { title: "Module 5: Praying with Presence", lessons: expandToTenLessons("Module 5: Praying with Presence", ["Lesson 5.1: Techniques to Combat Distractions", "Lesson 5.2: The Prophet's Way of Praying", "Lesson 5.3: Connecting Each Movement to Meaning", "Lesson 5.4: Weekly Integration Task - Distraction Tracking Journal"]) },
       { title: "Module 6: Beyond the Obligatory", lessons: expandToTenLessons("Module 6: Beyond the Obligatory", ["Lesson 6.1: Sunnah Prayers - The Voluntary Gems", "Lesson 6.2: Night Prayer (Tahajjud)", "Lesson 6.3: Duha and Other Voluntary Prayers", "Lesson 6.4: Weekly Integration Task - Adding One Sunnah Prayer"]) }
    ]
  },
  {
    title: "The 99 - Living the Names of Allah",
    description: "Know Him. Become like Him. A 10-week journey through the divine names.",
    estimated_duration_hours: 10,
    price: 79,
    subject_area: "Practical Life",
    modules: [
       { title: "Module 1: The Names of Majesty", lessons: expandToTenLessons("Module 1: The Names of Majesty", ["Lesson 1.1: Ar-Rahman - The Most Merciful", "Lesson 1.2: Ar-Raheem - The Especially Merciful", "Lesson 1.3: Al-Malik - The King, The Sovereign", "Lesson 1.4: Weekly Integration Task - Embodying Mercy"]) },
       { title: "Module 2: The Names of Power", lessons: expandToTenLessons("Module 2: The Names of Power", ["Lesson 2.1: Al-Aziz - The Almighty", "Lesson 2.2: Al-Jabbar - The Compeller", "Lesson 2.3: Al-Mutakabbir - The Supreme", "Lesson 2.4: Weekly Integration Task - Finding Strength in Him"]) },
       { title: "Module 3: The Names of Knowledge", lessons: expandToTenLessons("Module 3: The Names of Knowledge", ["Lesson 3.1: Al-Aleem - The All-Knowing", "Lesson 3.2: Al-Khabir - The All-Aware", "Lesson 3.3: As-Samee - The All-Hearing", "Lesson 3.4: Weekly Integration Task - Living with Awareness"]) },
       { title: "Module 4: The Names of Mercy", lessons: expandToTenLessons("Module 4: The Names of Mercy", ["Lesson 4.1: Al-Ghafoor - The Forgiving", "Lesson 4.2: At-Tawwab - The Accepter of Repentance", "Lesson 4.3: Al-Wadud - The Loving", "Lesson 4.4: Weekly Integration Task - Practicing Forgiveness"]) },
       { title: "Module 5: The Names of Provision", lessons: expandToTenLessons("Module 5: The Names of Provision", ["Lesson 5.1: Ar-Razzaq - The Provider", "Lesson 5.2: Al-Fattah - The Opener", "Lesson 5.3: Al-Wahhab - The Giver of Gifts", "Lesson 5.4: Weekly Integration Task - Trusting in Provision"]) },
       { title: "Module 6: The Names of Guidance", lessons: expandToTenLessons("Module 6: The Names of Guidance", ["Lesson 6.1: Al-Hadi - The Guide", "Lesson 6.2: An-Nur - The Light", "Lesson 6.3: Ar-Rashid - The Righteous Teacher", "Lesson 6.4: Weekly Integration Task - Seeking Guidance"]) },
       { title: "Module 7: The Names of Justice", lessons: expandToTenLessons("Module 7: The Names of Justice", ["Lesson 7.1: Al-Adl - The Just", "Lesson 7.2: Al-Hakam - The Judge", "Lesson 7.3: Al-Muqsit - The Equitable", "Lesson 7.4: Weekly Integration Task - Being Just"]) },
       { title: "Module 8: The Names of Protection", lessons: expandToTenLessons("Module 8: The Names of Protection", ["Lesson 8.1: Al-Hafiz - The Preserver", "Lesson 8.2: Ar-Raqeeb - The Watchful", "Lesson 8.3: Al-Wakeel - The Disposer of Affairs", "Lesson 8.4: Weekly Integration Task - Trusting in Protection"]) },
       { title: "Module 9: The Names of Beauty", lessons: expandToTenLessons("Module 9: The Names of Beauty", ["Lesson 9.1: Al-Jameel - The Beautiful", "Lesson 9.2: Al-Badi - The Incomparable Originator", "Lesson 9.3: Al-Lateef - The Subtle", "Lesson 9.4: Weekly Integration Task - Seeing Beauty"]) },
       { title: "Module 10: Living the Names", lessons: expandToTenLessons("Module 10: Living the Names", ["Lesson 10.1: Making Dua with the Names", "Lesson 10.2: A Lifestyle of Divine Consciousness", "Lesson 10.3: Review and Integration", "Lesson 10.4: Weekly Integration Task - My 99 Names Companion Plan"]) }
    ]
  },
  {
    title: "Living Halal - Navigating Modern Life with Confidence",
    description: "Clear guidance for a complex world. A 6-week course on contemporary Fiqh issues.",
    estimated_duration_hours: 6,
    price: 59,
    subject_area: "Practical Life",
    modules: [
       { title: "Module 1: The Philosophy of Halal", lessons: expandToTenLessons("Module 1: The Philosophy of Halal", ["Lesson 1.1: Why Does God Permit and Forbid?", "Lesson 1.2: The Concept of Purity", "Lesson 1.3: Mercy and Wisdom Behind Rulings", "Lesson 1.4: Weekly Integration Task - Reflecting on Personal Choices"]) },
       { title: "Module 2: Food and Drink", lessons: expandToTenLessons("Module 2: Food and Drink", ["Lesson 2.1: What is Halal Meat? Zabihah Explained", "Lesson 2.2: Alcohol and Intoxicants", "Lesson 2.3: Additives, Gelatin, and Processed Foods", "Lesson 2.4: Weekly Integration Task - Reading Food Labels"]) },
       { title: "Module 3: Finance and Earnings", lessons: expandToTenLessons("Module 3: Finance and Earnings", ["Lesson 3.1: What is Riba? Understanding Interest", "Lesson 3.2: Halal vs. Haram Income", "Lesson 3.3: Mortgages, Loans, and Credit Cards", "Lesson 3.4: Weekly Integration Task - Reviewing Personal Finances"]) },
       { title: "Module 4: Work and Business Ethics", lessons: expandToTenLessons("Module 4: Work and Business Ethics", ["Lesson 4.1: Honesty in Business", "Lesson 4.2: Contracts and Agreements", "Lesson 4.3: Navigating Workplace Challenges", "Lesson 4.4: Weekly Integration Task - Ethical Workplace Review"]) },
       { title: "Module 5: Social Life and Relationships", lessons: expandToTenLessons("Module 5: Social Life and Relationships", ["Lesson 5.1: Gender Interactions", "Lesson 5.2: Friendships and Community", "Lesson 5.3: Non-Muslim Family and Neighbors", "Lesson 5.4: Weekly Integration Task - Building Bridges"]) },
       { title: "Module 6: Personal Development", lessons: expandToTenLessons("Module 6: Personal Development", ["Lesson 6.1: Time Management as Worship", "Lesson 6.2: Health, Fitness, and the Body", "Lesson 6.3: Mental Health and Faith", "Lesson 6.4: Weekly Integration Task - Personal Wellness Plan"]) }
    ]
  },
  {
    title: "The Inner Citadel - Purifying the Heart (Tazkiyah)",
    description: "Free yourself from what holds you back. A 8-week course on spiritual diseases and their cures.",
    estimated_duration_hours: 8,
    price: 69,
    subject_area: "Spiritual Heart",
    modules: [
       { title: "Module 1: The Cardiology of the Soul", lessons: expandToTenLessons("Module 1: The Cardiology of the Soul", ["Lesson 1.1: The Concept of the Heart in Islam", "Lesson 1.2: The Healthy vs. The Sick Heart", "Lesson 1.3: Why Purification Matters", "Lesson 1.4: Weekly Integration Task - Heart Check-Up"]) },
       { title: "Module 2: The Disease of Arrogance", lessons: expandToTenLessons("Module 2: The Disease of Arrogance", ["Lesson 2.1: What is Arrogance?", "Lesson 2.2: Signs and Symptoms", "Lesson 2.3: The Prophet's Warning", "Lesson 2.4: Weekly Integration Task - Humility Practice"]) },
       { title: "Module 3: The Disease of Envy", lessons: expandToTenLessons("Module 3: The Disease of Envy", ["Lesson 3.1: Understanding Hasad", "Lesson 3.2: The Fire That Consumes Good Deeds", "Lesson 3.3: How to Neutralize Envy", "Lesson 3.4: Weekly Integration Task - Celebrating Others"]) },
       { title: "Module 4: The Disease of Love of Wealth", lessons: expandToTenLessons("Module 4: The Disease of Love of Wealth", ["Lesson 4.1: Greed and Stinginess", "Lesson 4.2: Materialism in Modern Times", "Lesson 4.3: Contentment (Qana'a)", "Lesson 4.4: Weekly Integration Task - Practicing Generosity"]) },
       { title: "Module 5: The Disease of Show-Off", lessons: expandToTenLessons("Module 5: The Disease of Show-Off", ["Lesson 5.1: What is Riya?", "Lesson 5.2: Hidden Shirk", "Lesson 5.3: Sincerity (Ikhlas)", "Lesson 5.4: Weekly Integration Task - Secret Acts of Good"]) },
       { title: "Module 6: The Disease of Anger", lessons: expandToTenLessons("Module 6: The Disease of Anger", ["Lesson 6.1: When Anger Controls You", "Lesson 6.2: The Prophet's Guidance on Anger", "Lesson 6.3: Practical Anger Management", "Lesson 6.4: Weekly Integration Task - Anger Journal"]) },
       { title: "Module 7: The Disease of the Tongue", lessons: expandToTenLessons("Module 7: The Disease of the Tongue", ["Lesson 7.1: Backbiting and Slander", "Lesson 7.2: Lying and Excessive Speech", "Lesson 7.3: Guarding the Tongue", "Lesson 7.4: Weekly Integration Task - Speech Audit"]) },
       { title: "Module 8: The Cure - A Spiritual Plan", lessons: expandToTenLessons("Module 8: The Cure - A Spiritual Plan", ["Lesson 8.1: Daily Practices for a Healthy Heart", "Lesson 8.2: Muhasabah (Self-Accounting)", "Lesson 8.3: Dhikr as Medicine", "Lesson 8.4: Weekly Integration Task - My Heart Care Routine"]) }
    ]
  },
  {
    title: "Sacred Connections - Marriage & Family in Islam",
    description: "Build a home on prophetic principles. A 6-week course on Islamic family life.",
    estimated_duration_hours: 6,
    price: 59,
    subject_area: "Spiritual Heart",
    modules: [
       { title: "Module 1: The Purpose of Marriage", lessons: expandToTenLessons("Module 1: The Purpose of Marriage", ["Lesson 1.1: Why Marry in Islam?", "Lesson 1.2: Spiritual, Emotional, and Social Purposes", "Lesson 1.3: Marriage as Half of Faith", "Lesson 1.4: Weekly Integration Task - Reflecting on Intentions"]) },
       { title: "Module 2: Finding a Spouse", lessons: expandToTenLessons("Module 2: Finding a Spouse", ["Lesson 2.1: Qualities to Seek", "Lesson 2.2: The Process in Islam", "Lesson 2.3: Istikhara and Involving Families", "Lesson 2.4: Weekly Integration Task - Creating a Personal Profile"]) },
       { title: "Module 3: The Marriage Contract", lessons: expandToTenLessons("Module 3: The Marriage Contract", ["Lesson 3.1: Rights and Responsibilities", "Lesson 3.2: Understanding Mahr", "Lesson 3.3: The Wedding and Starting Strong", "Lesson 3.4: Weekly Integration Task - Discussing Expectations"]) },
       { title: "Module 4: Building a Loving Home", lessons: expandToTenLessons("Module 4: Building a Loving Home", ["Lesson 4.1: The Prophet as a Husband", "Lesson 4.2: Love Languages in Islam", "Lesson 4.3: Communication and Conflict Resolution", "Lesson 4.4: Weekly Integration Task - One Loving Action Daily"]) },
       { title: "Module 5: Raising Righteous Children", lessons: expandToTenLessons("Module 5: Raising Righteous Children", ["Lesson 5.1: Children as a Trust", "Lesson 5.2: Tarbiyah - Spiritual Upbringing", "Lesson 5.3: Teaching Love of God and the Prophet", "Lesson 5.4: Weekly Integration Task - Quality Time Challenge"]) },
       { title: "Module 6: Navigating Challenges", lessons: expandToTenLessons("Module 6: Navigating Challenges", ["Lesson 6.1: In-Laws and Extended Family", "Lesson 6.2: Financial and Intimate Challenges", "Lesson 6.3: When Things Go Wrong - Seeking Help", "Lesson 6.4: Weekly Integration Task - Building Resilience"]) }
    ]
  },
  {
    title: "The Hereafter - Death, Judgment, and Eternal Life",
    description: "The journey that changes everything. A 6-week course on the afterlife in Islam.",
    estimated_duration_hours: 6,
    price: 49,
    subject_area: "Spiritual Heart",
    modules: [
       { title: "Module 1: The Certainty of Death", lessons: expandToTenLessons("Module 1: The Certainty of Death", ["Lesson 1.1: Why We Forget Death", "Lesson 1.2: The Wisdom in Death", "Lesson 1.3: Remembering the End", "Lesson 1.4: Weekly Integration Task - Reflecting on Mortality"]) },
       { title: "Module 2: The Moment of Death", lessons: expandToTenLessons("Module 2: The Moment of Death", ["Lesson 2.1: What Happens at Death?", "Lesson 2.2: The Angel of Death", "Lesson 2.3: The Good and Bad Death", "Lesson 2.4: Weekly Integration Task - Preparing a Will"]) },
       { title: "Module 3: The Grave", lessons: expandToTenLessons("Module 3: The Grave", ["Lesson 3.1: Life Between Death and Resurrection", "Lesson 3.2: The Questioning (Munkar and Nakir)", "Lesson 3.3: Blessings and Punishments", "Lesson 3.4: Weekly Integration Task - Visiting the Graveyard"]) },
       { title: "Module 4: The Day of Judgment", lessons: expandToTenLessons("Module 4: The Day of Judgment", ["Lesson 4.1: The Signs of the Hour", "Lesson 4.2: The Resurrection and Gathering", "Lesson 4.3: The Books, Scale, and Bridge", "Lesson 4.4: Weekly Integration Task - Accountability Practice"]) },
       { title: "Module 5: Paradise", lessons: expandToTenLessons("Module 5: Paradise", ["Lesson 5.1: Descriptions of Jannah", "Lesson 5.2: Its Gates, Levels, and Joys", "Lesson 5.3: The Greatest Reward - Seeing Allah", "Lesson 5.4: Weekly Integration Task - Working for Jannah"]) },
       { title: "Module 6: Hellfire", lessons: expandToTenLessons("Module 6: Hellfire", ["Lesson 6.1: Descriptions of Jahannam", "Lesson 6.2: Its Severity and Purpose", "Lesson 6.3: Seeking Refuge and Mercy", "Lesson 6.4: Weekly Integration Task - Gratitude for Guidance"]) }
    ]
  },
  {
    title: "Faith in Focus - Answering Life's Big Questions",
    description: "Islam and the questions you're afraid to ask. A 6-week course on contemporary issues.",
    estimated_duration_hours: 6,
    price: 59,
    subject_area: "Contemporary Mind",
    modules: [
       { title: "Module 1: The Problem of Evil", lessons: expandToTenLessons("Module 1: The Problem of Evil", ["Lesson 1.1: Why Does Suffering Exist?", "Lesson 1.2: Islamic Responses to the Problem", "Lesson 1.3: The Purpose of Trials", "Lesson 1.4: Weekly Integration Task - Finding Meaning in Hardship"]) },
       { title: "Module 2: Islam and Science", lessons: expandToTenLessons("Module 2: Islam and Science", ["Lesson 2.1: Evolution and Creation", "Lesson 2.2: The Big Bang and Quranic Miracles", "Lesson 2.3: Harmony or Conflict?", "Lesson 2.4: Weekly Integration Task - Exploring Scientific Verses"]) },
       { title: "Module 3: Women in Islam", lessons: expandToTenLessons("Module 3: Women in Islam", ["Lesson 3.1: Common Misconceptions", "Lesson 3.2: Rights and Spirituality of Women", "Lesson 3.3: Historical and Modern Examples", "Lesson 3.4: Weekly Integration Task - Researching a Female Scholar"]) },
       { title: "Module 4: Islam and the West", lessons: expandToTenLessons("Module 4: Islam and the West", ["Lesson 4.1: Living as a Minority", "Lesson 4.2: Integration vs. Assimilation", "Lesson 4.3: Contributing to Society", "Lesson 4.4: Weekly Integration Task - Community Engagement"]) },
       { title: "Module 5: Extremism and Moderation", lessons: expandToTenLessons("Module 5: Extremism and Moderation", ["Lesson 5.1: The Middle Path", "Lesson 5.2: How Extremism Arises", "Lesson 5.3: The True Meaning of Jihad", "Lesson 5.4: Weekly Integration Task - Promoting Balance"]) },
       { title: "Module 6: The Future of Islam", lessons: expandToTenLessons("Module 6: The Future of Islam", ["Lesson 6.1: Challenges and Opportunities", "Lesson 6.2: Young Muslims Today", "Lesson 6.3: Islam in the Digital Age", "Lesson 6.4: Weekly Integration Task - My Role in the Future"]) }
    ]
  }
];

const genId = () => `blk_${Date.now()}_${Math.floor(Math.random()*99999)}`;

function getMultiPageStructure(isIntegrationTask) {
  // We structure exactly into content_data.pages
  const pages = [
    {
      page_number: 1,
      page_type: 'overview',
      completion_required: true,
      content: [
        {
          id: genId(), type: 'text',
          content: "## Overview\n\nThis lesson provides the foundation for the topic. " + (isIntegrationTask ? "Please complete this multi-day, real-world activity to reinforce your knowledge." : "Review the material and proceed to the video and reflection exercises.")
        }
      ]
    },
    {
      page_number: 2,
      page_type: 'video',
      completion_required: true,
      content: [
        {
          id: genId(), type: 'video',
          content: { url: "" }
        }
      ]
    },
    {
      page_number: 3,
      page_type: 'companion_guide',
      completion_required: true,
      content: [
        {
          id: genId(), type: 'document',
          content: { title: "Companion Guide", description: "Download the study guide to accompany the lecture.", url: "", platform: "PDF" }
        }
      ]
    },
    {
      page_number: 4,
      page_type: 'reflection_journal',
      completion_required: true,
      content: [
        {
          id: genId(), type: 'reflection',
          content: { translation: "Reflect on how this applies to your life.", arabic: "تفكر" }
        }
      ]
    },
    {
      page_number: 5,
      page_type: 'knowledge_check',
      completion_required: true,
      content: [
        {
          id: genId(), type: 'quiz',
          content: { question: "What is the key takeaway from this lesson?", options: ["Option A", "Option B", "Option C", "Option D"], correctIndex: 0, hint: "Review the overview." }
        }
      ]
    }
  ];

  return pages;
}

async function restructureCourses() {
  console.log('--- Archiving Old Courses (Excluding Safe Archive) ---');
  // First, we find all active courses and archive them.
  const { data: existing, error: errC } = await supabase.from('jobs').select('id, status');
  if (errC) { console.error(errC); return; }
  
  if (existing && existing.length > 0) {
    const publishedIds = existing.filter(e => e.status !== 'archived').map(e => e.id);
    if (publishedIds.length > 0) {
      const { error: errA } = await supabase.from('jobs').update({ status: 'archived', is_featured: false }).in('id', publishedIds);
      if (errA) console.error("Failed to archive:", errA);
      else console.log(`Archived ${publishedIds.length} courses.`);
    } else {
      console.log('No published courses to archive.');
    }
  }

  // Deleting previous mistakes
  // We want to delete courses that were created to fix this, if any exist that have names matching the exact titles.
  // We can just rely on the new ones and keep the old ones archived, but if the user wants strict clean up, let's delete courses we might have made in the last run (say, last 2 hours).
  
  console.log('--- Creating New 10 Courses (Strict 10 Modules, 5 Pages) ---');
  const { data: instr } = await supabase.from('users').select('id').in('role', ['instructor', 'admin']).limit(1).single();

  for (const c of COURSES_BASE) {
    process.stdout.write(`Creating Course: ${c.title}... `);
    const { data: newCourse, error: createCErr } = await supabase.from('jobs').insert({
      title: c.title,
      description: c.description,
      status: 'published',
      estimated_duration_hours: c.estimated_duration_hours,
      price: c.price,
      subject_area: c.subject_area,
      total_modules: c.modules.length,
      total_lessons: c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
      instructor_id: instr?.id,
      company: 'One Islam Institute',
      course_level: 'beginner',
      created_by: instr?.id
    }).select().single();

    if (createCErr) {
      console.log(`❌ ERROR: ${createCErr.message}`);
      continue;
    }
    console.log(`✅ [${newCourse.id}]`);
    
    // Modules
    let mSort = 1;
    for (const m of c.modules) {
      const { data: newMod, error: createMErr } = await supabase.from('course_modules').insert({
        course_id: newCourse.id,
        title: m.title,
        sort_order: mSort++,
        is_published: true
      }).select().single();

      if (createMErr) {
        console.error(`  ❌ Mod ERROR: ${createMErr.message}`);
        continue;
      }

      // Lessons
      let lSort = 1;
      for (const lTitle of m.lessons) {
        const isIntegration = lTitle.includes('Weekly Integration Task');
        const pages = getMultiPageStructure(isIntegration);

        // Required JSON structure in the prompt
        const contentData = {
          page_count: 5,
          is_time_gated: isIntegration,
          pages: pages
        };

        const { error: createLErr } = await supabase.from('course_lessons').insert({
          course_id: newCourse.id,
          module_id: newMod.id,
          title: lTitle,
          sort_order: lSort++,
          is_published: true,
          content_blocks: [], // Empty to force reading from pages
          content_data: contentData, // custom data field containing the pages exact structure
          xp_reward: isIntegration ? 50 : 20,
          coin_reward: isIntegration ? 30 : 10,
          duration_minutes: isIntegration ? 120 : 15
        });

        if (createLErr) {
          console.error(`    ❌ Lesson ERROR: ${createLErr.message}`);
        }
      }
    }
  }

  console.log('--- ALL DONE ---');
}

restructureCourses().catch(console.error);
