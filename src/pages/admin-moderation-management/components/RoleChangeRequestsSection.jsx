import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useToast } from '../../../components/ui/Toast';
import { apiService } from '../../../lib/api';
import { formatDistanceToNow } from 'date-fns';

import { EliteCard } from '../../../components/ui/EliteCard';

const RoleChangeRequestsSection = () => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.profile.getRoleChangeRequests();
      let data = response.data?.data || response.data || [];
      if (filter !== 'all') data = data.filter(r => r.status === filter);
      setRequests(data);
    } catch (error) {
      showError('Failed to synchronize identity requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await apiService.profile.approveRoleChangeRequest(requestId);
      success('Clearance authorized successfully');
      loadRequests();
    } catch (error) {
      showError('Failed to authorize clearance');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await apiService.profile.rejectRoleChangeRequest(requestId, { rejection_reason: 'Denied' });
      success('Clearance denied');
      loadRequests();
    } catch (error) {
      showError('Denial protocol failed');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 px-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Identity Governance</h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mt-1">Curator Team Accreditation & Clearance Registry</p>
        </div>
      </div>

      <EliteCard className="p-2 border-white/5 bg-white/[0.02] rounded-[1.5rem] overflow-hidden">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === status ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              {status}
            </button>
          ))}
        </div>
      </EliteCard>

      <EliteCard className="p-0 border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-600">IDENTIFIER</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-600">TARGET CLEARANCE</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-600">STATE</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-600">TIMESTAMP</th>
                <th className="px-8 py-5 text-right text-[9px] font-black uppercase tracking-widest text-slate-600">HUB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs">
                          {request.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-wider">{request.user?.name || 'Unknown Entity'}</p>
                          <p className="text-[9px] font-medium text-slate-500">{request.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        {request.requested_role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${request.status === 'pending' ? 'text-amber-500' :
                        request.status === 'approved' ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase">
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {request.status === 'pending' && (
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleApprove(request.id)} className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 hover:text-white transition-all">AUTHORIZE</button>
                          <button onClick={() => handleReject(request.id)} className="px-4 py-2 bg-rose-600/10 border border-rose-600/20 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 hover:text-white transition-all">DENY</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Icon name="Inbox" className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Registry Clear</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </EliteCard>
    </div>
  );
};

export default RoleChangeRequestsSection;

