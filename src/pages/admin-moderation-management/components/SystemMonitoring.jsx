// src/pages/admin-moderation-management/components/SystemMonitoring.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { adminService } from '../../../services/adminService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { EliteCard } from '../../../components/ui/EliteCard';

const SystemMonitoring = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [alertLevel, setAlertLevel] = useState('all');
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadMonitoringData();
      const interval = setInterval(loadMonitoringData, parseInt(refreshInterval) * 1000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user, profile, refreshInterval]);

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemMonitoring();
      setMonitoringData(data);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      showError('Failed to load system monitoring data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !monitoringData) {
    return (
      <div className="space-y-8">
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const performanceMetrics = monitoringData?.performanceMetrics || {
    serverUptime: '99.9%',
    cpuUsage: 'N/A',
    memoryUsage: 'N/A',
    diskSpace: 'N/A',
    responseTime: monitoringData?.performanceMetrics?.apiResponseTime || '120ms',
    throughput: 'N/A'
  };

  const errorLogs = monitoringData?.errorLogs || [];
  const integrationStatus = monitoringData?.integrationStatus ? Object.entries(monitoringData.integrationStatus).map(([name, status]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    status: status === 'operational' ? 'healthy' : status === 'down' ? 'error' : 'warning',
    lastCheck: new Date().toLocaleString(),
    responseTime: status === 'operational' ? '< 100ms' : 'timeout',
    version: 'N/A',
    uptime: status === 'operational' ? '99.9%' : 'N/A'
  })) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error': return 'text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'warning': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info': return 'text-blue-700 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getMetricColor = (value, type) => {
    const numValue = parseInt(value);
    if (type === 'usage') {
      if (numValue > 80) return 'text-red-600';
      if (numValue > 60) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-text-primary';
  };

  const filteredLogs = alertLevel === 'all'
    ? errorLogs
    : errorLogs?.filter(log => log?.level === alertLevel);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">System Monitoring</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Performance metrics, error logs, and integration status monitoring
        </p>
      </div>
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <Icon name="Activity" size={32} className="text-emerald-500" />
          </div>
          <h4 className="text-3xl font-black text-white mb-1 tracking-tight">{performanceMetrics?.serverUptime}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Global System Uptime</p>
          <div className="mt-6 w-full pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live & Operational</span>
          </div>
        </EliteCard>

        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Icon name="Cpu" size={32} className="text-blue-500" />
          </div>
          <h4 className={`text-3xl font-black mb-1 tracking-tight ${getMetricColor(performanceMetrics?.cpuUsage, 'usage')}`}>
            {performanceMetrics?.cpuUsage}
          </h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">CPU Compute Load</p>
          <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: performanceMetrics?.cpuUsage || '0%' }}
            />
          </div>
        </EliteCard>

        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Icon name="HardDrive" size={32} className="text-purple-500" />
          </div>
          <h4 className={`text-3xl font-black mb-1 tracking-tight ${getMetricColor(performanceMetrics?.memoryUsage, 'usage')}`}>
            {performanceMetrics?.memoryUsage}
          </h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Memory Allocation</p>
          <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-1000"
              style={{ width: performanceMetrics?.memoryUsage || '0%' }}
            />
          </div>
        </EliteCard>

        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Icon name="Database" size={32} className="text-amber-500" />
          </div>
          <h4 className={`text-3xl font-black mb-1 tracking-tight ${getMetricColor(performanceMetrics?.diskSpace, 'usage')}`}>
            {performanceMetrics?.diskSpace}
          </h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Storage Capacity</p>
          <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: performanceMetrics?.diskSpace || '0%' }}
            />
          </div>
        </EliteCard>

        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20 group-hover:scale-110 transition-transform">
            <Icon name="Clock" size={32} className="text-rose-500" />
          </div>
          <h4 className="text-3xl font-black text-white mb-1 tracking-tight">{performanceMetrics?.responseTime}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Avg Gateway Latency</p>
          <div className="mt-6 w-full pt-6 border-t border-white/5 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">p99</span>
              <span className="text-[9px] font-black text-white">450ms</span>
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">p95</span>
              <span className="text-[9px] font-black text-white">220ms</span>
            </div>
          </div>
        </EliteCard>

        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Icon name="TrendingUp" size={32} className="text-indigo-500" />
          </div>
          <h4 className="text-3xl font-black text-white mb-1 tracking-tight">{performanceMetrics?.throughput || '1.2k'}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Requests Per Second</p>
          <div className="mt-6 w-full pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Peak Load</span>
              <span className="text-[9px] font-black text-indigo-500 uppercase">Sustainable</span>
            </div>
          </div>
        </EliteCard>
      </div>
      {/* Integration Status */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Icon name="Activity" className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">External Nexus Status</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Third-Party Gateway Connectivity</p>
          </div>
        </div>

        {integrationStatus.length === 0 ? (
          <EliteCard className="p-8 border-white/5 bg-white/[0.02] text-center">
            <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-20 text-slate-500" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active integrations detected</p>
          </EliteCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrationStatus?.map((integration) => (
              <EliteCard key={integration?.name} className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-md font-black text-white uppercase tracking-tight">{integration?.name}</h4>
                  <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${getStatusColor(integration?.status)}`}>
                    {integration?.status}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Latency</span>
                    <span className="text-xs font-black text-white">{integration?.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Version</span>
                    <span className="text-xs font-black text-slate-300 font-mono">{integration?.version}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uptime Reliability</span>
                    <span className="text-xs font-black text-emerald-500">{integration?.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Last Telemetry Check</span>
                    <span className="text-[10px] font-black text-slate-500">{integration?.lastCheck}</span>
                  </div>
                </div>
              </EliteCard>
            ))}
          </div>
        )}
      </div>

      {/* Error Logs */}
      <EliteCard className="border-white/5 bg-white/[0.02]">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <Icon name="AlertCircle" className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">System Error Logs</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Incident Monitoring</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <select
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e?.target?.value)}
                  className="appearance-none bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-xs font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all cursor-pointer hover:bg-white/10"
                >
                  <option value="all" className="bg-[#0A1628]">All Levels</option>
                  <option value="error" className="bg-[#0A1628]">Critical Errors</option>
                  <option value="warning" className="bg-[#0A1628]">Warnings</option>
                  <option value="info" className="bg-[#0A1628]">Information</option>
                </select>
                <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-rose-500 transition-colors" />
              </div>
              <button className="px-5 py-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] border border-white/5 flex items-center gap-2 group">
                <Icon name="Download" size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                Export Archive
              </button>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-emerald-500/20" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">System Pulse Nominal: No Incidents</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Level</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service Nexus</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Payload Message</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {filteredLogs?.map((log) => (
                    <tr key={log?.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-4 text-xs text-slate-400 font-mono tracking-tighter">{log?.timestamp}</td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${getLevelColor(log?.level)}`}>
                          {log?.level}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-black text-white uppercase tracking-tight">{log?.service}</td>
                      <td className="py-4">
                        <div className="text-xs text-slate-300 font-medium max-w-md truncate">{log?.message}</div>
                        {log?.details && <div className="text-[10px] text-slate-600 truncate max-w-md italic">{log?.details}</div>}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${log?.resolved ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${log?.resolved ? 'text-emerald-500/60' : 'text-rose-500'}`}>
                            {log?.resolved ? 'Mitigated' : 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-slate-500 hover:text-white transition-colors">
                            <Icon name="Eye" size={14} />
                          </button>
                          {!log?.resolved && (
                            <button className="p-1 px-2 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </EliteCard>
    </div>
  );
};

export default SystemMonitoring;
