import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  PlayCircle, 
  BookOpen, 
  Award,
  Clock,
  Menu,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
  Trophy,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { courseService } from '../../services/jobService';
import { progressService } from '../../services/progressService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { EliteCard } from '../../components/ui/EliteCard';
import Icon from '../../components/AppIcon';
import LessonBlockRenderer from './components/LessonBlockRenderer';
import FloatingLessonAssistants from './components/FloatingLessonAssistants';
import LessonSidebar from './components/LessonSidebar';
import AILoader from '../../components/ui/AILoader';
import LessonBlockBuilder from '../course-management/components/LessonBlockBuilder';

const CompletionModal = ({ isOpen, type, coins, onNext }) => {
    if (!isOpen) return null;

    const isModule = type === 'module';
    const isCourse = type === 'course';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-white dark:bg-[#0A0E27] rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-emerald-500/20 shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            {isCourse || isModule ? <Trophy size={32} className="text-white" /> : <Award size={32} className="text-white" />}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left space-y-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">
                            {isCourse ? 'Course Certified' : isModule ? 'Module Mastered' : 'Lesson Mastered'}
                        </span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Well done, Scholar
                        </h2>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {isCourse 
                                ? "You have officially completed the curriculum for this course."
                                : "Your progress has been synchronized with the scholarly archives."
                            }
                        </p>
                    </div>

                    {/* Rewards & Action */}
                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                        {coins > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <Zap size={14} className="text-emerald-500 fill-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600">+{coins} COINS</span>
                            </div>
                        )}
                        <button 
                            onClick={onNext}
                            className="group flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                        >
                            Continue <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
                
                {/* Auto-timer progress bar at the bottom */}
                <div className="absolute bottom-0 left-0 h-1 bg-emerald-600/10 w-full">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: (isModule || isCourse ? 6 : 4), ease: "linear" }}
                        className="h-full bg-emerald-600"
                    />
                </div>
            </motion.div>
        </div>
    );
};

const LessonView = () => {
    const { courseId, lessonId } = useParams();
    const { user, userRole, baseRole } = useAuthContext();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [courseProgress, setCourseProgress] = useState(null);
    const [completing, setCompleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [passedQuizzes, setPassedQuizzes] = useState(new Set());
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [rewardTimer, setRewardTimer] = useState(null);
    const [lockData, setLockData] = useState({ lockedModules: {}, lockedLessons: {}, nextAvailable: null });
    const [isEditing, setIsEditing] = useState(false);
    const [draftBlocks, setDraftBlocks] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [editHistory, setEditHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    const baseRoleLower = baseRole?.toLowerCase() || '';
    const isAdminOrInstructor = baseRoleLower === 'admin' || baseRoleLower === 'instructor';
    const adminBypass = isAdminOrInstructor && localStorage.getItem('adminBypass') === 'true';

    const lastActivityLoggedRef = React.useRef(null);
    const scrollContainerRef = React.useRef(null);

    // Scroll to top when lesson changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo(0, 0);
        }
        window.scrollTo(0, 0);
        setCurrentPage(1);
    }, [lessonId]);

    useEffect(() => {
        const loadLessonData = async () => {
            try {
                // Only show full loading spinner if we don't have data yet
                if (!course || !activeLesson) {
                    setLoading(true);
                }
                
                // 1. Fetch Course
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

                // 3. Fetch user progress
                let progress = null;
                if (user) {
                    progress = await progressService.getByCourse(courseId);
                    setCourseProgress(prev => {
                        if (!prev) return progress;
                        const prevLastActivity = prev.last_activity_at ? new Date(prev.last_activity_at).getTime() : 0;
                        const newLastActivity = progress?.last_activity_at ? new Date(progress.last_activity_at).getTime() : 0;
                        if (newLastActivity >= prevLastActivity) return progress;
                        return prev;
                    });
                }

                // 4. Check for LOCKS (Crucial for sequential/weekly logic)
                const status = await progressService.getLockStatus(courseId, sortedModules);
                const finalLockData = adminBypass ? { lockedModules: {}, lockedLessons: {}, nextAvailable: null, isStudent: false } : status;
                setLockData(finalLockData);

                // 5. Flatten lessons to find active
                const allLessons = sortedModules.flatMap(m => m.lessons);
                
                if (allLessons.length > 0) {
                    const currentLesson = allLessons.find(l => l.id === lessonId) || allLessons[0];
                    
                    // Verify if lesson is locked (bypass for non-students or admin overrides)
                    if (!adminBypass && finalLockData.isStudent && finalLockData.lockedLessons[currentLesson.id]) {
                        showError("You haven't unlocked this lesson yet. Redirecting...");
                        // Navigate back or to the last available lesson
                        navigate(`/courses/${courseId}/learn`, { replace: true });
                        return;
                    }

                    setActiveLesson(currentLesson);
                    
                    if (!lessonId || lessonId !== currentLesson.id) {
                        navigate(`/courses/${courseId}/lessons/${currentLesson.id}`, { replace: true });
                    }
                }

                // Reset passed quizzes when lesson data is loaded/changed
                setPassedQuizzes(new Set());

            } catch (err) {
                showError('Failed to load learning environment');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            // Don't refetch progress if we just updated it locally (prevents flicker/vanishing)
            if (!completing) {
                loadLessonData();
            } else {
                // Still load course/modules but skip progress if already set
                const loadMetadata = async () => {
                    const courseData = await courseService.getById(courseId);
                    setCourse(courseData);
                    const { data: mods } = await supabase.from('course_modules').select('*, lessons:course_lessons(*)').eq('course_id', courseId).order('sort_order', { ascending: true });
                    setModules((mods || []).map(mod => ({ ...mod, lessons: (mod.lessons || []).sort((a, b) => a.sort_order - b.sort_order) })));
                };
                loadMetadata();
            }
        }

        // Handle resize for sidebar
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [courseId, lessonId, user?.id]);

    // Log lesson view activity
    useEffect(() => {
        // Prevent race condition: don't log "view" if we've already logged completion for this lesson,
        // or if we're currently in the middle of a completion log.
        if (user && activeLesson && lastActivityLoggedRef.current !== activeLesson.id && !completing) {
            lastActivityLoggedRef.current = activeLesson.id;
            // Note: minutes=0 means just a 'heartbeat' / 'view'
            progressService.logActivity(courseId, 0, null).catch(err => {
                console.warn('Failed to log lesson view activity:', err);
                lastActivityLoggedRef.current = null; // Allow retry if it failed
            });
        }
    }, [activeLesson?.id, user?.id, completing]);

    // Flattened array for Next/Prev logic
    const allLessons = modules.flatMap(m => m.lessons);
    const activeLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
    const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
    const nextLesson = activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;

    const isModuleLastLesson = activeLessonIndex >= 0 && (!nextLesson || nextLesson.module_id !== activeLesson.module_id);
    const isCourseLastLesson = activeLessonIndex >= 0 && !nextLesson;
    const completionType = isCourseLastLesson ? 'course' : isModuleLastLesson ? 'module' : 'lesson';
    
    // Check completion states
    const completedLessonIds = Array.isArray(courseProgress?.completed_lessons) 
        ? courseProgress.completed_lessons 
        : [];
    const isAlreadyCompleted = activeLesson && completedLessonIds.includes(activeLesson.id);
    
    // Identify all quiz blocks in the lesson
    const quizBlocks = activeLesson?.content_blocks?.filter(b => b.type === 'quiz') || [];
    const totalRequiredQuizzes = quizBlocks.length;
    const passedQuizzesCount = passedQuizzes.size;
    
    
    // Ensure button is disabled if not all quizzes passed, but if already completed, it's never disabled
    const isCompleteButtonDisabled = completing || (!adminBypass && !isAlreadyCompleted && totalRequiredQuizzes > 0 && passedQuizzesCount < totalRequiredQuizzes);

    const hasPages = activeLesson?.content_data?.pages && Array.isArray(activeLesson.content_data.pages);
    const pages = hasPages ? activeLesson.content_data.pages : [];
    const totalPages = pages.length;
    const isLastPage = !hasPages || currentPage === totalPages;
    const currentBlocks = hasPages ? (pages.find(p => p.page_number === currentPage)?.content || []) : (activeLesson?.content_blocks || []);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(c => c + 1);
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0, 0);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(c => c - 1);
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0, 0);
            window.scrollTo(0, 0);
        }
    };

    const handleNextLessonNavigate = () => {
        setShowRewardModal(false);
        if (rewardTimer) clearTimeout(rewardTimer);
        
        if (nextLesson) {
            navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
        } else {
            navigate(`/courses/${courseId}/learn`);
        }
    };

    const handleCompleteLesson = async () => {
        if (!user || !activeLesson) return;
        
        // If already completed and next exists, just navigate
        if (isAlreadyCompleted) {
            handleNextLessonNavigate();
            return;
        }

        if (isCompleteButtonDisabled) return;
        setCompleting(true);

        try {
            const duration = activeLesson.duration_minutes || 15;
            const coinReward = activeLesson.xp_reward || 0;
            
            // 1. Await the service call
            const updatedProgress = await progressService.logActivity(
                courseId, 
                duration, 
                activeLesson.id, 
                coinReward,
                allLessons.length
            );

            if (!updatedProgress) {
                throw new Error('Progress update failed');
            }
            
            setCourseProgress(updatedProgress || {
                ...courseProgress,
                completed_lessons: [...completedLessonIds, activeLesson.id],
                lessons_completed: completedLessonIds.length + 1,
                completion_percentage: Math.min(100, Math.round(((completedLessonIds.length + 1) / (allLessons.length || 1)) * 100))
            });
            
            // 2. Show reward modal
            setShowRewardModal(true);
            setCompleting(false);
            
            // 3. Auto redirect after display time
            const displayTime = isCourseLastLesson || isModuleLastLesson ? 6000 : 4000;
            const timer = setTimeout(() => {
                handleNextLessonNavigate();
            }, displayTime);
            setRewardTimer(timer);
            
        } catch (error) {
            showError('Failed to log completion. Please try again.');
            setCompleting(false);
        }
    };

    // Callback from LessonBlockRenderer when quiz is passed
    // Tight rule: only count a quiz if it's perfect.
    const handleQuizPassed = async (quizId, score = 1, total = 1) => {
        if (score !== total) return;
        setPassedQuizzes(prev => new Set([...prev, quizId]));
        
        // Persist to database
        try {
            await progressService.logQuizResult(courseId, activeLesson.id, quizId, score, total);
        } catch (err) {
            console.warn('Failed to persist quiz result:', err);
        }
    };

    const handleInlineSave = async (newBlocks) => {
        if (!activeLesson?.id) return;
        
        setActiveLesson(prev => ({ ...prev, content_blocks: newBlocks }));
        
        try {
            await supabase
                .from('course_lessons')
                .update({ content_blocks: newBlocks })
                .eq('id', activeLesson.id);
                
            setModules(prev => prev.map(m => ({
                ...m,
                lessons: (m.lessons || []).map(l => l.id === activeLesson.id ? { ...l, content_blocks: newBlocks } : l)
            })));
                
        } catch (err) {
             console.error('Inline save error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] flex items-center justify-center">
                <AILoader variant="pulse" text="Securing scholar content..." />
            </div>
        );
    }

    if (modules.length === 0 || !activeLesson) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] flex items-center justify-center p-6">
                <EliteCard className="p-12 text-center max-w-md w-full border-dashed border-slate-300 dark:border-white/10 shadow-none">
                    <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mx-w mb-6" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Curriculum Unavailable</h2>
                    <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">The scholarly content for this course has not been published yet.</p>
                    <button 
                        onClick={() => navigate(`/courses/detail/${courseId}`)}
                        className="w-full px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
                    >
                        Return to Course
                    </button>
                </EliteCard>
            </div>
        );
    }

    // Determine total progress
    const totalLessons = allLessons.length;
    const completionPercentage = courseProgress?.completion_percentage || 0;

    return (
        <div className="h-[calc(100vh-var(--header-height))] bg-slate-50 dark:bg-[#0A0E27] flex flex-col lg:flex-row overflow-hidden pt-0 mt-[var(--header-height)] relative">
            <AnimatePresence>
                {showRewardModal && (
                    <CompletionModal 
                        isOpen={showRewardModal} 
                        type={completionType}
                        coins={activeLesson.xp_reward || 0} 
                        onNext={handleNextLessonNavigate}
                    />
                )}
            </AnimatePresence>
            
            {/* Sidebar Navigation */}
            <LessonSidebar
                modules={modules}
                activeLessonId={activeLesson?.id}
                courseId={courseId}
                completedLessonIds={completedLessonIds}
                lockData={lockData}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMobile={window.innerWidth < 1024}
            />

            {/* Main Content Area */}
            <div 
                ref={scrollContainerRef}
                className={`flex-1 overflow-y-auto scroll-native relative w-full transition-all duration-500 ease-in-out ${sidebarOpen ? 'lg:pl-[300px]' : ''}`}
            >
                {/* Header Navbar transparent overlay natively flawlessly setup frame */}
                <div className="sticky top-0 z-30 bg-white/100 dark:bg-[#0A0E27] border-b border-white/[0.03] h-[var(--header-height)] px-4 lg:px-12 flex justify-between items-center transition-all">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center gap-3 p-2 text-slate-400 hover:text-emerald-500 transition-colors active:scale-90"
                        >
                            <div className="w-5 h-5 flex flex-col justify-center gap-1">
                                <span className={`h-0.5 bg-current rounded-full transition-all ${sidebarOpen ? 'w-5 translate-y-1.5 rotate-45' : 'w-5'}`} />
                                <span className={`h-0.5 bg-current rounded-full transition-all ${sidebarOpen ? 'opacity-0' : 'w-3'}`} />
                                <span className={`h-0.5 bg-current rounded-full transition-all ${sidebarOpen ? 'w-5 -translate-y-1.5 -rotate-45' : 'w-4'}`} />
                            </div>
                            <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em]">{sidebarOpen ? 'Focus' : 'Explore'}</span>
                        </button>
                        
                        <div className="hidden lg:flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[300px]">{activeLesson.title}</h4>
                        </div>
                    </div>

                    {/* Compact Progress Bar for Mobile/Tablet */}
                    <div className="flex-1 max-w-[120px] md:max-w-[200px] lg:max-w-[250px] px-2 md:px-6">
                        <div className="w-full flex items-center justify-between mb-1">
                            <span className="hidden md:inline text-[9px] font-medium text-slate-400">Progress</span>
                            <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 ml-auto">{Math.round(completionPercentage)}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/20 dark:border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 lg:gap-3 ml-2">
                        {isAdminOrInstructor && (
                            <>
                                {isEditing && (
                                    <div className="hidden md:flex items-center gap-1 border-r border-white/5 pr-2 mr-1">
                                        <button 
                                            onClick={() => {
                                                if (historyIndex > 0) {
                                                    const prevIdx = historyIndex - 1;
                                                    setHistoryIndex(prevIdx);
                                                    setDraftBlocks(editHistory[prevIdx]);
                                                }
                                            }}
                                            disabled={historyIndex <= 0}
                                            type="button"
                                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30"
                                        >
                                            <Icon name="CornerUpLeft" size={13} />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (historyIndex < editHistory.length - 1) {
                                                    const nextIdx = historyIndex + 1;
                                                    setHistoryIndex(nextIdx);
                                                    setDraftBlocks(editHistory[nextIdx]);
                                                }
                                            }}
                                            disabled={historyIndex >= editHistory.length - 1}
                                            type="button"
                                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30"
                                        >
                                            <Icon name="CornerUpRight" size={13} />
                                        </button>
                                    </div>
                                )}

                                {isEditing && (
                                    <button 
                                        onClick={async () => {
                                            if (!draftBlocks) return;
                                            try {
                                                await supabase.from('course_lessons').update({ 
                                                    content_blocks: draftBlocks,
                                                    content_data: { pages: draftBlocks }
                                                }).eq('id', activeLesson.id);
                                                
                                                setModules(prev => prev.map(m => ({
                                                    ...m,
                                                    lessons: (m.lessons || []).map(l => l.id === activeLesson.id ? { ...l, content_blocks: draftBlocks, content_data: { pages: draftBlocks } } : l)
                                                })));
                                                
                                                setActiveLesson(prev => ({
                                                    ...prev,
                                                    content_blocks: draftBlocks,
                                                    content_data: { pages: draftBlocks }
                                                }));
                                                
                                                success('Snapshot auto-saved seamlessly.');
                                                setHasChanges(false);
                                            } catch (err) {
                                                showError('Save failed.');
                                            }
                                        }}
                                        disabled={!hasChanges}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            hasChanges 
                                            ? 'bg-emerald-600 text-white shadow-emerald-500/20 animate-pulse' 
                                            : 'bg-white/5 text-slate-500 disabled:opacity-40'
                                        }`}
                                    >
                                        <Icon name="Save" size={12} /> Save
                                    </button>
                                )}

                                <button 
                                    onClick={() => {
                                        setIsEditing(!isEditing);
                                        if (!isEditing) {
                                             const initialData = hasPages ? activeLesson.content_data.pages : activeLesson?.content_blocks || [];
                                             setDraftBlocks(initialData);
                                             setEditHistory([initialData]);
                                             setHistoryIndex(0);
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border ${
                                        isEditing 
                                        ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' 
                                        : 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                                    }`}
                                >
                                    <Icon name={isEditing ? 'Eye' : 'Edit3'} size={12} />
                                    <span className="hidden xs:inline">{isEditing ? 'View' : 'Edit'}</span>
                                </button>
                            </>
                        )}

                        <button 
                            onClick={handleCompleteLesson}
                            disabled={isCompleteButtonDisabled}
                            className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-xl text-[8px] font-semibold uppercase tracking-[0.18em] transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:grayscale ${
                                isAlreadyCompleted 
                                ? 'bg-emerald-600 text-white shadow-emerald-500/10' 
                                : nextLesson
                                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                    : 'bg-amber-500 text-white shadow-amber-500/20'
                            }`}
                        >
                            <span className="hidden xs:inline">{completing ? '...' : isAlreadyCompleted ? (nextLesson ? 'Next' : 'End') : 'Done'}</span>
                            {completing ? <RefreshCw size={11} className="animate-spin" /> : isAlreadyCompleted || nextLesson ? <ChevronRight size={12} /> : <CheckCircle size={12} />}
                        </button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-4 sm:p-8 lg:p-12 lg:px-20 pb-28 sm:pb-32 mt-4 sm:mt-0">
                    {/* Lesson Header */}
                    {activeLesson.title?.toLowerCase().includes('assessment') || activeLesson.title?.toLowerCase().includes('exam') ? (
                        <div className="space-y-4 mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                <Target size={12} />
                                Official Evaluation
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[900] tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                                {activeLesson.title}
                            </h1>
                            {activeLesson.description && (
                                <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
                                    {activeLesson.description}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Must Pass All Questions</span>
                                <span className="flex items-center gap-1.5"><RefreshCw size={14} /> Retries Allowed</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                                <Sparkles size={12} className="animate-pulse" />
                                Active Module
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-emerald-950 dark:text-emerald-50 leading-tight">
                                {activeLesson.title}
                            </h1>
                            
                            {activeLesson.description && (
                                <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {activeLesson.description}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {activeLesson.duration_minutes || 0} Minutes</span>
                                {activeLesson.xp_reward > 0 && <span className="flex items-center gap-1.5 text-amber-500"><Award size={14} /> +{activeLesson.xp_reward} ONE COINS</span>}
                            </div>
                        </div>
                    )}

                    {/* Lesson Body/Blocks */}
                    {isEditing ? (
                        <div className="bg-white/2 rounded-3xl border border-white/5 p-6 backdrop-blur-3xl min-h-[500px]">
                            <LessonBlockBuilder 
                                blocks={draftBlocks || (hasPages ? activeLesson.content_data.pages : activeLesson?.content_blocks || [])}
                                initialPage={currentPage}
                                onChange={(newBlocks) => { 
                                     setDraftBlocks(newBlocks); 
                                     setHasChanges(true); 
                                     setEditHistory(prev => [...prev.slice(0, historyIndex + 1), newBlocks]);
                                     setHistoryIndex(prev => prev + 1);
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            {hasPages && (
                                <div className="flex flex-col items-center mb-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3">Page {currentPage} of {totalPages}</span>
                                    <div className="flex w-full max-w-xl gap-2">
                                        {pages.map(p => (
                                            <div key={p.page_number} className={`h-1.5 flex-1 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800`}>
                                                <div className={`h-full bg-emerald-500 transition-all duration-500 ${p.page_number <= currentPage ? 'w-full' : 'w-0'}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <LessonBlockRenderer blocks={currentBlocks} onQuizPassed={handleQuizPassed} />
                        </>
                    )}

                    {/* Navigation Buttons Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-emerald-100 dark:border-emerald-500/10">
                        {hasPages ? (
                            <>
                                {currentPage > 1 ? (
                                    <button 
                                        onClick={handlePrevPage}
                                        className="w-full sm:w-auto flex justify-center items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all border border-emerald-100 dark:border-emerald-500/10 active:scale-[0.98]"
                                    >
                                        <ChevronLeft size={16} /> Previous
                                    </button>
                                ) : (
                                    prevLesson ? (
                                        <button 
                                            onClick={() => navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
                                            className="w-full sm:w-auto flex justify-center items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                                        >
                                            <ChevronLeft size={16} /> Previous Lesson
                                        </button>
                                    ) : <div className="hidden sm:block" />
                                )}

                                {!isLastPage ? (
                                    <button 
                                        onClick={handleNextPage}
                                        className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-600 text-white font-bold uppercase tracking-[0.2em] text-[9px] sm:text-[10px] shadow-md transition-all hover:bg-emerald-500 active:scale-[0.98]"
                                    >
                                        Next <ChevronRight size={14} />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleCompleteLesson}
                                        disabled={completing || (!isAlreadyCompleted && isCompleteButtonDisabled)}
                                        className={`w-full sm:w-auto flex justify-center items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-[0.2em] text-[9px] sm:text-[10px] shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                                            isAlreadyCompleted
                                            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                            : nextLesson 
                                                ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-500 active:scale-[0.98]' 
                                                : 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-400 active:scale-[0.98]'
                                        }`}
                                    >
                                        {completing ? 'Ascending...' : isAlreadyCompleted ? (nextLesson ? 'Next Lesson' : 'Course Overview') : 'Submit & Complete'}
                                        {!completing && <CheckCircle size={14} />}
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                {prevLesson ? (
                                    <button 
                                        onClick={() => navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
                                        className="w-full sm:w-auto flex justify-center items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all border border-emerald-100 dark:border-emerald-500/10 active:scale-[0.98]"
                                    >
                                        <ChevronLeft size={16} /> Previous Lesson
                                    </button>
                                ) : <div className="hidden sm:block" />}

                                <button 
                                    onClick={handleCompleteLesson}
                                    disabled={completing || (!isAlreadyCompleted && isCompleteButtonDisabled)}
                                    className={`w-full sm:w-auto flex justify-center items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold uppercase tracking-[0.2em] text-[9px] sm:text-[10px] shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                                        isAlreadyCompleted
                                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                        : nextLesson 
                                            ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-500 active:scale-[0.98]' 
                                            : 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-400 active:scale-[0.98]'
                                    }`}
                                >
                                    {completing ? 'Ascending...' : isAlreadyCompleted ? (nextLesson ? 'Next Lesson' : 'Course Overview') : nextLesson ? 'Complete Lesson' : 'Finish Course'}
                                    {!completing && <ChevronRight size={14} />}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Floating AI Assistants */}
            <FloatingLessonAssistants courseId={courseId} lessonId={activeLesson.id} activeLesson={activeLesson} />
        </div>
    );
};

export default LessonView;
