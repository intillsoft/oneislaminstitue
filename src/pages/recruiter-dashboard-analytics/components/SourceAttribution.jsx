import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from 'components/AppIcon';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const SourceAttribution = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadSourceData();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const loadSourceData = async () => {
    try {
      setLoading(true);
      const applications = await applicationService.getAllForRecruiter();
      
      // Group by source (if available) or default to "Direct"
      const sourceCounts = {};
      applications.forEach(app => {
        const source = app.source || app.application_source || 'Direct';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const total = applications.length;
      const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#64748B'];
      
      const sourceData = Object.entries(sourceCounts)
        .map(([name, count], index) => ({
          name,
          value: total > 0 ? Math.round((count / total) * 100) : 0,
          count,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // If no data, show default
      if (sourceData.length === 0) {
        sourceData.push({
          name: 'Direct',
          value: 100,
          count: total,
          color: colors[0]
        });
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
        <div className="bg-background dark:bg-[#13182E] p-3 border border-border dark:border-gray-700 rounded-md shadow-sm">
          <p className="text-sm font-medium text-text-primary dark:text-white">{payload[0].name}</p>
          <p className="text-xs text-text-secondary dark:text-gray-400">
            {payload[0].value}% of applications ({payload[0].payload.count} total)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-xs text-text-secondary dark:text-gray-400">
              {entry.value}: {entry.payload.value}%
            </span>
          </li>
        ))}
      </ul>
    );
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white">Application Sources</h3>
          <button className="text-text-secondary hover:text-text-primary dark:hover:text-white transition-smooth">
            <Icon name="MoreHorizontal" size={20} />
          </button>
        </div>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-text-secondary dark:text-gray-400">
            <p>No source data available</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceAttribution;
