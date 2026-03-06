// src/pages/admin-moderation-management/components/AuditTrail.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { adminService } from '../../../services/adminService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

import { EliteCard } from '../../../components/ui/EliteCard';

const AuditTrail = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditActivities, setAuditActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') loadAuditActivities();
    else setLoading(false);
  }, [user, profile, filterUser, filterAction, dateRange, searchTerm]);

  const loadAuditActivities = async () => {
    try {
      setLoading(true);
      const activities = await adminService.getAuditTrail({ userRole: filterUser === 'all' ? undefined : filterUser, actionType: filterAction === 'all' ? undefined : filterAction, dateRange, searchTerm });
      setAuditActivities(activities || []);
    } catch (error) {
      showError('Failed to sync audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = (action) => {
    const config = {
      user_suspended: { color: 'text-rose-500', icon: 'UserX' },
      job_approved: { color: 'text-emerald-500', icon: 'CheckCircle' },
      content_rejected: { color: 'text-rose-500', icon: 'XCircle' },
      settings_updated: { color: 'text-blue-500', icon: 'Settings' },
    };
    return config[action] || { color: 'text-slate-500', icon: 'Activity' };
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 px-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">System Audit Registry</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Platform Activity & Forensic Governance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Icon name="Search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH LOGS..."
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:bg-white/10 transition-all w-64"
            />
          </div>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="appearance-none bg-white/5 border border-white/5 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none hover:bg-white/10 transition-all">
            <option value="1d">LAST 24H</option>
            <option value="7d">LAST 7D</option>
            <option value="30d">LAST 30D</option>
          </select>
          <button className="px-6 py-2.5 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-3">
            <Icon name="Download" size={14} />
            EXPORT LOGS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-6">
          <EliteCard className="p-10 border-white/5 bg-white/[0.01]">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12">Forensic Timeline</h3>

            {loading ? (
              <div className="space-y-8 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl w-full" />)}
              </div>
            ) : auditActivities.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Inbox" size={48} className="text-slate-800 mx-auto mb-6" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No activities detected in current scope</p>
              </div>
            ) : (
              <div className="space-y-12">
                {auditActivities.map((activity, index) => {
                  const config = getActionConfig(activity.action);
                  return (
                    <div key={activity.id} className="relative pl-16">
                      {index < auditActivities.length - 1 && (
                        <div className="absolute left-[31px] top-12 bottom-[-48px] w-[1px] bg-white/[0.03]" />
                      )}

                      <div className="absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                        <Icon name={config.icon} size={20} className={config.color} />
                      </div>

                      <div className="group relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.color}`}>
                              {activity.action.replace('_', ' ')}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">{activity.timestamp}</span>
                          </div>
                          <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Trace ID: {activity.id.slice(0, 8)}</button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white">
                            {activity.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">{activity.user?.name}</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Access Level: {activity.user?.role}</p>
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                          {activity.target && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Asset: <span className="text-white">{activity.target}</span></p>}
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">{activity.details}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </EliteCard>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <EliteCard className="p-8 border-white/5 bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <Icon name="Activity" size={24} className="text-white mb-6" />
            <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Session Integrity</h3>
            <p className="text-2xl font-black text-white uppercase tracking-tight">Verified Profile</p>
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center justify-between text-[10px] font-black text-white uppercase tracking-widest">
                <span>Telemetry Score</span>
                <span>99.9%</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="w-full h-full bg-white shadow-[0_0_10px_#fff]" />
              </div>
            </div>
          </EliteCard>

          <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Governance Matrix</h3>
            <div className="space-y-8">
              {[
                { label: 'Security Protocols', value: 45, color: 'bg-rose-500' },
                { label: 'Asset Sync', value: 30, color: 'bg-blue-500' },
                { label: 'Registry Update', value: 25, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </EliteCard>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
