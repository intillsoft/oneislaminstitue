import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useToast } from '../../../components/ui/Toast';
import { apiService } from '../../../lib/api';
import { formatDistanceToNow } from 'date-fns';

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
      
      if (filter !== 'all') {
        data = data.filter(r => r.status === filter);
      }
      
      setRequests(data);
    } catch (error) {
      console.error('Error loading role change requests:', error);
      showError('Failed to load role change requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this role change request?')) return;

    try {
      await apiService.profile.approveRoleChangeRequest(requestId);
      success('Role change request approved!');
      loadRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      showError('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    
    try {
      await apiService.profile.rejectRoleChangeRequest(requestId, { rejection_reason: reason });
      success('Role change request rejected');
      loadRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      showError('Failed to reject request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      approved: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
        <p className="text-[#64748B] dark:text-[#8B92A3]">Loading role change requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-workflow-primary text-white'
                  : 'bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED] hover:bg-gray-200 dark:hover:bg-[#1E2640]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1A2139]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase">Requested Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2640]">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-[#1A2139]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {request.user?.avatar_url ? (
                          <img
                            src={request.user.avatar_url}
                            alt={request.user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                            <Icon name="User" size={20} className="text-workflow-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#0F172A] dark:text-[#E8EAED]">{request.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">{request.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium capitalize">
                        {request.requested_role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#0F172A] dark:text-[#E8EAED] line-clamp-2 max-w-md">
                        {request.reason}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] dark:text-[#8B92A3]">
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'rejected' && request.rejection_reason && (
                        <p className="text-xs text-red-600 dark:text-red-400 max-w-xs">
                          {request.rejection_reason}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Icon name="Inbox" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                    <p className="text-[#64748B] dark:text-[#8B92A3]">No role change requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeRequestsSection;

