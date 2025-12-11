import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const JobPerformanceTable = () => {
  const [sortField, setSortField] = useState('views');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();

  // Fetch jobs for current recruiter
  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadJobs();
    }
  }, [user, profile]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Fetch only recruiter's jobs (not all jobs)
      const result = profile?.role === 'admin'
        ? await jobService.getAll({ pageSize: 100 }) // Admins see all
        : await jobService.getByRecruiter(user.id, { pageSize: 100 }); // Recruiters see only their own
      
      // Fetch applications for each job to calculate metrics
      const jobsWithMetrics = await Promise.all(
        (result.data || []).map(async (job) => {
          try {
            // Get applications for this job
            const applications = await applicationService.getByJobId(job.id);
            
            return {
              id: job.id,
              title: job.title,
              department: job.industry || 'General',
              location: job.location || 'Not specified',
              posted: job.created_at ? new Date(job.created_at).toISOString().split('T')[0] : '',
              expires: job.expires_at ? new Date(job.expires_at).toISOString().split('T')[0] : '',
              status: job.status || 'active',
              views: 0, // Would need view tracking
              applications: applications?.length || 0,
              costPerApplication: 0, // Would need pricing data
              conversionRate: 0, // Would need view data
            };
          } catch {
            return {
              id: job.id,
              title: job.title,
              department: job.industry || 'General',
              location: job.location || 'Not specified',
              posted: job.created_at ? new Date(job.created_at).toISOString().split('T')[0] : '',
              expires: job.expires_at ? new Date(job.expires_at).toISOString().split('T')[0] : '',
              status: job.status || 'active',
              views: 0,
              applications: 0,
              costPerApplication: 0,
              conversionRate: 0,
            };
          }
        })
      );
      
      setJobsData(jobsWithMetrics);
    } catch (error) {
      console.error('Error loading jobs:', error);
      showError('Failed to load jobs');
      setJobsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Use real jobsData from state

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredJobs = filter === 'all' 
    ? jobsData 
    : jobsData?.filter(job => job?.status === filter);

  const sortedJobs = [...filteredJobs]?.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a?.[sortField] > b?.[sortField] ? 1 : -1;
    } else {
      return a?.[sortField] < b?.[sortField] ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card overflow-hidden bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-6 pt-6 gap-4">
        <h3 className="text-lg font-medium text-text-primary dark:text-white">Job Performance</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="input-field py-1.5 pl-3 pr-10 text-sm bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Icon name="ChevronDown" size={16} className="text-text-secondary dark:text-gray-400" />
            </div>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-text-secondary dark:text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field py-1.5 pl-10 pr-4 text-sm w-full bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-gray-700">
          <thead className="bg-surface-100 dark:bg-surface-800">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Job Title
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th 
                scope="col" 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-700 transition-smooth"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center">
                  <span>Views</span>
                  {sortField === 'views' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-700 transition-smooth"
                onClick={() => handleSort('applications')}
              >
                <div className="flex items-center">
                  <span>Applications</span>
                  {sortField === 'applications' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-700 transition-smooth hidden lg:table-cell"
                onClick={() => handleSort('conversionRate')}
              >
                <div className="flex items-center">
                  <span>Conversion</span>
                  {sortField === 'conversionRate' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-700 transition-smooth hidden xl:table-cell"
                onClick={() => handleSort('costPerApplication')}
              >
                <div className="flex items-center">
                  <span>Cost/App</span>
                  {sortField === 'costPerApplication' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Expires
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background dark:bg-[#13182E] divide-y divide-border dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-400"></div>
                    <span className="ml-3 text-text-secondary dark:text-gray-400">Loading jobs...</span>
                  </div>
                </td>
              </tr>
            ) : sortedJobs?.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <Icon name="Briefcase" size={48} className="mx-auto mb-4 text-secondary-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium text-text-primary dark:text-white mb-1">No jobs found</h3>
                  <p className="text-text-secondary dark:text-gray-400">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              sortedJobs?.map((job) => (
                <tr key={job?.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-smooth">
                <td className="px-4 sm:px-6 py-4">
                  <div className="text-sm font-medium text-text-primary dark:text-white">{job?.title}</div>
                  <div className="text-xs text-text-secondary dark:text-gray-400">{job?.department} • {job?.location}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job?.status === 'active' 
                      ? 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400' 
                      : job?.status === 'expired' 
                      ? 'bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400' 
                      : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400'
                  }`}>
                    {job?.status?.charAt(0)?.toUpperCase() + job?.status?.slice(1)}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-white">
                  {job?.views?.toLocaleString()}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-white">
                  {job?.applications}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-white hidden lg:table-cell">
                  {job?.conversionRate?.toFixed(2)}%
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-white hidden xl:table-cell">
                  ${job?.costPerApplication?.toFixed(2)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-gray-400 hidden md:table-cell">
                  {formatDate(job?.expires)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth" title="View">
                      <Icon name="Eye" size={16} />
                    </button>
                    <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth" title="Edit">
                      <Icon name="Edit" size={16} />
                    </button>
                    <button className="text-text-secondary hover:text-error dark:hover:text-error-400 transition-smooth" title="Delete">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border dark:border-gray-700">
        <div className="text-sm text-text-secondary dark:text-gray-400">
          Showing <span className="font-medium text-text-primary dark:text-white">{sortedJobs?.length}</span> of <span className="font-medium text-text-primary dark:text-white">{jobsData?.length}</span> jobs
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400 dark:hover:text-white transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400 dark:hover:text-white transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPerformanceTable;