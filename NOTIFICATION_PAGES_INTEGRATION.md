# How to Add Notification Pages to Your App Routes

## Routes Configuration

Add these routes to your main router file (likely `src/App.jsx` or `src/routes.jsx`):

```javascript
import StudentNotifications from './pages/notifications/StudentNotifications';
import InstructorNotifications from './pages/notifications/InstructorNotifications';
import AdminNotifications from './pages/notifications/AdminNotifications';

// Add these routes to your router:
const routes = [
  // ... existing routes ...
  
  // Notification Pages (Role-based)
  {
    path: '/notifications',
    element: <StudentNotifications />,
    meta: { requiresAuth: true, roles: ['student'] }
  },
  {
    path: '/notifications/instructor',
    element: <InstructorNotifications />,
    meta: { requiresAuth: true, roles: ['instructor'] }
  },
  {
    path: '/notifications/admin',
    element: <AdminNotifications />,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  
  // ... rest of routes ...
];
```

## Navigation Integration

Add navigation links in your sidebars/menus:

### For Student Dashboard (`src/components/ui/UnifiedSidebar.jsx` or `src/pages/student-dashboard/components/`):
```javascript
{
  label: '📬 Notifications',
  icon: 'bell',
  href: '/notifications',
  roles: ['student']
}
```

### For Instructor Dashboard (`src/components/ui/UnifiedSidebar.jsx` or similar):
```javascript
{
  label: '📬 Notifications',
  icon: 'bell',
  href: '/notifications/instructor',
  roles: ['instructor']
}
```

### For Admin Dashboard (`src/components/ui/DashboardMobileNav.jsx` or `src/components/ui/UnifiedSidebar.jsx`):
```javascript
{
  label: '🔔 Notification Control',
  icon: 'bell',
  href: '/notifications/admin',
  roles: ['admin']
}
```

## Features by Role

### 👨‍🎓 Student Notifications Page
- **URL**: `/notifications`
- **Features**:
  - View all personal notifications
  - Filter: All, Unread, Read
  - Mark as read/unread
  - Delete individual notifications
  - Mark all as read button
  - Real-time updates (no refresh needed)
  - Statistics: Total, Unread, Announcements
  - Notification types: welcome, enrollment, assignment, completed, announcement, grade, progress

### 👨‍🏫 Instructor Notifications Page
- **URL**: `/notifications/instructor`
- **Features**:
  - **Received Tab**:
    - View notifications from admin/system
    - Filter unread/read
    - Mark as read/unread
    - Delete notifications
  - **Sent Tab**:
    - View all notifications sent to students
    - Statistics of sent notifications
    - Delete sent notifications
  - **Compose Panel**:
    - Send notifications to all students
    - Send to specific course enrollees
    - Send to specific users
    - Choose notification type
    - HTML message support

### 👨‍💼 Admin Notifications Page
- **URL**: `/notifications/admin`
- **Features**:
  - View all system notifications
  - Statistics dashboard (by role: student, instructor, admin)
  - Filter: All, Unread, Read
  - Search notifications by user name or email
  - **Compose Panel**:
    - Send to all users
    - Send by role (students, instructors, admins)
    - Send to specific user
    - Choose notification type
    - System-wide announcements
  - Delete individual or all notifications
  - Real-time updates across all users

## Real-time Features

All pages include:
- ✅ Real-time notification updates (Supabase Realtime)
- ✅ Unread badge counter
- ✅ Instant notifications without refresh
- ✅ WebSocket connection for live updates

## Styling & Theme

All pages use:
- 🎨 EliteCard and ElitePageHeader components (matches your design)
- 🌙 Full dark mode support
- 📱 Responsive mobile design
- ✨ Gradient backgrounds
- 🎯 Tailwind CSS

## Integration Checklist

- [ ] Create notification routes in your router
- [ ] Add navigation links in sidebars/menus
- [ ] Test each role's notification page:
  - [ ] Student: `/notifications`
  - [ ] Instructor: `/notifications/instructor`
  - [ ] Admin: `/notifications/admin`
- [ ] Verify real-time updates work
- [ ] Test sending notifications from each role
- [ ] Test filtering and search
- [ ] Check dark mode display
- [ ] Test on mobile
- [ ] Verify database migration is deployed

## Testing Each Page

### Test Student Page
```
1. Login as student
2. Navigate to /notifications
3. Should see any notifications from registration/enrollment
4. Click notifications to mark read/unread
5. Try deleting a notification
6. Try "Mark All as Read"
```

### Test Instructor Page
```
1. Login as instructor
2. Navigate to /notifications/instructor
3. Check Received tab
4. Click "Send Notification" button
5. Choose "All Students" or specific course
6. Fill in title and message
7. Click Send
8. Switch to "Sent" tab to see it
9. Verify student received it
```

### Test Admin Page
```
1. Login as admin
2. Navigate to /notifications/admin
3. See statistics (total, by role)
4. Try filtering (all, unread, read)
5. Click "Send Notification"
6. Try "All Users"
7. Try "By Role" - send to students only
8. Try "Specific User"
9. Verify recipients got notifications
```

## Common Issues & Solutions

### Notification Page Not Showing
**Problem**: Page shows 404 or blank
**Solution**:
- Check route is added correctly
- Verify user has correct role
- Check URL path matches route config
- Look for console errors (F12)

### Real-time Not Working
**Problem**: Notifications don't update without refresh
**Solution**:
- Ensure Realtime is enabled in Supabase
- Check WebSocket connection (DevTools > Network > WS)
- Try refreshing page
- Check browser allows WebSockets

### Can't Send Notifications (Instructor)
**Problem**: "Send" button disabled or error
**Solution**:
- Check user role is "instructor"
- Verify database migration deployed
- Check Supabase RLS policies
- Check browser console for errors

### Filtering Not Working
**Problem**: Filter buttons don't update list
**Solution**:
- Check notifications loaded (look for data)
- Try refreshing page
- Clear browser cache
- Check console for errors

## Next Steps

1. ✅ Deploy database migration (if not done)
2. ✅ Add routes to your router
3. ✅ Add navigation links to sidebars
4. ✅ Test each page
5. ✅ Deploy to production
6. ✅ Monitor real-time performance

All pages are production-ready and follow your app's design system! 🚀
