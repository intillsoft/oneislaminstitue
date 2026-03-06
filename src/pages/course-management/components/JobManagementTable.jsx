import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';

const JobManagementTable = ({ onEdit, onDuplicate }) => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('datePosted');
  const [sortDirection, setSortDirection] = useState('desc');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // For now, load all jobs. In production, filter by company/user
      const result = await jobService.getAll({ pageSize: 100 });
      setJobs(result.data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      showError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search query and status filter
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         job?.company?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    // Map database status to UI status
    const jobStatus = job.status || 'active';
    const matchesStatus = statusFilter === 'all' || jobStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Sort jobs
  const sortedJobs = [...filteredJobs]?.sort((a, b) => {
    let aValue = a?.[sortBy === 'datePosted' ? 'created_at' : sortBy];
    let bValue = b?.[sortBy === 'datePosted' ? 'created_at' : sortBy];
    
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    if (sortBy === 'datePosted') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  const formatLocation = (location) => {
    if (!location) return 'Not specified';
    if (location.toLowerCase().includes('remote')) return 'Remote';
    return location;
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748B] dark:text-[#8B92A3]">Please sign in to manage jobs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse h-20 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-soft overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} color="#64748B" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAFC] dark:bg-[#1A2139]">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider cursor-pointer hover:bg-[#E2E8F0] dark:hover:bg-[#1E2640]"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Course Title
                  <Icon name={sortBy === 'title' ? (sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'} size={14} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider cursor-pointer hover:bg-[#E2E8F0] dark:hover:bg-[#1E2640]"
                onClick={() => handleSort('datePosted')}
              >
                <div className="flex items-center gap-2">
                  Posted
                  <Icon name={sortBy === 'datePosted' ? (sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'} size={14} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedJobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-[#64748B] dark:text-[#8B92A3]">
                  No courses found
                </td>
              </tr>
            ) : (
              sortedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">{job.title}</div>
                      <div className="text-sm text-[#64748B] dark:text-[#8B92A3]">{job.company || job.companies?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] dark:text-[#8B92A3]">
                    {formatLocation(job.location)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] dark:text-[#8B92A3]">
                    {job.employment_type || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] dark:text-[#8B92A3]">
                    {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'active' 
                        ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                        : job.status === 'draft'
                        ? 'bg-[#F8FAFC] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3]'
                        : 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400'
                    }`}>
                      {job.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(job)}
                        className="text-workflow-primary hover:text-workflow-primary-600"
                        aria-label="Edit"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => onDuplicate?.(job)}
                        className="text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED]"
                        aria-label="Duplicate"
                      >
                        <Icon name="Copy" size={16} />
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
  );
};

export default JobManagementTable;
