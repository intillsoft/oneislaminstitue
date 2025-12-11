import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Briefcase, User, FileText, Building2, Shield, Plus, Users } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, profile } = useAuthContext();
  const isAuthenticated = !!user;
  const userRole = profile?.role || 'job-seeker';

  // Role-based navigation items
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/job-search-browse', label: 'Search', icon: Search },
        { path: '/talent/discover', label: 'Discover', icon: Users },
        { path: '/job-seeker-registration-login', label: 'Sign In', icon: User }
      ];
    }

    // Admin navigation
    if (userRole === 'admin') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/job-search-browse', label: 'Search', icon: Search },
        { path: '/talent/discover', label: 'Discover', icon: Users },
        { path: '/admin-moderation-management', label: 'Admin', icon: Shield },
        { path: '/user-profile', label: 'Profile', icon: User }
      ];
    }

    // Talent navigation
    if (userRole === 'talent') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/job-search-browse', label: 'Search', icon: Search },
        { path: '/talent/dashboard', label: 'Dashboard', icon: Briefcase },
        { path: '/talent/discover', label: 'Discover', icon: Users },
        { path: '/user-profile', label: 'Profile', icon: User }
      ];
    }

    // Recruiter navigation
    if (userRole === 'recruiter') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/job-search-browse', label: 'Search', icon: Search },
        { path: '/talent/discover', label: 'Discover', icon: Users },
        { path: '/recruiter-dashboard-analytics', label: 'Dashboard', icon: Briefcase },
        { path: '/user-profile', label: 'Profile', icon: User }
      ];
    }

    // Job seeker navigation (default)
    return [
      { path: '/', label: 'Home', icon: Home },
      { path: '/job-search-browse', label: 'Search', icon: Search },
      { path: '/talent/discover', label: 'Discover', icon: Users },
      { path: '/workflow-application-tracking-analytics', label: 'Applications', icon: FileText },
      { path: '/user-profile', label: 'Profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#13182E] border-t border-gray-200 dark:border-[#1E2640] safe-area-bottom md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 min-h-[64px] relative group"
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0046FF] rounded-b-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                  active 
                    ? 'text-[#0046FF]' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
