import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAuthContext } from '../../contexts/AuthContext';
import Logo from 'components/Logo';

const StudentRegistrationLogin = () => {
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
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    setActiveTab(isLoginPage ? 'login' : 'register');
  }, [isLoginPage]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: isLoginPage ? 'Scholar Entry' : 'Join the Academy', path: location.pathname, isLast: true }
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
    <div className="min-h-screen bg-mesh-elite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb customItems={breadcrumbItems} />

        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10 flex flex-col items-center">
            <Logo size="lg" className="mb-6" />
            <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.2em] px-4">
              {activeTab === 'login'
                ? 'Sign in to access your learning dashboard'
                : 'Join our elite academic community to start your scholarship journey'
              }
            </p>
          </div>

          {/* Separate Navigation Buttons - Refactored for Elite Look */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-8">
            <Link
              to="/login"
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all ${activeTab === 'login'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              Scholar Login
            </Link>
            <Link
              to="/register"
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all ${activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              Enroll Now
            </Link>
          </div>

          {/* Form Container */}
          <div className="glass-elite rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            )}
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Link
                to="/terms"
                className="hover:text-emerald-500 transition-all"
              >
                Terms
              </Link>
              <span className="opacity-20">•</span>
              <Link
                to="/privacy"
                className="hover:text-emerald-500 transition-all"
              >
                Privacy
              </Link>
            </div>

            <div className="text-[11px] font-bold text-slate-500">
              Passionate about scholarship?{' '}
              <Link
                to="/recruiter/company"
                className="text-white hover:text-emerald-500 transition-all"
              >
                Become an Instructor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationLogin;
