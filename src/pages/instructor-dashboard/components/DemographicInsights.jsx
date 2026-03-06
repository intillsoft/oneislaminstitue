import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { applicationService } from '../../../services/applicationService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

import { EliteCard } from '../../../components/ui/EliteCard';
import Icon from '../../../components/AppIcon';

const DemographicInsights = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [insightType, setInsightType] = useState('gender');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadDemographicData();
    } else {
      setLoading(false);
    }
  }, [user, profile, insightType]);

  const loadDemographicData = async () => {
    try {
      setLoading(true);
      const applications = await applicationService.getAllForRecruiter();

      const userIds = [...new Set(applications.map(app => app.user_id).filter(Boolean))];
      let usersMap = {};

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('users')
          .select('id, gender, age, education_level, experience_years')
          .in('id', userIds);

        if (users) {
          usersMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
        }
      }

      const demographicCounts = {};
      const colors = ['var(--workflow-primary)', 'var(--workflow-accent)', '#10B981', '#F59E0B', '#64748B'];

      applications.forEach(app => {
        const user = usersMap[app.user_id] || {};
        let value;

        switch (insightType) {
          case 'gender': value = user.gender || 'Not specified'; break;
          case 'age':
            if (user.age) {
              if (user.age < 25) value = '18-24';
              else if (user.age < 35) value = '25-34';
              else if (user.age < 45) value = '35-44';
              else if (user.age < 55) value = '45-54';
              else value = '55+';
            } else value = 'Not specified';
            break;
          case 'education': value = user.education_level || 'Not specified'; break;
          case 'experience':
            if (user.experience_years !== undefined) {
              if (user.experience_years < 2) value = '0-1 yrs';
              else if (user.experience_years < 6) value = '2-5 yrs';
              else if (user.experience_years < 11) value = '6-10 yrs';
              else if (user.experience_years < 16) value = '11-15 yrs';
              else value = '16+ yrs';
            } else value = 'Not specified';
            break;
          default: value = 'Not specified';
        }

        demographicCounts[value] = (demographicCounts[value] || 0) + 1;
      });

      const total = applications.length;
      const demographicData = Object.entries(demographicCounts)
        .map(([name, count], index) => ({
          name,
          value: total > 0 ? Math.round((count / total) * 100) : 0,
          count,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setData(demographicData);
    } catch (error) {
      console.error('Error loading demographic data:', error);
      showError('Failed to load demographic data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const insightOptions = [
    { id: 'gender', label: 'Gender', icon: 'User' },
    { id: 'age', label: 'Age', icon: 'Milestone' },
    { id: 'education', label: 'Education', icon: 'Book' },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg/95 backdrop-blur-xl p-4 border border-border dark:border-white/10 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-slate-500 mb-2">{label}</p>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs font-black text-text-primary dark:text-white">{payload[0].value}%</span>
            <span className="text-[10px] font-bold text-text-muted dark:text-slate-400">({payload[0].payload.count} users)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <EliteCard className="p-8 border-white/5 animate-pulse">
        <div className="h-64 flex items-center justify-center">
          <Icon name="Activity" className="w-8 h-8 text-workflow-primary/20" />
        </div>
      </EliteCard>
    );
  }

  return (
    <EliteCard className="p-10 border-white/5 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#fff_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 mb-12">
          <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Human Capital Meta-Data</h3>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Candidate Demographics</h2>
          </div>
          <div className="flex flex-wrap p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
            {insightOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setInsightType(option.id)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center gap-2 ${insightType === option.id
                  ? 'bg-workflow-primary text-white shadow-[0_0_20px_rgba(var(--workflow-primary-rgb),0.4)]'
                  : 'text-text-muted hover:text-text-primary dark:hover:text-slate-300'
                  }`}
              >
                <Icon name={option.icon} size={14} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {data.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Demographic Synthesis</p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  hide
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={120}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B', textTransform: 'uppercase' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar
                  dataKey="value"
                  radius={[0, 12, 12, 0]}
                  barSize={32}
                  animationDuration={2000}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-workflow-primary/10 flex items-center justify-center">
              <Icon name="ShieldCheck" className="w-4 h-4 text-workflow-primary" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
              Anonymized data stream protected by <br /><span className="text-white">Workflow Encryption Standards</span>
            </p>
          </div>
          <div className="hidden sm:flex flex-wrap gap-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EliteCard>
  );
};

export default DemographicInsights;
