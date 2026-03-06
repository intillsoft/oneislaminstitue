import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Bell, User, Grid, X, Settings, CreditCard, LogOut, Briefcase, BarChart3, Shield } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const BottomNav = () => {
    const location = useLocation();
    const { user, profile, signOut } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = !!user;
    const userRole = profile?.role || 'job-seeker';

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Find', icon: Search, path: '/jobs' },
        { label: 'Activity', icon: Bell, path: isAuthenticated ? '/notifications' : '/login' },
        { label: 'Profile', icon: User, path: isAuthenticated ? '/profile' : '/login' },
    ];

    const menuItems = {
        'job-seeker': [
            { label: 'Dashboard', path: '/dashboard', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Applications', path: '/dashboard/applications', icon: 'FileText', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Resume AI', path: '/dashboard/resumes', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Training', path: '/training', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Billing', path: '/billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Settings', path: '/talent/settings', icon: Settings, color: 'text-slate-400', bg: 'bg-slate-500/10' },
        ],
        'recruiter': [
            { label: 'Dashboard', path: '/recruiter/dashboard', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Post Job', path: '/recruiter/jobs', icon: 'Plus', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Company', path: '/recruiter/company', icon: 'Building2', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Talent Hunt', path: '/talent/discover', icon: Search, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Billing', path: '/billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Settings', path: '/talent/settings', icon: Settings, color: 'text-slate-400', bg: 'bg-slate-500/10' },
        ],
        'talent': [
            { label: 'Dashboard', path: '/talent/dashboard', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'My Gigs', path: '/talent/gigs', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Messages', path: '/messages', icon: 'MessageSquare', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Training', path: '/training', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Billing', path: '/billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Settings', path: '/talent/settings', icon: Settings, color: 'text-slate-400', bg: 'bg-slate-500/10' },
        ],
        'admin': [
            { label: 'System', path: '/admin/dashboard', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Users', path: '/admin/users', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Jobs', path: '/admin/jobs', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Billing', path: '/billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ]
    };

    const currentMenuItems = menuItems[isAuthenticated ? userRole : 'job-seeker'];

    return (
        <>
            {/* Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4">
                <nav className="glass-elite rounded-2xl border-white/10 flex items-center justify-between p-2 shadow-2xl">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${isActive(item.path) ? 'text-workflow-primary bg-workflow-primary/10' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive(item.path) ? 'animate-pulse' : ''} />
                            <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
                        </Link>
                    ))}

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Grid size={20} />
                        <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Menu</span>
                    </button>
                </nav>
            </div>

            {/* Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-[#0A1324]/95 backdrop-blur-3xl p-6"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-[1000] tracking-tighter text-white">Menu</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Navigation Hub</p>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {currentMenuItems.map((item, idx) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="h-full block p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-workflow-primary/30 transition-all group active:scale-95"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl ${item.bg || 'bg-white/5'} flex items-center justify-center mb-4 border border-white/5`}>
                                            <Icon name={item.icon} className={`w-6 h-6 ${item.color || 'text-white'}`} />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-widest text-white group-hover:text-workflow-primary transition-colors">
                                            {item.label}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}

                            {isAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: currentMenuItems.length * 0.05 }}
                                    className="col-span-2 mt-4"
                                >
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-500/20 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <LogOut size={20} />
                                            <span>Terminate Session</span>
                                        </div>
                                        <X size={16} className="opacity-40" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="absolute bottom-10 left-6 right-6 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Workflow Enterprise OS v4.2</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Add Sparkles icon component if not in Lucide or Icon
const Sparkles = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

export default BottomNav;
