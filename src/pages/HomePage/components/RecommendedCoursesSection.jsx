import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Clock, TrendingUp, Search, Zap, MapPin, DollarSign, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { jobService } from '../../../services/jobService';
import { applicationService } from '../../../services/applicationService';
import { aiService } from '../../../services/aiService';
import { useAuthContext } from '../../../contexts/AuthContext';
import Image from '../../../components/AppImage';
import AILoader from '../../../components/ui/AILoader';
import CompanyAvatar from '../../../components/ui/CompanyAvatar';
import RecommendedCourseCard from './RecommendedCourseCard';
import { detectUserField, isJobInField, matchesJobTitle, shouldExcludeJob } from '../../../utils/jobFieldMatcher';
import './RecommendedJobsSections.css';

const RecommendedCoursesSection = () => {
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
    recentUploads: { courses: [], loading: true },
    newJobs: { courses: [], loading: true },
    aiMatched: { courses: [], loading: true },
    trending: { courses: [], loading: true },
    basedOnSearches: { courses: [], loading: true },
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
    // Reset used course IDs for fresh variety
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
      // Filter out already used courses, shuffle, and take 6 for variety
      const available = (result.data || []).filter(j => !usedJobIds.has(j.id));
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these courses as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        shuffled.forEach(course => newSet.add(course.id));
        return newSet;
      });
      setSections(prev => ({
        ...prev,
        recentUploads: { courses: shuffled, loading: false },
      }));
    } catch (error) {
      console.error('Error loading recent uploads:', error);
      setSections(prev => ({
        ...prev,
        recentUploads: { courses: [], loading: false },
      }));
    }
  };

  const loadNewJobs = async () => {
    try {
      setSections(prev => ({ ...prev, newJobs: { ...prev.newJobs, loading: true } }));
      // Get courses from last 7 days for more variety
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const result = await jobService.getAll({
        pageSize: 30, // Get more to shuffle
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Filter to show recent courses (fallback to all if no new ones in the last week)
      let newJobs = (result.data || []).filter(course => {
        if (!course.created_at) return false;
        return new Date(course.created_at) >= weekAgo;
      });

      // Fallback: If no courses in last 7 days, take the 20 most recent
      if (newJobs.length === 0) {
        newJobs = result.data || [];
      }

      // Filter out already used courses, shuffle, and take 6 for variety
      const available = newJobs.filter(j => !usedJobIds.has(j.id));
      const shuffled = available.length > 0 ? available.sort(() => Math.random() - 0.5).slice(0, 6) : (result.data || []).slice(0, 6);
      
      // Mark these courses as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        shuffled.forEach(course => newSet.add(course.id));
        return newSet;
      });

      setSections(prev => ({
        ...prev,
        newJobs: { courses: shuffled, loading: false },
      }));
    } catch (error) {
      console.error('Error loading new courses:', error);
      setSections(prev => ({
        ...prev,
        newJobs: { courses: [], loading: false },
      }));
    }
  };

  const loadAIMatched = async () => {
    if (!user) {
      setSections(prev => ({
        ...prev,
        aiMatched: { courses: [], loading: false },
      }));
      return;
    }

    try {
      setSections(prev => ({ ...prev, aiMatched: { ...prev.aiMatched, loading: true } }));

      // Use the advanced recommendation engine via AI service
      const recommendations = await aiService.getPersonalizedRecommendations({
        limit: 12, // Get more for shuffling
        minScore: 60
      });

      if (recommendations && recommendations.length > 0) {
        // Map backend fields to frontend expectations and shuffle for variety
        const validMatches = recommendations
          .map(rec => ({
            ...rec,
            id: rec.id || rec.job_id || rec.course_id,
            matchScore: rec.matchScore || rec.score || 85
          }))
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);

        setSections(prev => ({
          ...prev,
          aiMatched: { courses: validMatches, loading: false },
        }));
      } else {
        // Fallback or empty state
        setSections(prev => ({
          ...prev,
          aiMatched: { courses: [], loading: false },
        }));
      }
    } catch (error) {
      console.error('AI matching interrupted:', error);
      setSections(prev => ({
        ...prev,
        aiMatched: { courses: [], loading: false },
      }));
    }
  };

  const loadTrending = async () => {
    try {
      setSections(prev => ({ ...prev, trending: { ...prev.trending, loading: true } }));

      // Get courses sorted by views/aCourse Enrollments (trending)
      const result = await jobService.getAll({
        pageSize: 30, // Get more to shuffle
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Mix platform and crawled courses, shuffle for variety
      const platformJobs = (result.data || []).filter(j => j.source === 'manual' || !j.source);
      const crawledJobs = (result.data || []).filter(j => j.source && j.source !== 'manual');
      const mixedJobs = [...crawledJobs, ...platformJobs].sort(() => Math.random() - 0.5);

      // Filter out already used courses
      const available = mixedJobs.filter(j => !usedJobIds.has(j.id));
      // Use featured courses or most recent as trending, shuffle for variety
      const trending = available.filter(course => course.featured).slice(0, 6);
      const finalTrending = trending.length > 0 ? trending : available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these courses as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        finalTrending.forEach(course => newSet.add(course.id));
        return newSet;
      });

      setSections(prev => ({
        ...prev,
        trending: { courses: finalTrending, loading: false },
      }));
    } catch (error) {
      console.error('Error loading trending courses:', error);
      setSections(prev => ({
        ...prev,
        trending: { courses: [], loading: false },
      }));
    }
  };

  const loadBasedOnSearches = async () => {
    try {
      setSections(prev => ({ ...prev, basedOnSearches: { ...prev.basedOnSearches, loading: true } }));

      // Get courses that match common search terms
      const result = await jobService.getAll({
        pageSize: 30, // Get more to ensure variety
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Filter out already used courses, shuffle, and take 6
      const available = (result.data || []).filter(j => !usedJobIds.has(j.id));
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 6);
      // Mark these courses as used
      setUsedJobIds(prev => {
        const newSet = new Set(prev);
        shuffled.forEach(course => newSet.add(course.id));
        return newSet;
      });

      setSections(prev => ({
        ...prev,
        basedOnSearches: { courses: shuffled, loading: false },
      }));
    } catch (error) {
      console.error('Error loading search-based courses:', error);
      setSections(prev => ({
        ...prev,
        basedOnSearches: { courses: [], loading: false },
      }));
    }
  };

  const renderJobCard = (course, index) => {
    return <RecommendedCourseCard key={course.id || index} course={course} index={index} />;
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

  const renderSection = (title, icon, courses, loading, description, sectionKey) => {
    if (loading) {
      return (
        <section className="recommended-courses-section">
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

    if (courses.length === 0) return null;

    const scrollState = scrollStates[sectionKey] || { canScrollLeft: false, canScrollRight: false };

    return (
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              {React.cloneElement(icon, { className: 'w-3.5 h-3.5 text-emerald-500', strokeWidth: 2.5 })}
              <h2 className="text-base md:text-lg font-[900] text-slate-900 dark:text-white tracking-tight">{title}</h2>
            </div>
            {description && (
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em] pl-5">
                {description}
              </p>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scrollSection(sectionKey, 'left')}
              disabled={!scrollState.canScrollLeft}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                scrollState.canScrollLeft
                  ? 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white hover:border-emerald-400 hover:text-emerald-500'
                  : 'border-slate-100 dark:border-white/5 text-slate-300 dark:text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSection(sectionKey, 'right')}
              disabled={!scrollState.canScrollRight}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                scrollState.canScrollRight
                  ? 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white hover:border-emerald-400 hover:text-emerald-500'
                  : 'border-slate-100 dark:border-white/5 text-slate-300 dark:text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Row */}
        <div
          ref={scrollRefs[sectionKey]}
          onScroll={() => checkScrollState(sectionKey)}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-6 pt-1 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory"
        >
          {courses.map((course, idx) => (
            <div key={course.id || idx} className="snap-center shrink-0">
              {renderJobCard(course, idx)}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="recommended-courses-container">
      {renderSection(
        'Recommended Based on Recent Uploads',
        <Clock className="w-6 h-6 text-workflow-primary" />,
        sections.recentUploads.courses,
        sections.recentUploads.loading,
        'Courses recently added to the platform',
        'recentUploads'
      )}

      {renderSection(
        'New Courses This Week',
        <Sparkles className="w-6 h-6 text-workflow-primary" />,
        sections.newJobs.courses,
        sections.newJobs.loading,
        'Fresh educational opportunities just added',
        'newJobs'
      )}

      {user && renderSection(
        'AI Matched for You',
        <Zap className="w-6 h-6 text-workflow-primary" />,
        sections.aiMatched.courses,
        sections.aiMatched.loading,
        'Personalized matches based on your profile',
        'aiMatched'
      )}

      {renderSection(
        'Trending Courses',
        <TrendingUp className="w-6 h-6 text-workflow-primary" />,
        sections.trending.courses,
        sections.trending.loading,
        'Most popular courses right now',
        'trending'
      )}

      {renderSection(
        'Recommended Based on Popular Searches',
        <Search className="w-6 h-6 text-workflow-primary" />,
        sections.basedOnSearches.courses,
        sections.basedOnSearches.loading,
        'Courses matching what others are searching for',
        'basedOnSearches'
      )}
    </div>
  );
};

export default RecommendedCoursesSection;
