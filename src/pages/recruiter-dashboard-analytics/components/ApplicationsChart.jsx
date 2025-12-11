import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const ApplicationsChart = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [chartView, setChartView] = useState('weekly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadChartData();
    } else {
      setLoading(false);
    }
  }, [user, profile, chartView]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const applications = await applicationService.getAllForRecruiter();
      
      // Group by date
      const grouped = {};
      const now = new Date();
      
      applications.forEach(app => {
        if (!app.applied_at) return;
        
        const date = new Date(app.applied_at);
        let key;
        
        if (chartView === 'weekly') {
          // Group by day of week
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
          key = dayOfWeek;
        } else {
          // Group by week
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekNum = Math.floor((now - weekStart) / (7 * 24 * 60 * 60 * 1000));
          key = `Week ${weekNum + 1}`;
        }
        
        if (!grouped[key]) {
          grouped[key] = { applications: 0, interviews: 0 };
        }
        
        grouped[key].applications++;
        if (app.status === 'interview' || app.status === 'interview_scheduled') {
          grouped[key].interviews++;
        }
      });
      
      // Convert to array format
      const data = Object.entries(grouped).map(([name, values]) => ({
        name,
        applications: values.applications,
        interviews: values.interviews,
      }));
      
      // Sort and fill missing dates
      if (chartView === 'weekly') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const filled = days.map(day => {
          const found = data.find(d => d.name === day);
          return found || { name: day, applications: 0, interviews: 0 };
        });
        setChartData(filled);
      } else {
        setChartData(data.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
      showError('Failed to load chart data');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background dark:bg-[#13182E] p-3 border border-border dark:border-gray-700 rounded-md shadow-sm">
          <p className="text-sm font-medium text-text-primary dark:text-white mb-1">{label}</p>
          <p className="text-xs text-primary dark:text-primary-400">
            <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
            Applications: {payload[0]?.value || 0}
          </p>
          <p className="text-xs text-accent dark:text-accent-400">
            <span className="inline-block w-3 h-3 bg-accent rounded-full mr-2"></span>
            Interviews: {payload[1]?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card bg-background dark:bg-[#13182E] border border-border">
        <div className="p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-background dark:bg-[#13182E] border border-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white">Application Volume</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartView('weekly')}
              className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                chartView === 'weekly' 
                  ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView('monthly')}
              className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                chartView === 'monthly' 
                  ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-secondary dark:text-gray-400">
              <p>No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent-500)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-accent-500)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} 
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} 
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="var(--color-primary-500)" 
                  fillOpacity={1} 
                  fill="url(#colorApplications)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="var(--color-accent-500)" 
                  fillOpacity={1} 
                  fill="url(#colorInterviews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
            <span className="text-xs text-text-secondary dark:text-gray-400">Applications</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-accent rounded-full mr-2"></span>
            <span className="text-xs text-text-secondary dark:text-gray-400">Interviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsChart;
