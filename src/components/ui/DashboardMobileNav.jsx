/**
 * Dashboard Mobile Navigation Component
 * Native app-style bottom tab bar with role-aware "More" bottom sheet
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';

const DashboardMobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, userRole, baseRole, switchActiveRole, signOut } = useAuthContext();
  const [isMobile, setIsMobile] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const isDashboardPage =
    location.pathname.includes('/dashboard') ||
    location.pathname.includes('/instructor') ||
    location.pathname.includes('/admin');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close more sheet on route change
  useEffect(() => { setShowMore(false); }, [location.pathname]);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleRoleSwitch = (newRole) => {
    if (switchActiveRole(newRole)) {
      setShowMore(false);
      const path =
        newRole === 'admin' ? '/admin/dashboard' :
        newRole === 'instructor' ? '/instructor/dashboard' :
        '/dashboard/student';
      navigate(path);
    }
  };

  // ── Nav configs ─────────────────────────────────────────────────────────
  const studentPrimary = [
    { icon: 'Home',      label: 'Overview',    path: '/dashboard/student' },
    { icon: 'BookOpen',  label: 'Courses',     path: '/courses' },
    { icon: 'BarChart3', label: 'Progress',    path: '/dashboard/progress' },
    { icon: 'User',      label: 'Profile',     path: '/profile' },
  ];
  const studentMore = [
    { icon: 'BookOpen',  label: 'Enrollments', path: '/dashboard/enrollments' },
    { icon: 'Bookmark',  label: 'Saved',       path: '/dashboard/saved' },
    { icon: 'Calendar',  label: 'Schedule',    path: '/dashboard/schedule' },
    { icon: 'Award',     label: 'Certificates',path: '/dashboard/certificates' },
    { icon: 'Zap',       label: 'Achievements',path: '/dashboard/achievements' },
    { icon: 'Heart',     label: 'Donations',   path: '/billing' },
    { icon: 'Settings',  label: 'Settings',    path: '/settings' },
  ];

  const instructorPrimary = [
    { icon: 'LayoutDashboard', label: 'Overview',  path: '/instructor/dashboard' },
    { icon: 'BookOpen',        label: 'Courses',   path: '/instructor/dashboard/jobs' },
    { icon: 'Users',           label: 'Students',  path: '/instructor/dashboard/candidates' },
    { icon: 'User',            label: 'Profile',   path: '/profile' },
  ];
  const instructorMore = [
    { icon: 'BarChart2',  label: 'Analytics', path: '/instructor/dashboard/analytics' },
    { icon: 'CreditCard', label: 'Billing',   path: '/instructor/dashboard/billing' },
    { icon: 'Building2',  label: 'Faculty',   path: '/instructor/dashboard/company' },
    { icon: 'Plus',       label: 'New Course',path: '/instructor/courses/new' },
    { icon: 'Settings',   label: 'Settings',  path: '/settings' },
  ];

  const adminPrimary = [
    { icon: 'LayoutDashboard', label: 'Moderate',    path: '/admin/dashboard/moderation' },
    { icon: 'Users',           label: 'Users',        path: '/admin/dashboard/users' },
    { icon: 'BookOpen',        label: 'Courses',      path: '/admin/dashboard/jobs' },
    { icon: 'User',            label: 'Profile',      path: '/profile' },
  ];
  const adminMore = [
    { icon: 'FileText',  label: 'Enrollments',      path: '/admin/dashboard/applications' },
    { icon: 'Activity',  label: 'Audit Trail',      path: '/admin/dashboard/audit' },
    { icon: 'BarChart3', label: 'Analytics',        path: '/admin/dashboard/analytics' },
    { icon: 'Shield',    label: 'Security',         path: '/admin/dashboard/security' },
    { icon: 'Settings',  label: 'System Settings',  path: '/admin/dashboard/config' },
  ];

  let primaryItems = studentPrimary;
  let moreItems    = studentMore;
  if (userRole === 'instructor') { primaryItems = instructorPrimary; moreItems = instructorMore; }
  if (userRole === 'admin')      { primaryItems = adminPrimary;      moreItems = adminMore; }

  if (!isMobile || !isDashboardPage || !user) return null;

  return (
    <>
      {/* ── Native Tab Bar ─────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'var(--color-bg-primary, #ffffff)',
          borderTop: '1px solid var(--color-border-primary, #e2e8f0)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.07)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          transition: 'background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        }}
      >
        <div className="flex items-stretch justify-around h-16">
          {primaryItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 relative py-2 gap-0.5"
              >
                {active && (
                  <motion.div
                    layoutId="dashNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full"
                    style={{ background: 'var(--color-primary)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <motion.div whileTap={{ scale: 0.82 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <Icon
                    name={item.icon}
                    size={22}
                    style={{
                      color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary, #94a3b8)',
                      transition: 'color 0.2s',
                    }}
                  />
                </motion.div>
                <span
                  className="text-[10px] font-bold tracking-wide leading-none"
                  style={{
                    color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary, #94a3b8)',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center flex-1 relative py-2 gap-0.5"
          >
            <motion.div whileTap={{ scale: 0.82 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Icon
                name="MoreHorizontal"
                size={22}
                style={{ color: showMore ? 'var(--color-primary)' : 'var(--color-text-tertiary, #94a3b8)', transition: 'color 0.2s' }}
              />
            </motion.div>
            <span
              className="text-[10px] font-bold tracking-wide leading-none"
              style={{ color: showMore ? 'var(--color-primary)' : 'var(--color-text-tertiary, #94a3b8)', transition: 'color 0.2s' }}
            >
              More
            </span>
          </button>
        </div>
      </motion.nav>

      {/* ── More Bottom Sheet ───────────────────────────────────────── */}
      <AnimatePresence>
        {showMore && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[28px] overflow-hidden"
              style={{
                background: 'var(--color-bg-primary, #ffffff)',
                borderTop: '1px solid var(--color-border-primary, #e2e8f0)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
                transition: 'background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
              }}
            >
              {/* Pull handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: 'var(--color-border-primary, #e2e8f0)' }}
                />
              </div>

              <div className="px-4 pb-2 max-h-[75dvh] overflow-y-auto">

                {/* Role Switcher — admins & instructors only */}
                {(baseRole === 'admin' || baseRole === 'instructor') && (
                  <div className="mb-4">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Switch Role
                    </p>
                    <div className="flex flex-col gap-1">
                      {baseRole === 'admin' && (
                        <button
                          onClick={() => handleRoleSwitch('admin')}
                          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                          style={{
                            background: userRole === 'admin' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                            color: userRole === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            border: `1px solid ${userRole === 'admin' ? 'var(--color-primary)' : 'var(--color-border-primary)'}`,
                          }}
                        >
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <Icon name="Shield" size={18} /> Administrator
                          </div>
                          {userRole === 'admin' && (
                            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleRoleSwitch('instructor')}
                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: userRole === 'instructor' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                          color: userRole === 'instructor' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          border: `1px solid ${userRole === 'instructor' ? 'var(--color-primary)' : 'var(--color-border-primary)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3 font-bold text-sm">
                          <Icon name="Workflow" size={18} /> Instructor
                        </div>
                        {userRole === 'instructor' && (
                          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                        )}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('student')}
                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: userRole === 'student' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                          color: userRole === 'student' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          border: `1px solid ${userRole === 'student' ? 'var(--color-primary)' : 'var(--color-border-primary)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3 font-bold text-sm">
                          <Icon name="Users" size={18} /> Scholar
                        </div>
                        {userRole === 'student' && (
                          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                        )}
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="mt-4 mb-2 h-px" style={{ background: 'var(--color-border-primary)' }} />
                  </div>
                )}

                {/* More Nav Items */}
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {moreItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <motion.div key={item.path} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={item.path}
                          onClick={() => setShowMore(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
                          style={{
                            background: active ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                            color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border-primary)'}`,
                          }}
                        >
                          <Icon name={item.icon} size={18} />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Sign Out */}
                <div className="h-px mb-3" style={{ background: 'var(--color-border-primary)' }} />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    setShowMore(false);
                    await signOut();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    color: '#ef4444',
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.15)',
                  }}
                >
                  <Icon name="LogOut" size={18} />
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardMobileNav;
