/**
 * Class Schedule Page
 * Weekly calendar/agenda view with AI preparation tips
 * Style: Elite Dashboard Pattern
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Video, FileText, CheckSquare, BookOpen,
  Users, Sparkles, Brain, MapPin, Lightbulb, AlertTriangle, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scheduleService } from '../../services/scheduleService';
import { useAuthContext } from '../../contexts/AuthContext';
import { ElitePageHeader, EliteCard, EliteStatCard } from '../../components/ui/EliteCard';
import AILoader from '../../components/ui/AILoader';

const EVENT_CONFIG = {
  lesson: { icon: BookOpen, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20', label: 'Lesson' },
  live_session: { icon: Video, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', label: 'Live Session' },
  assignment_due: { icon: FileText, color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/20', label: 'Assignment' },
  quiz: { icon: CheckSquare, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-500/20', label: 'Quiz' },
  exam: { icon: AlertTriangle, color: 'from-red-500 to-rose-600', bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20', label: 'Exam' },
  office_hours: { icon: Users, color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-500/20', label: 'Office Hours' },
  workshop: { icon: Zap, color: 'from-amber-500 to-yellow-600', bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', label: 'Workshop' },
};

const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDate = (iso) => new Date(iso).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();
const isTomorrow = (iso) => {
  const t = new Date(); t.setDate(t.getDate() + 1);
  return new Date(iso).toDateString() === t.toDateString();
};

const EventCard = ({ event, index, onPrepTips }) => {
  const config = EVENT_CONFIG[event.event_type] || EVENT_CONFIG.lesson;
  const Icon = config.icon;
  const today = isToday(event.start_time);
  const tomorrow = isTomorrow(event.start_time);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
    >
        <EliteCard className={`p-0 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 ${today ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : ''}`}>
             <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.color || 'from-slate-400 to-slate-500'}`}/>
             
             <div className="p-5 pl-7">
                {(today || tomorrow) && (
                    <div className="absolute top-4 right-4">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg ${
                            today ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-blue-500 text-white shadow-blue-500/20'
                        }`}>
                            {today ? 'Today' : 'Tomorrow'}
                        </span>
                    </div>
                )}

                <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon size={18} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="mb-1">
                            <h3 className="text-sm font-bold text-text-primary truncate">{event.title}</h3>
                            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{event.course?.title || 'Course Event'}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                             <span className="flex items-center gap-1.5 font-bold text-text-primary px-2 py-1 rounded-lg bg-surface-elevated border border-border">
                                <Clock size={12} className="text-text-muted" />
                                {formatTime(event.start_time)} - {formatTime(event.end_time)}
                            </span>
                            {/* Only show date if grouping header isn't enough, but usually nice to have */}
                            <span className="flex items-center gap-1.5 text-text-muted">
                                <Calendar size={12} />
                                {formatDate(event.start_time)}
                            </span>
                            {event.location && (
                                <span className="flex items-center gap-1.5 text-text-muted">
                                    <MapPin size={12} />
                                    {event.location}
                                </span>
                            )}
                        </div>
                        
                         {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                            {event.meeting_url && (
                                <a href={event.meeting_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                                    <Video size={11} /> Join Class
                                </a>
                            )}
                            <button onClick={() => onPrepTips(event)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-600 text-[10px] font-black uppercase tracking-wider hover:bg-violet-500/20 transition-all border border-violet-500/20 group-hover:border-violet-500/40">
                                <Sparkles size={11} /> AI Prep Tips
                            </button>
                             <div className="ml-auto">
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                                    {config.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </EliteCard>
    </motion.div>
  );
};

const PrepTipsModal = ({ event, onClose }) => {
  if (!event) return null;
  const prep = scheduleService.generateAIPrep(event);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()} className="bg-surface border border-border rounded-2xl p-0 max-w-lg w-full shadow-2xl overflow-hidden">
        
        <div className="p-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-black uppercase tracking-tight">AI Preparation Guide</h2>
                    <p className="text-white/80 text-xs font-medium">{event.title}</p>
                </div>
             </div>
        </div>

        <div className="p-6 bg-bg">
             <div className="flex items-center gap-4 mb-6">
                 <div className="flex-1 p-3 rounded-xl bg-surface border border-border flex items-center gap-3">
                     <span className="text-2xl">{prep.icon}</span>
                     <div>
                         <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Prep Time</p>
                         <p className="text-sm font-black text-text-primary">{prep.estimatedPrepTime} min</p>
                     </div>
                 </div>
                 <div className="flex-1 p-3 rounded-xl bg-surface border border-border flex items-center gap-3">
                     <span className="text-2xl">⚡</span>
                     <div>
                         <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Difficulty</p>
                         <p className="text-sm font-black text-text-primary capitalize">{prep.difficulty}</p>
                     </div>
                 </div>
             </div>

             <div className="space-y-4 mb-6">
                <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Recommended Steps</p>
                    <ul className="space-y-2">
                        {prep.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                <Lightbulb size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {prep.customTip && (
                    <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Brain size={12} className="text-violet-500" />
                            <span className="text-[9px] font-bold text-violet-500 uppercase tracking-widest">AI Custom Insight</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{prep.customTip}</p>
                    </div>
                )}
             </div>

             <button onClick={onClose} className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                Mark as Prepared
             </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ClassSchedule = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('agenda');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const scheduleRes = await scheduleService.getMySchedule();
      const evts = scheduleRes || [];
      
      // No mock fallback
      setEvents(evts);
      
      const todayEvts = evts.filter(e => isToday(e.start_time));
      setDailySummary(scheduleService.generateDailySummary(todayEvts, evts));
      
    } catch (error) {
      console.error("Failed to load schedule", error);
      setEvents([]);
      setDailySummary(null);
    } finally {
      setLoading(false);
    }
  };

  const groupedEvents = useMemo(() => {
    const groups = {};
    events.forEach(ev => {
      const dateKey = new Date(ev.start_time).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(ev);
    });
    Object.keys(groups).forEach(k => groups[k].sort((a, b) => new Date(a.start_time) - new Date(b.start_time)));
    return Object.entries(groups).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }, [events]);

  const todayCount = events.filter(e => isToday(e.start_time)).length;
  const urgentCount = events.filter(e => (e.event_type === 'assignment_due' || e.event_type === 'quiz' || e.event_type === 'exam') && new Date(e.start_time) > new Date()).length;
  const liveCount = events.filter(e => e.event_type === 'live_session').length;

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-32">
        <AILoader variant="neural" text="Syncing Schedule..." />
     </div>
  );

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto py-8">

        <ElitePageHeader
            title="Class Schedule"
            subtitle="Your academic agenda, deadlines, and live sessions."
            badge="Agenda"
        >
             <div className="flex items-center gap-2 mt-6">
                {['agenda'].map(v => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-surface text-text-muted hover:text-text-primary border border-border hover:bg-surface-elevated'}`}>
                    {v}
                  </button>
                ))}
            </div>
        </ElitePageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <EliteStatCard
                label="Today's Events"
                value={todayCount}
                icon={Calendar}
                color="green"
            />
            <EliteStatCard
                label="Deadlines"
                value={urgentCount}
                icon={AlertTriangle}
                color="red"
            />
             <EliteStatCard
                label="Live Sessions"
                value={liveCount}
                icon={Video}
                color="blue"
            />
        </div>

        {dailySummary && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <EliteCard className={`
                    ${dailySummary.priority === 'high' ? 'bg-gradient-to-r from-red-500/5 to-orange-500/5 border-orange-500/20' : 
                      dailySummary.priority === 'medium' ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-500/20' : 
                      'bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/20'}
                `}>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
                            <Brain size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-black text-text-primary">{dailySummary.greeting}</h3>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">AI BRIEFING</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-3 max-w-2xl">{dailySummary.message}</p>
                            
                            <div className="flex flex-wrap gap-2">
                                {dailySummary.actionItems.map((item, i) => (
                                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[10px] font-bold text-text-secondary">
                                        <Lightbulb size={10} className="text-amber-500" /> {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </EliteCard>
             </motion.div>
        )}

        <div className="space-y-6">
            {events.length > 0 ? (
                groupedEvents.map(([dateKey, dayEvents], gi) => (
                    <motion.div key={dateKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}>
                        <div className="flex items-center gap-3 mb-4 pl-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${isToday(dayEvents[0].start_time) ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-text-muted/30'}`} />
                            <h2 className={`text-sm font-black uppercase tracking-widest ${isToday(dayEvents[0].start_time) ? 'text-emerald-600' : 'text-text-muted'}`}>
                                {isToday(dayEvents[0].start_time) ? 'Today' : isTomorrow(dayEvents[0].start_time) ? 'Tomorrow' : formatDate(dayEvents[0].start_time)}
                            </h2>
                            <div className="flex-1 h-px bg-border/50" />
                        </div>
                        
                        <div className="space-y-4">
                            {dayEvents.map((event, i) => (
                                <EventCard key={event.id} event={event} index={i} onPrepTips={setSelectedEvent} />
                            ))}
                        </div>
                    </motion.div>
                ))
            ) : (
                <EliteCard className="text-center py-20 dashed-border">
                    <Calendar size={48} className="text-text-muted/20 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-text-primary mb-2">Schedule is Clear</h3>
                    <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
                        No upcoming classes or deadlines found. This is a great time to browse new courses or review past material.
                    </p>
                    <button onClick={() => navigate('/courses')} className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30">
                        Explore Courses
                    </button>
                </EliteCard>
            )}
        </div>

      </div>

      <AnimatePresence>
        {selectedEvent && <PrepTipsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default ClassSchedule;
