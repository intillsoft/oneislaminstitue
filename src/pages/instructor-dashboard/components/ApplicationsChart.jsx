import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { EliteCard } from '../../../components/ui/EliteCard';
import Icon from '../../../components/AppIcon';

const ApplicationsChart = () => {
  const { user, profile, userRole } = useAuthContext();
  const { error: showError } = useToast();
  const [chartView, setChartView] = useState('weekly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthorized = userRole === 'instructor' || userRole === 'recruiter' || userRole === 'admin';
    if (user && isAuthorized) {
      loadChartData();
    } else {
      setLoading(false);
    }
  }, [user, userRole, chartView]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const applications = await applicationService.getAllForRecruiter();

      const grouped = {};
      const now = new Date();

      applications.forEach(app => {
        if (!app.applied_at) return;
        const date = new Date(app.applied_at);
        let key;

        if (chartView === 'weekly') {
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
          key = dayOfWeek;
        } else {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekNum = Math.floor((now - weekStart) / (7 * 24 * 60 * 60 * 1000));
          key = `Week ${weekNum + 1}`;
        }

        if (!grouped[key]) grouped[key] = { applications: 0, interviews: 0 };
        grouped[key].applications++;
        if (app.status === 'interview' || app.status === 'interview_scheduled') grouped[key].interviews++;
      });

      const data = Object.entries(grouped).map(([name, values]) => ({
        name,
        applications: values.applications,
        interviews: values.interviews,
      }));

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
        <div className="bg-bg/95 backdrop-blur-xl p-4 border border-border dark:border-white/10 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-slate-500 mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-workflow-primary" />
                <span className="text-xs font-black text-text-primary dark:text-white uppercase tracking-widest">Applications</span>
              </div>
              <span className="text-xs font-black text-white">{payload[0]?.value || 0}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-workflow-accent" />
                <span className="text-xs font-black text-text-primary dark:text-white uppercase tracking-widest">Interviews</span>
              </div>
              <span className="text-xs font-black text-white">{payload[1]?.value || 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <EliteCard className="p-8 border-border animate-pulse bg-surface/50">
        <div className="h-64 flex items-center justify-center">
          <Icon name="Activity" className="w-8 h-8 text-workflow-primary/20" />
        </div>
      </EliteCard>
    );
  }

  return (
    <EliteCard className="p-8 border-border overflow-hidden relative bg-surface/50">
      <div className="absolute top-0 right-0 p-8 opacity-10 text-text-muted">
        <Icon name="Activity" size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Volume Analysis</h3>
            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Application Trajectory</h2>
          </div>
          <div className="flex p-1 bg-surface-elevated rounded-xl border border-border">
            <button
              onClick={() => setChartView('weekly')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${chartView === 'weekly'
                ? 'bg-workflow-primary text-white shadow-lg'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView('monthly')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${chartView === 'monthly'
                ? 'bg-workflow-primary text-white shadow-lg'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-72">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-muted opacity-50">
              <p className="text-[10px] font-black uppercase tracking-widest">No Analytical Data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0046FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0046FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B', textTransform: 'uppercase' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#0046FF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorApps)"
                  animationDuration={2000}
                />
                <Area
                  type="monotone"
                  dataKey="interviews"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorInt)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-workflow-primary shadow-[0_0_10px_rgba(0,70,255,0.3)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Applications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-workflow-accent shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Interviews</span>
          </div>
          <div className="ml-auto">
            <span className="px-2 py-1 rounded bg-workflow-primary/10 text-[8px] font-black text-workflow-primary uppercase tracking-widest border border-workflow-primary/20">
              Live Feed
            </span>
          </div>
        </div>
      </div>
    </EliteCard>
  );
};

export default ApplicationsChart;
