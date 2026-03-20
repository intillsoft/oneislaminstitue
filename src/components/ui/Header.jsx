import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, User, Settings, LogOut, Bell, Sparkles, Users, Briefcase, Shield, BarChart3, LayoutDashboard, CreditCard, Heart, ChevronDown, ChevronRight } from 'lucide-react';
import Icon from '../AppIcon';
import DarkModeToggle from './DarkModeToggle';
import { useToast } from './Toast';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAIPanel } from '../../contexts/AIPanelContext';
import NotificationBell from './NotificationBell';
import Logo from '../Logo';

// Fallback if ToastProvider not available
const useToastSafe = () => {
  try {
    return useToast();
  } catch {
    return { success: () => { } };
  }
};

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToastSafe();
  const { user, profile, loadingProfile, signOut } = useAuthContext();
  const { openPanel } = useAIPanel();
  const isAuthenticated = !!user;
  const userRole = (!loadingProfile && profile?.role) ? profile.role : (isAuthenticated ? 'student' : null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) setIsSearchExpanded(false);
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) setIsUserMenuOpen(false);
      if (aboutMenuRef?.current && !aboutMenuRef?.current?.contains(event?.target)) setIsAboutMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(`/courses`);
      success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (profile?.name) return profile.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-[72px] flex items-center ${
        location.pathname.includes('/courses') 
          ? 'bg-white/100 dark:bg-[#0A0E27] border-b border-white/[0.03]' 
          : (isScrolled ? 'bg-white/95 dark:bg-[#0A0E27] backdrop-blur-md border-b border-white/[0.03] shadow-sm' : 'bg-transparent')
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* LOGO */}
          <Logo size="sm" horizontal={true} className="mr-8" />

          {/* MAIN NAV */}
          <nav className="hidden md:flex items-center gap-6">
             <Link to="/courses" className="text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-[0.15em] relative group">
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
             </Link>

             {/* About Dropdown */}
             <div className="relative" ref={aboutMenuRef}>
                <button 
                  onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)}
                  className="flex items-center gap-1 text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-[0.15em] group"
                >
                  About <ChevronDown size={12} className={`transition-transform duration-300 ${isAboutMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isAboutMenuOpen && (
                    <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute top-full left-0 mt-3 w-52 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-2xl border border-slate-100 dark:border-slate-800"
                    >
                       {[
                         { label: 'Mission', path: '/mission', icon: Shield },
                         { label: 'Methodology', path: '/methodology', icon: Sparkles },
                         { label: 'Curation', path: '/team', icon: Briefcase }
                       ].map((item, idx) => (
                         <Link 
                           key={idx}
                           to={item.path}
                           onClick={() => setIsAboutMenuOpen(false)}
                           className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                         >
                           <item.icon size={14} className="text-slate-400 group-hover:text-emerald-500" />
                           <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{item.label}</span>
                         </Link>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Role Specific Links */}
             {isAuthenticated && (
                <Link 
                  to={profile?.role === 'admin' ? '/admin/dashboard' : (profile?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard')} 
                  className="text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-[0.15em] relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
             )}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 ml-auto">
             {/* DarkModeToggle removed for cinematic layout */}

             {isAuthenticated ? (
               <div className="flex items-center gap-3">
                  <NotificationBell />
                  
                  {/* User Profile */}
                  <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                       {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 hover:border-emerald-500" />
                       ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black text-[10px] border border-transparent hover:border-emerald-500">
                              {getUserDisplayName().charAt(0).toUpperCase()}
                          </div>
                       )}
                    </button>
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                           <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{getUserDisplayName()}</p>
                           </div>
                           <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                              <User size={14} className="text-slate-400" /> <span className="text-xs font-bold">Profile</span>
                           </Link>
                           <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                              <Settings size={14} className="text-slate-400" /> <span className="text-xs font-bold">Settings</span>
                           </Link>
                           <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 mt-1">
                              <LogOut size={14} /> <span className="text-xs font-bold">Sign Out</span>
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
             ) : (
                <Link to="/login" className="hidden md:block text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">
                  Login
                </Link>
             )}

             {/* HERO CTA + AI PANEL TRIGGER */}
             <div className="flex items-center gap-2">
               <button
                 onClick={() => openPanel()}
                 className="hidden md:flex px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all items-center gap-2 group"
               >
                 <Sparkles size={14} className="text-emerald-500" />
                 <span>AI</span>
               </button>
               
               <Link 
                 to="/donate"
                 className="hidden sm:flex px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/10 transition-all items-center gap-2"
               >
                 <Heart size={14} className="fill-white" />
                 <span>Donate</span>
               </Link>

               {/* Mobile Action Buttons (No Hamburger) */}
               <div className="flex md:hidden items-center justify-center ml-2">
                 <button
                   onClick={() => openPanel()}
                   className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-500/30 transition-all shadow-sm"
                   aria-label="Open AI Assistant"
                 >
                   <Sparkles size={16} className="fill-current" />
                 </button>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#0A1120] border-b border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
            ref={mobileMenuRef}
          >
            <div className="px-6 py-6 space-y-6">
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  <span>Sign In</span>
                  <ChevronRight size={16} className="text-emerald-500" />
                </Link>
              )}

              <div className="space-y-4">
                <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                  <span className="flex items-center gap-3"><Icon name="BookOpen" size={18} className="text-emerald-500" /> Courses</span>
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    to={profile?.role === 'admin' ? '/admin/dashboard' : (profile?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard')} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block py-2 text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest"
                  >
                    <span className="flex items-center gap-3"><Icon name="LayoutDashboard" size={18} className="text-emerald-500" /> My Dashboard</span>
                  </Link>
                )}

                <Link 
                  to="/donate"
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="sm:hidden block py-2 text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3"><Heart size={18} className="text-red-500 fill-red-500" /> Donate</span>
                </Link>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">About Us</p>
                  <div className="space-y-4 pl-4 border-l-2 border-emerald-500/20">
                    <Link to="/mission" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors">Our Mission</Link>
                    <Link to="/methodology" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors">Methodology</Link>
                    <Link to="/team" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors">Curation Team</Link>
                  </div>
                </div>

                {/* Dark mode preference removed for standalone theme absolute */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
