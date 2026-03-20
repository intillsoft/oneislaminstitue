import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { enrollmentService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

import { EliteCard } from '../../../components/ui/EliteCard';

const CandidatePipeline = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [activeStage, setActiveStage] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'instructor' || profile?.role === 'admin')) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user, profile, activeStage]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await enrollmentService.getAllForInstructor();
      setApplications(allApplications || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const stageCounts = {
    all: applications.length,
    new: applications.filter(app => !app.status || app.status === 'pending' || app.status === 'applied').length,
    screening: applications.filter(app => app.status === 'screening' || app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview' || app.status === 'interview_scheduled').length,
    assessment: applications.filter(app => app.status === 'assessment' || app.status === 'testing').length,
    offer: applications.filter(app => app.status === 'offer' || app.status === 'offer_sent').length,
    hired: applications.filter(app => app.status === 'hired' || app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected' || app.status === 'declined').length,
  };

  const stages = [
    { id: 'all', label: 'All Scholars', count: stageCounts.all, icon: 'Users' },
    { id: 'new', label: 'New Enrollment', count: stageCounts.new, icon: 'PlusCircle' },
    { id: 'screening', label: 'Review', count: stageCounts.screening, icon: 'ShieldCheck' },
    { id: 'interview', label: 'Assessment', count: stageCounts.interview, icon: 'Mic2' },
    { id: 'assessment', label: 'Testing', count: stageCounts.assessment, icon: 'Terminal' },
    { id: 'offer', label: 'Certification', count: stageCounts.offer, icon: 'Award' },
    { id: 'hired', label: 'Completed', count: stageCounts.hired, icon: 'UserCheck' },
    { id: 'rejected', label: 'Audit', count: stageCounts.rejected, icon: 'XCircle' },
  ];

  const filteredCandidates = activeStage === 'all'
    ? applications
    : applications.filter(app => {
      const status = app.status || 'new';
      if (activeStage === 'new') return !status || status === 'pending' || status === 'applied';
      if (activeStage === 'screening') return status === 'screening' || status === 'reviewing';
      if (activeStage === 'interview') return status === 'interview' || status === 'interview_scheduled';
      if (activeStage === 'assessment') return status === 'assessment' || status === 'testing';
      if (activeStage === 'offer') return status === 'offer' || status === 'offer_sent';
      if (activeStage === 'hired') return status === 'hired' || status === 'accepted';
      if (activeStage === 'rejected') return status === 'rejected' || status === 'declined';
      return status === activeStage;
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'RECENT';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true }).toUpperCase();
    } catch {
      return 'RECENT';
    }
  };

  const getStageConfig = (status) => {
    const s = status || 'new';
    if (s === 'pending' || s === 'applied' || !s) return { label: 'NEW', color: 'text-workflow-primary', bg: 'bg-workflow-primary/10', border: 'border-workflow-primary/20' };
    if (s === 'screening' || s === 'reviewing') return { label: 'SCREEN', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    if (s === 'interview' || s === 'interview_scheduled') return { label: 'SYNC', color: 'text-workflow-accent', bg: 'bg-workflow-accent/10', border: 'border-workflow-accent/20' };
    if (s === 'assessment' || s === 'testing') return { label: 'EVAL', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
    if (s === 'offer' || s === 'offer_sent') return { label: 'OFFER', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (s === 'hired' || s === 'accepted') return { label: 'HIRED', color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' };
    if (s === 'rejected' || s === 'declined') return { label: 'FAIL', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    return { label: 'PEND', color: 'text-text-muted', bg: 'bg-text-muted/10', border: 'border-text-muted/20' };
  };

  return (
    <div className="bg-[#0C1236]/30 backdrop-blur-xl border border-white/[0.04] rounded-3xl relative overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/[0.02] blur-3xl rounded-full -z-10" />

      <div className="p-8 pb-4">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Scholar Oversight</h3>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Student Success Pipeline</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <Icon name="Filter" size={16} />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <Icon name="Search" size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
          {stages.map((stage) => {
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`group relative flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all whitespace-nowrap ${isActive
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/[0.03] border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                  }`}
              >
                <Icon name={stage.icon} size={14} className={isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'} />
                <span className="text-[10px] font-black uppercase tracking-widest">{stage.label}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'
                  }`}>
                  {stage.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto px-8 pb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-4 pr-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Student Identity</th>
              <th className="py-4 pr-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Enrolled Course</th>
              <th className="py-4 pr-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Enrollment Date</th>
              <th className="py-4 pr-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Current Phase</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Academic Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="py-6 pr-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                </tr>
              ))
            ) : filteredCandidates?.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Icon name="Users" size={32} className="text-slate-800" />
                  </div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Cluster Data Nullified</h3>
                </td>
              </tr>
            ) : (
              filteredCandidates?.map((app) => {
                const candidate = app.user || {};
                const job = app.job || {};
                const config = getStageConfig(app.status);
                const avatarUrl = candidate.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || candidate.email || 'User')}&background=0A1628&color=fff&bold=true`;

                return (
                  <tr key={app.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="py-6 pr-8">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Image
                            src={avatarUrl}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-2xl border border-white/10 object-cover shadow-2xl transition-transform group-hover:scale-110"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg-elevated ${config.label === 'HIRED' ? 'bg-emerald-500' : 'bg-workflow-primary'}`} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-text-primary dark:text-white uppercase tracking-tight mb-0.5 group-hover:text-workflow-primary transition-colors">
                            {candidate.name || candidate.email?.split('@')[0]}
                          </div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 pr-8">
                      <div className="text-sm font-black text-slate-300 uppercase tracking-tight">{job.title || 'UNSPECIFIED'}</div>
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.1em]">{job.industry || 'GENERAL'}</div>
                    </td>
                    <td className="py-6 pr-8">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {formatDate(app.applied_at)}
                      </div>
                    </td>
                    <td className="py-6 pr-8">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${config.bg} ${config.color} ${config.border} group-hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${config.color.replace('text', 'bg')} animate-pulse`} />
                        {config.label}
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:bg-workflow-primary hover:border-workflow-primary hover:text-white transition-all shadow-xl">
                          <Icon name="Mail" size={14} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white transition-all shadow-xl">
                          <Icon name="Calendar" size={14} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all shadow-xl">
                          <Icon name="MoreVertical" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          SYSTEM ACTIVE: <span className="text-white">{filteredCandidates?.length}</span> ENTITIES IDENTIFIED
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-workflow-primary' : 'bg-white/10'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all disabled:opacity-20">
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all disabled:opacity-20">
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePipeline;
