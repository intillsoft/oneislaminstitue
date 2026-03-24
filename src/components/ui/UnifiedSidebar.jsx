/**
 * Unified Sidebar Component - Academic Metamorphosis
 * Adapted for One Islam Institute
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useAuthContext } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import DarkModeToggle from './DarkModeToggle';
import SidebarCustomizationModal from './SidebarCustomizationModal';
import Logo from '../Logo';

const UnifiedSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loadingProfile, signOut, userRole, baseRole, switchActiveRole } = useAuthContext();
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar();
  
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizedItems, setCustomizedItems] = useState(null);
  
  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 1024;
      setIsMobile(isMobileNow);
      if (isMobileNow && !isMobile) {
        setIsMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 1024;
      setIsMobile(isMobileNow);
      if (isMobileNow && !isMobile) {
        setIsMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    toggleSidebar();
  };

  const mainItems = [
    { icon: 'LayoutDashboard', label: 'Overview', path: '/dashboard', section: 'Academic' },
    { icon: 'BookOpen', label: 'Enrollments', path: '/dashboard/enrollments', section: 'Academic' },
    { icon: 'Bookmark', label: 'Bookmarks', path: '/dashboard/saved', section: 'Academic' },
    { icon: 'Calendar', label: 'Schedule', path: '/dashboard/schedule', section: 'Academic' },
    { icon: 'Award', label: 'Certificates', path: '/dashboard/certificates', section: 'Academic' },
    { icon: 'Zap', label: 'Milestones', path: '/dashboard/achievements', section: 'Academic' },
    { icon: 'BarChart3', label: 'Progress', path: '/dashboard/progress', section: 'Academic' },
  ];

  const studentItems = [
    { icon: 'Bell', label: 'Notifications', path: '/notifications', section: 'Account' },
    { icon: 'User', label: 'Profile', path: '/profile', section: 'Account' },
    { icon: 'Heart', label: 'Donations', path: '/billing', section: 'Account' },
  ];

  const instructorItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/instructor/dashboard/overview', section: 'Management' },
    { icon: 'Plus', label: 'New Course', path: '/instructor/courses/new', section: 'Management' },
    { icon: 'BookOpen', label: 'Manage Courses', path: '/instructor/dashboard/jobs', section: 'Management' },
    { icon: 'Users', label: 'Students', path: '/instructor/dashboard/candidates', section: 'Management' },
    { icon: 'Bell', label: 'Notifications', path: '/notifications/instructor', section: 'Management' },
  ];

  const adminItems = [
    { icon: 'Shield', label: 'Admin Panel', path: '/admin/dashboard/moderation', section: 'System' },
    { icon: 'Users', label: 'User Directory', path: '/admin/dashboard/users', section: 'System' },
    { icon: 'BookOpen', label: 'Global Courses', path: '/admin/dashboard/jobs', section: 'System' },
    { icon: 'FileText', label: 'Enrollments', path: '/admin/dashboard/applications', section: 'System' },
    { icon: 'Settings', label: 'Settings', path: '/admin/dashboard/config', section: 'System' },
    { icon: 'Activity', label: 'Audit Trail', path: '/admin/dashboard/audit', section: 'System' },
    { icon: 'Bell', label: 'Notification Control', path: '/notifications/admin', section: 'System' },
  ];

  const allNavigationItems = [];
  
  /* Role-based Navigation Logic (Active Role Based) */
  if (!loadingProfile) {
    const roleLower = baseRole?.toLowerCase() || ''; // Use baseRole to lock Admin access unconditionally
    if (roleLower === 'admin' || roleLower === 'system_admin') {
      allNavigationItems.push(...adminItems);
      allNavigationItems.push(...instructorItems);
      allNavigationItems.push(...mainItems);
    } else if (roleLower === 'instructor') {
      allNavigationItems.push(...instructorItems);
    } else {
      // Default to student items
      allNavigationItems.push(...mainItems);
      allNavigationItems.push(...studentItems);
    }
  }

  useEffect(() => {
    if (user && allNavigationItems.length > 0) {
      const savedPreferences = JSON.parse(
        localStorage.getItem(`sidebar_preferences_${user.id}`) || '{}'
      );
      
      // Only use customized items if they belong to the current role's navigation
      if (Object.keys(savedPreferences).length > 0) {
        const customized = allNavigationItems
          .map(item => ({
            ...item,
            visible: savedPreferences[item.path]?.visible !== undefined ? savedPreferences[item.path].visible : true,
            order: savedPreferences[item.path]?.order !== undefined ? savedPreferences[item.path].order : allNavigationItems.indexOf(item),
          }))
          .filter(item => item.visible)
          .sort((a, b) => a.order - b.order);
        
        // Safety check: if customized results in nothing while allNavigationItems has items, fallback
        if (customized.length > 0) {
          setCustomizedItems(customized);
        } else {
          setCustomizedItems(null);
        }
      } else {
        setCustomizedItems(null);
      }
    }
  }, [user, userRole, JSON.stringify(allNavigationItems)]);

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
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });
    return sections;
  };

  const sections = getSections();

  const sidebarContent = (
    <div className={`flex flex-col relative overflow-hidden transition-all duration-500 ease-in-out pointer-events-auto ${
      isMobile 
        ? 'h-full bg-[#0A0E27]/90 backdrop-blur-2xl border-r border-emerald-500/10' 
        : `h-[calc(100vh-calc(var(--header-height)+2rem))] m-4 rounded-3xl bg-[#090C22]/40 backdrop-blur-2xl border border-white/[0.04] shadow-2xl`
    }`}>
      {/* Decorative Gradient Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />

      {isMobile && (
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/10 relative z-50">
          <Logo size="sm" className="z-50" />
          <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-xl hover:bg-emerald-500/10 transition-all text-text-muted">
            <Icon name="X" size={18} />
          </button>
        </div>
      )}

      {!isMobile && (
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-emerald-500/10 relative z-50 h-[var(--header-height)] transition-all duration-300`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <Icon name="GraduationCap" size={16} className="text-white" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">Institute</span>
            </div>
          )}
          <button
            onClick={handleToggle}
            className={`p-2 rounded-xl text-text-muted hover:text-emerald-600 hover:bg-emerald-600/10 transition-all border border-emerald-500/10 shadow-sm bg-surface-elevated/50 hover:scale-105 active:scale-95 group ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={isCollapsed ? "PanelLeft" : "PanelLeftClose"} size={18} className="transition-transform group-hover:scale-110" />
          </button>
        </div>
      )}

      <nav className={`flex-1 overflow-y-auto px-3 py-6 space-y-8 relative z-10 custom-scrollbar`}>
        {Object.entries(sections).map(([section, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={section} className="space-y-4">
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.4em]">{section}</span>
                </div>
              )}
              <div className="space-y-1.5">
                {items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3.5 rounded-2xl text-[11px] font-bold transition-all relative group ${active
                        ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-300 border border-emerald-500/10'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                        }`}
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                    >
                      {active && (
                        <motion.div 
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-5 bg-emerald-600 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                      <Icon 
                        name={item.icon} 
                        size={isCollapsed ? 22 : 20} 
                        className={`${active 
                          ? 'text-emerald-500 animate-pulse-elite' 
                          : `${isCollapsed ? 'text-slate-300 dark:text-slate-200' : 'text-slate-400 dark:text-slate-400'} group-hover:text-emerald-500 transition-colors`
                        }`} 
                      />
                      {!isCollapsed && <span className="ml-4 truncate tracking-wide font-medium">{item.label}</span>}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-text-primary text-bg text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap z-[100] pointer-events-none shadow-2xl">
                          {item.label}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-emerald-500/10 space-y-4 relative z-10 bg-[#0A0E27]/40 backdrop-blur-md">
        {/* Appearance toggle removed for unified Dark Mode anchor flawslessly */}

        {user && (
          <div className="relative group">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-1.5 rounded-2xl bg-surface/50 hover:bg-surface border border-emerald-500/10 transition-all`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-600">
                      <span className="text-white font-black text-xs">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : 'WF'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[11px] font-black text-text-primary truncate uppercase tracking-tight">{profile?.name || user?.email?.split('@')[0] || 'Scholar'}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.1em] truncate">{userRole || 'Scholar'}</p>
                    </div>
                  </div>
                )}
              </div>
              {!isCollapsed && <Icon name="ChevronUp" size={14} className={`text-text-muted transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />}
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className={`absolute ${isCollapsed ? 'left-full bottom-0 ml-4' : 'bottom-full mb-3 left-0 right-0'} bg-white/95 dark:bg-[#0A0E27]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-emerald-500/20 overflow-hidden z-[100] min-w-[220px] p-2`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-[11px] font-bold text-text-primary rounded-xl hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Icon name="User" size={16} />
                    </div>
                    <span>Scholar Profile</span>
                  </Link>
                  <Link
                    to="/billing"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-[11px] font-bold text-text-primary rounded-xl hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Icon name="Heart" size={16} />
                    </div>
                    <span>Impact & Support</span>
                  </Link>
                  <div className="h-px bg-emerald-500/10 my-2 mx-2" />
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      await signOut();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-[11px] font-bold text-rose-500 rounded-xl hover:bg-rose-500/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <Icon name="LogOut" size={16} />
                    </div>
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

  // Don't render sidebar until profile role is resolved to avoid showing student-only nav
  if (user && loadingProfile) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {isMobile ? (
        <div className="fixed bottom-6 left-5 right-5 z-[999] bg-[#090B1E]/60 backdrop-blur-2xl border border-white/[0.04] rounded-[1.8rem] p-2 flex justify-around items-center shadow-2xl shadow-emerald-500/5 hover:scale-[1.01] transition-all">
             {navigationItems.slice(0, 4).map((item, i) => {
                  const active = isActive(item.path);
                  return (
                      <button 
                         key={i} 
                         onClick={() => handleNavClick(item.path)} 
                         className={`flex flex-col items-center gap-1 p-2.5 px-3.5 rounded-xl transition-all relative \${active ? 'text-emerald-400' : 'text-slate-400 hover:text-white/80'}`}
                      >
                           {active && (
                               <motion.div 
                                  layoutId="mobileNav" 
                                  className="absolute inset-0 bg-emerald-500/5 rounded-xl border border-emerald-500/10 shadow-sm" 
                                  transition={{ duration: 0.2 }}
                               />
                           )}
                           <div className={`relative z-10 \${active ? 'scale-110' : ''} transition-transform`}>
                               <Icon name={item.icon} size={18} className={active ? 'animate-pulse-elite text-emerald-500' : 'text-slate-400'} />
                           </div>
                           <span className={`text-[7px] font-black uppercase tracking-[0.14em] relative z-10 \${active ? 'text-emerald-400' : 'text-slate-500'}`}>
                               {item.label}
                           </span>
                      </button>
                  );
             })}
        </div>
      ) : (
        <>
          <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 96 : 280 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-[var(--header-height)] bottom-0 z-[90] hidden lg:block bg-transparent pointer-events-none"
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
      <SidebarCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        menuItems={allNavigationItems}
        onSave={(items) => setCustomizedItems(items.filter(item => item.visible).sort((a, b) => a.order - b.order))}
      />
    </DndProvider>
  );
};

export default UnifiedSidebar;