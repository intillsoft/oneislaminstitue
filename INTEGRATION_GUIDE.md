# Backend Integration Guide

## 🎯 Overview

This guide documents the complete backend integration for Workflow - AI Job Search & Resume Platform. All mock data has been replaced with real Supabase database connections and API integrations.

## 📋 Integration Status

### ✅ Completed Integrations

1. **Core Infrastructure**
   - ✅ Supabase client configuration
   - ✅ API service layer with authentication
   - ✅ Custom React hooks for Supabase
   - ✅ Authentication context provider
   - ✅ Protected route component

2. **Services Created**
   - ✅ Job service (`src/services/jobService.js`)
   - ✅ Resume service (`src/services/resumeService.js`)

### 🔄 In Progress

3. **Component Integration**
   - 🔄 Job search/browse pages
   - 🔄 Resume builder
   - 🔄 Application tracking
   - 🔄 User dashboard

## 🚀 Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example
cp .env.example .env
```

Fill in your values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3001/api
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `axios` - HTTP client for API calls

### 3. Database Setup

Ensure your Supabase database has all required tables:
- `users`
- `jobs`
- `resumes`
- `applications`
- `saved_jobs`
- `companies`
- `subscriptions`

See `backend/supabase/schema.sql` for the complete schema.

### 4. Authentication Setup

Configure OAuth providers in Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Google OAuth
3. Enable GitHub OAuth
4. Configure redirect URLs

## 📚 Usage Examples

### Using Job Service

```jsx
import { jobService } from '../services/jobService';
import { useState, useEffect } from 'react';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await jobService.getAll({
          search: 'developer',
          location: 'San Francisco',
          remote: true,
          page: 1,
          pageSize: 20,
        });
        setJobs(result.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Render jobs...
}
```

### Using Resume Service

```jsx
import { resumeService } from '../services/resumeService';

// Create resume
const createResume = async () => {
  try {
    const resume = await resumeService.create({
      title: 'Software Engineer Resume',
      content: resumeData,
      isDefault: true,
    });
    console.log('Resume created:', resume);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Generate with AI
const generateResume = async () => {
  try {
    const result = await resumeService.generateAI({
      job_title: 'Software Engineer',
      experience_level: 'mid',
      industry: 'Technology',
      skills: ['JavaScript', 'React'],
      achievements: ['Led team of 5'],
    });
    console.log('AI Resume:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Using Authentication

```jsx
import { useAuthContext } from '../contexts/AuthContext';

function MyComponent() {
  const { user, profile, signOut, signInWithOAuth } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      await signInWithOAuth('google');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!user) {
    return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
  }

  return <div>Welcome, {profile?.name || user.email}</div>;
}
```

### Using Supabase Hooks

```jsx
import { useSupabaseQuery } from '../hooks/useSupabase';

function SavedJobs() {
  const { data: savedJobs, loading, error, refetch } = useSupabaseQuery(
    'saved_jobs',
    {
      select: '*, job:jobs(*)',
      filters: [
        { column: 'user_id', operator: 'eq', value: userId },
      ],
      orderBy: { column: 'saved_at', ascending: false },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {savedJobs?.map(job => (
        <div key={job.id}>{job.job.title}</div>
      ))}
    </div>
  );
}
```

## 🔐 Protected Routes

Wrap routes that require authentication:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// With subscription requirement
<Route
  path="/premium-features"
  element={
    <ProtectedRoute requireSubscription={true} requiredTier="premium">
      <PremiumFeatures />
    </ProtectedRoute>
  }
/>
```

## 🔄 Migration Checklist

### Pages to Update

- [ ] `src/pages/job-search-browse/index.jsx` - Replace mock jobs
- [ ] `src/pages/job-seeker-dashboard/index.jsx` - Connect to real data
- [ ] `src/pages/job-detail-application/index.jsx` - Real application flow
- [ ] `src/pages/resume-builder-ai-enhancement/index.jsx` - Save to database
- [ ] `src/pages/job-seeker-registration-login/` - Real auth
- [ ] All dashboard components - Replace mock data

### Components to Update

- [ ] `JobManagementTable` - Connect to jobs API
- [ ] `SavedJobs` - Use saved_jobs table
- [ ] `ApplicationTracker` - Connect to applications
- [ ] `JobAlerts` - Real alert management

## 🧪 Testing

### Test Authentication

```bash
# Test sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test sign in
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Job Service

```javascript
// In browser console
import { jobService } from './services/jobService';

// Get all jobs
jobService.getAll().then(console.log);

// Search jobs
jobService.search('developer', { location: 'San Francisco' }).then(console.log);
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists with correct values
- Restart dev server after adding env vars
- Check variable names start with `VITE_`

### "Not authenticated" errors
- Check if user is logged in
- Verify session is valid
- Check RLS policies in Supabase

### API errors
- Verify backend server is running
- Check API URL in `.env`
- Verify authentication token is sent

## 📖 Next Steps

1. **Update Components**: Replace all mock data with service calls
2. **Add Error Handling**: Implement proper error boundaries
3. **Add Loading States**: Show loading indicators
4. **Optimize Queries**: Add caching and pagination
5. **Add Real-time**: Use Supabase real-time subscriptions
6. **Test End-to-End**: Test all user flows

## 🔗 Related Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Backend API Docs](./backend/README_AI.md)
- [Resume Builder Guide](./RESUME_BUILDER_GUIDE.md)

