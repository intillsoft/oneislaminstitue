import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const MobileBottomNav = ({ type = 'student' }) => {
  const location = useLocation();

  const configs = {
    student: [
      { label: 'Home',     icon: 'LayoutDashboard', path: '/dashboard/student' },
      { label: 'Courses',  icon: 'BookOpen',        path: '/courses' },
      { label: 'About',    icon: 'Info',            path: '/about' },
      { label: 'Curators', icon: 'Award',           path: '/team' },
      { label: 'Profile',  icon: 'User',            path: '/profile' },
    ],
    instructor: [
      { label: 'Home',      icon: 'LayoutDashboard', path: '/instructor/dashboard' },
      { label: 'Courses',   icon: 'BookOpen',        path: '/instructor/dashboard/jobs' },
      { label: 'Scholars',  icon: 'Users',           path: '/instructor/dashboard/candidates' },
      { label: 'Profile',   icon: 'User',            path: '/profile' },
    ],
    admin: [
      { label: 'Home',    icon: 'LayoutDashboard', path: '/admin/dashboard' },
      { label: 'Safety',  icon: 'ShieldAlert',     path: '/admin/moderation' },
      { label: 'Audit',   icon: 'FileText',        path: '/admin/audits' },
      { label: 'Account', icon: 'User',            path: '/profile' },
    ],
  };

  const items = configs[type] || configs.student;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'var(--color-bg-primary, #ffffff)',
        borderTop: '1px solid var(--color-border-primary, #e2e8f0)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch justify-around h-16">
        {items.map((item, idx) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={idx}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 relative py-2 gap-0.5"
            >
              {/* Active indicator bar at top */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full"
                  style={{ background: 'var(--color-primary)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              {/* Icon */}
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  style={{
                    color: isActive
                      ? 'var(--color-primary)'
                      : 'var(--color-text-tertiary, #94a3b8)',
                    transition: 'color 0.2s',
                  }}
                />
              </motion.div>

              {/* Label */}
              <span
                className="text-[10px] font-bold tracking-wide leading-none"
                style={{
                  color: isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-text-tertiary, #94a3b8)',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
