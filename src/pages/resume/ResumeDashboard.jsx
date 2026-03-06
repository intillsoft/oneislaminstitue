import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, MoreVertical, Copy, BarChart3, Search,
    Sparkles, FileText, Trash2, Zap, LayoutGrid, List as ListIcon,
    ArrowRight, Command, CreditCard, Crown, ChevronRight, Target, Award, Download
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../contexts/ThemeContext';

import { format } from 'date-fns';

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
    // Export Modal State
    const [exportResume, setExportResume] = useState(null);
    // Delete Confirmation State
    const [deleteResume, setDeleteResume] = useState(null);

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

    const handleDelete = (id, e) => {
        e.stopPropagation();
        const resumeToDelete = resumes.find(r => r.id === id);
        if (resumeToDelete) setDeleteResume(resumeToDelete);
    };

    const confirmDelete = async () => {
        if (!deleteResume) return;
        try {
            await resumeService.delete(deleteResume.id);
            setResumes(prev => prev.filter(r => r.id !== deleteResume.id));
            success('Resume deleted successfully');
            setDeleteResume(null);
        } catch (error) {
            console.error(error);
            showError('Deletion failed: ' + (error.message || 'Unknown error'));
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
        <div className="min-h-screen bg-private pb-24 transition-all duration-300 relative">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-16 pt-12">

                {/* --- CINEMATIC HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-5xl font-[1000] tracking-[-0.06em] text-white mb-3">
                            Workflow<span className="text-workflow-primary">.</span>Documents
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            High-Performance Career Document Governance
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button
                            onClick={() => navigate('/dashboard/resume-generator')}
                            className="h-12 px-6 rounded-xl bg-white/[0.03] border border-white/10 text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all group whitespace-nowrap"
                        >
                            <Sparkles className="w-4 h-4 text-workflow-primary group-hover:animate-pulse" />
                            AI Generator
                        </button>
                        <button
                            onClick={() => navigate('/resume/new')}
                            className="h-12 px-6 rounded-xl bg-workflow-primary text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-workflow-primary/20 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            New Resume
                        </button>
                    </motion.div>
                </div>

                {/* --- ELITE STATS GRID (Bento Style) --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    <StatCard
                        label="Active Nodes"
                        value={totalResumes}
                        icon={FileText}
                        sub="Total Documents"
                    />
                    <StatCard
                        label="Mean ATS"
                        value={`${avgScore}%`}
                        icon={BarChart3}
                        sub="Efficiency Index"
                    />
                    <StatCard
                        label="Status"
                        value="ELITE"
                        icon={Crown}
                        sub="Tier 1 Access"
                    />
                    <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden relative group cursor-pointer border-workflow-primary/20 bg-workflow-primary/5">
                        <div className="absolute top-0 right-0 p-20 bg-workflow-primary/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <Zap className="w-8 h-8 text-workflow-primary mb-4" />
                            <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight">Rapid<br />Deployment</h3>
                        </div>
                        <ArrowRight className="relative z-10 w-6 h-6 text-slate-500 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>

                {/* --- DOCUMENT VAULT --- */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                            <Command className="w-4 h-4 text-workflow-primary" />
                            <h2 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500">Document Vault</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
                                <button className="p-2 text-white bg-white/10 rounded-lg"><LayoutGrid size={16} /></button>
                                <button className="p-2 text-slate-500"><ListIcon size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/[0.02] animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {/* CREATE TRIGGER */}
                            <motion.div
                                whileHover={{ y: -10 }}
                                onClick={() => navigate('/resume/new')}
                                className="group relative aspect-[4/5] rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-workflow-primary/[0.02] hover:border-workflow-primary/30 cursor-pointer transition-all flex flex-col items-center justify-center gap-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center group-hover:scale-110 group-hover:bg-workflow-primary/10 transition-all duration-500">
                                    <Plus className="w-10 h-10 text-slate-700 group-hover:text-workflow-primary" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-black text-slate-500 uppercase tracking-widest group-hover:text-workflow-primary transition-colors">New Resume</span>
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Blank Template</span>
                                </div>
                            </motion.div>

                            {filteredResumes.map((resume, idx) => {
                                const cardTheme = getCardTheme(resume, idx);
                                return (
                                    <motion.div
                                        key={resume.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        whileHover={{ y: -8 }}
                                        className="group relative aspect-[3/4] bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/5 transition-all overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:border-workflow-primary/30"
                                    >
                                        {/* THUMBNAIL AREA */}
                                        {/* AVATAR THUMBNAIL AREA */}
                                        <div
                                            className="relative h-[60%] cursor-pointer bg-slate-50 dark:bg-[#0B1121] flex items-center justify-center overflow-hidden"
                                            onClick={() => navigate(`/resume/edit/${resume.id}`)}
                                        >
                                            <div className="absolute inset-0 opacity-20" style={{ background: cardTheme.gradient, filter: 'blur(40px)' }} />

                                            {/* Beautiful Generated Avatar */}
                                            <div
                                                className="w-24 h-24 rounded-3xl shadow-2xl flex items-center justify-center text-3xl font-black text-white transform group-hover:scale-110 transition-transform duration-700 relative z-10"
                                                style={{ background: cardTheme.gradient }}
                                            >
                                                {cardTheme.initials}
                                                <div className="absolute inset-0 rounded-3xl bg-white/20 blur-sm opacity-50" />
                                            </div>

                                            {/* Hover Action Overlay */}
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                                <div className="scale-90 group-hover:scale-100 transition-transform duration-500">
                                                    <button className="h-10 px-6 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                                                        Open Editor
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ATS Score Badge */}
                                            {resume.ats_score && (
                                                <div className="absolute top-4 right-4 z-20">
                                                    <div className="bg-white/90 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 border border-white/20">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cardTheme.color }} />
                                                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{resume.ats_score} ATS</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* FOOTER INFO */}
                                        <div className="flex-1 p-6 flex flex-col justify-between bg-white dark:bg-[#0F172A] relative">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-1 truncate group-hover:text-workflow-primary transition-colors">
                                                    {resume.title || 'Untitled Resume'}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                        {format(new Date(resume.updated_at), 'MMM d, yyyy')}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                                    <span className="text-[9px] font-black text-workflow-primary/70 uppercase tracking-widest">
                                                        {resume.template_id || 'PRO'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-3">
                                                <div className="flex gap-2">
                                                    <div className="h-1 w-6 rounded-full bg-slate-200 dark:bg-slate-800 transition-all group-hover:w-12 group-hover:bg-workflow-primary/50" />
                                                </div>
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExportResume(resume);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 rounded-lg transition-all"
                                                        title="Export Options"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDuplicate(resume, e)}
                                                        className="p-2 text-slate-400 hover:text-workflow-primary hover:bg-workflow-primary/5 rounded-lg transition-all"
                                                        title="Duplicate"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(resume.id, e)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {/* Dashboard Export Modal */}
            {exportResume && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setExportResume(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl m-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Export Asset</h2>
                            <button onClick={() => setExportResume(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                                <ListIcon size={20} className="transform rotate-45 text-slate-400" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => {
                                    const blob = new Blob([JSON.stringify(exportResume.content_json, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${exportResume.title || 'resume'}.json`;
                                    a.click();
                                    setExportResume(null);
                                }}
                                className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-workflow-primary/5 hover:border-workflow-primary/30 border border-transparent transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <LayoutGrid className="text-slate-500 group-hover:text-workflow-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">JSON Data</h3>
                                    <p className="text-xs text-slate-500 font-medium">Raw structured data</p>
                                </div>
                                <ArrowRight className="ml-auto text-slate-300 group-hover:text-workflow-primary group-hover:translate-x-1 transition-all" />
                            </button>

                            <button
                                onClick={() => navigate(`/resume/edit/${exportResume.id}`)}
                                className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-workflow-primary/5 hover:border-workflow-primary/30 border border-transparent transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <FileText className="text-slate-500 group-hover:text-workflow-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">PDF Document</h3>
                                    <p className="text-xs text-slate-500 font-medium">Open Editor to Print/Export</p>
                                </div>
                                <ArrowRight className="ml-auto text-slate-300 group-hover:text-workflow-primary group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteResume && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteResume(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl m-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Delete Document?</h2>
                            <p className="text-sm text-slate-500 font-medium">
                                You are about to permanently destroy <span className="text-slate-900 dark:text-white font-bold">"{deleteResume.title}"</span>. This action cannot be undone.
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <button
                                    onClick={() => setDeleteResume(null)}
                                    className="py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                                >
                                    Destroy Asset
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// --- HELPERS ---

// --- HELPERS ---

const getCardTheme = (resume, index) => {
    const gradients = [
        'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo-Purple
        'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', // Blue-Teal
        'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink-Rose
        'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber-Red
        'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', // Emerald-Cyan
        'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', // Violet-Fuchsia
    ];

    // Generate distinct avatar initials
    const initials = (resume.title || 'Untitled')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return {
        gradient: gradients[index % gradients.length],
        initials: initials,
        color: gradients[index % gradients.length].match(/#[0-9a-f]{6}/i)?.[0] || '#6366f1'
    };
};

const StatCard = ({ label, value, icon: Icon, sub }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex flex-col justify-between h-48"
    >
        <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-500" />
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div>
            <div className="text-4xl font-[1000] text-white tracking-tighter mb-1">{value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{sub}</div>
        </div>
    </motion.div>
);

export default ResumeDashboard;
