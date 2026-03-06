/**
 * Dashboard Mobile Navigation Component
 * Exclusive bottom navigation for dashboard pages (student, instructor, admin)
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

  // Only show on dashboard pages and mobile
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/instructor') ||
                         location.pathname.includes('/admin');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleRoleSwitch = (newRole) => {
    if (switchActiveRole(newRole)) {
      setShowMore(false);
      const path = newRole === 'admin' ? '/admin/dashboard' : (newRole === 'instructor' ? '/instructor/dashboard' : '/dashboard');
      navigate(path);
    }
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'instructor') return 'Instructor';
    return 'Scholar';
  };

  // Student dashboard nav - 5 primary items
  const studentNavItems = [
    { icon: 'Home', label: 'Overview', path: '/dashboard/student' },
    { icon: 'BookOpen', label: 'Enrollments', path: '/dashboard/enrollments' },
    { icon: 'Bookmark', label: 'Saved', path: '/dashboard/saved' },
    { icon: 'BarChart3', label: 'Progress', path: '/dashboard/progress' },
    { icon: 'User', label: 'Profile', path: '/profile' },
  ];

  const studentMoreItems = [
    { icon: 'Calendar', label: 'Schedule', path: '/dashboard/schedule' },
    { icon: 'Award', label: 'Certificates', path: '/dashboard/certificates' },
    { icon: 'Zap', label: 'Achievements', path: '/dashboard/achievements' },
    { icon: 'Heart', label: 'Donations', path: '/billing' },
    { icon: 'Settings', label: 'Settings', path: '/settings' },
  ];

  // Instructor dashboard nav - 5 primary items
  const instructorNavItems = [
    { icon: 'LayoutDashboard', label: 'Overview', path: '/instructor/dashboard' },
    { icon: 'BookOpen', label: 'Courses', path: '/instructor/dashboard/jobs' },
    { icon: 'Users', label: 'Students', path: '/instructor/dashboard/candidates' },
    { icon: 'BarChart2', label: 'Analytics', path: '/instructor/dashboard/analytics' },
    { icon: 'User', label: 'Profile', path: '/profile' },
  ];

  const instructorMoreItems = [
    { icon: 'CreditCard', label: 'Billing', path: '/instructor/dashboard/billing' },
    { icon: 'Building2', label: 'Faculty', path: '/instructor/dashboard/company' },
    { icon: 'Plus', label: 'New Course', path: '/instructor/courses/new' },
    { icon: 'Settings', label: 'Settings', path: '/settings' },
  ];

  // Admin dashboard nav - 5 primary items
  const adminNavItems = [
    { icon: 'LayoutDashboard', label: 'Moderation', path: '/admin/dashboard/moderation' },
    { icon: 'Users', label: 'Users', path: '/admin/dashboard/users' },
    { icon: 'BookOpen', label: 'Courses', path: '/admin/dashboard/jobs' },
    { icon: 'FileText', label: 'Enrollments', path: '/admin/dashboard/applications' },
    { icon: 'User', label: 'Profile', path: '/profile' },
  ];

  const adminMoreItems = [
    { icon: 'Settings', label: 'System Settings', path: '/admin/dashboard/config' },
    { icon: 'Activity', label: 'Audit Trail', path: '/admin/dashboard/audit' },
    { icon: 'BarChart3', label: 'Platform Analytics', path: '/admin/dashboard/analytics' },
    { icon: 'Shield', label: 'Security', path: '/admin/dashboard/security' },
  ];

  // Determine which nav items to show based on role
  let primaryNavItems = studentNavItems;
  let moreNavItems = studentMoreItems;

  if (userRole === 'instructor') {
    primaryNavItems = instructorNavItems;
    moreNavItems = instructorMoreItems;
  } else if (userRole === 'admin') {
    primaryNavItems = adminNavItems;
    moreNavItems = adminMoreItems;
  }

  if (!isMobile || !isDashboardPage || !user) return null;

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-bg/85 backdrop-blur-2xl border-t border-border dark:border-white/5 pb-[var(--safe-area-bottom)]"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto px-1 h-[var(--bottom-nav-height)]">
          {primaryNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <motion.div key={item.path} whileTap={{ scale: 0.9 }}>
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all ${
                    active ? 'text-emerald-500' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={22}
                    className={active ? 'text-emerald-500' : 'opacity-50'}
                  />
                  <span className={`text-[8px] font-black uppercase tracking-tighter whitespace-nowrap ${active ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all text-text-muted hover:text-text-primary"
          >
            <Icon
              name="MoreHorizontal"
              size={22}
              className={showMore ? 'text-emerald-600' : 'opacity-50'}
            />
            <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap opacity-70">
              More
            </span>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-0 right-0 z-40"
            >
              <div className="max-w-6xl mx-auto px-4">
                <div className="bg-surface dark:bg-emerald-950/95 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl p-4 space-y-4">
                  
                  {/* Role Switcher Section - Only for Admin/Instructors */}
                  {(baseRole === 'admin' || baseRole === 'instructor') && (
                    <div className="pb-4 border-b border-emerald-500/10">
                      <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-3">Academic Perspective</p>
                      <div className="grid grid-cols-1 gap-2">
                        {baseRole === 'admin' && (
                          <button
                            onClick={() => handleRoleSwitch('admin')}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${userRole === 'admin' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-secondary'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon name="Shield" size={18} />
                              <span>Administrator</span>
                            </div>
                            {userRole === 'admin' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleRoleSwitch('instructor')}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${userRole === 'instructor' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-secondary'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon name="Workflow" size={18} />
                            <span>Instructor</span>
                          </div>
                          {userRole === 'instructor' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('student')}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${userRole === 'student' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-secondary'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon name="Users" size={18} />
                            <span>Scholar</span>
                          </div>
                          {userRole === 'student' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {moreNavItems.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <motion.div
                          key={item.path}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={item.path}
                            onClick={() => setShowMore(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                              active
                                ? 'bg-emerald-600/10 text-emerald-600 border border-emerald-600/20'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated dark:hover:bg-white/5'
                            }`}
                          >
                            <Icon name={item.icon} size={20} />
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        setShowMore(false);
                        await signOut();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm border border-transparent hover:border-red-500/20"
                    >
                      <Icon name="LogOut" size={20} />
                      Sign Out
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardMobileNav;
