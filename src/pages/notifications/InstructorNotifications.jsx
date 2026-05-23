import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Mail, MailOpen, Trash2, Send, Plus, X, 
  Info, AlertTriangle, CheckCircle, Search, Users, BookOpen, MessageSquare
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
    sendSMS: false,
    sendWhatsApp: false
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

      if (!composerData.sendInApp && !composerData.sendEmail && !composerData.sendSMS && !composerData.sendWhatsApp) {
        showError('Select delivery channel');
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
          sendWhatsApp: composerData.sendWhatsApp,
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
        sendSMS: false,
        sendWhatsApp: false
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
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
            {/* Elite Background Accents */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-5%] right-[-12%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-accent/10 rounded-full blur-[110px]" />
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
                                        <div className="w-10 h-0.5 bg-primary rounded-full" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary">Instructor Node</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase">
                                        Communication Hub<span className="text-primary">.</span>
                                    </h1>
                                </div>

                                <div className="flex items-center gap-14 border-l border-border/40 pl-14 hidden md:flex">
                                    <div className="group cursor-default text-right hidden lg:block">
                                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.4em] mb-1">Unread Alerts</p>
                                        <p className="text-2xl font-black text-foreground tracking-tight">{unreadCount}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowComposer(!showComposer)}
                                        className={`h-11 px-6 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                                            showComposer 
                                            ? 'bg-rose-500 text-white' 
                                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
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
                                        <div className="bg-card/45 backdrop-blur-3xl rounded-3xl border border-border/40 p-6 lg:p-10 shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -ml-48 -mt-48 pointer-events-none" />
                                            
                                            <div className="relative z-10 grid lg:grid-cols-5 gap-16">
                                                <div className="lg:col-span-2 space-y-12">
                                                    <div className="space-y-6">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-1">Recipient Group</label>
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
                                                                        ? 'bg-primary text-primary-foreground border-primary/20 shadow-xl'
                                                                        : 'bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground'
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
                                                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                                    <input 
                                                                        type="text"
                                                                        placeholder="Search internal sectors..."
                                                                        value={courseSearch}
                                                                        onChange={(e) => setCourseSearch(e.target.value)}
                                                                        className="w-full bg-muted/30 border border-border/40 rounded-2xl pl-16 pr-6 py-5 text-[10px] font-black text-foreground placeholder-muted-foreground/60 transition-all focus:border-primary/40 outline-none uppercase tracking-widest"
                                                                    />
                                                                </div>
                                                                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 p-1">
                                                                    {filteredCourses.map(c => (
                                                                        <button
                                                                            key={c.id}
                                                                            onClick={() => setComposerData({ ...composerData, courseId: c.id })}
                                                                            className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${
                                                                                composerData.courseId === c.id
                                                                                ? 'bg-primary text-primary-foreground border-primary/20 shadow-xl'
                                                                                : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                                            }`}
                                                                        >
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase tracking-widest truncate">{c.title}</p>
                                                                                <p className={`text-[8px] uppercase tracking-[0.2em] font-black mt-1 ${composerData.courseId === c.id ? 'opacity-60' : 'text-muted-foreground'}`}>
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

                                                    <div className="pt-8 border-t border-border/40 space-y-6">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Methods</label>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {[
                                                                { id: 'sendInApp', label: 'Internal Notification', icon: Bell },
                                                                { id: 'sendEmail', label: 'External Email', icon: Mail },
                                                                { id: 'sendSMS', label: 'Direct SMS Blast', icon: Send },
                                                                { id: 'sendWhatsApp', label: 'WhatsApp Message', icon: MessageSquare }
                                                            ].map(channel => (
                                                                <button
                                                                    key={channel.id}
                                                                    onClick={() => setComposerData({ ...composerData, [channel.id]: !composerData[channel.id] })}
                                                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                                        composerData[channel.id]
                                                                        ? 'bg-primary/10 border-primary/30 text-primary'
                                                                        : 'bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-5">
                                                                         <channel.icon size={18} className={composerData[channel.id] ? 'text-primary' : 'text-muted-foreground'} />
                                                                         <span className="text-[10px] font-bold uppercase tracking-widest">{channel.label}</span>
                                                                     </div>
                                                                    <div className={`w-10 h-1.5 rounded-full relative transition-all ${composerData[channel.id] ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                                                        <div className={`absolute -top-1 w-3.5 h-3.5 rounded-full transition-all border-2 border-background ${composerData[channel.id] ? 'right-0 bg-primary-foreground' : 'left-0 bg-muted-foreground'}`} />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="lg:col-span-3 space-y-12">
                                                    <div className="space-y-10">
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                                                            <input
                                                                type="text"
                                                                value={composerData.title}
                                                                onChange={(e) => setComposerData({ ...composerData, title: e.target.value })}
                                                                placeholder="Enter subject..."
                                                                className="w-full px-5 py-3 bg-muted/30 border border-border/40 rounded-xl text-sm font-bold text-foreground focus:outline-none focus:border-primary/40 transition-all uppercase placeholder:text-muted-foreground tracking-tight"
                                                            />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                                                            <textarea
                                                                value={composerData.message}
                                                                onChange={(e) => setComposerData({ ...composerData, message: e.target.value })}
                                                                placeholder="Type your message here..."
                                                                rows="8"
                                                                className="w-full px-6 py-4 bg-muted/20 border border-border/40 rounded-xl text-sm font-medium text-foreground/80 focus:outline-none focus:border-primary/40 transition-all resize-none leading-relaxed placeholder:text-muted-foreground"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={sendNotification}
                                                        disabled={loading}
                                                        className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                                    >
                                                        {loading ? <div className="w-4 h-4 border-[2px] border-white/20 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
                                                        {loading ? 'Sending...' : 'Send Message'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Activity Registry Header */}
                            <div className="flex items-center justify-between border-b border-border/40 px-6 pb-2 mb-8">
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
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div layoutId="instructor-tab-bridge" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(30,120,255,0.5)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Gmail Style List */}
                             <div className="flex-1 min-h-0 mb-40">
                                <div className="bg-card/45 border border-border/40 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl">
                                    {loading && !displayNotifications.length ? (
                                        <div className="flex justify-center py-40">
                                            <div className="w-10 h-10 border-2 border-border/40 border-t-primary rounded-full animate-spin" />
                                        </div>
                                    ) : displayNotifications.length === 0 ? (
                                        <div className="py-60 text-center bg-transparent">
                                            <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center mx-auto mb-10 border border-border/40">
                                                <Bell className="text-muted-foreground opacity-40" size={24} />
                                            </div>
                                            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.8em]">Registry Null</h3>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/40">
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
                                                            isUnread ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'bg-transparent hover:bg-muted/10 opacity-75'
                                                        }`}
                                                    >
                                                        <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${isUnread ? 'bg-primary shadow-[0_0_15px_rgba(30,120,255,0.5)]' : 'bg-muted-foreground/30'}`} />
                                                        
                                                        <div className="w-48 lg:w-64 flex-shrink-0">
                                                            <span className={`text-[11px] uppercase tracking-[0.2em] truncate block ${isUnread ? 'font-black text-foreground' : 'font-bold text-muted-foreground'}`}>
                                                                {senderName}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-4">
                                                                <span className={`text-[11px] uppercase tracking-widest truncate ${isUnread ? 'font-black text-foreground' : 'font-bold text-muted-foreground'}`}>
                                                                    {notification.title}
                                                                </span>
                                                                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest truncate opacity-40 group-hover:opacity-100 transition-opacity">
                                                                    - {notification.message}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex-shrink-0 w-32 text-right">
                                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
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
                                    className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-muted/30 border border-border/40 text-muted-foreground hover:text-foreground transition-all active:scale-95 group"
                                >
                                    <X size={16} className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Close Transmission</span>
                                </button>

                                <div className="flex items-center gap-4">
                                    {activeTab === 'received' && (
                                        <button
                                            onClick={() => markAsRead(selectedNotification.id, selectedNotification.is_read)}
                                            className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-muted-foreground hover:text-primary transition-all active:scale-95"
                                        >
                                            <Mail size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(selectedNotification.id)}
                                        className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-muted-foreground hover:text-rose-500 transition-all active:scale-95"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                             {/* Detailed Message Container */}
                            <div className="bg-card/45 border border-border/40 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl p-6 lg:p-10 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                                
                                <div className="max-w-4xl mx-auto space-y-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <Send size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Detailed Briefing</p>
                                                <h2 className="text-xl lg:text-2xl font-bold text-foreground uppercase tracking-tight leading-tight">
                                                    {selectedNotification.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-border/40">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-[10px] font-black text-muted-foreground">
                                                    {(activeTab === 'received' ? (selectedNotification.data?.sender_name || 'SA') : 'YOU')[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-foreground uppercase tracking-widest">
                                                        {activeTab === 'received' ? (selectedNotification.data?.sender_name || 'Administrator') : 'Authoritative Account'}
                                                    </p>
                                                    <p className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest mt-1">
                                                        {activeTab === 'received' ? 'Distribution Hub' : 'Primary Node'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:items-end gap-1">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    {new Date(selectedNotification.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">
                                                    {new Date(selectedNotification.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-invert max-w-none pt-4">
                                        <p className="text-sm lg:text-base text-foreground/85 font-medium leading-[1.8] whitespace-pre-wrap selection:bg-primary/20 select-text">
                                            {selectedNotification.message}
                                        </p>
                                    </div>

                                    <div className="pt-12 border-t border-border/40 flex items-center justify-between">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em]">
                                            Core Hash • {selectedNotification.id.substring(0, 16).toUpperCase()}
                                        </p>
                                        <button 
                                            onClick={() => setSelectedNotification(null)}
                                            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
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
