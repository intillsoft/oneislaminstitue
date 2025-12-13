import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Layout, Sparkles, ChevronLeft, Eye, EyeOff,
    Download, History, Settings, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { resumeService } from '../../services/resumeService';
import { pdfExporter } from '../../services/pdfExporter';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import useDebounce from '../../hooks/useDebounce';
import Button from '../../components/ui/Button';
import ResumePreview from './components/ResumePreview';
import ResumeForm from './components/ResumeForm';
import AIAssistantSidebar from './components/AIAssistantSidebar';
import TemplateSelector from './components/TemplateSelector';
import ATSScoreCard from '../../components/resume-builder/ATSScoreCard';
import '../../styles/resume-layout.css';

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
    const [isExporting, setIsExporting] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [resumeData, setResumeData] = useState({
        personalInfo: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
    });

    const resumePreviewRef = useRef(null);

    // Debounce the resume data for auto-saving
    const debouncedResumeData = useDebounce(resumeData, AUTOSAVE_DELAY);

    // Analytics State
    const [atsScore, setAtsScore] = useState(0);

    useEffect(() => {
        if (id) {
            loadResume();
        } else if (user) {
            // New Resume Mode: Create draft and redirect
            createNewResume();
        }
    }, [id, user]);

    // Auto-save effect
    useEffect(() => {
        if (debouncedResumeData && id && !loading) {
            saveResume(debouncedResumeData, true);
        }
    }, [debouncedResumeData]);

    // Calculate ATS Score Effect (Mock Logic for now)
    useEffect(() => {
        let score = 0;
        if (resumeData.personalInfo?.name) score += 10;
        if (resumeData.personalInfo?.email) score += 10;
        if (resumeData.summary?.length > 50) score += 15;
        if (resumeData.experience?.length > 0) score += 25;
        if (resumeData.education?.length > 0) score += 15;
        if (resumeData.skills?.length > 0) score += 15;
        if (resumeData.projects?.length > 0) score += 10;
        setAtsScore(Math.min(score, 100)); // Cap at 100
    }, [resumeData]);

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

    const handleDataChange = useCallback((newData) => {
        setResumeData(newData);
        // Note: Auto-save handled by useEffect on debouncedData
    }, []);

    const saveResume = async (data = resumeData, silent = false) => {
        if (!id) return;
        try {
            setSaving(true);
            const updatedResume = await resumeService.update(id, {
                content: data,
                completeness_score: atsScore, // Sync local score
                ats_score: atsScore
            });

            setLastSaved(new Date());
            setResume(prev => ({ ...prev, ...updatedResume }));

            if (!silent) success('Resume saved successfully');
        } catch (err) {
            if (!silent) showError('Failed to save resume');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async () => {
        if (!resumePreviewRef.current) return;

        setIsExporting(true);
        try {
            // Find the actual resume paper element
            const element = resumePreviewRef.current.querySelector('.resume-template');
            // OR pass the wrapper if template class isn't strictly there
            // But we need to be specific to avoid capturing background

            // Fallback to the wrapper ref if class not found, but it might include padding
            const target = element || resumePreviewRef.current;

            const result = await pdfExporter.exportResume(target, resumeData);
            if (result.success) {
                success('Resume exported successfully');
            } else {
                showError('Failed to export PDF');
            }
        } catch (error) {
            showError('Export failed');
            console.error(error);
        } finally {
            setIsExporting(false);
        }
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

    // Strict Layout Implementation
    return (
        <div className="resume-builder-container">
            {/* Global Styles */}
            <link rel="stylesheet" href="/src/styles/resume-layout.css" />

            {/* EDITOR PANEL - FIXED WIDTH 420px */}
            <div className="editor-panel custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4 mb-6 pt-2">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/resume/dashboard')}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            {saving ? (
                                <span className="text-xs font-medium text-indigo-500 animate-pulse">Saving...</span>
                            ) : (
                                <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Saved
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-slate-900 truncate pr-4">
                            {resume?.title || 'Untitled Resume'}
                        </h1>
                        <TemplateSelector
                            currentTemplate={resume?.template_id}
                            onSelect={handleTemplateChange}
                        />
                    </div>
                </div>

                {/* Form Content */}
                <div className="pb-24">
                    <ResumeForm
                        data={resumeData}
                        onChange={handleDataChange}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                </div>
            </div>

            {/* PREVIEW PANEL - TAKE REMAINING SPACE */}
            <div className="preview-panel flex-col items-center">

                {/* PDF Export & AI Controls Header */}
                <div className="w-full max-w-[8.5in] flex items-center justify-between mb-6 px-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setShowAI(!showAI)}
                            className={`gap-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${showAI
                                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-indigo-200 border-transparent'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'}`}
                        >
                            <Sparkles className={`w-4 h-4 ${showAI ? 'animate-pulse' : 'text-indigo-500'}`} />
                            <span className="hidden md:inline font-medium">AI Assistant</span>
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        className="gap-2 rounded-xl shadow-lg shadow-blue-200 bg-blue-600 hover:bg-blue-700 border-none"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        <span className="hidden md:inline font-medium">
                            {isExporting ? 'Exporting...' : 'Export PDF'}
                        </span>
                    </Button>
                </div>

                {/* ATS Score Card - ABSOLUTE POSITIONED or Sticky */}
                <div className="absolute top-6 right-6 z-20 hidden xl:block w-80">
                    <ATSScoreCard
                        score={atsScore}
                        formattingScore={Math.min(50, Math.floor(atsScore / 2))}
                        keywordsScore={Math.min(50, Math.ceil(atsScore / 2))}
                    />
                </div>

                {/* Desktop Zoom Controls */}
                <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-lg p-1.5 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Zoom Out">
                        <span className="text-lg leading-none">-</span>
                    </button>
                    <span className="text-xs font-medium w-12 text-center">100%</span>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Zoom In">
                        <span className="text-lg leading-none">+</span>
                    </button>
                </div>

                {/* The Paper */}
                <div className="resume-paper transform-gpu origin-top" ref={resumePreviewRef}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-400">Loading preview...</div>
                    ) : (
                        <ResumePreview
                            data={resumeData}
                            template={resume?.template_id}
                        />
                    )}
                </div>
            </div>

            {/* MOBILE: Floating Preview Button */}
            <button
                className="floating-preview-button md:hidden"
                onClick={() => setShowPreview(true)}
            >
                <Eye className="w-6 h-6" />
            </button>

            {/* MOBILE: Full Screen Preview Modal */}
            {showPreview && (
                <div className="mobile-preview-modal md:hidden">
                    <div className="sticky top-0 z-[1000] flex items-center justify-between p-4 bg-white border-b border-gray-200 mb-4 rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-900">Preview</h3>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowPreview(false)}
                            >
                                <Layout className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <Button size="sm" variant="primary" onClick={handleExport} disabled={isExporting}>
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-center pb-20">
                        <div className="resume-paper transform scale-90 origin-top">
                            <ResumePreview
                                data={resumeData}
                                template={resume?.template_id}
                            />
                        </div>
                    </div>
                </div>
            )}

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
