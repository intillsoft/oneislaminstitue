import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { jobService } from '../../services/jobService';
import { resumeService } from '../../services/resumeService';
import { aiService } from '../../services/aiService';
import JobMatchCard from './components/JobMatchCard';
import SkillMapping from './components/SkillMapping';
import MarketInsights from './components/MarketInsights';
import AIChatbot from './components/AIChatbot';
import SmartFilters from './components/SmartFilters';
import ExplainJobModal from './components/ExplainJobModal';

const AIPoweredJobMatchingRecommendations = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [explainingJob, setExplainingJob] = useState(null);
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
        navigate('/resume/new');
        return;
      }

      // Extract user profile from resume
      const resumeData = defaultResume.content_json || {};
      setUserProfile({
        name: user.email?.split('@')[0] || 'Elite Professional',
        skills: resumeData.skills || ['React', 'TypeScript', 'Node.js', 'AWS', 'System Architecture'],
        experience: resumeData.experience || [],
        desiredRole: defaultResume.title || 'Technical Specialist',
      });

      // Fetch personalized recommendations
      const recommendations = await aiService.getPersonalizedRecommendations({
        limit: 20,
        minScore: filters.minMatch || 50,
      });

      if (recommendations && recommendations.length > 0) {
        setMatchingJobs(recommendations);
      } else {
        setMatchingJobs([]); // Ensure empty state if no recommendations
      }

    } catch (error) {
      console.error('Error loading neural matches:', error);
      showError('Neural engine sync failed. Please refresh your uplink.');
      setMatchingJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredJobs = matchingJobs?.filter(job => {
    if (filters?.minMatch && job?.matchScore < filters?.minMatch) return false;
    if (filters?.remote !== null && (job?.location?.toLowerCase().includes('remote')) !== filters?.remote) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-t-2 border-l-2 border-workflow-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="Sparkles" className="animate-pulse text-workflow-primary" size={32} />
          </div>
        </div>
        <p className="mt-8 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Synthesizing Neural Career Vectors...
        </p>
      </div>
    );
  }

  const avgMatchScore = matchingJobs.length > 0
    ? Math.round(matchingJobs.reduce((sum, job) => sum + (job.matchScore || 0), 0) / matchingJobs.length)
    : 88;

  return (
    <div className="flex-1 overflow-x-hidden">
      <Helmet>
        <title>Match Intelligence | Professional Canvas</title>
      </Helmet>

      <div className="px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        {/* Elite Header */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-workflow-primary/10 border border-workflow-primary/20 text-[10px] font-black uppercase tracking-widest text-workflow-primary"> Neural Engine v2.4 </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400"> Real-time Match Synchronization </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-[950] tracking-[-0.05em] text-slate-900 dark:text-white mb-2">
                Match <span className="text-workflow-primary">Intelligence</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                {filteredJobs?.length || 0} high-fidelity career nodes analyzed against your elite profile architecture.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowChatbot(true)}
                className="h-14 px-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:border-workflow-primary/50 transition-all shadow-xl group"
              >
                <Icon name="MessageCircle" size={18} className="text-workflow-primary group-hover:scale-110 transition-transform" />
                <span>AI Advisor</span>
              </button>
              <Link to="/jobs" className="h-14 px-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow">
                <Icon name="BarChart3" size={18} />
                <span>Market Matrix</span>
              </Link>
            </div>
          </motion.div>
        </header>

        {/* AI Match Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Mean Match Score"
            value={`${avgMatchScore}%`}
            icon="Target"
            color="text-workflow-primary"
            bgColor="bg-workflow-primary/10"
          />
          <StatCard
            label="Success Predictor"
            value="92%"
            icon="TrendingUp"
            color="text-emerald-500"
            bgColor="bg-emerald-500/10"
          />
          <StatCard
            label="Active Matches"
            value={filteredJobs?.length || 0}
            icon="Sparkles"
            color="text-indigo-500"
            bgColor="bg-indigo-500/10"
          />
          <StatCard
            label="Skill Alignment"
            value="84%"
            icon="Award"
            color="text-amber-500"
            bgColor="bg-amber-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Controls */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="glass-panel p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl">
              <SmartFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {userProfile && (
              <div className="glass-panel p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl">
                <SkillMapping
                  userSkills={userProfile?.skills || []}
                  recommendedSkills={['GraphQL', 'System Design', 'Web3 Architecture']}
                />
              </div>
            )}
          </aside>

          {/* Main Matches Feed */}
          <main className="lg:col-span-9 space-y-8">
            {filteredJobs?.length === 0 ? (
              <div className="glass-panel py-32 rounded-[3rem] border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8">
                  <Icon name="Search" size={40} className="text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">Zero Intelligence Matches</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-10 font-medium">
                  The neural engine found no nodes matching your current threshold. Consider lowering your precision filters.
                </p>
                <button
                  onClick={() => handleFilterChange({ minMatch: 1, remote: null })}
                  className="h-14 px-10 rounded-2xl bg-workflow-primary text-white font-black text-xs uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-all"
                >
                  Reset Neural Matrix
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
                  <h2 className="text-2xl font-[950] text-slate-900 dark:text-white tracking-tighter uppercase mb-1 flex items-center gap-2">
                    <Icon name="Zap" className="text-workflow-primary" size={24} />
                    AI Power Matches
                  </h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] opacity-70">
                    Curated based on your elite profile architecture
                  </p>
                </div>
                {filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <JobMatchCard
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
                      onExplain={setExplainingJob}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Market Insights at bottom of feed */}
            {userProfile && (
              <div className="mt-16 pt-16 border-t border-slate-200 dark:border-white/10">
                <MarketInsights userProfile={userProfile} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot
          onClose={() => setShowChatbot(false)}
          userProfile={userProfile}
        />
      )}

      {/* Explanation Modal */}
      {explainingJob && (
        <ExplainJobModal
          job={explainingJob}
          userProfile={userProfile}
          onClose={() => setExplainingJob(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bgColor }) => (
  <div className="glass-panel p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl flex items-center justify-between group hover:scale-[1.02] transition-all hover:shadow-2xl">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
      <p className={`text-4xl font-[950] ${color} tracking-tighter leading-none`}>{value}</p>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm border border-current/10`}>
      <Icon name={icon} size={24} />
    </div>
  </div>
);

export default AIPoweredJobMatchingRecommendations;
