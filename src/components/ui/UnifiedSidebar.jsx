/**
 * Unified Sidebar Component — Bold Deep Blue Design
 * Hope Dawah Institute
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
  
  if (!loadingProfile) {
    const roleLower = baseRole?.toLowerCase() || '';
    if (roleLower === 'admin' || roleLower === 'system_admin') {
      allNavigationItems.push(...adminItems);
      allNavigationItems.push(...instructorItems);
      allNavigationItems.push(...mainItems);
    } else if (roleLower === 'instructor') {
      allNavigationItems.push(...instructorItems);
    } else {
      allNavigationItems.push(...mainItems);
      allNavigationItems.push(...studentItems);
    }
  }

  useEffect(() => {
    if (user && allNavigationItems.length > 0) {
      const savedPreferences = JSON.parse(
        localStorage.getItem(`sidebar_preferences_${user.id}`) || '{}'
      );
      
      if (Object.keys(savedPreferences).length > 0) {
        const customized = allNavigationItems
          .map(item => ({
            ...item,
            visible: savedPreferences[item.path]?.visible !== undefined ? savedPreferences[item.path].visible : true,
            order: savedPreferences[item.path]?.order !== undefined ? savedPreferences[item.path].order : allNavigationItems.indexOf(item),
          }))
          .filter(item => item.visible)
          .sort((a, b) => a.order - b.order);
        
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
    <div className="flex flex-col h-full transition-all duration-300 ease-in-out pointer-events-auto"
      style={{ background: '#003D6B', boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}
    >

      {isMobile && (
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Logo size="sm" darkBg={true} className="z-50" />
          <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-all text-[#A8CAEC]">
            <Icon name="X" size={18} />
          </button>
        </div>
      )}

      {!isMobile && (
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-white/10 h-16 transition-all duration-300`}
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0078D4] flex items-center justify-center">
                <Icon name="GraduationCap" size={16} className="text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">Institute</span>
            </div>
          )}
          <button
            onClick={handleToggle}
            className={`p-2 rounded-lg text-[#A8CAEC] hover:text-white hover:bg-white/10 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={isCollapsed ? "PanelLeft" : "PanelLeftClose"} size={18} />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6 custom-scrollbar">
        {Object.entries(sections).map(([section, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={section} className="space-y-1">
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: '#4BA8E8' }}>{section}</span>
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-2.5 text-[13px] font-medium transition-all relative group`}
                      style={{
                        borderRadius: active ? '0 8px 8px 0' : '8px',
                        background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: active ? '#FFFFFF' : '#A8CAEC',
                        fontWeight: active ? 600 : 500,
                        borderLeft: active ? '3px solid #FFFFFF' : '3px solid transparent',
                      }}
                      whileHover={{ x: isCollapsed ? 0 : 2 }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#FFFFFF'; }}}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A8CAEC'; }}}
                    >
                      <Icon 
                        name={item.icon} 
                        size={isCollapsed ? 20 : 18} 
                        className="flex-shrink-0 transition-colors"
                        style={{ color: active ? '#FFFFFF' : '#4BA8E8' }}
                      />
                      {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-[#0F172A] text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap z-[100] pointer-events-none shadow-modal">
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

      <div className="p-4 border-t border-white/10 space-y-4" style={{ background: 'rgba(0,0,0,0.25)' }}>
        {user && (
          <div className="relative group">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 rounded-lg hover:bg-white/10 transition-all`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ border: '2px solid #4BA8E8' }}
                >
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0078D4]">
                      <span className="text-white font-bold text-xs">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-bold text-white truncate">{profile?.name || user?.email?.split('@')[0] || 'Scholar'}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
                        style={{ background: '#4ADE80', color: '#003D6B' }}
                      >{userRole || 'Student'}</span>
                    </div>
                  </div>
                )}
              </div>
              {!isCollapsed && <Icon name="ChevronUp" size={14} className={`text-[#A8CAEC] transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />}
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className={`absolute ${isCollapsed ? 'left-full bottom-0 ml-4' : 'bottom-full mb-3 left-0 right-0'} bg-white rounded-xl shadow-modal border border-[#E2E8F0] overflow-hidden z-[100] min-w-[220px] p-2`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-[12px] font-bold text-[#0F172A] rounded-lg hover:bg-[#EFF6FF] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#0078D4]">
                      <Icon name="User" size={16} />
                    </div>
                    <span>Scholar Profile</span>
                  </Link>
                  <Link
                    to="/billing"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-[12px] font-bold text-[#0F172A] rounded-lg hover:bg-[#EFF6FF] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#0078D4]">
                      <Icon name="Heart" size={16} />
                    </div>
                    <span>Impact & Support</span>
                  </Link>
                  <div className="h-px bg-[#E2E8F0] my-2 mx-2" />
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      await signOut();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-[12px] font-bold text-[#D13438] rounded-lg hover:bg-[#FDE7E9] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FDE7E9] flex items-center justify-center">
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
        <div className="fixed bottom-6 left-5 right-5 z-[999] bg-white/95 backdrop-blur-lg border border-[#E2E8F0] rounded-2xl p-2 flex justify-around items-center shadow-modal">
             {navigationItems.slice(0, 4).map((item, i) => {
                  const active = isActive(item.path);
                  return (
                      <button 
                         key={i} 
                         onClick={() => handleNavClick(item.path)} 
                         className={`flex flex-col items-center gap-1 p-2.5 px-3.5 rounded-xl transition-all relative ${active ? 'text-[#0078D4]' : 'text-[#94A3B8] hover:text-[#0078D4]'}`}
                      >
                           {active && (
                               <motion.div 
                                  layoutId="mobileNav" 
                                  className="absolute inset-0 bg-[#EFF6FF] rounded-xl border border-[#C8E0F4]" 
                                  transition={{ duration: 0.2 }}
                               />
                           )}
                           <div className={`relative z-10 ${active ? 'scale-110' : ''} transition-transform`}>
                               <Icon name={item.icon} size={18} className={active ? 'text-[#0078D4]' : 'text-[#94A3B8]'} />
                           </div>
                           <span className={`text-[7px] font-bold uppercase tracking-[0.14em] relative z-10 ${active ? 'text-[#0078D4]' : 'text-[#94A3B8]'}`}>
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
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-16 bottom-0 z-[90] hidden lg:block"
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