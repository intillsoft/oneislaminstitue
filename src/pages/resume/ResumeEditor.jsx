import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout, Sparkles, Eye,
    Download, CheckCircle2,
    FileText, Search, Menu, X, ArrowLeft, Sun, Moon, Zap
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../contexts/ThemeContext';

// V2 Components
import ResumePreview from './components/ResumePreview';
import ResumeEditorManual from './components/ResumeEditorManual';
import AIChatPanel from './components/AIChatPanel';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const AUTOSAVE_DELAY = 1000;

const ResumeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();
    const { theme, toggleTheme } = useTheme();

    // Width Check for Mobile Layout
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Mobile Active Tab (editor, chat, preview)
    const [activeMobileTab, setActiveMobileTab] = useState('editor');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- State ---
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Visual Toggles
    const [showVisuals, setShowVisuals] = useState({
        heatmap: false,
        ats: false
    });

    const [resumeData, setResumeData] = useState({
        personalInfo: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
    });

    const [atsScore, setAtsScore] = useState(0);
    const saveTimeoutRef = useRef(null);
    const chatPanelRef = useRef(null); // Ref for AI Chat Panel

    // --- Effects ---
    useEffect(() => {
        if (id) {
            loadResume();
        } else if (user) {
            createNewResume();
        }
    }, [id, user]);

    // --- Actions ---
    const createNewResume = async () => {
        try {
            setLoading(true);
            const newResume = await resumeService.create({
                title: 'Untitled Resume',
                visibility: 'private',
                content: resumeData,
                is_draft: true
            });
            success('Draft created');
            navigate(`/resume/edit/${newResume.id}`, { replace: true });
        } catch (error) {
            console.error('Failed to create draft:', error);
            showError('Could not start new resume');
            navigate('/resume/dashboard');
        }
    };

    const loadResume = async () => {
        try {
            setLoading(true);
            const data = await resumeService.getById(id);
            setResume(data);
            if (data.content_json) setResumeData(data.content_json);
            if (data.ats_score) setAtsScore(data.ats_score);
            setLastSaved(new Date(data.updated_at));
        } catch (error) {
            navigate('/resume/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDataChange = useCallback((newData) => {
        setResumeData(newData);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        setSaving(true);
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await saveResume(newData, true);
            } catch (err) {
                console.error('Auto-save failed:', err);
            }
        }, AUTOSAVE_DELAY);
    }, [id]);

    const saveResume = async (data = resumeData, silent = false) => {
        if (!id) return;
        try {
            setSaving(true);
            const updatedResume = await resumeService.update(id, {
                content: data,
                completeness_score: calculateCompleteness(data)
            });
            setLastSaved(new Date());
            setResume(prev => ({ ...prev, ...updatedResume }));
            if (!silent) success('Saved');
        } catch (err) {
            if (!silent) showError('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleTemplateChange = async (templateId) => {
        try {
            await resumeService.update(id, { template: templateId });
            setResume(prev => ({ ...prev, template_id: templateId }));
            success('Template updated');
        } catch (err) { showError('Failed to change template'); }
    };

    const calculateCompleteness = (data) => {
        let score = 0;
        if (data.personalInfo?.name) score += 10;
        if (data.summary?.length > 50) score += 20;
        if (data.experience?.length > 0) score += 40;
        if (data.skills?.length > 0) score += 30;
        return score;
    };

    // Handler for Manual Editor AI buttons
    const handleAITrigger = (prompt) => {
        if (isMobile) {
            setActiveMobileTab('chat'); // Switch to chat tab on mobile
        }
        // Small delay to allow tab switch or render
        setTimeout(() => {
            if (chatPanelRef.current) {
                chatPanelRef.current.triggerAction(prompt);
            }
        }, 100);
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    // --- RENDER ---
    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans overflow-hidden relative">

            {/* --- NEBULA BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            {/* 1. Glass Header (Dynamic Island Style) */}
            <header className="h-16 bg-white/70 dark:bg-[#0B1121]/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 flex items-center justify-between px-6 z-50 shrink-0 shadow-lg relative">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/resume/dashboard')}
                        className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-slate-200/50 dark:bg-white/10 hidden md:block" />
                    <div className="flex flex-col">
                        <input
                            value={resume?.title || ''}
                            onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
                            onBlur={() => resumeService.update(id, { title: resume.title })}
                            className="bg-transparent border-none text-slate-900 dark:text-white font-black text-lg focus:ring-0 p-0 w-48 md:w-64 placeholder-slate-400 focus:bg-white/10 rounded px-1 transition-colors"
                        />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                            {saving ? <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Saving...</> : <><span className="w-2 h-2 rounded-full bg-emerald-400" /> Saved</>}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-full transition-colors hidden md:block"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Desktop Template Toggles */}
                    <div className="hidden md:flex bg-slate-100/50 dark:bg-white/5 rounded-full p-1 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
                        {['Modern', 'Executive', 'Technical', 'Creative'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleTemplateChange(t.toLowerCase())}
                                className={`px-4 py-1.5 text-[10px] uppercase font-bold rounded-full transition-all ${(resume?.template_id || 'modern') === t.toLowerCase()
                                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md transform scale-105'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="h-10 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 hover:shadow-lg transition-all rounded-full text-xs font-bold flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> <span className="hidden md:inline">Export PDF</span>
                    </button>
                </div>
            </header>

            {/* 2. Main Workspace */}
            <div className="flex-1 overflow-hidden relative z-10">
                {isMobile ? (
                    // --- MOBILE LAYOUT ---
                    <div className="flex flex-col h-full bg-white dark:bg-[#0B1121]">
                        <div className="flex-1 overflow-y-auto relative">
                            {activeMobileTab === 'editor' && (
                                <div className="p-4 pb-20">
                                    <ResumeEditorManual
                                        data={resumeData}
                                        onChange={handleDataChange}
                                        onAIAction={handleAITrigger}
                                    />
                                </div>
                            )}
                            {activeMobileTab === 'chat' && (
                                <AIChatPanel
                                    ref={chatPanelRef}
                                    currentResume={resumeData}
                                    onUpdateResume={handleDataChange}
                                />
                            )}
                            {activeMobileTab === 'preview' && (
                                <div className="min-h-full flex justify-center bg-slate-100 dark:bg-black/20 p-2 overflow-x-hidden">
                                    <div className="transform scale-[0.40] origin-top-center h-[1400px]">
                                        <ResumePreview data={resumeData} template={resume?.template_id || 'modern'} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Bottom Navigation */}
                        <div className="h-20 bg-white/90 dark:bg-[#0B1121]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 flex items-center justify-around px-4 shrink-0 z-50 shadow-2xl">
                            <MobileTab id="editor" label="Editor" icon={FileText} active={activeMobileTab} onClick={setActiveMobileTab} />
                            <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                            <MobileTab id="chat" label="AI Copilot" icon={Sparkles} active={activeMobileTab} onClick={setActiveMobileTab} />
                            <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                            <MobileTab id="preview" label="Preview" icon={Eye} active={activeMobileTab} onClick={setActiveMobileTab} />
                        </div>
                    </div>
                ) : (
                    // --- DESKTOP LAYOUT ---
                    <PanelGroup direction="horizontal" autoSaveId="resume-layout-persistence">

                        {/* LEFT: EDITOR */}
                        <Panel defaultSize={35} minSize={25} collapsible={true} order={1} className="flex flex-col bg-slate-50/50 dark:bg-transparent backdrop-blur-sm border-r border-slate-200/50 dark:border-white/5">
                            <div className="p-4 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-transparent shrink-0">
                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Manual Editor
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <div className="max-w-2xl mx-auto">
                                    <ResumeEditorManual
                                        data={resumeData}
                                        onChange={handleDataChange}
                                        onAIAction={handleAITrigger}
                                    />
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-indigo-500/20 transition-colors cursor-col-resize z-50 flex items-center justify-center group focus:outline-none">
                            <div className="h-16 w-1 rounded-full bg-slate-300 dark:bg-white/10 group-hover:bg-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all" />
                        </PanelResizeHandle>

                        {/* MIDDLE: CHAT */}
                        <Panel defaultSize={25} minSize={20} collapsible={true} order={2} className="flex flex-col bg-white/60 dark:bg-[#0B1121]/50 backdrop-blur-md border-r border-slate-200/50 dark:border-white/5">
                            <AIChatPanel
                                ref={chatPanelRef}
                                currentResume={resumeData}
                                onUpdateResume={handleDataChange}
                            />
                        </Panel>

                        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-indigo-500/20 transition-colors cursor-col-resize z-50 flex items-center justify-center group focus:outline-none">
                            <div className="h-16 w-1 rounded-full bg-slate-300 dark:bg-white/10 group-hover:bg-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all" />
                        </PanelResizeHandle>

                        {/* RIGHT: PREVIEW */}
                        <Panel defaultSize={40} minSize={25} collapsible={true} order={3} className="flex flex-col bg-slate-200/50 dark:bg-black/20 relative">
                            <div className="h-12 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between px-4 bg-white/40 dark:bg-transparent shrink-0 backdrop-blur-sm">
                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Eye className="w-3 h-3" /> Live Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowVisuals(s => ({ ...s, heatmap: !s.heatmap }))}
                                        className={`p-1.5 rounded-lg transition-all ${showVisuals.heatmap ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-indigo-500'}`}
                                        title="Heatmap"
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setShowVisuals(s => ({ ...s, ats: !s.ats }))}
                                        className={`p-1.5 rounded-lg transition-all ${showVisuals.ats ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-500'}`}
                                        title="ATS Check"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 relative flex justify-center items-start">
                                <div className="w-full relative group flex justify-center min-h-full">
                                    <ResumePreview
                                        data={resumeData}
                                        template={resume?.template_id || 'modern'}
                                    />
                                    {showVisuals.heatmap && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 mix-blend-overlay pointer-events-none z-10" />
                                    )}
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute bottom-8 right-8 z-20 print:hidden">
                                <div className="glass-panel px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl bg-white/90 dark:bg-[#1E293B]/90 border border-white/20">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-slate-400">ATS Score</span>
                                        <span className={`text-xl font-black ${atsScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{atsScore}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                        <div className={`w-3 h-3 rounded-full ${atsScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                    </div>
                                </div>
                            </div>
                        </Panel>

                    </PanelGroup>
                )}
            </div>
        </div>
    );
};

// --- Helpers ---
const MobileTab = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${active === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
    >
        <div className={`p-1 rounded-full mb-1 transition-all ${active === id ? 'bg-indigo-50 dark:bg-white/10 transform scale-110' : ''}`}>
            <Icon className={`w-5 h-5 ${active === id ? 'fill-current' : ''}`} />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </button>
);

export default ResumeEditor;
