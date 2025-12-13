import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Plus, MoreVertical, Star, Clock,
    Download, Trash2, Copy, BarChart3, Search,
    Briefcase, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

const ResumeDashboard = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadResumes();
    }, [user]);

    const loadResumes = async () => {
        try {
            setLoading(true);
            const data = await resumeService.getAll();
            setResumes(data);
        } catch (error) {
            console.error('Failed to load resumes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        try {
            await resumeService.delete(id);
            setResumes(prev => prev.filter(r => r.id !== id));
            success('Resume deleted successfully');
        } catch (error) {
            showError('Failed to delete resume');
        }
    };

    const handleDuplicate = async (resume, e) => {
        e.stopPropagation();
        try {
            const newResume = await resumeService.create({
                title: `${resume.title} (Copy)`,
                content: resume.content_json,
                template: resume.template_id,
                atsScore: resume.ats_score
            });
            setResumes(prev => [newResume, ...prev]);
            success('Resume duplicated successfully');
        } catch (error) {
            showError('Failed to duplicate resume');
        }
    };

    const filteredResumes = resumes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            My Resumes
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage your professional documents and track their performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-workflow-primary"
                            />
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard/resume-generator')}
                            className="flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4 text-workflow-primary" />
                            <span className="hidden sm:inline">AI Generator</span>
                        </Button>

                        <Button
                            onClick={() => navigate('/resume/new')}
                            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Create New
                        </Button>
                    </div>
                </div>

                {/* Templates Library Section (New) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Start from a Template</h2>
                        <button className="text-sm text-workflow-primary hover:text-blue-700 font-medium">View All Templates</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {['Modern', 'Executive', 'Tech', 'Creative', 'Minimal'].map((template) => (
                            <motion.button
                                key={template}
                                whileHover={{ y: -4 }}
                                onClick={() => navigate('/resume/new')}
                                className="group flex flex-col items-start text-left bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-workflow-primary hover:shadow-lg transition-all"
                            >
                                <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-900 relative">
                                    {/* Mock Preview */}
                                    <div className="absolute inset-2 bg-white dark:bg-gray-800 shadow-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-3 w-full">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{template}</h3>
                                    <p className="text-xs text-gray-500">Professional</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Recent Resumes Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Resumes</h2>
                        {/* Filter controls could go here */}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => <ResumeSkeleton key={i} />)}
                        </div>
                    ) : filteredResumes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {filteredResumes.map((resume) => (
                                    <ResumeCard
                                        key={resume.id}
                                        resume={resume}
                                        onDelete={handleDelete}
                                        onDuplicate={handleDuplicate}
                                        onClick={() => navigate(`/resume/edit/${resume.id}`)}
                                    />
                                ))}
                            </AnimatePresence>
                            {/* Create New Card moved to end of grid */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/resume/new')}
                                className="flex flex-col items-center justify-center min-h-[280px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-workflow-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group bg-transparent"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-workflow-primary" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">New Resume</h3>
                                <p className="text-sm text-gray-500 mt-1">Start from scratch or use AI</p>
                            </motion.button>
                        </div>
                    ) : (
                        <EmptyState onAction={() => navigate('/resume/new')} />
                    )}
                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const ResumeCard = ({ resume, onDelete, onDuplicate, onClick }) => {
    const [showMenu, setShowMenu] = useState(false);
    const scoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
        if (score >= 60) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClick}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all cursor-pointer"
        >
            {/* Preview Image / Placeholder */}
            <div className="h-40 bg-gray-100 dark:bg-gray-900 relative overflow-hidden flex items-center justify-center">
                {resume.thumbnail ? (
                    <img src={resume.thumbnail} alt="" className="w-full h-full object-cover top-0" />
                ) : (
                    <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900">
                        Edit
                    </Button>
                    <Button variant="primary" size="sm">
                        Preview
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4" title={resume.title}>
                            {resume.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Edited {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-6 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 text-sm">
                                    <button onClick={(e) => onDuplicate(resume, e)} className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        <Copy className="w-4 h-4" /> Duplicate
                                    </button>
                                    <button className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        <Download className="w-4 h-4" /> Download PDF
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                                    <button onClick={(e) => onDelete(resume.id, e)} className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600">
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Tags & Score */}
                <div className="flex items-center justify-between mt-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${scoreColor(resume.ats_score || 0)}`}>
                        <BarChart3 className="w-3 h-3" />
                        ATS: {resume.ats_score || 'N/A'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                        {resume.template_id || 'Modern'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const StatsCard = ({ icon: Icon, label, value, color, suffix, subtext }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                    {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
                </h3>
            </div>
            {subtext && <p className="text-xs text-green-600 mt-1">{subtext}</p>}
        </div>
    </div>
);

const ResumeSkeleton = () => (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            <div className="pt-2 flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
            </div>
        </div>
    </div>
);

const EmptyState = ({ onAction }) => (
    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-workflow-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-8">
            Create your first professional resume today. Use our AI to generate one in seconds or start from scratch.
        </p>
        <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/resume-generator'} className="gap-2">
                <Sparkles className="w-4 h-4 text-workflow-primary" />
                Generate with AI
            </Button>
            <Button onClick={onAction} className="px-8">
                Create Manually
            </Button>
        </div>
    </div>
);

export default ResumeDashboard;
