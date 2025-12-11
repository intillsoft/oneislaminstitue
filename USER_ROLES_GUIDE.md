# 👥 User Roles Guide

## 📋 Overview

The Workflow platform supports **3 user roles** defined in the `users` table:

```sql
role TEXT DEFAULT 'job-seeker' CHECK (role IN ('job-seeker', 'recruiter', 'admin'))
```

---

## 🎯 Role Definitions

### 1. **Job Seeker** (Default Role)
**Default role for all new users**

**Permissions:**
- ✅ Create and manage resumes
- ✅ Search and browse jobs
- ✅ Apply for jobs
- ✅ Save jobs for later
- ✅ Track applications
- ✅ Use AI features (resume generation, job matching, interview prep)
- ✅ Set up job alerts
- ✅ View salary insights
- ✅ Access career advisor
- ✅ Manage profile and settings
- ✅ Subscribe to plans (Free, Basic, Premium, Pro)

**Restrictions:**
- ❌ Cannot post jobs
- ❌ Cannot manage company profiles
- ❌ Cannot access admin features

**Use Cases:**
- Individual job seekers looking for employment
- Career changers exploring opportunities
- Students seeking internships
- Professionals seeking new positions

---

### 2. **Recruiter**
**For companies and hiring managers**

**Permissions:**
- ✅ All Job Seeker permissions, PLUS:
- ✅ Post job listings
- ✅ Manage job postings (create, edit, delete, publish/unpublish)
- ✅ View applications for their posted jobs
- ✅ Manage company profile
- ✅ Access recruiter dashboard
- ✅ Use bulk job posting (CSV upload)
- ✅ Set job pricing and featured listings
- ✅ View application analytics for their jobs
- ✅ Contact applicants
- ✅ Schedule interviews

**Restrictions:**
- ❌ Cannot access admin features
- ❌ Cannot manage other companies' jobs
- ❌ Cannot view other recruiters' data

**Use Cases:**
- HR departments posting jobs
- Recruiting agencies
- Hiring managers
- Company representatives

---

### 3. **Admin**
**Platform administrators**

**Permissions:**
- ✅ All Recruiter permissions, PLUS:
- ✅ Access admin dashboard
- ✅ Manage all users (view, edit, delete, change roles)
- ✅ Moderate job postings (approve, reject, flag)
- ✅ View platform-wide analytics
- ✅ Manage subscriptions and billing
- ✅ Access system logs
- ✅ Manage email templates
- ✅ Configure platform settings
- ✅ View all applications across the platform
- ✅ Manage companies
- ✅ Access service role operations

**Restrictions:**
- ⚠️ Full system access - use with caution

**Use Cases:**
- Platform administrators
- System moderators
- Support staff
- Platform owners

---

## 🔐 Role-Based Access Control (RBAC)

### Database Level (RLS Policies)

All tables use Row Level Security (RLS) with user-scoped policies:

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Jobs are viewable by all authenticated users
CREATE POLICY "Authenticated users can view jobs" 
  ON jobs FOR SELECT 
  USING (auth.uid() IS NOT NULL);
```

### Application Level

Role checks are performed in:
- `src/components/ProtectedRoute.jsx` - Route protection
- Backend middleware - API endpoint protection
- Frontend components - UI element visibility

---

## 🔄 Changing User Roles

### Via Database (SQL)
```sql
-- Change user to recruiter
UPDATE users 
SET role = 'recruiter' 
WHERE email = 'user@example.com';

-- Change user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- Change user back to job seeker
UPDATE users 
SET role = 'job-seeker' 
WHERE email = 'user@example.com';
```

### Via Admin Dashboard (Future)
- Admin users can change roles through the admin panel
- Role changes are logged in `activity_log` table

---

## 📊 Role Distribution

### Default Behavior
- **New signups:** Automatically assigned `job-seeker` role
- **OAuth signups:** Also default to `job-seeker`
- **Manual assignment:** Only admins can change roles

### Role Assignment Flow
1. User signs up → `role = 'job-seeker'` (default)
2. User upgrades to recruiter → Admin changes role to `recruiter`
3. User becomes admin → Admin changes role to `admin`

---

## 🎨 UI Differences by Role

### Job Seeker Dashboard
- Resume builder
- Application tracker
- Saved jobs
- Job alerts
- AI features

### Recruiter Dashboard
- Job posting form
- Job management table
- Application inbox
- Company profile
- Analytics for posted jobs

### Admin Dashboard
- User management
- Job moderation
- Platform analytics
- System settings
- All features from other roles

---

## 🔍 Querying by Role

### Get all job seekers
```sql
SELECT * FROM users WHERE role = 'job-seeker';
```

### Get all recruiters
```sql
SELECT * FROM users WHERE role = 'recruiter';
```

### Get all admins
```sql
SELECT * FROM users WHERE role = 'admin';
```

### Count users by role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

---

## ⚠️ Important Notes

1. **Default Role:** All new users are `job-seeker` by default
2. **Role Changes:** Only admins should change roles (via database or admin panel)
3. **Security:** RLS policies ensure users can only access their own data
4. **Role Field:** The `role` field is in `public.users` table, NOT `auth.users`
5. **No Role Inheritance:** Each role has explicit permissions (no inheritance)

---

## 🚀 Future Enhancements

Potential role additions:
- `moderator` - Limited admin access for content moderation
- `company-admin` - Manage multiple company profiles
- `trial-recruiter` - Limited recruiter access for trials
- `enterprise` - Special enterprise features

---

## 📝 Summary

| Role | Default | Can Post Jobs | Can Admin | Use Case |
|------|---------|---------------|-----------|----------|
| **job-seeker** | ✅ Yes | ❌ No | ❌ No | Regular users |
| **recruiter** | ❌ No | ✅ Yes | ❌ No | Companies/HR |
| **admin** | ❌ No | ✅ Yes | ✅ Yes | Platform admins |

---

## ✅ Verification

After running the schema, verify roles:

```sql
-- Check role constraint
SELECT column_name, data_type, column_default, check_clause
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'role';

-- Should show: CHECK (role IN ('job-seeker', 'recruiter', 'admin'))
```

