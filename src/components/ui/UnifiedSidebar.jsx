/**
 * Unified Sidebar Component - DeepSeek Style
 * Beautiful, intuitive, standard sidebar for all roles
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useAuthContext } from '../../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import SidebarCustomizationModal from './SidebarCustomizationModal';

const UnifiedSidebar = ({ isCollapsed: externalCollapsed = null, onCollapseChange = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loadingProfile, signOut } = useAuthContext();
  const userRole = profile?.role;
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (externalCollapsed !== null) return externalCollapsed;
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizedItems, setCustomizedItems] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 1024;
      setIsMobile(isMobileNow);
      // Don't auto-open sidebar when resizing - only close if going to mobile
      if (isMobileNow && !isMobile) {
        setIsMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (externalCollapsed !== null && onCollapseChange) {
      setIsCollapsed(externalCollapsed);
    }
  }, [externalCollapsed, onCollapseChange]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Main Menu Items (formerly Job Seeker)
  const mainItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard', section: 'Main' },
    { icon: 'Search', label: 'Browse Jobs', path: '/jobs', section: 'Main' },
    { icon: 'Zap', label: 'Recommended', path: '/dashboard/recommended', section: 'Main' },
    { icon: 'FileText', label: 'Applications', path: '/dashboard/applications', section: 'Main' },
    { icon: 'MessageSquare', label: 'Messages', path: '/dashboard/messages', section: 'Main' },
    { icon: 'User', label: 'Profile', path: '/dashboard/profile', section: 'Main' },

    // Tools Sub-section
    { icon: 'FileEdit', label: 'Resume Builder', path: '/dashboard/resume-builder', section: 'Main' },
    { icon: 'MessageSquare', label: 'Interview Coach', path: '/dashboard/interview-prep', section: 'Main' },
    { icon: 'DollarSign', label: 'Salary Intel', path: '/dashboard/salary-intel', section: 'Main' },
    { icon: 'Zap', label: 'Autopilot', path: '/dashboard/autopilot', section: 'Main' },
  ];

  // Talent Menu Items (talents see this)
  const talentItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/talent/dashboard', section: 'Talent' },
    { icon: 'Briefcase', label: 'My Gigs', path: '/talent/gigs', section: 'Talent' },
    { icon: 'ShoppingCart', label: 'Orders', path: '/talent/orders', section: 'Talent' },
    { icon: 'Star', label: 'Reviews', path: '/talent/reviews', section: 'Talent' },
    { icon: 'DollarSign', label: 'Earnings', path: '/talent/earnings', section: 'Talent' },
    { icon: 'User', label: 'Profile', path: '/talent/profile', section: 'Talent' },
    { icon: 'Sparkles', label: 'Freelance Suite', path: '/talent/marketplace', section: 'Talent' },
  ];

  // Recruiter Menu Items (recruiters + admins see this)
  const recruiterItems = [
    { icon: 'BarChart3', label: 'Dashboard', path: '/recruiter/dashboard', section: 'Recruiter' },
    { icon: 'Plus', label: 'Post Job', path: '/recruiter/jobs', section: 'Recruiter' },
    { icon: 'Briefcase', label: 'My Jobs', path: '/recruiter/dashboard?tab=jobs', section: 'Recruiter' },
    { icon: 'Users', label: 'Candidates', path: '/recruiter/dashboard?tab=candidates', section: 'Recruiter' },
    { icon: 'Building2', label: 'Company', path: '/recruiter/company', section: 'Recruiter' },
  ];

  // Admin Menu Items (admins only)
  const adminItems = [
    { icon: 'Shield', label: 'Dashboard', path: '/admin/dashboard', section: 'Admin' },
    { icon: 'Users', label: 'Users', path: '/admin/dashboard?tab=users', section: 'Admin' },
    { icon: 'Briefcase', label: 'Jobs', path: '/admin/dashboard?tab=jobs', section: 'Admin' },
    { icon: 'FileText', label: 'Applications', path: '/admin/dashboard?tab=applications', section: 'Admin' },
    { icon: 'Settings', label: 'Settings', path: '/admin/dashboard?tab=settings', section: 'Admin' },
  ];

  // Build navigation items based on role
  const allNavigationItems = [];
  allNavigationItems.push(...mainItems);

  // Add talent items if user is a talent or admin
  if (userRole === 'talent' || userRole === 'admin') {
    allNavigationItems.push(...talentItems);
  }

  // Add recruiter items
  if (userRole === 'recruiter' || userRole === 'admin') {
    allNavigationItems.push(...recruiterItems);
  }

  // Add admin items
  if (userRole === 'admin') {
    allNavigationItems.push(...adminItems);
  }

  // Apply customization if available
  useEffect(() => {
    if (user && allNavigationItems.length > 0) {
      const savedPreferences = JSON.parse(
        localStorage.getItem(`sidebar_preferences_${user.id}`) || '{}'
      );

      if (Object.keys(savedPreferences).length > 0) {
        const customized = allNavigationItems
          .map(item => ({
            ...item,
            visible: savedPreferences[item.path]?.visible !== undefined
              ? savedPreferences[item.path].visible
              : true,
            order: savedPreferences[item.path]?.order !== undefined
              ? savedPreferences[item.path].order
              : allNavigationItems.indexOf(item),
          }))
          .filter(item => item.visible)
          .sort((a, b) => a.order - b.order);

        setCustomizedItems(customized);
      } else {
        setCustomizedItems(null);
      }
    } else {
      setCustomizedItems(null);
    }
  }, [user, userRole]);

  const navigationItems = customizedItems || allNavigationItems;

  const isActive = (path) => {
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      const [key, value] = query.split('=');
      const urlParams = new URLSearchParams(location.search);
      return location.pathname === basePath && urlParams.get(key) === value;
    }
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      navigate(`${basePath}?${query}`);
    } else {
      navigate(path);
    }
    if (isMobile) setIsMobileOpen(false);
  };

  const getSections = () => {
    const sections = {};
    navigationItems.forEach(item => {
      if (!sections[item.section]) {
        sections[item.section] = [];
      }
      sections[item.section].push(item);
    });
    return sections;
  };

  const sections = getSections();

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-[#0F172A] border-r border-gray-200/50 dark:border-gray-800/50 pt-12 lg:pt-16">
      {/* Minimal Header - Just Logo (Mobile Only) */}
      {isMobile && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200/50 dark:border-gray-800/50 relative z-50 lg:hidden">
          {!isCollapsed ? (
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-workflow-primary rounded-lg blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      )}

      {/* Desktop Toggle Button - Standard Sidebar Style */}
      {!isMobile && (
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-20 p-1.5 rounded-full bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shadow-sm z-50 cursor-pointer flex items-center justify-center transition-transform hover:scale-105"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon
            name="ChevronLeft"
            size={14}
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {Object.entries(sections).map(([section, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={section} className="mb-4">
              {!isCollapsed && items.length > 0 && (
                <div className="px-3 py-2 mb-1">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {section}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${active
                        ? 'bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary dark:text-workflow-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      whileHover={{ x: isCollapsed ? 0 : 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon
                        name={item.icon}
                        size={18}
                        className={`flex-shrink-0 ${active ? 'text-workflow-primary dark:text-workflow-primary-400' : ''}`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">{item.label}</span>
                          {active && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-1.5 h-1.5 bg-workflow-primary dark:bg-workflow-primary-400 rounded-full"
                            />
                          )}
                        </>
                      )}
                      {isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: showUserMenu ? 0 : 1, x: 0 }}
                          className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - User Menu Toggle & Theme Toggle */}
      <div className="p-3 border-t border-gray-200/50 dark:border-gray-800/50 space-y-2">
        {/* Enhanced Theme Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
          {!isCollapsed && (
            <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
          )}
          <div className="flex-shrink-0">
            <DarkModeToggle />
          </div>
        </div>

        {/* Customize Sidebar Button */}
        {!isCollapsed && (
          <button
            onClick={() => setShowCustomizationModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
          >
            <Icon name="Settings" size={16} />
            <span>Customize</span>
          </button>
        )}

        {/* User Menu Toggle - DeepSeek Style */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group`}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile?.name || user?.email || 'User'}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-xs">
                      {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {profile?.name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                      {userRole || 'User'}
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <Icon
                  name={showUserMenu ? "ChevronUp" : "ChevronDown"}
                  size={16}
                  className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                />
              )}
            </button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute ${isCollapsed ? 'left-full ml-2' : 'bottom-full mb-2 left-0 right-0'} bg-white dark:bg-[#1E293B] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[200px]`}
                >
                  <Link
                    to="/user-profile?tab=settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Icon name="Settings" size={16} className="text-gray-500 dark:text-gray-400" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      await signOut();
                      navigate('/');
                      if (isMobile) setIsMobileOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile: Slide-in overlay
  if (isMobile) {
    return (
      <>
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-20 left-4 z-50 lg:hidden p-2.5 rounded-lg bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-lg"
          aria-label="Open sidebar"
        >
          <Icon name="Menu" size={20} />
        </button>

        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[260px] z-50 lg:hidden"
              >
                {sidebarContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <DndProvider backend={HTML5Backend}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-0 bottom-0 z-30 hidden lg:block"
      >
        {sidebarContent}
      </motion.aside>
      <SidebarCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        menuItems={allNavigationItems}
        onSave={(items) => {
          setCustomizedItems(items.filter(item => item.visible).sort((a, b) => a.order - b.order));
        }}
      />
    </DndProvider>
  );
};

export default UnifiedSidebar;