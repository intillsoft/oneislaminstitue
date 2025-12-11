import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAuthContext } from '../../contexts/AuthContext';

const JobSeekerRegistrationLogin = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on login or register route
  const isLoginPage = location.pathname === '/login';
  const [activeTab, setActiveTab] = useState(isLoginPage ? 'login' : 'register');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab(isLoginPage ? 'login' : 'register');
  }, [isLoginPage]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: isLoginPage ? 'Sign In' : 'Create Account', path: location.pathname, isLast: true }
  ];

  const handleAuthSuccess = (userData) => {
    setIsLoading(true);
    // Navigation is handled by the forms themselves
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb customItems={breadcrumbItems} />

        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-workflow-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Briefcase" size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Welcome to Workflow
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              {activeTab === 'login'
                ? 'Sign in to access your personalized job dashboard'
                : 'Create your account to start your job search journey'
              }
            </p>
          </div>

          {/* Separate Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link
              to="/login"
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'login'
                ? 'bg-workflow-primary text-white shadow-lg'
                : 'bg-white dark:bg-[#13182E] text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-workflow-primary dark:hover:border-purple-500'
                }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'register'
                ? 'bg-workflow-primary text-white shadow-lg'
                : 'bg-white dark:bg-[#13182E] text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-workflow-primary dark:hover:border-purple-500'
                }`}
            >
              Create Account
            </Link>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 mb-6">
            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            )}
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Link
                to="/terms"
                className="text-[#64748B] dark:text-[#8B92A3] hover:text-workflow-primary transition-smooth"
              >
                Terms of Service
              </Link>
              <span className="text-[#E2E8F0] dark:text-[#1E2640]">•</span>
              <Link
                to="/privacy"
                className="text-[#64748B] dark:text-[#8B92A3] hover:text-workflow-primary transition-smooth"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="text-sm text-[#64748B] dark:text-[#8B92A3]">
              Looking to hire talent?{' '}
              <Link
                to="/recruiter/company"
                className="text-workflow-primary hover:text-workflow-primary-600 font-medium transition-smooth"
              >
                Post a job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerRegistrationLogin;
