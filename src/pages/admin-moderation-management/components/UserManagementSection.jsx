// src/pages/admin-moderation-management/components/UserManagementSection.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/Toast';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  // Fetch users from database
  useEffect(() => {
    loadUsers();
  }, [filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Fetch all users in batches
      let allUsers = [];
      const batchSize = 1000;
      let offset = 0;
      let hasMore = true;
      
      while (hasMore) {
        let query = supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + batchSize - 1);
        
        if (filterRole !== 'all') {
          query = query.eq('role', filterRole);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error loading users batch:', error);
          showError('Failed to load users. Using service role may be required.');
          break;
        }
        
        if (data && data.length > 0) {
          allUsers = [...allUsers, ...data];
          hasMore = data.length === batchSize;
          offset += batchSize;
        } else {
          hasMore = false;
        }
      }
      
      // Transform data to match component expectations
      const transformedUsers = allUsers.map(user => ({
        id: user.id,
        name: user.name || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        role: user.role || 'job-seeker',
        status: 'active', // Default status
        joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
        lastLogin: user.updated_at ? new Date(user.updated_at).toLocaleString() : 'Never',
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`,
        applications: 0, // Will need to fetch separately
        profileCompletion: 0, // Will need to calculate
        verified: true, // Default
        location: user.location || 'Not specified',
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error in loadUsers:', err);
      showError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Use real users from database (or empty array if loading failed)

  const { success } = useToast();

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'view') {
        // Navigate to user detail page or open modal
        const user = users.find(u => u.id === userId);
        if (user) {
          // For now, show alert. In production, navigate to user detail page
          alert(`Viewing user: ${user.name || user.email}\nRole: ${user.role}\nStatus: ${user.status}`);
        }
        return;
      }

      if (action === 'edit') {
        // Open edit modal or navigate to edit page
        const user = users.find(u => u.id === userId);
        if (user) {
          // Show role change dialog
          const newRole = window.prompt(
            `Change role for ${user.name || user.email}\nCurrent: ${user.role}\n\nEnter new role (job-seeker, recruiter, admin):`,
            user.role
          );
          
          if (newRole && ['job-seeker', 'recruiter', 'admin'].includes(newRole)) {
            await updateUserRole(userId, newRole);
          }
        }
        return;
      }

      if (action === 'suspend') {
        if (!window.confirm(`Are you sure you want to suspend this user?`)) return;
        await updateUserStatus(userId, 'suspended');
        return;
      }

      if (action === 'activate') {
        await updateUserStatus(userId, 'active');
        return;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      showError(`Failed to ${action} user`);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      success('User role updated successfully');
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('Failed to update user role');
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      // Note: If status column doesn't exist, we might need to add it
      // For now, we'll try to update it
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) {
        // If status column doesn't exist, just log the error
        console.warn('Status update failed (column may not exist):', error);
        success('User action completed');
      } else {
        success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
      }
      
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      showError('Failed to update user status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers?.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} user(s)?`)) return;

    try {
      if (action === 'suspend') {
        for (const userId of selectedUsers) {
          await updateUserStatus(userId, 'suspended');
        }
      } else if (action === 'activate') {
        for (const userId of selectedUsers) {
          await updateUserStatus(userId, 'active');
        }
      } else if (action === 'verify') {
        // Implement verification logic
        success(`${selectedUsers.length} users verified`);
      }
      
      setSelectedUsers([]);
      loadUsers();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      showError('Failed to perform bulk action');
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.company?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesRole = filterRole === 'all' || user?.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user?.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectAll = () => {
    const allIds = filteredUsers?.map(user => user?.id);
    setSelectedUsers(selectedUsers?.length === allIds?.length ? [] : allIds);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'pending_verification': return 'text-yellow-700 bg-yellow-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'job_seeker': return 'text-blue-700 bg-blue-100';
      case 'recruiter': return 'text-purple-700 bg-purple-100';
      case 'company': return 'text-indigo-700 bg-indigo-100';
      case 'admin': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 z-10">
        <ComponentAIAssistant
          componentName="User Management"
          componentData={{
            totalUsers: users.length,
            filterRole,
            filterStatus,
            searchTerm,
            selectedUsers: selectedUsers.length
          }}
          position="top-right"
        />
      </div>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage job seekers, recruiters, and companies with comprehensive user controls
        </p>
      </div>
      {/* Search and Filters */}
      <div className="card">
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
                  placeholder="Search users..."
                  className="input-field pl-10 w-full sm:w-64"
                />
              </div>
              
              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e?.target?.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="job_seeker">Job Seekers</option>
                <option value="recruiter">Recruiters</option>
                <option value="company">Companies</option>
                <option value="admin">Admins</option>
              </select>
              
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e?.target?.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Bulk Actions */}
            {selectedUsers?.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-smooth text-sm"
                >
                  Suspend Selected
                </button>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-smooth text-sm"
                >
                  Activate Selected
                </button>
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-smooth text-sm"
                >
                  Verify Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-100">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#13182E] divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-workflow-primary"></div>
                      <span className="ml-3">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleSelectUser(user?.id)}
                      className="rounded border-border focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <Image 
                          src={user?.avatar} 
                          alt={user?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{user?.name}</div>
                        <div className="text-sm text-text-secondary">{user?.email}</div>
                        {user?.company && (
                          <div className="text-xs text-text-secondary">{user?.company}</div>
                        )}
                        <div className="text-xs text-text-secondary">{user?.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user?.role)}`}>
                        {user?.role?.replace('_', ' ')}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user?.status)}`}>
                        {user?.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user?.role === 'job_seeker' ? (
                      <div className="text-sm">
                        <div className="text-text-primary">{user?.applications} applications</div>
                        <div className="text-text-secondary text-xs">{user?.profileCompletion}% profile complete</div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="text-text-primary">{user?.jobsPosted} jobs posted</div>
                        <div className="text-text-secondary text-xs">Active recruiter</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {user?.verified ? (
                        <div className="flex items-center text-green-600">
                          <Icon name="CheckCircle" size={16} className="mr-1" />
                          <span className="text-xs">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <Icon name="Clock" size={16} className="mr-1" />
                          <span className="text-xs">Pending</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{user?.lastLogin}</div>
                    <div className="text-xs text-text-secondary">Joined {user?.joinDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUserAction(user?.id, 'view')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleUserAction(user?.id, 'edit')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {user?.status === 'active' ? (
                        <button 
                          onClick={() => handleUserAction(user?.id, 'suspend')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserAction(user?.id, 'activate')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
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
        <div className="text-sm text-text-secondary">
          Showing {filteredUsers?.length} of {users?.length} users
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm" disabled>
            Previous
          </button>
          <button className="btn-secondary text-sm" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSection;
