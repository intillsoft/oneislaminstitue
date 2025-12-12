import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Clock, TrendingUp, Search, Zap, MapPin, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobService } from '../../../services/jobService';
import { resumeService } from '../../../services/resumeService';
import { aiService } from '../../../services/aiService';
import { useAuthContext } from '../../../contexts/AuthContext';
import Image from '../../../components/AppImage';
import AILoader from '../../../components/ui/AILoader';
import { detectUserField, isJobInField, matchesJobTitle, shouldExcludeJob } from '../../../utils/jobFieldMatcher';
import './RecommendedJobsSections.css';

const RecommendedJobsSections = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const scrollRefs = {
    recentUploads: useRef(null),
    newJobs: useRef(null),
    aiMatched: useRef(null),
    trending: useRef(null),
    basedOnSearches: useRef(null),
  };
  const [sections, setSections] = useState({
    recentUploads: { jobs: [], loading: true },
    newJobs: { jobs: [], loading: true },
    aiMatched: { jobs: [], loading: true },
    trending: { jobs: [], loading: true },
    basedOnSearches: { jobs: [], loading: true },
  });
  const [scrollStates, setScrollStates] = useState({
    recentUploads: { canScrollLeft: false, canScrollRight: false },
    newJobs: { canScrollLeft: false, canScrollRight: false },
    aiMatched: { canScrollLeft: false, canScrollRight: false },
    trending: { canScrollLeft: false, canScrollRight: false },
    basedOnSearches: { canScrollLeft: false, canScrollRight: false },
  });

  useEffect(() => {
    loadAllSections();
  }, [user]);

  const [usedJobIds, setUsedJobIds] = useState(new Set());

  const loadAllSections = async () => {
    // Reset used job IDs for fresh variety
    setUsedJobIds(new Set());
    // Load all sections in parallel
    await Promise.all([
      loadRecentUploads(),
      loadNewJobs(),
      loadAIMatched(),
      loadTrending(),
      loadBasedOnSearches(),
    ]);
  };

  const loadRecentUploads = async () => {
    try {
      setSections(prev => ({ ...prev, recentUploads: { ...prev.recentUploads, loading: true } }));
      const result = await jobService.getAll({
        pageSize: 50, // Get more to ensure variety
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
      // Filter out already used jobs, shuffle, and take 6 for variety
      const available = (result.data || []).filter(j => !usedJobIds.has(j.id));
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these jobs as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        shuffled.forEach(job => newSet.add(job.id));
        return newSet;
      });
      setSections(prev => ({
        ...prev,
        recentUploads: { jobs: shuffled, loading: false },
      }));
    } catch (error) {
      console.error('Error loading recent uploads:', error);
      setSections(prev => ({
        ...prev,
        recentUploads: { jobs: [], loading: false },
      }));
    }
  };

  const loadNewJobs = async () => {
    try {
      setSections(prev => ({ ...prev, newJobs: { ...prev.newJobs, loading: true } }));
      // Get jobs from last 7 days for more variety
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const result = await jobService.getAll({
        pageSize: 30, // Get more to shuffle
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Filter to show recent jobs (last 7 days)
      const newJobs = (result.data || []).filter(job => {
        if (!job.created_at) return false;
        return new Date(job.created_at) >= weekAgo;
      });

      // Filter out already used jobs, shuffle, and take 6 for variety
      const available = newJobs.filter(j => !usedJobIds.has(j.id));
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these jobs as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        shuffled.forEach(job => newSet.add(job.id));
        return newSet;
      });

      setSections(prev => ({
        ...prev,
        newJobs: { jobs: shuffled, loading: false },
      }));
    } catch (error) {
      console.error('Error loading new jobs:', error);
      setSections(prev => ({
        ...prev,
        newJobs: { jobs: [], loading: false },
      }));
    }
  };

  const loadAIMatched = async () => {
    if (!user) {
      setSections(prev => ({
        ...prev,
        aiMatched: { jobs: [], loading: false },
      }));
      return;
    }

    try {
      setSections(prev => ({ ...prev, aiMatched: { ...prev.aiMatched, loading: true } }));

      const resumes = await resumeService.getAll();
      const defaultResume = resumes.find(r => r.is_default) || resumes[0];

      if (!defaultResume) {
        setSections(prev => ({
          ...prev,
          aiMatched: { jobs: [], loading: false },
        }));
        return;
      }

      const jobsResult = await jobService.getAll({ pageSize: 50 });
      const allJobs = jobsResult.data || [];

      // Mix platform and crawled jobs
      const platformJobs = allJobs.filter(j => j.source === 'manual' || !j.source);
      const crawledJobs = allJobs.filter(j => j.source && j.source !== 'manual');
      const mixedJobs = [...crawledJobs, ...platformJobs].sort(() => Math.random() - 0.5);

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

          const jobText = `${job.title} ${job.description || ''}`.toLowerCase();

          // THIRD: Check for STRICT job title match
          const titleMatch = userProfile.jobTitle
            ? matchesJobTitle(userProfile.jobTitle, job.title)
            : false;

          // FOURTH: Check for skill matches (must match at least 3 skills)
          const skillMatches = userProfile.skills.filter(skill =>
            skill.length > 2 && jobText.includes(skill)
          ).length;
          const skillMatch = skillMatches >= 3;

          // FIFTH: Check for industry match
          const industryMatch = userProfile.industry
            ? jobText.includes(userProfile.industry.toLowerCase())
            : false;

          // Job must match title STRICTLY, OR have strong skill/industry match
          if (userProfile.jobTitle && userProfile.jobTitle.length > 3) {
            return titleMatch || (skillMatch && industryMatch);
          }

          return skillMatch || industryMatch;
        });

        // If no personalized matches, don't show random jobs
        if (personalizedJobs.length === 0) {
          personalizedJobs = [];
        } else {
          personalizedJobs = personalizedJobs.sort(() => Math.random() - 0.5);
        }
      }

      // Use request throttler to prevent rate limiting
      const { requestThrottler } = await import('../../../utils/requestThrottler');

      // Match top 10 personalized jobs with AI, then shuffle and take 6 for variety
      const jobsToMatch = personalizedJobs.slice(0, 10).sort(() => Math.random() - 0.5).slice(0, 6);
      const matchPromises = jobsToMatch.map(async (job) => {
        try {
          const matchResult = await requestThrottler.add(() =>
            aiService.matchJob(defaultResume.id, job.id)
          );
          if (matchResult.match_score > 0) {
            return {
              ...job,
              matchScore: matchResult.match_score,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      });

      const matches = await Promise.race([
        Promise.all(matchPromises),
        new Promise(resolve => setTimeout(() => resolve([]), 3000)),
      ]);

      const validMatches = matches
        .filter(job => job !== null && job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);

      setSections(prev => ({
        ...prev,
        aiMatched: { jobs: validMatches, loading: false },
      }));
    } catch (error) {
      console.error('Error loading AI matched jobs:', error);
      setSections(prev => ({
        ...prev,
        aiMatched: { jobs: [], loading: false },
      }));
    }
  };

  const loadTrending = async () => {
    try {
      setSections(prev => ({ ...prev, trending: { ...prev.trending, loading: true } }));

      // Get jobs sorted by views/applications (trending)
      const result = await jobService.getAll({
        pageSize: 30, // Get more to shuffle
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Mix platform and crawled jobs, shuffle for variety
      const platformJobs = (result.data || []).filter(j => j.source === 'manual' || !j.source);
      const crawledJobs = (result.data || []).filter(j => j.source && j.source !== 'manual');
      const mixedJobs = [...crawledJobs, ...platformJobs].sort(() => Math.random() - 0.5);

      // Filter out already used jobs
      const available = mixedJobs.filter(j => !usedJobIds.has(j.id));
      // Use featured jobs or most recent as trending, shuffle for variety
      const trending = available.filter(job => job.featured).slice(0, 6);
      const finalTrending = trending.length > 0 ? trending : available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these jobs as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        finalTrending.forEach(job => newSet.add(job.id));
        return newSet;
      });

      setSections(prev => ({
        ...prev,
        trending: { jobs: finalTrending, loading: false },
      }));
    } catch (error) {
      console.error('Error loading trending jobs:', error);
      setSections(prev => ({
        ...prev,
        trending: { jobs: [], loading: false },
      }));
    }
  };

  const loadBasedOnSearches = async () => {
    try {
      setSections(prev => ({ ...prev, basedOnSearches: { ...prev.basedOnSearches, loading: true } }));

      // Get jobs that match common search terms
      const result = await jobService.getAll({
        pageSize: 30, // Get more to ensure variety
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Filter out already used jobs, shuffle, and take 6
      const available = (result.data || []).filter(j => !usedJobIds.has(j.id));
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these jobs as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        shuffled.forEach(job => newSet.add(job.id));
        return newSet;
      });

      setSections(prev => ({
        ...prev,
        basedOnSearches: { jobs: shuffled, loading: false },
      }));
    } catch (error) {
      console.error('Error loading search-based jobs:', error);
      setSections(prev => ({
        ...prev,
        basedOnSearches: { jobs: [], loading: false },
      }));
    }
  };

  const renderJobCard = (job, index) => {
    const companyData = Array.isArray(job.companies) ? job.companies[0] : job.companies;
    return (
      <motion.div
        key={job.id || index}
        className="job-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        onClick={() => navigate(`/jobs/detail/${job.id}`)}
      >
        <div className="job-card-header">
          <div className="job-company-logo">
            <Image
              src={job.logo || companyData?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Company')}&background=0046FF&color=fff&size=128`}
              alt={job.company || 'Company'}
              className="logo-image"
            />
          </div>
          {job.matchScore && (
            <div className="match-badge">
              {job.matchScore}% Match
            </div>
          )}
        </div>
        <h3 className="job-title">{job.title || 'Job Title'}</h3>
        <p className="job-company">{job.company || companyData?.name || 'Company'}</p>
        <div className="job-details">
          <span className="job-location">
            <MapPin className="w-4 h-4" />
            {job.location || 'Remote'}
          </span>
          {job.salary && (
            <span className="job-salary">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  const checkScrollState = (sectionKey) => {
    const container = scrollRefs[sectionKey]?.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 10; // 10px threshold

    setScrollStates(prev => ({
      ...prev,
      [sectionKey]: { canScrollLeft, canScrollRight }
    }));
  };

  const scrollSection = (sectionKey, direction) => {
    const container = scrollRefs[sectionKey]?.current;
    if (!container) return;

    const scrollAmount = 400; // Scroll by 400px
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Check scroll state after a delay
    setTimeout(() => checkScrollState(sectionKey), 300);
  };

  useEffect(() => {
    // Check initial scroll states
    Object.keys(scrollRefs).forEach(key => {
      checkScrollState(key);
    });
  }, [sections]);

  const renderSection = (title, icon, jobs, loading, description, sectionKey) => {
    if (loading) {
      return (
        <section className="recommended-jobs-section">
          <div className="section-header-horizontal">
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="section-title">{title}</h2>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <AILoader size="default" text="Loading recommendations..." variant="pulse" />
          </div>
        </section>
      );
    }

    if (jobs.length === 0) return null;

    const scrollState = scrollStates[sectionKey] || { canScrollLeft: false, canScrollRight: false };

    return (
      <section className="recommended-jobs-section relative">
        <div className="section-header-horizontal">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h2 className="section-title">{title}</h2>
              {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
            </div>
          </div>
          <motion.button
            className="view-all-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/jobs')}
          >
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </div>

        <div className="relative">
          {/* Left Scroll Button */}
          {scrollState.canScrollLeft && (
            <button
              onClick={() => scrollSection(sectionKey, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-[#13182E] rounded-full shadow-lg flex items-center justify-center hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors border border-border dark:border-[#1E2640]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary dark:text-[#E8EAED]" />
            </button>
          )}

          {/* Right Scroll Button */}
          {scrollState.canScrollRight && (
            <button
              onClick={() => scrollSection(sectionKey, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-[#13182E] rounded-full shadow-lg flex items-center justify-center hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors border border-border dark:border-[#1E2640]"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-text-primary dark:text-[#E8EAED]" />
            </button>
          )}

          <div className="jobs-carousel-horizontal">
            <div
              ref={scrollRefs[sectionKey]}
              className="jobs-carousel-inner flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              onScroll={() => checkScrollState(sectionKey)}
            >
              {jobs.map((job, index) => renderJobCard(job, index))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="recommended-jobs-container">
      {renderSection(
        'Recommended Based on Recent Uploads',
        <Clock className="w-6 h-6 text-workflow-primary" />,
        sections.recentUploads.jobs,
        sections.recentUploads.loading,
        'Jobs recently added to the platform',
        'recentUploads'
      )}

      {renderSection(
        'New Jobs This Week',
        <Sparkles className="w-6 h-6 text-workflow-primary" />,
        sections.newJobs.jobs,
        sections.newJobs.loading,
        'Fresh opportunities just posted',
        'newJobs'
      )}

      {user && renderSection(
        'AI Matched for You',
        <Zap className="w-6 h-6 text-workflow-primary" />,
        sections.aiMatched.jobs,
        sections.aiMatched.loading,
        'Personalized matches based on your profile',
        'aiMatched'
      )}

      {renderSection(
        'Trending Jobs',
        <TrendingUp className="w-6 h-6 text-workflow-primary" />,
        sections.trending.jobs,
        sections.trending.loading,
        'Popular opportunities right now',
        'trending'
      )}

      {renderSection(
        'Recommended Based on Popular Searches',
        <Search className="w-6 h-6 text-workflow-primary" />,
        sections.basedOnSearches.jobs,
        sections.basedOnSearches.loading,
        'Jobs matching what others are searching for',
        'basedOnSearches'
      )}
    </div>
  );
};

export default RecommendedJobsSections;
