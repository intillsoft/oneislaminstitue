const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = '15803367-e5d6-474a-8f72-d683ea07deeb';

const LESSON_DATA = [
    {
        title: "Death and the Grave",
        blocks: [
            { type: "callout", content: "Remember frequently the destroyer of pleasures (Death)... For no one remembers it in a hard time except it makes it easy, and no one remembers it in an easy time except it restricts it.", author: "Prophetic Hadith (Sunan At-Tirmidhi 2307)" },
            { type: "objectives", items: ["Understand the reality of Death (Mawt) not as an end, but a transition", "Identify the events that occur immediately upon passing", "Examine the 'Trial of the Grave' (Fitnat al-Qabr)", "Analyze the three questions asked by the Angels Munkar and Nakir"] },
            { type: "text", content: "## The First Stage of the Afterlife\n\nIn Islamic theology, death is not non-existence; it is merely the separation of the soul (Ruh) from the physical body. It is the beginning of the journey to the final destination. The grave is either one of the gardens of Paradise or one of the pits of Hell." },
            { type: "concept", translation: "Sakarat al-Mawt: The stupor or agony of death. The physical and spiritual intensity experienced as the soul begins to detach from the worldly vessel.", arabic: "سكرات الموت" },
            { type: "quran", translation: "Every soul will taste death, and you will only be given your [full] compensation on the Day of Resurrection. (Surah Ali 'Imran 3:185)", arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Extraction", description: "The Angel of Death removes the soul. Smoothly for believers, harshly for deniers.", icon: "Activity" },
                { title: "The Ascent", description: "The soul is taken to the heavens for recording, then returned to the body.", icon: "Sunrise" },
                { title: "The Interrogation", description: "Munkar and Nakir arrive to ask the three fundamental questions.", icon: "Search" },
                { title: "The Window", description: "A window to the soul's final destination (Jannah or Jahannam) is opened.", icon: "Eye" }
            ]},
            { type: "text", content: "### The Three Questions\n\nThe test of the grave is not about memorization; it is about actualization. The answers ('My Lord is Allah, My Religion is Islam, My Prophet is Muhammad') flow naturally only if the person lived by them. A hypocrite will stutter and say 'Ah, ah, I do not know, I heard people saying something...'" },
            { type: "hadith", translation: "When the deceased is placed in his grave... two angels come to him, make him sit up and ask him: 'Who is your Lord?' (Sahih al-Bukhari 1338)", arabic: "مَنْ رَبُّكَ؟" },
            { type: "scholar", translation: "The grave speaks to its inhabitant every day, saying: 'I am the house of loneliness, I am the house of darkness, I am the house of worms.' Only righteous deeds can illuminate it. (Classical Ascetic Tradition)", arabic: "القبر بيت الدود" },
            { type: "infographic", layout: "process", items: [
                { title: "Question 1", description: "Man Rabbuk? (Who is your Lord?)", icon: "HelpCircle" },
                { title: "Question 2", description: "Ma Dinuk? (What is your religion?)", icon: "BookOpen" },
                { title: "Question 3", description: "Man Hadha-r-Rajul? (Who is this man sent among you?)", icon: "User" }
            ]},
            { type: "reflection", translation: "If the exam questions are already known before we die, why do so many fail? Because the tongue only speaks what the heart carries.", arabic: "يثبت الله الذين آمنوا بالقول الثابت" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Frequent remembrance of death cures the heart of worldly greed and prepares it for the first step into eternity." },
            { type: "quiz", question: "What is the 'Destroyer of Pleasures'?", options: ["Poverty", "Old age", "Death", "Sickness"], correctIndex: 2, hint: "Hadith in Tirmidhi." },
            { type: "quiz", question: "What are the names of the two angels who question a person in the grave?", options: ["Jibreel and Mika'il", "Munkar and Nakir", "Harut and Marut", "Malik and Ridwan"], correctIndex: 1, hint: "The angels of interrogation." },
            { type: "quiz", question: "If the answers to the three questions of the grave are known now, why would someone fail to answer them?", options: ["They might forget the Arabic", "Because the answers in the grave are determined by one's actions and heart, not mere memorization", "Because the angels are too loud", "Because it is a trick question"], correctIndex: 1, hint: "The tongue speaks what the heart lived." },
            { type: "quiz", question: "What happens to the soul immediately after death?", options: ["It ceases to exist", "It wanders the earth as a ghost", "It is extracted by the Angel of Death and begins its transition", "It becomes an angel"], correctIndex: 2, hint: "Death is a transition, not an end." },
            { type: "quiz", question: "According to the lesson, the grave is described as being either...?", options: ["A garden of Paradise or a pit of Hell", "A waiting room or a library", "Always dark and scary", "The final destination"], correctIndex: 0, hint: "A window is opened for the soul." },
            { type: "document", title: "The Soul's Journey After Death", description: "Ibn al-Qayyim's detailed treatise (Kitab ar-Ruh).", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "Understanding the Grave", description: "Theological explanation of the physical and spiritual realities of burial.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" }
        ]
    },
    {
        title: "Barzakh",
        blocks: [
            { type: "callout", content: "Between this world and the Hereafter is a boundary. You cannot return, yet you have not fully arrived.", author: "Theological Definition" },
            { type: "objectives", items: ["Define 'Barzakh' and its linguistic meaning as a 'Barrier'", "Understand the nature of time and experience in the realm of Barzakh", "Analyze the concept of ongoing reward or punishment (Sadaqah Jariyah)", "Acknowledge the connection between the living and the inhabitants of Barzakh"] },
            { type: "text", content: "## The Intermediate Realm\n\nThe 'Barzakh' is the waiting period between a person's death and the general Resurrection (Day of Judgment). It is a completely different dimension of existence where the rules of time and space as we know them do not apply." },
            { type: "concept", translation: "Barzakh: A barrier or partition. The intermediate state where souls reside from the time of death until the Day of Resurrection.", arabic: "برزخ" },
            { type: "quran", translation: "And behind them is a barrier (Barzakh) until the Day they are resurrected. (Surah Al-Mu'minun 23:100)", arabic: "وَمِن وَرَائِهِم بَرْزَخٌ إِلَىٰ يَوْمِ يُبْعَثُونَ" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Barrier", description: "Souls cannot return to the worldly life.", icon: "Lock" },
                { title: "The Experience", description: "Time passes quickly for the believer in bliss, and slowly for the sufferer.", icon: "Clock" },
                { title: "The Connection", description: "The Prophet (PBUH) returns greetings of peace to those who send it to him.", icon: "MessageCircle" },
                { title: "Continuous Deeds", description: "Income of good deeds from ongoing charity/knowledge/children.", icon: "Activity" }
            ]},
            { type: "text", content: "### The Three Things That Remain\n\nWhen a person enters Barzakh, their book of deeds is generally closed. However, the Prophet (PBUH) mentioned three exceptions that continue to generate 'passive reward' for the deceased: ongoing charity, beneficial knowledge, and a righteous child who prays for them." },
            { type: "hadith", translation: "When a human being dies, all his deeds come to an end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for him. (Sahih Muslim 1631)", arabic: "إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ" },
            { type: "scholar", translation: "The souls of the believers in Barzakh are like green birds in the trees of Paradise, while the souls of the martyrs have special, higher stations. (Summary of Classical Aqidah)", arabic: "أرواح المؤمنين" },
            { type: "infographic", layout: "process", items: [
                { title: "Sadaqah Jariyah", description: "Building a well or mosque.", icon: "Droplet" },
                { title: "Ilm Nafi'", description: "Writing a book or teaching a student.", icon: "BookOpen" },
                { title: "Walad Salih", description: "A child raising their hands for you.", icon: "User" }
            ]},
            { type: "reflection", translation: "If I were to enter Barzakh today, which of the 'three continuous things' would keep sending me light?", arabic: "ينقطع عمله إلا من ثلاث" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Barzakh is a waiting room, but it is deeply influenced by what you left behind in the waiting room of the world." },
            { type: "quiz", question: "What does the word 'Barzakh' literally mean?", options: ["A fast horse", "A barrier or partition", "A type of tree", "A beautiful house"], correctIndex: 1, hint: "Wa min wara'ihim barzakhun..." },
            { type: "quiz", question: "Can a soul in Barzakh return to the worldly life to fix their mistakes?", options: ["Yes, once", "No, there is a barrier until Resurrection", "Only if they ask nicely", "Yes, as another person"], correctIndex: 1, hint: "Surah Al-Mu'minun 23:100." },
            { type: "quiz", question: "Which of the following does NOT continue to benefit a person in Barzakh after death?", options: ["A righteous child who prays for them", "Ongoing charity (like a water well)", "Money left untouched in a bank account", "Beneficial knowledge they spread"], correctIndex: 2, hint: "Passive income requires an active spiritual investment." },
            { type: "quiz", question: "Where are the souls of the believers generally described to be during Barzakh?", options: ["Wandering the earth", "Asleep and unaware", "Attached to green birds in the trees of Paradise", "In the sun"], correctIndex: 2, hint: "A taste of the final garden." },
            { type: "quiz", question: "Are the rules of time and space in Barzakh identical to our physical world?", options: ["Yes", "No, they operate in a different dimension", "Only slightly different", "No one knows"], correctIndex: 1, hint: "The intermediate realm." },
            { type: "document", title: "Life in Barzakh", description: "Theological exploration of the time between death and Resurrection.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Types of Sadaqah Jariyah", description: "Practical guide to leaving a lasting legacy.", url: "https://yaqeeninstitute.org/", platform: "Islamic Ethics" }
        ]
    },
    {
        title: "Resurrection",
        blocks: [
            { type: "callout", content: "Does man think that We will not assemble his bones? Yes. [We are] Able [even] to proportion his fingertips.", author: "Surah Al-Qiyamah 75:3-4" },
            { type: "objectives", items: ["Understand the blowing of the Trumpet (Sur) which initiates Resurrection", "Identify the nature of the 'Great Standing' (Hashr)", "Analyze the physical recreation of the body", "Address atheistic arguments against bodily resurrection"] },
            { type: "text", content: "## The Great Awakening\n\nWhen the first trumpet is blown by Israfil, all living things will perish. When the second trumpet is blown, every human being from Adam to the last person will be physically resurrected from their graves to stand before Allah." },
            { type: "concept", translation: "Al-Ba'th wa an-Nushur: The Resurrection and the Spreading forth. The physical reconstitution of bodies and their reuniting with their souls.", arabic: "البعث والنشور" },
            { type: "quran", translation: "And the Horn will be blown, and whoever is in the heavens and whoever is on the earth will fall dead except whom Allah wills. Then it will be blown again, and at once they will be standing, looking on. (Surah Az-Zumar 39:68)", arabic: "وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ وَمَن فِي الْأَرْضِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "First Blow (Sa'iqah)", description: "The terrifying sound that ends the world.", icon: "Activity" },
                { title: "Second Blow (Ba'th)", description: "The call that resurrects all creation.", icon: "Zap" },
                { title: "The Coccyx (Ajb adh-Dhanab)", description: "The seed from which the body is regrown.", icon: "Database" },
                { title: "The Gathering (Hashr)", description: "Standing barefoot, naked, and uncircumcised.", icon: "Users" }
            ]},
            { type: "text", content: "### The Seed of Man\n\nThe Prophet (PBUH) explained that the entirety of a human decays in the earth except for a tiny bone at the base of the spine (coccyx). From this 'seed', Allah will send down a rain that rebuilds the human body exactly as it was, down to the fingertips." },
            { type: "hadith", translation: "There is nothing of the human body that does not decay except one bone; that is the little bone at the end of the coccyx of which the human body will be recreated on the Day of Resurrection. (Sahih al-Bukhari 4935)", arabic: "كُلُّ ابْنِ آدَمَ يَبْلَى إِلاَّ عَجْبَ الذَّنَبِ" },
            { type: "scholar", translation: "The One who created the universe from nothing the first time is certainly capable of reassembling it a second time. The second creation is logically easier than the first. (Classical Kalam Argument)", arabic: "وهو أهون عليه" },
            { type: "infographic", layout: "process", items: [
                { title: "The Rain", description: "Water from the sky causing bodies to grow.", icon: "CloudRain" },
                { title: "The Trumpet", description: "Souls fly back to their specific bodies.", icon: "Wind" },
                { title: "The Standing", description: "Mankind rises from the earth.", icon: "ArrowUp" }
            ]},
            { type: "text", content: "### The Great Standing (Al-Hashr)\n\nPeople will stand for a period of up to 50,000 years. The sun will be brought close, and people will sweat according to the level of their deeds. The terror of that day is so immense that mothers will drop their nursing infants, and people will look intoxicated though they are not." },
            { type: "reflection", translation: "If I am resurrected exactly as I died, does my current state of heart reflect how I want to be found on that Day?", arabic: "يبعث كل عبد على ما مات عليه" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Resurrection proves that our actions are not evaporating into the void. They are being recorded for a Day of absolute accountability." },
            { type: "quiz", question: "What is the name of the angel tasked with blowing the Trumpet (Sur)?", options: ["Jibreel", "Mika'il", "Israfil", "Izra'il"], correctIndex: 2, hint: "The blower of the horn." },
            { type: "quiz", question: "According to the Hadith, from what 'seed' will the human body be recreated?", options: ["The heart", "The little bone at the end of the coccyx (tailbone)", "The skull", "The fingertips"], correctIndex: 1, hint: "Ajb adh-Dhanab." },
            { type: "quiz", question: "What happens at the FIRST blow of the trumpet?", options: ["Everyone is resurrected", "All living things in the heavens and earth perish (except who Allah wills)", "The stars turn into gold", "It rains fire"], correctIndex: 1, hint: "It is the end of the world." },
            { type: "quiz", question: "What does Allah specifically mention in Surah Al-Qiyamah 75:4 to prove His detailed power of resurrection?", options: ["He can recreate the fingertips/fingerprints perfectly", "He can recreate hair", "He can recreate the world larger", "He can turn humans into angels"], correctIndex: 0, hint: "Bananah." },
            { type: "quiz", question: "What is the logical argument the Quran uses against those who deny Resurrection?", options: ["It's just a leap of faith", "If Allah could create us from nothing the first time, recreating us is logically even easier", "It doesn't use logic", "It's a metaphor"], correctIndex: 1, hint: "Wa huwa ahwanu 'alayh." },
            { type: "document", title: "The Reality of Resurrection", description: "Thematic Tafsir of Surah Al-Qiyamah.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Stages of the Day of Judgment", description: "A chronological mapping of the events of the Last Day.", url: "https://kalamullah.com/", platform: "Classical Library" }
        ]
    },
    {
        title: "Judgment Day",
        blocks: [
            { type: "callout", content: "And We place the scales of justice for the Day of Resurrection, so no soul will be treated unjustly at all. And if there is [even] the weight of a mustard seed, We will bring it forth.", author: "Surah Al-Anbiya 21:47" },
            { type: "objectives", items: ["Understand the presentation of the 'Books of Deeds'", "Analyze the concept of 'The Scale' (Al-Mizan)", "Explore the 'Siraat' (The Bridge over Hell)", "Identify the 'Intercession' (Shafa'ah) of Prophet Muhammad (PBUH)"] },
            { type: "text", content: "## The Court of Perfect Justice\n\nAfter the long standing, the Judgment begins. This is the moment where every hidden secret is made manifest, and absolute justice is executed without a single atom of oppression." },
            { type: "concept", translation: "Al-Mizan: The literal Scale that will be set up to weigh the deeds of the servants. Good deeds are weighed, and sincerity makes them heavier.", arabic: "الميزان" },
            { type: "quran", translation: "Then as for one whose scales are heavy [with good deeds], He will be in a pleasant life. But as for one whose scales are light, His refuge will be an abyss. (Surah Al-Qari'ah 101:6-9)", arabic: "فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ" },
            { type: "infographic", layout: "grid", items: [
                { title: "The Books", description: "Records handed in the right hand (success) or left hand/behind the back (ruin).", icon: "Book" },
                { title: "The Scale", description: "Weighing the physical weight of sincere actions.", icon: "Scale" },
                { title: "The Bridge (Siraat)", description: "Sharper than a sword, thinner than a hair. Crossed based on one's deeds in life.", icon: "Activity" },
                { title: "The Intercession", description: "The Prophet's plea for his Ummah.", icon: "Heart" }
            ]},
            { type: "text", content: "### The Heaviest Thing on the Scale\n\nWhat makes a deed 'heavy'? It is not just quantity, but quality (sincerity/Ikhlas). The Prophet (PBUH) stated that nothing weighs heavier on the Scale of a believer than 'good character' (Husn al-Khuluq)." },
            { type: "hadith", translation: "There is nothing heavier upon the Scale than good character. (Sunan Abi Dawud 4799)", arabic: "مَا مِنْ شَيْءٍ أَثْقَلُ فِي الْمِيزَانِ مِنْ حُسْنِ الْخُلُقِ" },
            { type: "scholar", translation: "The Siraat in the Afterlife is a direct reflection of the 'Siraat al-Mustaqim' (Straight Path) in this life. If you walked the path of Islam easily here, you will cross the bridge at lightning speed there. (Ibn al-Qayyim)", arabic: "الصراط المستقيم والصراط الأخروي" },
            { type: "infographic", layout: "process", items: [
                { title: "The Light", description: "Believers are given light corresponding to their faith to cross the dark bridge.", icon: "Sun" },
                { title: "The Speed", description: "Some cross like a blink, some like the wind, some crawling.", icon: "Wind" },
                { title: "The Hooks", description: "Sins act like hooks trying to drag a person down.", icon: "ArrowDown" }
            ]},
            { type: "text", content: "### The Great Intercession\n\nWhen humanity is desperate for the Judgment to begin, they will go to Adam, Nuh, Ibrahim, Musa, and Isa—all will say 'Myself, Myself'. Finally, they will come to Muhammad (PBUH) who will say, 'Ana Laha' (I am for it). He will prostrate before Allah, and Allah will permit him to intercede." },
            { type: "reflection", translation: "If my book of deeds were published on the internet tomorrow, how terrified would I be? On Judgment Day, it will be read to the entire universe.", arabic: "اقرأ كتابك كفى بنفسك اليوم عليك حسيبا" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "The justice of that Day will be so precise that a hornless sheep will retaliate against the horned sheep that struck it. No wrong will go unrighted." },
            { type: "quiz", question: "What is 'Al-Mizan'?", options: ["A type of book", "The Bridge", "The absolute Scale of Justice", "A tree"], correctIndex: 2, hint: "It determines the weight of deeds." },
            { type: "quiz", question: "What did the Prophet (PBUH) say is the HEAVIEST thing on the Scale?", options: ["Praying all night", "Good character (Husn al-Khuluq)", "Donating millions", "Fasting every day"], correctIndex: 1, hint: "Sunan Abi Dawud 4799." },
            { type: "quiz", question: "According to Ibn al-Qayyim, the speed at which you cross the 'Siraat' (Bridge) depends on what?", options: ["Your physical weight", "How easily you walked the Straight Path (Islam) in this life", "Your age", "Your wealth"], correctIndex: 1, hint: "The physical bridge is a reflection of your spiritual path." },
            { type: "quiz", question: "What does a believer receive in their Right Hand?", options: ["Their book of deeds, signaling success", "A sword", "A curse", "Nothing"], correctIndex: 0, hint: "Fa amma man utiya kitabahu bi-yameenihi..." },
            { type: "quiz", question: "Which Prophet is granted the 'Great Intercession' to begin the trial on Judgment Day?", options: ["Isa", "Musa", "Ibrahim", "Muhammad (PBUH)"], correctIndex: 3, hint: "He says 'Ana laha' (I am for it)." },
            { type: "document", title: "The Scales of Justice", description: "Detailed look at what increases the weight of good deeds.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "The Concept of Shafa'ah", description: "Who can intercede and who will receive it?", url: "https://yaqeeninstitute.org/", platform: "Theology" }
        ]
    },
    {
        title: "Paradise",
        blocks: [
            { type: "callout", content: "I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever conceived.", author: "Hadith Qudsi (Sahih al-Bukhari 3244)" },
            { type: "objectives", items: ["Examine the eternal nature and physical descriptions of Jannah", "Identify the different levels of Paradise, particularly Al-Firdaws", "Understand that the greatest reward is the Vision of Allah", "Analyze how worldly suffering is forgotten in Paradise"] },
            { type: "text", content: "## The True Home\n\nJannah (Paradise) is not merely a 'better' version of this world; it is a fundamentally different reality devoid of pain, boredom, aging, illness, or negative emotions. It is the original home of humanity, which Adam and Hawa left temporarily." },
            { type: "concept", translation: "Jannah: Literally 'The Garden', because its trees are so dense they conceal what is inside. The ultimate abode of eternal bliss and reward.", arabic: "الجنة" },
            { type: "quran", translation: "Indeed, those who believe and do righteous deeds - for them are the Gardens of Pleasure (Jannat an-Na'im). (Surah Luqman 31:8)", arabic: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتُ النَّعِيمِ" },
            { type: "infographic", layout: "grid", items: [
                { title: "100 Levels", description: "The highest being Jannat al-Firdaws, directly under the Throne of Allah.", icon: "ArrowUp" },
                { title: "8 Gates", description: "Including Ar-Rayyan (for those who fast) and Baab As-Salat.", icon: "DoorOpen" },
                { title: "The Soil & Bricks", description: "Bricks of gold/silver, mortar of musk, pebbles of pearls.", icon: "Star" },
                { title: "Eternal Youth", description: "No illness, no aging, no death.", icon: "Activity" }
            ]},
            { type: "text", content: "### The Greatest Reward (Ar-Ru'yah)\n\nWhile the rivers of milk and honey, palaces, and companions are beyond imagination, the scholars agree that the highest pinnacle of joy in Jannah is not a physical pleasure. It is the moment the veil is removed and the believers look upon the Face of Allah." },
            { type: "hadith", translation: "When the inhabitants of Paradise enter Paradise... Allah will say: 'Do you want anything more?'... Then He will remove the veil and they will not have been given anything more beloved to them than looking at their Lord. (Sahih Muslim 181)", arabic: "فَمَا أُعْطُوا شَيْئًا أَحَبَّ إِلَيْهِمْ مِنَ النَّظَرِ إِلَى رَبِّهِمْ" },
            { type: "scholar", translation: "The inhabitants of Jannah will not sleep, because sleep is the brother of death, and there is no death in Jannah. They will have eternal, wakeful bliss. (Classical Reflection)", arabic: "الجنة دار البقاء" },
            { type: "infographic", layout: "process", items: [
                { title: "Entrance", description: "Welcomed by Angels offering peace.", icon: "CheckCircle" },
                { title: "Purification", description: "All envy or ill-feeling is removed from hearts.", icon: "Wind" },
                { title: "The Dip", description: "A single dip in Jannah erases all trauma of the worldly life.", icon: "Droplet" }
            ]},
            { type: "text", content: "### The Dip in Jannah\n\nThe Prophet (PBUH) mentioned that the person who suffered the MOST in the world will be dipped once in Jannah and asked, 'Did you ever see suffering?' They will swear by Allah: 'No my Lord, I never experienced any hardship.' One moment of eternity erases a lifetime of pain." },
            { type: "reflection", translation: "If I am told I can have a guaranteed palace filled with eternal peace, why am I so anxious about losing temporary things in this 70-year life?", arabic: "فما متاع الحياة الدنيا في الآخرة إلا قليل" },
            { type: "video", url: "https://www.youtube.com/watch?v=Fj2M0yX-xR8" },
            { type: "conclusion", content: "Jannah is the ultimate proof of Allah's generosity. He buys from believers their temporary lives and wealth, and pays them with Eternity." },
            { type: "quiz", question: "According to the Hadith Qudsi, the rewards of Jannah are what...?", options: ["Exactly like worldly rewards", "What no eye has seen, no ear has heard, and no heart conceived", "Only mental/spiritual happiness", "Temporary"], correctIndex: 1, hint: "Beyond human imagination." },
            { type: "quiz", question: "What is the highest level of Jannah, located directly under the Throne of Allah?", options: ["Jannat Adn", "Jannat al-Firdaws", "Jannat al-Ma'wa", "Dar al-Salam"], correctIndex: 1, hint: "The Prophet said to ask for this specific level." },
            { type: "quiz", question: "What is universally agreed upon as the absolute 'Greatest Reward' in Jannah?", options: ["The golden houses", "The food and drink", "The Vision (seeing) of Allah's Face", "Never being tired"], correctIndex: 2, hint: "An-Nazaru ila wajhillah." },
            { type: "quiz", question: "What happens to the person who suffered the MOST in the world after a single 'dip' in Jannah?", options: ["They ask for revenge", "They forget they ever experienced any suffering or hardship", "They still feel pain occasionally", "They sleep for a long time"], correctIndex: 1, hint: "Eternity outweighs temporary trauma completely." },
            { type: "quiz", question: "How many gates does Jannah have, according to authentic traditions?", options: ["One", "Three", "Seven", "Eight"], correctIndex: 3, hint: "Thamaniyat abwab." },
            { type: "document", title: "Descriptions of Paradise", description: "Ibn al-Qayyim's 'Hadi al-Arwah' - detailed descriptions based on Quran and Sunnah.", url: "https://kalamullah.com/", platform: "Classical Library" },
            { type: "document", title: "The Vision of Allah", description: "Theological importance of Ar-Ru'yah in Islamic Creed.", url: "https://yaqeeninstitute.org/", platform: "Theology" }
        ]
    },
    {
        title: "Hell",
        blocks: [
            { type: "callout", content: "And fear the Fire, which has been prepared for the disbelievers.", author: "Surah Ali 'Imran 3:131" },
            { type: "objectives", items: ["Understand the reality of Jahannam as a manifestation of Divine Justice", "Identify the warnings regarding its intensity and depth", "Examine that Allah does not wrong anyone; entry is based on conscious rejection", "Analyze the concept of temporary vs eternal punishment"] },
            { type: "text", content: "## The Manifestation of Justice\n\nWhile Jannah is the manifestation of Allah's infinite Mercy, Jahannam (Hellfire) is the manifestation of His absolute Justice. It is reserved for those who intentionally rejected the truth, committed oppression, and caused immense harm without repentance." },
            { type: "concept", translation: "Jahannam: The Hellfire. A literal and physical place of acute punishment, regret, and sorrow for the oppressors and deniers.", arabic: "جهنم" },
            { type: "quran", translation: "Indeed, those who disbelieve in Our verses - We will drive them into a Fire. Every time their skins are roasted through We will replace them with other skins so they may taste the punishment. (Surah An-Nisa 4:56)", arabic: "كُلَّمَا نَضِجَتْ جُلُودُهُم بَدَّلْنَاهُمْ جُلُودًا غَيْرَهَا" },
            { type: "infographic", layout: "grid", items: [
                { title: "Its Depth", description: "A stone dropped into it would fall for 70 years before hitting the bottom.", icon: "ArrowDown" },
                { title: "Its Heat", description: "The fire of this world is only 1/70th part of the fire of Jahannam.", icon: "Flame" },
                { title: "The Fuel", description: "Men and stones.", icon: "Database" },
                { title: "The Food/Drink", description: "Zaqqum (a bitter tree) and boiling water.", icon: "Droplet" }
            ]},
            { type: "text", content: "### The Expiation for Believers\n\nAhl al-Sunnah wal-Jama'ah (Mainstream Islam) believes that an oppressor who had a mustard seed of true 'Iman' (Faith) in their heart will not stay in the fire eternally. They may be punished for their major sins to be purified, but they will eventually be taken out. Eternity in the fire is for the clear deniers (Kuffar)." },
            { type: "hadith", translation: "The fire of this world... is only one-seventieth part of the fire of Hell. (Sahih al-Bukhari 3265)", arabic: "نَارُكُمْ هَذِهِ... جُزْءٌ مِنْ سَبْعِينَ جُزْءًا مِنْ نَارِ جَهَنَّمَ" },
            { type: "scholar", translation: "Allah is too Merciful to punish someone eternally who had a drop of faith, but He is too Just to let the oppressor of humanity walk free without facing the fire they ignited in the lives of others. (Theological Principle)", arabic: "العدل الإلهي" },
            { type: "infographic", layout: "process", items: [
                { title: "The Dip", description: "One dip in Jahannam makes a person swear they never saw any good in life.", icon: "Wind" },
                { title: "The Regret", description: "The psychological pain is harsher than the physical fire.", icon: "Eye" },
                { title: "The Final Death", description: "Death itself is brought like a ram and slaughtered between Jannah and Jahannam; eternity begins.", icon: "Lock" }
            ]},
            { type: "text", content: "### The Concept of Regret (Hasrah)\n\nThe worst punishment of the Fire is not the heat; it is the realization that they were created for Jannah but traded it for absolutely nothing. It is the absolute isolation from the Mercy of the Creator." },
            { type: "reflection", translation: "If a doctor tells you to avoid a poison, you avoid it out of fear for your temporary body. The Creator tells you to avoid grave sins; are you avoiding them out of fear for your eternal soul?", arabic: "قوا أنفسكم وأهليكم نارا" },
            { type: "video", url: "https://www.youtube.com/watch?v=kYI9g9d-xQk" },
            { type: "conclusion", content: "Jahannam is the ultimate deterrent. The warnings are vivid precisely because Allah's Mercy wishes for us to avoid it." },
            { type: "quiz", question: "What is Jahannam a manifestation of in Islamic theology?", options: ["Allah's Mercy", "Allah's Absolute Justice", "Random chance", "A metaphor"], correctIndex: 1, hint: "It is the precise balancing of scales for oppressors." },
            { type: "quiz", question: "What is the heat ratio of Jahannam compared to the fire of the worldly life?", options: ["Twice as hot", "10 times hotter", "70 times hotter", "The same"], correctIndex: 2, hint: "Sabe'ena juz'an." },
            { type: "quiz", question: "In mainstream Islamic theology, does a believer with major, unrepented sins (who still has a mustard seed of Iman) stay in Hell forever?", options: ["Yes, eternally", "No, they may be punished to be purified but will eventually be taken out", "They never enter", "They become angels"], correctIndex: 1, hint: "Iman prevents eternal damnation." },
            { type: "quiz", question: "According to Surah An-Nisa 4:56, what happens when the skins are 'roasted through'?", options: ["They stop feeling pain", "They are replaced with other skins so they may taste the punishment", "They turn to ash permanently", "They fall asleep"], correctIndex: 1, hint: "Baddalnahum juloodan ghayraha." },
            { type: "quiz", question: "What is considered psychologically worse than the physical fire of Hell?", options: ["The dark", "The noise", "The absolute 'Regret' (Hasrah) and distance from Allah's Mercy", "There is no psychological pain"], correctIndex: 2, hint: "The realization of what was lost." },
            { type: "document", title: "The Reality of Hellfire", description: "Spiritual warnings and descriptions from authentic Hadith.", url: "https://yaqeeninstitute.org/", platform: "Yaqeen Institute" },
            { type: "document", title: "Fearing the Fire", description: "How the Sahaba utilized the fear of Jahannam to soften their hearts.", url: "https://kalamullah.com/", platform: "Spirituality" }
        ]
    },
    {
        title: "Week 2 Final Assessment",
        blocks: [
            { type: "callout", content: "And whoever desires the Hereafter and exerts the effort due to it while he is a believer - it is those whose effort is ever appreciated [by Allah].", author: "Surah Al-Isra 17:19" },
            { type: "objectives", items: ["Demonstrate comprehension of the theological timeline from Death to Eternity", "Verify understanding of the physical/spiritual resurrection process", "Confirm knowledge of the functions of the Mizan and Siraat", "Differentiate between the temporary and eternal abodes"] },
            { type: "text", content: "## Escaping the Illusions of the World\n\nYou have completed the study of the unseen realities of the Afterlife. This assessment verifies your understanding of the stages of Al-Akhirah, from the isolation of the grave to the absolute justice of Judgment Day." },
            { type: "infographic", layout: "grid", items: [
                { title: "Barzakh", description: "The intermediate waiting room of the soul.", icon: "Lock" },
                { title: "Ba'th (Resurrection)", description: "The physical recreation of humanity.", icon: "Sunrise" },
                { title: "Hashr & Mizan", description: "The Great Standing and the weighing of action via sincerity.", icon: "Scale" },
                { title: "The Final Abodes", description: "Jannah and Jahannam. Eternity begins.", icon: "Star" }
            ]},
            { type: "text", content: "### Final Knowledge Verification\n\nPlease answer the following questions to verify your completion of Module 10." },
            { type: "quiz", question: "What are the three questions asked by Munkar and Nakir in the Grave?", options: ["Name, Age, Address", "Who is your Lord? What is your Religion? Who is this Prophet?", "How much money? How many degrees? How many children?", "Did you pray? Did you fast? Did you give charity?"], correctIndex: 1, hint: "The foundational truths." },
            { type: "quiz", question: "What is the 'Ajb adh-Dhanab' (The Coccyx)?", options: ["A type of tree in Jannah", "The tiny bone / seed from which the human body will be physically resurrected", "The Bridge over Hell", "A type of punishment"], correctIndex: 1, hint: "The seed of man." },
            { type: "quiz", question: "What does the word 'Barzakh' mean?", options: ["Paradise", "Hell", "Barrier / Intermediate Realm", "Resurrection"], correctIndex: 2, hint: "The partition you cannot cross back over." },
            { type: "quiz", question: "On the Day of Judgment, what does the 'Mizan' specifically measure?", options: ["Only your height", "The weight of your deeds, multiplied by your sincerity (Ikhlas)", "How loudly you can speak", "Only your bad deeds"], correctIndex: 1, hint: "Quality and Sincerity give it weight." },
            { type: "quiz", question: "Which characteristic did the Prophet (PBUH) say is the 'heaviest thing' on the Mizan?", options: ["Good Character (Husn al-Khuluq)", "Donating gold", "Sleeping early", "Eating little"], correctIndex: 0, hint: "Your ethics weigh heavily." },
            { type: "quiz", question: "According to authentic tradition, what happens to the person who suffered the MOST in the world after one dip in Jannah?", options: ["They are angry", "They swear they never experienced any suffering in their life", "They remember everything vividly", "They fall asleep"], correctIndex: 1, hint: "Eternity outweighs 70 years." },
            { type: "quiz", question: "What is the scholarly term for the 'Greatest Reward' in Jannah?", options: ["Ar-Rayyan", "Al-Firdaws", "Ar-Ru'yah (The Vision of Allah's Face)", "Rivers of Milk"], correctIndex: 2, hint: "An-Nazaru ila wajhillah." },
            { type: "quiz", question: "What 'event' happens between Jannah and Jahannam to signify the end of mortality limit?", options: ["The Trumpet blows again", "Death is brought in the form of a ram and is slaughtered; signaling eternal life with no death", "The Sun is extinguished", "A wall is built"], correctIndex: 1, hint: "Eternity is absolute." },
            { type: "conclusion", content: "Congratulations. You have completed the study of the Hereafter. You are now prepared to address the subjects of Angels and Divine Decree (Qadr) in the upcoming modules." },
            { type: "document", title: "Module 10 Synthesis", description: "A review of the stages of the akhirah.", url: "https://yaqeeninstitute.org/", platform: "Course Assets" }
        ]
    }
];

async function seedLessons() {
    console.log('--- SEEDING MODULE 10 (THE AFTERLIFE) ALL 7 LESSONS ---');
    for (const item of LESSON_DATA) {
        process.stdout.write(`Processing "${item.title}"... `);
        
        const finalBlocks = item.blocks.map((b, i) => {
            const block = { ...b, id: `blk_${Date.now()}_${i}`, order: i };
            if (['quran', 'hadith', 'scholar', 'reflection', 'concept', 'legal'].includes(b.type)) {
                block.content = { translation: b.translation, arabic: b.arabic };
            } else if (b.type === 'quiz') {
                block.content = { question: b.question, options: b.options, correctIndex: b.correctIndex, hint: b.hint };
            } else if (['text', 'callout', 'conclusion'].includes(b.type)) {
                block.content = b.content;
                block.author = b.author;
            } else if (['objectives', 'infographic'].includes(b.type)) {
                block.content = { items: b.items, layout: b.layout };
            } else if (b.type === 'document') {
                block.content = { title: b.title, description: b.description, url: b.url, platform: b.platform };
            } else if (b.type === 'video') {
                block.content = { url: b.url };
            }
            return block;
        });

        const { error } = await supabase.from('course_lessons').update({ content_blocks: finalBlocks })
            .eq('course_id', COURSE_ID).ilike('title', `%${item.title.replace(' ﷺ', '')}%`);
        
        if (error) {
            console.log('ERR: ' + error.message);
        } else {
            console.log(`DONE (${finalBlocks.length} Blocks Seeded)`);
        }
    }
}

seedLessons();
