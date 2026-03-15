import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/Toast';
import { EliteCard } from '../../../components/ui/EliteCard';
import LessonBlockBuilder from './LessonBlockBuilder';
import CertificateDesigner from './CertificateDesigner';

const CurriculumBuilder = ({ courseId, courseTitle }) => {
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [collapsedLessons, setCollapsedLessons] = useState({});
    const [focusedLessonId, setFocusedLessonId] = useState(null);
    const [lessonEditorTab, setLessonEditorTab] = useState('content'); // content, certificate
    const [showJumpMenu, setShowJumpMenu] = useState(false);

    const toggleLessonCollapse = (lessonId) => {
        setCollapsedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    useEffect(() => {
        if (courseId) {
            loadCurriculum();
        }
    }, [courseId]);

    const loadCurriculum = async () => {
        setLoading(true);
        try {
            const { data: modulesData, error: modError } = await supabase
                .from('course_modules')
                .select('*')
                .eq('course_id', courseId)
                .order('sort_order', { ascending: true });

            if (modError) throw modError;

            if (!modulesData || modulesData.length === 0) {
                setModules([]);
                setLoading(false);
                return;
            }

            const { data: lessonsData, error: lessonError } = await supabase
                .from('course_lessons')
                .select('*')
                .in('module_id', modulesData.map(m => m.id))
                .order('sort_order', { ascending: true });

            if (lessonError) throw lessonError;

            const structuredModules = modulesData.map(mod => ({
                ...mod,
                lessons: (lessonsData || []).filter(l => l.module_id === mod.id).map(l => ({
                    ...l,
                    content_blocks: l.content_data?.pages || l.content_blocks || []
                }))
            }));

            setModules(structuredModules);
            const firstMod = structuredModules.find(m => m.id);
            if (firstMod && !activeModuleId) {
                setActiveModuleId(firstMod.id);
            }
        } catch (err) {
            showError('Failed to load curriculum');
        } finally {
            setLoading(false);
        }
    };

    const addModule = async () => {

        try {
            const newModName = `Module ${modules.length + 1}`;
            const { data, error } = await supabase
                .from('course_modules')
                .insert([{
                    course_id: courseId,
                    title: newModName,
                    sort_order: modules.length,
                    is_published: true,
                }])
                .select()
                .single();

            if (error) throw error;
            const newMod = { id: data.id, title: newModName, unlock_week: 1, lessons: [] };
            setModules([...modules, newMod]);
            setActiveModuleId(data.id);
            success('Module created');
        } catch (error) {
            showError('Failed to create module');
        }
    };

    const addLesson = async (moduleId) => {
        try {
            const module = modules.find(m => m.id === moduleId);
            const nextOrder = module?.lessons?.length || 0;
            const { data, error } = await supabase
                .from('course_lessons')
                .insert([{
                    module_id: moduleId,
                    title: 'New Lesson',
                    sort_order: nextOrder,
                    is_published: true,
                }])
                .select()
                .single();

            if (error) throw error;
            
            setModules(prev => prev.map(m => 
                m.id === moduleId 
                ? { ...m, lessons: [...m.lessons, data] }
                : m
            ));
            success('Lesson added');
        } catch (error) {
            showError('Failed to create lesson');
        }
    };

    const updateModuleTitle = async (moduleId, title) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title } : m));
        await supabase.from('course_modules').update({ title }).eq('id', moduleId);
    };

    const updateModuleWeek = async (moduleId, unlock_week) => {
        const week = parseInt(unlock_week) || 1;
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, unlock_week: week } : m));
        await supabase.from('course_modules').update({ unlock_week: week }).eq('id', moduleId);
    };

    const updateLesson = async (lessonId, updates) => {
        setModules(prev => prev.map(m => ({
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        })));
        
        const dbUpdates = { ...updates };
        if (updates.content_blocks) {
             dbUpdates.content_data = { ...(updates.content_data || {}), pages: updates.content_blocks };
        }
        await supabase.from('course_lessons').update(dbUpdates).eq('id', lessonId);
    };


    const deleteModule = async (moduleId) => {
        if (!confirm('Are you sure? This will delete all lessons in this module.')) return;
        try {
            await supabase.from('course_modules').delete().eq('id', moduleId);
            const newModules = modules.filter(m => m.id !== moduleId);
            setModules(newModules);
            if (activeModuleId === moduleId) {
                setActiveModuleId(newModules.length > 0 ? newModules[0].id : null);
            }
            success('Module removed');
        } catch (error) {
            showError('Failed to delete module');
        }
    };

    const deleteLesson = async (moduleId, lessonId) => {
        try {
            await supabase.from('course_lessons').delete().eq('id', lessonId);
            setModules(prev => prev.map(m => 
                m.id === moduleId 
                ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                : m
            ));
            success('Lesson removed');
        } catch (error) {
            showError('Failed to delete lesson');
        }
    };


    const duplicateModule = async (moduleId) => {
        try {
            const moduleToDuplicate = modules.find(m => m.id === moduleId);
            if (!moduleToDuplicate) return;

            const nextOrder = modules.length;
            const { data: newModuleData, error: modErr } = await supabase
                .from('course_modules')
                .insert([{
                    course_id: courseId,
                    title: `${moduleToDuplicate.title} (Copy)`,
                    sort_order: nextOrder
                }])
                .select()
                .single();

            if (modErr) throw modErr;

            let newLessons = [];
            if (moduleToDuplicate.lessons && moduleToDuplicate.lessons.length > 0) {
                const lessonsToInsert = moduleToDuplicate.lessons.map(lesson => ({
                    module_id: newModuleData.id,
                    course_id: courseId,
                    title: lesson.title,
                    content_type: lesson.content_type,
                    duration_minutes: lesson.duration_minutes,
                    xp_reward: lesson.xp_reward,
                    coin_reward: lesson.coin_reward,
                    content_blocks: lesson.content_blocks,
                    sort_order: lesson.sort_order
                }));

                const { data: duplicatedLessonsData, error: lessErr } = await supabase
                    .from('course_lessons')
                    .insert(lessonsToInsert)
                    .select();

                if (lessErr) throw lessErr;
                newLessons = duplicatedLessonsData;
            }

            const newMod = { ...newModuleData, lessons: newLessons.sort((a,b) => a.sort_order - b.sort_order) };
            setModules([...modules, newMod]);
            setActiveModuleId(newMod.id);
            success('Module duplicated');
        } catch (error) {
            showError('Failed to duplicate module');
        }
    };

    const activeModuleIndex = modules.findIndex(m => m.id === activeModuleId);
    const activeModule = modules.find(m => m.id === activeModuleId);

    const handleNextModule = () => {
        if (activeModuleIndex < modules.length - 1) {
            setActiveModuleId(modules[activeModuleIndex + 1].id);
        }
    };

    const handlePrevModule = () => {
        if (activeModuleIndex > 0) {
            setActiveModuleId(modules[activeModuleIndex - 1].id);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-bold uppercase tracking-widest text-[9px]">Loading Lessons...</div>;

    return (
        <div className="w-full flex flex-col h-full bg-[#06091F]/30 min-h-screen">
            {/* Minimalist Top Navigation */}
            <div className="sticky top-0 z-50 px-8 py-4 bg-[#0A0E27]/60 backdrop-blur-xl border-b border-emerald-500/10 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={handlePrevModule}
                            disabled={activeModuleIndex <= 0}
                            className="p-2 text-slate-500 hover:text-white disabled:opacity-10 transition-all"
                        >
                            <Icon name="ChevronLeft" size={16} />
                        </button>
                        <div className="text-center min-w-[120px] cursor-pointer group px-2" onClick={() => setShowJumpMenu(!showJumpMenu)}>
                            <p className="text-[6px] font-black text-emerald-500/30 uppercase tracking-[0.5em] mb-0.5">MOD {activeModuleIndex + 1}</p>
                            <h2 className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[160px]">{activeModule?.title || 'Module'}</h2>
                        </div>
                        <button 
                            onClick={handleNextModule}
                            disabled={activeModuleIndex >= modules.length - 1}
                            className="p-2 text-slate-500 hover:text-white disabled:opacity-10 transition-all"
                        >
                            <Icon name="ChevronRight" size={16} />
                        </button>
                    </div>

                    <div className="h-6 w-px bg-white/5" />

                    <button 
                        onClick={() => setShowJumpMenu(!showJumpMenu)}
                        className={`px-4 py-1.5 rounded-lg border transition-all flex items-center gap-2 active:scale-95 ${
                            showJumpMenu 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-white/5 border-emerald-500/10 text-slate-400 hover:border-emerald-500/20'
                        }`}
                    >
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Full List</span>
                        <Icon name="Grid" size={12} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate(`/courses/detail/${courseId}`)}
                        className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 text-slate-500 rounded-lg border border-emerald-500/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        <Icon name="Eye" size={12} /> Preview
                    </button>
                    <button 
                        onClick={addModule}
                        className="px-5 py-1.5 bg-emerald-600/90 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
                    >
                        <Icon name="Plus" size={12} /> Module
                    </button>
                </div>

                {/* Jump Menu Overlay */}
                <AnimatePresence>
                    {showJumpMenu && (
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 min-w-[280px] bg-[#0A0E27] rounded-3xl border border-emerald-500/20 shadow-2xl p-5 z-[200] backdrop-blur-2xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">Module List</h3>
                                <button onClick={() => setShowJumpMenu(false)} className="p-1.5 text-slate-600 hover:text-white transition-colors">
                                    <Icon name="X" size={14} />
                                </button>
                            </div>
                            <div className="grid grid-cols-5 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                                {modules.map((m, idx) => (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            setActiveModuleId(m.id);
                                            setShowJumpMenu(false);
                                        }}
                                        className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all border ${
                                            activeModuleId === m.id
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                                            : 'bg-white/5 border-emerald-500/10 text-slate-500 hover:border-emerald-500/20'
                                        }`}
                                    >
                                        <span className="text-xs font-black">{idx + 1}</span>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => {
                                        addModule();
                                        setShowJumpMenu(false);
                                    }}
                                    className="aspect-square rounded-xl border border-dashed border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center"
                                >
                                    <Icon name="Plus" size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative px-4 md:px-12 py-8">
                <AnimatePresence mode="wait">
                    {focusedLessonId ? (
                        /* Cinematic Full Canvas Workspace Canvas */
                        <motion.div
                            key="lesson-focused-editor"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-6xl mx-auto space-y-8 pb-32"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-500/10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setFocusedLessonId(null)} className="p-3 bg-white/5 hover:bg-[#0A0E27] backdrop-blur-xl rounded-2xl text-slate-400 hover:text-white border border-emerald-500/10 hover:border-emerald-500/20 transition-all flex items-center justify-center">
                                        <Icon name="ChevronLeft" size={20} />
                                    </button>
                                    <div>
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Work Desk • Lesson Editor</p>
                                        <input 
                                            value={activeModule?.lessons.find(l => l.id === focusedLessonId)?.title || ''}
                                            onChange={(e) => updateLesson(focusedLessonId, { title: e.target.value })}
                                            className="bg-transparent text-2xl font-black text-white uppercase tracking-tight focus:outline-none focus:text-emerald-500 transition-colors w-full border-b border-transparent focus:border-emerald-500/20"
                                            placeholder="Enter Lesson Name"
                                        />
                                    </div>
                                </div>
                                <button onClick={() => setFocusedLessonId(null)} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
                                    <Icon name="Check" size={14} /> Close Desk
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 items-start w-full">
                                {/* Side Workspace Configuration Panel Stream Header natively setup */}                                <div className="w-full">
                                    <div className="p-5 bg-white/2 rounded-3xl border border-emerald-500/10 flex flex-col md:flex-row items-center gap-6 backdrop-blur-3xl">
                                        <div className="flex items-center gap-2 text-emerald-400 shrink-0">
                                            <Icon name="Sliders" size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Lesson Config</span>
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">
                                            <div className="flex-1 flex items-center justify-between border-b border-emerald-500/20 pb-2 pt-1 group focus-within:border-emerald-500/30 transition-all">
                                                <div className="flex-1">
                                                     <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Duration</span>
                                                     <input 
                                                          type="number"
                                                          value={activeModule?.lessons.find(l => l.id === focusedLessonId)?.duration_minutes || ''}
                                                          onChange={(e) => updateLesson(focusedLessonId, { duration_minutes: parseInt(e.target.value) || 0 })}
                                                          className="bg-transparent text-[13px] font-black text-white focus:outline-none focus:text-emerald-500 w-full mt-0.5"
                                                     />
                                                </div>
                                                <span className="text-[8px] font-bold text-slate-500">min</span>
                                            </div>
                                            
                                            <div className="flex-1 flex items-center justify-between border-b border-emerald-500/20 pb-2 pt-1 group focus-within:border-blue-400/30 transition-all">
                                                <div className="flex-1">
                                                     <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest block">XP Reward</span>
                                                     <input 
                                                          type="number"
                                                          value={activeModule?.lessons.find(l => l.id === focusedLessonId)?.xp_reward || 0}
                                                          onChange={(e) => updateLesson(focusedLessonId, { xp_reward: parseInt(e.target.value) || 0 })}
                                                          className="bg-transparent text-[13px] font-black text-white focus:outline-none focus:text-blue-400 w-full mt-0.5"
                                                     />
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 flex items-center justify-between border-b border-emerald-500/20 pb-2 pt-1 group focus-within:border-emerald-400/30 transition-all">
                                                <div className="flex-1">
                                                     <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest block">Coins</span>
                                                     <input 
                                                          type="number"
                                                          value={activeModule?.lessons.find(l => l.id === focusedLessonId)?.coin_reward || 0}
                                                          onChange={(e) => updateLesson(focusedLessonId, { coin_reward: parseInt(e.target.value) || 0 })}
                                                          className="bg-transparent text-[13px] font-black text-white focus:outline-none focus:text-emerald-500 w-full mt-0.5"
                                                     />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Workspace Canvas Full Widescreen setups stream frame flawless setup frame */}
                                <div className="w-full">
                                    <div className="p-8 bg-white/2 rounded-3xl border border-emerald-500/10 backdrop-blur-3xl min-h-[500px]">
                                        <LessonBlockBuilder 
                                            blocks={activeModule?.lessons.find(l => l.id === focusedLessonId)?.content_blocks || []} 
                                            onChange={(newIdBlocks) => updateLesson(focusedLessonId, { content_blocks: newIdBlocks })} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : activeModule ? (
                        <motion.div
                            key={activeModuleId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-5xl mx-auto space-y-8 pb-32"
                        >
                            {/* Module Header Card */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-8 border border-emerald-500/10 relative group">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <div className="flex-1 space-y-2 w-full">
                                        <input 
                                            value={activeModule.title}
                                            onChange={(e) => updateModuleTitle(activeModuleId, e.target.value)}
                                            className="bg-transparent text-2xl font-black text-white uppercase tracking-tight w-full focus:outline-none focus:text-emerald-500 transition-colors hover:text-emerald-500/80"
                                            placeholder="Module Title"
                                        />
                                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Module • Week {activeModule.unlock_week || 1}</p>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-3 flex-1 flex items-center justify-between border-b border-emerald-500/20 pb-1.5 pt-1 group focus-within:border-emerald-500/30 transition-all">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Unlock Week</span>
                                            <input 
                                                type="number"
                                                min="1"
                                                value={activeModule.unlock_week || 1}
                                                onChange={(e) => updateModuleWeek(activeModuleId, e.target.value)}
                                                className="w-12 bg-transparent text-sm font-black text-emerald-500 text-center focus:outline-none"
                                            />
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => duplicateModule(activeModuleId)}
                                                className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-emerald-500/10 transition-all"
                                            >
                                                <Icon name="Copy" size={16} />
                                            </button>
                                            <button 
                                                onClick={() => deleteModule(activeModuleId)}
                                                className="p-3 bg-white/5 text-rose-500/60 hover:text-rose-500 rounded-xl border border-emerald-500/10 transition-all"
                                            >
                                                <Icon name="Trash2" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lessons List - Minimalist Row Layout */}
                            <div className="flex flex-col gap-3">
                                {activeModule.lessons?.map((lesson, idx) => (
                                    <motion.div 
                                        key={lesson.id}
                                        layoutId={`lesson-card-${lesson.id}`}
                                        className="bg-white/2 border border-emerald-500/10 rounded-2xl p-4 hover:bg-white/5 transition-all group/card relative flex flex-col md:flex-row items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center text-[10px] font-black border border-emerald-500/10 group-hover/card:bg-emerald-600 group-hover/card:text-white transition-all">
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 group/input relative">
                                                <input 
                                                    value={lesson.title}
                                                    onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                                                    className="bg-transparent text-[13px] font-black text-white uppercase tracking-widest focus:outline-none w-full border-b border-transparent focus:border-emerald-500/20 pb-1 mb-1 transition-all hover:text-emerald-500"
                                                    placeholder="Lesson Title"
                                                />
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/input:opacity-50 transition-opacity pointer-events-none">
                                                    <Icon name="Edit2" size={10} className="text-emerald-500" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                                        <Icon name="Clock" size={10} className="text-emerald-500/50" />
                                                        {lesson.duration_minutes || 0}m
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                                        <Icon name="Layers" size={10} className="text-blue-500/50" />
                                                        {lesson.content_blocks?.length || 0} Blocks
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setFocusedLessonId(lesson.id)}
                                                className="px-6 py-2 bg-emerald-600/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                            >
                                                Edit Content
                                            </button>
                                            <button 
                                                onClick={() => deleteLesson(activeModuleId, lesson.id)} 
                                                className="p-2 text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover/card:opacity-100"
                                            >
                                                <Icon name="X" size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                                <button 
                                    onClick={() => addLesson(activeModuleId)}
                                    className="border border-dashed border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-emerald-600/[0.02] hover:border-emerald-500/20 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <Icon name="Plus" size={18} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 group-hover:text-emerald-500">Add New Lesson</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-[40vh] flex items-center justify-center">
                            <button onClick={addModule} className="px-10 py-4 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">Create Module</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


export default CurriculumBuilder;
