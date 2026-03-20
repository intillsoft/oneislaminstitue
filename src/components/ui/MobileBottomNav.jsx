import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const MobileBottomNav = ({ type = 'student' }) => {
  const location = useLocation();

  const configs = {
    student: [
      { label: 'Home', icon: 'LayoutDashboard', path: '/dashboard/student' },
      { label: 'Learn', icon: 'BookOpen', path: '/courses' },
      { label: 'Support', icon: 'Sparkles', path: '/ai-chat' },
      { label: 'Profile', icon: 'User', path: '/profile' },
    ],
    instructor: [
      { label: 'Home', icon: 'LayoutDashboard', path: '/instructor/dashboard' },
      { label: 'Curriculum', icon: 'BookOpen', path: '/instructor/dashboard/jobs' },
      { label: 'Scholars', icon: 'Users', path: '/instructor/dashboard/candidates' },
      { label: 'Profile', icon: 'User', path: '/profile' },
    ],
    admin: [
      { label: 'Home', icon: 'LayoutDashboard', path: '/admin/dashboard' },
      { label: 'Safety', icon: 'ShieldAlert', path: '/admin/moderation' },
      { label: 'Audit', icon: 'FileText', path: '/admin/audits' },
      { label: 'Account', icon: 'User', path: '/profile' },
    ]
  };

  const items = configs[type] || configs.student;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 bg-transparent pointer-events-none md:hidden">
      <motion.div 
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 30 }}
        className="pointer-events-auto h-16 w-full max-w-md mx-auto rounded-2xl bg-[#0B0F29]/80 backdrop-blur-xl border border-white/[0.05] shadow-2xl flex items-center justify-around px-2 relative overflow-hidden"
      >
        {/* Soft immersive glow stream underneath */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/5 via-violet-500/5 to-cyan-500/5 opacity-50" />

        {items.map((item, idx) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={idx}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center justify-center gap-1 group">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'text-white bg-emerald-500/10' 
                        : 'text-white/40 group-hover:text-white/70'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBubble"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 -z-10 border border-emerald-500/30"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon name={item.icon} size={20} className={isActive ? 'text-emerald-400' : 'text-white/40'} />
                  </motion.div>
                  <span className={`text-[9px] font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive ? 'text-white scale-95' : 'text-white/30'
                  }`}>
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MobileBottomNav;
