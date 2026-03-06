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
      // instructors should see all their jobs/courses including drafts
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

  const markAsRead = async (id, currentStatus) => {
    try {
      if (currentStatus) return;
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      loadNotifications();
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
      loadNotifications();
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
          .in('role', ['student', 'job-seeker', 'applicant']);
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
            instructorName: profile?.name || 'Instructor'
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] relative overflow-hidden">
      {/* Elite Background Accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-6 lg:px-8 relative z-10 pb-40">
        {/* Elite Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-0.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500">Instructor Panel</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Announcements<span className="text-emerald-500 text-7xl">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button
               onClick={() => setShowComposer(!showComposer)}
               className={`px-8 py-5 rounded-[2rem] flex items-center gap-4 transition-all duration-500 shadow-2xl ${
                 showComposer 
                 ? 'bg-rose-500 text-white shadow-rose-500/20' 
                 : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
               }`}
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">{showComposer ? 'Cancel Message' : 'New Message'}</span>
              {showComposer ? <X size={18} /> : <Plus size={18} />}
            </button>
          </div>
        </div>

        {/* Composer Section */}
        <AnimatePresence>
            {showComposer && (
                <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    className="overflow-hidden mb-16"
                >
                    <div className="bg-white dark:bg-[#0f1429] rounded-[3rem] border border-slate-100 dark:border-white/5 p-10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-all" />
                        
                        <div className="relative z-10 grid lg:grid-cols-5 gap-12">
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Target Audience</label>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { id: 'all-students', label: 'All Students', icon: Users },
                                            { id: 'course', label: 'By Course', icon: BookOpen }
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setComposerData({ ...composerData, targetType: t.id })}
                                                className={`px-6 py-3 rounded-xl border flex items-center gap-3 transition-all ${
                                                    composerData.targetType === t.id
                                                    ? 'bg-white text-black border-white shadow-xl'
                                                    : 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-slate-400'
                                                }`}
                                            >
                                                <t.icon size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
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
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700 transition-colors group-focus-within:text-emerald-500" />
                                                <input 
                                                    type="text"
                                                    placeholder="Search your courses..."
                                                    value={courseSearch}
                                                    onChange={(e) => setCourseSearch(e.target.value)}
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-[10px] font-bold text-white placeholder-slate-800 transition-all focus:border-emerald-500/20 outline-none uppercase"
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 p-1">
                                                {filteredCourses.length > 0 ? filteredCourses.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setComposerData({ ...composerData, courseId: c.id })}
                                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                                                            composerData.courseId === c.id
                                                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg'
                                                            : 'bg-white/[0.02] border-white/5 text-slate-500 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    >
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-tight truncate">{c.title}</p>
                                                            <p className={`text-[8px] uppercase tracking-widest font-bold mt-1 ${composerData.courseId === c.id ? 'text-white/60' : 'text-slate-800'}`}>
                                                                Status: {c.status || 'Active'}
                                                            </p>
                                                        </div>
                                                        {composerData.courseId === c.id && <CheckCircle size={14} />}
                                                    </button>
                                                )) : (
                                                    <div className="text-center py-4 border border-dashed border-white/5 rounded-xl">
                                                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">No matching courses</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Delivery Channels</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'sendInApp', label: 'Platform Notification', icon: Bell },
                                            { id: 'sendEmail', label: 'Email Broadcast', icon: Mail },
                                            { id: 'sendSMS', label: 'SMS Blast', icon: Send }
                                        ].map(channel => (
                                            <button
                                                key={channel.id}
                                                onClick={() => setComposerData({ ...composerData, [channel.id]: !composerData[channel.id] })}
                                                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                    composerData[channel.id]
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                                    : 'bg-white/[0.01] border-white/5 text-slate-700 hover:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <channel.icon size={16} className={composerData[channel.id] ? 'text-emerald-500' : 'text-slate-800'} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{channel.label}</span>
                                                </div>
                                                <div className={`w-8 h-4 rounded-full relative transition-all ${composerData[channel.id] ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${composerData[channel.id] ? 'right-0.5' : 'left-0.5'}`} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-3 space-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            value={composerData.title}
                                            onChange={(e) => setComposerData({ ...composerData, title: e.target.value })}
                                            placeholder="Annoucement Heading..."
                                            className="w-full px-8 py-6 bg-white/[0.02] border border-white/5 rounded-2xl text-xl font-black text-white focus:outline-none focus:border-emerald-500/20 transition-all uppercase placeholder:text-slate-900 tracking-tight"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Message Detail</label>
                                        <textarea
                                            value={composerData.message}
                                            onChange={(e) => setComposerData({ ...composerData, message: e.target.value })}
                                            placeholder="Compose your scholarship update here..."
                                            rows="10"
                                            className="w-full px-8 py-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] text-sm font-medium text-slate-400 focus:outline-none focus:border-emerald-500/20 transition-all resize-none leading-relaxed placeholder:text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 pt-4">
                                    <button
                                        onClick={sendNotification}
                                        disabled={loading}
                                        className="flex-1 bg-white text-black py-7 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-emerald-500 hover:text-white transition-all shadow-3xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                                    >
                                        {loading ? (
                                             <div className="w-5 h-5 border-[3px] border-black/10 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <Send size={18} />
                                        )}
                                        {loading ? 'Processing...' : 'Broadcast Transmission'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Activity Registry */}
        <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 px-4">
                <div className="flex gap-14">
                    {[
                        { id: 'received', label: 'Inbox' },
                        { id: 'sent', label: 'Broadcasts' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${
                                activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-slate-700 hover:text-slate-400'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="instructor-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-500" />
                            )}
                        </button>
                    ))}
                </div>
                
                {unreadCount > 0 && activeTab === 'received' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/10">
                        {unreadCount} New
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {loading && !displayNotifications.length ? (
                    <div className="flex justify-center py-32">
                        <div className="w-10 h-10 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : displayNotifications.length === 0 ? (
                    <div className="text-center py-48 bg-white/[0.01] border border-dashed border-white/5 rounded-[4rem]">
                        <Bell className="mx-auto mb-10 text-slate-800 opacity-20" size={80} />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-800">No active records</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence mode='popLayout'>
                            {displayNotifications.map((notification, idx) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, scale: 0.99, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ delay: idx * 0.02 }}
                                >
                                    <div 
                                        className={`group p-10 rounded-[3rem] border transition-all duration-500 ${
                                            notification.is_read && activeTab === 'received'
                                            ? 'bg-transparent border-white/5 opacity-40 grayscale' 
                                            : 'bg-white/[0.01] border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.02] shadow-2xl shadow-black/20'
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-5 mb-5">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${(!notification.is_read && activeTab === 'received') ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-slate-800'}`} />
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-emerald-400 transition-colors">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-base text-slate-500 font-medium leading-relaxed line-clamp-2 max-w-5xl group-hover:text-slate-300 transition-colors">
                                                    {notification.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                {activeTab === 'received' && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id, notification.is_read)}
                                                        className={`p-6 rounded-2xl border transition-all ${
                                                            notification.is_read 
                                                            ? 'bg-white/5 border-white/5 text-slate-600' 
                                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                                                        }`}
                                                        title={notification.is_read ? 'Keep unread' : 'Mark as read'}
                                                    >
                                                        {notification.is_read ? <Mail size={20} /> : <MailOpen size={20} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-6 bg-white/5 border border-white/5 text-slate-600 hover:text-rose-500 rounded-2xl transition-all"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 size={20} />
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
      </div>
    </div>
  );
};

export default InstructorNotifications;
