import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout, Sparkles, Eye,
    Download, CheckCircle2,
    FileText, Search, Menu, X, ArrowLeft, ArrowRight, Sun, Moon, Zap,
    Maximize2, Minimize2, Sidebar as SidebarIcon, MessageSquare, ChevronLeft, ChevronRight, PanelLeftClose
} from 'lucide-react';
import { format } from 'date-fns';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Visibility Toggles for NotebookLM Style
    const [panels, setPanels] = useState({
        sources: true,
        chat: true,
        preview: true
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- State ---
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const [resumeData, setResumeData] = useState({
        personalInfo: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
    });

    // --- History & Versioning ---
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [versions, setVersions] = useState([]);
    const [showVersions, setShowVersions] = useState(false);

    // UI State
    const [showExportModal, setShowExportModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [atsScore, setAtsScore] = useState(0);
    const [showVisuals, setShowVisuals] = useState({ ats: true, heatmap: false });

    const saveTimeoutRef = useRef(null);
    const chatPanelRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
        if (id) {
            loadResume();
        } else if (user) {
            createNewResume();
        }
    }, [id, user]);

    // Update history when data changes significantly
    const updateHistory = useCallback((data) => {
        const dataStr = JSON.stringify(data);
        setHistory(prev => {
            if (prev[historyIndex] === dataStr) return prev;
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(dataStr);
            if (newHistory.length > 50) newHistory.shift();
            return newHistory;
        });
        setHistoryIndex(prev => {
            const next = prev + 1;
            return next > 49 ? 49 : next;
        });
    }, [historyIndex]);

    const undo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            const prevData = JSON.parse(history[prevIndex]);
            setResumeData(prevData);
            setHistoryIndex(prevIndex);
            saveResume(prevData, true);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            const nextData = JSON.parse(history[nextIndex]);
            setResumeData(nextData);
            setHistoryIndex(nextIndex);
            saveResume(nextData, true);
        }
    };

    const createSnapshot = () => {
        const newVersion = {
            id: Date.now(),
            timestamp: new Date(),
            data: JSON.parse(JSON.stringify(resumeData)),
            label: `Version ${versions.length + 1}`
        };
        setVersions(prev => [newVersion, ...prev]);
        success('Checkpoint created');
    };

    const restoreVersion = (version) => {
        setResumeData(version.data);
        updateHistory(version.data);
        saveResume(version.data);
        setShowVersions(false);
        success(`Restored ${version.label}`);
    };

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
            success('Draft started');
            navigate(`/resume/edit/${newResume.id}`, { replace: true });
        } catch (error) {
            showError('Initialization failed');
            navigate('/resume/dashboard');
        }
    };

    const loadResume = async () => {
        try {
            setLoading(true);
            const data = await resumeService.getById(id);
            setResume(data);
            if (data.content_json) {
                setResumeData(data.content_json);
                setHistory([JSON.stringify(data.content_json)]);
                setHistoryIndex(0);
            }
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
                updateHistory(newData);
            } catch (err) {
                console.error('Autosave error:', err);
            }
        }, AUTOSAVE_DELAY);
    }, [id, updateHistory]);

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
            if (!silent) success('Synchronized');
        } catch (err) {
            if (!silent) showError('Sync failed');
        } finally {
            setSaving(false);
        }
    };

    const calculateCompleteness = (data) => {
        let score = 0;
        if (data.personalInfo?.name) score += 10;
        if (data.summary?.length > 50) score += 20;
        if (data.experience?.length > 0) score += 40;
        if (data.skills?.length > 0) score += 30;
        return score;
    };

    const handleAITrigger = (prompt) => {
        if (chatPanelRef.current) {
            chatPanelRef.current.triggerAction(prompt);
        }
    };

    const togglePanel = (panel) => {
        setPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
    };

    if (loading) return (
        <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-[#000d2b]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-workflow-primary/10 flex items-center justify-center animate-pulse">
                    <Zap className="text-workflow-primary animate-bounce" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Initializing Engine</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text font-sans overflow-hidden selection:bg-workflow-primary/30">

            {/* Header: Global Control Bar */}
            {/* Sub-Header / Toolbar */}
            <div className="h-14 bg-[#0A1628]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-40 shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/resume/dashboard')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group bg-white/5 shadow-lg"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
                    </button>

                    <div className="h-6 w-px bg-white/10" />

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <input
                                value={resume?.title || ''}
                                onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
                                onBlur={() => resumeService.update(id, { title: resume.title })}
                                className="bg-transparent border-none text-white font-black text-sm focus:ring-0 p-0 w-48 truncate uppercase tracking-tight"
                                placeholder="RESUME EDITOR"
                            />
                            {saving && <Zap className="w-3 h-3 text-workflow-primary animate-pulse" />}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            {saving ? 'Synchronizing Neural Link...' : 'AI-Enhanced Career Architect'}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Optimized Toolbar for MainLayout Integration */}
                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                    <PanelToggle active={panels.sources} onClick={() => togglePanel('sources')} icon={FileText} label="Editor" />
                    <PanelToggle active={panels.chat} onClick={() => togglePanel('chat')} icon={MessageSquare} label="AI Guide" />
                    <PanelToggle active={panels.preview} onClick={() => togglePanel('preview')} icon={Eye} label="Notebook" />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowVersions(!showVersions)}
                        className={`p-2.5 rounded-xl transition-all ${showVersions ? 'bg-workflow-primary/20 text-workflow-primary border border-workflow-primary/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Neural Snapshots"
                    >
                        <Layout size={18} />
                    </button>
                    {/* PRINT STYLES */}
                    <style>{`
                        @media print {
                            @page { margin: 0; size: auto; }
                            body * { visibility: hidden; }
                            #resume-preview-section, #resume-preview-section * { visibility: visible; }
                            #resume-preview-section {
                                position: fixed; left: 0; top: 0; width: 100%; height: 100%;
                                z-index: 9999; margin: 0; padding: 0; overflow: visible;
                                background: white !important; color: black !important;
                            }
                        }
                    `}</style>
                    <button onClick={() => setShowExportModal(true)} className="h-10 px-6 bg-workflow-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 shadow-lg shadow-workflow-primary/20 transition-all flex items-center gap-2 group">
                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Export Resume
                    </button>
                </div>
            </div>

            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                resumeData={resumeData}
                title={resume?.title}
            />

            {/* Main Workspace Area */}
            <main className="flex-1 overflow-hidden relative">
                <PanelGroup direction="horizontal">

                    {/* LEFT: SOURCES (Manual Editor) */}
                    {panels.sources && (
                        <>
                            <Panel defaultSize={25} minSize={20} className="flex flex-col bg-white dark:bg-[#000d2b]/40">
                                <PanelHeader icon={FileText} title="Document Sources" onHide={() => togglePanel('sources')} />
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                    <ResumeEditorManual data={resumeData} onChange={handleDataChange} onAIAction={handleAITrigger} />
                                </div>
                            </Panel>
                            <VerticalHandle />
                        </>
                    )}

                    {/* MIDDLE: AI INTERFACE */}
                    {panels.chat && (
                        <>
                            <Panel defaultSize={35} minSize={25} className="flex flex-col bg-slate-50/50 dark:bg-dark-surface/10 backdrop-blur-3xl">
                                <PanelHeader icon={Sparkles} title="AI Analysis & Chat" onHide={() => togglePanel('chat')} />
                                <AIChatPanel
                                    ref={chatPanelRef}
                                    currentResume={resumeData}
                                    onUpdateResume={handleDataChange}
                                    onThinking={(state) => setIsGenerating(state)}
                                />
                            </Panel>
                            <VerticalHandle />
                        </>
                    )}

                    {/* RIGHT: NOTEBOOK (Preview) */}
                    {panels.preview && (
                        <Panel defaultSize={40} minSize={30} className="flex flex-col bg-slate-100 dark:bg-black/40 relative">
                            <PanelHeader
                                icon={Eye}
                                title="Live Notebook"
                                onHide={() => togglePanel('preview')}
                                utility={(
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowVisuals(s => ({ ...s, ats: !s.ats }))} className={`p-1 rounded ${showVisuals.ats ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>
                                            <CheckCircle2 size={14} />
                                        </button>
                                        <button onClick={() => setShowVisuals(s => ({ ...s, heatmap: !s.heatmap }))} className={`p-1 rounded ${showVisuals.heatmap ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>
                                            <Zap size={14} />
                                        </button>
                                    </div>
                                )}
                            />
                            <div className="flex-1 overflow-y-auto p-4 md:p-12 flex justify-center items-start relative custom-scrollbar bg-slate-200/50 dark:bg-black/20">
                                <div id="resume-preview-section" className="w-full max-w-4xl origin-top-center transition-all duration-500 scale-[0.85] lg:scale-100 shadow-2xl">
                                    <ResumePreview
                                        data={resumeData}
                                        template={resume?.template_id || 'modern'}
                                        isGenerating={isGenerating}
                                        onUpdate={handleDataChange}
                                    />
                                    {showVisuals.heatmap && <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none rounded-lg" />}
                                </div>
                            </div>

                            {/* Score Overlay - Fixed to bottom of panel */}
                            <div className="absolute bottom-6 right-6 z-20">
                                <div className="bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">ATS Grade</span>
                                        <span className={`text-lg font-black ${atsScore >= 80 ? 'text-emerald-500' : 'text-workflow-primary'}`}>{atsScore}%</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${atsScore >= 80 ? 'border-emerald-500' : 'border-workflow-primary'}`}>
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${atsScore >= 80 ? 'bg-emerald-500' : 'bg-workflow-primary'}`} />
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    )}

                </PanelGroup>

                {/* VERSION CONTROL SIDEBAR */}
                <AnimatePresence>
                    {showVersions && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="absolute inset-y-0 right-0 w-80 bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-white/10 z-[110] shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Version History</h2>
                                <button onClick={() => setShowVersions(false)} className="text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <button
                                onClick={createSnapshot}
                                className="w-full py-3 mb-6 bg-workflow-primary/10 text-workflow-primary border border-workflow-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-workflow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={14} /> Create Checkpoint
                            </button>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                {versions.length === 0 ? (
                                    <div className="text-center py-10 opacity-30 italic text-xs">No snapshots saved yet.</div>
                                ) : (
                                    versions.map((v) => (
                                        <div
                                            key={v.id}
                                            className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-workflow-primary/30 group cursor-pointer transition-all"
                                            onClick={() => restoreVersion(v)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{v.label}</span>
                                                <span className="text-[8px] font-bold text-slate-400">{format(v.timestamp, 'HH:mm:ss')}</span>
                                            </div>
                                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">{format(v.timestamp, 'MMM d, yyyy')}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Floating ChatGPT-style toggles for collapsed panels */}
                <AnimatePresence>
                    {!panels.sources && (
                        <PanelFloatingToggle
                            onClick={() => togglePanel('sources')}
                            icon={FileText}
                            label="Restore Editor"
                            position="left"
                        />
                    )}
                    {!panels.chat && (
                        <PanelFloatingToggle
                            onClick={() => togglePanel('chat')}
                            icon={MessageSquare}
                            label="Restore AI Chat"
                            position="bottom"
                        />
                    )}
                    {!panels.preview && (
                        <PanelFloatingToggle
                            onClick={() => togglePanel('preview')}
                            icon={Eye}
                            label="Restore Preview"
                            position="right"
                        />
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

// --- ELITE COMPONENTS ---

// --- UTILS ---
const PanelToggle = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-300 ${active
            ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5'
            }`}
    >
        <Icon size={14} className={active ? 'text-workflow-primary' : ''} />
        <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{label}</span>
    </button>
);

const PanelHeader = ({ icon: Icon, title, onHide, utility }) => (
    <div className="h-10 px-4 flex items-center justify-between bg-white/5 border-b border-white/5 shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center">
                <Icon size={12} className="text-workflow-primary" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</span>
        </div>
        <div className="flex items-center gap-2">
            {utility}
            <button onClick={onHide} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white">
                <PanelLeftClose size={14} />
            </button>
        </div>
    </div>
);

const PanelFloatingToggle = ({ onClick, icon: Icon, label, position }) => {
    const positionClasses = {
        left: "left-0 top-[20%] rounded-r-2xl",
        right: "right-0 top-[20%] rounded-l-2xl",
        bottom: "bottom-10 left-1/2 -translate-x-1/2 rounded-2xl"
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClick}
            className={`fixed z-[100] p-4 bg-workflow-primary text-white shadow-[0_0_30px_rgba(0,70,255,0.4)] hover:scale-105 active:scale-95 transition-all border border-white/20 group ${positionClasses[position]}`}
        >
            <Icon size={18} />
            <div className={`absolute ${position === 'left' ? 'left-full ml-3' : position === 'right' ? 'right-full mr-3' : '-top-12 left-1/2 -translate-x-1/2'} px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10`}>
                {label}
            </div>
        </motion.button>
    );
};

const VerticalHandle = () => (
    <PanelResizeHandle className="w-px bg-slate-200 dark:bg-white/5 hover:bg-workflow-primary transition-all cursor-col-resize group relative z-[50]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white dark:bg-[#000d2b] border border-slate-200 dark:border-white/10 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
    </PanelResizeHandle>
);

const ExportModal = ({ isOpen, onClose, resumeData, title }) => {
    if (!isOpen) return null;

    const exportOptions = [
        { label: 'PDF Document', icon: FileText, desc: 'Professional vector PDF', action: () => window.print() },
        {
            label: 'JSON Data', icon: Layout, desc: 'Raw data export', action: () => {
                const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title || 'resume'}.json`;
                a.click();
            }
        },
        { label: 'Share Link', icon: Download, desc: 'Public view link', action: () => navigator.clipboard.writeText(window.location.href) },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Export Architect</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {exportOptions.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => { opt.action(); onClose(); }}
                            className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-workflow-primary/5 hover:border-workflow-primary/30 border border-transparent transition-all group text-left"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <opt.icon className="text-slate-500 group-hover:text-workflow-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{opt.label}</h3>
                                <p className="text-xs text-slate-500 font-medium">{opt.desc}</p>
                            </div>
                            <ArrowRight className="ml-auto text-slate-300 group-hover:text-workflow-primary group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default ResumeEditor;
