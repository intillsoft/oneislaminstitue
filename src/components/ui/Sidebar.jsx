/**
 * Responsive Sidebar Component
 * Beautiful sidebar with collapse functionality, mobile hamburger menu
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';

// Safe theme hook - uses direct DOM manipulation
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loadingProfile, signOut } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine user role - normalize legacy roles
  const getNormalizedRole = () => {
    if (loadingProfile) return null;
    const role = profile?.role || (user ? 'student' : null);
    if (role === 'job-seeker' || role === 'scholar') return 'student';
    if (role === 'recruiter' || role === 'faculty') return 'instructor';
    return role;
  };

  const userRole = getNormalizedRole();

  // Navigation items based on role
  const navigationItems = {
    'student': [
      { label: 'Dashboard', path: '/dashboard/student', icon: 'LayoutDashboard' },
      { label: 'Browse Courses', path: '/courses', icon: 'Search' },
      { label: 'My Learning', path: '/dashboard/learning-path', icon: 'FileText' },
      { label: 'Resume Builder', path: '/resume-builder-ai-enhancement', icon: 'FileEdit' },
      { label: 'Career Training', path: '/career-training', icon: 'GraduationCap' },
    ],
    'instructor': [
      { label: 'Dashboard', path: '/instructor/dashboard', icon: 'BarChart3' },
      { label: 'Create Course', path: '/instructor/courses/create', icon: 'Plus' },
      { label: 'Browse', path: '/courses', icon: 'Search' },
      { label: 'Faculty Team', path: '/instructor/company', icon: 'Building2' },
      { label: 'Profile', path: '/profile', icon: 'User' },
    ],
    'admin': [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'Shield' },
      { label: 'Browse Courses', path: '/courses', icon: 'Search' },
      { label: 'User Registry', path: '/admin/users', icon: 'Users' },
      { label: 'Course Catalog', path: '/admin/courses', icon: 'Briefcase' },
      { label: 'System Analytics', path: '/admin/analytics', icon: 'BarChart3' },
      { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
    ],
  };

  const items = navigationItems[userRole] || navigationItems['student'];

  const isActive = (path) => {
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      return location.pathname === basePath && location.search.includes(query.split('=')[1]);
    }
    return location.pathname === path;
  };

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-[#13182E] border-r border-[#E2E8F0] dark:border-[#1E2640]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] dark:border-[#1E2640]">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-workflow-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Workflow</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-workflow-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">W</span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'} py-3 rounded-lg transition-all duration-200 min-h-[44px] ${isActive(item.path)
              ? 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary dark:text-workflow-primary-400 font-semibold'
              : 'text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] hover:text-[#0F172A] dark:hover:text-[#E8EAED]'
              }`}
          >
            <Icon 
              name={item.icon} 
              size={isCollapsed ? 22 : 20} 
              className={isActive(item.path) ? 'text-workflow-primary' : 'text-slate-400 dark:text-slate-300 group-hover:text-workflow-primary transition-colors'}
            />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer - User Section & Theme Toggle */}
      <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2640] space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px]"
        >
          <Icon name={theme === 'dark' ? "Sun" : "Moon"} size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Toggle Theme</span>}
        </button>

        {/* User Profile */}
        {user && (
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#F8FAFC] dark:bg-[#1A2139] ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-workflow-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED] truncate">
                  {profile?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#8B92A3] truncate capitalize">
                  {userRole || 'User'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sign Out */}
        {user && (
          <button
            onClick={async () => {
              await signOut();
              navigate('/');
              if (isMobile) onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors min-h-[44px] ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Icon name="LogOut" size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        )}
      </div>
    </div>
  );

  // Mobile: Slide-in overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 300, ease: 'easeInOut' }}
      className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30"
    >
      {sidebarContent}
    </motion.div>
  );
};

export default Sidebar;

