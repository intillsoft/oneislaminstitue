import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout, Sparkles, Eye,
    Download, CheckCircle2,
    FileText, Search, Menu, X, ArrowLeft, Sun, Moon
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../contexts/ThemeContext'; // Import Theme Hook

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
    const { theme, toggleTheme } = useTheme(); // Use Theme Context

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

    // --- AI Request Handler ---
    const [aiRequest, setAiRequest] = useState(null);

    const handleAIRequest = (prompt, context) => {
        // Create a unique request with timestamp to trigger useEffect in ChatPanel
        setAiRequest({
            prompt,
            context,
            timestamp: Date.now()
        });

        // Mobile: Switch to Chat tab
        if (isMobile) {
            setActiveMobileTab('chat');
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

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-workflow-primary"></div></div>;

    // --- RENDER ---
    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text font-sans overflow-hidden transition-colors duration-300">
            {/* 1. Universal Header */}
            <header className="h-14 bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 z-50 shrink-0 shadow-sm relative transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/resume/dashboard')}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-surface-elevated rounded-lg transition-colors text-slate-500 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-dark-border hidden md:block" />
                    <div className="flex flex-col md:flex-row gap-0 md:gap-4 items-start md:items-center">
                        <input
                            value={resume?.title || ''}
                            onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
                            onBlur={() => resumeService.update(id, { title: resume.title })}
                            className="bg-transparent border-none text-slate-900 dark:text-white font-bold text-sm focus:ring-0 p-0 w-32 md:w-48 placeholder-slate-400 dark:placeholder-dark-text-muted transition-all"
                        />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-dark-text-muted md:flex items-center gap-1 hidden">
                            {saving ? <span className="text-blue-500 dark:text-workflow-primary-300">Saving...</span> : <span>Saved</span>}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface-elevated rounded-full transition-colors hidden md:block"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* Mobile Template Dropdown */}
                    <select
                        className="md:hidden bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg text-xs py-1 px-2 text-slate-900 dark:text-white outline-none"
                        value={resume?.template_id || 'modern'}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                        <option value="modern">Modern</option>
                        <option value="executive">Executive</option>
                        <option value="creative">Creative</option>
                        <option value="technical">Technical</option>
                    </select>

                    {/* Desktop Template Toggles */}
                    <div className="hidden md:flex bg-slate-100 dark:bg-dark-bg rounded-lg p-0.5 border border-slate-200 dark:border-dark-border">
                        {['Modern', 'Executive', 'Technical', 'Creative'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleTemplateChange(t.toLowerCase())}
                                className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${(resume?.template_id || 'modern') === t.toLowerCase()
                                    ? 'bg-white dark:bg-workflow-primary text-blue-600 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-dark-bg hover:bg-slate-800 dark:hover:bg-gray-200 text-xs font-bold rounded-full transition-all flex items-center gap-2 border border-transparent shadow-sm"
                    >
                        <Download className="w-3 h-3" /> <span className="hidden md:inline">Export</span>
                    </button>
                </div>
            </header>

            {/* 2. Main Workspace */}
            <div className="flex-1 overflow-hidden relative">
                {isMobile ? (
                    // --- MOBILE LAYOUT (Tabs) ---
                    <div className="flex flex-col h-full">
                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark-bg relative">
                            {activeMobileTab === 'editor' && (
                                <div className="p-4 safe-area-bottom">
                                    <ResumeEditorManual
                                        data={resumeData}
                                        onChange={handleDataChange}
                                        onAIRequest={handleAIRequest}
                                    />
                                </div>
                            )}
                            {activeMobileTab === 'chat' && (
                                <AIChatPanel
                                    currentResume={resumeData}
                                    onUpdateResume={handleDataChange}
                                    aiRequest={aiRequest}
                                />
                            )}
                            {activeMobileTab === 'preview' && (
                                <div className="min-h-full flex justify-center bg-slate-200 dark:bg-dark-bg p-2 overflow-x-hidden">
                                    {/* Simple Scale wrapper for mobile preview */}
                                    {/* Scale down to fit mobile width comfortably */}
                                    <div className="transform scale-[0.40] origin-top-center h-[1400px]">
                                        <ResumePreview data={resumeData} template={resume?.template_id || 'modern'} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Bottom Navigation */}
                        <div className="h-16 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border flex items-center justify-around px-2 shrink-0 z-50">
                            <MobileTab
                                id="editor"
                                label="Editor"
                                icon={FileText}
                                active={activeMobileTab}
                                onClick={setActiveMobileTab}
                            />
                            <div className="w-px h-8 bg-slate-200 dark:bg-dark-border" />
                            <MobileTab
                                id="chat"
                                label="AI Copilot"
                                icon={Sparkles}
                                active={activeMobileTab}
                                onClick={setActiveMobileTab}
                            />
                            <div className="w-px h-8 bg-slate-200 dark:bg-dark-border" />
                            <MobileTab
                                id="preview"
                                label="Preview"
                                icon={Eye}
                                active={activeMobileTab}
                                onClick={setActiveMobileTab}
                            />
                        </div>
                    </div>
                ) : (
                    // --- DESKTOP LAYOUT (Resizable Panels) ---
                    <PanelGroup direction="horizontal" autoSaveId="resume-layout-persistence">

                        {/* LEFT: EDITOR */}
                        <Panel defaultSize={35} minSize={25} collapsible={true} order={1} className="flex flex-col border-r border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg">
                            <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-surface shrink-0">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Editor
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50 dark:bg-dark-bg">
                                <div className="max-w-2xl mx-auto">
                                    <ResumeEditorManual
                                        data={resumeData}
                                        onChange={handleDataChange}
                                        onAIRequest={handleAIRequest}
                                    />
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="w-1 bg-slate-100 dark:bg-dark-bg hover:bg-blue-600 dark:hover:bg-workflow-primary transition-colors cursor-col-resize z-50 flex items-center justify-center">
                            <div className="h-8 w-1 rounded-full bg-slate-300 dark:bg-dark-border" />
                        </PanelResizeHandle>

                        {/* MIDDLE: CHAT */}
                        <Panel defaultSize={25} minSize={20} collapsible={true} order={2} className="flex flex-col border-r border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface">
                            <AIChatPanel
                                currentResume={resumeData}
                                onUpdateResume={handleDataChange}
                                aiRequest={aiRequest}
                            />
                        </Panel>

                        <PanelResizeHandle className="w-1 bg-slate-100 dark:bg-dark-bg hover:bg-blue-600 dark:hover:bg-workflow-primary transition-colors cursor-col-resize z-50 flex items-center justify-center">
                            <div className="h-8 w-1 rounded-full bg-slate-300 dark:bg-dark-border" />
                        </PanelResizeHandle>

                        {/* RIGHT: PREVIEW */}
                        <Panel defaultSize={40} minSize={25} collapsible={true} order={3} className="flex flex-col bg-slate-200 dark:bg-dark-bg relative">
                            <div className="h-12 border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 bg-white dark:bg-dark-surface shrink-0">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest flex items-center gap-2">
                                    <Eye className="w-3 h-3" /> Live Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <ToggleIcon
                                        active={showVisuals.heatmap}
                                        icon={Search}
                                        label="Heatmap"
                                        onClick={() => setShowVisuals(s => ({ ...s, heatmap: !s.heatmap }))}
                                    />
                                    <ToggleIcon
                                        active={showVisuals.ats}
                                        icon={CheckCircle2}
                                        label="ATS Check"
                                        onClick={() => setShowVisuals(s => ({ ...s, ats: !s.ats }))}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-200 dark:bg-dark-bg flex justify-center items-start">
                                <div className="w-full relative group flex justify-center min-h-full">
                                    <ResumePreview
                                        data={resumeData}
                                        template={resume?.template_id || 'modern'}
                                    />
                                    {showVisuals.heatmap && (
                                        <div className="absolute inset-0 bg-blue-600/10 dark:bg-workflow-primary/10 mix-blend-multiply pointer-events-none z-10" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-6 right-6 z-20 print:hidden">
                                <div className="bg-white/90 dark:bg-dark-surface-elevated/90 border border-slate-200 dark:border-dark-border rounded-full px-4 py-2 flex items-center gap-3 shadow-xl backdrop-blur-sm">
                                    <span className="text-xs text-slate-600 dark:text-dark-text-secondary">ATS Score</span>
                                    <span className={`text-sm font-bold ${atsScore >= 80 ? 'text-emerald-600 dark:text-success-500' : 'text-amber-500 dark:text-warning-500'}`}>{atsScore}/100</span>
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
        className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${active === id ? 'text-blue-600 dark:text-workflow-primary' : 'text-slate-500 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-white'}`}
    >
        <Icon className={`w-5 h-5 mb-1 ${active === id ? 'fill-current opacity-20' : ''}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
);

const ToggleIcon = ({ active, icon: Icon, onClick, label }) => (
    <button
        onClick={onClick}
        title={label}
        className={`p-1.5 rounded-lg transition-all ${active ? 'bg-blue-600/10 dark:bg-workflow-primary/20 text-blue-600 dark:text-workflow-primary-300' : 'text-slate-500 dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-border hover:text-slate-900 dark:hover:text-white'}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);

export default ResumeEditor;
