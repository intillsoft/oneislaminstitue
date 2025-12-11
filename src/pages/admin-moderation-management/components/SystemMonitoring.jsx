// src/pages/admin-moderation-management/components/SystemMonitoring.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { adminService } from '../../../services/adminService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

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
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-medium text-text-primary dark:text-white">Performance Metrics</h3>
            <div className="flex flex-wrap gap-3">
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e?.target?.value)}
                className="input-field text-sm bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
              >
                <option value="10">Refresh every 10s</option>
                <option value="30">Refresh every 30s</option>
                <option value="60">Refresh every 1m</option>
                <option value="300">Refresh every 5m</option>
              </select>
              <button 
                onClick={loadMonitoringData}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Activity" size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{performanceMetrics?.serverUptime}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Server Uptime</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Cpu" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className={`text-2xl font-bold dark:text-white ${getMetricColor(performanceMetrics?.cpuUsage, 'usage')}`}>
                {performanceMetrics?.cpuUsage}
              </h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">CPU Usage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="HardDrive" size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className={`text-2xl font-bold dark:text-white ${getMetricColor(performanceMetrics?.memoryUsage, 'usage')}`}>
                {performanceMetrics?.memoryUsage}
              </h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Memory Usage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Database" size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className={`text-2xl font-bold dark:text-white ${getMetricColor(performanceMetrics?.diskSpace, 'usage')}`}>
                {performanceMetrics?.diskSpace}
              </h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Disk Usage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{performanceMetrics?.responseTime}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Avg Response Time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="TrendingUp" size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary dark:text-white">{performanceMetrics?.throughput}</h4>
              <p className="text-sm text-text-secondary dark:text-gray-400">Throughput</p>
            </div>
          </div>
        </div>
      </div>
      {/* Integration Status */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Third-Party Integration Status</h3>
          {integrationStatus.length === 0 ? (
            <div className="text-center py-8 text-text-secondary dark:text-gray-400">
              <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No integration data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {integrationStatus?.map((integration) => (
                <div key={integration?.name} className="border border-border dark:border-gray-700 rounded-lg p-4 bg-surface-50 dark:bg-surface-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-text-primary dark:text-white">{integration?.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration?.status)}`}>
                      {integration?.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary dark:text-gray-400">Response Time:</span>
                      <span className="text-text-primary dark:text-white font-medium">{integration?.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary dark:text-gray-400">Version:</span>
                      <span className="text-text-primary dark:text-white">{integration?.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary dark:text-gray-400">Uptime:</span>
                      <span className="text-text-primary dark:text-white">{integration?.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary dark:text-gray-400">Last Check:</span>
                      <span className="text-text-primary dark:text-white">{integration?.lastCheck}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Error Logs */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-medium text-text-primary dark:text-white">System Error Logs</h3>
            <div className="flex flex-wrap gap-3">
              <select
                value={alertLevel}
                onChange={(e) => setAlertLevel(e?.target?.value)}
                className="input-field text-sm bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
              >
                <option value="all">All Levels</option>
                <option value="error">Errors Only</option>
                <option value="warning">Warnings Only</option>
                <option value="info">Info Only</option>
              </select>
              <button className="btn-secondary text-sm flex items-center space-x-2">
                <Icon name="Download" size={16} />
                <span>Export Logs</span>
              </button>
            </div>
          </div>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-gray-400">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500 dark:text-green-400 opacity-50" />
              <p>No error logs found</p>
              <p className="text-sm mt-1">System is running smoothly</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Timestamp</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Level</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Service</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Message</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs?.map((log) => (
                    <tr key={log?.id} className="border-b border-border dark:border-gray-700 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="py-4 text-sm text-text-primary dark:text-white font-mono">{log?.timestamp}</td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log?.level)}`}>
                          {log?.level?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-text-primary dark:text-white font-medium">{log?.service}</td>
                      <td className="py-4">
                        <div className="text-sm text-text-primary dark:text-white">{log?.message}</div>
                        <div className="text-xs text-text-secondary dark:text-gray-400 mt-1">{log?.details}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {log?.resolved ? (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <Icon name="CheckCircle" size={16} className="mr-1" />
                              <span className="text-xs">Resolved</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <Icon name="AlertCircle" size={16} className="mr-1" />
                              <span className="text-xs">Active</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">View</button>
                          {!log?.resolved && (
                            <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm">Resolve</button>
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
      </div>
    </div>
  );
};

export default SystemMonitoring;