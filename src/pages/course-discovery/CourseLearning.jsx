import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle,
  Lock,
  Clock,
  Award,
  BookOpen,
  ChevronDown,
  ArrowRight,
  Grid
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { courseService } from '../../services/jobService';
import { progressService } from '../../services/progressService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import AILoader from '../../components/ui/AILoader';
import { Shield, ShieldAlert } from 'lucide-react';

const CourseLearning = () => {
    const { courseId } = useParams();
    const { user, userRole } = useAuthContext();
    const { error: showError } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [courseProgress, setCourseProgress] = useState(null);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [lockData, setLockData] = useState({ lockedModules: {}, lockedLessons: {}, nextAvailable: null });
    
    // UI State for Carousel & Navigation
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [showJumpMenu, setShowJumpMenu] = useState(false);
    const [lockModal, setLockModal] = useState({ open: false, type: '', title: '', reason: '' });

    // Admin/Instructor Bypass Mode
    const isAdminOrInstructor = userRole === 'admin' || userRole === 'instructor';
    const [adminBypass, setAdminBypass] = useState(() => {
        return isAdminOrInstructor && localStorage.getItem('adminBypass') === 'true';
    });

    const toggleAdminBypass = () => {
        if (!isAdminOrInstructor) return;
        const newVal = !adminBypass;
        setAdminBypass(newVal);
        localStorage.setItem('adminBypass', newVal.toString());
        window.location.reload(); // Reload to safely reset all locked contexts
    };

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch Course Data
                const courseData = await courseService.getById(courseId);
                setCourse(courseData);
                
                // 2. Fetch Modules & Lessons from course_modules/course_lessons
                const { data: modulesData, error: modErr } = await supabase
                    .from('course_modules')
                    .select('*, lessons:course_lessons(*)')
                    .eq('course_id', courseId)
                    .order('sort_order', { ascending: true });

                if (modErr) throw modErr;

                const sortedModules = (modulesData || []).map(mod => ({
                    ...mod,
                    lessons: (mod.lessons || []).sort((a, b) => a.sort_order - b.sort_order)
                }));
                setModules(sortedModules);

                // 3. Fetch User Progress
                let currentCompleted = [];
                if (user) {
                    const progress = await progressService.getByCourse(courseId);
                    setCourseProgress(progress);
                    currentCompleted = progress?.completed_lessons || [];
                    setCompletedLessonIds(currentCompleted);

                    // 4. Get Lock Status
                    const status = await progressService.getLockStatus(courseId, sortedModules);
                    const finalLockData = adminBypass ? { lockedModules: {}, lockedLessons: {}, nextAvailable: null } : status;
                    setLockData(finalLockData);

                    // 5. Auto-focus module
                    if (finalLockData.nextAvailable && !adminBypass) {
                        const nextModIndex = sortedModules.findIndex(m => m.lessons.some(l => l.id === finalLockData.nextAvailable.id));
                        if (nextModIndex !== -1) setActiveModuleIndex(nextModIndex);
                    }
                } else {
                    setActiveModuleIndex(0);
                }

            } catch (err) {
                showError('Failed to load course overview');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            loadDashboard();
        }
    }, [courseId, user]);

    const activeModule = modules[activeModuleIndex];
    const allLessons = modules.flatMap(m => m.lessons);
    const completionPercentage = courseProgress?.completion_percentage || 0;

    const handleLessonClick = (lesson, moduleId) => {
        const isLocked = lockData.lockedLessons[lesson.id] || lockData.lockedModules[moduleId];
        
        if (isLocked) {
            const isWeekLocked = lockData.lockedModules[moduleId];
            setLockModal({
                open: true,
                type: 'lesson',
                title: lesson.title,
                reason: isWeekLocked 
                    ? `This module unlocks in week ${modules.findIndex(m => m.id === moduleId) + 1} of your enrollment.` 
                    : `Please complete the previous lesson first to unlock this content.`
            });
            return;
        }
        
        navigate(`/courses/${courseId}/lessons/${lesson.id}`);
    };

    const handleContinue = () => {
        if (lockData.nextAvailable) {
            navigate(`/courses/${courseId}/lessons/${lockData.nextAvailable.id}`);
        } else {
            navigate(`/courses/${courseId}/lessons/${allLessons[0]?.id}`);
        }
    };
    if (loading || !course) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] flex items-center justify-center">
                <AILoader variant="pulse" text="Securing scholar content..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] py-6 sm:py-12 px-3 sm:px-6 lg:px-8 relative pt-[calc(var(--header-height)+1rem)]">
            {/* Admin Bypass Banner */}
            {isAdminOrInstructor && (
                <div className="max-w-4xl mx-auto mb-8">
                    <div className={`p-4 rounded-2xl flex items-center justify-between border shadow-lg ${adminBypass ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${adminBypass ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500'}`}>
                                {adminBypass ? <ShieldAlert size={20} /> : <Shield size={20} />}
                            </div>
                            <div>
                                <h3 className={`text-sm font-black uppercase tracking-widest ${adminBypass ? 'text-amber-800 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>Instructor Override</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Enable full course access for review purposes. Overrides quizzes and locks.</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleAdminBypass}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminBypass ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                        >
                            {adminBypass ? 'Bypass Active' : 'Enable Bypass'}
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-24">
                
                {/* Header Navbar */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="space-y-4">
                        <Link 
                            to={`/courses/detail/${courseId}`} 
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 w-fit"
                        >
                            <ChevronLeft size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Course Detail</span>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            {course?.title}
                        </h1>
                        <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <BookOpen size={16} className="text-emerald-500" />
                            {modules.length} Modules • {allLessons.length} Lessons
                        </p>
                    </div>

                    <div className="w-full sm:w-auto bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl min-w-[280px]">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-end">
                            <span>Your Progress</span>
                            <span className="text-xl text-emerald-500">{completionPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-6">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            />
                        </div>
                        <button 
                            onClick={handleContinue}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex justify-center items-center gap-2 group"
                        >
                            {(completedLessonIds?.length || 0) === 0 ? 'Start Learning' : 'Continue Learning'} 
                            <PlayCircle size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Module Carousel Controls */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setActiveModuleIndex(prev => Math.max(0, prev - 1))}
                                disabled={activeModuleIndex === 0}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Module {activeModuleIndex + 1} of {modules.length}</span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Navigation</h2>
                            </div>
                            <button 
                                onClick={() => setActiveModuleIndex(prev => Math.min(modules.length - 1, prev + 1))}
                                disabled={activeModuleIndex === modules.length - 1}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all"
                            >
                                <ChevronDown size={20} className="-rotate-90" />
                            </button>
                        </div>

                        <button 
                            onClick={() => setShowJumpMenu(!showJumpMenu)}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5 active:scale-95"
                        >
                            Jump to Module <Grid size={14} />
                        </button>
                    </div>

                    {/* Quick Jump Menu */}
                    <AnimatePresence>
                        {showJumpMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl relative z-40"
                            >
                                {modules.map((m, idx) => {
                                    const isLocked = lockData.lockedModules[m.id];
                                    const isActive = idx === activeModuleIndex;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setActiveModuleIndex(idx);
                                                setShowJumpMenu(false);
                                            }}
                                            className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-black transition-all border ${
                                                isActive 
                                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                                    : isLocked
                                                        ? 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-300'
                                                        : 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                            }`}
                                        >
                                            {isLocked ? <Lock size={12} /> : idx + 1}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Module Carousel Slide */}
                    <AnimatePresence mode="wait">
                        {activeModule && (
                            <motion.div 
                                key={activeModule.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                            >
                                {/* Module Header */}
                                <div className="p-5 sm:p-8 lg:p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                                        <div className="flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
                                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] flex items-center justify-center font-black text-xl sm:text-2xl flex-shrink-0 transition-all duration-500 shadow-xl sm:shadow-2xl ${
                                                lockData.lockedModules[activeModule.id]
                                                ? 'bg-slate-200 dark:bg-white/5 text-slate-400 border border-transparent'
                                                : 'bg-emerald-600 text-white shadow-emerald-600/30'
                                            }`}>
                                                {lockData.lockedModules[activeModule.id] ? <Lock size={24} className="sm:w-7 sm:h-7"/> : (activeModuleIndex + 1)}
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none uppercase">
                                                    {activeModule.title}
                                                </h2>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeModule.lessons?.length || 0} Lessons</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                                                        {(activeModule.lessons || []).filter(l => completedLessonIds.includes(l.id)).length}/{activeModule.lessons?.length || 0} Completed
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {lockData.lockedModules[activeModule.id] && (
                                            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                Locked till Week {activeModuleIndex + 1}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {activeModule.description && (
                                        <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl bg-white dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                            {activeModule.description}
                                        </p>
                                    )}
                                </div>

                                {/* Lessons Feed */}
                                <div className="p-4 sm:p-8 lg:p-10 space-y-3 sm:space-y-4">
                                    {(activeModule.lessons || []).map((lesson, idx) => {
                                        const isCompleted = completedLessonIds.includes(lesson.id);
                                        const isLocked = lockData.lockedLessons[lesson.id] || lockData.lockedModules[activeModule.id];
                                        
                                        return (
                                            <motion.button
                                                key={lesson.id}
                                                onClick={() => handleLessonClick(lesson, activeModule.id)}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`w-full p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all text-left relative group/lesson ${
                                                    isLocked
                                                    ? 'bg-slate-50/50 dark:bg-white/[0.01] border-transparent opacity-60 cursor-not-allowed'
                                                    : isCompleted
                                                        ? 'bg-emerald-50/20 border-emerald-100/50 dark:bg-emerald-600/[0.01] dark:border-emerald-500/10'
                                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4 sm:gap-6">
                                                    <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg transition-all ${
                                                        isLocked
                                                        ? 'bg-slate-100 dark:bg-white/5 text-slate-300'
                                                        : isCompleted 
                                                            ? 'bg-emerald-500 text-white' 
                                                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 group-hover/lesson:bg-emerald-600 group-hover/lesson:text-white'
                                                    }`}>
                                                        {isLocked ? <Lock size={16} className="sm:w-[18px] sm:h-[18px]"/> : isCompleted ? <CheckCircle size={20} className="sm:w-[22px] sm:h-[22px]" /> : <PlayCircle size={20} className="sm:w-[22px] sm:h-[22px]" />}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-sm sm:text-base font-black tracking-tight uppercase transition-colors line-clamp-2 sm:line-clamp-none ${
                                                            isLocked ? 'text-slate-400' : isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white group-hover/lesson:text-emerald-500'
                                                        }`}>
                                                            {lesson.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                <Clock size={12} /> {lesson.duration_minutes || 0}m
                                                            </span>
                                                            {lesson.xp_reward > 0 && (
                                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <Award size={12} /> +{lesson.xp_reward} ONE COINS
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 sm:gap-3 justify-center ${
                                                    isLocked
                                                    ? 'bg-slate-100 dark:bg-white/5 text-slate-300 w-full sm:w-auto mt-2 sm:mt-0'
                                                    : isCompleted 
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 w-full sm:w-auto mt-2 sm:mt-0' 
                                                        : 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 w-full sm:w-auto mt-2 sm:mt-0'
                                                }`}>
                                                    {isLocked ? 'Locked' : isCompleted ? 'Re-Review' : 'Unlock Lesson'}
                                                    {!isLocked && !isCompleted && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Lock Status Modal */}
            <AnimatePresence>
                {lockModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setLockModal({ ...lockModal, open: false })}
                            className="absolute inset-0 bg-[#06091F]/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#0A0E27] rounded-[3rem] border border-white/5 p-10 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-xl">
                                <Lock size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">{lockModal.title}</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                                {lockModal.reason}
                            </p>
                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={handleContinue}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                                >
                                    Resuming Latest Lesson <ArrowRight size={16} />
                                </button>
                                <button 
                                    onClick={() => setLockModal({ ...lockModal, open: false })}
                                    className="w-full py-5 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Understood
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseLearning;
