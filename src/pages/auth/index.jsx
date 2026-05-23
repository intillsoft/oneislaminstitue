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
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-background text-foreground transition-all duration-300 relative overflow-hidden px-4 py-2">
      {/* Premium Ambient Lighting Accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5 pointer-events-none" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4 flex flex-col items-center">
            <Logo size="md" className="mb-1" />
            <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-[0.15em] px-4 max-w-sm mx-auto text-center mt-1 leading-relaxed">
              {activeTab === 'login'
                ? 'Sign in to access your learning dashboard'
                : 'Join our elite academic community to start your scholarship journey'
              }
            </p>
          </div>

          {/* Separate Navigation Buttons - Refactored for Elite Look */}
          <div className="flex bg-muted/20 dark:bg-card/40 p-0.5 rounded-xl border border-border/40 mb-3.5">
            <Link
              to="/login"
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all ${activeTab === 'login'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                }`}
            >
              Scholar Login
            </Link>
            <Link
              to="/register"
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all ${activeTab === 'register'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                }`}
            >
              Enroll Now
            </Link>
          </div>

          <div className="bg-card/80 dark:bg-card/45 backdrop-blur-xl border border-border/50 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-3.5 w-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            )}
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Link
                to="/terms"
                className="hover:text-primary transition-all"
              >
                Terms
              </Link>
              <span className="opacity-20">•</span>
              <Link
                to="/privacy"
                className="hover:text-primary transition-all"
              >
                Privacy
              </Link>
            </div>

            <div className="text-[11px] font-bold text-[var(--color-text-tertiary)]">
              Passionate about scholarship?{' '}
              <Link
                to="/recruiter/company"
                className="text-white hover:text-[var(--color-primary)] transition-all"
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
