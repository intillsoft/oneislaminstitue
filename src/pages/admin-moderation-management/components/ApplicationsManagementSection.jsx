import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, MoreHorizontal, Eye, Trash2, CheckCircle,
    XCircle, Clock, AlertCircle, Inbox, User, Briefcase, Calendar,
    ExternalLink, Shield, Zap
} from 'lucide-react';
import { EliteCard } from '../../../components/ui/EliteCard';
import Icon from 'components/AppIcon';
import { apiService } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';

const ApplicationsManagementSection = () => {
    const { success, error: showError } = useToast();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await apiService.admin.getApplications({
                search: searchTerm,
                status: statusFilter === 'all' ? undefined : statusFilter
            });
            setApplications(response.data?.data || []);
        } catch (error) {
            console.error('Error loading applications:', error);
            showError('Failed to synchronize application registry');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await apiService.applications.updateStatus(id, newStatus);
            success(`Application status updated to ${newStatus}`);
            loadApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            showError('Global status synchronization failure');
        }
    };

    const handleDeleteApplication = async (id) => {
        if (!confirm('Are you sure you want to purge this application record?')) return;
        try {
            await apiService.delete(`/admin/applications/${id}`);
            success('Application record purged from registry');
            loadApplications();
        } catch (error) {
            console.error('Error deleting application:', error);
            showError('Purge operation failed');
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'reviewed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'shortlisted': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const filteredApplications = applications.filter(app =>
        app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight font-display">Application Registry</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Global Candidate Engagement Matrix</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-workflow-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search engagement..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-workflow-primary/50 w-full md:w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Matrix Display */}
            <EliteCard hover={false} className="border-white/5 bg-white/[0.01] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate Info</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Engagement</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Clearance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-8 h-20 bg-white/[0.01]"></td>
                                    </tr>
                                ))
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                            <Icon name="Inbox" size={32} className="text-slate-500 opacity-30" />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest">No Active Engagements Found</h3>
                                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-2">The registry is currently void of records matching your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map(app => (
                                    <motion.tr
                                        key={app.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                                                    {app.user?.avatar_url ? (
                                                        <img src={app.user.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <User size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-workflow-primary transition-colors">
                                                        {app.user?.name || 'Unknown Subject'}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                                                        {app.user?.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <div className="text-xs font-black text-white uppercase tracking-widest mb-1 truncate max-w-[200px]">
                                                    {app.job?.title || 'Unknown Position'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={10} className="text-slate-600" />
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                        {app.company?.name || 'Independent Entity'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                                                    {app.status || 'NEUTRAL'}
                                                </div>
                                                <div className="h-1 w-1 rounded-full bg-slate-800"></div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                                    <Calendar size={10} />
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={10} className="text-emerald-500" />
                                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Identity Verified</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Zap size={10} className="text-blue-500" />
                                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Match Prob: 84%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                                    className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                                                    title="Approve Implementation"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                    className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/20"
                                                    title="Terminate Protocol"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                                <div className="w-px h-6 bg-white/5 mx-1"></div>
                                                <button
                                                    onClick={() => handleDeleteApplication(app.id)}
                                                    className="p-2.5 rounded-lg bg-white/5 text-slate-600 hover:text-white hover:bg-white/10 transition-all"
                                                    title="Purge Record"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Sync Status */}
                <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Neural Link Latency: 42ms</span>
                        </div>
                    </div>
                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        Records Processed: {applications.length} Engagement Units
                    </div>
                </div>
            </EliteCard>
        </div>
    );
};

export default ApplicationsManagementSection;
