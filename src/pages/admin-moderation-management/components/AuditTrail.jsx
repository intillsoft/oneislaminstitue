// src/pages/admin-moderation-management/components/AuditTrail.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { adminService } from '../../../services/adminService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

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
    if (user && profile?.role === 'admin') {
      loadAuditActivities();
    } else {
      setLoading(false);
    }
  }, [user, profile, filterUser, filterAction, dateRange, searchTerm]);

  const loadAuditActivities = async () => {
    try {
      setLoading(true);
      const filters = {
        userRole: filterUser === 'all' ? undefined : filterUser,
        actionType: filterAction === 'all' ? undefined : filterAction,
        dateRange,
        searchTerm,
      };
      const activities = await adminService.getAuditTrail(filters);
      setAuditActivities(activities || []);
    } catch (error) {
      console.error('Error loading audit activities:', error);
      showError('Failed to load audit trail');
      setAuditActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'user_suspended': return 'text-red-700 bg-red-100';
      case 'job_approved': return 'text-green-700 bg-green-100';
      case 'content_rejected': return 'text-red-700 bg-red-100';
      case 'coupon_created': return 'text-blue-700 bg-blue-100';
      case 'settings_updated': return 'text-purple-700 bg-purple-100';
      case 'user_verified': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_suspended': return 'UserX';
      case 'job_approved': return 'CheckCircle';
      case 'content_rejected': return 'XCircle';
      case 'coupon_created': return 'Tag';
      case 'settings_updated': return 'Settings';
      case 'user_verified': return 'UserCheck';
      default: return 'Activity';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-700 bg-red-100';
      case 'moderator': return 'text-purple-700 bg-purple-100';
      case 'user': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredActivities = auditActivities?.filter(activity => {
    const matchesUser = filterUser === 'all' || activity?.user?.role === filterUser;
    const matchesAction = filterAction === 'all' || activity?.action === filterAction;
    const matchesSearch = searchTerm === '' || 
      activity?.target?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      activity?.details?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      activity?.user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    return matchesUser && matchesAction && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const exportAuditTrail = () => {
    console.log('Exporting audit trail for date range:', dateRange);
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">Audit Trail</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Comprehensive activity logging with user attribution and timestamp tracking
        </p>
      </div>
      {/* Filters */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={16} className="text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  placeholder="Search activities..."
                  className="input-field pl-10 w-full sm:w-64"
                />
              </div>
              
              {/* User Filter */}
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e?.target?.value)}
                className="input-field"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="moderator">Moderators</option>
                <option value="user">Users</option>
              </select>
              
              {/* Action Filter */}
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e?.target?.value)}
                className="input-field"
              >
                <option value="all">All Actions</option>
                <option value="user_suspended">User Suspensions</option>
                <option value="job_approved">Job Approvals</option>
                <option value="content_rejected">Content Rejections</option>
                <option value="coupon_created">Coupon Creation</option>
                <option value="settings_updated">Settings Updates</option>
                <option value="user_verified">User Verifications</option>
              </select>
              
              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e?.target?.value)}
                className="input-field"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={exportAuditTrail}
                className="btn-secondary flex items-center space-x-2"
              >
                <Icon name="Download" size={16} />
                <span>Export</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Activity Timeline */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-6">Activity Timeline</h3>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-gray-400">
              <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No audit activities found</p>
              <p className="text-sm mt-1">Activity logs will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredActivities?.map((activity, index) => (
                <div key={activity?.id} className="relative">
                  {/* Timeline Line */}
                  {index < filteredActivities?.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border dark:bg-gray-700"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Action Icon */}
                    <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name={getActionIcon(activity?.action)} size={20} className="text-text-secondary dark:text-gray-400" />
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Activity Header */}
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActionColor(activity?.action)}`}>
                              {activity?.action?.replace('_', ' ')?.toUpperCase()}
                            </span>
                            <span className="text-sm text-text-secondary dark:text-gray-400">{activity?.timestamp}</span>
                          </div>
                          
                          {/* User Info */}
                          {activity?.user && (
                            <div className="flex items-center space-x-3 mb-3">
                              <Image 
                                src={activity?.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity?.user?.name || 'User')}`} 
                                alt={activity?.user?.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <span className="text-sm font-medium text-text-primary dark:text-white">{activity?.user?.name}</span>
                                {activity?.user?.role && (
                                  <span className={`ml-2 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(activity?.user?.role)}`}>
                                    {activity?.user?.role}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Activity Details */}
                          <div className="space-y-2">
                            {activity?.target && (
                              <div>
                                <span className="text-sm font-medium text-text-primary dark:text-white">Target: </span>
                                <span className="text-sm text-text-secondary dark:text-gray-400">{activity?.target}</span>
                              </div>
                            )}
                            {activity?.details && (
                              <div>
                                <span className="text-sm font-medium text-text-primary dark:text-white">Action: </span>
                                <span className="text-sm text-text-secondary dark:text-gray-400">{activity?.details}</span>
                              </div>
                            )}
                            
                            {/* Changes */}
                            {activity?.changes && (
                              <div className="mt-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <h4 className="text-sm font-medium text-text-primary dark:text-white mb-2">Changes Made:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {activity?.changes?.before && (
                                    <div>
                                      <span className="text-xs font-medium text-red-600 dark:text-red-400">Before:</span>
                                      <pre className="text-xs text-text-secondary dark:text-gray-400 mt-1 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                        {JSON.stringify(activity?.changes?.before, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">After:</span>
                                    <pre className="text-xs text-text-secondary dark:text-gray-400 mt-1 font-mono bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                      {JSON.stringify(activity?.changes?.after, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Technical Details */}
                            {(activity?.ipAddress || activity?.userAgent) && (
                              <div className="mt-3 text-xs text-text-secondary dark:text-gray-400 space-y-1">
                                {activity?.ipAddress && <div>IP Address: {activity?.ipAddress}</div>}
                                {activity?.userAgent && <div>User Agent: {activity?.userAgent?.substring(0, 60)}...</div>}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Menu */}
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                            View Details
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary dark:text-white">Total Activities</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredActivities?.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary dark:text-white">Approvals</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {filteredActivities?.filter(a => a?.action?.includes('approved'))?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Icon name="XCircle" size={16} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary dark:text-white">Rejections</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {filteredActivities?.filter(a => a?.action?.includes('rejected') || a?.action?.includes('suspended'))?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary dark:text-white">Config Changes</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {filteredActivities?.filter(a => a?.action?.includes('settings') || a?.action?.includes('created'))?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;