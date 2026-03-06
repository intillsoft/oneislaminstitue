# Notification System - Architecture & Deployment Checklist

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐    ┌─────────────────────┐                │
│  │ NotificationBell │    │ ComposePanel        │                │
│  │ - Bell icon      │    │ (Admin/Instructor)  │                │
│  │ - Badge count    │    │ - Send notifications│                │
│  │ - Dropdown       │    │ - Target selection  │                │
│  │ - Mark as read   │    │ - Form validation   │                │
│  └────────┬─────────┘    └──────────┬──────────┘                │
│           │                         │                            │
│  ┌────────▼─────────────────────────▼─────────┐                 │
│  │     useNotifications() Hook                 │                 │
│  │ - notifications state                      │                 │
│  │ - unreadCount                              │                 │
│  │ - Methods: markAsRead, delete, fetch       │                 │
│  │ - Real-time subscription                   │                 │
│  └────────┬───────────────────────────────────┘                 │
│           │                                                       │
└───────────┼───────────────────────────────────────────────────────┘
            │
            │ HTTP/WebSocket
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /api/notifications                                              │
│  ├─ GET    - Fetch notifications (+ pagination)                │
│  ├─ POST   - Send notification (role check)                    │
│  ├─ PATCH  - Mark as read                                      │
│  └─ DELETE - Delete notification                              │
│                                                                   │
└────────────┬──────────────────────────────────────────────────────┘
             │
             │ Service Layer
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  notificationService                                             │
│  ├─ sendNotification(payload)                                  │
│  ├─ sendBulkNotifications(payload)                             │
│  ├─ markAsRead(id)                                             │
│  ├─ getNotifications(userId, limit, offset)                    │
│  ├─ deleteNotification(id, userId)                             │
│  ├─ getUnreadCount(userId)                                     │
│  └─ markAllAsRead(userId)                                      │
│                                                                   │
│  notificationTriggers                                            │
│  ├─ sendEnrollmentWelcome()                                    │
│  ├─ sendRegistrationWelcome()                                  │
│  ├─ sendCourseCompletion()                                     │
│  ├─ sendLessonAvailable()                                      │
│  ├─ sendAssignmentReminder()                                   │
│  ├─ sendProgressUpdate()                                       │
│  └─ sendAnnouncement()                                         │
│                                                                   │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ├─────────────────────┬──────────────────────┐
           │                     │                      │
           ▼                     ▼                      ▼
┌──────────────────┐   ┌─────────────────┐   ┌──────────────────┐
│  Supabase        │   │   Resend        │   │  emailTemplates  │
│  (Database)      │   │   (Email)       │   │  (HTML)          │
│                  │   │                 │   │                  │
│ notifications    │   │ - send()        │   │ 7 template types │
│   - 1 table      │   │ - tracking      │   │ - Enrollment     │
│   - 10+ RLS      │   │ - analytics     │   │ - Registration   │
│   - 3 indexes    │   │                 │   │ - Completion     │
│   - Realtime     │   │                 │   │ - Lesson         │
└──────────────────┘   └─────────────────┘   │ - Assignment     │
                                              │ - Progress       │
                                              │ - Announcement   │
                                              └──────────────────┘
```

## 🔄 Data Flow

### Scenario 1: User Enrolls in Course
```
1. User clicks "Enroll Free"
   │
   └─▶ EnrollmentHandler processes enrollment
       │
       └─▶ Save to applications table
           │
           └─▶ Call sendEnrollmentWelcomeNotification()
               │
               ├─▶ notificationService.sendNotification()
               │   │
               │   ├─▶ Insert into notifications table
               │   │
               │   ├─▶ resend.emails.send()
               │   │   └─▶ HTML email to user
               │   │
               │   └─▶ Return notification
               │
               └─▶ Complete (enrollment succeeds even if notification fails)

2. Real-time: User sees bell badge update immediately
3. User opens dropdown: sees notification with "Mark as Read" option
4. User clicks button: notification marked read, unread count decreases
```

### Scenario 2: Admin Sends Announcement
```
1. Admin fills compose form
   │
   ├─ Title: "New Course Released"
   ├─ Message: "Check out Python 101"
   ├─ Target: All Students
   ├─ Type: Announcement
   └─ Send Email: Yes

2. Submit ▶ POST /api/notifications
   │
   └─▶ API verifies role (admin/instructor)
       │
       └─▶ notificationService.sendBulkNotifications({
              userIds: [all students],
              title, message, type,
              sendEmail: true
           })
           │
           ├─▶ Insert into notifications (bulk)
           │
           ├─▶ resend.emails.send() × N (for each user)
           │
           └─▶ Return { success, count, failed }

3. Real-time: Each student sees notification
4. Bell badges update automatically
5. Email received with HTML template
```

### Scenario 3: Student Receives & Interacts
```
1. WebSocket: Real-time subscription receives notification
   │
   └─▶ NotificationBell component updates state

2. UI updates immediately:
   - Bell badge shows unread count
   - Dropdown shows new notification
   
3. Student clicks notification:
   ├─▶ PATCH /api/notifications/:id
   │   └─▶ notificationService.markAsRead()
   │       └─▶ UPDATE notifications table
   │
   └─▶ UI reflects change:
       - Notification marked as read
       - Unread count decreases

4. Student clicks delete:
   ├─▶ DELETE /api/notifications/:id
   │   └─▶ notificationService.deleteNotification()
   │       └─▶ DELETE from notifications table
   │
   └─▶ Notification removed from dropdown
```

---

## ✅ Deployment Checklist

### Pre-Deployment (Day Before)

#### Code Review
- [ ] Review all 11 files created
- [ ] Check TypeScript compilation (no errors)
- [ ] Verify no console.log left in production code
- [ ] Check error handling completeness
- [ ] Review RLS policies in SQL

#### Testing
- [ ] Run local tests on all components
- [ ] Test API endpoints with Postman/curl
- [ ] Verify real-time subscriptions
- [ ] Test email templates render correctly
- [ ] Test with different user roles

#### Security Review
- [ ] Verify all API endpoints check authentication
- [ ] Check role verification in POST endpoint
- [ ] Verify RLS policies are correct
- [ ] Check for SQL injection vulnerabilities
- [ ] Review email sending security

---

### Deployment Day - Phase 1: Database (15 min)

#### 1. Backup Current Database
- [ ] Create Supabase backup point
- [ ] Note current schema version
- [ ] Document rollback plan

#### 2. Deploy Migration
```sql
-- Copy from: backend/supabase/migrations/notifications_table.sql
-- Paste in: Supabase > SQL Editor
-- Execute

-- Verify:
SELECT COUNT(*) FROM notifications;  -- Should be 0
```

#### 3. Verify Schema
- [ ] notifications table exists
- [ ] All columns present with correct types
- [ ] Indexes created successfully
- [ ] RLS policies enabled
- [ ] Triggers working (updated_at updates)

#### 4. Enable Realtime
- [ ] Go to Supabase Dashboard
- [ ] Navigate to notifications table
- [ ] Enable Realtime (toggle on)
- [ ] Verify WebSocket connection works

#### 5. Test Basic Operations
```javascript
// In browser console (authenticated user):
await fetch('/api/notifications').then(r => r.json())
// Should return: { notifications: [], unreadCount: 0 }
```

---

### Deployment Day - Phase 2: Backend (20 min)

#### 1. Deploy API Routes
- [ ] Deploy `src/app/api/notifications/route.ts`
- [ ] Verify endpoints accessible
- [ ] Test each endpoint

```bash
# Test GET
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://yourapi.com/api/notifications

# Test POST (needs admin token)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userIds":["test"],"title":"Test","message":"Test"}' \
  https://yourapi.com/api/notifications
```

#### 2. Deploy Services
- [ ] Deploy `src/services/notificationService.ts`
- [ ] Deploy `src/services/notificationTriggers.ts`
- [ ] Deploy `src/services/emailTemplates.ts`

#### 3. Configure Environment
- [ ] Add RESEND_API_KEY to production .env
- [ ] Verify Supabase keys are correct
- [ ] Test email sending with test recipient

#### 4. Test Email Delivery
- [ ] Send test notification with email
- [ ] Verify email received
- [ ] Check email formatting
- [ ] Verify all links work

---

### Deployment Day - Phase 3: Frontend (15 min)

#### 1. Deploy Components
- [ ] Deploy `src/components/notifications/NotificationBell.tsx`
- [ ] Deploy `src/components/notifications/NotificationComposePanel.tsx`

#### 2. Deploy Hook
- [ ] Deploy `src/hooks/useNotifications.ts`

#### 3. Deploy Type Definitions
- [ ] Deploy `src/types/notification.types.ts`

#### 4. Update Header Component
- [ ] Add NotificationBell import
- [ ] Add to header JSX
- [ ] Remove old notification UI (if exists)
- [ ] Test bell displays correctly

#### 5. Update Admin Dashboard
- [ ] Add NotificationComposePanel import
- [ ] Add compose button
- [ ] Test form displays correctly

---

### Deployment Day - Phase 4: Testing (30 min)

#### User Journey Tests

**Test 1: New User Welcome**
- [ ] Create new test account
- [ ] Verify registration welcome notification appears
- [ ] Check email received
- [ ] Verify notification marked as read works
- [ ] Verify delete works

**Test 2: Enrollment Welcome**
- [ ] Log in as student
- [ ] Enroll in test course
- [ ] Verify welcome notification appears
- [ ] Check email received
- [ ] Verify real-time update (no page refresh)

**Test 3: Admin Sends Notification**
- [ ] Log in as admin
- [ ] Click "Send Notification"
- [ ] Send to all students
- [ ] Log in as student
- [ ] Verify notification appears in real-time
- [ ] Check email received

**Test 4: Role-Based Access**
- [ ] Try sending notification as student (should fail)
- [ ] Verify error message
- [ ] Try with admin (should succeed)

**Test 5: Real-time Synchronization**
- [ ] Open two browser windows
- [ ] Send notification to user A
- [ ] Verify appears in real-time in user A's window
- [ ] Mark as read in one window
- [ ] Verify updates in other window

**Test 6: Pagination**
- [ ] Send 50 notifications to test user
- [ ] Verify limit/offset working
- [ ] Check "Load More" works
- [ ] Verify unread count accurate

#### Performance Tests
- [ ] Check API response time < 200ms
- [ ] Check real-time update < 1 second
- [ ] Send bulk notification (100+ users)
- [ ] Verify no UI lag

#### Security Tests
- [ ] Try accessing notifications without auth (should fail)
- [ ] Try deleting another user's notification (should fail)
- [ ] Verify RLS policies working
- [ ] Check no data leaks in API

---

### Deployment Day - Phase 5: Monitoring Setup (10 min)

#### 1. Setup Error Tracking
- [ ] Configure error logging for API
- [ ] Setup email delivery monitoring (Resend dashboard)
- [ ] Monitor database for slow queries

#### 2. Setup Alerts
- [ ] Alert if email delivery rate drops
- [ ] Alert if API errors spike
- [ ] Alert if real-time subscriptions drop

#### 3. Setup Dashboards
- [ ] Create notification metrics dashboard
- [ ] Track: sent/day, emails/day, errors
- [ ] Monitor: API response times, DB query times

---

### Post-Deployment (Week 1)

#### Daily Checks
- [ ] Monitor error logs
- [ ] Check email delivery rate
- [ ] Monitor API performance
- [ ] Check real-time connection stability

#### User Feedback
- [ ] Collect user feedback
- [ ] Monitor notification engagement
- [ ] Gather feature requests
- [ ] Note any issues

#### Performance Monitoring
- [ ] Track database growth
- [ ] Monitor API load
- [ ] Analyze real-time usage
- [ ] Check email costs (Resend)

---

## 🚨 Rollback Plan

If critical issues occur:

### Quick Rollback
```bash
# 1. Remove NotificationBell from header
# 2. Remove NotificationComposePanel from admin
# 3. Remove API route file
# 4. Redeploy without notification code
```

### Database Rollback
```bash
# In Supabase:
# - Restore from backup point (created before migration)
# OR
# - Drop notifications table
# - Restore services to pre-notification version
```

### Keep These Safe
- [ ] Pre-migration database backup
- [ ] Previous API version
- [ ] Previous component versions
- [ ] Deployment instructions

---

## 📊 Deployment Timeline

| Phase | Task | Time | Dependencies |
|-------|------|------|--------------|
| 1 | Database setup | 15 min | Supabase access |
| 2 | Backend deployment | 20 min | Phase 1 complete |
| 3 | Frontend deployment | 15 min | Phase 2 complete |
| 4 | Testing | 30 min | Phase 3 complete |
| 5 | Monitoring | 10 min | Phase 4 complete |
| **Total** | | **90 min** | |

---

## 📞 Support During Deployment

### If Issues Arise
1. Check documentation first
2. Review error logs
3. Refer to troubleshooting section
4. Test isolated components
5. Consider rollback if critical

### Common Issues & Solutions

**Issue**: Notifications not appearing
- [ ] Check Realtime enabled for table
- [ ] Verify RLS policies
- [ ] Check WebSocket connection
- [ ] Verify user is authenticated

**Issue**: Email not sending
- [ ] Check RESEND_API_KEY is set
- [ ] Verify API key is valid (Resend dashboard)
- [ ] Check email addresses are valid
- [ ] Check email template rendering

**Issue**: Slow API response
- [ ] Check database indexes
- [ ] Verify pagination working
- [ ] Monitor database load
- [ ] Check network latency

**Issue**: Real-time not updating
- [ ] Disable ad blockers
- [ ] Check WebSocket in DevTools
- [ ] Verify Supabase connection
- [ ] Try page refresh

---

## ✨ Success Criteria

Deployment is successful when:

✅ Database schema deployed  
✅ API endpoints responding  
✅ Real-time subscriptions working  
✅ Email sending successfully  
✅ UI components displaying  
✅ All tests passing  
✅ Performance metrics good  
✅ No critical errors  
✅ Users receiving notifications  
✅ Monitoring alerts configured  

---

## 📝 Post-Deployment Notes

Document these after deployment:
- [ ] Deployment date/time
- [ ] Any issues encountered
- [ ] Solutions applied
- [ ] Performance metrics
- [ ] User feedback summary
- [ ] Next optimization opportunities

---

**Deployment Ready**: ✅ YES  
**Risk Level**: 🟢 LOW (isolated feature, no breaking changes)  
**Estimated Deployment Time**: 90 minutes  
**Expected Downtime**: None (zero-downtime deployment)  
**Rollback Time**: < 15 minutes if needed
