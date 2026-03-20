import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Settings, LogOut, LayoutDashboard,
    Briefcase, Users, ChevronDown, Sparkles, Workflow,
    Shield, GraduationCap, BookOpen, Check
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from './Toast';
import DarkModeToggle from './DarkModeToggle';
import { useSidebar } from '../../contexts/SidebarContext';
import Logo from '../Logo';
import NotificationBell from './NotificationBell';

const ROLE_CONFIG = {
    admin: {
        label: 'Admin',
        fullLabel: 'Administrator',
        icon: Shield,
        color: 'text-rose-400',
        activeBg: 'bg-rose-500/10',
        activeBorder: 'border-rose-500/30',
        dot: 'bg-rose-400',
        glow: 'shadow-rose-500/20',
        path: '/admin/dashboard',
    },
    instructor: {
        label: 'Instructor',
        fullLabel: 'Instructor',
        icon: GraduationCap,
        color: 'text-violet-400',
        activeBg: 'bg-violet-500/10',
        activeBorder: 'border-violet-500/30',
        dot: 'bg-violet-400',
        glow: 'shadow-violet-500/20',
        path: '/instructor/dashboard',
    },
    student: {
        label: 'Scholar',
        fullLabel: 'Scholar View',
        icon: BookOpen,
        color: 'text-emerald-400',
        activeBg: 'bg-emerald-500/10',
        activeBorder: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        glow: 'shadow-emerald-500/20',
        path: '/dashboard',
    },
};

const DashboardHeader = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
    const { isCollapsed, setIsMobileOpen } = useSidebar();
    const userMenuRef = useRef(null);
    const roleMenuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile, userRole, baseRole, switchActiveRole, signOut } = useAuthContext();
    const { success } = useToast();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
                setIsRoleMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
            success('Signed out successfully');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const handleRoleSwitch = (newRole) => {
        if (switchActiveRole(newRole)) {
            setIsRoleMenuOpen(false);
            const cfg = ROLE_CONFIG[newRole] || ROLE_CONFIG.student;
            navigate(cfg.path);
        }
    };

    const getUserDisplayName = () => {
        if (profile?.name) return profile.name;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    const currentRole = ROLE_CONFIG[userRole] || ROLE_CONFIG.student;
    const CurrentRoleIcon = currentRole.icon;

    // Available roles to switch to
    const availableRoles = [];
    if (baseRole === 'admin') availableRoles.push('admin');
    if (baseRole === 'admin' || baseRole === 'instructor') availableRoles.push('instructor');
    availableRoles.push('student');
    const canSwitch = availableRoles.length > 1;

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] h-[var(--header-height)] bg-white/95 dark:bg-[#0A0E27] border-b border-white/[0.03] shadow-sm dark:shadow-md transition-all duration-300">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
                    <Logo size="sm" horizontal={true} />

                    <nav className="hidden lg:flex items-center gap-0.5">
                        <Link
                            to={userRole === 'admin' ? '/admin/dashboard' : (userRole === 'instructor' ? '/instructor/dashboard' : '/dashboard')}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${location.pathname.includes('/dashboard') ? 'text-slate-900 bg-slate-100 dark:text-white dark:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/5'}`}
                        >
                            <LayoutDashboard className="w-3 h-3" />
                            Overview
                        </Link>
                        <Link
                            to="/courses"
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${location.pathname === '/courses' ? 'text-slate-900 bg-slate-100 dark:text-white dark:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/5'}`}
                        >
                            <Briefcase className="w-3 h-3" />
                            Courses
                        </Link>
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">

                    {/* Role Switcher - only for admin/instructor */}
                    {user && canSwitch && (
                        <div className="hidden sm:block relative" ref={roleMenuRef}>
                            <button
                                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                                className={`group flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full border transition-all duration-300 ${isRoleMenuOpen ? `${currentRole.activeBg} ${currentRole.activeBorder}` : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-white/[0.04] dark:border-white/10 dark:hover:bg-white/[0.07] dark:hover:border-white/20 shadow-sm dark:shadow-none'}`}
                                title="Switch perspective"
                            >
                                {/* Status dot */}
                                <div className="relative flex-shrink-0">
                                    <div className={`w-1.5 h-1.5 rounded-full ${currentRole.dot} animate-pulse`} />
                                </div>

                                {/* Role icon + label */}
                                <CurrentRoleIcon className={`w-3 h-3 ${currentRole.color}`} />
                                <span className={`text-[10px] font-bold tracking-widest uppercase ${currentRole.color} whitespace-nowrap`}>
                                    {currentRole.label}
                                </span>

                                <ChevronDown className={`w-2.5 h-2.5 text-slate-400 dark:text-white/30 transition-transform duration-300 ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isRoleMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden z-[110] shadow-xl dark:shadow-2xl"
                                    >
                                        {/* Header */}
                                        <div className="px-4 pt-3.5 pb-2">
                                            <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">Switch View</p>
                                        </div>

                                        {/* Role Options */}
                                        <div className="px-2 pb-2 space-y-0.5">
                                            {availableRoles.map((role) => {
                                                const cfg = ROLE_CONFIG[role];
                                                const RoleIcon = cfg.icon;
                                                const isActive = userRole === role;
                                                return (
                                                    <button
                                                        key={role}
                                                        onClick={() => handleRoleSwitch(role)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${isActive
                                                            ? `${cfg.activeBg} border ${cfg.activeBorder}`
                                                            : 'hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-transparent'}`}
                                                    >
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? cfg.activeBg : 'bg-slate-100 dark:bg-white/5'}`}>
                                                            <RoleIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                                                        </div>
                                                        <span className={`text-[11px] font-bold flex-1 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/50'}`}>
                                                            {cfg.fullLabel}
                                                        </span>
                                                        {isActive && (
                                                            <Check className={`w-3 h-3 ${cfg.color} flex-shrink-0`} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Footer hint */}
                                        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-white/5">
                                            <p className="text-[8px] text-slate-400 dark:text-white/20 font-medium flex items-center gap-1.5">
                                                <Sparkles className="w-2.5 h-2.5" />
                                                Adaptive UI switches with your role
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <NotificationBell />

                    <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08]" />

                    {/* Profile Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 p-0.5 rounded-full border border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/25 transition-all duration-200 group bg-white dark:bg-transparent shadow-sm dark:shadow-none"
                        >
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className={`w-8 h-8 rounded-full ${currentRole.activeBg} border ${currentRole.activeBorder} flex items-center justify-center text-[10px] font-black ${currentRole.color}`}>
                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                </div>
                            )}
                            <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:text-white/30 dark:group-hover:text-white/60 transition-all duration-300 mr-0.5 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden z-[60] shadow-xl dark:shadow-2xl"
                                >
                                    {/* User Info */}
                                    <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-3 mb-2">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                                            ) : (
                                                <div className={`w-9 h-9 rounded-full ${currentRole.activeBg} flex items-center justify-center text-xs font-black ${currentRole.color}`}>
                                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{getUserDisplayName()}</p>
                                                <div className={`flex items-center gap-1 mt-0.5`}>
                                                    <CurrentRoleIcon className={`w-2.5 h-2.5 ${currentRole.color}`} />
                                                    <p className={`text-[9px] font-black uppercase tracking-widest ${currentRole.color}`}>
                                                        {currentRole.fullLabel}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-2 py-2 space-y-0.5">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all group"
                                        >
                                            <User className="w-3.5 h-3.5 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/70 transition-colors" />
                                            <span className="text-xs font-semibold text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors">Profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all group"
                                        >
                                            <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/70 transition-colors" />
                                            <span className="text-xs font-semibold text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors">Settings</span>
                                        </Link>
                                    </div>

                                    <div className="px-2 pb-2 border-t border-slate-100 dark:border-white/[0.06] pt-1 mt-1">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                                        >
                                            <LogOut className="w-3.5 h-3.5 text-slate-400 dark:text-white/30 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                            <span className="text-xs font-semibold text-slate-600 dark:text-white/60 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Sign Out</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
