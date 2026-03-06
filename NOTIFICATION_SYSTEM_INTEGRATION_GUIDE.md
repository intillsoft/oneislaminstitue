# Notification System Integration Guide

## Overview
Complete production-ready notification system with role-based access, automatic triggers, email integration (Resend), and real-time updates (Supabase Realtime).

## Architecture

### 1. Database Layer (`backend/supabase/migrations/notifications_table.sql`)
- **notifications table**: Stores all notifications
- **Fields**: id, user_id, sender_id, title, message, type, data (JSONB), is_read, read_at, created_at, updated_at
- **RLS Policies**:
  - `SELECT`: Users read only their own notifications
  - `INSERT`: Only admin/instructor can insert
  - `UPDATE`: Users update only their own (mark read)
  - `DELETE`: Only admins can delete
- **Indexes**: user_id, (user_id, is_read), created_at DESC for performance

### 2. Service Layer (`src/services/notificationService.ts`)
Handles notification business logic with 7 core methods:
- `sendNotification(payload)`: Send to single user with optional email
- `sendBulkNotifications(payload)`: Send to multiple users
- `markAsRead(notificationId)`: Mark single as read
- `markAllAsRead(userId)`: Batch mark all read
- `getUnreadCount(userId)`: Get unread count
- `getNotifications(userId, limit, offset)`: Paginated fetch with hasMore flag
- `deleteNotification(notificationId, userId)`: Delete with verification

**Email Integration**: Uses Resend with HTML templates. Email failures don't block notification creation.

### 3. API Layer (`src/app/api/notifications/route.ts`)
RESTful endpoints with role verification:

**GET /api/notifications**
- Query params: `limit` (default 20), `offset` (default 0)
- Returns: `{ notifications[], unreadCount, hasMore }`
- Requires: User authentication

**POST /api/notifications**
- Send notifications (admin/instructor only)
- Body: `{ userIds[], title, message, type, data?, sendEmail }`
- Returns: `{ success, count, failed }`

**PATCH /api/notifications/:id**
- Mark as read or mark all as read
- Body: `{ action: 'mark-as-read' | 'mark-all-as-read' }`

**DELETE /api/notifications/:id**
- Delete notification (user can delete own)

### 4. UI Components

#### NotificationBell Component (`src/components/notifications/NotificationBell.tsx`)
- Display bell icon with unread count badge
- Dropdown showing recent notifications
- Mark as read / delete actions
- Real-time updates via Supabase Realtime
- Click outside to close

#### NotificationComposePanel (`src/components/notifications/NotificationComposePanel.tsx`)
- Modal form for admins/instructors to send notifications
- Target options: All students, Specific users, Course enrollees
- Notification types: General, Announcement, Alert, Welcome
- Optional email sending
- Form validation and status feedback

### 5. Hooks

#### useNotifications Hook (`src/hooks/useNotifications.ts`)
Manages notification state and operations:
- `notifications[]`: Current notifications
- `unreadCount`: Count of unread notifications
- `isLoading`: Loading state
- `fetchNotifications(limit, offset)`: Manual fetch
- `markAsRead(notificationId)`: Mark single as read
- `markAllAsRead()`: Mark all as read
- `deleteNotification(notificationId)`: Delete notification
- Real-time subscription automatically updates state

### 6. Automatic Triggers (`src/services/notificationTriggers.ts`)

**sendEnrollmentWelcomeNotification**
```typescript
await sendEnrollmentWelcomeNotification(userId, courseName, courseId, instructorId);
```
- Triggered when user enrolls in course
- Sends welcome message with course info
- Optional email send
- Gracefully fails (enrollment succeeds even if notification fails)

**sendRegistrationWelcomeNotification**
```typescript
await sendRegistrationWelcomeNotification(userId, userEmail, userName);
```
- Triggered when user registers
- Sends platform welcome message
- Optional email send

**sendCourseCompletionNotification**
```typescript
await sendCourseCompletionNotification(userId, courseName, courseId, instructorId);
```
- Triggered when user completes course
- Sends congratulations message
- Links to certificate

**sendLessonAvailableNotification**
```typescript
await sendLessonAvailableNotification(
  enrolledUserIds, 
  lessonTitle, 
  courseName, 
  courseId, 
  lessonId, 
  instructorId
);
```
- Triggered when instructor releases new lesson
- Sends to all enrolled students

**sendAssignmentReminderNotification**
```typescript
await sendAssignmentReminderNotification(
  enrolledUserIds, 
  assignmentTitle, 
  courseName, 
  courseId, 
  dueDate, 
  instructorId
);
```
- Triggered before assignment due date
- Sends reminder to all students

**sendProgressUpdateNotification**
```typescript
await sendProgressUpdateNotification(
  userId, 
  courseName, 
  courseId, 
  progressPercentage, 
  instructorId
);
```
- Triggered at progress milestones (50%, 75%)
- Special messages for each milestone

**sendAnnouncementNotification**
```typescript
await sendAnnouncementNotification(
  enrolledUserIds, 
  title, 
  message, 
  courseName, 
  courseId, 
  instructorId
);
```
- Triggered when instructor posts announcement
- Custom title and message

## Integration Steps

### Step 1: Setup Database
Run the migration to create notifications table:
```bash
supabase migration up
```

Or manually execute the SQL in Supabase dashboard:
- Copy content from `backend/supabase/migrations/notifications_table.sql`
- Execute in Supabase SQL editor

### Step 2: Verify Supabase Configuration
Ensure in your Supabase project:
- Realtime is enabled for notifications table
- RLS policies are properly configured
- Service role key is available for backend

### Step 3: Setup Resend (Optional but Recommended)
```bash
npm install resend
```

Create `.env.local`:
```
RESEND_API_KEY=your_resend_api_key
```

Update `src/services/notificationService.ts` if using different email service.

### Step 4: Add Header Integration
Add NotificationBell to your header/navbar:

```tsx
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header() {
  return (
    <header className="flex items-center gap-4">
      {/* ... other header items ... */}
      <NotificationBell />
    </header>
  );
}
```

### Step 5: Add Compose Panel (Admins/Instructors)
Add NotificationComposePanel to admin dashboard:

```tsx
import { useState } from 'react';
import { NotificationComposePanel } from '@/components/notifications/NotificationComposePanel';

export function AdminDashboard() {
  const [isComposePanelOpen, setIsComposePanelOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsComposePanelOpen(true)}>
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

### Step 6: Add Enrollment Trigger
In your enrollment component/handler:

```tsx
import { sendEnrollmentWelcomeNotification } from '@/services/notificationTriggers';

async function handleEnroll(courseId: string) {
  try {
    // ... enrollment logic ...
    
    // Send welcome notification after successful enrollment
    await sendEnrollmentWelcomeNotification(
      userId,
      courseName,
      courseId,
      instructorId
    );
  } catch (error) {
    console.error('Enrollment error:', error);
  }
}
```

### Step 7: Add Registration Trigger
In your signup/registration handler:

```tsx
import { sendRegistrationWelcomeNotification } from '@/services/notificationTriggers';

async function handleSignup(user: User) {
  try {
    // ... signup logic ...
    
    // Send welcome notification to new user
    await sendRegistrationWelcomeNotification(
      user.id,
      user.email,
      user.name
    );
  } catch (error) {
    console.error('Signup error:', error);
  }
}
```

### Step 8: Add Progress Tracking Trigger
In your progress update handler:

```tsx
import { sendProgressUpdateNotification } from '@/services/notificationTriggers';

async function updateProgress(userId: string, courseId: string, percentage: number) {
  try {
    // ... progress update logic ...
    
    // Send milestone notifications
    if (percentage === 50 || percentage === 75 || percentage === 100) {
      await sendProgressUpdateNotification(
        userId,
        courseName,
        courseId,
        percentage,
        instructorId
      );
    }
  } catch (error) {
    console.error('Progress error:', error);
  }
}
```

## Usage Examples

### Send to Single User
```typescript
// From API endpoint or service
const result = await notificationService.sendNotification({
  userId: 'user-123',
  senderId: 'instructor-456',
  title: 'Course Update',
  message: 'New lesson available',
  type: 'announcement',
  data: { courseId: 'course-789' },
  sendEmail: true,
});
```

### Send to Multiple Users
```typescript
const result = await notificationService.sendBulkNotifications({
  userIds: ['user-1', 'user-2', 'user-3'],
  senderId: 'instructor-456',
  title: 'Class Announcement',
  message: 'Class schedule changed',
  type: 'alert',
  sendEmail: true,
});
```

### Get Notifications with Pagination
```typescript
const result = await notificationService.getNotifications(
  'user-123',
  20,  // limit
  0    // offset
);
// Returns: { notifications[], unreadCount, hasMore }
```

### Mark Notifications as Read
```typescript
// Single notification
await notificationService.markAsRead('notification-123');

// All user notifications
await notificationService.markAllAsRead('user-123');
```

## Frontend Hook Usage

```tsx
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Notifications ({unreadCount} unread)</h2>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <h3>{notif.title}</h3>
          <p>{notif.message}</p>
          {!notif.is_read && (
            <button onClick={() => markAsRead(notif.id)}>Mark Read</button>
          )}
          <button onClick={() => deleteNotification(notif.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Testing Checklist

- [ ] Database migration ran successfully
- [ ] RLS policies restrict access correctly
- [ ] NotificationBell displays in header
- [ ] Unread badge shows correct count
- [ ] Can send notification as admin/instructor
- [ ] Students receive notifications in real-time
- [ ] Mark as read updates unread count
- [ ] Notifications persist after refresh
- [ ] Email sends if Resend configured
- [ ] Enrollment trigger sends welcome notification
- [ ] Registration trigger sends welcome notification
- [ ] Real-time subscription updates UI when new notification arrives
- [ ] Dropdown closes on outside click
- [ ] Delete removes notification from list

## Troubleshooting

**Notifications not appearing**
- Check RLS policies in Supabase dashboard
- Verify user authentication token is valid
- Check browser console for API errors

**Email not sending**
- Verify Resend API key is correct
- Check `RESEND_API_KEY` in `.env.local`
- Verify email format in notification payload

**Real-time not working**
- Enable Realtime for notifications table in Supabase
- Check Supabase connection is active
- Verify browser WebSocket connection

**Mark as read not working**
- Check user has permission to update own notifications
- Verify notification belongs to current user
- Check API response for errors

## API Reference

### Notification Type Enum
```typescript
type NotificationType = 'general' | 'announcement' | 'alert' | 'welcome';
```

### Notification Object
```typescript
interface Notification {
  id: string;
  user_id: string;
  sender_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data: Record<string, any> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
```

### Service Methods Signature
```typescript
// Send single
sendNotification(payload: {
  userId: string;
  senderId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  sendEmail?: boolean;
}): Promise<{ success: boolean; notification: Notification }>;

// Send bulk
sendBulkNotifications(payload: {
  userIds: string[];
  senderId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  sendEmail?: boolean;
}): Promise<{ success: boolean; count: number; failed: number }>;

// Get notifications
getNotifications(
  userId: string,
  limit: number,
  offset: number
): Promise<{ 
  notifications: Notification[]; 
  unreadCount: number; 
  hasMore: boolean 
}>;

// Mark as read
markAsRead(notificationId: string): Promise<boolean>;
markAllAsRead(userId: string): Promise<boolean>;

// Delete
deleteNotification(notificationId: string, userId: string): Promise<boolean>;

// Get unread count
getUnreadCount(userId: string): Promise<number>;
```

## Performance Optimization Tips

1. **Pagination**: Always fetch with limit/offset to avoid loading all notifications
2. **Real-time**: Use realtime subscriptions only in components that display notifications
3. **Indexes**: Database indexes on user_id, (user_id, is_read), created_at for optimal query performance
4. **Caching**: Consider caching unread count with short TTL
5. **Batch Operations**: Use sendBulkNotifications instead of multiple sendNotification calls

## Security Considerations

- RLS policies enforce row-level access control
- Only authenticated users can fetch their notifications
- Only admins/instructors can send notifications (role verification)
- Users can only update/delete their own notifications
- Email sending uses Resend for secure delivery
- All API endpoints require authentication token

## Future Enhancements

- [ ] Notification preferences per user
- [ ] Email digest (daily/weekly summary)
- [ ] Notification templates
- [ ] Push notifications (web/mobile)
- [ ] SMS notifications
- [ ] Notification scheduling
- [ ] Read receipts tracking
- [ ] Notification analytics dashboard
