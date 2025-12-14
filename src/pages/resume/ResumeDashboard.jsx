import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, MoreVertical, Copy, BarChart3, Search,
    Sparkles, FileText, LayoutTemplate, Trash2, Zap, LayoutGrid, List as ListIcon,
    ArrowRight, Star
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

const ResumeDashboard = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

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
        if (!window.confirm('Delete this resume permanently?')) return;
        try {
            await resumeService.delete(id);
            setResumes(prev => prev.filter(r => r.id !== id));
            success('Resume deleted');
        } catch (error) {
            showError('Deletion failed');
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
            success('Duplicated successfully');
        } catch (error) {
            showError('Duplication failed');
        }
    };

    const filteredResumes = resumes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const avgScore = resumes.length ? Math.round(resumes.reduce((acc, r) => acc + (r.ats_score || 0), 0) / resumes.length) : 0;
    const totalResumes = resumes.length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text p-4 lg:p-12 relative overflow-hidden font-sans transition-colors duration-300">
            {/* Ambient Background - Dark Mode Only */}
            <div className="hidden dark:block absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-workflow-primary-900/20 to-transparent pointer-events-none" />
            <div className="hidden dark:block absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-workflow-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-workflow-primary/10 border border-blue-200 dark:border-workflow-primary/20 text-blue-600 dark:text-workflow-primary-300 text-xs font-bold uppercase tracking-wider mb-4"
                        >
                            <Sparkles className="w-3 h-3" /> Resizeable V3 Dashboard
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-workflow-primary dark:to-cyan-400">Command Center</span>
                        </h1>
                        <p className="text-slate-600 dark:text-dark-text-secondary text-lg max-w-xl leading-relaxed">
                            Create, manage, and optimize your professional documents with AI-driven insights.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/dashboard/resume-generator')}
                            className="group relative h-12 px-6 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-dark-surface-elevated hover:border-blue-200 dark:hover:border-workflow-primary/30 transition-all flex items-center justify-center gap-2 overflow-hidden shadow-sm"
                        >
                            <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400 group-hover:scale-110 transition-transform" />
                            <span>AI Generator</span>
                        </button>

                        <button
                            onClick={() => navigate('/resume/new')}
                            className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-workflow-primary dark:to-workflow-primary-600 hover:from-blue-500 hover:to-blue-600 dark:hover:from-workflow-primary-400 dark:hover:to-workflow-primary-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 dark:shadow-workflow-primary/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create New Resume</span>
                        </button>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatsCard icon={FileText} label="Total Resumes" value={totalResumes} sub="Active Documents" color="text-blue-500 dark:text-blue-400" bg="bg-blue-100 dark:bg-blue-500/10" border="border-blue-200 dark:border-blue-500/20" />
                    <StatsCard icon={BarChart3} label="Avg. ATS Score" value={avgScore} sub=" across all resumes" color="text-emerald-500 dark:text-emerald-400" bg="bg-emerald-100 dark:bg-emerald-500/10" border="border-emerald-200 dark:border-emerald-500/20" suffix="/100" />
                    <StatsCard icon={LayoutTemplate} label="Templates Used" value="5" sub="Premium Styles" color="text-purple-500 dark:text-purple-400" bg="bg-purple-100 dark:bg-purple-500/10" border="border-purple-200 dark:border-purple-500/20" />
                </div>

                {/* 3. Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white/60 dark:bg-dark-surface/50 backdrop-blur-md p-2 rounded-xl border border-slate-200 dark:border-dark-border mb-8 gap-4 shadow-sm">
                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-dark-bg/50 rounded-lg">
                        {['all', 'featured', 'drafts'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${selectedFilter === filter
                                    ? 'bg-white dark:bg-workflow-primary text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto px-2">
                        <div className="relative group w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-dark-text-secondary group-focus-within:text-blue-600 dark:group-focus-within:text-workflow-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-workflow-primary/50 focus:border-blue-500 dark:focus:border-workflow-primary/50 outline-none transition-all placeholder-slate-400 dark:placeholder-dark-text-muted"
                            />
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-dark-border mx-2 hidden md:block" />
                        <div className="flex gap-1 bg-slate-100 dark:bg-dark-bg/50 p-1 rounded-lg border border-slate-200 dark:border-dark-border">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-workflow-primary/20 text-blue-600 dark:text-workflow-primary shadow-sm' : 'text-slate-500 dark:text-dark-text-secondary'}`}><LayoutGrid className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-workflow-primary/20 text-blue-600 dark:text-workflow-primary shadow-sm' : 'text-slate-500 dark:text-dark-text-secondary'}`}><ListIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* 4. Resumes Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-[320px] bg-white dark:bg-dark-surface rounded-2xl animate-pulse border border-slate-200 dark:border-dark-border" />)}
                    </div>
                ) : filteredResumes.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                        <AnimatePresence>
                            {/* Create Card */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/resume/new')}
                                className="group relative flex flex-col items-center justify-center min-h-[320px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-dark-border bg-slate-50 dark:bg-dark-surface/20 hover:border-blue-500/50 dark:hover:border-workflow-primary/50 hover:bg-blue-50 dark:hover:bg-dark-surface/40 transition-all text-center p-6 cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-workflow-primary/10 flex items-center justify-center mb-4 group-hover:bg-blue-600 dark:group-hover:bg-workflow-primary text-blue-600 dark:text-workflow-primary-300 group-hover:text-white transition-all duration-300">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Create New</h3>
                                <p className="text-sm text-slate-500 dark:text-dark-text-secondary">Start from scratch</p>
                            </motion.button>

                            {filteredResumes.map((resume) => (
                                <ResumeCard
                                    key={resume.id}
                                    resume={resume}
                                    viewMode={viewMode}
                                    onDelete={handleDelete}
                                    onDuplicate={handleDuplicate}
                                    onClick={() => navigate(`/resume/edit/${resume.id}`)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-dark-surface/30 rounded-3xl border border-slate-200 dark:border-dark-border border-dashed">
                        <div className="w-20 h-20 bg-white dark:bg-dark-surface rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <FileText className="w-10 h-10 text-slate-400 dark:text-dark-text-muted opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resumes found</h3>
                        <p className="text-slate-500 dark:text-dark-text-secondary max-w-sm text-center mb-8">
                            Get started by creating your first professional resume with our AI-powered builder.
                        </p>
                        <button
                            onClick={() => navigate('/resume/new')}
                            className="px-6 py-3 bg-blue-600 dark:bg-workflow-primary hover:bg-blue-700 dark:hover:bg-workflow-primary-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 dark:shadow-workflow-primary/20"
                        >
                            Create First Resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Components ---

const StatsCard = ({ icon: Icon, label, value, sub, color, bg, border, suffix }) => (
    <div className={`bg-white dark:bg-dark-surface border border-slate-200 dark:border-transparent ${border} p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg dark:hover:bg-dark-surface-elevated transition-all duration-300`}>
        <div className={`absolute -right-6 -top-6 ${color} opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
            <Icon className="w-32 h-32" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color} mb-4 border ${border}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-1 mb-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
                {suffix && <span className="text-sm font-bold text-slate-500 dark:text-dark-text-muted">{suffix}</span>}
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary">{label}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-dark-text-muted font-medium bg-slate-100 dark:bg-dark-bg/50 w-fit px-2 py-1 rounded-md">
                <ArrowRight className="w-3 h-3" /> {sub}
            </div>
        </div>
    </div>
);

const ResumeCard = ({ resume, viewMode, onDelete, onDuplicate, onClick }) => {
    const [showMenu, setShowMenu] = useState(false);

    // ATS Score Badge Color
    const getScoreInfo = (score) => {
        if (!score) return { color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-500/10', border: 'border-gray-200 dark:border-gray-500/20' };
        if (score >= 80) return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' };
        if (score >= 60) return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' };
        return { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' };
    };
    const scoreInfo = getScoreInfo(resume.ats_score);

    if (viewMode === 'list') {
        return (
            <motion.div
                layout
                onClick={onClick}
                className="group flex items-center justify-between bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-4 rounded-xl hover:border-blue-400 dark:hover:border-workflow-primary/40 hover:shadow-md dark:hover:bg-dark-surface-elevated transition-all cursor-pointer shadow-sm"
            >
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-workflow-primary/10 flex items-center justify-center text-blue-600 dark:text-workflow-primary-300 border border-blue-100 dark:border-workflow-primary/10">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-workflow-primary-300 transition-colors">{resume.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-dark-text-secondary flex items-center gap-2">
                            <span>Last edited {new Date(resume.updated_at).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-dark-text-muted" />
                            <span>{resume.template_id || 'Modern'} Template</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${scoreInfo.bg} ${scoreInfo.color} ${scoreInfo.border}`}>
                        <BarChart3 className="w-3 h-3" />
                        ATS: {resume.ats_score || 'N/A'}
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={(e) => onDuplicate(resume, e)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg text-slate-500 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Duplicate"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => onDelete(resume.id, e)}
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-500/70 hover:text-rose-600 dark:hover:text-rose-500 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClick}
            className="group relative bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden hover:shadow-xl dark:hover:shadow-workflow-primary/10 hover:border-blue-400 dark:hover:border-workflow-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[320px]"
        >
            {/* Thumbnail */}
            <div className="relative h-[180px] bg-slate-100 dark:bg-dark-bg p-6 flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-dark-border/50 group-hover:border-blue-200 dark:group-hover:border-workflow-primary/20 transition-colors">
                <div className="absolute inset-0 bg-grid-slate-200/[0.5] dark:bg-grid-white/[0.02] bg-[length:20px_20px]" />

                {/* Mock Page */}
                <div className="w-[120px] h-[160px] bg-white shadow-lg transform group-hover:scale-105 transition-transform duration-500 flex flex-col p-3 gap-2 opacity-90 group-hover:opacity-100 rounded-sm">
                    <div className="w-full h-3 bg-slate-200 rounded-sm" />
                    <div className="w-2/3 h-2 bg-slate-200 rounded-sm mb-3" />
                    <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-slate-100 rounded-sm" />
                        <div className="w-full h-1.5 bg-slate-100 rounded-sm" />
                        <div className="w-full h-1.5 bg-slate-100 rounded-sm" />
                        <div className="w-3/4 h-1.5 bg-slate-100 rounded-sm" />
                    </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-dark-bg/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[1px] dark:backdrop-blur-[2px]">
                    <span className="px-5 py-2.5 bg-white text-slate-900 font-bold text-sm rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                        Open Editor
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate pr-2 group-hover:text-blue-600 dark:group-hover:text-workflow-primary-300 transition-colors w-full" title={resume.title}>
                        {resume.title}
                    </h3>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowMenu(!showMenu)} className="text-slate-400 dark:text-dark-text-muted hover:text-slate-900 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-surface-elevated border border-slate-200 dark:border-dark-border rounded-xl shadow-xl z-20 overflow-hidden p-1">
                                    <button onClick={(e) => onDuplicate(resume, e)} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-dark-text hover:bg-slate-50 dark:hover:bg-dark-border rounded-lg flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                                    <button onClick={(e) => onDelete(resume.id, e)} className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-dark-border group-hover:border-slate-200 dark:group-hover:border-dark-border/80 transition-colors">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 dark:text-dark-text-muted uppercase tracking-wider font-bold">Updated</span>
                        <span className="text-xs text-slate-600 dark:text-dark-text-secondary font-medium">{new Date(resume.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${scoreInfo.bg} ${scoreInfo.color} ${scoreInfo.border}`}>
                        <BarChart3 className="w-3.5 h-3.5" />
                        {resume.ats_score || 'N/A'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeDashboard;
