// src/pages/admin-moderation-management/components/ModerationQueue.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';

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
      
      // Fetch jobs that need moderation (draft, pending, or flagged)
      const jobsResult = await jobService.getAll({ pageSize: 1000 });
      const allJobs = jobsResult.data || [];
      
      // Filter jobs that need moderation
      const jobsNeedingModeration = allJobs.filter(job => 
        !job.status || 
        job.status === 'draft' || 
        job.status === 'pending' || 
        job.status === 'under_review'
      );

      // Transform to moderation queue format
      const items = jobsNeedingModeration.map(job => {
        // Determine priority based on creation date and status
        let priority = 'medium';
        const daysSinceCreation = job.created_at 
          ? Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24))
          : 0;
        
        if (daysSinceCreation > 7) priority = 'urgent';
        else if (daysSinceCreation > 3) priority = 'high';
        else if (daysSinceCreation > 1) priority = 'medium';
        else priority = 'low';

        return {
          id: job.id,
          type: 'job_posting',
          title: job.title,
          company: job.company || 'Unknown Company',
          submittedBy: job.created_by || 'Unknown',
          submittedAt: job.created_at ? new Date(job.created_at).toLocaleString() : 'Unknown',
          priority,
          status: job.status || 'pending',
          category: job.industry || job.department || 'General',
          flaggedReason: job.status === 'pending' ? 'Awaiting admin approval' : 
                        job.status === 'draft' ? 'Draft job posting' : 
                        'Requires review',
          jobData: job,
        };
      });

      // Filter by status
      const filtered = filterStatus === 'all' 
        ? items 
        : items.filter(item => item.status === filterStatus);

      setPendingItems(filtered);
    } catch (error) {
      console.error('Error loading moderation queue:', error);
      showError('Failed to load moderation queue');
      setPendingItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const allIds = pendingItems.map(item => item.id);
    setSelectedItems(selectedItems.length === allIds.length ? [] : allIds);
  };

  const handleBulkAction = async () => {
    if (bulkAction && selectedItems.length > 0) {
      try {
        // Update jobs based on bulk action
        const updates = {};
        if (bulkAction === 'approve') {
          updates.status = 'active';
        } else if (bulkAction === 'reject') {
          updates.status = 'rejected';
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('jobs')
            .update(updates)
            .in('id', selectedItems);

          if (error) throw error;
          
          success(`Successfully ${bulkAction}d ${selectedItems.length} item(s)`);
          setSelectedItems([]);
          setBulkAction('');
          loadPendingItems();
        }
      } catch (error) {
        console.error('Error performing bulk action:', error);
        showError('Failed to perform bulk action');
      }
    }
  };

  const handleItemAction = async (itemId, action) => {
    try {
      const updates = {};
      if (action === 'approve') {
        updates.status = 'active';
      } else if (action === 'reject') {
        updates.status = 'rejected';
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('jobs')
          .update(updates)
          .eq('id', itemId);

        if (error) throw error;
        
        success(`Job ${action}d successfully`);
        loadPendingItems();
      }
    } catch (error) {
      console.error('Error performing action:', error);
      showError('Failed to perform action');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'under_review': return 'text-blue-700 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'approved': case 'active': return 'text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job_posting': return 'Briefcase';
      case 'user_verification': return 'UserCheck';
      case 'reported_content': return 'Flag';
      default: return 'FileText';
    }
  };

  const filteredItems = filterStatus === 'all' 
    ? pendingItems 
    : pendingItems.filter(item => item.status === filterStatus);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-text-primary dark:text-white">Moderation Queue</h2>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Review and approve pending content, user verifications, and reported items
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field text-sm bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
          >
            <option value="all">All Items</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex space-x-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="input-field text-sm bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                className="btn-primary text-sm"
                disabled={!bulkAction}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Moderation Queue Table */}
      <div className="card overflow-hidden bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border dark:divide-gray-700">
            <thead className="bg-surface-100 dark:bg-surface-800">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border dark:border-gray-600 focus:ring-primary dark:bg-surface-700"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background dark:bg-[#13182E] divide-y divide-border dark:divide-gray-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-secondary-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium text-text-primary dark:text-white mb-1">No items pending moderation</h3>
                    <p className="text-text-secondary dark:text-gray-400">All items have been reviewed</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-smooth">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-border dark:border-gray-600 focus:ring-primary dark:bg-surface-700"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center justify-center">
                          <Icon name={getTypeIcon(item.type)} size={16} className="text-text-secondary dark:text-gray-400" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-text-primary dark:text-white capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary dark:text-white">{item.title}</div>
                        <div className="text-sm text-text-secondary dark:text-gray-400">{item.company}</div>
                        <div className="text-xs text-text-secondary dark:text-gray-500 mt-1">{item.flaggedReason}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary dark:text-white">{item.submittedBy}</div>
                      <div className="text-xs text-text-secondary dark:text-gray-400">
                        {item.submittedAt ? formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true }) : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleItemAction(item.id, 'approve')}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleItemAction(item.id, 'reject')}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary dark:text-gray-400">
          Showing {filteredItems.length} of {pendingItems.length} items
        </div>
      </div>
    </div>
  );
};

export default ModerationQueue;
