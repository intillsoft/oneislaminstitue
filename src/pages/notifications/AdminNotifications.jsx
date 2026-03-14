import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Mail, MailOpen, Trash2, Shield, Globe, Users, 
  Book, Search, Clock, Database, AlertCircle, RefreshCw, X,
  Bell, Send, MessageSquare
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
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [composing, setComposing] = useState(false);
  const [composeMode, setComposeMode] = useState('simple'); // 'simple' or 'advanced'
  const [composeData, setComposeData] = useState({
    title: '',
    message: '',
    emailTitle: '',
    emailMessage: '',
    smsMessage: '',
    whatsappMessage: '',
    recipient_type: 'everyone',
    sendInApp: true,
    sendEmail: false,
    sendSMS: false,
    sendWhatsApp: false
  });

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      markAsRead(notification.id, false);
    }
  };

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

    if (!composeData.sendInApp && !composeData.sendEmail && !composeData.sendSMS && !composeData.sendWhatsApp) {
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
          roleFilter = ['student', 'user', 'member', 'job-seeker', 'job_seeker', 'applicant', 'participant'];
        } else if (composeData.recipient_type === 'instructors') {
          roleFilter = ['instructor', 'recruiter', 'talent', 'faculty', 'teacher'];
        } else if (composeData.recipient_type === 'admins') {
          roleFilter = ['admin', 'super-admin', 'super_admin', 'owner', 'moderator'];
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
          emailTitle: composeData.emailTitle,
          emailMessage: composeData.emailMessage,
          smsMessage: composeData.smsMessage,
          whatsappMessage: composeData.whatsappMessage,
          type: 'admin_broadcast',
          sendInApp: composeData.sendInApp,
          sendEmail: composeData.sendEmail,
          sendSMS: composeData.sendSMS,
          sendWhatsApp: composeData.sendWhatsApp,
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
        sendSMS: false,
        sendWhatsApp: false
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-0.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
              Notifications<span className="text-emerald-500">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
               onClick={() => setComposing(!composing)}
               className={`h-11 px-6 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                 composing 
                 ? 'bg-rose-500 text-white' 
                 : 'bg-emerald-600 text-white hover:bg-emerald-500'
               }`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">{composing ? 'Cancel' : 'New Message'}</span>
              {composing ? <X size={16} /> : <Zap size={16} />}
            </button>
          </div>
        </div>

        {/* System Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
                { icon: Database, label: "Total", value: notifications.length, color: "blue" },
                { icon: AlertCircle, label: "Unread", value: unreadCount, color: "amber" },
                { icon: RefreshCw, label: "Status", value: "Online", color: "green" },
                { icon: Shield, label: "Security", value: "Secure", color: "blue" }
            ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col gap-4 backdrop-blur-3xl group transition-all duration-300">
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                        <stat.icon size={18} className={stat.color === 'green' ? 'text-emerald-500' : stat.color === 'amber' ? 'text-amber-500' : 'text-blue-500'} />
                    </div>
                   <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors uppercase">{stat.value}</p>
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
                    <div className="bg-white dark:bg-[#0f1429] border border-slate-100 dark:border-white/5 rounded-2xl p-8 lg:p-10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -ml-48 -mt-48" />
                        
                        <div className="relative z-10 grid lg:grid-cols-3 gap-16">
                            {/* Configuration Column */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Send to</label>
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

                                <div className="space-y-8 pt-8 border-t border-white/5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Method</label>
                                    <div className="grid gap-3">
                                        {[
                                            { id: 'sendInApp', label: 'System Alert', icon: Bell },
                                            { id: 'sendEmail', label: 'Email Blast', icon: Mail },
                                            { id: 'sendSMS', label: 'SMS Pipeline', icon: Send },
                                            { id: 'sendWhatsApp', label: 'WhatsApp Chat', icon: MessageSquare }
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
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex gap-6">
                                        <button 
                                            onClick={() => setComposeMode('simple')}
                                            className={`text-[10px] font-bold uppercase tracking-widest transition-all ${composeMode === 'simple' ? 'text-emerald-500' : 'text-slate-600'}`}
                                        >
                                            Simple Mode
                                        </button>
                                        <button 
                                            onClick={() => setComposeMode('advanced')}
                                            className={`text-[10px] font-bold uppercase tracking-widest transition-all ${composeMode === 'advanced' ? 'text-emerald-500' : 'text-slate-600'}`}
                                        >
                                            Advanced Mode
                                        </button>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">
                                        {composeMode === 'simple' ? 'One message for all channels' : 'Craft separate experiences'}
                                    </div>
                                </div>

                                {composeMode === 'simple' ? (
                                    <div className="space-y-12 animate-in fade-in duration-500">
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Universal Subject</label>
                                            <input
                                                type="text"
                                                value={composeData.title}
                                                onChange={(e) => setComposeData({ ...composeData, title: e.target.value })}
                                                placeholder="Enter subject..."
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-6 py-4 text-white text-base font-bold placeholder-slate-900 focus:outline-none focus:border-emerald-500/20 transition-all uppercase tracking-tight"
                                            />
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Universal Message</label>
                                            <textarea
                                                value={composeData.message}
                                                onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                                                placeholder="Type your message here..."
                                                rows={8}
                                                className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-6 py-6 text-slate-500 text-sm font-medium focus:outline-none focus:border-emerald-500/20 transition-all resize-none leading-relaxed placeholder:text-slate-900"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-12 animate-in slide-in-from-right-2 duration-500">
                                        {/* In-App / Default */}
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">In-App Alert (Primary)</label>
                                            <input
                                                type="text"
                                                value={composeData.title}
                                                onChange={(e) => setComposeData({ ...composeData, title: e.target.value })}
                                                placeholder="App Subject"
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-6 py-4 text-white text-sm font-bold placeholder-slate-900 focus:outline-none focus:border-emerald-500/20 transition-all uppercase"
                                            />
                                            <textarea
                                                value={composeData.message}
                                                onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                                                placeholder="App Notification Message"
                                                rows={3}
                                                className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-6 py-4 text-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500/20 transition-all resize-none"
                                            />
                                        </div>

                                        {composeData.sendEmail && (
                                            <div className="space-y-6 pt-6 border-t border-white/5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-blue-500 ml-1">Email Content</label>
                                                <input
                                                    type="text"
                                                    value={composeData.emailTitle}
                                                    onChange={(e) => setComposeData({ ...composeData, emailTitle: e.target.value })}
                                                    placeholder="Custom Email Subject (Leave blank to use App Subject)"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-6 py-4 text-white text-sm font-bold placeholder-slate-900 focus:outline-none focus:border-emerald-500/20 transition-all uppercase"
                                                />
                                                <textarea
                                                    value={composeData.emailMessage}
                                                    onChange={(e) => setComposeData({ ...composeData, emailMessage: e.target.value })}
                                                    placeholder="Detailed Email Body (Markdown supported)"
                                                    rows={5}
                                                    className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-6 py-4 text-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500/20 transition-all resize-none"
                                                />
                                            </div>
                                        )}

                                        {composeData.sendSMS && (
                                            <div className="space-y-6 pt-6 border-t border-white/5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500 ml-1">SMS Pipeline (Max 160 chars)</label>
                                                <textarea
                                                    value={composeData.smsMessage}
                                                    onChange={(e) => setComposeData({ ...composeData, smsMessage: e.target.value })}
                                                    placeholder="Brief SMS message..."
                                                    rows={2}
                                                    className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-6 py-4 text-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500/20 transition-all resize-none"
                                                />
                                                <div className="text-[8px] text-right text-slate-700 font-bold uppercase tracking-widest">
                                                    Length: {composeData.smsMessage.length} / 160
                                                </div>
                                            </div>
                                        )}

                                        {composeData.sendWhatsApp && (
                                            <div className="space-y-6 pt-6 border-t border-white/5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 ml-1">WhatsApp Chat</label>
                                                <textarea
                                                    value={composeData.whatsappMessage}
                                                    onChange={(e) => setComposeData({ ...composeData, whatsappMessage: e.target.value })}
                                                    placeholder="Craft a WhatsApp message (Emoji supported)"
                                                    rows={4}
                                                    className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-6 py-4 text-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500/20 transition-all resize-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex pt-6">
                                    <button
                                        onClick={sendNotification}
                                        disabled={loading}
                                        className="w-full bg-emerald-600 text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-30 flex items-center justify-center gap-4"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Zap size={18} fill="currentColor" />
                                        )}
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Dynamic Content: List or Detail */}
        <AnimatePresence mode="wait">
          {!selectedNotification ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between px-2 pb-2 border-b border-white/5">
                <div className="flex gap-8 sm:gap-12">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'read', label: 'Sent' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFilter(t.id)}
                      className={`py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                        filter === t.id ? 'text-white' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      {t.label}
                      {filter === t.id && (
                        <motion.div layoutId="admin-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 opacity-40" size={14} />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:border-emerald-500/20 transition-all placeholder:text-slate-900 uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-3xl">
                {loading && !notifications.length ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-40 text-center">
                    <Database className="mx-auto mb-6 text-slate-950 opacity-10" size={60} />
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">No records found</h3>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleViewNotification(notification)}
                        className={`group flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-6 cursor-pointer transition-all duration-200 ${
                          notification.is_read ? 'opacity-40 grayscale-[0.5]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full hidden sm:block ${!notification.is_read ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-900'}`} />

                        <div className="w-full sm:w-48 flex-shrink-0">
                          <span className={`text-[10px] uppercase tracking-widest truncate block ${!notification.is_read ? 'font-bold text-white' : 'font-medium text-slate-600'}`}>
                            {notification.data?.recipient_type || 'Internal'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] uppercase tracking-widest truncate ${!notification.is_read ? 'font-bold text-white' : 'font-medium text-slate-500'}`}>
                              {notification.title}
                            </span>
                            <span className="hidden lg:inline text-slate-800 text-[10px] uppercase font-medium tracking-widest truncate opacity-20 group-hover:opacity-100 transition-opacity">
                              &nbsp;—&nbsp;{notification.message}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 sm:w-32 text-left sm:text-right">
                          <span className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: false })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between pt-4 mb-8">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-white transition-all active:scale-95 group"
                >
                  <RefreshCw className="group-hover:-rotate-90 transition-transform" size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Back to Registry</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => markAsRead(selectedNotification.id, selectedNotification.is_read)}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-emerald-500 transition-all"
                  >
                    {selectedNotification.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      deleteNotification(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 lg:p-10 backdrop-blur-3xl relative">
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Zap size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Transmission Data</p>
                      <h2 className="text-xl lg:text-2xl font-bold text-white uppercase tracking-tight">
                        {selectedNotification.title}
                      </h2>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 grid sm:grid-cols-2 gap-8 text-[10px] font-bold uppercase tracking-widest">
                    <div>
                      <p className="text-slate-600 mb-2">Timestamp</p>
                      <p className="text-white">
                        {new Date(selectedNotification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-2">Recipient Category</p>
                      <p className="text-emerald-500">{selectedNotification.data?.recipient_type || 'General'}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <p className="text-sm lg:text-base text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedNotification.message}
                    </p>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="px-8 py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      Close Report
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

export default AdminNotifications;
