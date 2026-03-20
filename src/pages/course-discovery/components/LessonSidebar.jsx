import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    X, 
    Check, 
    Lock,
    ChevronDown,
    LayoutGrid,
    BookOpen,
    ArrowLeft
} from 'lucide-react';

const LessonSidebar = ({
    modules = [],
    activeLessonId,
    courseId,
    completedLessonIds = [],
    lockData = { lockedModules: {}, lockedLessons: {} },
    sidebarOpen,
    setSidebarOpen,
    isMobile
}) => {
    const navigate = useNavigate();
    
    // Find the current active module based on the active lesson
    const currentActiveModule = modules.find(mod => mod.lessons?.some(l => l.id === activeLessonId));
    const [selectedModuleId, setSelectedModuleId] = useState(currentActiveModule?.id || (modules.length > 0 ? modules[0].id : null));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Sync selected module when active lesson changes
    useEffect(() => {
        if (currentActiveModule) {
            setSelectedModuleId(currentActiveModule.id);
        }
    }, [activeLessonId, currentActiveModule]);

    const selectedModule = modules.find(m => m.id === selectedModuleId);

    return (
        <>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="fixed left-0 top-[var(--header-height)] bottom-0 z-50 w-[300px] bg-[#060A1A]/95 backdrop-blur-3xl flex flex-col h-[calc(100vh-var(--header-height))] border-r border-emerald-500/10 shadow-3xl safe-area-bottom overflow-hidden"
                    >
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
                        
                        {/* Sidebar Header - Navigation & Close */}
                        <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.03] relative z-50 bg-[#060A1A]/40 backdrop-blur-md">
                            <button 
                                onClick={() => navigate(`/courses/${courseId}/learn`)}
                                className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-all group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Overview</span>
                            </button>
                            
                            {isMobile && (
                                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl text-slate-500 hover:text-white transition-all">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Module Selector - Simple Dropdown */}
                        <div className="px-5 py-6 relative z-40">
                            <label className="block text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.4em] mb-3 ml-1">Current Module</label>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                                        isDropdownOpen 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white shadow-xl shadow-emerald-500/5' 
                                        : 'bg-white/[0.03] border-white/[0.04] text-slate-300 hover:border-emerald-500/20 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                        {selectedModule?.title || 'Selecting...'}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 text-emerald-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#080B19]/98 border border-white/[0.08] rounded-2xl shadow-3xl overflow-hidden z-50 backdrop-blur-3xl"
                                        >
                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                                                {modules.map((mod, idx) => {
                                                    const isSelected = mod.id === selectedModuleId;
                                                    const isLocked = lockData.lockedModules?.[mod.id];
                                                    
                                                    return (
                                                        <button
                                                            key={mod.id}
                                                            disabled={isLocked && !isSelected}
                                                            onClick={() => {
                                                                setSelectedModuleId(mod.id);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                                                isSelected 
                                                                ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                                                                : isLocked 
                                                                    ? 'opacity-20 pointer-events-none'
                                                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-black opacity-30 text-emerald-500">{idx + 1}</span>
                                                                <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[160px]">{mod.title}</span>
                                                            </div>
                                                            {isLocked ? <Lock size={10} /> : isSelected && <Check size={12} className="text-emerald-500" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Lessons List */}
                        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-2 custom-scrollbar relative z-10">
                            <label className="block text-[8px] font-black text-slate-500/40 uppercase tracking-[0.4em] mb-4 ml-1">Lessons</label>
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedModuleId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-1"
                                >
                                    {selectedModule?.lessons?.map((lesson, lIndex) => {
                                        const isActive = lesson.id === activeLessonId;
                                        const isPast = completedLessonIds.includes(lesson.id);
                                        const isLocked = lockData.lockedModules?.[selectedModuleId] || lockData.lockedLessons?.[lesson.id];
                                        
                                        return (
                                            <button 
                                                key={lesson.id}
                                                disabled={isLocked && !isActive}
                                                onClick={() => {
                                                    if (isLocked && !isActive) return;
                                                    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
                                                    if (isMobile) setSidebarOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl transition-all border relative group ${
                                                    isActive 
                                                    ? 'bg-emerald-500/[0.07] border-emerald-500/20 text-white shadow-lg shadow-emerald-500/5' 
                                                    : isLocked 
                                                        ? 'opacity-20 border-transparent'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border-white/[0.02] hover:border-white/[0.06]'
                                                }`}
                                            >
                                                {isActive && (
                                                    <motion.div 
                                                        layoutId="activeLessonGlow"
                                                        className="absolute left-2.5 w-1 h-3.5 bg-emerald-500 rounded-full"
                                                    />
                                                )}
                                                
                                                <div className="flex items-center gap-3 min-w-0 pl-3">
                                                    <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-lg text-[8px] font-black border transition-all ${
                                                        isActive ? 'bg-emerald-500 border-emerald-500/20 text-white shadow-lg shadow-emerald-500/10' : 'bg-white/[0.03] border-white/[0.03] text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20'
                                                    }`}>
                                                        {isLocked && !isActive ? <Lock size={8} /> : lIndex + 1}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider truncate ${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`}>
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                                
                                                {isPast && !isActive && (
                                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            <AnimatePresence>
                {sidebarOpen && isMobile && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default LessonSidebar;
