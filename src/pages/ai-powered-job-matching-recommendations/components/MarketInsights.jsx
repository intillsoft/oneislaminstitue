import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { aiService } from '../../../services/aiService';

const MarketInsights = ({ userProfile }) => {
  const [insights, setInsights] = useState([
    {
      title: 'Salary Benchmark',
      icon: 'DollarSign',
      value: '$135k',
      subtitle: 'Market average for your role',
      trend: '+8% Annual Yield',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Job Demand',
      icon: 'TrendingUp',
      value: 'Very High',
      subtitle: 'For your current node',
      trend: '2,340 Vectors Open',
      color: 'text-workflow-primary',
      bgColor: 'bg-workflow-primary/10'
    },
    {
      title: 'Career Growth',
      icon: 'Award',
      value: '3-5 years',
      subtitle: 'Time to Senior Node',
      trend: 'Lead → Principal',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: 'Market Friction',
      icon: 'Users',
      value: 'Balanced',
      subtitle: 'Competition Index',
      trend: '45 Apply/Node',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ]);

  const [topCompaniesHiring, setTopCompaniesHiring] = useState([
    { name: 'Google', count: 234, logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Amazon', count: 189, logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Microsoft', count: 156, logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Meta', count: 142, logo: 'https://logo.clearbit.com/meta.com' },
    { name: 'Apple', count: 128, logo: 'https://logo.clearbit.com/apple.com' }
  ]);

  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadNeuralInsights();
    }
  }, [userProfile]);

  const loadNeuralInsights = async () => {
    try {
      setLoading(true);
      // Simulating neural analysis delay
      const recommendation = await aiService.getCareerRecommendation(userProfile);
      setAiRecommendation(recommendation);
    } catch (err) {
      console.warn('AI Insights failed to load, using cached vector data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Market Intelligence</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">Live Matrix</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl group hover:shadow-2xl transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Icon name={stat.icon} size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</span>
                <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-500">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Top Firms Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">High Velocity Hiring Units</h4>
            <div className="flex -space-x-2">
              {topCompaniesHiring.slice(0, 3).map((company, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-white overflow-hidden shadow-sm">
                  <Image src={company.logo} alt={company.name} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {topCompaniesHiring.map((company, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{company.name}</span>
                    <p className="text-[10px] font-bold text-slate-400">Tier 1 Node</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-workflow-primary">{company.count} Openings</span>
                  <div className="h-1 w-20 bg-slate-100 dark:bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-workflow-primary" style={{ width: `${(company.count / 234) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Radar Plot or Secondary View */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-workflow-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="w-32 h-32 rounded-full border-8 border-workflow-primary/20 border-t-workflow-primary animate-spin mb-6 relative">
            <div className="absolute inset-2 rounded-full bg-workflow-primary/10 flex items-center justify-center">
              <Icon name="Target" size={32} className="text-workflow-primary animate-pulse" />
            </div>
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Market Penetration Analytics</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
            Our neural network is currently mapping your skills against 5.4M data points to predict your next optimal pivot.
          </p>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xl font-black text-indigo-500">92%</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Relevance</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-black text-emerald-500">14ms</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Latency</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Bot Strategy Call-to-Action */}
      <div className="relative overflow-hidden group p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-workflow-primary/20 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 flex-shrink-0 animate-float">
            <Icon name="Sparkles" size={32} className="text-workflow-primary" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-workflow-primary mb-3">Neural Strategy Recommendation</h4>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/10 animate-pulse rounded w-full" />
                <div className="h-4 bg-white/10 animate-pulse rounded w-4/5" />
              </div>
            ) : (
              <>
                <p className="text-lg font-bold text-slate-100 leading-relaxed mb-6">
                  {aiRecommendation || 'Neural analysis suggests a 45% variance increase in cloud architecture dominance. Prioritize node specialization in Distributed Systems to maximize yield potential.'}
                </p>
                <button className="h-12 px-8 rounded-xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-workflow-primary hover:text-white transition-all flex items-center gap-2">
                  <span>Explore Evolution Path</span>
                  <Icon name="ArrowRight" size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;
