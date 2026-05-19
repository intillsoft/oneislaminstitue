import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const StudentSidebar = ({ activeTab, setActiveTab, userData }) => {
  const navigationItems = [
    { id: 'overview', label: 'Academic Overview', icon: 'LayoutDashboard' },
    { id: 'applications', label: 'Enrollments', icon: 'BookOpen' },
    { id: 'saved', label: 'Saved Courses', icon: 'Bookmark' },
    { id: 'alerts', label: 'Academic Alerts', icon: 'Bell' },
  ];

  const quickActions = [
    { id: 'profile', label: 'Scholar Profile', icon: 'User', path: '/profile' },
    { id: 'resume', label: 'Academic Resume', icon: 'FileUp', path: '/resume/dashboard' },
    { id: 'settings', label: 'Settings', icon: 'Settings', path: '/talent/settings' },
    { id: 'pricing', label: 'Study Plans', icon: 'CreditCard', path: '/pricing' },
    { id: 'billing', label: 'Billing', icon: 'Receipt', path: '/billing' },
  ];

  return (
    <div className="bg-background rounded-lg shadow-sm border border-border p-6 sticky top-24">
      {/* Scholar Profile Section */}
      <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-border">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[var(--color-primary)]/20 shadow-lg">
          <Image 
            src={userData?.profileImage} 
            alt={userData?.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-bold text-text-primary font-display">{userData?.name}</h3>
        <p className="text-xs text-text-secondary mt-1 font-medium">{userData?.email}</p>
        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-[var(--color-primary-light)] dark:bg-[var(--color-primary)]/10 border border-[var(--color-border-secondary)] dark:border-[var(--color-primary)]/20 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
           <span className="text-[10px] font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-widest text-nowrap">Active Scholar</span>
        </div>
        <Link 
          to="/profile" 
          className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] flex items-center hover:text-[var(--color-primary)] transition-smooth"
        >
          <Icon name="Edit" size={12} className="mr-1.5" />
          Edit Profile
        </Link>
      </div>
      {/* Navigation */}
      <nav className="mb-6">
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">
          Academic Center
        </h4>
        <ul className="space-y-1.5">
          {navigationItems?.map((item) => (
            <li key={item?.id}>
              <button
                onClick={() => setActiveTab(item?.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item?.id
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span className="tracking-wide">{item?.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Quick Actions */}
      <div>
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">
          Academic Tools
        </h4>
        <ul className="space-y-1.5">
          {quickActions?.map((action) => (
            <li key={action?.id}>
              <Link
                to={action?.path}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-surface transition-all"
              >
                <Icon name={action?.icon} size={16} className="opacity-60" />
                <span className="tracking-wide">{action?.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Sign Out Button */}
      <div className="mt-6 pt-6 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent hover:border-red-200">
          <Icon name="LogOut" size={16} />
          <span className="uppercase tracking-widest font-black text-[10px]">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
