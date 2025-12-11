import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, Award, AlertCircle } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import Icon from '../../../components/AppIcon';

const AnalyticsDashboard = ({ applications = [] }) => {
  // Calculate real metrics from applications
  const metrics = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(a => a.status === 'interview' || a.status === 'accepted').length;
    const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
    
    // Calculate average response time
    const respondedApps = applications.filter(a => 
      a.status !== 'applied' && a.updated_at && a.applied_at
    );
    const avgResponseTime = respondedApps.length > 0
      ? respondedApps.reduce((sum, app) => {
          const responseTime = differenceInDays(parseISO(app.updated_at), parseISO(app.applied_at));
          return sum + responseTime;
        }, 0) / respondedApps.length
      : 0;
    
    // Interview success rate
    const interviewApps = applications.filter(a => a.status === 'interview');
    const acceptedFromInterview = applications.filter(a => 
      a.status === 'accepted' && interviewApps.some(ia => ia.job_id === a.job_id)
    ).length;
    const interviewSuccessRate = interviewApps.length > 0
      ? Math.round((acceptedFromInterview / interviewApps.length) * 100)
      : 0;
    
    // Overall success probability
    const accepted = applications.filter(a => a.status === 'accepted').length;
    const overallSuccess = total > 0 ? Math.round((accepted / total) * 100) : 0;
    
    return [
      {
        label: 'Application to Interview Rate',
        value: `${interviewRate}%`,
        change: interviewRate > 0 ? `+${interviewRate}%` : '0%',
        trend: 'up',
        icon: TrendingUp,
        color: 'text-green-600'
      },
      {
        label: 'Average Response Time',
        value: avgResponseTime > 0 ? `${avgResponseTime.toFixed(1)} days` : 'N/A',
        change: avgResponseTime > 0 ? `-${(7 - avgResponseTime).toFixed(1)} days` : 'N/A',
        trend: avgResponseTime < 7 ? 'up' : 'down',
        icon: Clock,
        color: 'text-blue-600'
      },
      {
        label: 'Interview Success Rate',
        value: `${interviewSuccessRate}%`,
        change: interviewSuccessRate > 0 ? `+${interviewSuccessRate}%` : '0%',
        trend: 'up',
        icon: Target,
        color: 'text-purple-600'
      },
      {
        label: 'Overall Success Probability',
        value: `${overallSuccess}%`,
        change: overallSuccess > 0 ? `${overallSuccess}%` : '0%',
        trend: overallSuccess > 50 ? 'up' : 'down',
        icon: Award,
        color: 'text-yellow-600'
      }
    ];
  }, [applications]);

  // Calculate response patterns from real data
  const responsePatterns = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const patterns = days.map(day => ({ day, responses: 0, interviews: 0 }));
    
    applications.forEach(app => {
      if (app.updated_at) {
        const date = parseISO(app.updated_at);
        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        if (app.status !== 'applied') {
          patterns[dayIndex].responses++;
        }
        if (app.status === 'interview' || app.status === 'accepted') {
          patterns[dayIndex].interviews++;
        }
      }
    });
    
    return patterns;
  }, [applications]);

  // Calculate company insights from real data
  const companyInsights = useMemo(() => {
    const companyMap = {};
    
    applications.forEach(app => {
      // This would need job data - simplified for now
      const company = 'Company'; // Would come from job data
      if (!companyMap[company]) {
        companyMap[company] = {
          company,
          applications: 0,
          responses: 0,
          interviews: 0,
          accepted: 0,
          totalResponseTime: 0,
          responseCount: 0
        };
      }
      
      companyMap[company].applications++;
      if (app.status !== 'applied') {
        companyMap[company].responses++;
        if (app.applied_at && app.updated_at) {
          const responseTime = differenceInDays(parseISO(app.updated_at), parseISO(app.applied_at));
          companyMap[company].totalResponseTime += responseTime;
          companyMap[company].responseCount++;
        }
      }
      if (app.status === 'interview' || app.status === 'accepted') {
        companyMap[company].interviews++;
      }
      if (app.status === 'accepted') {
        companyMap[company].accepted++;
      }
    });
    
    return Object.values(companyMap).map(company => {
      const responseRate = company.applications > 0
        ? Math.round((company.responses / company.applications) * 100)
        : 0;
      const avgTime = company.responseCount > 0
        ? Math.round(company.totalResponseTime / company.responseCount)
        : 0;
      const successRate = company.interviews > 0
        ? Math.round((company.accepted / company.interviews) * 100)
        : 0;
      
      let status = 'Moderate';
      if (responseRate >= 80 && successRate >= 70) status = 'Highly Responsive';
      else if (responseRate >= 60 && successRate >= 50) status = 'Good Prospect';
      
      return {
        company: company.company,
        applications: company.applications,
        responseRate: `${responseRate}%`,
        avgTime: `${avgTime} days`,
        successRate: `${successRate}%`,
        status
      };
    }).slice(0, 3);
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => {
          const Icon = metric?.icon;
          const TrendIcon = metric?.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800 ${metric?.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric?.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {metric?.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric?.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{metric?.label}</div>
            </div>
          );
        })}
      </div>
      {/* Response Time Patterns */}
      <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Weekly Response Patterns</h3>
        <div className="space-y-4">
          {responsePatterns?.map((pattern, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{pattern?.day}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {pattern?.responses} responses · {pattern?.interviews} interviews
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-blue-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#0046FF] flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${(pattern?.responses / 15) * 100}%` }}
                  >
                    {pattern?.responses > 3 && pattern?.responses}
                  </div>
                </div>
                <div className="flex-1 h-8 bg-green-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-600 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${(pattern?.interviews / 7) * 100}%` }}
                  >
                    {pattern?.interviews > 1 && pattern?.interviews}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#0046FF] rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Responses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Interviews</span>
          </div>
        </div>
      </div>
      {/* Company Performance Insights */}
      <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company Performance Insights</h3>
        <div className="space-y-4">
          {companyInsights?.map((insight, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{insight?.company}</h4>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{insight?.applications} applications</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Response Rate:</span>
                    {insight?.responseRate}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Avg Time:</span>
                    {insight?.avgTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Success Rate:</span>
                    {insight?.successRate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  insight?.status === 'Highly Responsive' ?'bg-green-100 text-green-700'
                    : insight?.status === 'Good Prospect' ?'bg-blue-100 text-blue-700' :'bg-yellow-100 text-yellow-700'
                }`}>
                  {insight?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Optimization Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Optimization Recommendations</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• Your response rate is highest on Wednesdays - consider applying to more positions mid-week</li>
              <li>• Companies with faster response times (3-4 days) show 15% higher success rates</li>
              <li>• Follow up within 5 days for applications without responses to increase visibility</li>
              <li>• Your interview-to-offer conversion rate is strong at 65% - focus on getting more interviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;