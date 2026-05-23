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
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-shadow duration-300"
      style={{
        background: '#0078D4',
        boxShadow: '0 2px 8px rgba(0,61,107,0.3)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO — white on blue */}
          <Logo size="sm" horizontal={true} darkBg={true} className="mr-8" />

          {/* MAIN NAV */}
          <nav className="hidden md:flex items-center gap-6">
             <Link to="/courses" className="text-[11px] font-bold text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em] relative group">
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
             </Link>

             {/* About Dropdown */}
             <div className="relative" ref={aboutMenuRef}>
                <button 
                  onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)}
                  className="flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em] group"
                >
                  About <ChevronDown size={12} className={`transition-transform duration-300 ${isAboutMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isAboutMenuOpen && (
                    <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute top-full left-0 mt-3 w-52 bg-white rounded-xl p-1.5 shadow-modal border border-[#E2E8F0]"
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
                           className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#EFF6FF] transition-colors group"
                         >
                           <item.icon size={14} className="text-[#94A3B8] group-hover:text-[#0078D4]" />
                           <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider group-hover:text-[#0078D4]">{item.label}</span>
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
                  className="text-[11px] font-bold text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em] relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
             )}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 ml-auto">

             {isAuthenticated ? (
               <div className="flex items-center gap-3">
                  <NotificationBell />
                  
                  {/* User Profile */}
                  <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                       {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/50 hover:border-white transition-colors" />
                       ) : (
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[10px] border-2 border-white/30 hover:border-white/60 transition-colors">
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
                          className="absolute right-0 mt-3 w-56 bg-white rounded-xl p-1.5 shadow-modal border border-[#E2E8F0]"
                        >
                           <div className="px-4 py-3 border-b border-[#E2E8F0] mb-1">
                              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Scholar</p>
                              <p className="text-sm font-bold text-[#0F172A] truncate">{getUserDisplayName()}</p>
                           </div>
                           <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                              <User size={14} className="text-[#94A3B8]" /> <span className="text-xs font-bold text-[#475569]">Profile</span>
                           </Link>
                           <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                              <Settings size={14} className="text-[#94A3B8]" /> <span className="text-xs font-bold text-[#475569]">Settings</span>
                           </Link>
                           <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#FDE7E9] text-[#D13438] mt-1 transition-colors">
                              <LogOut size={14} /> <span className="text-xs font-bold">Sign Out</span>
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
             ) : (
                <Link to="/login" className="hidden md:block text-[11px] font-bold text-white/90 hover:text-white transition-colors uppercase tracking-[0.2em]">
                  Login
                </Link>
             )}

             {/* HERO CTA + AI PANEL TRIGGER */}
             <div className="flex items-center gap-2">
               <div className="flex items-center justify-center mr-1">
                 <DarkModeToggle />
               </div>

               <button
                 onClick={() => openPanel()}
                 className="hidden md:flex px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-md text-xs font-bold border border-white/30 transition-all items-center gap-2 group"
               >
                 <Sparkles size={14} />
                 <span>AI</span>
               </button>
               
               <Link 
                 to="/donate"
                 className="hidden sm:flex px-5 py-1.5 bg-white hover:bg-[#EFF6FF] text-[#0078D4] hover:text-[#0067B8] rounded-full text-xs font-semibold transition-all items-center gap-2"
               >
                 <Heart size={14} className="fill-current" />
                 <span>Donate</span>
               </Link>

               {/* Mobile Action Buttons */}
               <div className="flex md:hidden items-center justify-center ml-2">
                 <button
                   onClick={() => openPanel()}
                   className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-all"
                   aria-label="Open AI Assistant"
                 >
                   <Sparkles size={16} />
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
            className="md:hidden bg-white border-b border-[#E2E8F0] overflow-hidden shadow-modal"
            ref={mobileMenuRef}
          >
            <div className="px-6 py-6 space-y-6">
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full p-4 rounded-xl bg-[#F8FAFC] text-base font-bold text-[#0F172A] uppercase tracking-widest border border-[#E2E8F0]">
                  <span>Sign In</span>
                  <ChevronRight size={16} className="text-[#0078D4]" />
                </Link>
              )}

              <div className="space-y-4">
                <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-bold text-[#0F172A] uppercase tracking-widest">
                  <span className="flex items-center gap-3"><Icon name="BookOpen" size={18} className="text-[#0078D4]" /> Courses</span>
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    to={profile?.role === 'admin' ? '/admin/dashboard' : (profile?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard')} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block py-2 text-base font-bold text-[#0F172A] uppercase tracking-widest"
                  >
                    <span className="flex items-center gap-3"><Icon name="LayoutDashboard" size={18} className="text-[#0078D4]" /> My Dashboard</span>
                  </Link>
                )}

                <Link 
                  to="/donate"
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="sm:hidden block py-2 text-base font-bold text-[#0F172A] uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3"><Heart size={18} className="text-[#D13438] fill-[#D13438]" /> Donate</span>
                </Link>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-4">About Us</p>
                  <div className="space-y-4 pl-4 border-l-2 border-[#C8E0F4]">
                    <Link to="/mission" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-[#475569] hover:text-[#0078D4] transition-colors">Our Mission</Link>
                    <Link to="/methodology" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-[#475569] hover:text-[#0078D4] transition-colors">Methodology</Link>
                    <Link to="/team" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-[#475569] hover:text-[#0078D4] transition-colors">Curation Team</Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
