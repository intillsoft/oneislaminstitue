import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Logo from 'components/Logo';

const InstructorSidebar = ({ isCollapsed, toggleCollapse, isMobile, closeMobileSidebar }) => {
  const location = useLocation();

  // Navigation items
  const navigationItems = [
    {
      label: 'Instructor Portal',
      path: '/instructor/dashboard',
      icon: 'BarChart3',
      badge: null
    },
    {
      label: 'Academic Catalog',
      path: '/instructor/courses',
      icon: 'BookOpen',
      badge: { count: 6, color: 'bg-emerald-600 text-white' }
    },
    {
      label: 'Enrolled Students',
      path: '/instructor/dashboard', // Point to dashboard with students tab if possible, or leave as is
      icon: 'Users',
      badge: { count: 12, color: 'bg-emerald-600 text-white' }
    },
    {
      label: 'Curator Team Profile',
      path: '/instructor/curator team',
      icon: 'Building2',
      badge: null
    },
    {
      label: 'Explore Courses',
      path: '/courses',
      icon: 'Search',
      badge: null
    }
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { label: 'Portal Settings', path: '/talent/settings', icon: 'Settings' },
    { label: 'Academic Plans', path: '/billing', icon: 'CreditCard' },
    { label: 'Instructional Help', path: '#', icon: 'HelpCircle' }
  ];

  // Check if a path is active
  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <div className="h-screen flex flex-col bg-bg border-r border-border dark:border-white/5">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Logo size="sm" />

        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="text-text-muted hover:text-emerald-600 transition-colors p-1.5 hover:bg-surface-elevated rounded-lg"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
        )}

        {isMobile && (
          <button
            onClick={closeMobileSidebar}
            className="text-text-muted hover:text-red-500 transition-colors p-1.5 hover:bg-surface-elevated rounded-lg"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      {/* User Profile */}
      <div className={`p-4 border-b border-border ${isCollapsed ? 'items-center' : ''}`}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-emerald-600/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-emerald-600" />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 bg-surface-elevated/50 p-3 rounded-2xl border border-border/50">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <Icon name="User" size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-text-primary truncate">Curator Team Member</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 truncate">Academic Dept.</p>
            </div>
          </div>
        )}
      </div>
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-3 space-y-1.5">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-all ${isActivePath(item?.path)
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 translate-x-1' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary group'
                }`}
              onClick={isMobile ? closeMobileSidebar : undefined}
            >
              <div className="flex items-center">
                <Icon name={item?.icon} size={18} className={`flex-shrink-0 ${isActivePath(item?.path) ? 'text-white' : 'text-emerald-600/60 group-hover:text-emerald-600 group-hover:scale-110 transition-all'}`} />
                {!isCollapsed && <span className="ml-3 text-xs font-black uppercase tracking-widest">{item?.label}</span>}
              </div>

              {!isCollapsed && item?.badge && (
                <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-black ${isActivePath(item.path) ? 'bg-white text-emerald-600' : item?.badge?.color}`}>
                  {item?.badge?.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      {/* Secondary Navigation */}
      <div className="p-4 border-t border-border">
        <nav className="space-y-1">
          {secondaryNavItems?.map((item) => (
            <Link
              key={item?.label}
              to={item?.path}
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all text-text-muted hover:bg-surface-elevated hover:text-text-primary group ${isCollapsed ? 'justify-center' : ''
                }`}
              onClick={isMobile ? closeMobileSidebar : undefined}
            >
              <Icon name={item?.icon} size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-emerald-600 transition-all" />
              {!isCollapsed && <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em]">{item?.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      {/* Logout Button */}
      <div className="p-4 border-t border-border/50">
        <button
          className={`flex items-center px-4 py-3 rounded-xl transition-all text-text-muted hover:bg-red-500/10 hover:text-red-500 group ${isCollapsed ? 'justify-center w-full' : ''
            }`}
        >
          <Icon name="LogOut" size={18} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all" />
          {!isCollapsed && <span className="ml-3 text-[10px] font-black uppercase tracking-widest">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default InstructorSidebar;
