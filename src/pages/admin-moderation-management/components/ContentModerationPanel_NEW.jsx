// src/pages/admin-moderation-management/components/ContentModerationPanel.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import { formatRequirements } from '../../../utils/jobDataFormatter';

import { EliteCard } from '../../../components/ui/EliteCard';

const ContentModerationPanel = () => {
    const { user, profile } = useAuthContext();
    const { success, error: showError } = useToast();
    const [selectedJob, setSelectedJob] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [jobsRequiringApproval, setJobsRequiringApproval] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && profile?.role === 'admin') loadJobsRequiringApproval();
        else setLoading(false);
    }, [user, profile]);

    const loadJobsRequiringApproval = async () => {
        try {
            setLoading(true);
            const jobsResult = await jobService.getAll({ pageSize: 1000 });
            const allJobs = jobsResult.data || [];
            const jobsNeedingApproval = allJobs.filter(job => !job.status || ['draft', 'pending', 'pending_approval', 'under_review'].includes(job.status));
            const jobsWithDetails = await Promise.all(jobsNeedingApproval.map(async (job) => {
                let postedBy = 'Unknown Entity';
                if (job.created_by) {
                    try {
                        const { data: creator } = await supabase.from('users').select('name, email').eq('id', job.created_by).single();
                        if (creator) postedBy = creator.name || creator.email;
                    } catch (e) { }
                }
                return {
                    id: job.id,
                    title: job.title,
                    company: job.company || 'Unknown Corp',
                    location: job.location || 'Remote',
                    salary: job.salary || 'Unspecified',
                    postedBy,
                    postedAt: job.created_at,
                    status: job.status || 'pending_approval',
                    flaggedIssues: ['Forensic review required'],
                    originalContent: {
                        description: job.description || 'No data',
                        requirements: formatRequirements(job.requirements),
                        benefits: Array.isArray(job.benefits) ? job.benefits : []
                    }
                };
            }));
            setJobsRequiringApproval(jobsWithDetails);
        } catch (error) {
            showError('Failed to synchronize pending assets');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (jobId) => {
        try {
            const { error } = await supabase.from('jobs').update({ status: 'active' }).eq('id', jobId);
            if (error) throw error;
            success('Asset authorized for synchronization');
            setSelectedJob(null);
            loadJobsRequiringApproval();
        } catch (error) {
            showError('Authorization protocol failed');
        }
    };

    const handleReject = async (jobId) => {
        try {
            const { error } = await supabase.from('jobs').update({ status: 'rejected', rejection_reason: rejectionReason }).eq('id', jobId);
            if (error) throw error;
            success('Asset discarded from registry');
            setSelectedJob(null);
            loadJobsRequiringApproval();
        } catch (error) {
            showError('Discard protocol failed');
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 px-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Content Moderation</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Platform Asset Integrity & Verification Hub</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <EliteCard className="p-0 border-white/5 bg-white/[0.01] overflow-hidden">
                        <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PENDING ASSETS</h3>
                            <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-1 rounded">{jobsRequiringApproval.length}</span>
                        </div>
                        <div className="divide-y divide-white/[0.03] max-h-[600px] overflow-y-auto">
                            {jobsRequiringApproval.map((job) => (
                                <button key={job.id} onClick={() => setSelectedJob(job)} className={`w-full p-6 text-left transition-all hover:bg-white/[0.02] ${selectedJob?.id === job.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : ''}`}>
                                    <p className="text-[11px] font-black text-white uppercase tracking-wider truncate">{job.title}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{job.company}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.flaggedIssues.map((issue, i) => (
                                            <span key={i} className="text-[8px] font-black text-amber-500 uppercase tracking-tighter bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{issue}</span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </EliteCard>
                </div>

                <div className="lg:col-span-8">
                    {selectedJob ? (
                        <div className="space-y-8">
                            <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{selectedJob.title}</h3>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{selectedJob.company} • {selectedJob.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{selectedJob.salary}</p>
                                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Origin: {selectedJob.postedBy}</p>
                                    </div>
                                </div>

                                <div className="space-y-8 border-t border-white/5 pt-8">
                                    <div>
                                        <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Forensic Analysis: Description</h4>
                                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase">{selectedJob.originalContent.description}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Parameters: Requirements</h4>
                                            <ul className="space-y-2">
                                                {selectedJob.originalContent.requirements.map((req, i) => (
                                                    <li key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-3">
                                                        <span className="w-1 h-1 rounded-full bg-blue-500/40" /> {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Metadata: Benefits</h4>
                                            <ul className="space-y-2">
                                                {selectedJob.originalContent.benefits.map((benefit, i) => (
                                                    <li key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-3">
                                                        <span className="w-1 h-1 rounded-full bg-emerald-500/40" /> {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </EliteCard>

                            <div className="flex items-center gap-4">
                                <button onClick={() => handleApprove(selectedJob.id)} className="flex-1 py-4 bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3">
                                    <Icon name="Check" size={16} /> AUTHORIZE ASSET
                                </button>
                                <button onClick={() => handleReject(selectedJob.id)} className="flex-1 py-4 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-3">
                                    <Icon name="X" size={16} /> DISCARD ASSET
                                </button>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                                    REQUEST REVISION
                                </button>
                            </div>
                        </div>
                    ) : (
                        <EliteCard className="p-20 border-white/5 bg-white/[0.01] text-center">
                            <Icon name="Search" size={48} className="text-slate-800 mx-auto mb-6" />
                            <h3 className="text-sm font-black text-slate-600 uppercase tracking-[0.2em]">Asset Selection Pending</h3>
                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-2">Initialize verification by selecting a pending registry entry.</p>
                        </EliteCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentModerationPanel;
