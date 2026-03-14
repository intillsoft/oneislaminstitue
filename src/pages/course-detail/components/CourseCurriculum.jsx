import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Play,
  FileText,
  HelpCircle,
  ClipboardList,
  Lock,
  Eye,
  Clock,
  Sparkles,
  BookOpen,
  X,
  Send,
  Loader2,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { aiService } from '../../../services/aiService';
import { progressService } from '../../../services/progressService';

const contentTypeIcon = {
  video: Play,
  text: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
};

const CourseCurriculum = ({ courseId, courseTitle }) => {
  const { user } = useAuthContext();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiHistory, setAiHistory] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCurriculum();
      if (user) fetchProgress();
    }
  }, [courseId, user]);

  const fetchProgress = async () => {
    try {
      // Use the unified study_progress view via progressService so
      // curriculum completion states match the main learning UI.
      const progress = await progressService.getByCourse(courseId);
      setCompletedLessonIds(progress?.completed_lessons || []);
    } catch (err) {
      console.warn('Failed to fetch progress for curriculum view:', err);
    }
  };

  const fetchCurriculum = async () => {
    try {
      setLoading(true);

      const { data: modulesData, error: modErr } = await supabase
        .from('course_modules')
        .select('*, lessons:course_lessons(*)')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true });

      if (modErr) throw modErr;

      if (!modulesData || modulesData.length === 0) {
        setModules([]);
        return;
      }

      const enriched = modulesData.map(mod => ({
        ...mod,
        lessons: (mod.lessons || []).sort((a, b) => a.sort_order - b.sort_order),
      }));

      setModules(enriched);
      if (enriched.length > 0) {
        setExpandedModules({ [enriched[0].id]: true });
      }
    } catch (err) {
      console.error('Failed to load curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;
    const question = aiQuery.trim();
    setAiQuery('');
    setAiLoading(true);

    const newHistory = [...aiHistory, { role: 'user', content: question }];
    setAiHistory(newHistory);

    try {
      const moduleSummary = modules.map(m => 
        `Module: ${m.title}${m.description ? ` — ${m.description}` : ''}. Lessons: ${m.lessons.map(l => l.title).join(', ')}`
      ).join('. ');

      const contextMessage = `You are an AI course advisor for the course "${courseTitle}". Here is the curriculum structure: ${moduleSummary || 'No modules have been added yet.'}. The student asks: ${question}`;

      const result = await aiService.chatWithAdvisor(contextMessage, newHistory.slice(-6));

      const reply = result?.reply || result?.message || result?.response || 'I can help you understand this course better. Please try asking a specific question about the modules or topics covered.';

      setAiResponse(reply);
      setAiHistory([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      const fallback = 'Sorry, AI insights are temporarily unavailable. Please try again later.';
      setAiResponse(fallback);
      setAiHistory([...newHistory, { role: 'assistant', content: fallback }]);
    } finally {
      setAiLoading(false);
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const totalDuration = modules.reduce((sum, m) => 
    sum + (m.lessons || []).reduce((s, l) => s + (l.duration_minutes || 0), 0), 0
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-md border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="py-8 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center px-4">
          <BookOpen className="w-9 h-9 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Curriculum coming soon</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">The modules and lessons for this course are currently being finalized.</p>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Course Curriculum</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {modules.length} module{modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
            {totalDuration > 0 && ` · ${Math.round(totalDuration / 60)}h ${totalDuration % 60}m`}
          </p>
        </div>

        {/* Ask AI Button */}
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:opacity-95 transition-colors"
        >
          <Sparkles size={14} />
          Ask AI
        </button>
      </div>

      {/* AI Panel */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-100 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-sm bg-violet-600 flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Course Advisor</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Ask about topics, difficulty, or what you'll learn</p>
                  </div>
                </div>
                <button onClick={() => setAiOpen(false)} className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors">
                  <X size={14} className="text-slate-400" />
                </button>
              </div>

              {/* Chat History */}
              {aiHistory.length > 0 && (
                <div className="mb-3 max-h-52 overflow-y-auto space-y-3 pr-1">
                  {aiHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-md text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-violet-600 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-md">
                        <Loader2 size={16} className="text-violet-500 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskAI()}
                  placeholder="e.g. What will I learn in Module 2?"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-800/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  disabled={aiLoading}
                />
                <button
                  onClick={handleAskAI}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="p-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((mod, mIndex) => {
          const isExpanded = expandedModules[mod.id];
          const lessonCount = mod.lessons?.length || 0;
          const modDuration = (mod.lessons || []).reduce((s, l) => s + (l.duration_minutes || 0), 0);

          return (
            <div
              key={mod.id}
              className="bg-white dark:bg-slate-900 rounded-md border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between p-4 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-sm bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-semibold flex-shrink-0">
                    {mIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors break-words">
                      {mod.title}
                    </h3>
                    {mod.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:block">
                    {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                    {modDuration > 0 && ` · ${modDuration}m`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Lessons */}
              <AnimatePresence>
                {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-slate-100 dark:border-slate-800">
                      {mod.lessons.map((lesson, lIndex) => {
                        const LessonIcon = contentTypeIcon[lesson.content_type] || FileText;

                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/lesson"
                          >
                            {/* Icon */}
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                              <LessonIcon size={13} className="text-slate-400 dark:text-slate-500" />
                            </div>

                            {/* Title & Description */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                                  {lesson.title}
                                </span>
                                {lesson.is_free_preview && (
                                  <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider rounded-md border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1 flex-shrink-0">
                                    <Eye size={9} /> Preview
                                  </span>
                                )}
                                {completedLessonIds.includes(lesson.id) && (
                                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest ml-auto px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                                    <CheckCircle size={10} className="stroke-[3px]" />
                                    Done
                                  </div>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{lesson.description}</p>
                              )}
                            </div>

                            {/* Duration */}
                            {lesson.duration_minutes > 0 && (
                              <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 flex-shrink-0">
                                <Clock size={11} /> {lesson.duration_minutes}m
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CourseCurriculum;
