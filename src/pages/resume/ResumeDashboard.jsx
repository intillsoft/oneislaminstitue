import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, MoreVertical, Clock, Download, Trash2, Copy, BarChart3, Search,
    Sparkles, FileText, LayoutTemplate, Briefcase, Zap, CheckCircle2,
    ArrowRight, ChevronDown, Filter, LayoutGrid, List as ListIcon, Star
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
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, draft, polished

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

    // Calculate stats
    const avgScore = resumes.length ? Math.round(resumes.reduce((acc, r) => acc + (r.ats_score || 0), 0) / resumes.length) : 0;
    const totalResumes = resumes.length;

    return (
        <div className="min-h-screen bg-[#0B1120] text-white p-6 lg:p-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* 1. Hero / Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3 h-3" /> Resizeable V3 Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Command Center</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                            Manage, analyze, and optimize your career documents with AI-powered insights.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={() => navigate('/dashboard/resume-generator')}
                            variant="secondary"
                            className="h-12 px-6 bg-[#1E293B] border border-slate-700 hover:bg-slate-700 text-white"
                        >
                            <Zap className="w-4 h-4 mr-2" /> AI Generator
                        </Button>
                        <Button
                            onClick={() => navigate('/resume/new')}
                            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Create New
                        </Button>
                    </div>
                </div>

                {/* 2. Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatsCard icon={FileText} label="Total Resumes" value={totalResumes} sub="Active Documents" color="blue" />
                    <StatsCard icon={BarChart3} label="Avg. ATS Score" value={avgScore} sub=" across all resumes" color="emerald" suffix="/100" />
                    <StatsCard icon={LayoutTemplate} label="Templates Used" value="5" sub="Premium Styles" color="purple" />
                </div>

                {/* 3. Controls & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#161B22] p-2 rounded-xl border border-slate-800 mb-8 gap-4">
                    <div className="tabs flex bg-[#0D1117] p-1 rounded-lg">
                        {['all', 'featured', 'drafts'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedFilter === filter ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto px-2">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#0D1117] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none w-full md:w-64 transition-all"
                            />
                        </div>
                        <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block" />
                        <div className="flex gap-1 bg-[#0D1117] p-1 rounded-lg border border-slate-700">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><LayoutGrid className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><ListIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* 4. Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-[300px] bg-[#161B22] rounded-2xl animate-pulse border border-slate-800" />)}
                    </div>
                ) : filteredResumes.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                        <AnimatePresence>
                            {/* New Resume Card (First in Grid) */}
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/resume/new')}
                                className="group relative flex flex-col items-center justify-center min-h-[320px] rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 hover:border-indigo-500/50 transition-all text-center p-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-400">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Create New</h3>
                                <p className="text-sm text-slate-400">Start from a template</p>
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
                    <div className="text-center py-20 bg-[#161B22] rounded-3xl border border-slate-800">
                        <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No resumes found</h3>
                        <p className="text-slate-400 mt-2">Create your first resume to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Components ---

const StatsCard = ({ icon: Icon, label, value, sub, color, suffix }) => (
    <div className="bg-[#161B22] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500 transform group-hover:scale-110 duration-500`}>
            <Icon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-500/20 text-${color}-400 mb-4`}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{value}<span className="text-lg text-slate-500 font-medium">{suffix}</span></h3>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> {sub}
            </p>
        </div>
    </div>
);

const ResumeCard = ({ resume, viewMode, onDelete, onDuplicate, onClick }) => {
    const [showMenu, setShowMenu] = useState(false);

    // ATS Score Color
    const getScoreColor = (score) => {
        if (!score) return 'text-slate-400 bg-slate-800';
        if (score >= 80) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
        if (score >= 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
        return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                layout
                onClick={onClick}
                className="group flex items-center justify-between bg-[#161B22] border border-slate-800 p-4 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{resume.title}</h3>
                        <p className="text-xs text-slate-500">Edited {new Date(resume.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(resume.ats_score)}`}>
                        ATS: {resume.ats_score || 'N/A'}
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => onDuplicate(resume, e)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><Copy className="w-4 h-4" /></button>
                        <button onClick={(e) => onDelete(resume.id, e)} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClick}
            className="group relative bg-[#161B22] rounded-2xl border border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col h-[320px]"
        >
            {/* Thumbnail Preview Area */}
            <div className="relative h-[180px] bg-[#0B1120] p-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />

                {/* Mock Page Preview */}
                <div className="w-[120px] h-[160px] bg-white shadow-lg transform rotate-[-5deg] group-hover:rotate-0 transition-all duration-500 flex flex-col p-2 gap-1 items-start opacity-80 group-hover:opacity-100">
                    <div className="w-full h-2 bg-slate-200 rounded-sm" />
                    <div className="w-2/3 h-2 bg-slate-200 rounded-sm mb-2" />
                    <div className="w-full h-1 bg-slate-100 rounded-sm" />
                    <div className="w-full h-1 bg-slate-100 rounded-sm" />
                    <div className="w-full h-1 bg-slate-100 rounded-sm" />
                    <div className="w-3/4 h-1 bg-slate-100 rounded-sm" />
                </div>

                {/* Overlay Buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button size="sm" className="bg-white text-black hover:bg-slate-200 font-bold">Open Editor</Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg truncate pr-2 group-hover:text-indigo-400 transition-colors w-full" title={resume.title}>
                        {resume.title}
                    </h3>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowMenu(!showMenu)} className="text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1E293B] border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden p-1">
                                    <button onClick={(e) => onDuplicate(resume, e)} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                                    <button onClick={(e) => onDelete(resume.id, e)} className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Last Edited</span>
                        <span className="text-xs text-slate-300 font-medium">{new Date(resume.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreColor(resume.ats_score)} flex items-center gap-1`}>
                        <BarChart3 className="w-3 h-3" /> {resume.ats_score || 'N/A'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeDashboard;
