import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { jobService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const SavedJobs = ({ limit, showViewAll = false, setActiveTab }) => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const saved = await jobService.getSavedJobs();
      setSavedJobs(saved || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      showError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await jobService.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(sj => (sj.job_id || sj.job?.id) !== jobId));
      success('Job removed from saved');
    } catch (error) {
      showError('Failed to remove job');
      console.error('Error removing saved job:', error);
    }
  };

  if (!user) {
    return (
      <div className="bg-background rounded-lg border border-border shadow-soft p-6 text-center">
        <Icon name="Bookmark" className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
        <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Sign in to save jobs</p>
        <Link to="/login" className="btn-primary inline-flex items-center">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background rounded-lg border border-border shadow-soft p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-[#F8FAFC] dark:bg-[#1A2139] rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const displayJobs = limit ? savedJobs?.slice(0, limit) : savedJobs;

  if (savedJobs.length === 0) {
    return (
      <div className="bg-background rounded-lg border border-border shadow-soft p-6 text-center">
        <Icon name="Bookmark" className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">No saved jobs</h3>
        <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Start saving jobs you're interested in</p>
        <Link to="/jobs" className="btn-primary inline-flex items-center">
          <Icon name="Search" size={16} className="mr-2" />
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-soft relative overflow-visible">
      <div className="absolute -top-2 -right-2 z-50">
        <ComponentAIAssistant
          componentName="Saved Jobs"
          componentData={{
            totalSaved: savedJobs.length,
            displayCount: displayJobs.length,
            jobs: displayJobs.map(j => ({
              title: j.job?.title || j.title,
              company: j.job?.company || j.company
            }))
          }}
          position="top-right"
        />
      </div>
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">Saved Jobs</h3>
        {showViewAll && (
          <button
            onClick={() => setActiveTab?.('saved')}
            className="text-sm text-workflow-primary hover:text-workflow-primary-600"
          >
            View All
          </button>
        )}
      </div>
      <div className="divide-y divide-border">
        {displayJobs.map((savedJob) => {
          const job = savedJob.job || savedJob;
          const jobId = job.id || savedJob.job_id;

          return (
            <div key={savedJob.id || jobId} className="p-6 hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {job.logo && (
                      <Image
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <Link
                        to={`/jobs/detail?id=${jobId}`}
                        className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] hover:text-workflow-primary transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[#64748B] dark:text-[#8B92A3] mt-1">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
                        <span className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <Icon name="DollarSign" size={14} />
                            {job.salary}
                          </span>
                        )}
                        {savedJob.saved_at && (
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            Saved {formatDistanceToNow(new Date(savedJob.saved_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Link
                    to={`/jobs/detail?id=${jobId}`}
                    className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Icon name="Eye" size={16} />
                    <span>View Job</span>
                  </Link>
                  <Link
                    to={`/job-application?jobId=${jobId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Icon name="Send" size={16} />
                    <span>Apply</span>
                  </Link>
                  <button
                    onClick={() => handleRemoveJob(jobId)}
                    className="p-2 text-[#64748B] dark:text-[#8B92A3] hover:text-error transition-colors"
                    aria-label="Remove saved job"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedJobs;