import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, User, Settings, LogOut, Bell, Sparkles, Users, Briefcase, Shield, BarChart3, LayoutDashboard, CreditCard } from 'lucide-react';
import Icon from '../AppIcon';
import DarkModeToggle from './DarkModeToggle';
import { useToast } from './Toast';
import { useAuthContext } from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';

// Fallback if ToastProvider not available
const useToastSafe = () => {
  try {
    return useToast();
  } catch {
    return { success: () => { } };
  }
};

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToastSafe();
  const { user, profile, loadingProfile, signOut } = useAuthContext();
  const isAuthenticated = !!user;
  // Wait for profile to load before determining role
  const userRole = (!loadingProfile && profile?.role) ? profile.role : (isAuthenticated ? 'job-seeker' : null);

  const navigationItems = {
    'job-seeker': [
      { label: 'Browse Jobs', path: '/jobs', icon: Search },
      { label: 'Discover Talent', path: '/talent/discover', icon: Users },
      { label: 'Pricing', path: '/pricing', icon: CreditCard },
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Applications', path: '/dashboard/applications', icon: 'FileText' },
    ],
    'recruiter': [
      { label: 'Browse Jobs', path: '/jobs', icon: Search },
      { label: 'Discover Talent', path: '/talent/discover', icon: Users },
      { label: 'Pricing', path: '/pricing', icon: CreditCard },
      { label: 'Dashboard', path: '/recruiter/dashboard', icon: BarChart3 },
      { label: 'Post Job', path: '/recruiter/jobs', icon: 'Plus' },
      { label: 'Company', path: '/recruiter/company', icon: 'Building2' },
    ],
    'talent': [
      { label: 'Browse Jobs', path: '/jobs', icon: Search },
      { label: 'Discover Talent', path: '/talent/discover', icon: Users },
      { label: 'Pricing', path: '/pricing', icon: CreditCard },
      { label: 'Dashboard', path: '/talent/dashboard', icon: LayoutDashboard },
      { label: 'My Gigs', path: '/talent/gigs', icon: Briefcase },
    ],
    'admin': [
      { label: 'Browse Jobs', path: '/jobs', icon: Search },
      { label: 'Discover Talent', path: '/talent/discover', icon: Users },
      { label: 'Pricing', path: '/pricing', icon: CreditCard },
      { label: 'Admin Panel', path: '/admin/dashboard', icon: Shield },
    ],
    'anonymous': [
      { label: 'Browse Jobs', path: '/jobs', icon: Search },
      { label: 'Discover Talent', path: '/talent/discover', icon: Users },
      { label: 'Pricing', path: '/pricing', icon: CreditCard },
    ]
  };

  // Get navigation items based on role, fallback to anonymous if not loaded yet
  const currentNavItems = isAuthenticated
    ? (userRole ? navigationItems?.[userRole] : navigationItems?.['job-seeker'])
    : navigationItems?.['anonymous'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsSearchExpanded(false);
      }
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
      success('Searching for jobs...');
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const getUserDisplayName = () => {
    if (profile?.name) return profile.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(`/jobs`);
      success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-[#13182E]/95 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-[#1E2640] shadow-lg'
        : 'bg-white dark:bg-[#0A0E27] border-b border-transparent'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Beautiful Text Only */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-workflow-primary via-workflow-primary-500 to-workflow-primary-600 bg-clip-text text-transparent tracking-tight">
                Workflow
              </span>
            </Link>
          </motion.div>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentNavItems?.map((item) => {
              const IconComponent = typeof item.icon === 'string' ? (Icon[item.icon] || Search) : item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-workflow-primary/10 text-workflow-primary dark:bg-workflow-primary/20 dark:text-workflow-primary'
                      : 'text-text-secondary dark:text-dark-text-secondary hover:bg-secondary-100 dark:hover:bg-dark-surface hover:text-text-primary dark:hover:text-dark-text'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle - Visible on tablet and desktop */}
            <div className="hidden md:block">
              <DarkModeToggle />
            </div>

            {/* Notifications - Only for authenticated users - Visible on tablet and desktop */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <NotificationBell />
              </div>
            )}

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-dark-surface transition-colors"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={getUserDisplayName()}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-text-primary dark:text-dark-text">
                    {getUserDisplayName()}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#13182E] rounded-xl shadow-modal border border-[#E2E8F0] dark:border-[#1E2640] overflow-hidden z-50"
                    >
                      <Link
                        to="/user-profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-100 dark:hover:bg-dark-surface transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary" />
                        <span className="text-sm text-text-primary dark:text-dark-text">Profile</span>
                      </Link>
                      <Link
                        to="/talent/settings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-100 dark:hover:bg-dark-surface transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary" />
                        <span className="text-sm text-text-primary dark:text-dark-text">Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-100 dark:hover:bg-dark-surface transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary" />
                        <span className="text-sm text-text-primary dark:text-dark-text">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-all duration-300 shadow-soft hover:shadow-card-hover hover:scale-105 active:scale-95 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle - Hidden, use bottom tabs instead */}
          </div>
        </div>

        {/* Mobile Menu - Removed, using bottom tabs instead */}
      </div>
    </motion.header>
  );
};

export default Header;
