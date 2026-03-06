import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { ElitePageHeader } from '../../components/ui/EliteCard';
import Icon from 'components/AppIcon';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const StudentNotifications = () => {
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    const markAsRead = async (id, isRead) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: !isRead, read_at: !isRead ? new Date().toISOString() : null })
                .eq('id', id);

            if (error) throw error;
            loadNotifications();
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
            loadNotifications();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] relative overflow-hidden">
            {/* Elite Background Accents */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-5%] right-[-12%] w-[45%] h-[45%] bg-emerald-500/5 rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[110px]" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-16 px-6 lg:px-8 relative z-10 pb-40">
                {/* Elite Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 px-2">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-0.5 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-emerald-500 ml-1">Notifications</span>
                        </div>
                        <h1 className="text-8xl font-black text-white tracking-tighter uppercase leading-none">
                            Inbox<span className="text-emerald-500 text-7xl">.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-14 border-l border-white/5 pl-14">
                        <div className="group cursor-default">
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 group-hover:text-emerald-500 transition-colors">New</p>
                            <p className="text-5xl font-black text-white">{unreadCount}</p>
                        </div>
                        <div className="group cursor-default">
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 group-hover:text-slate-400 transition-colors">Total</p>
                            <p className="text-5xl font-black text-slate-900">{notifications.length}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Filters */}
                <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between mb-16 px-6 pb-2 border-b border-white/5">
                    <div className="flex gap-16">
                        {[
                            { id: 'all', label: 'Full Stream' },
                            { id: 'unread', label: 'Unread' },
                            { id: 'read', label: 'Archived' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className={`py-4 text-[11px] font-black uppercase tracking-[0.5em] transition-all relative ${
                                    filter === t.id
                                        ? 'text-white'
                                        : 'text-slate-800 hover:text-slate-400'
                                }`}
                            >
                                {t.label}
                                {filter === t.id && (
                                    <motion.div layoutId="student-brief-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {unreadCount > 0 && filter !== 'read' && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/10">
                            {unreadCount} Active Transmissions
                        </div>
                    )}
                </div>

                {/* Message List */}
                <div className="grid gap-5">
                    {loading && !notifications.length ? (
                        <div className="flex justify-center py-40">
                            <div className="w-12 h-12 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-60 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[5rem]">
                            <Icon name="Bell" size={96} className="mx-auto mb-12 text-slate-950 opacity-10" />
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.8em]">Briefing Registry Null</h3>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {notifications.map((notification, idx) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, scale: 0.99, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ delay: idx * 0.03 }}
                                >
                                    <div 
                                        className={`group p-12 rounded-[4rem] border transition-all duration-700 ${
                                            notification.is_read
                                            ? 'bg-transparent border-white/5 opacity-40 grayscale'
                                            : 'bg-white/[0.01] border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.02] shadow-3xl shadow-black/40'
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-6 mb-6">
                                                    <div className={`w-3 h-3 rounded-full ${!notification.is_read ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse' : 'bg-slate-900'}`} />
                                                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-6xl group-hover:text-slate-400 transition-colors">
                                                    {notification.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                <button
                                                    onClick={() => markAsRead(notification.id, notification.is_read)}
                                                    className={`p-7 rounded-[2rem] border transition-all ${
                                                        notification.is_read
                                                        ? 'bg-white/5 border-white/5 text-slate-800'
                                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                                                    }`}
                                                    title={notification.is_read ? "Keep unread" : "Mark as processed"}
                                                >
                                                    <Icon name={notification.is_read ? 'Mail' : 'MailOpen'} size={24} />
                                                </button>
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-7 bg-white/5 border border-white/5 text-slate-800 hover:text-rose-500 hover:border-rose-500/40 rounded-[2rem] transition-all"
                                                    title="Purge transmission"
                                                >
                                                    <Icon name="Trash2" size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
