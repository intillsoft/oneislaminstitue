/**
 * Notification Compose Panel for Admins/Instructors
 * Send custom notifications to students or specific users
 */

import React, { useState, useEffect } from 'react';
import { Send, X, AlertCircle, CheckCircle, Search, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { courseService } from '@/services/jobService';

interface ComposePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  company?: string;
}

type TargetType = 'all' | 'specific' | 'course';
type NotificationType = 'general' | 'announcement' | 'alert' | 'welcome';

export const NotificationComposePanel: React.FC<ComposePanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<TargetType>('all');
  const [notificationType, setNotificationType] = useState<NotificationType>('general');
  const [sendInApp, setSendInApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [courseId, setCourseId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message_status, setMessageStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Fetch available users (Students)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('id, email')
          .or('role.eq.student,role.eq.job-seeker')
          .ilike('email', `%${userSearch}%`)
          .limit(50);
        
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isOpen && targetType === 'specific') {
      fetchUsers();
    }
  }, [isOpen, targetType, userSearch]);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseService.getAll({ 
          search: courseSearch,
          pageSize: 50 
        });
        
        if (data) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    if (isOpen && targetType === 'course') {
      fetchCourses();
    }
  }, [isOpen, targetType, courseSearch]);

  const getTargetUserIds = async () => {
    if (targetType === 'specific') {
      return selectedUsers;
    }

    if (targetType === 'course') {
      // Fetch all students enrolled in the course
      const { data } = await supabase
        .from('applications')
        .select('user_id')
        .eq('job_id', courseId)
        .eq('status', 'enrolled');
      
      return data?.map((app) => app.user_id) || [];
    }

    // targetType === 'all'
    const { data } = await supabase
      .from('users')
      .select('id')
      .or('role.eq.student,role.eq.job-seeker');
    
    return data?.map((u) => u.id) || [];
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessageStatus(null);

    if (!title.trim() || !message.trim()) {
      setMessageStatus({ type: 'error', text: 'Payload incomplete' });
      return;
    }

    if (!sendInApp && !sendEmail && !sendSMS) {
      setMessageStatus({ type: 'error', text: 'Select at least one channel' });
      return;
    }

    if (targetType === 'specific' && selectedUsers.length === 0) {
      setMessageStatus({ type: 'error', text: 'No recipients selected' });
      return;
    }

    if (targetType === 'course' && !courseId) {
      setMessageStatus({ type: 'error', text: 'Select target sector' });
      return;
    }

    try {
      setIsLoading(true);
      const userIds = await getTargetUserIds();

      if (userIds.length === 0) {
        setMessageStatus({ type: 'error', text: 'Sector empty - no users detected' });
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
          title,
          message,
          type: notificationType,
          sendInApp,
          sendEmail,
          sendSMS,
          data: {
            targetType,
            courseId: courseId || null,
          },
        }),
      });

      if (response.ok) {
        setMessageStatus({ 
          type: 'success', 
          text: `Success: Syncing with ${userIds.length} users.` 
        });
        
        setTimeout(() => {
          setTitle('');
          setMessage('');
          setSelectedUsers([]);
          setCourseId('');
          setSendInApp(true);
          setSendEmail(false);
          setSendSMS(false);
          setMessageStatus(null);
          onClose();
        }, 2000);
      } else {
        const err = await response.json();
        setMessageStatus({ type: 'error', text: err.error || 'System sync failed' });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessageStatus({ type: 'error', text: 'Critical system error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0c0c0e]/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#121214] border border-white/5 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-10 border-b border-white/5 bg-white/[0.01]">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">New Message<span className="text-emerald-500">.</span></h2>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">Platform Communication</p>
          </div>
          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-10 space-y-10 overflow-y-auto custom-scrollbar bg-black/20">
          {/* Status Overlay */}
          <AnimatePresence>
            {message_status && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-4 p-6 rounded-3xl border mb-4 ${
                  message_status.type === 'success'
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                    : 'bg-rose-500/5 border-rose-500/20 text-rose-500'
                }`}
              >
                {message_status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{message_status.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Subject</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Message Subject..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white placeholder-slate-900 focus:outline-none focus:border-emerald-500/20 transition-all font-black uppercase text-xs tracking-wider"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 text-white placeholder-slate-900 focus:outline-none focus:border-emerald-500/20 transition-all font-medium text-sm leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Configuration Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Recipients</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Students' },
                  { id: 'specific', label: 'Pick Individual' },
                  { id: 'course', label: 'By Course' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTargetType(type.id as TargetType)}
                    className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      targetType === type.id
                        ? 'bg-white text-black border-white shadow-xl shadow-white/5'
                        : 'bg-white/5 border-white/5 text-slate-700 hover:text-slate-500'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Category</label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value as NotificationType)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/20 transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
              >
                <option value="general">General</option>
                <option value="announcement">Announcement</option>
                <option value="alert">Important</option>
                <option value="welcome">Welcome</option>
              </select>
            </div>
          </div>

          {/* Selector Overlay */}
          <AnimatePresence>
            {targetType !== 'all' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-white/5"
              >
                {targetType === 'specific' && (
                  <div className="space-y-5">
                    <div className="relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 transition-colors group-focus-within:text-emerald-500" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search by email..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-white text-[10px] font-bold uppercase tracking-widest placeholder-slate-900 focus:outline-none focus:border-emerald-500/20 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-black/40 rounded-3xl border border-white/5 custom-scrollbar">
                      {users.length > 0 ? users.map((u) => (
                        <button 
                          key={u.id}
                          type="button" 
                          onClick={() => {
                            if (selectedUsers.includes(u.id)) {
                              setSelectedUsers(selectedUsers.filter(id => id !== u.id));
                            } else {
                              setSelectedUsers([...selectedUsers, u.id]);
                            }
                          }}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                            selectedUsers.includes(u.id) 
                            ? 'bg-white border-white text-black shadow-lg shadow-white/5' 
                            : 'bg-white/5 border-transparent text-slate-600 hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                            selectedUsers.includes(u.id) ? 'bg-black' : 'bg-slate-900 border border-slate-800'
                          }`}>
                            {selectedUsers.includes(u.id) && <CheckCircle size={10} className="text-white" />}
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-tight truncate">{u.email}</span>
                        </button>
                      )) : (
                        <p className="col-span-full text-center py-8 text-[9px] text-slate-900 uppercase font-black tracking-[0.4em]">No users found</p>
                      )}
                    </div>
                  </div>
                )}

                {targetType === 'course' && (
                  <div className="space-y-5">
                    <div className="grid gap-3 max-h-48 overflow-y-auto p-4 bg-black/40 rounded-3xl border border-white/5 custom-scrollbar">
                      {courses.length > 0 ? courses.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCourseId(c.id)}
                          className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all ${
                            courseId === c.id 
                            ? 'bg-white text-black border-white shadow-xl' 
                            : 'bg-white/5 border-transparent text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-tight">{c.title}</p>
                            <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest mt-1">Course ID: {c.id.substring(0, 8)}</p>
                          </div>
                          {courseId === c.id && <CheckCircle size={16} className="text-black" />}
                        </button>
                      )) : (
                        <p className="text-center py-8 text-[9px] text-slate-900 uppercase font-black tracking-[0.4em]">No courses found</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delivery Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-y border-white/5">
                {[
                    { id: 'inapp', label: 'App Only', state: sendInApp, setter: setSendInApp },
                    { id: 'email', label: 'Send Email', state: sendEmail, setter: setSendEmail },
                    { id: 'sms', label: 'Send SMS', state: sendSMS, setter: setSendSMS }
                ].map(channel => (
                    <button
                        key={channel.id}
                        type="button"
                        onClick={() => channel.setter(!channel.state)}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${
                            channel.state 
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/10' 
                            : 'bg-white/5 border-white/10 text-slate-900 hover:text-slate-700 hover:border-white/20'
                        }`}
                    >
                        <CheckCircle className={`w-5 h-5 transition-all ${channel.state ? 'scale-110' : 'opacity-20 translate-y-1'}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{channel.label}</span>
                    </button>
                ))}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-6">
            <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-12 py-5 rounded-2xl text-slate-800 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em]"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-16 py-6 rounded-[2rem] bg-white text-black hover:bg-emerald-500 hover:text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.4em]"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-[3px] border-black/10 border-t-black rounded-full animate-spin" />
                ) : (
                    <Send className="w-4 h-4" />
                )}
                {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NotificationComposePanel;

