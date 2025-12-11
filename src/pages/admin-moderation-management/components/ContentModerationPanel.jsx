// src/pages/admin-moderation-management/components/ContentModerationPanel.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import { formatRequirements } from '../../../utils/jobDataFormatter';

const ContentModerationPanel = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [jobsRequiringApproval, setJobsRequiringApproval] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadJobsRequiringApproval();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const loadJobsRequiringApproval = async () => {
    try {
      setLoading(true);
      const jobsResult = await jobService.getAll({ pageSize: 1000 });
      const allJobs = jobsResult.data || [];
      
      // Filter jobs that need approval
      const jobsNeedingApproval = allJobs.filter(job => 
        !job.status || 
        job.status === 'draft' || 
        job.status === 'pending' || 
        job.status === 'pending_approval' ||
        job.status === 'under_review'
      );

      // Fetch company/user data for jobs
      const jobsWithDetails = await Promise.all(
        jobsNeedingApproval.map(async (job) => {
          let postedBy = 'Unknown';
          let company = job.company || 'Unknown Company';
          
          if (job.created_by) {
            try {
              const { data: creator } = await supabase
                .from('users')
                .select('name, email')
                .eq('id', job.created_by)
                .single();
              if (creator) {
                postedBy = creator.name || creator.email || 'Unknown';
              }
            } catch (e) {
              console.error('Error fetching creator:', e);
            }
          }

          return {
            id: job.id,
            title: job.title,
            company: company,
            location: job.location || 'Not specified',
            salary: job.salary || (job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Not specified'),
            postedBy: postedBy,
            postedAt: job.created_at ? new Date(job.created_at).toLocaleString() : 'Unknown',
            status: job.status || 'pending_approval',
            flaggedIssues: job.status === 'pending' ? ['Awaiting admin approval'] : 
                          job.status === 'draft' ? ['Draft job posting'] : 
                          ['Requires review'],
            originalContent: {
              description: job.description || 'No description provided',
              requirements: (() => {
                const reqs = formatRequirements(job.requirements);
                return reqs.length > 0 ? reqs : ['No requirements specified'];
              })(),
              benefits: Array.isArray(job.benefits) ? job.benefits : 
                      (typeof job.benefits === 'string' ? job.benefits.split('\n').filter(b => b.trim()) : ['No benefits specified'])
            },
            jobData: job,
          };
        })
      );

      setJobsRequiringApproval(jobsWithDetails);
    } catch (error) {
      console.error('Error loading jobs:', error);
      showError('Failed to load jobs requiring approval');
      setJobsRequiringApproval([]);
    } finally {
      setLoading(false);
    }
  };

  const rejectionReasons = [
    'Discriminatory content',
    'Misleading job description',
    'Unrealistic requirements',
    'Inappropriate salary range',
    'Company verification required',
    'Duplicate posting',
    'Spam or low quality content',
    'Other (specify below)'
  ];

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowComparison(false);
    setRejectionReason('');
    setCustomReason('');
  };

  const handleApprove = async (jobId, useEdits = false) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'active' })
        .eq('id', jobId);

      if (error) throw error;
      
      success('Job approved successfully');
      setSelectedJob(null);
      loadJobsRequiringApproval();
    } catch (error) {
      console.error('Error approving job:', error);
      showError('Failed to approve job');
    }
  };

  const handleReject = async (jobId) => {
    const reason = rejectionReason === 'Other (specify below)' ? customReason : rejectionReason;
    if (!reason) {
      showError('Please select or specify a rejection reason');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', jobId);

      if (error) throw error;
      
      success('Job rejected successfully');
      setSelectedJob(null);
      setRejectionReason('');
      setCustomReason('');
      loadJobsRequiringApproval();
    } catch (error) {
      console.error('Error rejecting job:', error);
      showError('Failed to reject job');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">Content Moderation Panel</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Review job postings requiring approval with side-by-side content comparison
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-1">
          <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-border dark:border-gray-700">
              <h3 className="text-lg font-medium text-text-primary dark:text-white">Jobs Requiring Approval</h3>
              <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{jobsRequiringApproval.length} items</p>
            </div>
            <div className="space-y-0 max-h-[600px] overflow-y-auto">
              {jobsRequiringApproval.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 text-secondary-300 dark:text-gray-600" />
                  <p className="text-text-secondary dark:text-gray-400">No jobs requiring approval</p>
                </div>
              ) : (
                jobsRequiringApproval.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    className={`p-4 border-b border-border dark:border-gray-700 cursor-pointer transition-smooth hover:bg-surface-50 dark:hover:bg-surface-800/50 ${
                      selectedJob?.id === job.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary dark:text-white truncate">{job.title}</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-400 truncate">{job.company}</p>
                        <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">{job.location}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.flaggedIssues.map((issue, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ml-2 flex-shrink-0 ${
                        job.status === 'pending_approval' || job.status === 'pending' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Content Review Area */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <div className="space-y-6">
              {/* Job Header */}
              <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-primary dark:text-white">{selectedJob.title}</h3>
                      <p className="text-text-secondary dark:text-gray-400">{selectedJob.company} • {selectedJob.location}</p>
                      <p className="text-primary dark:text-primary-400 font-medium mt-1">{selectedJob.salary}</p>
                    </div>
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className={`btn-secondary text-sm ${showComparison ? 'bg-primary text-white dark:bg-primary-600' : ''}`}
                    >
                      <Icon name="GitCompare" size={16} className="mr-1" />
                      Compare Edits
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary dark:text-gray-400">
                    <span>Posted by {selectedJob.postedBy}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(selectedJob.postedAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {/* Content Display */}
              <div className="grid grid-cols-1 gap-6">
                <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
                  <div className="p-6 space-y-4">
                    <div>
                      <h5 className="font-medium text-text-primary dark:text-white mb-2">Job Description</h5>
                      <p className="text-sm text-text-secondary dark:text-gray-400 whitespace-pre-wrap">{selectedJob.originalContent.description}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-text-primary dark:text-white mb-2">Requirements</h5>
                      <ul className="list-disc list-inside text-sm text-text-secondary dark:text-gray-400 space-y-1">
                        {selectedJob.originalContent.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-text-primary dark:text-white mb-2">Benefits</h5>
                      <ul className="list-disc list-inside text-sm text-text-secondary dark:text-gray-400 space-y-1">
                        {selectedJob.originalContent.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection Reasons */}
              <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
                <div className="p-6">
                  <h4 className="font-medium text-text-primary dark:text-white mb-4">Rejection Reason (Optional)</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rejectionReasons.map((reason) => (
                        <label key={reason} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="rejectionReason"
                            value={reason}
                            checked={rejectionReason === reason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="mr-2 text-primary focus:ring-primary dark:bg-surface-700"
                          />
                          <span className="text-sm text-text-secondary dark:text-gray-400">{reason}</span>
                        </label>
                      ))}
                    </div>
                    {rejectionReason === 'Other (specify below)' && (
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Please specify the reason for rejection..."
                        className="input-field mt-2 bg-background dark:bg-[#13182E] border-border dark:border-gray-700 text-text-primary dark:text-white"
                        rows={3}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleApprove(selectedJob.id, false)}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Icon name="Check" size={16} />
                  <span>Approve Job</span>
                </button>
                
                <button
                  onClick={() => handleReject(selectedJob.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-smooth flex items-center justify-center space-x-2"
                >
                  <Icon name="X" size={16} />
                  <span>Reject</span>
                </button>
                
                <button className="btn-secondary flex items-center justify-center space-x-2">
                  <Icon name="MessageSquare" size={16} />
                  <span>Request Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 flex items-center justify-center py-16">
              <div className="text-center">
                <Icon name="FileText" size={48} className="mx-auto mb-4 text-secondary-400 dark:text-gray-600" />
                <h3 className="text-lg font-medium text-text-primary dark:text-white mb-2">Select a Job to Review</h3>
                <p className="text-text-secondary dark:text-gray-400 max-w-md">
                  Choose a job posting from the list on the left to begin the content moderation process.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModerationPanel;
