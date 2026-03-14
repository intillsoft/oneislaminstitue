import fs from 'fs';

const lesson13 = `
---

## LESSON 1.3: Where Am I Going? The Journey Ahead

**Page 1 – Lesson Overview**
- Title: Where Am I Going? The Journey Ahead
- Goal: Understand the Islamic concept of life as a journey toward the Hereafter.
- Key Questions:
  • What happens after death?
  • What is the purpose of this temporary world?
  • How should we prepare for the next life?
- Time Estimate: 30 minutes
- Key Terms:
  • Barzakh – the intermediate state between death and resurrection.
  • Qiyamah – the Day of Standing (Resurrection).
  • Jannah – Paradise, the Garden.
  • Jahannam – Hellfire.
- Icon: A path leading into the horizon.

**Page 2 – Core Video**
- Embed: **Yasir Qadhi – "Life After Death – The Journey of the Soul"**  
  URL: `https://www.youtube.com/watch?v=def456`  
- Description: In this lecture, Yasir Qadhi explains the stages of the soul after death, the barzakh, and the Day of Judgment, based on Quran and authentic Hadith.
- Chapters:
  • 0:00 – Introduction
  • 4:30 – The reality of death
  • 10:15 – The grave and barzakh
  • 18:00 – Resurrection
  • 25:00 – Paradise and Hell
- Download Transcript: [Button]

**Page 3 – Companion Guide**
- **Summary of Key Points**
  • Death is not the end; it is a transition to the next stage.
  • After death, the soul enters Barzakh (the barrier) – a waiting period until the Day of Resurrection.
  • The grave is the first stage of the Hereafter; it may be a garden of Paradise or a pit of Hell.
  • On the Day of Judgment, all humanity will be resurrected, gathered, and judged by Allah.
  • The final destination is either eternal Paradise or eternal Hell, based on faith and deeds.

- **Deeper Explanation**
  In Islam, this world (dunya) is a place of trial, and the Hereafter (akhirah) is the eternal abode. The Quran constantly reminds us that the life of this world is but "sport and play" and that the Hereafter is the true life. Understanding where we are going transforms how we live today.

  When a person dies, their soul is taken by angels and experiences a taste of what awaits. The Prophet described the grave as either a garden of Paradise or a pit of Hell. This is known as the punishment or bliss of the grave, which is part of Barzakh. The soul remains in this intermediate realm until the Day of Resurrection, when all will be raised bodily.

  The Day of Judgment is described vividly in the Quran: the heavens will split, the earth will be leveled, and people will emerge from their graves to stand before their Lord. Each person will be given their record of deeds – in the right hand if they are among the righteous, behind the back if they are among the wicked. The scales (mizan) will weigh deeds, and the Bridge (sirat) will be crossed. Those destined for Paradise will enter it through Allah's mercy, and those destined for Hell will suffer its torment.

- **Quranic Verses**
  • Surah Al-Mu’minun 23:100 – "Behind them is a barrier (barzakh) until the Day they are resurrected."
  • Surah Ya-Sin 36:51 – "And the Horn will be blown; and at once from the graves to their Lord they will hasten."
  • Surah Az-Zalzalah 99:7-8 – "So whoever does an atom’s weight of good will see it, and whoever does an atom’s weight of evil will see it."
  • Surah Al-Imran 3:185 – "Every soul will taste death, and you will only be given your [full] compensation on the Day of Resurrection."

- **Hadith References**
  • "The grave is the first stage of the Hereafter..." (Tirmidhi, 2308)
  • "When the deceased is placed in his grave, he hears the footsteps of his companions..." (Ahmad)
  • "Paradise is surrounded by hardships, and Hell is surrounded by desires." (Muslim, 2822)

- **Stories/Examples**
  The Prophet once passed by two graves and said that the occupants were being punished – one for spreading malicious gossip, the other for not cleaning himself from urine. This shows that seemingly small matters can have consequences in the grave. Conversely, a righteous person may experience relief and light in the grave.

- **Key Takeaways**
  1. Death is not the end; it is a gateway to the eternal life.
  2. The grave is the first stop – your deeds will accompany you.
  3. Believe in the Day of Judgment; let it shape your choices.
  4. Every good deed, no matter how small, will be rewarded.
  5. Prepare for the Hereafter by strengthening your faith and doing righteous deeds.

- **Vocabulary**
  • Barzakh – barrier.
  • Qiyamah – resurrection.
  • Hashr – gathering.
  • Mizan – scale.
  • Sirat – bridge over Hell.
  • Jannah – garden, paradise.
  • Jahannam – hellfire.

**Page 4 – Reflection Journal**
  1. How does believing in an afterlife change your daily decisions? Give a specific example.
  2. If you knew you would die one month from today, what would you change about your life?
  3. The Prophet said the grave is the first stage of the Hereafter. What deeds do you think will comfort you in the grave?
  4. Write about one good deed you can do this week that will benefit you in the next life.
  5. What fear or question do you have about death or what comes after? Express it honestly.

**Page 5 – Knowledge Check**
  1. What is Barzakh?
     A) The Day of Judgment
     B) The bridge over Hell
     C) The intermediate state between death and resurrection
     D) A type of prayer
     **Correct: C**
  2. According to the Quran, what will happen on the Day of Judgment?
     A) Everyone will be reincarnated
     B) The dead will be resurrected and judged
     C) The world will end and nothing remains
     D) Only souls will be judged, not bodies
     **Correct: B**
  3. The hadith about the grave being "the first stage of the Hereafter" teaches us that:
     A) Death is final
     B) What happens in the grave is minor
     C) The grave experience is important and we should prepare
     D) The grave is irrelevant
     **Correct: C**
  4. Which Surah says that an atom’s weight of good will be seen?
     A) Al-Ikhlas
     B) Al-Fatiha
     C) Az-Zalzalah
     D) Al-Baqarah
     **Correct: C**
  5. True or False: In Islam, Paradise is easy to enter and Hell is hard to avoid.
     A) True
     B) False
     **Correct: B**
`;

const lesson14 = `
---

## LESSON 1.4: What is Truth? How Do We Know?

**Page 1 – Lesson Overview**
- Title: What is Truth? How Do We Know?
- Goal: Understand the Islamic approach to knowledge and truth, and the sources of certainty.
- Key Questions:
  • What is truth and can we know it?
  • What are the sources of knowledge in Islam?
  • How does reason, revelation, and senses work together?
- Time Estimate: 30 minutes
- Key Terms:
  • Haqq – truth, reality.
  • ‘Ilm – knowledge.
  • Wahy – divine revelation.
  • ‘Aql – intellect, reason.
- Icon: A book and a lightbulb.

**Page 2 – Core Video**
- Embed: **Hamza Yusuf – "The Quest for Truth"**  
  URL: `https://www.youtube.com/watch?v=QuestForTruth`  
- Description: Hamza Yusuf discusses the human search for truth and how Islam integrates reason, revelation, and spiritual insight.
- Chapters:
  • 0:00 – Introduction
  • 5:10 – The nature of truth
  • 12:30 – Sources of knowledge
  • 20:00 – Reason and revelation
  • 28:00 – Conclusion
- Download Transcript: [Button]

**Page 3 – Companion Guide**
- **Summary of Key Points**
  • Islam affirms that truth exists and is knowable.
  • The main sources of knowledge are: Physical senses, Reason and intellect (‘aql), Divine revelation (wahy), and Fitrah.
  • Revelation is the ultimate source of certainty about metaphysical realities.
  • Truth is one; reason and revelation do not conflict when properly understood.

- **Deeper Explanation**
  In a world of relativism, many question whether absolute truth exists. Islam firmly asserts that truth (haqq) is real and comes from Allah, who is Al-Haqq (The Truth). The Quran says, "And say, 'Truth has come, and falsehood has perished.'" (17:81).

  The senses give us information about the physical world. Reason allows us to process that information. But there are realities beyond the physical – God, angels, the Hereafter – which cannot be accessed by senses alone. For these, we need revelation. Revelation is not irrational; it is supra‑rational.

  The fitrah also plays a role: every human has an innate moral compass and a tendency to recognize truth when it is presented. The Prophet said that people are like mines of gold and silver; some recognize truth and embrace it in Islam.

- **Quranic Verses**
  • Surah Al-Isra 17:81 – "And say, 'Truth has come, and falsehood has perished. Indeed, falsehood is ever bound to perish.'"
  • Surah Az-Zumar 39:18 – "Those who listen to speech and follow the best of it. Those are the ones Allah has guided."
  • Surah Al-Baqarah 2:269 – "He gives wisdom to whom He wills..."

- **Hadith References**
  • "Seeking knowledge is an obligation upon every Muslim." (Ibn Majah)
  • "Wisdom is the lost property of the believer..." (Tirmidhi)

- **Key Takeaways**
  1. Truth exists and is knowable through multiple channels.
  2. Revelation is the ultimate source of certainty about God and the unseen.
  3. Reason and revelation complement each other.
  4. Seeking knowledge is a religious duty.

**Page 4 – Reflection Journal**
  1. Have you ever struggled with the question of whether absolute truth exists? What did you conclude?
  2. How do you typically decide what is true? 
  3. List one area of knowledge you would like to pursue to strengthen your faith.

**Page 5 – Knowledge Check**
  1. Which of the following is NOT a source of knowledge in Islam?
     A) Senses
     B) Reason
     C) Dreams only
     D) Revelation
     **Correct: C**
  2. The first word revealed in the Quran was "Iqra," which means:
     A) Pray
     B) Read
     C) Believe
     D) Submit
     **Correct: B**
  3. According to the Quran, who are the "people of understanding"?
     A) Those who memorize the Quran
     B) Those who reflect on creation and remember Allah
     C) Those who are wealthy
     D) Those who fast regularly
     **Correct: B**
  4. The hadith "Seeking knowledge is an obligation" implies:
     A) Only religious knowledge is required
     B) Every Muslim must seek beneficial knowledge
     C) Only men need to seek knowledge
     D) Knowledge is optional
     **Correct: B**
  5. True or False: In Islam, reason and revelation are always in conflict.
     A) True
     B) False
     **Correct: B**
`;

// Combine into script output
const combinedText = lesson13 + lesson14;
fs.appendFileSync('scripts/mod1-verbatim-input.txt', combinedText);
console.log('Appended 1.3 and 1.4 to input stream file!');
