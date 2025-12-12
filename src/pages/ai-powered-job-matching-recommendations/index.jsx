import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { jobService } from '../../services/jobService';
import { resumeService } from '../../services/resumeService';
import { aiService } from '../../services/aiService';
import Breadcrumb from 'components/ui/Breadcrumb';
import JobMatchCard from './components/JobMatchCard';
import SkillMapping from './components/SkillMapping';
import MarketInsights from './components/MarketInsights';
import AIChatbot from './components/AIChatbot';
import SmartFilters from './components/SmartFilters';

const AIPoweredJobMatchingRecommendations = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [filters, setFilters] = useState({
    minMatch: 70,
    remote: null,
    salaryRange: null,
    industry: []
  });

  useEffect(() => {
    if (user) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [user, filters]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      // Get user's default resume
      const resumes = await resumeService.getAll();
      const defaultResume = resumes.find(r => r.is_default) || resumes[0];

      if (!defaultResume) {
        showError('Please create a resume first to get AI recommendations');
        navigate('/resume-builder-ai-enhancement');
        return;
      }

      // Get all jobs
      const jobsResult = await jobService.getAll({ pageSize: 50 });
      const jobs = jobsResult.data || [];

      // Match jobs with resume using AI
      const matches = [];
      for (const job of jobs.slice(0, 20)) { // Limit to 20 for performance
        try {
          const matchResult = await aiService.matchJob(defaultResume.id, job.id);
          matches.push({
            ...job,
            matchScore: matchResult.match_score || 0,
            skillGaps: matchResult.missing_skills || [],
            matchedSkills: matchResult.strengths || [],
            recommendations: matchResult.recommendations || [],
          });
        } catch (error) {
          console.error(`Error matching job ${job.id}:`, error);
          // Fallback: add job with 0 match score
          matches.push({
            ...job,
            matchScore: 0,
            skillGaps: [],
            matchedSkills: [],
          });
        }
      }

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);
      setMatchingJobs(matches);

      // Extract user profile from resume
      const resumeContent = defaultResume.content_json || {};
      setUserProfile({
        name: user.email?.split('@')[0] || 'User',
        skills: extractSkills(resumeContent),
        experience: '5 years', // TODO: Extract from resume
        desiredRole: 'Developer', // TODO: Extract from resume
      });

    } catch (error) {
      console.error('Error loading recommendations:', error);
      showError('Failed to load AI recommendations. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const extractSkills = (resumeContent) => {
    // Extract skills from resume content
    const skills = [];
    if (resumeContent.sections) {
      resumeContent.sections.forEach(section => {
        if (section.type === 'skills' && section.content) {
          // Simple extraction - in production, parse HTML properly
          const text = section.content.replace(/<[^>]*>/g, '');
          skills.push(...text.split(',').map(s => s.trim()).filter(Boolean));
        }
      });
    }
    return skills.length > 0 ? skills : ['React', 'JavaScript', 'Node.js']; // Fallback
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredJobs = matchingJobs?.filter(job => {
    if (filters?.minMatch && job?.matchScore < filters?.minMatch) return false;
    if (filters?.remote !== null && (job?.location?.toLowerCase().includes('remote')) !== filters?.remote) return false;
    return true;
  });

  if (!user) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Lock" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Sign in required</h2>
          <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Please sign in to get AI-powered job recommendations</p>
          <Link to="/job-seeker-registration-login" className="btn-primary inline-flex items-center">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
          <p className="text-[#64748B] dark:text-[#8B92A3]">Analyzing your profile and matching jobs...</p>
        </div>
      </div>
    );
  }

  const avgMatchScore = matchingJobs.length > 0
    ? Math.round(matchingJobs.reduce((sum, job) => sum + (job.matchScore || 0), 0) / matchingJobs.length)
    : 0;

  const avgSuccessRate = matchingJobs.length > 0
    ? Math.round(matchingJobs.reduce((sum, job) => sum + (job.matchScore || 0) * 0.9, 0) / matchingJobs.length)
    : 0;

  return (
    <>
      <Helmet>
        <title>AI-Powered Job Matching - Workflow</title>
        <meta name="description" content="Discover personalized job recommendations powered by AI. Get intelligent matching, skill gap analysis, and career insights tailored to your profile." />
      </Helmet>
      <div className="bg-surface min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] flex items-center space-x-2">
                <span>AI-Powered Job Matching</span>
                <div className="px-2 py-1 bg-workflow-primary/10 text-workflow-primary text-xs rounded-full font-semibold">
                  AI
                </div>
              </h1>
              <p className="text-[#64748B] dark:text-[#8B92A3] mt-1">
                {filteredJobs?.length} highly compatible opportunities found for you
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowChatbot(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Icon name="MessageCircle" size={16} />
                <span>AI Career Advisor</span>
              </button>
              <Link to="/jobs" className="btn-primary flex items-center space-x-2">
                <Icon name="Search" size={16} />
                <span>Browse All Jobs</span>
              </Link>
            </div>
          </div>

          {/* AI Match Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-background rounded-lg shadow-sm border border-[#E2E8F0] dark:border-[#1E2640] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">Avg Match Score</p>
                  <p className="text-2xl font-bold text-workflow-primary">{avgMatchScore}%</p>
                </div>
                <div className="p-3 bg-workflow-primary/10 rounded-lg">
                  <Icon name="Target" size={24} className="text-workflow-primary" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-[#E2E8F0] dark:border-[#1E2640] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">Success Rate</p>
                  <p className="text-2xl font-bold text-success">{avgSuccessRate}%</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <Icon name="TrendingUp" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-[#E2E8F0] dark:border-[#1E2640] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">New Matches</p>
                  <p className="text-2xl font-bold text-accent">{filteredJobs?.length || 0}</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon name="Sparkles" size={24} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-[#E2E8F0] dark:border-[#1E2640] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">Skill Coverage</p>
                  <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                    {userProfile?.skills?.length ? Math.min(100, Math.round((userProfile.skills.length / 10) * 100)) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Icon name="Award" size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Filters & Skills */}
            <div className="lg:col-span-1 space-y-6">
              <SmartFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              {userProfile && (
                <SkillMapping
                  userSkills={userProfile?.skills || []}
                  recommendedSkills={Array.from(new Set(matchingJobs.flatMap(job => job.skillGaps || [])))}
                />
              )}
            </div>

            {/* Main Content - Job Matches */}
            <div className="lg:col-span-2 space-y-4">
              {filteredJobs?.length === 0 ? (
                <div className="bg-background rounded-lg shadow-sm border border-[#E2E8F0] dark:border-[#1E2640] p-12 text-center">
                  <Icon name="Search" size={48} className="mx-auto mb-4 text-[#64748B] dark:text-[#8B92A3]" />
                  <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">No matches found</h3>
                  <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">
                    Try adjusting your filters or create a resume to get better matches
                  </p>
                  <Link to="/resume-builder-ai-enhancement" className="btn-primary inline-flex items-center">
                    Create Resume
                  </Link>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <JobMatchCard
                    key={job.id}
                    job={{
                      ...job,
                      company: job.company || job.companies?.name,
                      logo: job.companies?.logo || job.logo,
                      location: job.location,
                      salary: job.salary || `${job.salary_min || ''} - ${job.salary_max || ''}`,
                      postedDate: job.created_at,
                    }}
                    userSkills={userProfile?.skills || []}
                    onSelect={setSelectedJob}
                    isSelected={selectedJob?.id === job?.id}
                  />
                ))
              )}
            </div>
          </div>

          {/* Market Insights */}
          {userProfile && (
            <div className="mt-8">
              <MarketInsights userProfile={userProfile} />
            </div>
          )}
        </div>
      </div>
      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot
          onClose={() => setShowChatbot(false)}
          userProfile={userProfile}
        />
      )}
    </>
  );
};

export default AIPoweredJobMatchingRecommendations;
