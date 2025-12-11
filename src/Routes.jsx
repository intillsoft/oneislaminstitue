import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import MobileBottomNav from "components/ui/MobileBottomNav";
import ProtectedRoute from "components/ProtectedRoute";
import JobSeekerRegistrationLogin from "pages/job-seeker-registration-login";
import JobDetailApplication from "pages/job-detail-application";
import JobApplicationPage from "pages/job-application";
import JobSearchBrowse from "pages/job-search-browse";
import JobSeekerDashboard from "pages/job-seeker-dashboard";
import RecruiterDashboardAnalytics from "pages/recruiter-dashboard-analytics";
import CompanyRegistrationProfileSetup from "pages/company-registration-profile-setup";
import CompanyProfileView from "pages/company-profile-view";
import JobPostingCreationManagement from "pages/job-posting-creation-management";
import AdminModerationManagement from "pages/admin-moderation-management";
import ResumeBuilderAIEnhancement from "pages/resume-builder-ai-enhancement";
import ResumeGeneratorAI from "pages/resume-generator-ai";
import CareerAdvisorAI from "pages/career-advisor-ai";
import AIPoweredJobMatchingRecommendations from "pages/ai-powered-job-matching-recommendations";
import InterviewPrep from "pages/interview-prep/InterviewPrep";
import SalaryIntelligence from "pages/salary-intelligence/SalaryIntelligence";
import ApplicationDoctor from "pages/application-doctor/ApplicationDoctor";
import NetworkingAgent from "pages/networking-agent/NetworkingAgent";
import SalaryNegotiation from "pages/salary-negotiation/SalaryNegotiation";
import CultureFit from "pages/culture-fit/CultureFit";
import DayInTheLife from "pages/day-in-the-life/DayInTheLife";
import SkillGapBridge from "pages/skill-gap-bridge/SkillGapBridge";
import CoverLetterGhostwriter from "pages/cover-letter-ghostwriter/CoverLetterGhostwriter";
import JobMarketWeather from "pages/job-market-weather/JobMarketWeather";
import PortfolioBuilder from "pages/portfolio-builder/PortfolioBuilder";
import WorkflowApplicationTrackingAnalytics from "pages/workflow-application-tracking-analytics";


import HomePage from "pages/HomePage";
import AISearchResults from "pages/ai-search-results";
import ForgotPassword from "pages/forgot-password";
import ResetPassword from "pages/reset-password";
import AuthCallback from "pages/auth-callback";
import UserProfile from "pages/user-profile";
import ApplicationDetail from "pages/application-detail";
import Pricing from "pages/pricing";
import Billing from "pages/billing";
import AutoApplySettings from "pages/auto-apply-settings";
import NotFound from "pages/NotFound";
import TalentDashboard from "pages/talent-dashboard";
import TalentMarketplace from "pages/talent-marketplace";
import TalentProfile from "pages/talent-profile";
import TalentGigCreate from "pages/talent-gig-create";
import TalentGigEdit from "pages/talent-gig-edit";
import TalentGigDetail from "pages/talent-gig-detail";
import TalentGigsList from "pages/talent-gigs-list";
import TalentOrders from "pages/talent-orders";
import TalentMessages from "pages/talent-messages";
import Messages from "pages/messages";
import TalentDiscover from "pages/talent-discover";
import TalentSettings from "pages/talent-settings";
import TalentEarnings from "pages/talent-earnings";
import TalentReviews from "pages/talent-reviews";
import TalentRegistration from "pages/talent-registration";
import RecruiterRegistration from "pages/recruiter-registration";
import TalentSkillVerification from "pages/talent-skill-verification";
import Register from "pages/register";
import MainLayout from "components/layout/MainLayout";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
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
      <Route path="/register" element={
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Register />
        </motion.div>
      } />
      <Route path="/login" element={
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <JobSeekerRegistrationLogin />
        </motion.div>
      } />
      {/* Redundant login route kept for backward compatibility if needed, or redirect */}
      <Route path="/job-seeker-registration-login" element={<JobSeekerRegistrationLogin />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      <Route
        path="/talent/register"
        element={
          <ProtectedRoute>
            <TalentRegistration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/register"
        element={
          <ProtectedRoute>
            <RecruiterRegistration />
          </ProtectedRoute>
        }
      />
      <Route path="/jobs/detail" element={<JobDetailApplication />} />
      <Route
        path="/applications/new"
        element={
          <ProtectedRoute>
            <JobApplicationPage />
          </ProtectedRoute>
        }
      />
      <Route path="/jobs" element={<JobSearchBrowse />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <JobSeekerDashboard />
        </ProtectedRoute>
      }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterDashboardAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/company"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <CompanyRegistrationProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/:companyId"
        element={<CompanyProfileView />}
      />
      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <JobPostingCreationManagement />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminModerationManagement />
          </ProtectedRoute>
        }
      />

      {/* Tools & Features (Standardized URLs) */}
      <Route
        path="/dashboard/resume-builder"
        element={
          <ProtectedRoute>
            <ResumeBuilderAIEnhancement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/resume-generator"
        element={
          <ProtectedRoute>
            <ResumeGeneratorAI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/career-advisor"
        element={
          <ProtectedRoute>
            <CareerAdvisorAI />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/recommended" element={<AIPoweredJobMatchingRecommendations />} />
      <Route path="/jobs/search-results" element={<AISearchResults />} />

      <Route
        path="/dashboard/interview-prep"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InterviewPrep />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/salary-intel"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalaryIntelligence />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/app-doctor"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicationDoctor />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/networking"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NetworkingAgent />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/negotiation"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalaryNegotiation />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/culture-fit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CultureFit />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/day-in-life"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DayInTheLife />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/skill-bridge"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SkillGapBridge />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/cover-letter"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CoverLetterGhostwriter />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/market-weather"
        element={
          <ProtectedRoute>
            <MainLayout>
              <JobMarketWeather />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/portfolio"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PortfolioBuilder />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/applications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WorkflowApplicationTrackingAnalytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/application-detail"
        element={
          <ProtectedRoute>
            <ApplicationDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/pricing" element={<Pricing />} />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/autopilot"
        element={
          <ProtectedRoute>
            <AutoApplySettings />
          </ProtectedRoute>
        }
      />

      {/* Talent Marketplace Routes */}
      <Route
        path="/talent/dashboard"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/talent/marketplace" element={<TalentMarketplace />} />
      <Route path="/talent/profile/:id" element={<TalentProfile />} />
      <Route
        path="/talent/profile"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/verify-skill"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentSkillVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/gigs/create"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentGigCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/gigs/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentGigEdit />
          </ProtectedRoute>
        }
      />
      <Route path="/talent/gigs/:id" element={<TalentGigDetail />} />
      <Route
        path="/talent/gigs"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentGigsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/orders"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/messages"
        element={
          <ProtectedRoute>
            <TalentMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/reviews"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentReviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/earnings"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentEarnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/settings"
        element={
          <ProtectedRoute allowedRoles={['talent', 'admin']}>
            <TalentSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/talent/discover" element={<TalentDiscover />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

const HeaderWrapper = () => {
  const location = useLocation();

  // Hide header on login/register pages to avoid duplicate headers
  const hideHeaderPaths = [
    '/login',
    '/register',
    '/job-seeker-registration-login',
    '/forgot-password',
    '/reset-password'
  ];
  const shouldHideHeader = hideHeaderPaths.some(path => location.pathname === path || location.pathname.startsWith(path));

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <HeaderWrapper />
        <AnimatedRoutes />
        <MobileBottomNav />
      </ErrorBoundary>
    </BrowserRouter>
  );
};
export default Routes;
