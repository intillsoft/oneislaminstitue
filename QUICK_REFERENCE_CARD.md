# ⚡ QUICK REFERENCE CARD

## 🎯 DO THIS FIRST (5 minutes)

```bash
# 1. Copy this SQL:
backend/supabase/migrations/notifications_table.sql

# 2. Paste in: Supabase > SQL Editor
# 3. Click: Run
# 4. Check: notifications table created

# 5. Enable Realtime:
Supabase > notifications table > Realtime toggle > ON
```

---

## 🧪 TEST THIS (10 minutes)

```
1. npm run dev
2. Go to /register
3. Create account
4. Look at bell icon → See notification ✓
5. Go to /course-detail/[id]
6. Click "Enroll Free"
7. Look at bell icon → See notification ✓
```

---

## 📁 IMPORTANT FILES

| File | What It Does |
|------|-------------|
| `backend/supabase/migrations/notifications_table.sql` | Database schema |
| `src/pages/register/index.jsx` | Where registration trigger added |
| `src/pages/course-detail/index.jsx` | Where enrollment trigger added |
| `src/components/ui/Header.jsx` | Bell icon (already there) |
| `src/components/notifications/NotificationBell.tsx` | Bell component |
| `src/services/notificationTriggers.ts` | 7 auto-trigger functions |

---

## 🔗 INTEGRATION POINTS

**Registration Flow:**
```
→ src/pages/register/index.jsx
→ Line 88-115
→ After signUp() call
→ Fires: sendRegistrationWelcomeNotification()
```

**Enrollment Flow:**
```
→ src/pages/course-detail/index.jsx
→ Line 152-170
→ After enrollmentService.create()
→ Fires: sendEnrollmentWelcomeNotification()
```

---

## 🚀 DEPLOYMENT STEPS

```
STEP 1: Deploy Database (5 min)
□ Supabase SQL Editor
□ Paste SQL from migrations file
□ Run

STEP 2: Enable Realtime (1 min)
□ Go to notifications table
□ Toggle Realtime ON

STEP 3: Test App (10 min)
□ Register new account
□ Enroll in course
□ Check bell for notifications

STEP 4: Add Email (optional, 5 min)
□ Get Resend API key
□ Add to .env.local
□ Restart dev server

STEP 5: Full Testing (30 min)
□ Follow NOTIFICATION_SYSTEM_TESTING_GUIDE.md
□ Test all features
□ Document results
```

---

## 📊 WHAT HAPPENS NOW

### User Registers:
```
→ Account created ✓
→ Notification created ✓
→ Bell shows badge ✓
→ Email sent (if configured) ✓
```

### User Enrolls:
```
→ Enrollment saved ✓
→ Notification created ✓
→ Bell shows badge ✓
→ Email sent (if configured) ✓
```

---

## 🔧 ENV VARIABLES

**Required (already should be set):**
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Optional (for email):**
```
RESEND_API_KEY=re_xxx
```

---

## 🐛 QUICK DEBUG

**Notification not appearing?**
```
1. Open: Supabase > notifications table
2. See rows? Yes = DB OK, check Real-time
3. No rows = trigger not firing, check console
4. Console errors? Fix and retry
5. Still no? Refresh page (Realtime may be delayed)
```

**Email not sending?**
```
1. Is RESEND_API_KEY set? 
   → .env.local must have it
   → Dev server must be restarted
2. Is key valid?
   → Test at https://resend.com
3. Check Resend dashboard for bounced emails
```

**Real-time not working?**
```
1. Is Realtime ON?
   → Supabase > notifications > Realtime toggle
2. WebSocket connected?
   → DevTools > Network > WS (should be connected)
3. Still not working?
   → Refresh page (will load notifications)
```

---

## 📞 HELP

| Issue | Check |
|-------|-------|
| No notifications appear | Is DB deployed? Is Realtime ON? |
| Email not sent | Is RESEND_API_KEY set? Restart server? |
| Bell not showing | Is NotificationBell imported in Header? |
| Slow notifications | Are indexes created? (Check DB) |
| Access denied | Check RLS policies (Supabase) |

---

## 📚 GUIDES

1. **Setup & Deploy**: `SUPABASE_DEPLOYMENT_GUIDE.md`
2. **Full Testing**: `NOTIFICATION_SYSTEM_TESTING_GUIDE.md`
3. **API Docs**: `NOTIFICATION_SYSTEM_API_REFERENCE.md`
4. **Architecture**: `NOTIFICATION_SYSTEM_ARCHITECTURE.md`
5. **Status**: `INTEGRATION_STATUS_NEXT_STEPS.md` ← YOU ARE HERE

---

## ✅ SUCCESS CHECKLIST

```
□ Database deployed (table created)
□ Realtime enabled
□ Dev server running
□ Register → See notification in bell ✓
□ Enroll → See notification in bell ✓
□ Click bell → Notifications appear ✓
□ Mark read → Updates in real-time ✓
□ Delete → Removes from list ✓
```

---

## 🎉 DONE!

Your notification system is live! Time to:
1. Deploy database (right now)
2. Run tests (next 15 minutes)
3. Add email (optional)
4. Go production (when ready)

**Questions?** Check the detailed guides above.

**Ready?** Go deploy! 🚀
