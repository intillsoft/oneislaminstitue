# Notification System - Integration & Testing Guide

## ✅ INTEGRATION COMPLETE

The notification system has been integrated into your app with:
- ✅ Enrollment welcome trigger (course-detail/index.jsx)
- ✅ Registration welcome trigger (register/index.jsx)
- ✅ NotificationBell in header (already present)
- ✅ All services and components ready

---

## 🚀 STEP-BY-STEP TESTING GUIDE

### Phase 1: Setup (15 minutes)

#### Step 1.1: Deploy Database Migration
```bash
# Login to Supabase Dashboard
# Go to: SQL Editor
# Copy content from: backend/supabase/migrations/notifications_table.sql
# Execute the SQL
```

**Verify:**
- Table `notifications` appears in Tables list
- Can see columns: id, user_id, sender_id, title, message, type, is_read, created_at
- RLS is "Enabled" (check table settings)

#### Step 1.2: Enable Realtime
```
In Supabase:
1. Go to Notifications table
2. Click "Realtime" toggle (top right)
3. Enable for all events (INSERT, UPDATE, DELETE)
4. Save
```

**Result:** Realtime badge should show "Enabled"

#### Step 1.3: Verify Environment Variables
In `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
RESEND_API_KEY=re_xxx (optional for email)
```

#### Step 1.4: Start Dev Server
```bash
npm run dev
# App should start at http://localhost:5173
```

---

### Phase 2: Test Registration Trigger (20 minutes)

#### Test 2.1: Create New Account
```
1. Open browser: http://localhost:5173
2. Click "Register" (or /register)
3. Select role: "Student"
4. Fill in form:
   - Full Name: Test User
   - Email: testuser@example.com
   - Password: TestPassword123!
   - Confirm: TestPassword123!
   - Check: "Agree to terms"
5. Click "Sign Up"
```

**Expected Result:**
- ✅ Success toast: "Account created successfully!"
- ✅ Redirected to dashboard/student
- ✅ User logged in

**Verify Notification:**
```
1. In same browser, check header bell icon
2. Should see notification badge with "1"
3. Click bell to open dropdown
4. Should see notification:
   - Title: "Welcome! 👋"
   - Message: About platform features
```

**Check Database:**
```javascript
// In Supabase SQL Editor
SELECT * FROM notifications 
WHERE user_id = 'new_user_id' 
ORDER BY created_at DESC;
```

Expected: 1 row with:
- user_id: new user's ID
- title: "Welcome to Our Platform!"
- type: "welcome"
- is_read: false

---

### Phase 3: Test Enrollment Trigger (25 minutes)

#### Test 3.1: Create or Use Test Course
```
Prerequisite: Need a free (non-paid) course in database

If creating new:
1. Login as admin or instructor
2. Go to course management
3. Create new course with:
   - Title: "Test Course 101"
   - Price: Free (salary_min = 0)
   - Save
```

#### Test 3.2: Enroll in Course
```
1. Logout (or use different browser/incognito)
2. Create another test account (testuser2@example.com)
   - Or use existing student account
3. Browse to course catalog or course detail
4. Find your test course
5. Click "Enroll Free" button
```

**Expected Result:**
- ✅ Enrollment succeeds
- ✅ Success modal appears
- ✅ Button changes to "Enrolled" or "Go to Course"
- ✅ Redirects to course learn page

**Verify Notification:**
```
1. Check bell icon (should show "2" if same account)
2. Click bell dropdown
3. Should see new notification:
   - Title: "Welcome to Test Course 101"
   - Message: Course welcome message
   - Type: "welcome"
```

**Check Database:**
```javascript
// In Supabase
SELECT * FROM notifications 
WHERE type = 'welcome' AND title LIKE '%Test Course%'
ORDER BY created_at DESC;
```

Expected: 1 new row with:
- title: "Welcome to Test Course 101"
- message: Contains course name
- type: "welcome"

---

### Phase 4: Test Real-time Updates (15 minutes)

#### Test 4.1: Real-time Notification
```
1. Open two browser windows:
   - Window A: Logged in as Student 1
   - Window B: Logged in as Admin/Instructor

2. In Window A:
   - Open header, see bell icon
   - Count current notifications

3. In Window B:
   - Go to admin dashboard
   - Click "Send Notification"
   - Fill form:
     * Title: "Test Real-time Update"
     * Message: "This should appear instantly!"
     * Type: "Announcement"
     * Target: "All Students"
     * Send Email: checked
   - Click "Send"

4. In Window A (WITHOUT refreshing):
   - Watch bell badge update (should increase)
   - Watch notification appear in dropdown
```

**Expected:**
- ✅ Notification appears in < 1 second
- ✅ No page refresh needed
- ✅ Unread badge updates
- ✅ Message displays correctly

---

### Phase 5: Test Interaction Features (20 minutes)

#### Test 5.1: Mark as Read
```
1. In notification dropdown:
2. Hover over a notification
3. Click the checkmark button
4. Expected:
   - Notification updates in real-time
   - Background changes (not grayed)
   - Unread badge decreases by 1
```

**Verify:**
```javascript
// In Supabase
SELECT is_read, read_at FROM notifications 
WHERE id = 'your_notification_id';

// Expected: is_read = true, read_at = current timestamp
```

#### Test 5.2: Mark All as Read
```
1. Multiple unread notifications in dropdown
2. Click "Mark all as read"
3. Expected:
   - All notifications marked read
   - Badge changes to "0"
   - No unread notifications visible
```

#### Test 5.3: Delete Notification
```
1. Hover over notification
2. Click trash/delete button
3. Expected:
   - Notification removed from dropdown
   - Unread count decreases (if was unread)
   - Disappears from database
```

**Verify:**
```javascript
// Should not find deleted notification
SELECT * FROM notifications WHERE id = 'deleted_id';
// Result: 0 rows
```

---

### Phase 6: Test Email Integration (10 minutes)

#### Test 6.1: Check Email Delivery
```
Prerequisite: RESEND_API_KEY must be set in .env

1. Send a notification with email enabled:
   - Go to admin compose panel
   - Fill form
   - Check "Send Email"
   - Send

2. Check your email inbox for the notification
   - Look for email from sender
   - Verify HTML formatting
   - Click links (should work)

3. Check Resend Dashboard:
   - Log in to resend.com
   - Go to Emails
   - Find your test email
   - Verify status: "Delivered"
```

**Expected:**
- ✅ Email received in inbox
- ✅ HTML formatted beautifully
- ✅ Links clickable
- ✅ Resend shows "Delivered"

---

### Phase 7: Test Admin Compose Panel (15 minutes)

#### Test 7.1: Send to All Students
```
1. Login as Admin
2. Click "Send Notification" button
3. Fill form:
   - Title: "Platform Announcement"
   - Message: "Please update your profile"
   - Type: "Announcement"
   - Send To: "All Students"
   - Send Email: Yes
4. Click Send
```

**Verify:**
- ✅ Success message appears
- ✅ All student accounts receive notification
- ✅ All get emails (if addresses valid)

#### Test 7.2: Send to Specific Users
```
1. Click Send Notification
2. Fill form:
   - Send To: "Specific Users"
   - Select Users: Choose 2-3 students
   - Rest of form...
   - Send
```

**Verify:**
- ✅ Only selected users get notification
- ✅ Others don't receive

#### Test 7.3: Send to Course Enrollees
```
1. Click Send Notification
2. Send To: "Course Enrollees"
3. Enter course ID
4. Rest of form...
5. Send
```

**Verify:**
- ✅ All enrolled students get notification
- ✅ Non-enrolled don't get it

---

### Phase 8: Test Role-Based Access (10 minutes)

#### Test 8.1: Student Cannot Send
```
1. Login as Student
2. Navigate to admin dashboard (should be blocked)
   - Or try to access notification compose
3. Expected:
   - Access denied
   - Cannot see admin panel
   - Compose button not visible
```

#### Test 8.2: Instructor Can Send
```
1. Login as Instructor
2. Should see admin/instructor dashboard
3. Compose button should be visible
4. Can send notifications
```

#### Test 8.3: Admin Full Access
```
1. Login as Admin
2. Full access to all features
3. Can send to all users
4. Can see all notifications
5. Can delete any notification
```

---

### Phase 9: Test Pagination (10 minutes)

#### Test 9.1: Load Notifications
```
1. Send 30+ notifications to test user
2. Open notification dropdown
3. Should show only first 10
4. Scroll down or click "Load More"
5. Expected:
   - Next batch loads
   - Smooth pagination
   - hasMore flag works correctly
```

#### Test 9.2: Unread Count Accuracy
```
1. Various notifications marked read/unread
2. Check badge count
3. Expected:
   - Matches actual unread in database
   - Updates in real-time
   - API returns correct count
```

---

### Phase 10: Test Error Handling (10 minutes)

#### Test 10.1: Network Error
```
1. Slow down network (DevTools > Network > Slow 3G)
2. Send notification
3. Expected:
   - Graceful handling
   - Error message if fails
   - App doesn't crash
   - Can retry
```

#### Test 10.2: Invalid Data
```
1. Try sending empty notification
2. Try with malformed email
3. Expected:
   - Form validation prevents send
   - Error message displayed
   - Cannot submit
```

#### Test 10.3: Database RLS Test
```
1. Try to access other user's notifications:
   - Modify API call in DevTools
   - Change user_id parameter
   - Send request

2. Expected:
   - RLS blocks access
   - Returns 0 rows
   - No data leak
```

---

## 📊 TESTING CHECKLIST

### Registration Flow
- [ ] New account creation triggers notification
- [ ] Notification appears in real-time
- [ ] Email sent (if configured)
- [ ] Notification marked read correctly
- [ ] Delete works
- [ ] Unread count accurate

### Enrollment Flow
- [ ] Course enrollment triggers notification
- [ ] Correct course name in notification
- [ ] Appears in real-time
- [ ] Email sent
- [ ] Can mark read/delete
- [ ] Badge updates

### Admin Features
- [ ] Send to all students
- [ ] Send to specific users
- [ ] Send to course enrollees
- [ ] Email with HTML formatting
- [ ] Role verification (student can't send)
- [ ] Composer form validation

### Real-time
- [ ] Updates appear instantly (< 1 second)
- [ ] No refresh needed
- [ ] Multiple users synchronized
- [ ] Unread badges sync
- [ ] Works with Realtime disabled (falls back)

### Database
- [ ] RLS policies enforced
- [ ] Users can't access others' notifications
- [ ] Admins can delete any notification
- [ ] Indexes working (queries fast)
- [ ] Pagination returns correct data

### Performance
- [ ] API responses < 200ms
- [ ] Real-time < 1 second
- [ ] Smooth pagination
- [ ] No UI lag with 100+ notifications
- [ ] Email sends quickly (2-5s)

---

## 🐛 TROUBLESHOOTING

### Notification Not Appearing
**Problem:** Created notification but can't see it
```
Checklist:
- [ ] Logged in correctly
- [ ] Notification is for current user
- [ ] Check Supabase table directly
- [ ] Refresh page
- [ ] Check browser console for errors
- [ ] Verify RLS policies (Supabase > notifications > RLS)
```

### Email Not Sending
**Problem:** Notifications appear but no email
```
Checklist:
- [ ] RESEND_API_KEY set in .env
- [ ] Email address valid
- [ ] Check Resend dashboard > Emails
- [ ] Look for error messages
- [ ] Try with test email first
- [ ] Check spam folder
```

### Real-time Not Working
**Problem:** Notifications appear only after refresh
```
Checklist:
- [ ] Realtime enabled for notifications table
- [ ] WebSocket connection (DevTools > Network > WS)
- [ ] Disable ad blockers
- [ ] Check Supabase status page
- [ ] Try different browser
- [ ] Clear cache and reload
```

### Badge Count Wrong
**Problem:** Unread badge shows incorrect count
```
Checklist:
- [ ] Mark all as read
- [ ] Reload page
- [ ] Check database directly: SELECT COUNT(*) FROM notifications WHERE is_read = false AND user_id = 'your_id'
- [ ] Should match badge
- [ ] If not, check for race conditions
```

### Enrollment Notification Not Triggering
**Problem:** Enroll but no notification
```
Checklist:
- [ ] Check console for errors
- [ ] Verify course ID is passed correctly
- [ ] Check database notifications table
- [ ] Verify user is authenticated
- [ ] Check notificationTriggers import works
```

---

## 📈 PERFORMANCE BENCHMARKS

Target metrics:
- API response time: < 200ms ✓
- Real-time update: < 1 second ✓
- Email send time: 2-5 seconds ✓
- Database query time: < 50ms ✓
- Pagination load: < 100ms ✓

Test with:
```bash
# In browser console
// Time API call
console.time('notification-api');
fetch('/api/notifications').then(r => r.json());
console.timeEnd('notification-api');
```

---

## 🎯 SUCCESS CRITERIA

All tests pass when:

✅ **Registration**
- New users get welcome notification
- Email delivered (if configured)
- Notification persists after refresh

✅ **Enrollment**
- Course enrollment triggers notification
- Contains correct course name
- Works for free courses

✅ **Real-time**
- Multiple users see updates instantly
- No manual refresh needed
- Badges update automatically

✅ **Admin**
- Can send notifications
- Students can't send
- Form validates input

✅ **Database**
- RLS protects privacy
- Pagination works
- Queries are fast

✅ **Email**
- Formatted HTML emails
- Links work
- Resend shows delivery

---

## 📝 TEST RESULTS TEMPLATE

```markdown
# Notification System Test Results

**Date**: _______________
**Tester**: _______________
**Environment**: Local / Staging / Production

## Results

### Registration Test
- ✓ / ✗ New account creates notification
- ✓ / ✗ Email sent
- ✓ / ✗ Appears in real-time
- Notes: _______________

### Enrollment Test
- ✓ / ✗ Course enrollment triggers
- ✓ / ✗ Correct course name
- ✓ / ✗ Works for free courses
- Notes: _______________

### Real-time Test
- ✓ / ✗ Updates < 1 second
- ✓ / ✗ No refresh needed
- ✓ / ✗ Syncs across users
- Notes: _______________

### Admin Test
- ✓ / ✗ Can send notifications
- ✓ / ✗ Form validates
- ✓ / ✗ Role verification works
- Notes: _______________

## Issues Found
1. _______________
2. _______________
3. _______________

## Overall Status
- ✓ Ready for Production
- ✗ Needs Fixes (see issues above)
```

---

## 🚀 NEXT STEPS AFTER TESTING

If all tests pass:
1. ✅ Deploy database migration to staging
2. ✅ Deploy API & services to staging
3. ✅ Deploy UI components to staging
4. ✅ Run full staging tests
5. ✅ Deploy to production
6. ✅ Monitor notifications (first 24 hours)
7. ✅ Gather user feedback

If issues found:
1. Document issue
2. Debug (check console, DB, etc.)
3. Fix code
4. Retest
5. Repeat until all pass

---

## 📞 SUPPORT

For issues during testing:
1. Check troubleshooting section
2. Review browser console errors
3. Check Supabase dashboard
4. Check Resend dashboard (for email)
5. Verify environment variables
6. Review documentation: NOTIFICATION_SYSTEM_INTEGRATION_GUIDE.md

**Ready to test?** Start with Phase 1 setup! 🎉
