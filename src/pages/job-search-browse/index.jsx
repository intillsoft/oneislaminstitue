import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { jobService } from '../../services/jobService';
import { resumeService } from '../../services/resumeService';
import { aiService } from '../../services/aiService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Breadcrumb from 'components/ui/Breadcrumb';
import SearchFilters from './components/SearchFilters';
import JobCard from './components/JobCard';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import VoiceSearch from '../../components/ui/VoiceSearch';
import AILoader from '../../components/ui/AILoader';
import { formatRequirements } from '../../utils/jobDataFormatter';
import { detectUserField, isJobInField, matchesJobTitle, shouldExcludeJob } from '../../utils/jobFieldMatcher';

const JobSearchBrowse = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [showRecommended, setShowRecommended] = useState(true);
  
  const searchInputRef = useRef(null);

  // Load saved jobs and recommended jobs on mount
  useEffect(() => {
    if (user) {
      loadSavedJobs();
      loadRecommendedJobs();
    }
  }, [user]);

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
      
      if (currentPage === 1) {
        setJobs(result.data || []);
      } else {
        setJobs(prev => [...prev, ...(result.data || [])]);
      }
      
      setTotalJobs(result.total || 0);
      setHasMore((result.data?.length || 0) === 20);
      
      // Select first job if available and none selected
      if (result.data?.length > 0 && !selectedJobId && currentPage === 1) {
        setSelectedJobId(result.data[0].id);
        setSelectedJob(result.data[0]);
      }
    } catch (error) {
      showError('Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFilters, sortBy, currentPage, selectedJobId, showError]);

  // Load jobs when filters change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const loadSavedJobs = async () => {
    try {
      const saved = await jobService.getSavedJobs();
      const savedIds = new Set(saved.map(sj => sj.job_id || sj.job?.id));
      setSavedJobs(savedIds);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const loadRecommendedJobs = async () => {
    if (!user) return;
    
    try {
      setIsLoadingRecommended(true);
      
      // Get ALL jobs (both platform-created and crawled) - no source filter
      const jobsResult = await jobService.getAll({ pageSize: 50 });
      const allJobs = jobsResult.data || [];
      
      // Ensure we have both platform and crawled jobs, mix them for variety
      const platformJobs = allJobs.filter(j => j.source === 'manual' || !j.source);
      const crawledJobs = allJobs.filter(j => j.source && j.source !== 'manual');
      const mixedJobs = [...crawledJobs, ...platformJobs].sort(() => Math.random() - 0.5);
      
      if (allJobs.length === 0) {
        setRecommendedJobs([]);
        return;
      }

      // Get user's default resume for matching
      const resumes = await resumeService.getAll();
      const defaultResume = resumes.find(r => r.is_default) || resumes[0];
      
      // If no resume, show jobs with default scores
      if (!defaultResume) {
        const defaultMatches = allJobs.slice(0, 3).map(job => ({
          ...job,
          matchScore: 75, // Default score when no resume
        }));
        setRecommendedJobs(defaultMatches);
        return;
      }

      // Extract user profile from resume for STRICT personalization
      const resumeData = defaultResume.content_json || {};
      const userProfile = {
        jobTitle: resumeData.experience?.[0]?.title || '',
        skills: [
          ...(resumeData.skills?.technical || []),
          ...(resumeData.skills?.soft || []),
          ...(Array.isArray(resumeData.skills) ? resumeData.skills : []),
        ].filter(Boolean).map(s => s.toLowerCase()),
        industry: resumeData.experience?.[0]?.industry || resumeData.industry || '',
      };

      // Detect user's field/career category
      const userField = detectUserField(resumeData);
      
      // STRICT pre-filtering: Only show jobs that match user's field and profile
      let personalizedJobs = allJobs;
      if (userProfile.jobTitle || userProfile.skills.length > 0 || userProfile.industry || userField) {
        personalizedJobs = allJobs.filter(job => {
          // FIRST: Exclude jobs from completely different fields
          if (shouldExcludeJob(job, userProfile)) {
            return false;
          }

          // SECOND: If we detected a field, ensure job is in that field
          if (userField && !isJobInField(job, userField)) {
            return false;
          }

          const jobText = `${job.title} ${job.description || ''} ${job.company || ''} ${job.location || ''}`.toLowerCase();
          
          // THIRD: Check for STRICT job title match (requires core keywords)
          const titleMatch = userProfile.jobTitle 
            ? matchesJobTitle(userProfile.jobTitle, job.title)
            : false;
          
          // FOURTH: Check for skill matches (must match at least 3 skills for non-title matches)
          const skillMatches = userProfile.skills.filter(skill => 
            skill.length > 2 && jobText.includes(skill)
          ).length;
          const skillMatch = skillMatches >= 3; // Increased from 2 to 3
          
          // FIFTH: Check for industry match
          const industryMatch = userProfile.industry 
            ? jobText.includes(userProfile.industry.toLowerCase())
            : false;
          
          // Job must match title STRICTLY, OR have strong skill/industry match
          // Title match is required if user has a clear job title
          if (userProfile.jobTitle && userProfile.jobTitle.length > 3) {
            return titleMatch || (skillMatch && industryMatch);
          }
          
          // If no clear title, require strong skill match
          return skillMatch || industryMatch;
        });
        
        // If no personalized matches, don't show random jobs
        if (personalizedJobs.length === 0) {
          console.warn('No jobs match user profile - user field:', userField, 'job title:', userProfile.jobTitle);
          personalizedJobs = []; // Return empty instead of random jobs
        } else {
          // Shuffle personalized jobs to add variety
          personalizedJobs = personalizedJobs.sort(() => Math.random() - 0.5);
        }
      }

      // FAST MODE: Show keyword-based matches immediately (2-3 seconds)
      const jobsToShow = personalizedJobs.slice(0, 3);
      
      // Calculate keyword scores immediately
      const quickMatches = jobsToShow.map(job => {
        const jobText = `${job.title} ${job.description || ''} ${job.company || ''}`.toLowerCase();
        const keywordMatches = userProfile.skills.filter(skill => 
          skill.length > 2 && jobText.includes(skill)
        ).length;
        const titleMatch = userProfile.jobTitle && 
          userProfile.jobTitle.toLowerCase().split(/\s+/).some(word => 
            word.length > 3 && jobText.includes(word)
          ) ? 1 : 0;
        const industryMatch = userProfile.industry && 
          jobText.includes(userProfile.industry.toLowerCase()) ? 1 : 0;
        
        // Enhanced keyword scoring (60-95% range)
        const baseScore = 60;
        const skillScore = Math.min(keywordMatches * 6, 25);
        const titleScore = titleMatch * 15;
        const industryScore = industryMatch * 10;
        const matchScore = Math.min(baseScore + skillScore + titleScore + industryScore, 95);
        
        return {
          ...job,
          matchScore,
        };
      });
      
      // Sort and show immediately - limit to 3
      const initialMatches = quickMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      
      setRecommendedJobs(initialMatches);
      setIsLoadingRecommended(false);
      
      // Enhance with AI in background (non-blocking)
      const enhanceWithAI = async () => {
        try {
          const { requestThrottler } = await import('../../utils/requestThrottler');
          
          const enhancedPromises = initialMatches.slice(0, 3).map(async (job) => {
            try {
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 12000) // 12s timeout
              );
              
              const matchPromise = requestThrottler.add(() => 
                aiService.matchJob(defaultResume.id, job.id)
              );
              
              const matchResult = await Promise.race([matchPromise, timeoutPromise]);
              return {
            ...job,
                matchScore: matchResult.match_score || job.matchScore,
              };
            } catch (error) {
              return job; // Keep original score
            }
          });
          
          const enhanced = await Promise.allSettled(enhancedPromises);
          const successful = enhanced
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);
          
          if (successful.length > 0) {
            setRecommendedJobs(prev => {
              const updated = [...prev];
              successful.forEach(enhanced => {
                const index = updated.findIndex(j => j.id === enhanced.id);
                if (index >= 0) {
                  updated[index] = enhanced;
                }
              });
              return updated.sort((a, b) => b.matchScore - a.matchScore);
            });
          }
        } catch (error) {
          console.warn('Background AI enhancement failed:', error);
        }
      };
      
      // Start background enhancement
      enhanceWithAI();

      return; // Exit early - results already shown
    } catch (error) {
      console.error('Error loading recommended jobs:', error);
      // Show jobs even if error occurs
      try {
        const jobsResult = await jobService.getAll({ pageSize: 5 });
        setRecommendedJobs((jobsResult.data || []).map(job => ({
          ...job,
          matchScore: 50,
        })));
      } catch (fallbackError) {
      setRecommendedJobs([]);
      }
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      showError('Please sign in to save jobs');
      navigate('/job-seeker-registration-login');
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

  const handleSearch = (e) => {
    e?.preventDefault();
    setCurrentPage(1);
    loadJobs();
  };

  return (
    <div className="bg-white dark:bg-[#0A0E27] min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        {/* Search Header */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies, keywords..."
              className="w-full px-4 py-3 pl-12 pr-40 rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
            />
            <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <VoiceSearch
                  onTranscript={(text) => {
                    if (text && text.trim()) {
                      setSearchQuery(text);
                      setCurrentPage(1);
                      // Trigger search immediately
                      setTimeout(() => {
                        loadJobs();
                      }, 300);
                    }
                  }}
                  onError={(error) => {
                    console.error('Voice search error:', error);
                    if (error !== 'no-speech') {
                      showError('Voice search failed. Please try again.');
                    }
                  }}
                />
                <button
                  type="button"
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="px-3 py-1.5 text-sm text-[#64748B] dark:text-[#8B92A3] hover:text-workflow-primary"
              >
                Advanced
                </button>
                    <button
                type="submit"
                className="px-4 py-1.5 bg-workflow-primary text-white rounded hover:bg-workflow-primary-600 transition-colors"
              >
                Search
                    </button>
                  </div>
          </form>
        </div>

        {/* Recommended Jobs Section */}
        {user && showRecommended && (
          <div className="mb-6 bg-gradient-to-r from-workflow-primary/10 to-workflow-primary/5 dark:from-workflow-primary/20 dark:to-workflow-primary/10 rounded-lg p-4 border border-workflow-primary/20 dark:border-workflow-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Zap" className="w-5 h-5 text-workflow-primary" />
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">Recommended for You</h3>
                <span className="px-2 py-0.5 bg-workflow-primary/20 dark:bg-workflow-primary/30 text-workflow-primary text-xs font-medium rounded-full">
                  AI Matched
                </span>
              </div>
              <button
                onClick={() => setShowRecommended(false)}
                className="text-sm text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED]"
              >
                Hide
              </button>
            </div>
            {isLoadingRecommended ? (
              <div className="flex items-center justify-center py-8">
                <AILoader size="default" text="Analyzing your profile..." variant="sparkles" />
              </div>
            ) : recommendedJobs.length > 0 ? (
              <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedJobs.map((job) => {
                const companyData = Array.isArray(job.companies) ? job.companies[0] : job.companies;
                return (
                  <div
                    key={job.id}
                        className="bg-white dark:bg-[#13182E] border-2 border-workflow-primary/30 dark:border-workflow-primary/50 rounded-lg p-4 hover:shadow-lg transition-all hover:border-workflow-primary/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-1">{job.title}</h4>
                        <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">{job.company || companyData?.name || 'Unknown'}</p>
                      </div>
                      <div className="px-2 py-1 bg-workflow-primary/20 dark:bg-workflow-primary/30 text-workflow-primary text-xs font-bold rounded">
                        {job.matchScore || 0}%
                      </div>
                    </div>
                        <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mb-3">{job.location}</p>
                        <div className="flex gap-2">
                          <Link
                            to={`/job-detail-application?id=${job.id}`}
                            className="flex-1 px-3 py-2 text-xs font-medium text-workflow-primary hover:text-workflow-primary-700 dark:hover:text-workflow-primary-300 border border-workflow-primary hover:bg-workflow-primary-50 dark:hover:bg-workflow-primary-900/20 rounded transition-all text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/job-detail-application?id=${job.id}`}
                            className="flex-1 px-3 py-2 text-xs font-semibold bg-workflow-primary text-white hover:bg-workflow-primary-600 dark:hover:bg-workflow-primary-500 rounded transition-all text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Apply
                          </Link>
                        </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/ai-powered-job-matching-recommendations"
                className="text-sm text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400 font-medium"
              >
                View All Recommendations →
              </Link>
            </div>
              </>
            ) : (
              <div className="text-center py-4 text-sm text-[#64748B] dark:text-[#8B92A3]">
                No recommendations available. Complete your profile to get personalized job matches.
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
            {totalJobs > 0 ? `${totalJobs} jobs found` : 'No jobs found'}
          </p>
          <div className="flex items-center gap-3">
            {user && (
              <Link
                to="/ai-powered-job-matching-recommendations"
                className="text-sm text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400 font-medium flex items-center gap-1"
              >
                <Icon name="Zap" size={16} />
                AI Recommendations
              </Link>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-[#E2E8F0] dark:border-[#1E2640] rounded px-3 py-1 bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
            >
              <option value="relevance">Relevance</option>
              <option value="created_at">Newest</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
            <SearchFilters
              filters={selectedFilters}
              selectedFilters={selectedFilters}
              onFilterChange={(key, value) => {
                setSelectedFilters(prev => ({
                  ...prev,
                  [key]: value
                }));
                setCurrentPage(1);
              }}
              onClearAll={() => {
                setSelectedFilters({
                  location: [],
                  employmentType: [],
                  salaryRange: '',
                  companySize: '',
                  postingDate: '',
                  experienceLevel: '',
                  remoteWork: false
                });
                setCurrentPage(1);
              }}
              activeFiltersCount={
                (selectedFilters.location?.length || 0) +
                (selectedFilters.employmentType?.length || 0) +
                (selectedFilters.salaryRange ? 1 : 0) +
                (selectedFilters.companySize ? 1 : 0) +
                (selectedFilters.postingDate ? 1 : 0) +
                (selectedFilters.experienceLevel ? 1 : 0) +
                (selectedFilters.remoteWork ? 1 : 0)
              }
            />
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {isLoading && jobs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <AILoader size="large" text="Finding perfect jobs for you..." variant="pulse" />
                </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                <p className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">No jobs found</p>
                <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">Try adjusting your search or filters</p>
                </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {jobs.map((job) => {
                    // Handle companies relationship (can be array or object)
                    const companyData = Array.isArray(job.companies) ? job.companies[0] : job.companies;
                    return (
                      <JobCard
                        key={job.id}
                        job={{
                          id: job.id,
                          title: job.title,
                          company: job.company || companyData?.name || 'Unknown Company',
                          logo: companyData?.logo || job.logo || null,
                          location: job.location,
                          employmentType: job.job_type || job.employment_type,
                          salaryRange: job.salary || (job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : 'Equity-based'),
                          postedDate: job.created_at ? new Date(job.created_at) : new Date(),
                          description: job.description,
                          requirements: formatRequirements(job.requirements),
                          companySize: companyData?.size || job.company_size,
                          experienceLevel: job.experience_level,
                          remoteWork: job.remote,
                          featured: job.featured,
                        }}
                        isSaved={savedJobs.has(job.id)}
                        onSave={() => handleSaveJob(job.id)}
                        onClick={() => handleJobSelect(job.id)}
                      />
                    );
                  })}
                </div>

                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Loading...' : 'Load More Jobs'}
                  </button>
                )}
              </>
              )}
            </div>
          </div>

        {/* Advanced Search Modal */}
        {isAdvancedSearchOpen && (
        <AdvancedSearchModal
          isOpen={isAdvancedSearchOpen}
          onClose={() => setIsAdvancedSearchOpen(false)}
            filters={selectedFilters}
            onApplyFilters={setSelectedFilters}
        />
        )}
      </div>
    </div>
  );
};

export default JobSearchBrowse;