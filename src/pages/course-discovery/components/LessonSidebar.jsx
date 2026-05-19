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
                        className={`fixed left-0 top-[var(--header-height)] z-50 w-[300px] flex flex-col pointer-events-auto transition-all duration-500 ease-in-out ${
                            isMobile 
                            ? 'bottom-0 bg-[#0078D4] border-r border-white/10 rounded-tr-[2.5rem]' 
                            : 'h-[calc(100vh-calc(var(--header-height)+2rem))] mt-4 ml-4 rounded-3xl bg-[#0078D4] border border-white/10 shadow-2xl'
                        } overflow-hidden`}
                    >
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                        
                        {/* Sidebar Header - Navigation & Close */}
                        <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/10 relative z-50">
                            <button 
                                onClick={() => navigate(`/courses/${courseId}/learn`)}
                                className="flex items-center gap-3 text-white hover:text-white/80 transition-all group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-white" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Overview</span>
                            </button>
                            
                            {isMobile && (
                                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl text-white/70 hover:text-white transition-all">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Module Selector - Simple Dropdown */}
                        <div className="px-5 py-6 relative z-40">
                            <label className="block text-[8px] font-black text-white/60 uppercase tracking-[0.4em] mb-3 ml-1">Current Module</label>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                                        isDropdownOpen 
                                        ? 'bg-white/20 border-white/30 text-white shadow-xl' 
                                        : 'bg-white/10 border-white/10 text-white hover:border-white/20 hover:bg-white/15'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                        {selectedModule?.title || 'Selecting...'}
                                    </span>
                                    <ChevronDown size={14} className="transition-transform duration-300 text-white" />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#0078D4] border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-50 backdrop-blur-3xl"
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
                                                                ? 'bg-white/20 text-white font-bold' 
                                                                : isLocked 
                                                                    ? 'opacity-20 pointer-events-none'
                                                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-black opacity-45 text-white">{idx + 1}</span>
                                                                <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[160px]">{mod.title}</span>
                                                            </div>
                                                            {isLocked ? <Lock size={10} /> : isSelected && <Check size={12} className="text-white" />}
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
                            <label className="block text-[8px] font-black text-white/50 uppercase tracking-[0.4em] mb-4 ml-1">Lessons</label>
                            
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
                                                    ? 'bg-white text-[#0078D4] border-white/20 shadow-lg' 
                                                    : isLocked 
                                                        ? 'opacity-65 text-white/50 border-transparent'
                                                        : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'
                                                }`}
                                            >
                                                {isActive && (
                                                    <motion.div 
                                                        layoutId="activeLessonGlow"
                                                        className="absolute left-2.5 w-1 h-3.5 bg-[#0078D4] rounded-full"
                                                    />
                                                )}
                                                
                                                <div className="flex items-center gap-3 min-w-0 pl-3">
                                                    <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-lg text-[8px] font-black border transition-all ${
                                                        isActive ? 'bg-[#0078D4] border-[#0078D4]/20 text-white shadow-lg' : 'bg-white/10 border-white/10 text-white/80 group-hover:text-white group-hover:border-white/20'
                                                    }`}>
                                                        {isLocked && !isActive ? <Lock size={8} className="text-white/50" /> : lIndex + 1}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider truncate transition-colors ${isActive ? 'text-[#0078D4]' : 'text-white group-hover:text-white'}`}>
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                                
                                                {isPast && !isActive && (
                                                    <div className="w-3.5 h-3.5 rounded-full bg-white/20 text-white flex items-center justify-center">
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
