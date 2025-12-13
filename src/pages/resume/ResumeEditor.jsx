import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Layout, Sparkles, ChevronLeft, Eye, EyeOff,
    Download, History, Settings, CheckCircle2, AlertCircle
} from 'lucide-react';
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
        if (id && user) {
            loadResume();
        }
    }, [id, user]);

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
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0B1120] overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/resume/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{resume?.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {saving ? (
                                <span className="flex items-center gap-1 text-workflow-primary">
                                    <div className="w-3 h-3 rounded-full border-2 border-workflow-primary border-t-transparent animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Saved {lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <div className={`w-2 h-2 rounded-full ${atsScore >= 70 ? 'bg-green-500' : atsScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ATS Score: {atsScore}</span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setShowPreview(!showPreview)}
                        className="md:hidden"
                    >
                        {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setShowAI(!showAI)}
                        className={`gap-2 ${showAI ? 'border-workflow-primary text-workflow-primary bg-workflow-primary/10' : ''}`}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden md:inline">AI Assistant</span>
                    </Button>

                    <Button variant="primary" className="gap-2">
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">Export</span>
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Editor (Left Pane) */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${showPreview ? 'hidden md:block md:w-1/2 lg:w-5/12' : 'w-full'}`}>
                    <div className="p-6 max-w-3xl mx-auto space-y-8">
                        <TemplateSelector
                            currentTemplate={resume?.template_id}
                            onSelect={handleTemplateChange}
                        />

                        <ResumeForm
                            data={resumeData}
                            onChange={handleDataChange}
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        />
                    </div>
                </div>

                {/* Preview (Right Pane) */}
                <AnimatePresence>
                    {(showPreview || window.innerWidth >= 768) && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`fixed inset-0 top-16 md:static bg-gray-100 dark:bg-[#080C17] border-l border-gray-200 dark:border-gray-800 overflow-y-auto custom-scrollbar flex-1 z-10 ${!showPreview ? 'hidden md:block' : ''}`}
                        >
                            <div className="h-full flex items-center justify-center p-4 lg:p-10 min-h-[1000px]">
                                <div className="transform scale-[0.85] lg:scale-100 origin-top transition-transform h-full">
                                    <ResumePreview
                                        data={resumeData}
                                        template={resume?.template_id}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
        </div>
    );
};

export default ResumeEditor;
