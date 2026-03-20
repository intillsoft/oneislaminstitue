import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const StudentNotifications = () => {
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        if (user?.id) {
            loadNotifications();
            subscribeToUpdates();
        }
    }, [user?.id, filter]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (filter === 'unread') {
                query = query.eq('is_read', false);
            } else if (filter === 'read') {
                query = query.eq('is_read', true);
            }

            const { data, error } = await query;
            if (error) throw error;
            setNotifications(data || []);
        } catch (err) {
            console.error('Error:', err);
            showError('Sync failed');
        } finally {
            setLoading(false);
        }
    };

    const subscribeToUpdates = () => {
        const subscription = supabase
            .channel(`notifications:${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, () => {
                loadNotifications();
            })
            .subscribe();

        return () => subscription.unsubscribe();
    };

    const handleViewNotification = async (notif) => {
        setSelectedNotification(notif);
        if (!notif.is_read) {
            markAsRead(notif.id, false);
        }
    };

    const markAsRead = async (id, currentReadStatus) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: !currentReadStatus, read_at: !currentReadStatus ? new Date().toISOString() : null })
                .eq('id', id);

            if (error) throw error;
            
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: !currentReadStatus } : n));
            if (selectedNotification?.id === id) {
                setSelectedNotification(prev => ({ ...prev, is_read: !currentReadStatus }));
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            success('Message cleared');
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (selectedNotification?.id === id) setSelectedNotification(null);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] relative overflow-hidden flex flex-col">
            {/* Elite Background Accents */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-5%] right-[-12%] w-[45%] h-[45%] bg-emerald-500/10 rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[110px]" />
                </div>
            </div>

            <div className="flex-1 max-w-6xl w-full mx-auto pt-16 px-6 lg:px-8 relative z-10 flex flex-col">
                <AnimatePresence mode="wait">
                    {!selectedNotification ? (
                        <motion.div 
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col h-full"
                        >
                            {/* Elite Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 px-2">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-0.5 bg-emerald-500 rounded-full" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-emerald-500">Secure Node</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                                        Notifications<span className="text-emerald-500">.</span>
                                    </h1>
                                </div>

                                <div className="flex items-center gap-10 border-l border-white/5 pl-10 hidden lg:flex">
                                    <div className="group cursor-default text-right">
                                        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] mb-1">Unread Alerts</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">{unreadCount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Filters */}
                            <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between mb-8 px-6 pb-2 border-b border-white/5">
                                <div className="flex gap-16">
                                    {[
                                        { id: 'all', label: 'All Mail' },
                                        { id: 'unread', label: 'Unread' },
                                        { id: 'read', label: 'Archived' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setFilter(t.id)}
                                            className={`py-4 text-[11px] font-bold uppercase tracking-[0.4em] transition-all relative ${
                                                filter === t.id
                                                    ? 'text-white'
                                                    : 'text-slate-800 hover:text-slate-400'
                                            }`}
                                        >
                                            {t.label}
                                            {filter === t.id && (
                                                <motion.div layoutId="student-brief-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message Registry */}
                            <div className="flex-1 min-h-0 mb-20">
                                <div className="bg-[#0C1236]/40 border border-white/[0.04] rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl">
                                    {loading && !notifications.length ? (
                                        <div className="flex justify-center py-40">
                                            <div className="w-10 h-10 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="py-60 text-center bg-transparent">
                                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/5">
                                                <Icon name="Inbox" size={24} className="text-slate-800 opacity-20" />
                                            </div>
                                            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.8em]">Briefing Registry Null</h3>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/[0.03]">
                                            <AnimatePresence mode="popLayout">
                                                {notifications.map((notification) => {
                                                    const isUnread = !notification.is_read;
                                                    const sender = notification.data?.sender_name || 'System Administrator';
                                                    
                                                    return (
                                                        <motion.div
                                                            key={notification.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={() => handleViewNotification(notification)}
                                                            className={`group flex items-center gap-8 py-7 px-10 cursor-pointer transition-all duration-300 ${isUnread ? 'bg-white/[0.01] hover:bg-white/[0.03]' : 'bg-transparent opacity-60'}`}
                                                        >
                                                            <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${isUnread ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-900'}`} />
                                                            
                                                            <div className="w-48 lg:w-64 flex-shrink-0">
                                                                <span className={`text-[11px] uppercase tracking-[0.2em] truncate block ${isUnread ? 'font-black text-white' : 'font-bold text-slate-600'}`}>
                                                                    {sender}
                                                                </span>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-4">
                                                                    <span className={`text-[11px] uppercase tracking-widest truncate ${isUnread ? 'font-black text-white' : 'font-bold text-slate-500'}`}>
                                                                        {notification.title}
                                                                    </span>
                                                                    <span className="text-slate-800 text-[10px] uppercase font-bold tracking-widest truncate opacity-20 group-hover:opacity-100 transition-opacity">
                                                                        - {notification.message}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex-shrink-0 w-32 text-right">
                                                                <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">
                                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: false })}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="detail"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            className="flex flex-col h-full mb-20 px-2"
                        >
                            {/* Detail Toolbar */}
                            <div className="flex items-center justify-between mb-16 pt-4">
                                <button
                                    onClick={() => setSelectedNotification(null)}
                                    className="flex items-center gap-4 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-white transition-all active:scale-95 group"
                                >
                                    <Icon name="ArrowLeft" size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Inbox</span>
                                </button>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => markAsRead(selectedNotification.id, selectedNotification.is_read)}
                                        className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-emerald-500 transition-all active:scale-95"
                                        title={selectedNotification.is_read ? "Mark unread" : "Mark read"}
                                    >
                                        <Icon name={selectedNotification.is_read ? "Mail" : "MailOpen"} size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteNotification(selectedNotification.id)}
                                        className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-rose-500 transition-all active:scale-95"
                                        title="Delete"
                                    >
                                        <Icon name="Trash2" size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Detailed View Container */}
                            <div className="bg-[#0C1236]/40 border border-white/[0.04] rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl p-6 lg:p-10 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                                
                                <div className="max-w-4xl mx-auto space-y-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <Icon name="Mail" size={18} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Authenticated Message</p>
                                                <h2 className="text-xl lg:text-2xl font-bold text-white uppercase tracking-tight leading-tight">
                                                    {selectedNotification.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                    {(selectedNotification.data?.sender_name || 'SA')[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">
                                                        {selectedNotification.data?.sender_name || 'System Administrator'}
                                                    </p>
                                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1">
                                                        Authenticated Source
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:items-end gap-1">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    {new Date(selectedNotification.created_at).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                                <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">
                                                    {new Date(selectedNotification.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-invert max-w-none pt-4">
                                        <p className="text-lg text-slate-400 font-medium leading-[1.8] whitespace-pre-wrap selection:bg-emerald-500/20 select-text">
                                            {selectedNotification.message}
                                        </p>
                                    </div>

                                    <div className="pt-12 border-t border-white/5 flex items-center justify-between">
                                         <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.5em]">
                                            Digital Signature - {selectedNotification.id.substring(0, 12)}
                                         </p>
                                        <button 
                                            onClick={() => setSelectedNotification(null)}
                                            className="px-8 py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                                        >
                                            Dismiss View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentNotifications;
