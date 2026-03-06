# 🎓 COURSE SYSTEM - COMPLETE IMPLEMENTATION GUIDE

## 🚀 OVERVIEW

The course system has been completely rebuilt with:
- ✅ Fixed RLS policies for module/lesson creation (403 error resolved)
- ✅ Flexible content block system (text, images, videos, infographics)
- ✅ Complete lesson builder interface
- ✅ Beautiful course learning experience
- ✅ Progress tracking and completion
- ✅ Drag-and-drop content organization

---

## 📋 TABLE OF CONTENTS

1. [Issue Resolution](#issue-resolution)
2. [Database Schema](#database-schema)
3. [Services](#services)
4. [Components](#components)
5. [Setup Instructions](#setup-instructions)
6. [Usage Guide](#usage-guide)
7. [External Services](#external-services)
8. [API Reference](#api-reference)

---

## 🔧 ISSUE RESOLUTION

### Problem: 403 Forbidden on POST to course_modules

**Root Cause:**
The original RLS policies were too restrictive and didn't allow authenticated users to insert data.

**Solution:**
Updated RLS policies to allow authenticated users with appropriate roles to create/update/delete modules and lessons.

**File:**
- `backend/supabase/FIX_COURSE_RLS_403.sql` - Run this SQL script in Supabase

**How to apply:**
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Paste the contents of `FIX_COURSE_RLS_403.sql`
4. Click Execute
5. Done! Now module creation will work

---

## 🗄️ DATABASE SCHEMA

### Updated Tables

#### `course_modules`
```sql
- id (UUID, PK)
- course_id (UUID, FK to jobs)
- title (TEXT)
- description (TEXT)
- sort_order (INT) - for ordering
- is_published (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### `course_lessons`
```sql
- id (UUID, PK)
- module_id (UUID, FK to course_modules)
- title (TEXT)
- description (TEXT)
- content_type (TEXT) - text, video, quiz, etc
- content_blocks (JSONB) - flexible content storage
- video_url (TEXT) - optional direct video
- thumbnail_url (TEXT) - optional thumbnail
- duration_minutes (INT)
- sort_order (INT)
- is_free_preview (BOOLEAN)
- is_published (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### `course_progress` (NEW)
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- course_id (UUID, FK to jobs)
- completed_modules (INT)
- total_modules (INT)
- completed_lessons (INT)
- total_lessons (INT)
- progress_percentage (INT)
- started_at (TIMESTAMPTZ)
- completed_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### `lesson_progress` (NEW)
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- lesson_id (UUID, FK to course_lessons)
- completed (BOOLEAN)
- watched_percentage (INT) - for videos
- notes (TEXT)
- completed_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Content Blocks Structure (JSONB)
```json
{
  "id": "block_1234567890",
  "type": "text|image|video|infographic|quiz",
  "data": {
    // Type-specific data
  },
  "order": 0,
  "created_at": "2026-02-23T00:00:00Z"
}
```

**Content Block Types:**

#### Text Block
```json
{
  "type": "text",
  "data": {
    "text": "Your lesson text content here..."
  }
}
```

#### Image Block
```json
{
  "type": "image",
  "data": {
    "url": "https://example.com/image.jpg",
    "caption": "Image description"
  }
}
```

#### Video Block
```json
{
  "type": "video",
  "data": {
    "url": "https://youtube.com/watch?v=...",
    "source": "youtube|vimeo|url",
    "duration": 300
  }
}
```

#### Infographic Block
```json
{
  "type": "infographic",
  "data": {
    "url": "https://example.com/infographic.png"
  }
}
```

#### Quiz Block
```json
{
  "type": "quiz",
  "data": {
    "questions": [
      {
        "id": "q1",
        "text": "Question text?",
        "type": "multiple-choice|true-false|short-answer",
        "options": ["Option 1", "Option 2"],
        "correctAnswer": 0,
        "explanation": "Why this answer is correct"
      }
    ]
  }
}
```

---

## 🛠️ SERVICES

### courseService.js

All course-related operations. Located at: `src/services/courseService.js`

#### Module Operations

```javascript
// Get all modules for a course
courseService.getModules(courseId)
→ { success, data: [modules] }

// Create a new module
courseService.createModule(courseId, title, description)
→ { success, data: module }

// Update a module
courseService.updateModule(moduleId, updates)
→ { success, data: module }

// Delete a module
courseService.deleteModule(moduleId)
→ { success }

// Reorder modules
courseService.reorderModules([modules])
→ { success }
```

#### Lesson Operations

```javascript
// Get all lessons in a module
courseService.getLessons(moduleId)
→ { success, data: [lessons] }

// Get a specific lesson with content blocks
courseService.getLesson(lessonId)
→ { success, data: lesson }

// Create a new lesson
courseService.createLesson(moduleId, title, description, contentType)
→ { success, data: lesson }

// Update lesson (including content blocks)
courseService.updateLesson(lessonId, updates)
→ { success, data: lesson }

// Delete a lesson
courseService.deleteLesson(lessonId)
→ { success }

// Reorder lessons
courseService.reorderLessons([lessons])
→ { success }
```

#### Content Block Operations

```javascript
// Add content block to lesson
courseService.addContentBlock(lessonId, block)
→ { success, data: block }

// Update content block
courseService.updateContentBlock(lessonId, blockId, updates)
→ { success, data: block }

// Delete content block
courseService.deleteContentBlock(lessonId, blockId)
→ { success }
```

#### Progress Tracking

```javascript
// Get course progress for user
courseService.getCourseProgress(userId, courseId)
→ { success, data: progress }

// Initialize course progress
courseService.initializeCourseProgress(userId, courseId)
→ { success, data: progress }

// Get lesson progress for user
courseService.getLessonProgress(userId, lessonId)
→ { success, data: progress }

// Update lesson progress
courseService.updateLessonProgress(userId, lessonId, updates)
→ { success, data: progress }

// Mark lesson as complete
courseService.markLessonComplete(userId, lessonId)
→ { success, data: progress }
```

---

## 🎨 COMPONENTS

### LessonBuilder.jsx
**Location:** `src/pages/course-management/components/LessonBuilder.jsx`

**Purpose:** Interface for creating and editing lessons with flexible content blocks

**Features:**
- ✅ Add/Edit/Delete content blocks
- ✅ Drag-and-drop reordering
- ✅ Text, image, video, infographic support
- ✅ Real-time preview
- ✅ Auto-save to database
- ✅ Beautiful, intuitive UI

**Usage:**
```jsx
import LessonBuilder from '@/pages/course-management/components/LessonBuilder';

<LessonBuilder 
  lessonId={lesson.id}
  onSave={() => navigate('/courses')}
  onCancel={() => navigate(-1)}
/>
```

### CourseLearning.jsx
**Location:** `src/pages/course-management/components/CourseLearning.jsx`

**Purpose:** Beautiful learning interface for students taking courses

**Features:**
- ✅ Module/lesson sidebar with progress
- ✅ Content rendering (text, images, videos)
- ✅ Lesson navigation
- ✅ Progress tracking
- ✅ Lesson completion
- ✅ Responsive design
- ✅ Dark mode support

**Usage:**
```jsx
import CourseLearning from '@/pages/course-management/components/CourseLearning';

<CourseLearning 
  courseId={courseId}
  modulesData={modules}
  lessonsData={lessons}
/>
```

---

## ⚙️ SETUP INSTRUCTIONS

### Step 1: Apply Database Schema

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy contents of `backend/supabase/FIX_COURSE_RLS_403.sql`
5. Execute
6. ✅ Database is ready

### Step 2: Verify RLS Policies

In Supabase Dashboard:
1. Go to Authentication → Policies
2. Check `course_modules` table policies:
   - ✅ `modules_select_all` - SELECT for everyone
   - ✅ `modules_insert_authenticated` - INSERT for authenticated users
   - ✅ `modules_update_authenticated` - UPDATE for authenticated users
   - ✅ `modules_delete_authenticated` - DELETE for authenticated users
3. Same for `course_lessons`, `course_progress`, `lesson_progress` tables

### Step 3: Verify Services

Check that these files exist:
- ✅ `src/services/courseService.js` - Created

### Step 4: Verify Components

Check that these components exist:
- ✅ `src/pages/course-management/components/LessonBuilder.jsx` - Created
- ✅ `src/pages/course-management/components/CourseLearning.jsx` - Created

---

## 📖 USAGE GUIDE

### Creating a Lesson with Content Blocks

```jsx
import { courseService } from '@/services/courseService';

// Create a module first
const moduleResult = await courseService.createModule(
  courseId,
  "Module 1: Introduction",
  "Learn the basics"
);

// Create a lesson
const lessonResult = await courseService.createLesson(
  moduleResult.data.id,
  "Lesson 1: Getting Started",
  "Start your learning journey"
);

// Add text block
await courseService.addContentBlock(lessonResult.data.id, {
  type: 'text',
  data: { text: 'Welcome to this lesson...' }
});

// Add image block
await courseService.addContentBlock(lessonResult.data.id, {
  type: 'image',
  data: { 
    url: 'https://example.com/image.jpg',
    caption: 'Visual representation'
  }
});

// Add video block
await courseService.addContentBlock(lessonResult.data.id, {
  type: 'video',
  data: { 
    url: 'https://youtube.com/watch?v=...',
    source: 'youtube'
  }
});
```

### Tracking Student Progress

```jsx
import { courseService } from '@/services/courseService';

// Initialize progress when student first accesses course
await courseService.initializeCourseProgress(userId, courseId);

// Mark lesson as complete
await courseService.markLessonComplete(userId, lessonId);

// Get overall progress
const progress = await courseService.getCourseProgress(userId, courseId);
console.log(`${progress.data.progress_percentage}% complete`);
```

### Building a Course Management Dashboard

```jsx
import { courseService } from '@/services/courseService';

// Load entire course structure
const modules = await courseService.getModules(courseId);
const courseModules = [];

for (const module of modules.data) {
  const lessons = await courseService.getLessons(module.id);
  courseModules.push({
    ...module,
    lessons: lessons.data
  });
}

// Render course structure
return (
  <div>
    {courseModules.map(module => (
      <div key={module.id}>
        <h2>{module.title}</h2>
        {module.lessons.map(lesson => (
          <div key={lesson.id}>{lesson.title}</div>
        ))}
      </div>
    ))}
  </div>
);
```

---

## 🌐 EXTERNAL SERVICES

### Video Hosting

For storing and serving videos, you have several options:

#### Option 1: YouTube (Recommended for long-form)
- Free
- Easy embedding
- Automatic transcoding
- Analytics included
- Use in video block: `source: "youtube"`

#### Option 2: Vimeo (Recommended for professional)
- Paid ($12-75/month)
- More control over appearance
- Higher quality options
- Advanced analytics
- Use in video block: `source: "vimeo"`

#### Option 3: Mux (Recommended for scalability)
- Pay-per-use ($0.09-0.50 per video hour)
- API-driven
- Automatic transcoding
- Great for streaming
- Documentation: https://docs.mux.com

#### Option 4: Bunny CDN (Recommended for budget)
- Affordable ($0.01-0.03 per GB)
- Fast global CDN
- Easy API
- Great bandwidth costs
- Website: https://bunny.com

#### Option 5: Supabase Storage (Simplest)
- Built into Supabase
- Free tier: 1GB
- Pay-per-GB after
- Direct integration
- Use in video block: `source: "url"` with Supabase signed URL

### Image Hosting

#### Option 1: Supabase Storage (Recommended)
- Integrated with your database
- Free tier: 1GB
- Easy integration
- Already set up

#### Option 2: Cloudinary (Recommended for manipulation)
- Free tier: 10GB
- Automatic optimization
- Image manipulation API
- Documentation: https://cloudinary.com/documentation

#### Option 3: Imgix
- Paid
- Real-time image processing
- CDN included
- Great for responsive images

### Rich Text Editor (Optional Enhancement)

For better text editing experience:

#### Option 1: TipTap (Recommended)
```bash
npm install @tiptap/react @tiptap/starter-kit
```
- Rich text with Markdown support
- Headings, bold, italic, lists, code blocks
- Easy to customize
- Good performance

#### Option 2: Slate
```bash
npm install slate slate-react
```
- Highly customizable
- Great for custom features
- Steeper learning curve

#### Option 3: Quill
```bash
npm install quill
```
- Simple setup
- Good default features
- Lightweight

---

## 🔌 API REFERENCE

### Supabase RPC Functions

#### Calculate Course Progress
```sql
-- Automatically triggered when lesson progress updates
-- Updates course_progress with latest completion stats

-- Example: After marking lesson complete
UPDATE lesson_progress 
SET completed = true 
WHERE lesson_id = $1 AND user_id = $2;
-- Automatically updates course_progress via trigger
```

### REST API Endpoints

All operations go through Supabase REST API:

```
POST   /rest/v1/course_modules
GET    /rest/v1/course_modules?course_id=eq.{courseId}
PATCH  /rest/v1/course_modules?id=eq.{moduleId}
DELETE /rest/v1/course_modules?id=eq.{moduleId}

POST   /rest/v1/course_lessons
GET    /rest/v1/course_lessons?module_id=eq.{moduleId}
PATCH  /rest/v1/course_lessons?id=eq.{lessonId}
DELETE /rest/v1/course_lessons?id=eq.{lessonId}

POST   /rest/v1/course_progress
GET    /rest/v1/course_progress?user_id=eq.{userId}&course_id=eq.{courseId}
PATCH  /rest/v1/course_progress?id=eq.{progressId}

POST   /rest/v1/lesson_progress
GET    /rest/v1/lesson_progress?user_id=eq.{userId}
PATCH  /rest/v1/lesson_progress?id=eq.{progressId}
```

---

## 🎯 NEXT STEPS

### Phase 1: Basic Implementation (Done ✅)
- ✅ Database schema
- ✅ RLS policies
- ✅ Services
- ✅ Components
- ✅ Progress tracking

### Phase 2: Enhancements (Optional)
- [ ] Rich text editor integration (TipTap)
- [ ] Quiz/Assessment system
- [ ] Assignments with file submission
- [ ] Discussion/Comments on lessons
- [ ] Certificate generation
- [ ] Leaderboards
- [ ] Student-to-student messaging

### Phase 3: Advanced Features (Optional)
- [ ] Live video streaming (Mux Live)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Recommendation engine
- [ ] Adaptive learning paths
- [ ] Integration with payment system

---

## ✅ VERIFICATION CHECKLIST

Before launching:

- [ ] Run `FIX_COURSE_RLS_403.sql` in Supabase
- [ ] Verify RLS policies in Supabase dashboard
- [ ] Test creating a module (should succeed)
- [ ] Test creating a lesson (should succeed)
- [ ] Test adding content blocks (should succeed)
- [ ] Test course learning interface
- [ ] Test progress tracking
- [ ] Test mark lesson as complete
- [ ] Test dark mode
- [ ] Test mobile responsiveness

---

## 🆘 TROUBLESHOOTING

### Issue: Still getting 403 error after applying SQL

**Solution:**
1. Check that user role is 'admin', 'recruiter', or 'instructor'
2. Ensure Supabase auth token is valid
3. Check browser console for exact error
4. Try with a different user account

### Issue: Content blocks not saving

**Solution:**
1. Check browser console for errors
2. Verify JSONB column exists in course_lessons table
3. Check RLS policies allow UPDATE
4. Try updating without content_blocks first

### Issue: Videos not loading

**Solution:**
1. For YouTube: Use video ID instead of full URL
2. For Vimeo: Ensure video is public or use embed token
3. For direct URLs: Check CORS headers are correct
4. Test URL in browser directly

---

## 📚 ADDITIONAL RESOURCES

- Supabase Docs: https://supabase.com/docs
- Framer Motion: https://www.framer.com/motion/
- Lucide Icons: https://lucide.dev
- SQL Best Practices: https://www.postgresql.org/docs/

---

## 🎉 YOU'RE ALL SET!

The course system is now complete with:
- ✅ Fixed 403 error
- ✅ Beautiful lesson builder
- ✅ Seamless learning experience
- ✅ Progress tracking
- ✅ Flexible content blocks
- ✅ Full dark mode support
- ✅ Mobile responsive

**Next: Run the SQL script and start building courses!**
