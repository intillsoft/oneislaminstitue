# Notification System - Quick Start Guide

## ✅ Completed Components

### 1. Database Schema ✓
**File**: `backend/supabase/migrations/notifications_table.sql`
- Complete notifications table with indexes
- RLS policies for role-based access
- Automatic updated_at trigger

**To Deploy**:
```bash
# In Supabase Dashboard: SQL Editor
# Copy and run: backend/supabase/migrations/notifications_table.sql
```

### 2. Backend Service ✓
**File**: `src/services/notificationService.ts`
- 7 core methods for notification management
- Email integration with Resend
- Error handling (non-blocking failures)

**Methods Available**:
- `sendNotification(payload)` - Send to single user
- `sendBulkNotifications(payload)` - Send to multiple users
- `markAsRead(notificationId)` - Mark single as read
- `markAllAsRead(userId)` - Mark all as read
- `getUnreadCount(userId)` - Get unread count
- `getNotifications(userId, limit, offset)` - Paginated fetch
- `deleteNotification(notificationId, userId)` - Delete with verification

### 3. API Endpoints ✓
**File**: `src/app/api/notifications/route.ts`
- `GET /api/notifications` - Fetch user notifications
- `POST /api/notifications` - Send notification (admin/instructor only)
- `PATCH /api/notifications/:id` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

**Authentication**: All endpoints require valid auth token

### 4. UI Components ✓

**NotificationBell Component**
- **File**: `src/components/notifications/NotificationBell.tsx`
- Bell icon with unread badge
- Dropdown with notification list
- Real-time updates via Supabase Realtime
- Mark as read / Delete actions

**NotificationComposePanel Component**
- **File**: `src/components/notifications/NotificationComposePanel.tsx`
- Send notifications (admin/instructor only)
- Target options: All, Specific users, Course enrollees
- Notification types: General, Announcement, Alert, Welcome
- Optional email sending

### 5. Hooks ✓
**File**: `src/hooks/useNotifications.ts`
- `useNotifications()` hook
- Returns: notifications[], unreadCount, isLoading
- Methods: fetchNotifications, markAsRead, markAllAsRead, deleteNotification
- Auto real-time subscription

### 6. Automatic Triggers ✓
**File**: `src/services/notificationTriggers.ts`
- `sendEnrollmentWelcomeNotification()`
- `sendRegistrationWelcomeNotification()`
- `sendCourseCompletionNotification()`
- `sendLessonAvailableNotification()`
- `sendAssignmentReminderNotification()`
- `sendProgressUpdateNotification()`
- `sendAnnouncementNotification()`

## 🚀 Integration Steps (In Order)

### Step 1: Deploy Database Schema
```bash
# Login to Supabase Dashboard
# Navigate to: SQL Editor
# Copy content from: backend/supabase/migrations/notifications_table.sql
# Execute the SQL
```

Verify:
- Table `notifications` exists
- Columns: id, user_id, sender_id, title, message, type, data, is_read, read_at, created_at, updated_at
- RLS policies enabled
- Indexes created

### Step 2: Setup Environment Variables
In `.env.local`:
```
# Resend (for email notifications)
RESEND_API_KEY=your_resend_api_key

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Add NotificationBell to Header
In your header/navbar component:

```tsx
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      {/* ... other header items ... */}
      <NotificationBell />
    </header>
  );
}
```

### Step 4: Add Compose Panel to Admin Dashboard
In admin dashboard:

```tsx
'use client';
import { useState } from 'react';
import { NotificationComposePanel } from '@/components/notifications/NotificationComposePanel';
import { Bell } from 'lucide-react';

export function AdminPanel() {
  const [isComposePanelOpen, setIsComposePanelOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsComposePanelOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Bell className="w-4 h-4" />
        Send Notification
      </button>
      
      <NotificationComposePanel 
        isOpen={isComposePanelOpen}
        onClose={() => setIsComposePanelOpen(false)}
      />
    </>
  );
}
```

### Step 5: Add Enrollment Trigger
Find your enrollment handler (free enrollment button or similar):

```tsx
// Import trigger
import { sendEnrollmentWelcomeNotification } from '@/services/notificationTriggers';

// In your enrollment handler:
async function handleFreeEnroll(courseId: string) {
  try {
    // ... existing enrollment logic ...

    // After successful enrollment:
    const user = await getCurrentUser();
    const course = await getCourse(courseId);
    
    await sendEnrollmentWelcomeNotification(
      user.id,
      course.name,
      courseId,
      course.instructor_id // optional
    );

  } catch (error) {
    console.error('Enrollment error:', error);
  }
}
```

### Step 6: Add Registration Welcome Trigger
In your signup/registration handler:

```tsx
// Import trigger
import { sendRegistrationWelcomeNotification } from '@/services/notificationTriggers';

// In your signup handler:
async function handleSignup(userData: SignUpData) {
  try {
    // ... existing signup logic with Supabase Auth ...

    // After successful registration:
    await sendRegistrationWelcomeNotification(
      user.id,
      user.email,
      userData.firstName // or user.name
    );

  } catch (error) {
    console.error('Signup error:', error);
  }
}
```

### Step 7: Test the System

**Test 1: Send Notification as Admin**
```
1. Login as admin/instructor
2. Click "Send Notification" button
3. Fill in title, message
4. Select target (All Students)
5. Click Send
6. Login as student to see notification bell update
```

**Test 2: Real-time Updates**
```
1. Open two browser windows (logged in as different users)
2. Send notification to one user
3. Verify notification appears in real-time (no refresh needed)
```

**Test 3: Mark as Read**
```
1. Receive notification
2. Click notification in dropdown
3. Verify "unread badge" count decreases
4. Verify notification is marked read
```

**Test 4: Email Sending (if Resend configured)**
```
1. Send notification with email enabled
2. Check your email inbox
3. Verify formatted email received
```

## 📊 Verification Checklist

After integration, verify:

- [ ] Database migration ran successfully in Supabase
- [ ] `notifications` table exists with correct schema
- [ ] RLS policies are enabled and correct
- [ ] NotificationBell component displays in header
- [ ] Unread badge shows correct count
- [ ] Can open notification dropdown
- [ ] Can mark notification as read
- [ ] Unread count decreases after marking read
- [ ] Can delete notification
- [ ] Can send notification as admin/instructor
- [ ] Can target: All Students, Specific Users, Course Enrollees
- [ ] Students receive notifications in real-time
- [ ] Email sends to notification recipients (if Resend configured)
- [ ] Enrollment triggers welcome notification
- [ ] Registration triggers welcome notification
- [ ] Notifications persist after page refresh

## 🐛 Troubleshooting

### NotificationBell not appearing
- Check if component is added to header
- Check browser console for errors
- Verify user is authenticated

### Notifications not loading
- Check network tab for `/api/notifications` call
- Verify auth token is valid
- Check Supabase connection
- Check RLS policies in Supabase dashboard

### Can't send notification
- Verify logged-in user has admin/instructor role
- Check API response error message
- Verify recipient user IDs exist

### Email not sending
- Verify `RESEND_API_KEY` is set in `.env.local`
- Check Resend dashboard for API key validity
- Verify email addresses are valid

### Real-time not updating
- Enable Realtime for notifications table in Supabase
- Check Supabase Connection Status
- Verify WebSocket connection in browser DevTools

## 📝 Files Created/Modified

### Created Files:
1. `backend/supabase/migrations/notifications_table.sql` - Database schema
2. `src/services/notificationService.ts` - Core service (already created)
3. `src/app/api/notifications/route.ts` - API endpoints
4. `src/components/notifications/NotificationBell.tsx` - UI component
5. `src/components/notifications/NotificationComposePanel.tsx` - Admin component
6. `src/hooks/useNotifications.ts` - React hook
7. `src/services/notificationTriggers.ts` - Automatic triggers

### Configuration Files:
- `.env.local` - Add RESEND_API_KEY

## 🔒 Security Summary

- ✓ RLS policies enforce row-level access control
- ✓ Only authenticated users can fetch their notifications
- ✓ Only admins/instructors can send notifications (verified at API)
- ✓ Users can only update/delete their own notifications
- ✓ All API endpoints require authentication
- ✓ Email service (Resend) handles secure delivery

## 📚 Documentation

For detailed information, see:
- [NOTIFICATION_SYSTEM_INTEGRATION_GUIDE.md](./NOTIFICATION_SYSTEM_INTEGRATION_GUIDE.md) - Complete integration guide
- `src/services/notificationService.ts` - Service layer documentation
- `src/app/api/notifications/route.ts` - API endpoint documentation

## 🎯 Next Steps

1. **Deploy database schema** (Step 1)
2. **Add NotificationBell to header** (Step 3)
3. **Test basic functionality** (run through Test 1)
4. **Add enrollment trigger** (Step 5)
5. **Add registration trigger** (Step 6)
6. **Deploy to production**

## 💡 Pro Tips

- Use `useNotifications()` hook in any component that needs notifications
- Subscribe to real-time updates automatically happens in NotificationBell
- Email sending is optional (set `sendEmail: false` to skip)
- Triggers gracefully handle failures (won't block main flow)
- Use notification types to categorize messages (general, announcement, alert, welcome)

## 🆘 Need Help?

Check the troubleshooting section above or review:
- Supabase dashboard for RLS policy details
- Browser DevTools Network tab for API errors
- Resend dashboard for email delivery status
- Database schema for field mappings
