import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Calendar, Award, Plus, Edit, CheckCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';

const GoalTracker = () => {
  const { user } = useAuthContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await applicationService.getAll();
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate goals from real data
  const goals = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const monthApps = applications.filter(app => {
      if (!app.applied_at) return false;
      const appDate = parseISO(app.applied_at);
      return isWithinInterval(appDate, { start: monthStart, end: monthEnd });
    });

    const totalApplied = monthApps.length;
    const interviews = monthApps.filter(a => a.status === 'interview' || a.status === 'accepted').length;
    const accepted = monthApps.filter(a => a.status === 'accepted').length;

    return [
      {
        id: 1,
        title: 'Applications Submitted',
        target: 50,
        current: totalApplied,
        timeframe: 'This Month',
        deadline: format(monthEnd, 'yyyy-MM-dd'),
        status: totalApplied >= 40 ? 'on-track' : totalApplied >= 25 ? 'on-track' : 'behind',
        category: 'Activity',
        milestones: [
          { value: 10, label: 'Week 1', completed: totalApplied >= 10 },
          { value: 20, label: 'Week 2', completed: totalApplied >= 20 },
          { value: 30, label: 'Week 3', completed: totalApplied >= 30 },
          { value: 40, label: 'Week 4', completed: totalApplied >= 40 },
          { value: 50, label: 'Month End', completed: totalApplied >= 50 }
        ]
      },
      {
        id: 2,
        title: 'Interview Invitations',
        target: 10,
        current: interviews,
        timeframe: 'This Month',
        deadline: format(monthEnd, 'yyyy-MM-dd'),
        status: interviews >= 8 ? 'on-track' : interviews >= 5 ? 'on-track' : 'behind',
        category: 'Success',
        milestones: [
          { value: 2, label: 'Week 1', completed: interviews >= 2 },
          { value: 4, label: 'Week 2', completed: interviews >= 4 },
          { value: 6, label: 'Week 3', completed: interviews >= 6 },
          { value: 8, label: 'Week 4', completed: interviews >= 8 },
          { value: 10, label: 'Month End', completed: interviews >= 10 }
        ]
      },
      {
        id: 3,
        title: 'Job Offers Received',
        target: 2,
        current: accepted,
        timeframe: 'This Quarter',
        deadline: format(endOfMonth(new Date(now.getFullYear(), now.getMonth() + 2)), 'yyyy-MM-dd'),
        status: accepted >= 1 ? 'on-track' : 'behind',
        category: 'Success',
        milestones: [
          { value: 1, label: 'Month 1', completed: accepted >= 1 },
          { value: 2, label: 'Quarter End', completed: accepted >= 2 }
        ]
      }
    ];
  }, [applications]);

  const achievements = useMemo(() => {
    const achievementsList = [];
    
    if (applications.length >= 20) {
      achievementsList.push({
        title: 'Consistency Champion',
        description: `Applied to ${applications.length} jobs successfully`,
        date: format(new Date(), 'yyyy-MM-dd'),
        icon: Award
      });
    }

    const interviewRate = applications.length > 0
      ? (applications.filter(a => a.status === 'interview' || a.status === 'accepted').length / applications.length) * 100
      : 0;

    if (interviewRate >= 30) {
      achievementsList.push({
        title: 'Interview Master',
        description: `Achieved ${interviewRate.toFixed(0)}% interview conversion rate`,
        date: format(new Date(), 'yyyy-MM-dd'),
        icon: TrendingUp
      });
    }

    if (applications.filter(a => a.status === 'accepted').length > 0) {
      achievementsList.push({
        title: 'Offer Received',
        description: 'Successfully received job offers',
        date: format(new Date(), 'yyyy-MM-dd'),
        icon: CheckCircle
      });
    }

    return achievementsList;
  }, [applications]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'behind':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Activity: 'bg-blue-100 text-blue-700',
      Success: 'bg-green-100 text-green-700',
      Networking: 'bg-purple-100 text-purple-700',
      Preparation: 'bg-yellow-100 text-yellow-700'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8EAED]">Goal Tracker</h2>
          <p className="text-sm text-gray-600 dark:text-[#8B92A3] mt-1">
            Set targets, track progress, and celebrate achievements
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add New Goal
        </button>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-[#1E2640] rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-[#E8EAED] mb-1">{goals.length}</div>
          <div className="text-sm text-gray-600 dark:text-[#8B92A3]">Active Goals</div>
        </div>
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-[#1E2640] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {goals.filter(g => g.status === 'on-track').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-[#8B92A3]">On Track</div>
        </div>
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-[#1E2640] rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {goals.filter(g => g.status === 'behind').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-[#8B92A3]">Behind Schedule</div>
        </div>
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-[#1E2640] rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">{achievements.length}</div>
          <div className="text-sm text-gray-600 dark:text-[#8B92A3]">Achievements</div>
        </div>
      </div>
      {/* Goals List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0046FF] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-[#8B92A3]">Loading goals from your applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 dark:text-[#8B92A3] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-[#E8EAED] mb-2">No applications yet</h3>
          <p className="text-gray-600 dark:text-[#8B92A3] mb-4">Start applying to jobs to track your goals!</p>
          <a
            href="/job-search-browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {goals?.map((goal) => {
          const progress = (goal?.current / goal?.target) * 100;
          return (
            <div
              key={goal?.id}
              className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-[#1E2640] rounded-lg p-6"
            >
              {/* Goal Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-[#E8EAED]">{goal?.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(goal?.category)}`}>
                      {goal?.category}
                    </span>
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getStatusColor(goal?.status)}`}>
                      {goal?.status === 'on-track' ? 'On Track' : goal?.status === 'behind' ? 'Behind' : 'Completed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-[#8B92A3]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {goal?.timeframe}
                    </span>
                    <span>Due: {goal?.deadline}</span>
                  </div>
                </div>
                <button className="text-gray-600 dark:text-[#8B92A3] hover:text-gray-900 dark:hover:text-[#E8EAED]">
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-[#B4B9C4]">
                    Progress: <span className="font-bold">{goal?.current}</span> / {goal?.target}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-[#E8EAED]">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-[#1E2640] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress >= 100 ? 'bg-green-600' : progress >= 80 ? 'bg-[#0046FF]' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
              {/* Milestones */}
              <div className="bg-gray-50 dark:bg-[#1A2139] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-[#B4B9C4] mb-3">Milestones</h4>
                <div className="flex items-center justify-between">
                  {goal?.milestones?.map((milestone, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        milestone?.completed
                          ? 'bg-[#0046FF] border-[#0046FF] text-white'
                          : 'bg-white dark:bg-[#13182E] border-gray-300 dark:border-[#1E2640] text-gray-400 dark:text-[#8B92A3]'
                      }`}>
                        {milestone?.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-xs font-bold">{milestone?.value}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-[#8B92A3] text-center">{milestone?.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
      {/* Achievements */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
        </div>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Keep applying to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements?.map((achievement, index) => {
            const Icon = achievement?.icon;
            return (
              <div
                key={index}
                className="bg-white border border-yellow-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{achievement?.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{achievement?.description}</p>
                <span className="text-xs text-gray-500">{achievement?.date}</span>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;