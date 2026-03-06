import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Mail, MailOpen, Trash2, Send, Plus, X, 
  Info, AlertTriangle, CheckCircle, Search, Users, BookOpen
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { ElitePageHeader, EliteCard } from '../../components/ui/EliteCard';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

const InstructorNotifications = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  
  const [myNotifications, setMyNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [showComposer, setShowComposer] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');

  const [composerData, setComposerData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetType: 'all-students',
    courseId: '',
    sendInApp: true,
    sendEmail: false,
    sendSMS: false
  });

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadCourses();
      subscribeToUpdates();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const [receivedResp, sentResp] = await Promise.all([
        supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('notifications')
          .select('*')
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (receivedResp.error) throw receivedResp.error;
      if (sentResp.error) throw sentResp.error;

      setMyNotifications(receivedResp.data || []);
      setSentNotifications(sentResp.data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
      showError('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, status')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase.channel(`notifications:instructor:${user.id}`);
    
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'notifications'
    }, () => {
      loadNotifications();
    }).subscribe();

    return () => channel.unsubscribe();
  };

  const handleViewNotification = (notif) => {
    setSelectedNotification(notif);
    if (activeTab === 'received' && !notif.is_read) {
        markAsRead(notif.id, false);
    }
  };

  const markAsRead = async (id, currentStatus) => {
    try {
      if (currentStatus) return;
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic
      setMyNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      if (selectedNotification?.id === id) {
          setSelectedNotification(prev => ({ ...prev, is_read: true }));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      success('Log deleted');
      if (activeTab === 'received') {
          setMyNotifications(prev => prev.filter(n => n.id !== id));
      } else {
          setSentNotifications(prev => prev.filter(n => n.id !== id));
      }
      if (selectedNotification?.id === id) setSelectedNotification(null);
    } catch (err) {
      console.error('Error deleting:', err);
      showError('Failed to delete');
    }
  };

  const sendNotification = async () => {
    try {
      if (!composerData.title || !composerData.message) {
        showError('Message payload incomplete');
        return;
      }

      setLoading(true);
      
      let targetUserIds = [];
      if (composerData.targetType === 'all-students') {
        const { data } = await supabase
          .from('users')
          .select('id')
          .in('role', ['student', 'job-seeker', 'applicant', 'job-seeker']);
        targetUserIds = data?.map(u => u.id) || [];
      } else if (composerData.targetType === 'course') {
        if (!composerData.courseId) {
          showError('Please select target course');
          setLoading(false);
          return;
        }
        const { data } = await supabase
          .from('applications')
          .select('user_id')
          .eq('job_id', composerData.courseId)
          .eq('status', 'enrolled');
        targetUserIds = data?.map(a => a.user_id) || [];
      }

      if (targetUserIds.length === 0) {
        showError('No recipients found in this sector');
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
          userIds: targetUserIds,
          title: composerData.title,
          message: composerData.message,
          type: 'announcement',
          sendInApp: composerData.sendInApp,
          sendEmail: composerData.sendEmail,
          sendSMS: composerData.sendSMS,
          data: {
            instructorId: user.id,
            courseId: composerData.courseId || null,
            sender_name: profile?.name || profile?.first_name || 'Instructor'
          }
        }),
      });

      if (!response.ok) throw new Error('Dispatch failed');

      success(`Successfully broadcasted to ${targetUserIds.length} students`);
      setShowComposer(false);
      setComposerData({
        title: '',
        message: '',
        type: 'info',
        targetType: 'all-students',
        courseId: '',
        sendInApp: true,
        sendEmail: false,
        sendSMS: false
      });
      loadNotifications();
    } catch (err) {
      console.error('Error sending:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayNotifications = activeTab === 'received' ? myNotifications : sentNotifications;
  const unreadCount = myNotifications.filter(n => !n.is_read).length;

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] relative overflow-hidden flex flex-col">
            {/* Elite Background Accents */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-max-7xl">
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
                                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-emerald-500">Instructor Node</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                                        Communication Hub<span className="text-emerald-500">.</span>
                                    </h1>
                                </div>

                                <div className="flex items-center gap-14 border-l border-white/5 pl-14 hidden md:flex">
                                    <div className="group cursor-default text-right hidden lg:block">
                                        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] mb-1">Unread Alerts</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">{unreadCount}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowComposer(!showComposer)}
                                        className={`h-11 px-6 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                                            showComposer 
                                            ? 'bg-rose-500 text-white' 
                                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{showComposer ? 'Cancel' : 'Send Broadcast'}</span>
                                        {showComposer ? <X size={14} /> : <Send size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Composer Section */}
                            <AnimatePresence>
                                {showComposer && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden mb-16"
                                    >
                                        <div className="bg-white/[0.02] dark:bg-[#0f1429]/40 backdrop-blur-3xl rounded-2xl border border-white/5 p-6 lg:p-10 shadow-3xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -ml-48 -mt-48 pointer-events-none" />
                                            
                                            <div className="relative z-10 grid lg:grid-cols-5 gap-16">
                                                <div className="lg:col-span-2 space-y-12">
                                                    <div className="space-y-6">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 ml-1">Recipient Group</label>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {[
                                                                { id: 'all-students', label: 'Global Students', icon: Users },
                                                                { id: 'course', label: 'Sector Specific', icon: BookOpen }
                                                            ].map(t => (
                                                                <button
                                                                    key={t.id}
                                                                    onClick={() => setComposerData({ ...composerData, targetType: t.id })}
                                                                    className={`px-8 py-5 rounded-2xl border flex items-center gap-5 transition-all ${
                                                                        composerData.targetType === t.id
                                                                        ? 'bg-white text-black border-white shadow-xl'
                                                                        : 'bg-white/5 border-white/5 text-slate-700 hover:text-slate-500'
                                                                    }`}
                                                                >
                                                                    <t.icon size={16} />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {composerData.targetType === 'course' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="space-y-4 pt-4"
                                                            >
                                                                <div className="relative group">
                                                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 transition-colors group-focus-within:text-emerald-500" />
                                                                    <input 
                                                                        type="text"
                                                                        placeholder="Search internal sectors..."
                                                                        value={courseSearch}
                                                                        onChange={(e) => setCourseSearch(e.target.value)}
                                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-[10px] font-black text-white placeholder-slate-900 transition-all focus:border-emerald-500/20 outline-none uppercase tracking-widest"
                                                                    />
                                                                </div>
                                                                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 p-1">
                                                                    {filteredCourses.map(c => (
                                                                        <button
                                                                            key={c.id}
                                                                            onClick={() => setComposerData({ ...composerData, courseId: c.id })}
                                                                            className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${
                                                                                composerData.courseId === c.id
                                                                                ? 'bg-white text-black border-white shadow-xl'
                                                                                : 'bg-white/5 border-transparent text-slate-700 hover:bg-white/10 hover:text-slate-400'
                                                                            }`}
                                                                        >
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase tracking-widest truncate">{c.title}</p>
                                                                                <p className={`text-[8px] uppercase tracking-[0.2em] font-black mt-1 ${composerData.courseId === c.id ? 'opacity-40' : 'text-slate-900'}`}>
                                                                                    ID: {c.id.substring(0, 8)}
                                                                                </p>
                                                                            </div>
                                                                            {composerData.courseId === c.id && <CheckCircle size={16} />}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 ml-1">Transmission Channels</label>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {[
                                                                { id: 'sendInApp', label: 'Internal Notification', icon: Bell },
                                                                { id: 'sendEmail', label: 'External Email', icon: Mail },
                                                                { id: 'sendSMS', label: 'Direct SMS Blast', icon: Send }
                                                            ].map(channel => (
                                                                <button
                                                                    key={channel.id}
                                                                    onClick={() => setComposerData({ ...composerData, [channel.id]: !composerData[channel.id] })}
                                                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                                        composerData[channel.id]
                                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                                                        : 'bg-white/5 border-white/5 text-slate-800 hover:text-white'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-5">
                                                                        <channel.icon size={18} className={composerData[channel.id] ? 'text-emerald-500' : 'text-slate-900'} />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">{channel.label}</span>
                                                                    </div>
                                                                    <div className={`w-10 h-1.5 rounded-full relative transition-all ${composerData[channel.id] ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                                                                        <div className={`absolute -top-1 w-3.5 h-3.5 rounded-full transition-all border-2 border-[#121214] ${composerData[channel.id] ? 'right-0 bg-white' : 'left-0 bg-slate-700'}`} />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="lg:col-span-3 space-y-12">
                                                    <div className="space-y-10">
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 ml-1">Subject Header</label>
                                                            <input
                                                                type="text"
                                                                value={composerData.title}
                                                                onChange={(e) => setComposerData({ ...composerData, title: e.target.value })}
                                                                placeholder="Transmission Heading..."
                                                                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-xl text-base font-bold text-white focus:outline-none focus:border-emerald-500/20 transition-all uppercase placeholder:text-slate-900 tracking-tight"
                                                            />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 ml-1">Communication Body</label>
                                                            <textarea
                                                                value={composerData.message}
                                                                onChange={(e) => setComposerData({ ...composerData, message: e.target.value })}
                                                                placeholder="Type your official announcement..."
                                                                rows="8"
                                                                className="w-full px-8 py-8 bg-white/[0.02] border border-white/5 rounded-[2rem] text-base font-medium text-slate-400 focus:outline-none focus:border-emerald-500/20 transition-all resize-none leading-relaxed placeholder:text-slate-900"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={sendNotification}
                                                        disabled={loading}
                                                        className="w-full bg-emerald-600 text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                                    >
                                                        {loading ? <div className="w-5 h-5 border-[2px] border-white/20 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                                                        {loading ? 'Dispatching...' : 'Complete Transmission'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Activity Registry Header */}
                            <div className="flex items-center justify-between border-b border-white/5 px-6 pb-2 mb-8">
                                <div className="flex gap-16">
                                    {[
                                        { id: 'received', label: 'Briefing Inbox' },
                                        { id: 'sent', label: 'Outbound Logs' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 text-[11px] font-black uppercase tracking-[0.5em] transition-all relative ${
                                                activeTab === tab.id
                                                    ? 'text-white'
                                                    : 'text-slate-800 hover:text-slate-400'
                                            }`}
                                        >
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div layoutId="instructor-tab-bridge" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Gmail Style List */}
                             <div className="flex-1 min-h-0 mb-40">
                                <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-3xl">
                                    {loading && !displayNotifications.length ? (
                                        <div className="flex justify-center py-40">
                                            <div className="w-10 h-10 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                                        </div>
                                    ) : displayNotifications.length === 0 ? (
                                        <div className="py-60 text-center bg-transparent">
                                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/5">
                                                <Bell className="text-slate-800 opacity-20" size={24} />
                                            </div>
                                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.8em]">Registry Null</h3>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {displayNotifications.map((notification) => {
                                                const isUnread = notification.is_read && activeTab === 'received';
                                                const senderName = activeTab === 'received' 
                                                    ? (notification.data?.sender_name || 'System Administrator') 
                                                    : (notification.data?.courseId ? 'Sector Transmission' : 'Global Distribution');

                                                return (
                                                    <motion.div
                                                        key={notification.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        onClick={() => handleViewNotification(notification)}
                                                        className={`group flex items-center gap-8 py-7 px-10 cursor-pointer transition-all duration-300 ${
                                                            isUnread ? 'bg-white/[0.01] hover:bg-white/[0.03]' : 'bg-transparent opacity-60'
                                                        }`}
                                                    >
                                                        <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${isUnread ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-900'}`} />
                                                        
                                                        <div className="w-48 lg:w-64 flex-shrink-0">
                                                            <span className={`text-[11px] uppercase tracking-[0.2em] truncate block ${isUnread ? 'font-black text-white' : 'font-bold text-slate-600'}`}>
                                                                {senderName}
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
                                    className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-white transition-all active:scale-95 group"
                                >
                                    <X size={16} className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Close Transmission</span>
                                </button>

                                <div className="flex items-center gap-4">
                                    {activeTab === 'received' && (
                                        <button
                                            onClick={() => markAsRead(selectedNotification.id, selectedNotification.is_read)}
                                            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-emerald-500 transition-all active:scale-95"
                                        >
                                            <Mail size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(selectedNotification.id)}
                                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-rose-500 transition-all active:scale-95"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                             {/* Detailed Message Container */}
                            <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-3xl p-6 lg:p-10 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                                
                                <div className="max-w-4xl mx-auto space-y-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <Send size={18} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Detailed Briefing</p>
                                                <h2 className="text-xl lg:text-2xl font-bold text-white uppercase tracking-tight leading-tight">
                                                    {selectedNotification.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                    {(activeTab === 'received' ? (selectedNotification.data?.sender_name || 'SA') : 'YOU')[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">
                                                        {activeTab === 'received' ? (selectedNotification.data?.sender_name || 'Administrator') : 'Authoritative Account'}
                                                    </p>
                                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1">
                                                        {activeTab === 'received' ? 'Distribution Hub' : 'Primary Node'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:items-end gap-1">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    {new Date(selectedNotification.created_at).toLocaleDateString()}
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
                                            Core Hash • {selectedNotification.id.substring(0, 16).toUpperCase()}
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

export default InstructorNotifications;
