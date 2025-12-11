/**
 * Job Search Browse - INTEGRATED VERSION
 * Example of how to replace mock data with real backend integration
 * 
 * To use: Rename this file to index.jsx and replace the original
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import SearchFilters from './components/SearchFilters';
import JobCard from './components/JobCard';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import JobPreviewPanel from './components/JobPreviewPanel';

const JobSearchBrowse = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    employmentType: [],
    salaryRange: '',
    companySize: '',
    postingDate: '',
    experienceLevel: '',
    remoteWork: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  // Load saved jobs on mount
  useEffect(() => {
    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  // Load jobs when filters change
  useEffect(() => {
    loadJobs();
  }, [searchQuery, selectedFilters, sortBy, currentPage]);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchQuery,
        location: selectedFilters.location[0] || null,
        employmentType: selectedFilters.employmentType[0] || null,
        remote: selectedFilters.remoteWork || null,
        experienceLevel: selectedFilters.experienceLevel || null,
        salaryMin: selectedFilters.salaryRange?.split('-')[0]?.replace(/[^0-9]/g, '') || null,
        salaryMax: selectedFilters.salaryRange?.split('-')[1]?.replace(/[^0-9]/g, '') || null,
        sortBy: sortBy === 'relevance' ? 'created_at' : sortBy,
        sortOrder: 'desc',
        page: currentPage,
        pageSize: 20,
      };

      const result = await jobService.getAll(filters);
      setJobs(result.data);
      setTotalJobs(result.total);
      setHasMore(result.data.length === result.pageSize);
      
      // Select first job if available
      if (result.data.length > 0 && !selectedJobId) {
        setSelectedJobId(result.data[0].id);
        setSelectedJob(result.data[0]);
      }
    } catch (error) {
      showError('Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFilters, sortBy, currentPage]);

  const loadSavedJobs = async () => {
    try {
      const saved = await jobService.getSavedJobs();
      const savedIds = new Set(saved.map(sj => sj.job_id));
      setSavedJobs(savedIds);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      showError('Please sign in to save jobs');
      return;
    }

    try {
      if (savedJobs.has(jobId)) {
        await jobService.unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        success('Job removed from saved');
      } else {
        await jobService.saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
        success('Job saved successfully');
      }
    } catch (error) {
      showError('Failed to save job. Please try again.');
      console.error('Error saving job:', error);
    }
  };

  const handleJobSelect = async (jobId) => {
    setSelectedJobId(jobId);
    try {
      const job = await jobService.getById(jobId);
      setSelectedJob(job);
    } catch (error) {
      showError('Failed to load job details');
      console.error('Error loading job:', error);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />

        {/* Search Header */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies, keywords..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
            />
            <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-2">
            {isLoading && jobs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#64748B] dark:text-[#8B92A3]">No jobs found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.has(job.id)}
                      onSave={() => handleSaveJob(job.id)}
                      onClick={() => handleJobSelect(job.id)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Job Preview Panel */}
        {selectedJob && (
          <JobPreviewPanel
            job={selectedJob}
            isSaved={savedJobs.has(selectedJob.id)}
            onSave={() => handleSaveJob(selectedJob.id)}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
};

export default JobSearchBrowse;

