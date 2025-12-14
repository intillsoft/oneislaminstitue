import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Layout, Sparkles, ChevronLeft, Eye, EyeOff,
    Download, History, Settings, CheckCircle2, AlertCircle,
    FileText, User, Search, Maximize2, Zap
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

// V2 Components
import ResumePreview from './components/ResumePreview';
import ResumeEditorManual from './components/ResumeEditorManual';
import TemplateSelector from './components/TemplateSelector';
import AIChatPanel from './components/AIChatPanel';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

// Auto-save delay
const AUTOSAVE_DELAY = 1000;

const ResumeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();

    // --- State ---
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // UI Layout State
    const [activeTab, setActiveTab] = useState('editor'); // For mobile
    const [showVisuals, setShowVisuals] = useState({
        heatmap: false,
        eyeTracking: false,
        ats: false
    });

    // Toggle for Center Column Mode
    const [editorMode, setEditorMode] = useState('manual'); // 'manual' | 'chat'

    const [resumeData, setResumeData] = useState({
        personalInfo: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
    });

    // Analytics State
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

    // Auto-save Logic
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

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

    // --- SEARCH / VISUALS / STATE --- 
    // Use refs for imperative panel control if needed (optional)
    // import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'; (Added to imports)

    // --- LAYOUT ---
    return (
        <div className="h-screen w-screen flex flex-col bg-[#0F1117] text-slate-300 font-sans overflow-hidden">

            {/* 1. Header (Minimal) */}
            <header className="h-14 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between px-4 z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/resume/dashboard')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#30363D] rounded-lg transition-colors text-slate-400 hover:text-white">
                        <Layout className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">My Resumes</span>
                    </button>
                    <div className="h-6 w-px bg-[#30363D]" />
                    <div>
                        <input
                            value={resume?.title || ''}
                            onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
                            onBlur={() => resumeService.update(id, { title: resume.title })}
                            className="bg-transparent border-none text-white font-bold text-sm focus:ring-0 p-0 w-48"
                        />
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            {saving ? <span className="text-indigo-400">Saving...</span> : <span>Saved</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-[#21262D] rounded-lg p-0.5">
                        {['Modern', 'Executive', 'Technical', 'Creative'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleTemplateChange(t.toLowerCase())}
                                className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${(resume?.template_id || 'modern') === t.toLowerCase()
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-1.5 bg-white text-slate-900 hover:bg-slate-200 text-xs font-bold rounded-full transition-all flex items-center gap-2"
                    >
                        <Download className="w-3 h-3" /> Export
                    </button>
                </div>
            </header>

            {/* 2. Main Workspace (Resizable 3-Panel Layout) */}
            <div className="flex-1 overflow-hidden relative">
                <PanelGroup direction="horizontal" autoSaveId="resume-layout-persistence">

                    {/* LEFT PANEL: EDITOR (Collapsible) */}
                    <Panel defaultSize={35} minSize={20} collapsible={true} order={1} className="flex flex-col border-r border-[#30363D] bg-[#0F1117]">
                        <div className="p-4 border-b border-[#30363D] flex justify-between items-center bg-[#161B22] shrink-0">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Editor
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-600">Markdown Supported</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <div className="max-w-2xl mx-auto">
                                <ResumeEditorManual
                                    data={resumeData}
                                    onChange={handleDataChange}
                                />
                            </div>
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-[#0D1117] hover:bg-indigo-500 transition-colors cursor-col-resize z-50 flex items-center justify-center">
                        <div className="h-8 w-1 rounded-full bg-[#30363D]" />
                    </PanelResizeHandle>

                    {/* MIDDLE PANEL: CHAT / COMMAND CENTER (Collapsible) */}
                    <Panel defaultSize={25} minSize={20} collapsible={true} order={2} className="flex flex-col border-r border-[#30363D] bg-[#161B22]">
                        <div className="p-4 border-b border-[#30363D] flex justify-between items-center shrink-0">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> AI Copilot
                            </h3>
                        </div>
                        <AIChatPanel
                            currentResume={resumeData}
                            onUpdateResume={handleDataChange}
                        />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-[#0D1117] hover:bg-indigo-500 transition-colors cursor-col-resize z-50 flex items-center justify-center">
                        <div className="h-8 w-1 rounded-full bg-[#30363D]" />
                    </PanelResizeHandle>

                    {/* RIGHT PANEL: LIVE PREVIEW (Collapsible) */}
                    <Panel defaultSize={40} minSize={20} collapsible={true} order={3} className="flex flex-col bg-[#0D1117] relative">
                        <div className="h-12 border-b border-[#30363D] flex items-center justify-between px-4 bg-[#161B22] shrink-0">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
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

                        <div className="flex-1 overflow-y-auto p-8 relative bg-[#1F242C] flex justify-center">
                            <div className="transform scale-[0.7] origin-top shadow-2xl transition-all duration-300 relative group w-full max-w-[800px]">
                                <ResumePreview
                                    data={resumeData}
                                    template={resume?.template_id || 'modern'}
                                />
                                {showVisuals.heatmap && (
                                    <div className="absolute inset-0 bg-indigo-500/10 mix-blend-multiply pointer-events-none z-10" />
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6 z-20">
                            <div className="bg-[#161B22] border border-[#30363D] rounded-full px-4 py-2 flex items-center gap-3 shadow-xl">
                                <span className="text-xs text-slate-400">ATS Score</span>
                                <span className={`text-sm font-bold ${atsScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{atsScore}/100</span>
                            </div>
                        </div>
                    </Panel>

                </PanelGroup>
            </div>
        </div>
    );
};

// UI Helpers
const ToggleIcon = ({ active, icon: Icon, onClick, label }) => (
    <button
        onClick={onClick}
        title={label}
        className={`p-1.5 rounded-lg transition-all ${active ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:bg-[#30363D]'}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);

const SuggestionItem = ({ label, difficulty }) => (
    <div className="flex items-center justify-between p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase">{difficulty}</span>
    </div>
);

export default ResumeEditor;
