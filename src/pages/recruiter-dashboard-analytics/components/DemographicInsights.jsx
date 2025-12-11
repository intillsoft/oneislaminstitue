import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { applicationService } from '../../../services/applicationService';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

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
      
      // Get user data for applications
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

      // Calculate demographics based on insight type
      const demographicCounts = {};
      const colors = ['#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#64748B'];
      
      applications.forEach(app => {
        const user = usersMap[app.user_id] || {};
        let value;
        
        switch (insightType) {
          case 'gender':
            value = user.gender || 'Not specified';
            break;
          case 'age':
            if (user.age) {
              if (user.age < 25) value = '18-24';
              else if (user.age < 35) value = '25-34';
              else if (user.age < 45) value = '35-44';
              else if (user.age < 55) value = '45-54';
              else value = '55+';
            } else {
              value = 'Not specified';
            }
            break;
          case 'education':
            value = user.education_level || 'Not specified';
            break;
          case 'experience':
            if (user.experience_years !== undefined) {
              if (user.experience_years < 2) value = '0-1 years';
              else if (user.experience_years < 6) value = '2-5 years';
              else if (user.experience_years < 11) value = '6-10 years';
              else if (user.experience_years < 16) value = '11-15 years';
              else value = '16+ years';
            } else {
              value = 'Not specified';
            }
            break;
          default:
            value = 'Not specified';
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
    { id: 'gender', label: 'Gender' },
    { id: 'age', label: 'Age' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background dark:bg-[#13182E] p-3 border border-border dark:border-gray-700 rounded-md shadow-sm">
          <p className="text-sm font-medium text-text-primary dark:text-white">{label}</p>
          <p className="text-xs text-text-secondary dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: payload[0].payload.color }}></span>
            {payload[0].value}% of candidates ({payload[0].payload.count} total)
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-3 sm:mb-0">Demographic Insights</h3>
          <div className="flex flex-wrap gap-2">
            {insightOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setInsightType(option.id)}
                className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                  insightType === option.id
                    ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-text-secondary dark:text-gray-400">
            <p>No demographic data available</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: 'var(--color-text-secondary)' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 text-xs text-text-secondary dark:text-gray-400 text-center">
          Based on self-reported data from job applicants
        </div>
      </div>
    </div>
  );
};

export default DemographicInsights;
