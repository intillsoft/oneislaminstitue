import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from 'components/AppIcon';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

import { EliteCard } from '../../../components/ui/EliteCard';

const SourceAttribution = () => {
  const { user, profile, userRole } = useAuthContext();
  const { error: showError } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthorized = userRole === 'instructor' || userRole === 'recruiter' || userRole === 'admin';
    if (user && isAuthorized) {
      loadSourceData();
    } else {
      setLoading(false);
    }
  }, [user, userRole]);

  const loadSourceData = async () => {
    try {
      setLoading(true);
      const applications = await applicationService.getAllForRecruiter();

      const sourceCounts = {};
      applications.forEach(app => {
        const source = app.source || app.application_source || 'Direct';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const total = applications.length;
      const colors = ['var(--workflow-primary)', '#10B981', '#F59E0B', 'var(--workflow-accent)', '#64748B'];

      const sourceData = Object.entries(sourceCounts)
        .map(([name, count], index) => ({
          name,
          value: total > 0 ? Math.round((count / total) * 100) : 0,
          count,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      if (sourceData.length === 0) {
        sourceData.push({ name: 'Direct', value: 100, count: total, color: colors[0] });
      }

      setData(sourceData);
    } catch (error) {
      console.error('Error loading source data:', error);
      showError('Failed to load source data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = data.map(item => item.color);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg/95 backdrop-blur-xl p-4 border border-border dark:border-white/10 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-slate-500 mb-2">{payload[0].name}</p>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-black text-text-primary dark:text-white">{payload[0].value}%</span>
            <span className="text-[10px] font-bold text-text-muted dark:text-slate-400">({payload[0].payload.count} apps)</span>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Attribution Intel</h3>
          <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Source Distribution</h2>
        </div>
        <div className="w-10 h-10 rounded-xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/20">
          <Icon name="Target" className="w-5 h-5 text-workflow-primary" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-muted opacity-50">
          <p className="text-[10px] font-black uppercase tracking-widest">No Attribution Data</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full h-56 md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            {data.map((item, index) => (
              <div key={index} className="group cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-text-muted">{item.value}%</span>
                </div>
                <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      backgroundColor: item.color,
                      width: `${item.value}%`,
                      boxShadow: `0 0 10px ${item.color}40`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </EliteCard>
  );
};

export default SourceAttribution;
