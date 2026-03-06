import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Mail, MailOpen, Trash2, Shield, Globe, Users, 
  Book, Search, Clock, Database, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { ElitePageHeader, EliteCard, EliteStatCard } from '../../components/ui/EliteCard';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

const AdminNotifications = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [composing, setComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    title: '',
    message: '',
    recipient_type: 'all',
    sendInApp: true,
    sendEmail: false,
    sendSMS: false
  });

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      subscribeToUpdates();
    }
  }, [user?.id, filter]); // Added filter to re-load on change

  const loadNotifications = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data || [];
      if (search) {
        filtered = filtered.filter(n =>
          n.title?.toLowerCase().includes(search.toLowerCase()) ||
          n.message?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setNotifications(filtered);
    } catch (err) {
      console.error('Error:', err);
      showError('System sync failed');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const subscription = supabase
      .channel('admin-notifications-sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const sendNotification = async () => {
    if (!composeData.title.trim() || !composeData.message.trim()) {
      showError('Incomplete announcement payload');
      return;
    }

    if (!composeData.sendInApp && !composeData.sendEmail && !composeData.sendSMS) {
      showError('Select delivery channel');
      return;
    }

    try {
      setLoading(true);
      let userIds = [];

      if (composeData.recipient_type === 'everyone') {
        const { data } = await supabase.from('users').select('id');
        userIds = (data || []).map(u => u.id);
      } else {
        let roleFilter = [];
        if (composeData.recipient_type === 'students') {
          roleFilter = ['student', 'job-seeker', 'applicant', 'participant'];
        } else if (composeData.recipient_type === 'instructors') {
          roleFilter = ['instructor', 'recruiter', 'talent', 'faculty'];
        } else if (composeData.recipient_type === 'admins') {
          roleFilter = ['admin', 'super-admin', 'owner', 'moderator'];
        }
        
        const { data } = await supabase.from('users').select('id').in('role', roleFilter);
        userIds = (data || []).map(u => u.id);
      }

      if (userIds.length === 0) {
        showError(`Target group [${composeData.recipient_type}] has no active members`);
        setLoading(false);
        return;
      }

      const session = await supabase.auth.getSession();
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          userIds,
          title: composeData.title,
          message: composeData.message,
          type: 'admin_broadcast',
          sendInApp: composeData.sendInApp,
          sendEmail: composeData.sendEmail,
          sendSMS: composeData.sendSMS,
          data: { 
            recipient_type: composeData.recipient_type,
            sender_id: user.id,
            sender_name: profile?.name || 'Administrator'
          }
        }),
      });

      if (!response.ok) throw new Error('Broadcast failed to initialize');

      success(`Messages successfully deployed to ${userIds.length} nodes`);
      setComposeData({ 
        title: '', 
        message: '', 
        recipient_type: 'everyone',
        sendInApp: true,
        sendEmail: false,
        sendSMS: false
      });
      setComposing(false);
      loadNotifications();
    } catch (err) {
      console.error('Error:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
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
      success('Log entry removed');
      loadNotifications();
    } catch (err) {
      console.error('Error:', err);
      showError('Failed to purge record');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] relative overflow-hidden">
      {/* Elite Background Accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[160px]" />
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[140px]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-6 lg:px-8 relative z-10 pb-40">
        {/* Elite Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-0.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500">Security & Ops</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Control Center<span className="text-emerald-500 text-7xl">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button
               onClick={() => setComposing(!composing)}
               className={`px-8 py-5 rounded-[2rem] flex items-center gap-4 transition-all duration-500 shadow-2xl ${
                 composing 
                 ? 'bg-rose-500 text-white' 
                 : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
               }`}
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">{composing ? 'Abort Broadcast' : 'New Broadcast'}</span>
              {composing ? <X size={18} /> : <Zap size={18} />}
            </button>
          </div>
        </div>

        {/* System Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
                { icon: Database, label: "Total Dispatch", value: notifications.length, color: "blue" },
                { icon: AlertCircle, label: "Action Required", value: unreadCount, color: "amber" },
                { icon: RefreshCw, label: "Core Synchronized", value: "99.9%", color: "green" },
                { icon: Shield, label: "Encryption", value: "Locked", color: "blue" }
            ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-7 rounded-[2.5rem] flex flex-col gap-6 backdrop-blur-3xl group hover:border-emerald-500/20 transition-all duration-500">
                    <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon size={20} className={stat.color === 'green' ? 'text-emerald-500' : stat.color === 'amber' ? 'text-amber-500' : 'text-blue-500'} />
                    </div>
                   <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{stat.value}</p>
                   </div>
                </div>
            ))}
        </div>

        {/* Global Dispatch Module */}
        <AnimatePresence>
            {composing && (
                <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98 }}
                    className="overflow-hidden mb-20"
                >
                    <div className="bg-white dark:bg-[#0f1429] border border-slate-100 dark:border-white/5 rounded-[4rem] p-12 lg:p-16 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -ml-48 -mt-48" />
                        
                        <div className="relative z-10 grid lg:grid-cols-3 gap-16">
                            {/* Configuration Column */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Target Segments</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'everyone', label: 'Everyone' },
                                            { id: 'students', label: 'Students' },
                                            { id: 'instructors', label: 'Faculty' },
                                            { id: 'admins', label: 'Internal' }
                                        ].map(target => (
                                            <button
                                                key={target.id}
                                                onClick={() => setComposeData({ ...composeData, recipient_type: target.id })}
                                                className={`px-6 py-5 rounded-2xl border transition-all text-center ${
                                                    composeData.recipient_type === target.id
                                                    ? 'bg-white text-black border-white shadow-2xl'
                                                    : 'bg-white/[0.01] border-white/5 text-slate-700 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">{target.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8 pt-12 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Global Channels</label>
                                    <div className="grid gap-3">
                                        {[
                                            { id: 'sendInApp', label: 'System Alert', icon: Bell },
                                            { id: 'sendEmail', label: 'Email Blast', icon: Mail },
                                            { id: 'sendSMS', label: 'SMS Pipeline', icon: Send }
                                        ].map(channel => (
                                            <button
                                                key={channel.id}
                                                onClick={() => setComposeData({ ...composeData, [channel.id]: !composeData[channel.id] })}
                                                className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                                                    composeData[channel.id]
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-xl shadow-emerald-500/5'
                                                    : 'bg-white/[0.01] border-white/5 text-slate-800 hover:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <channel.icon size={16} className={composeData[channel.id] ? 'text-emerald-500' : 'text-slate-950'} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{channel.label}</span>
                                                </div>
                                                <div className={`w-9 h-4.5 rounded-full relative transition-all ${composeData[channel.id] ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                                                    <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all shadow-sm ${composeData[channel.id] ? 'right-0.5' : 'left-0.5'}`} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Payload Column */}
                            <div className="lg:col-span-2 space-y-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Announcement Subject</label>
                                    <input
                                        type="text"
                                        value={composeData.title}
                                        onChange={(e) => setComposeData({ ...composeData, title: e.target.value })}
                                        placeholder="Headline transmission..."
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-10 py-7 text-white text-2xl font-black placeholder-slate-950 focus:outline-none focus:border-emerald-500/20 transition-all uppercase tracking-tighter"
                                    />
                                </div>
                                
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Detailed Message</label>
                                    <textarea
                                        value={composeData.message}
                                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                                        placeholder="Compose global platform update..."
                                        rows={10}
                                        className="w-full bg-white/[0.01] border border-white/5 rounded-[3.5rem] px-10 py-10 text-slate-500 text-lg font-medium focus:outline-none focus:border-emerald-500/20 transition-all resize-none leading-relaxed placeholder:text-slate-950"
                                    />
                                </div>

                                <div className="flex pt-6">
                                    <button
                                        onClick={sendNotification}
                                        disabled={loading}
                                        className="w-full bg-emerald-600 text-white py-8 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-30 flex items-center justify-center gap-6"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-[4px] border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Zap size={20} fill="currentColor" />
                                        )}
                                        {loading ? 'Initiating Dispatch...' : 'Broadcast Annoucement'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Audit Logs Registry */}
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between px-6 pb-2 border-b border-white/5">
                <div className="flex gap-16">
                    {[
                        { id: 'all', label: 'Full Registry' },
                        { id: 'unread', label: 'Active Alerts' },
                        { id: 'read', label: 'Archived Trace' }
                    ].map((t) => (
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
                                <motion.div layoutId="admin-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-500" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-[400px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800 opacity-40 transition-opacity group-focus-within:opacity-100" size={18} />
                    <input
                        type="text"
                        placeholder="Search system logs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-16 pr-10 py-5 bg-white/[0.01] border border-white/5 rounded-[2rem] text-[11px] font-bold text-white focus:outline-none focus:border-emerald-500/20 transition-all placeholder:text-slate-900 uppercase tracking-widest"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {loading && !notifications.length ? (
                    <div className="flex justify-center py-40">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-60 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[5rem]">
                        <Database className="mx-auto mb-10 text-slate-950 opacity-10" size={100} />
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.8em]">Registry Null</h3>
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
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
                                                <div className={`w-3 h-3 rounded-full ${notification.is_read ? 'bg-slate-900' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse'}`} />
                                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors">
                                                {notification.title}
                                            </h4>
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
                                                title={notification.is_read ? "Keep as trace" : "Mark as processed"}
                                            >
                                                {notification.is_read ? <Mail size={24} /> : <MailOpen size={24} />}
                                            </button>
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-7 bg-white/5 border border-white/5 text-slate-800 hover:text-rose-500 hover:border-rose-500/40 rounded-[2rem] transition-all"
                                                title="Purge transmission"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
