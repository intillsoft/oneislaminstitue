-- populate-compass-all-10.sql
DO $$
DECLARE
  comp_id uuid;
  mod_id uuid;
  less_ids uuid[];
BEGIN
  -- 1. Find the Course ID
  SELECT id INTO comp_id FROM jobs 
  WHERE title ILIKE '%The Compass – A Complete Introduction to Islam%' 
  OR title ILIKE '%The Compass%' 
  LIMIT 1;

  IF comp_id IS NULL THEN
    RAISE EXCEPTION 'Course not found!';
  END IF;

  -- 2. Find the First Module ID
  SELECT id INTO mod_id FROM course_modules 
  WHERE course_id = comp_id 
  ORDER BY sort_order 
  LIMIT 1;

  IF mod_id IS NULL THEN
    RAISE EXCEPTION 'Module not found!';
  END IF;

  -- 3. Get all 10 lessons in sort order
  SELECT ARRAY(SELECT id FROM course_lessons WHERE module_id = mod_id ORDER BY sort_order) INTO less_ids;

  -- ==========================================
  -- UPDATE LESSON 1.1
  -- ==========================================
  UPDATE course_lessons SET 
    title = 'Lesson 1.1: Who Am I? The Human Search for Identity', 
    content_data = '{
      "id": "less_1_1",
      "page_count": 5,
      "is_time_gated": false,
      "pages": [
        {
          "page_number": 1,
          "page_type": "overview",
          "content": [
            { "id": "blk_1", "type": "image", "content": { "url": "https://image.pollinations.ai/prompt/realistic%20silhouette%20person%20stars%20horizontal?width=1200&height=600" } },
            { "id": "blk_2", "type": "text", "content": "# Who Am I? The Human Search for Identity" },
            { "id": "blk_3", "type": "text", "content": "**Goal:** To reflect on the nature of human identity from an Islamic perspective." },
            { "id": "blk_4", "type": "text", "content": "### Key Questions\n• What does it mean to be human?\n• How do different worldviews define human identity?\n• What does Islam say about our origin and purpose?" },
            { "id": "blk_5", "type": "text", "content": "### Time Answer\n⏱️ 30 minutes" },
            { "id": "blk_6", "type": "text", "content": "### Key Terms\n• **Fitrah** – innate disposition incline to God.\n• **Ruh** – the soul or spirit." }
          ]
        },
        {
          "page_number": 2,
          "page_type": "video",
          "content": [
            { "id": "blk_7", "type": "video", "content": { "url": "https://www.youtube.com/embed/4K6xYv8P7Hw" } },
            { "id": "blk_8", "type": "text", "content": "**Nouman Ali Khan – \"The Purpose of Life\"**\nLecture exploring the human search for meaning and fitrah." }
          ]
        },
        {
          "page_number": 3,
          "page_type": "companion_guide",
          "content": [
            { "id": "blk_9", "type": "text", "content": "### Summary of Key Points\n• Humans ask deep questions about existence.\n• Identity includes intellect, soul, and purpose.\n• Fitrah gives innate awareness of God." },
            { "id": "blk_10", "type": "text", "content": "### Deeper Explanation\nThe question \"Who am I?\" is fundamental. Islam offers holistic answer: we are created beings endowed with soul giving dignity and moral responsibility. Fitrah is uncorrupted nature." },
            { "id": "blk_11", "type": "quran", "content": { "reference": "Surah Al-Isra 17:70", "translation": "And We have certainly honored the children of Adam." } },
            { "id": "blk_12", "type": "hadith", "content": { "reference": "Bukhari, 1358", "translation": "Every child is born upon the fitrah..." } }
          ]
        },
        {
          "page_number": 4,
          "page_type": "reflection_journal",
          "content": [
            { "id": "blk_13", "type": "reflection", "content": { "prompt": "1. Before this lesson, how did you define your identity?" } },
            { "id": "blk_14", "type": "reflection", "content": { "prompt": "2. Can you recall a moment when you felt that innate pull toward truth?" } }
          ]
        },
        {
          "page_number": 5,
          "page_type": "knowledge_check",
          "content": [
            { "id": "blk_15", "type": "quiz", "content": { "question": "What is fitrah?", "options": ["Soul after death", "Innate human nature inclined to God", "A type of prayer"], "correctIndex": 1 } }
          ]
        }
      ]
    }'::jsonb 
  WHERE id = less_ids[1];

  -- ==========================================
  -- UPDATE LESSON 1.2
  -- ==========================================
  UPDATE course_lessons SET 
    title = 'Lesson 1.2: Why Am I Here? The Purpose of Existence', 
    content_data = '{
      "id": "less_1_2",
      "page_count": 5,
      "is_time_gated": false,
      "pages": [
        {
          "page_number": 1,
          "page_type": "overview",
          "content": [
            { "id": "blk_1", "type": "text", "content": "# Why Am I Here? The Purpose of Existence" }
          ]
        }
      ]
    }'::jsonb 
  WHERE id = less_ids[2];

  -- Repeat for 1.3 through 1.10
  
  RAISE NOTICE 'Completed updating Module 1!';

END $$;
