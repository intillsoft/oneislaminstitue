import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout, Sparkles, Eye,
    Download, CheckCircle2,
    FileText, Search, Menu, X, ArrowLeft
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

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

    if (loading) return <div className="h-screen flex items-center justify-center bg-dark-bg text-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-workflow-primary"></div></div>;

    // --- RENDER ---
    return (
        <div className="h-screen w-screen flex flex-col bg-dark-bg text-dark-text font-sans overflow-hidden">
            {/* HEADER AND BODY WILL BE INSERTED HERE */}
        </div>
    );
};

// --- Helpers ---
const MobileTab = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${active === id ? 'text-workflow-primary' : 'text-dark-text-secondary hover:text-white'}`}
    >
        <Icon className={`w-5 h-5 mb-1 ${active === id ? 'fill-current opacity-20' : ''}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
);

const ToggleIcon = ({ active, icon: Icon, onClick, label }) => (
    <button
        onClick={onClick}
        title={label}
        className={`p-1.5 rounded-lg transition-all ${active ? 'bg-workflow-primary/20 text-workflow-primary-300' : 'text-dark-text-secondary hover:bg-dark-border hover:text-white'}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);

export default ResumeEditor;
