import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import JobApplicationForm from './components/JobApplicationForm';
import CompanyProfileCard from './components/CompanyProfileCard';
import SimilarJobsCarousel from './components/SimilarJobsCarousel';
import ShareJobModal from './components/ShareJobModal';
import JobDetailAIAssistant from '../../components/ui/JobDetailAIAssistant';
import { formatDistanceToNow } from 'date-fns';
import { formatJobData, formatRequirements, formatBenefits } from '../../utils/jobDataFormatter';

const JobDetailApplication = () => {
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const jobId = paramId || searchParams.get('id');
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    if (jobId) {
      loadJob();
      checkIfSaved();
    } else {
      console.error('Job ID is missing from URL');
      showError('Job ID is required. Please select a job from the job list.');
      setLoading(false);
      // Don't navigate immediately, show error first
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    }
  }, [jobId, navigate, showError]);

  const loadJob = async () => {
    if (!jobId) {
      showError('Job ID is required');
      setLoading(false);
      setTimeout(() => navigate('/jobs'), 2000);
      return;
    }

    try {
      setLoading(true);
      const jobData = await jobService.getById(jobId);

      if (!jobData) {
        throw new Error('Job not found');
      }

      // Format job data to ensure requirements/benefits are arrays
      const formattedJob = formatJobData(jobData);
      setJob(formattedJob);

      // Load similar jobs
      if (jobData) {
        loadSimilarJobs(jobData);
      }
    } catch (error) {
      console.error('Error loading job:', error);
      showError(`Failed to load job details: ${error.message || 'Unknown error'}`);
      setTimeout(() => navigate('/jobs'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarJobs = async (currentJob) => {
    try {
      const result = await jobService.getAll({
        search: currentJob.title?.split(' ')[0] || '',
        limit: 5,
      });
      // Filter out current job
      const similar = (result.data || []).filter(j => j.id !== currentJob.id).slice(0, 4);
      setSimilarJobs(similar);
    } catch (error) {
      console.error('Error loading similar jobs:', error);
    }
  };

  const checkIfSaved = async () => {
    if (!user) return;

    try {
      const saved = await jobService.getSavedJobs();
      const savedIds = new Set(saved.map(sj => sj.job_id || sj.job?.id));
      setIsJobSaved(savedIds.has(jobId));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      showError('Please sign in to save jobs');
      navigate('/job-seeker-registration-login');
      return;
    }

    try {
      if (isJobSaved) {
        await jobService.unsaveJob(jobId);
        setIsJobSaved(false);
        success('Job removed from saved');
      } else {
        await jobService.saveJob(jobId);
        setIsJobSaved(true);
        success('Job saved successfully');
      }
    } catch (error) {
      showError('Failed to save job');
      console.error('Error saving job:', error);
    }
  };

  const handleApply = () => {
    if (!user) {
      showError('Please sign in to apply');
      navigate('/job-seeker-registration-login');
      return;
    }
    navigate(`/applications/new?jobId=${jobId}`);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      // Handle file upload if resume is provided
      let resumeUrl = null;
      if (applicationData.resume_file && applicationData.resume_file instanceof File) {
        try {
          // Upload resume file to Supabase Storage
          const fileExt = applicationData.resume_file.name.split('.').pop();
          const fileName = `${user.id}-${jobId}-${Date.now()}.${fileExt}`;
          // Upload directly to resumes bucket root (no subfolder to avoid RLS issues)
          const filePath = fileName;

          const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, applicationData.resume_file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Resume upload error:', uploadError);
            // Try to create bucket if it doesn't exist
            showError('Failed to upload resume. Please try again.');
            throw uploadError;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

          resumeUrl = publicUrl;
        } catch (uploadError) {
          console.error('Resume upload error:', uploadError);
          showError('Failed to upload resume file. Please try again or submit without resume.');
          throw uploadError;
        }
      }

      const submissionData = {
        ...applicationData,
        resume_url: resumeUrl,
        resume_file: undefined, // Remove file object before sending
      };

      await applicationService.create(jobId, submissionData);
      success('Application submitted successfully! You will receive a confirmation email shortly.');
      setIsApplicationFormOpen(false);
      // Navigate to dashboard to see the application
      setTimeout(() => {
        navigate('/job-seeker-dashboard?tab=applications');
      }, 1500);
    } catch (error) {
      showError('Failed to submit application. Please try again.');
      console.error('Application error:', error);
      throw error; // Re-throw so form can handle it
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Job not found</h2>
          <Link to="/job-search-browse" className="btn-primary inline-flex items-center mt-4">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const jobData = {
    id: job.id,
    title: job.title,
    company: {
      name: job.company || job.companies?.name,
      logo: job.companies?.logo || job.logo,
      size: job.companies?.size,
      industry: job.companies?.industry,
      location: job.location,
      website: job.companies?.website,
      glassdoorRating: job.companies?.rating,
      reviewCount: job.companies?.review_count,
      description: job.companies?.description,
    },
    location: job.location,
    salary: job.salary || `${job.salary_min || ''} - ${job.salary_max || ''}`,
    employmentType: job.employment_type,
    experienceLevel: job.experience_level,
    postedDate: job.created_at,
    description: job.description,
    requirements: formatRequirements(job.requirements),
    benefits: formatBenefits(job.benefits),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    {jobData.title}
                  </h1>
                  <div className="flex items-center gap-4 text-[#64748B] dark:text-[#8B92A3]">
                    <span className="flex items-center gap-1">
                      <Icon name="Building" size={16} />
                      {jobData.company.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={16} />
                      {jobData.location}
                    </span>
                    {jobData.postedDate && (
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {formatDistanceToNow(new Date(jobData.postedDate), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handleSaveJob}
                    className={`p-2 rounded-lg transition-colors ${isJobSaved
                      ? 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary'
                      : 'text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139]'
                      }`}
                    aria-label={isJobSaved ? 'Unsave job' : 'Save job'}
                  >
                    <Icon name={isJobSaved ? "Bookmark" : "Bookmark"} size={20} />
                  </button>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-2 rounded-lg text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139] transition-colors"
                    aria-label="Share job"
                  >
                    <Icon name="Share2" size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                {jobData.salary && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg">
                    <Icon name="DollarSign" size={16} className="text-workflow-primary" />
                    <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">{jobData.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg">
                  <Icon name="Briefcase" size={16} className="text-workflow-primary" />
                  <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">{jobData.employmentType}</span>
                </div>
                {jobData.experienceLevel && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg">
                    <Icon name="User" size={16} className="text-workflow-primary" />
                    <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">{jobData.experienceLevel}</span>
                  </div>
                )}
              </div>

              {/* Apply Button & AI Assistant */}
              <div className="flex gap-3">
                <Link
                  to={`/applications/new?jobId=${jobId}`}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <Icon name="Send" size={18} />
                  <span>Apply Now</span>
                </Link>
                <JobDetailAIAssistant job={job} />
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-[#475569] dark:text-[#B4B9C4]">
                <p className={showFullDescription ? '' : 'line-clamp-6'}>
                  {jobData.description}
                </p>
                {jobData.description?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-workflow-primary hover:text-workflow-primary-600 mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>

            {/* Requirements */}
            {jobData.requirements && jobData.requirements.length > 0 && (
              <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {jobData.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#475569] dark:text-[#B4B9C4]">
                      <Icon name="Check" size={16} className="text-workflow-primary mt-0.5 flex-shrink-0" />
                      <span>{typeof req === 'string' ? req : req.text || req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {jobData.benefits && jobData.benefits.length > 0 && (
              <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {jobData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#475569] dark:text-[#B4B9C4]">
                      <Icon name="Check" size={16} className="text-workflow-primary mt-0.5 flex-shrink-0" />
                      <span>{typeof benefit === 'string' ? benefit : benefit.text || benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-background rounded-lg shadow-soft border border-border p-6">
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Similar Jobs</h2>
                <SimilarJobsCarousel jobs={similarJobs} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CompanyProfileCard company={jobData.company} />
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {isApplicationFormOpen && (
        <JobApplicationForm
          job={jobData}
          isOpen={isApplicationFormOpen}
          onClose={() => setIsApplicationFormOpen(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareJobModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          job={jobData}
        />
      )}
    </div>
  );
};

export default JobDetailApplication;