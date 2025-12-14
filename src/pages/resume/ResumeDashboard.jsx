import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, MoreVertical, Copy, BarChart3, Search,
    Sparkles, FileText, Trash2, Zap, LayoutGrid, List as ListIcon,
    ArrowRight, Command, CreditCard, Crown, ChevronRight
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../contexts/ThemeContext';

const ResumeDashboard = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const { theme } = useTheme();

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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 lg:p-12 relative overflow-hidden font-sans transition-colors duration-500">

            {/* --- NEBULA BACKGROUND EFFECT --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float" />
                <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.07]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* --- 1. COMMAND CENTER HEADER --- */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 backdrop-blur-sm shadow-sm">
                                    V3.0 Command Center
                                </span>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
                                Resume <br className="md:hidden" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">
                                    Architect
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
                                Design career-defining documents with AI-powered precision.
                                <span className="hidden md:inline"> Build, analyze, and optimize in seconds.</span>
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard/resume-generator')}
                                className="group relative h-14 px-6 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-md overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent dark:from-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform duration-300">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">AI Generator</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Auto-Build</span>
                                    </div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(79, 70, 229, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/resume/new')}
                                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/30 flex items-center gap-3 font-bold relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Plus className="w-6 h-6" />
                                <span className="tracking-wide">Create New</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </header>

                {/* --- 2. GLASS METRICS GRID --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
                >
                    <GlassStatCard
                        icon={FileText}
                        value={totalResumes}
                        label="Active Resumes"
                        trend="+2 this week"
                        color="indigo"
                    />
                    <GlassStatCard
                        icon={BarChart3}
                        value={avgScore}
                        label="Avg ATS Score"
                        suffix="/100"
                        trend={avgScore > 75 ? "Excellent" : "Needs work"}
                        trendColor={avgScore > 75 ? "text-emerald-500" : "text-amber-500"}
                        color="emerald"
                    />
                    <GlassStatCard
                        icon={Crown}
                        value="Pro"
                        label="Plan Status"
                        trend="Expires in 12d"
                        color="amber"
                    />
                    <div className="md:col-span-1 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-indigo-500/20">
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                    <Sparkles className="w-6 h-6 text-yellow-300" />
                                </div>
                                <ArrowRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-1">Upgrade to AI+</h3>
                                <p className="text-indigo-100 text-sm opacity-90">Unlock visual heatmaps & auto-apply.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 3. TOOLBAR ISLAND --- */}
                <div className="sticky top-4 z-40 mb-10">
                    <div className="mx-auto max-w-4xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full p-2 pl-6 pr-2 shadow-2xl flex items-center justify-between">

                        {/* Search */}
                        <div className="flex items-center gap-3 flex-1">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
                            />
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-4" />

                        {/* Filters */}
                        <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-full">
                            {['All', 'Recent', 'Starred'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setSelectedFilter(f.toLowerCase())}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedFilter === f.toLowerCase()
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-4" />

                        {/* View Toggle */}
                        <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-full">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}>
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}>
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- 4. RESUME GRID --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[400px] rounded-3xl bg-white/50 dark:bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : filteredResumes.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20" : "flex flex-col gap-4 pb-20"}
                    >
                        {/* New Resume Card (First Item) */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                            onClick={() => navigate('/resume/new')}
                            className="group relative h-[420px] rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-white/10 bg-white/30 dark:bg-white/5 flex flex-col items-center justify-center gap-6 overflow-hidden transition-all hover:border-indigo-500/50 dark:hover:border-indigo-500/50"
                        >
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Plus className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-center relative z-10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create New</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Start from a blank canvas</p>
                            </div>
                        </motion.button>

                        {filteredResumes.map((resume) => (
                            <GlassResumeCard
                                key={resume.id}
                                resume={resume}
                                viewMode={viewMode}
                                onDelete={handleDelete}
                                onDuplicate={handleDuplicate}
                                onClick={() => navigate(`/resume/edit/${resume.id}`)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <FileText className="w-10 h-10 text-slate-400/50" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 dark:text-white mb-2">No documents found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            Your workspace is empty. Create your first career-defining resume now.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const GlassStatCard = ({ icon: Icon, value, label, trend, trendColor = "text-slate-400", color, suffix }) => (
    <div className="group relative p-6 rounded-3xl bg-white/60 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 backdrop-blur-xl shadow-xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
        <div className={`absolute top-0 right-0 p-24 bg-${color}-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-${color}-500/10 transition-colors`} />

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-${color}-100 dark:bg-${color}-500/10 flex items-center justify-center text-${color}-600 dark:text-${color}-400 mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight flex items-baseline gap-1">
                    {value}
                    {suffix && <span className="text-sm font-bold text-slate-400">{suffix}</span>}
                </div>
                <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
                    {trend && <span className={`text-xs font-bold ${trendColor} bg-white/50 dark:bg-white/5 px-2 py-1 rounded-lg`}>{trend}</span>}
                </div>
            </div>
        </div>
    </div>
);

const GlassResumeCard = ({ resume, viewMode, onClick, onDuplicate, onDelete }) => {
    const isList = viewMode === 'list';

    // ATS Score Color Logic
    const scoreColor = (score) => {
        if (!score) return 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400';
        if (score >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
        if (score >= 60) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
        return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
    };

    if (isList) {
        return (
            <motion.div
                layout
                onClick={onClick}
                className="group flex items-center gap-6 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 backdrop-blur-md hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors mb-2 cursor-pointer shadow-sm"
            >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {resume.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Edited {new Date(resume.updated_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="capitalize">{resume.template_id || 'Modern'} Template</span>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${scoreColor(resume.ats_score)}`}>
                    ATS: {resume.ats_score || 'N/A'}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => onDuplicate(resume, e)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full"><Copy className="w-4 h-4" /></button>
                    <button onClick={(e) => onDelete(resume.id, e)} className="p-2 hover:bg-rose-100 text-rose-500 rounded-full"><Trash2 className="w-4 h-4" /></button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={onClick}
            className="group relative h-[420px] rounded-[2.5rem] bg-white dark:bg-[#0B1121] border-[6px] border-white dark:border-[#1E293B] shadow-2xl flex flex-col overflow-hidden cursor-pointer"
        >
            {/* Paper Stack Effect */}
            <div className="absolute top-0 inset-x-4 h-full bg-white/50 dark:bg-white/5 rounded-[2.5rem] -z-10 translate-y-2 scale-95" />
            <div className="absolute top-0 inset-x-8 h-full bg-white/30 dark:bg-white/5 rounded-[2.5rem] -z-20 translate-y-4 scale-90" />

            {/* Thumbnail Area */}
            <div className="relative h-[240px] bg-slate-100 dark:bg-[#0f172a] overflow-hidden group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 transition-colors">
                <div className="absolute inset-x-8 top-8 bottom-[-40px] bg-white dark:bg-[#1e293b] shadow-xl rounded-t-xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 p-4">
                    {/* Skeleton Resume Look */}
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-4" />
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded mb-6" />
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                </div>

                {/* Floating Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="px-6 py-2 bg-white text-slate-900 font-bold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Open Editor
                    </span>
                </div>
            </div>

            {/* Content Info */}
            <div className="flex-1 p-6 flex flex-col justify-between bg-white dark:bg-[#0B1121]">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate mb-1">
                        {resume.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Last edited {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${scoreColor(resume.ats_score)}`}>
                        ATS Score: {resume.ats_score || 'N/A'}
                    </div>

                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => onDuplicate(resume, e)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                            <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => onDelete(resume.id, e)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeDashboard;
