/**
 * Job Application Page - Full Page Form
 * Users can apply to jobs with resume selection, cover letter, and file uploads
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { formatJobData } from '../../utils/jobDataFormatter';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import AIFieldAssistant from '../../components/ui/AIFieldAssistant';
import { useTalentAI } from '../../hooks/useTalentAI';

const JobApplicationPage = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedResumeId: null,
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeFile: null,
    answers: {}
  });
  const [errors, setErrors] = useState({});
  const [userResume, setUserResume] = useState('');

  // Talent AI
  const { generateProposal, loading: talentAiLoading } = useTalentAI();
  const [proposalTone, setProposalTone] = useState('professional');

  const handleGenerateProposal = async () => {
    if (!job) return;

    // Prepare data
    const jobDetails = {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements || [] // Assuming requirements exist or are part of description
    };

    const freelancerProfile = {
      name: `${formData.firstName} ${formData.lastName}`,
      resume: userResume,
      skills: [], // Could extract from resume if available
      experience: '' // Could extract
    };

    const result = await generateProposal(jobDetails, freelancerProfile, proposalTone);

    if (result && result.proposal) {
      handleInputChange('coverLetter', result.proposal);
    }
  };

  useEffect(() => {
    if (!user) {
      showError('Please sign in to apply for jobs');
      navigate('/job-seeker-registration-login');
      return;
    }

    if (!jobId) {
      showError('Job ID is required');
      navigate('/jobs');
      return;
    }

    loadData();
  }, [jobId, user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load job details
      const jobData = await jobService.getById(jobId);
      if (!jobData) {
        throw new Error('Job not found');
      }
      const formattedJob = formatJobData(jobData);
      setJob(formattedJob);

      // Load user's resumes
      const userResumes = await resumeService.getAll();
      setResumes(userResumes || []);

      // Load user profile for name/email
      const { data: userProfile } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', user.id)
        .single();

      // Auto-select first resume if available
      if (userResumes && userResumes.length > 0) {
        const defaultResume = userResumes.find(r => r.is_default) || userResumes[0];
        setFormData(prev => ({
          ...prev,
          selectedResumeId: defaultResume.id,
          firstName: userProfile?.name?.split(' ')[0] || user?.user_metadata?.first_name || '',
          lastName: userProfile?.name?.split(' ').slice(1).join(' ') || user?.user_metadata?.last_name || '',
          email: userProfile?.email || user?.email || '',
        }));

        // Load resume content for AI context
        if (defaultResume.content_json) {
          const resumeText = JSON.stringify(defaultResume.content_json);
          setUserResume(resumeText.substring(0, 2000)); // Limit to 2000 chars for AI context
        }
      } else {
        setFormData(prev => ({
          ...prev,
          firstName: userProfile?.name?.split(' ')[0] || user?.user_metadata?.first_name || '',
          lastName: userProfile?.name?.split(' ').slice(1).join(' ') || user?.user_metadata?.last_name || '',
          email: userProfile?.email || user?.email || '',
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'File size must be less than 5MB'
        }));
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'Please upload a PDF or Word document'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }));
      setErrors(prev => ({
        ...prev,
        resumeFile: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.selectedResumeId && !formData.resumeFile) {
      newErrors.resume = 'Please select a resume or upload a new one';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Handle resume file upload if provided
      let resumeUrl = null;
      if (formData.resumeFile && formData.resumeFile instanceof File) {
        try {
          const fileExt = formData.resumeFile.name.split('.').pop();
          const fileName = `${user.id}-${jobId}-${Date.now()}.${fileExt}`;
          const filePath = fileName;

          const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, formData.resumeFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

          resumeUrl = publicUrl;
        } catch (uploadError) {
          console.error('Resume upload error:', uploadError);
          showError('Failed to upload resume file. Please try again.');
          setSubmitting(false);
          return;
        }
      }

      // Get resume URL from selected resume if no file uploaded
      if (!resumeUrl && formData.selectedResumeId) {
        const selectedResume = resumes.find(r => r.id === formData.selectedResumeId);
        if (selectedResume?.resume_url) {
          resumeUrl = selectedResume.resume_url;
        }
      }

      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        resume_url: resumeUrl,
        cover_letter: formData.coverLetter,
        linkedin_url: formData.linkedinUrl,
        portfolio_url: formData.portfolioUrl,
        answers: formData.answers,
        resume_id: formData.selectedResumeId,
      };

      await applicationService.create(jobId, applicationData);

      // Clear saved form data after successful submission
      const formKey = `job-application-${jobId}`;
      localStorage.removeItem(formKey);

      success('Application submitted successfully! You will receive a confirmation email shortly.');

      setTimeout(() => {
        navigate('/dashboard?tab=applications');
      }, 1500);
    } catch (error) {
      console.error('Application submission error:', error);
      showError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="bg-surface dark:bg-[#0A0E27] min-h-screen overflow-x-hidden">
      {/* Unified Sidebar */}
      <UnifiedSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          {/* Job Info Card */}
          <div className="bg-white dark:bg-[#13182E] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Icon name="Building" size={16} />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="MapPin" size={16} />
                    {job.location}
                  </span>
                </div>
              </div>
              <Link
                to={`/job-detail-application?id=${jobId}`}
                className="text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400 text-sm font-medium"
              >
                View Job Details
              </Link>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#13182E] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Application Form</h2>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume</h3>

              {resumes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Resume <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.selectedResumeId || ''}
                    onChange={(e) => handleInputChange('selectedResumeId', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                  >
                    <option value="">Select a resume...</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.title || `Resume ${resume.id.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {resumes.length > 0 ? 'Or Upload New Resume' : 'Upload Resume'} <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-workflow-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <Icon name="Upload" size={24} className="mx-auto text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-workflow-primary hover:text-workflow-primary-600 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    {formData.resumeFile && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        Selected: {formData.resumeFile.name}
                      </p>
                    )}
                  </div>
                </div>
                {errors.resumeFile && (
                  <p className="text-red-500 text-sm mt-1">{errors.resumeFile}</p>
                )}
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cover Letter (Optional)</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Icon name="Sparkles" size={12} className="text-workflow-primary" />
                  AI assistance available
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/50">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-1">
                      <Icon name="Sparkles" size={14} />
                      AI Proposal Generator
                    </label>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Generate a tailored cover letter based on your resume and the job description.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={proposalTone}
                      onChange={(e) => setProposalTone(e.target.value)}
                      className="text-sm border-purple-200 rounded px-2 py-1.5 focus:ring-purple-500 bg-white dark:bg-purple-950 dark:text-purple-100 dark:border-purple-800"
                    >
                      <option value="professional">Professional</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="confident">Confident</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleGenerateProposal}
                      disabled={talentAiLoading}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {talentAiLoading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Icon name="Zap" size={14} />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none"
                  placeholder="Write a cover letter explaining why you're a good fit for this position..."
                />
              </div>
            </div>

            {/* Application Questions */}
            {job?.applicationQuestions && job.applicationQuestions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Questions</h3>
                <div className="space-y-6">
                  {job.applicationQuestions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {question.question} {question.required && <span className="text-red-500">*</span>}
                      </label>

                      {question.type === 'textarea' && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Icon name="Sparkles" size={12} className="text-workflow-primary" />
                              AI can help generate your answer
                            </span>
                          </div>
                          <textarea
                            value={formData.answers[question.id] || ''}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                answers: {
                                  ...prev.answers,
                                  [question.id]: e.target.value
                                }
                              }));
                            }}
                            rows={4}
                            className={`w-full px-4 py-3 rounded-lg border ${errors[`question_${question.id}`]
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-700'
                              } bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none`}
                            placeholder="Enter your answer..."
                          />
                          <AIFieldAssistant
                            fieldName={question.question}
                            fieldType="textarea"
                            fieldValue={formData.answers[question.id]}
                            jobTitle={job?.title}
                            jobDescription={job?.description}
                            userResume={userResume}
                            onGenerate={(content) => {
                              setFormData(prev => ({
                                ...prev,
                                answers: {
                                  ...prev.answers,
                                  [question.id]: content
                                }
                              }));
                            }}
                          />
                        </>
                      )}

                      {question.type === 'text' && (
                        <input
                          type="text"
                          value={formData.answers[question.id] || ''}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              answers: {
                                ...prev.answers,
                                [question.id]: e.target.value
                              }
                            }));
                          }}
                          className={`w-full px-4 py-3 rounded-lg border ${errors[`question_${question.id}`]
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
                          placeholder="Enter your answer..."
                        />
                      )}

                      {question.type === 'radio' && (
                        <div className="space-y-2">
                          {question.options?.map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`question_${question.id}`}
                                value={option}
                                checked={formData.answers[question.id] === option}
                                onChange={(e) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    answers: {
                                      ...prev.answers,
                                      [question.id]: e.target.value
                                    }
                                  }));
                                }}
                                className="w-4 h-4 text-workflow-primary focus:ring-workflow-primary"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {errors[`question_${question.id}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`question_${question.id}`]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Links */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Links (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <AIFieldAssistant
                    fieldName="LinkedIn Profile"
                    fieldType="url"
                    fieldValue={formData.linkedinUrl}
                    jobTitle={job?.title}
                    jobDescription={job?.description}
                    userResume={userResume}
                    coverLetter={formData.coverLetter}
                    onGenerate={(content) => handleInputChange('linkedinUrl', content)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                    placeholder="https://yourportfolio.com"
                  />
                  <AIFieldAssistant
                    fieldName="Portfolio Website"
                    fieldType="url"
                    fieldValue={formData.portfolioUrl}
                    jobTitle={job?.title}
                    jobDescription={job?.description}
                    userResume={userResume}
                    coverLetter={formData.coverLetter}
                    onGenerate={(content) => handleInputChange('portfolioUrl', content)}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-workflow-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
              <Link
                to={`/job-detail-application?id=${jobId}`}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Icon name="ArrowLeft" size={18} />
                <span>Cancel</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;
