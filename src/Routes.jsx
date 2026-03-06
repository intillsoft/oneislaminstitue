import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation, Navigate } from "react-router-dom";
import { DonationProvider } from "./contexts/DonationContext";
import { AIPanelProvider } from "./contexts/AIPanelContext";
import { motion } from "framer-motion";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import DashboardHeader from "components/ui/DashboardHeader";
import MobileBottomNav from "components/ui/MobileBottomNav";
import DashboardMobileNav from "components/ui/DashboardMobileNav";
import ProtectedRoute from "components/ProtectedRoute";
import GlobalLoader from "components/ui/GlobalLoader";
import AILoader from "components/ui/AILoader";

// Dynamic imports for pages
const StudentRegistrationLogin = lazy(() => import("pages/auth"));
const CourseDetail = lazy(() => import("pages/course-detail"));
const CourseLearning = lazy(() => import("pages/course-discovery/CourseLearning"));
const HomePage = lazy(() => import("pages/HomePage"));
const AISearchResults = lazy(() => import("pages/ai-search-results"));
const ForgotPassword = lazy(() => import("pages/forgot-password"));
const ResetPassword = lazy(() => import("pages/reset-password"));
const AuthCallback = lazy(() => import("pages/auth-callback"));
const Mission = lazy(() => import("pages/Mission"));
const Methodology = lazy(() => import("pages/Methodology"));
const Donate = lazy(() => import("pages/Donate"));
const JoinTeam = lazy(() => import("pages/JoinTeam"));
const ApplyTeam = lazy(() => import("pages/ApplyTeam"));
const CourseOnboarding = lazy(() => import("pages/course-detail/CourseOnboarding"));
const LessonView = lazy(() => import("pages/course-discovery/LessonView"));
const CourseDiscovery = lazy(() => import("pages/course-catalog"));
const DashboardDispatcher = lazy(() => import("pages/DashboardDispatcher"));
const StudentDashboard = lazy(() => import("pages/student-dashboard"));
const LearningPathPage = lazy(() => import("pages/LearningPathPage"));
const SavedCoursesPage = lazy(() => import("pages/SavedCoursesPage"));
const StudyProgressTracker = lazy(() => import("pages/study-progress/StudyProgressTracker"));
const MyCertificates = lazy(() => import("pages/certificates/MyCertificates"));
const ClassSchedule = lazy(() => import("pages/class-schedule/ClassSchedule"));
const AchievementsPage = lazy(() => import("pages/student-dashboard/AchievementsPage"));
const UserProfile = lazy(() => import("pages/user-profile"));
const InstructorPortal = lazy(() => import("pages/instructor-dashboard"));
const CourseManagementPage = lazy(() => import("pages/course-management"));
const AdminModerationManagement = lazy(() => import("pages/admin-moderation-management"));
const BillingPage = lazy(() => import("pages/billing/BillingPage"));
const Checkout = lazy(() => import("pages/checkout"));
const VerifyPayment = lazy(() => import("pages/checkout/VerifyPayment"));
const NotFound = lazy(() => import("pages/NotFound"));
const StudentNotifications = lazy(() => import("pages/notifications/StudentNotifications"));
const InstructorNotifications = lazy(() => import("pages/notifications/InstructorNotifications"));
const AdminNotifications = lazy(() => import("pages/notifications/AdminNotifications"));

// Specific exports from AdminModerationManagement (wrapped as lazy too)
const ModerationQueue = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.ModerationQueue })));
const ContentModerationPanel = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.ContentModerationPanel })));
const UserManagementSection = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.UserManagementSection })));
const RoleChangeRequestsSection = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.RoleChangeRequestsSection })));
const JobsManagementSection = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.JobsManagementSection })));
const ApplicationsManagementSection = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.ApplicationsManagementSection })));
const JobCrawlerPanel = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.JobCrawlerPanel })));
const PlatformAnalytics = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.PlatformAnalytics })));
const AIServiceControl = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.AIServiceControl })));
const FinancialIntelligence = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.FinancialIntelligence })));
const SystemMonitoring = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.SystemMonitoring })));
const ConfigurationPanels = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.ConfigurationPanels })));
const AuditTrail = lazy(() => import("pages/admin-moderation-management").then(module => ({ default: module.AuditTrail })));

import GlobalAIPanel from "components/ui/GlobalAIPanel";
import MainLayout from "components/layout/MainLayout";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<GlobalLoader text="Loading your path..." />}>
      <RouterRoutes>
        <Route path="/" element={
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage isPublic={true} />
          </motion.div>
        } />
        <Route path="/register" element={<StudentRegistrationLogin />} />
        <Route path="/login" element={<StudentRegistrationLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Static Pages */}
        <Route path="/mission" element={<Mission />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/team" element={<JoinTeam />} />
        <Route path="/team/apply" element={<ApplyTeam />} />
        <Route path="/community" element={<Navigate to="/register" />} />

        {/* Course Routes */}
        <Route path="/courses/detail/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/learn" element={<ProtectedRoute><CourseLearning /></ProtectedRoute>} />
        <Route path="/courses/:id/onboarding" element={<ProtectedRoute><CourseOnboarding /></ProtectedRoute>} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />

        <Route path="/courses" element={<CourseDiscovery />} />
        <Route path="/courses/search-results" element={<AISearchResults />} />

        {/* Unified Protected Layout for all Dashboard/Account/Management pages */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Dashboard Sub-routes */}
          <Route path="/dashboard">
            <Route index element={<DashboardDispatcher />} />
            <Route path="student" element={<ProtectedRoute allowedRoles={['student', 'job-seeker']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="enrollments" element={<LearningPathPage />} />
            <Route path="saved" element={<SavedCoursesPage />} />
            <Route path="learning-path" element={<LearningPathPage />} />
            <Route path="progress" element={<ProtectedRoute allowedRoles={['student', 'job-seeker']}><StudyProgressTracker /></ProtectedRoute>} />
            <Route path="certificates" element={<ProtectedRoute allowedRoles={['student', 'job-seeker']}><MyCertificates /></ProtectedRoute>} />
            <Route path="schedule" element={<ProtectedRoute allowedRoles={['student', 'job-seeker']}><ClassSchedule /></ProtectedRoute>} />
            <Route path="achievements" element={<ProtectedRoute allowedRoles={['student', 'job-seeker']}><AchievementsPage /></ProtectedRoute>} />
          </Route>

          {/* Account Routes */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/billing" element={<BillingPage />} />

          {/* Notification Routes */}
          <Route path="/notifications">
            <Route index element={<ProtectedRoute allowedRoles={['student', 'job-seeker']}><StudentNotifications /></ProtectedRoute>} />
            <Route path="instructor" element={<ProtectedRoute allowedRoles={['recruiter', 'instructor', 'admin']}><InstructorNotifications /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminNotifications /></ProtectedRoute>} />
          </Route>

          {/* Instructor Management Routes */}
          <Route path="/instructor">
            <Route path="dashboard" element={<InstructorPortal />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path=":tab" element={<InstructorPortal />} />
            </Route>
            <Route path="courses" element={<CourseManagementPage activeTab="manage" />} />
            <Route path="courses/new" element={<CourseManagementPage activeTab="create" />} />
          </Route>

          {/* Admin Command Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminModerationManagement /></ProtectedRoute>}>
            <Route index element={<Navigate to="moderation" replace />} />
            <Route path="moderation" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="pulse" text="Loading Queue..." /></div>}><ModerationQueue /></Suspense>} />
            <Route path="content" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="pulse" text="Loading Panel..." /></div>}><ContentModerationPanel /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="neural" text="Loading Users..." /></div>}><UserManagementSection /></Suspense>} />
            <Route path="role-requests" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="neural" text="Loading Requests..." /></div>}><RoleChangeRequestsSection /></Suspense>} />
            <Route path="jobs" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="pulse" text="Loading Courses..." /></div>}><JobsManagementSection /></Suspense>} />
            <Route path="applications" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="pulse" text="Loading Applications..." /></div>}><ApplicationsManagementSection /></Suspense>} />
            <Route path="crawler" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="orbit" text="Loading Crawler..." /></div>}><JobCrawlerPanel /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="neural" text="Loading Analytics..." /></div>}><PlatformAnalytics /></Suspense>} />
            <Route path="ai-control" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="neural" text="Loading Services..." /></div>}><AIServiceControl /></Suspense>} />
            <Route path="financials" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="orbit" text="Loading Data..." /></div>}><FinancialIntelligence /></Suspense>} />
            <Route path="system" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="neural" text="Loading System..." /></div>}><SystemMonitoring /></Suspense>} />
            <Route path="config" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="pulse" text="Loading Config..." /></div>}><ConfigurationPanels /></Suspense>} />
            <Route path="audit" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="neural" text="Loading Logs..." /></div>}><AuditTrail /></Suspense>} />
            <Route path=":tab" element={<Suspense fallback={<div className="flex flex-col items-center justify-center py-20"><AILoader variant="pulse" text="Loading Tab..." /></div>}><ModerationQueue /></Suspense>} /> 
          </Route>
        </Route>

        {/* Billing & Checkout */}

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/verify" element={<VerifyPayment />} />

        <Route path="/pricing" element={<Navigate replace to="/donate" />} />

        {/* Legacy Redirects */}
        <Route replace path="/recruiter-dashboard-analytics" element={<Navigate replace to="/instructor/dashboard" />} />
        <Route replace path="/job-search-browse" element={<Navigate replace to="/courses" />} />
        <Route replace path="/job-seeker-dashboard" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard/profile" element={<Navigate replace to="/profile" />} />
        <Route path="/user-profile" element={<Navigate replace to="/profile" />} />

        <Route path="*" element={<Suspense fallback={<GlobalLoader text="Loading..." />}><NotFound /></Suspense>} />
      </RouterRoutes>
    </Suspense>
  );
};

const HeaderWrapper = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'];
  const dashboardPaths = ['/dashboard', '/instructor', '/admin', '/profile', '/billing'];

  const shouldHideHeader = hideHeaderPaths.some(path => location.pathname === path || location.pathname.startsWith(path));
  const isDashboard = dashboardPaths.some(path => location.pathname === path || location.pathname.startsWith(path));

  if (shouldHideHeader) return null;
  if (isDashboard) return <DashboardHeader />;
  return <Header />;
};

const AdvisorWrapper = () => {
  return null;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <DonationProvider>
          <AIPanelProvider>
            <ScrollToTop />
            <HeaderWrapper />
            <AnimatedRoutes />
            <GlobalAIPanel />
            <AdvisorWrapper />
            <MobileBottomNav />
            <DashboardMobileNav />
          </AIPanelProvider>
        </DonationProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
export default Routes;
