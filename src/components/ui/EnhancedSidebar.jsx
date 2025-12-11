/**
 * Enhanced Sidebar Component
 * Beautiful, collapsible sidebar with role-based navigation
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useAuthContext } from '../../contexts/AuthContext';

const EnhancedSidebar = ({
  navigationItems = [],
  roleNavigationItems = [], // For switching between roles
  userInfo = {},
  companyInfo = null,
  isCollapsed: externalCollapsed = null,
  onCollapseChange = null,
  showRoleSwitcher = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (externalCollapsed !== null) return externalCollapsed;
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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

  const isActive = (path) => {
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      return location.pathname === basePath && location.search.includes(query.split('=')[1]);
    }
    return location.pathname === path;
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
            onClick={handleToggle}
            className="p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* User/Company Info */}
      {(userInfo || companyInfo) && (
        <div className={`p-4 border-b border-[#E2E8F0] dark:border-[#1E2640] ${isCollapsed ? 'flex justify-center' : ''}`}>
          {companyInfo ? (
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8FAFC] dark:bg-[#1A2139] flex items-center justify-center">
                <Image
                  src={companyInfo.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyInfo.name || 'Company')}&background=0046FF&color=fff&size=128`}
                  alt={companyInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED] truncate">
                    {companyInfo.name || 'Company'}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#8B92A3] truncate">
                    {companyInfo.subscription || 'Premium Plan'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-12 h-12 rounded-full bg-workflow-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {(userInfo?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED] truncate">
                    {userInfo?.name || user?.email || 'User'}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#8B92A3] truncate capitalize">
                    {profile?.role || 'User'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map((item) => {
          const active = typeof item.path === 'string' ? isActive(item.path) : (item.value && location.pathname.includes(item.value));
          
          return (
            <Link
              key={item.path || item.value || item.label}
              to={item.path || '#'}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
                if (isMobile) setIsMobileOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                active
                  ? 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary dark:text-workflow-primary-400 font-semibold'
                  : 'text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] hover:text-[#0F172A] dark:hover:text-[#E8EAED]'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon name={item.icon} size={20} />
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badge.color || 'bg-workflow-primary text-white'}`}>
                      {item.badge.count}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher */}
      {showRoleSwitcher && roleNavigationItems.length > 0 && !isCollapsed && (
        <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
          <p className="text-xs font-semibold text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider mb-2">
            Switch Role
          </p>
          <div className="space-y-1">
            {roleNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px]"
              >
                <Icon name={item.icon} size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2640] space-y-2">
        {!isCollapsed && (
          <Link
            to="/user-profile"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px]"
          >
            <Icon name="Settings" size={18} />
            <span className="font-medium">Settings</span>
          </Link>
        )}
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
            if (isMobile) setIsMobileOpen(false);
          }}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors min-h-[44px] ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Icon name="LogOut" size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
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
          className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-lg bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
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
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 300, ease: 'easeInOut' }}
      className="hidden lg:flex fixed left-0 top-16 bottom-0 z-30"
    >
      {sidebarContent}
    </motion.aside>
  );
};

export default EnhancedSidebar;










