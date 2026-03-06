// src/pages/admin-moderation-management/components/ModerationQueue.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';

import { EliteCard } from '../../../components/ui/EliteCard';

const ModerationQueue = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [bulkAction, setBulkAction] = useState('');
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadPendingItems();
    } else {
      setLoading(false);
    }
  }, [user, profile, filterStatus]);

  const loadPendingItems = async () => {
    try {
      setLoading(true);
      const jobsResult = await jobService.getAll({ pageSize: 1000 });
      const allJobs = jobsResult.data || [];
      const jobsNeedingModeration = allJobs.filter(job =>
        !job.status || job.status === 'draft' || job.status === 'pending' || job.status === 'under_review'
      );

      const items = jobsNeedingModeration.map(job => {
        let priority = 'medium';
        const daysSinceCreation = job.created_at
          ? Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24))
          : 0;

        if (daysSinceCreation > 7) priority = 'urgent';
        else if (daysSinceCreation > 3) priority = 'high';
        else priority = 'medium';

        return {
          id: job.id,
          type: 'job_posting',
          title: job.title,
          company: job.company || 'Unknown',
          submittedBy: job.created_by || 'Unknown',
          submittedAt: job.created_at,
          priority,
          status: job.status || 'pending',
          category: job.industry || 'General',
          flaggedReason: 'Awaiting clearance',
        };
      });

      setPendingItems(filterStatus === 'all' ? items : items.filter(item => item.status === filterStatus));
    } catch (error) {
      console.error('Moderation error:', error);
      showError('Failed to sync queue');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === pendingItems.length ? [] : pendingItems.map(i => i.id));
  };

  const handleItemAction = async (itemId, action) => {
    try {
      const { error } = await supabase.from('jobs').update({ status: action === 'approve' ? 'active' : 'rejected' }).eq('id', itemId);
      if (error) throw error;
      success(`Entity ${action}d successfully`);
      loadPendingItems();
    } catch (error) {
      showError('Failed to execute command');
    }
  };

  const getConfig = (priority) => {
    if (priority === 'urgent') return { label: 'URGENT', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    if (priority === 'high') return { label: 'HIGH', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    return { label: 'NORMAL', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 px-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Accreditation Queue</h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mt-1">
            Governance Oversight: Curriculum Verification Matrix
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white/5 border border-white/5 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none transition-all cursor-pointer hover:bg-white/10"
          >
            <option value="all">ALL ENTITIES</option>
            <option value="pending">PENDING SYNC</option>
            <option value="under_review">UNDER REVIEW</option>
          </select>

          <button className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            Filter System
          </button>
        </div>
      </div>

      <EliteCard className="overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="overflow-x-auto px-8 pb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-6 pr-6">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === pendingItems.length && pendingItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0"
                  />
                </th>
                <th className="py-6 pr-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Classification</th>
                <th className="py-6 pr-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Entity Metadata</th>
                <th className="py-6 pr-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Priority Level</th>
                <th className="py-6 pr-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Origins</th>
                <th className="py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="py-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                  </tr>
                ))
              ) : pendingItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Icon name="ShieldCheck" size={32} className="text-emerald-500/40" />
                    </div>
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Queue Fully Sanitized</h3>
                  </td>
                </tr>
              ) : (
                pendingItems.map((item) => {
                  const config = getConfig(item.priority);
                  return (
                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="py-6 pr-6">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0"
                        />
                      </td>
                      <td className="py-6 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                            <Icon name="Briefcase" size={14} className="text-blue-500" />
                          </div>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {item.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 pr-6">
                        <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors uppercase">{item.title}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{item.company}</div>
                      </td>
                      <td className="py-6 pr-6">
                        <div className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                          {config.label}
                        </div>
                      </td>
                      <td className="py-6 pr-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.submittedBy}</div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">
                          {item.submittedAt ? formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true }).toUpperCase() : 'UNKNOWN'}
                        </div>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => handleItemAction(item.id, 'approve')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                          >
                            Authorize
                          </button>
                          <button
                            onClick={() => handleItemAction(item.id, 'reject')}
                            className="px-4 py-2 bg-rose-600/10 border border-rose-600/20 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                          >
                            Block
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
      </EliteCard>
    </div>
  );
};

export default ModerationQueue;
