import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Layout, Sparkles, ChevronLeft, Eye, EyeOff,
    Download, History, Settings, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import ResumePreview from './components/ResumePreview';
import ResumeForm from './components/ResumeForm';
import AIAssistantSidebar from './components/AIAssistantSidebar';
import TemplateSelector from './components/TemplateSelector';

// Auto-save delay
const AUTOSAVE_DELAY = 2000;

const ResumeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { success, error: showError } = useToast();

    // State
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [showPreview, setShowPreview] = useState(true);
    const [showAI, setShowAI] = useState(false);
    const [activeSection, setActiveSection] = useState('summary');
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

    // Debounced Save Ref
    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        if (id) {
            loadResume();
        } else if (user) {
            // New Resume Mode: Create draft and redirect
            createNewResume();
        }
    }, [id, user]);

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
            if (data.content_json) {
                setResumeData(data.content_json);
            }
            if (data.ats_score) setAtsScore(data.ats_score);
            setLastSaved(new Date(data.updated_at));
        } catch (error) {
            console.error('Failed to load resume:', error);
            showError('Could not load resume');
            navigate('/resume/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Auto-save logic
    const handleDataChange = useCallback((newData) => {
        setResumeData(newData);

        // Clear existing timeout
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        // Set new timeout for auto-save
        setSaving(true);
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await saveResume(newData, true); // true = silent/auto save
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
                // Calculate basic completeness score locally
                completeness_score: calculateCompleteness(data)
            });

            setLastSaved(new Date());
            setResume(prev => ({ ...prev, ...updatedResume }));

            if (!silent) success('Resume saved successfully');
        } catch (err) {
            if (!silent) showError('Failed to save resume');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const calculateCompleteness = (data) => {
        let score = 0;
        if (data.personalInfo?.name) score += 10;
        if (data.personalInfo?.email) score += 10;
        if (data.summary?.length > 50) score += 15;
        if (data.experience?.length > 0) score += 25;
        if (data.education?.length > 0) score += 15;
        if (data.skills?.length > 0) score += 15;
        if (data.projects?.length > 0) score += 10;
        return score;
    };

    // Handle template change
    const handleTemplateChange = async (templateId) => {
        try {
            await resumeService.update(id, { template: templateId });
            setResume(prev => ({ ...prev, template_id: templateId }));
            success('Template updated');
        } catch (err) {
            showError('Failed to change template');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div></div>;

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
            {/* Premium Floating Header */}
            <div className="px-4 pt-4 pb-2 z-20">
                <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg rounded-2xl flex items-center justify-between px-6 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/resume/dashboard')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors group">
                            <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-white transition-colors" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="font-bold text-lg text-slate-900 dark:text-white truncate max-w-[200px] tracking-tight">{resume?.title}</h1>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                    {resume?.template_id || 'Modern'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                                {saving ? (
                                    <span className="flex items-center gap-1.5 text-indigo-500 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        Saving changes...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-emerald-500">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Saved {lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* ATS Score Indicator */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full border border-slate-200 dark:border-slate-600">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-1.5 h-6 rounded-full transition-all duration-500 ${i === 1 ? (atsScore >= 40 ? 'bg-red-400' : 'bg-slate-300') :
                                        i === 2 ? (atsScore >= 70 ? 'bg-amber-400' : 'bg-slate-300') :
                                            (atsScore >= 90 ? 'bg-emerald-400' : 'bg-slate-300')
                                        }`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">ATS Score: {atsScore}</span>
                        </div>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />

                        <Button
                            variant="ghost"
                            onClick={() => setShowPreview(!showPreview)}
                            className="md:hidden rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>

                        <Button
                            onClick={() => setShowAI(!showAI)}
                            className={`gap-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${showAI
                                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-indigo-200 dark:shadow-none border-transparent'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-indigo-300'}`}
                        >
                            <Sparkles className={`w-4 h-4 ${showAI ? 'animate-pulse' : 'text-indigo-500'}`} />
                            <span className="hidden md:inline font-medium">AI Assistant</span>
                        </Button>


                        <Button variant="primary" className="gap-2 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none bg-blue-600 hover:bg-blue-700 border-none">
                            <Download className="w-4 h-4" />
                            <span className="hidden md:inline font-medium">Export PDF</span>
                        </Button>
                    </div>
                </header>
            </div>

            {/* Resizable Panels Floating Layout */}
            <div className="flex-1 overflow-hidden px-4 pb-4">
                <PanelGroup direction="horizontal" className="h-full gap-4">
                    {/* Editor (Left Pane) - 40% Width as requested */}
                    <Panel defaultSize={40} minSize={30} className={`flex flex-col rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700 shadow-xl overflow-hidden transition-all duration-300 ${!showPreview ? 'w-full' : ''}`}>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0 w-full">
                            <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 p-4 mb-4">
                                <TemplateSelector
                                    currentTemplate={resume?.template_id}
                                    onSelect={handleTemplateChange}
                                />
                            </div>

                            <div className="px-6 pb-20">
                                <ResumeForm
                                    data={resumeData}
                                    onChange={handleDataChange}
                                    activeSection={activeSection}
                                    setActiveSection={setActiveSection}
                                />
                            </div>
                        </div>
                    </Panel>

                    {/* Resize Handle */}
                    {showPreview && (
                        <PanelResizeHandle className="w-4 flex items-center justify-center outline-none group -ml-2 -mr-2 z-20 cursor-col-resize">
                            <div className="h-16 w-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-indigo-500 group-hover:w-2 transition-all shadow-sm" />
                        </PanelResizeHandle>
                    )}

                    {/* Preview (Right Pane) - 60% Width as requested */}
                    {showPreview && (
                        <Panel defaultSize={60} minSize={30} className="rounded-2xl bg-slate-100 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden relative group">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                            {/* Zoom Controls Overlay (New) */}
                            <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-full shadow-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Zoom Out">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                </button>
                                <span className="text-xs font-medium w-12 text-center">100%</span>
                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Zoom In">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                </button>
                            </div>

                            <div className="h-full overflow-y-auto custom-scrollbar p-8 flex justify-center relative">
                                <div className="transform origin-top scale-90 lg:scale-95 xl:scale-100 select-none pointer-events-none lg:pointer-events-auto transition-transform duration-300 shadow-2xl">
                                    <ResumePreview
                                        data={resumeData}
                                        template={resume?.template_id}
                                    />
                                </div>
                            </div>
                        </Panel>
                    )}
                </PanelGroup>
            </div>

            {/* AI Assistant Sidebar */}
            <AnimatePresence>
                {showAI && (
                    <AIAssistantSidebar
                        resumeData={resumeData}
                        onUpdate={handleDataChange}
                        onClose={() => setShowAI(false)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default ResumeEditor;
