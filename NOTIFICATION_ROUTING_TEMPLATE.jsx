// Notification Pages Routing Template
// Add this to your main router/App configuration

import StudentNotifications from './pages/notifications/StudentNotifications';
import InstructorNotifications from './pages/notifications/InstructorNotifications';
import AdminNotifications from './pages/notifications/AdminNotifications';

// Add these route objects to your router array:

const notificationRoutes = [
  // Student Notifications Page
  {
    path: '/notifications',
    element: <StudentNotifications />,
    meta: {
      requiresAuth: true,
      roles: ['student'],
      title: 'My Notifications'
    }
  },

  // Instructor Notifications Page
  {
    path: '/notifications/instructor',
    element: <InstructorNotifications />,
    meta: {
      requiresAuth: true,
      roles: ['instructor'],
      title: 'Notification Center'
    }
  },

  // Admin Notifications Page
  {
    path: '/notifications/admin',
    element: <AdminNotifications />,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Admin Notification Control'
    }
  }
];

// Export for use in your router
export default notificationRoutes;

// ==============================================================
// Alternative: If using React Router v6 with direct config
// ==============================================================

import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/notifications',
    element: <StudentNotifications />,
  },
  {
    path: '/notifications/instructor',
    element: <InstructorNotifications />,
  },
  {
    path: '/notifications/admin',
    element: <AdminNotifications />,
  },
  // ... other routes
]);

// ==============================================================
// Add these navigation items to your sidebar/menu
// ==============================================================

// For UnifiedSidebar.jsx or your main navigation:

const navigationItems = [
  // ... existing items ...

  // Notifications - Role Based
  {
    label: '📬 Notifications',
    icon: 'bell',
    href: '/notifications',
    roles: ['student'],
    section: 'main'
  },
  {
    label: '📬 Notifications',
    icon: 'bell', 
    href: '/notifications/instructor',
    roles: ['instructor'],
    section: 'main'
  },
  {
    label: '🔔 Notification Control',
    icon: 'bell',
    href: '/notifications/admin',
    roles: ['admin'],
    section: 'management'
  },
];

// ==============================================================
// Role-based route protection (if not already implemented)
// ==============================================================

// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ element, requiredRoles }) => {
  const { user, profile, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requiredRoles && !requiredRoles.includes(profile?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

// Usage in router:
// <Route
//   path="/notifications"
//   element={<ProtectedRoute element={<StudentNotifications />} requiredRoles={['student']} />}
// />

// ==============================================================
// Quick Integration Guide
// ==============================================================

/*
STEP 1: Add imports to your router file
---
import StudentNotifications from './pages/notifications/StudentNotifications';
import InstructorNotifications from './pages/notifications/InstructorNotifications';
import AdminNotifications from './pages/notifications/AdminNotifications';

STEP 2: Add route definitions
---
// In your routes array:
{
  path: '/notifications',
  element: <ProtectedRoute element={<StudentNotifications />} requiredRoles={['student']} />,
},
{
  path: '/notifications/instructor',
  element: <ProtectedRoute element={<InstructorNotifications />} requiredRoles={['instructor']} />,
},
{
  path: '/notifications/admin',
  element: <ProtectedRoute element={<AdminNotifications />} requiredRoles={['admin']} />,
}

STEP 3: Add navigation links
---
// In UnifiedSidebar.jsx or similar:
{
  label: '📬 Notifications',
  icon: 'bell',
  href: '/notifications',
  roles: ['student']
},
{
  label: '📬 Notifications',
  icon: 'bell',
  href: '/notifications/instructor',
  roles: ['instructor']
},
{
  label: '🔔 Notification Control',
  icon: 'bell',
  href: '/notifications/admin',
  roles: ['admin']
}

STEP 4: Test
---
1. Login as each role (student, instructor, admin)
2. Navigate to the notification page for that role
3. Should see notifications and be able to manage them
4. Test sending/receiving notifications

DONE! 🎉
*/
