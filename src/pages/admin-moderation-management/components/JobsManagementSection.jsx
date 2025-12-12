/**
 * Jobs Management Section for Admin
 * Allows admins to view, edit, delete, and manage all jobs
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { jobService } from '../../../services/jobService';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const JobsManagementSection = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadJobs();
  }, [filterStatus, filterIndustry]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const result = await jobService.getAll({ limit: 1000 });
      setJobs(result.data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      showError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/job-posting-creation-management?edit=${jobId}`);
  };

  const handleView = (jobId) => {
    navigate(`/jobs/detail?id=${jobId}`);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      success('Job deleted successfully');
      loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      showError('Failed to delete job');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedJobs.length} jobs?`)) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .in('id', selectedJobs);

      if (error) throw error;
      
      success(`${selectedJobs.length} jobs deleted successfully`);
      setSelectedJobs([]);
      loadJobs();
    } catch (error) {
      console.error('Error bulk deleting jobs:', error);
      showError('Failed to delete jobs');
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;
      
      success('Job status updated');
      loadJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      showError('Failed to update job status');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesIndustry = filterIndustry === 'all' || job.industry === filterIndustry;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 z-10">
        <ComponentAIAssistant
          componentName="Jobs Management"
          componentData={{
            totalJobs: jobs.length,
            filterStatus,
            filterIndustry,
            selectedJobs: selectedJobs.length
          }}
          position="top-right"
        />
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary dark:text-white">Jobs Management</h2>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Manage all job postings on the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedJobs.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete Selected ({selectedJobs.length})
            </button>
          )}
          <button
            onClick={() => navigate('/job-posting-creation-management')}
            className="btn-primary flex items-center gap-2"
          >
            <Icon name="Plus" size={16} />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
            Search Jobs
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, company, location..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">
            Industry
          </label>
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
          >
            <option value="all">All Industries</option>
            {[...new Set(jobs.map(j => j.industry).filter(Boolean))].map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-[#13182E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1A2139] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === paginatedJobs.length && paginatedJobs.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedJobs(paginatedJobs.map(j => j.id));
                      } else {
                        setSelectedJobs([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary dark:text-white">Job Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary dark:text-white">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary dark:text-white">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary dark:text-white">Posted</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-text-secondary dark:text-gray-400">
                    No jobs found
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-[#1A2139] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJobs([...selectedJobs, job.id]);
                          } else {
                            setSelectedJobs(selectedJobs.filter(id => id !== job.id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary dark:text-white">{job.title}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary dark:text-gray-400">{job.company}</td>
                    <td className="px-4 py-3 text-text-secondary dark:text-gray-400">{job.location}</td>
                    <td className="px-4 py-3">
                      <select
                        value={job.status || 'active'}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-text-primary dark:text-white border border-gray-300 dark:border-gray-700"
                      >
                        <option value="active">Active</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="expired">Expired</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-text-secondary dark:text-gray-400 text-sm">
                      {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(job.id)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(job.id)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Icon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete"
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="text-sm text-text-secondary dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-text-primary dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-text-primary dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsManagementSection;
