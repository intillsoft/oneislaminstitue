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

    // --- LAYOUT ---
    return (
        <div className="h-screen w-screen flex flex-col bg-[#0F1117] text-slate-300 font-sans overflow-hidden">

            {/* 1. Header (Minimal) */}
            <header className="h-14 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/resume/dashboard')} className="p-2 hover:bg-[#30363D] rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-400 font-bold" />
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
                            <span>{resume?.template_id || 'Modern'} Template</span>
                            {saving ? <span className="text-indigo-400">Saving...</span> : <span>Saved {lastSaved?.toLocaleTimeString()}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                    >
                        <Download className="w-3 h-3" /> Export PDF
                    </button>
                </div>
            </header>

            {/* 2. Main Workspace (3-Column Notebook Layout) */}
            <div className="flex-1 flex overflow-hidden">

                {/* COLUMN 1: LEFT HUB (15%) */}
                <div className="hidden lg:flex w-[280px] flex-col border-r border-[#30363D] bg-[#0D1117]">
                    <div className="p-4 border-b border-[#30363D]">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Resume Hub</h3>
                        <div className="space-y-1">
                            <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-md">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-bold truncate max-w-[120px]">{resume?.title}</div>
                                    <div className="text-[10px] text-slate-500">Last edited just now</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Templates</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Modern', 'Professional', 'Executive', 'Creative', 'Technical'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => handleTemplateChange(t.toLowerCase())}
                                    className={`p-2 rounded border text-xs text-left transition-all ${(resume?.template_id || 'modern') === t.toLowerCase()
                                            ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300'
                                            : 'bg-[#161B22] border-[#30363D] hover:border-slate-500'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-[#30363D]">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>ATS Score</span>
                            <span className={`font-bold ${atsScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{atsScore}/100</span>
                        </div>
                        <div className="mt-2 h-1 bg-[#21262D] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${atsScore}%` }} />
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: COMMAND CENTER (50%) */}
                <div className="flex-1 min-w-[320px] max-w-4xl border-r border-[#30363D] bg-[#0F1117] flex flex-col relative">
                    {/* Toggle Switch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#161B22] border border-[#30363D] p-1 rounded-full flex gap-1 shadow-xl">
                        <button
                            onClick={() => setEditorMode('manual')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${editorMode === 'manual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Manual Edit
                        </button>
                        <button
                            onClick={() => setEditorMode('chat')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${editorMode === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Chat</span>
                        </button>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-20">
                        {editorMode === 'manual' ? (
                            <div className="max-w-2xl mx-auto">
                                <ResumeEditorManual
                                    data={resumeData}
                                    onChange={handleDataChange}
                                />
                            </div>
                        ) : (
                            <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">AI Command Center</h2>
                                <p className="text-slate-400 max-w-md">
                                    Describe your target role or paste a job description. I will rewrite your entire resume to match it perfectly.
                                </p>
                                <div className="w-full relative">
                                    <textarea
                                        className="w-full bg-[#161B22] border border-[#30363D] rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                                        placeholder="e.g. 'Tailor my resume for a Senior Product Manager role at Netflix...'"
                                    />
                                    <button className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors">
                                        <Zap className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: VISUAL INTELLIGENCE (35%) */}
                <div className="hidden xl:flex w-[450px] flex-col bg-[#0D1117] border-l border-[#30363D] relative">
                    {/* Visual Toggles */}
                    <div className="h-12 border-b border-[#30363D] flex items-center justify-around px-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overlays:</span>
                            <ToggleIcon
                                active={showVisuals.heatmap}
                                icon={Search}
                                label="Heatmap"
                                onClick={() => setShowVisuals(s => ({ ...s, heatmap: !s.heatmap }))}
                            />
                            <ToggleIcon
                                active={showVisuals.eyeTracking}
                                icon={Eye}
                                label="Eye Track"
                                onClick={() => setShowVisuals(s => ({ ...s, eyeTracking: !s.eyeTracking }))}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 relative bg-[#1F242C]">
                        {/* THE PREVIEW */}
                        <div className="transform scale-[0.65] origin-top shadow-2xl transition-all duration-300 relative group">
                            <ResumePreview
                                data={resumeData}
                                template={resume?.template_id || 'modern'}
                            />

                            {/* OVERLAYS */}
                            {showVisuals.heatmap && (
                                <div className="absolute inset-0 bg-indigo-500/10 mix-blend-multiply pointer-events-none z-10" />
                                /* In prod: Real heatmap logic overlaying spans */
                            )}
                            {showVisuals.eyeTracking && (
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    {/* Mock Eye Tracking Path */}
                                    <svg className="w-full h-full opacity-50">
                                        <path d="M 50 50 L 200 50 L 50 150 L 200 150" stroke="red" strokeWidth="4" fill="none" className="animate-dash" />
                                        <circle cx="50" cy="50" r="10" fill="red" className="animate-ping" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback Footer */}
                    <div className="h-48 border-t border-[#30363D] bg-[#161B22] p-6">
                        <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-400" /> AI Suggestions
                        </h4>
                        <div className="space-y-3">
                            <SuggestionItem label="Add metrics to 'Project Manager' role" difficulty="High Impact" />
                            <SuggestionItem label="Swap 'Responsible for' with 'Orchestrated'" difficulty="Easy Win" />
                        </div>
                    </div>
                </div>

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
