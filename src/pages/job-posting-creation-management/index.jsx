import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { jobService } from '../../services/jobService';
import { supabase } from '../../lib/supabase';
import Breadcrumb from 'components/ui/Breadcrumb';
import JobPostingForm from './components/JobPostingForm';
import JobPreview from './components/JobPreview';
import PricingCalculator from './components/PricingCalculator';
import JobManagementTable from './components/JobManagementTable';
import CsvUploadSection from './components/CsvUploadSection';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';

const JobPostingCreationManagement = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [formMode, setFormMode] = useState('create'); // create, edit, duplicate
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Form setup with react-hook-form
  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isDirty, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      department: '',
      location: { type: 'remote', address: '', city: '', state: '', country: '', zipCode: '' },
      employmentType: '',
      description: '',
      requirements: '',
      qualifications: '',
      benefits: '',
      salary: { min: '', max: '', currency: 'USD', period: 'yearly', isVisible: true },
      applicationSettings: { 
        deadline: null, 
        redirectUrl: '', 
        notificationEmail: '',
        screeningQuestions: []
      },
      publishSettings: { status: 'draft', scheduledDate: null },
      isFeatured: false
    }
  });

  // Watch form values for preview
  const formValues = watch();

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!user) {
      showError('Please sign in to post jobs');
      return;
    }

    try {
      // Validate experience_level (must match database constraint)
      const validExperienceLevels = ['entry', 'mid', 'senior', 'executive'];
      const experienceLevel = data.qualifications || 'mid';
      if (!validExperienceLevels.includes(experienceLevel)) {
        showError(`Invalid experience level. Must be one of: ${validExperienceLevels.join(', ')}`);
        return;
      }

      // Validate job_type (must match database constraint)
      const validJobTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
      const jobType = data.employmentType || 'full-time';
      if (!validJobTypes.includes(jobType)) {
        showError(`Invalid job type. Must be one of: ${validJobTypes.join(', ')}`);
        return;
      }

      // Validate status (must match database constraint)
      // Database allows: 'active', 'published', 'draft', 'expired', 'closed'
      const validStatuses = ['active', 'published', 'draft', 'expired', 'closed'];
      let status = data.publishSettings?.status || 'draft';
      
      // Map 'publish' to 'active' for backward compatibility
      if (status === 'publish') {
        status = 'active';
      }
      
      if (!validStatuses.includes(status)) {
        showError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        return;
      }

      // Ensure requirements is properly formatted
      let requirements = '';
      if (data.requirements) {
        if (Array.isArray(data.requirements)) {
          requirements = JSON.stringify(data.requirements);
        } else if (typeof data.requirements === 'string') {
          requirements = data.requirements;
        }
      }

      // Transform form data to match database schema
      const jobData = {
        title: data.title,
        company: data.company || 'Your Company', // Should come from company profile
        location: data.location?.address || data.location || '',
        description: data.description || '',
        requirements: requirements,
        job_type: jobType, // Validated above
        experience_level: experienceLevel, // Validated above
        industry: data.department || '',
        salary: data.salary?.min && data.salary?.max 
          ? `${data.salary.min} - ${data.salary.max}` 
          : (data.salary || ''),
        salary_min: data.salary?.min ? parseFloat(data.salary.min) : null,
        salary_max: data.salary?.max ? parseFloat(data.salary.max) : null,
        remote: data.location?.type === 'remote' ? 'remote' : 
                data.location?.type === 'hybrid' ? 'hybrid' : 'on-site',
        status: status, // Use validated status from above
        // Only include created_by if column exists (will be added by SQL script)
        ...(user?.id && { created_by: user.id }),
      };

      if (formMode === 'edit' && selectedJob?.id) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', selectedJob.id);

        if (error) throw error;
        success('Job updated successfully!');
      } else {
        // Create new job
        const { error } = await supabase
          .from('jobs')
          .insert(jobData);

        if (error) throw error;
        success('Job posted successfully!');
      }

      reset();
      setFormMode('create');
      setSelectedJob(null);
      
      // Refresh job list if on manage tab
      if (activeTab === 'manage') {
        // Trigger refresh by changing activeTab temporarily
        setActiveTab('create');
        setTimeout(() => setActiveTab('manage'), 100);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showError('Failed to save job. Please try again.');
    }
  };

  // Handle job selection for editing
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormMode('edit');
    setActiveTab('create');
    
    // Populate form with job data
    Object.keys(job)?.forEach(key => {
      setValue(key, job?.[key]);
    });
  };

  // Handle job duplication
  const handleJobDuplicate = (job) => {
    setSelectedJob({...job, id: null, title: `${job?.title} (Copy)`});
    setFormMode('duplicate');
    setActiveTab('create');
    
    // Populate form with job data but change title
    Object.keys(job)?.forEach(key => {
      if (key === 'title') {
        setValue(key, `${job?.title} (Copy)`);
      } else {
        setValue(key, job?.[key]);
      }
    });
  };

  return (
    <div className="bg-surface dark:bg-[#0A0E27] min-h-screen overflow-x-hidden">
      <UnifiedSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Job Posting Management</h1>
                <p className="text-text-secondary dark:text-gray-400 mt-1">Create, edit, and manage your job listings</p>
              </div>
              
              {activeTab === 'manage' && (
                <button 
                  onClick={() => {
                    setActiveTab('create');
                    setFormMode('create');
                    reset();
                  }}
                  className="btn-primary mt-4 md:mt-0 flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span>Create New Job</span>
                </button>
              )}
            </div>

            {/* Tab navigation */}
            <div className="border-b border-border dark:border-gray-700 mb-6 overflow-x-auto">
              <nav className="flex space-x-8 min-w-max">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-smooth whitespace-nowrap ${
                    activeTab === 'create' 
                      ? 'border-primary text-primary dark:text-primary-400' 
                      : 'border-transparent text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white hover:border-secondary-300'
                  }`}
                >
                  {formMode === 'create' ? 'Create Job' : formMode === 'edit' ? 'Edit Job' : 'Duplicate Job'}
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-smooth whitespace-nowrap ${
                    activeTab === 'manage' 
                      ? 'border-primary text-primary dark:text-primary-400' 
                      : 'border-transparent text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white hover:border-secondary-300'
                  }`}
                >
                  Manage Jobs
                </button>
                <button
                  onClick={() => setActiveTab('csv')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-smooth whitespace-nowrap ${
                    activeTab === 'csv' 
                      ? 'border-primary text-primary dark:text-primary-400' 
                      : 'border-transparent text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white hover:border-secondary-300'
                  }`}
                >
                  Bulk Upload
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <JobPostingForm 
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    formMode={formMode}
                    isDirty={isDirty}
                    isValid={isValid}
                  />
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <JobPreview formValues={formValues} />
                    <PricingCalculator formValues={formValues} setValue={setValue} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <JobManagementTable 
                onEdit={handleJobSelect} 
                onDuplicate={handleJobDuplicate}
              />
            )}

            {activeTab === 'csv' && (
              <CsvUploadSection />
            )}
          </div>
        </div>
      </div>
  );
};

export default JobPostingCreationManagement;