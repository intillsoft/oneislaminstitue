/**
 * Study Progress Tracker Page
 * Beautiful dashboard showing course progress, streaks, and AI insights
 * Style: Elite Dashboard Pattern
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, BookOpen, Clock, Flame, CheckCircle2, Circle, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../../services/progressService';
import { useAuthContext } from '../../contexts/AuthContext';
import { ElitePageHeader, EliteCard, EliteStatCard, EliteProgressBar } from '../../components/ui/EliteCard';
import AILoader from '../../components/ui/AILoader';

const formatTime = (minutes) => {
  if (!minutes) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const StreakHeatmap = ({ streakData }) => (
  <EliteCard className="mb-6">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Flame size={20} className="text-orange-500" />
        </div>
        <div>
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Learning Streak</h3>
            <p className="text-xs text-text-muted">Consistency is key to mastery</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
        <Flame size={16} className="text-orange-500 fill-orange-500" />
        <span className="text-sm font-black text-orange-600">{streakData?.currentStreak || 0} Day Streak</span>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-4">
      {(streakData?.weekData || []).map((day, i) => (
        <motion.div key={day.date} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }} className="text-center group">
          <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border ${day.active
                ? day.minutes > 30 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 border-transparent text-white' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                : 'bg-surface-elevated border-border text-text-muted group-hover:border-emerald-500/30'
            }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{day.day}</span>
            {day.active ? (
                <span className="text-sm font-black">{day.minutes}m</span>
            ) : (
                <Circle size={8} className="text-text-muted/20" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </EliteCard>
);

const StudyProgressTracker = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch real data from database
      const [statsData, streakInfo] = await Promise.all([
        progressService.getStats(),
        progressService.getStreakData()
      ]);

      setStats(statsData);
      setStreakData(streakInfo);
      const insights = await progressService.generateAIInsights(statsData);
      setAiInsights(insights);
    } catch (error) {
      console.error("Failed to load progress data", error);
      // Initialize empty states for error
      setStats({
          progress: [],
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalTimeMinutes: 0,
          avgCompletion: 0,
          totalLessons: 0
      });
      setStreakData({ currentStreak: 0, longestStreak: 0, weekData: [] });
      setAiInsights([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-32">
        <AILoader variant="pulse" text="Syncing Academic Progress..." />
     </div>
  );

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto py-8">
        <ElitePageHeader
            title="Study Progress"
            subtitle="Track your learning journey and momentum."
            badge="Academic Analytics"
        >
             <div className="flex items-center gap-2 mt-6">
                {['overview'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                        px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                        ${activeTab === tab
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                        }
                    `}
                  >
                    {tab}
                  </button>
                ))}
            </div>
        </ElitePageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <EliteStatCard
                label="Active Courses"
                value={stats?.inProgressCourses || 0}
                icon={BookOpen}
                color="blue"
            />
            <EliteStatCard
                label="Study Streak"
                value={`${streakData?.currentStreak || 0} Days`}
                icon={Flame}
                color="amber"
                trend={{ value: 'Keep it up!', isPositive: true }}
            />
             <EliteStatCard
                label="Total Hours"
                value={formatTime(stats?.totalTimeMinutes || 0)}
                icon={Clock}
                color="green"
            />
            <EliteStatCard
                label="Lessons Done"
                value={stats?.totalLessons || 0}
                icon={CheckCircle2}
                color="blue"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
                 <StreakHeatmap streakData={streakData} />

                 <EliteCard>
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen size={20} className="text-text-primary" />
                        <h3 className="text-lg font-black text-text-primary">Active Courses</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {stats?.progress?.length > 0 ? (
                            stats.progress.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-bg border border-border hover:border-emerald-500/30 transition-all cursor-pointer group"
                                    onClick={() => navigate(`/courses/detail/${entry.course_id}`)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-text-primary group-hover:text-emerald-600 transition-colors">{entry.course?.title || 'Untitled Course'}</h4>
                                            <p className="text-xs text-text-muted">{entry.course?.company || 'One Islam Institute'}</p>
                                        </div>
                                        <div className="px-2 py-1 rounded-lg bg-surface-elevated border border-border">
                                            <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider">
                                                {entry.status === 'completed' ? 'Completed' : 'In Progress'}
                                            </span>
                                        </div>
                                    </div>

                                    <EliteProgressBar
                                        value={entry.completion_percentage}
                                        label={`${entry.lessons_completed}/${entry.lessons_total} Lessons`}
                                        color={entry.status === 'completed' ? 'green' : 'blue'}
                                        className="mb-3"
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
                                <h3 className="text-sm font-bold text-text-muted">No courses started yet</h3>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="mt-4 text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
                                >
                                    Browse Curriculum
                                </button>
                            </div>
                        )}
                    </div>
                 </EliteCard>
            </div>

            {/* AI Sidebar */}
             <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black mb-2">AI Insights</h3>
                        <p className="text-white/80 text-sm font-medium mb-6">Personalized analysis of your learning patterns.</p>
                        
                        <div className="space-y-3">
                            {aiInsights.map((insight, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{insight.icon}</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">{insight.title}</span>
                                    </div>
                                    <p className="text-[10px] text-white/70 leading-relaxed pl-7">{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <EliteCard className="text-center">
                    <div className="w-32 h-32 mx-auto relative mb-4">
                         <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                          <circle
                            cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(stats?.avgCompletion || 0) * 3.39} 339.3`}
                            className="text-emerald-500 transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-text-primary">{Math.round(stats?.avgCompletion || 0)}%</span>
                            <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Avg. Comp.</span>
                        </div>
                    </div>
                    <p className="text-xs text-text-muted font-medium">Across {stats?.totalCourses || 0} enrolled courses</p>
                </EliteCard>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudyProgressTracker;
