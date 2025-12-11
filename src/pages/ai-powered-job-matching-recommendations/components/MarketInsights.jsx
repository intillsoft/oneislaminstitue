import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { aiService } from '../../../services/aiService';

const MarketInsights = ({ userProfile }) => {
  const [insights, setInsights] = useState([
    {
      title: 'Salary Benchmark',
      icon: 'DollarSign',
      value: '$135k',
      subtitle: 'Market average for your role',
      trend: '+8% vs last year',
      color: 'success'
    },
    {
      title: 'Job Demand',
      icon: 'TrendingUp',
      value: 'Very High',
      subtitle: 'For senior developers',
      trend: '2,340 open positions',
      color: 'primary'
    },
    {
      title: 'Career Growth',
      icon: 'Award',
      value: '3-5 years',
      subtitle: 'Average time to next level',
      trend: 'Lead → Director',
      color: 'accent'
    },
    {
      title: 'Market Competition',
      icon: 'Users',
      value: 'Medium',
      subtitle: 'In your location',
      trend: '45 applications/job',
      color: 'warning'
    }
  ]);

  const [topCompaniesHiring, setTopCompaniesHiring] = useState([
    { name: 'Google', count: 234, logo: 'https://logo.clearbit.com/google.com', alt: 'Google company logo' },
    { name: 'Amazon', count: 189, logo: 'https://logo.clearbit.com/amazon.com', alt: 'Amazon company logo' },
    { name: 'Microsoft', count: 156, logo: 'https://logo.clearbit.com/microsoft.com', alt: 'Microsoft company logo' },
    { name: 'Meta', count: 142, logo: 'https://logo.clearbit.com/meta.com', alt: 'Meta company logo' },
    { name: 'Apple', count: 128, logo: 'https://logo.clearbit.com/apple.com', alt: 'Apple company logo' }
  ]);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketInsights();
  }, []);

  const loadMarketInsights = async () => {
    try {
      setLoading(true);
      const data = await aiService.getMarketInsights();
      
      if (data) {
        // Update insights with real AI data
        setInsights([
          {
            title: 'Salary Benchmark',
            icon: 'DollarSign',
            value: data.salary_benchmark?.value || '$135k',
            subtitle: 'Market average for your role',
            trend: data.salary_benchmark?.trend || '+8% vs last year',
            color: 'success'
          },
          {
            title: 'Job Demand',
            icon: 'TrendingUp',
            value: data.job_demand?.level || 'Very High',
            subtitle: data.job_demand?.description || 'For senior developers',
            trend: data.job_demand?.open_positions ? `${data.job_demand.open_positions} open positions` : '2,340 open positions',
            color: 'primary'
          },
          {
            title: 'Career Growth',
            icon: 'Award',
            value: data.career_growth?.timeline || '3-5 years',
            subtitle: 'Average time to next level',
            trend: data.career_growth?.path || 'Lead → Director',
            color: 'accent'
          },
          {
            title: 'Market Competition',
            icon: 'Users',
            value: data.market_competition?.level || 'Medium',
            subtitle: data.market_competition?.description || 'In your location',
            trend: data.market_competition?.applications_per_job ? `${data.market_competition.applications_per_job} applications/job` : '45 applications/job',
            color: 'warning'
          }
        ]);

        // Update companies
        if (data.top_companies && Array.isArray(data.top_companies)) {
          setTopCompaniesHiring(data.top_companies.map(company => ({
            name: company.name,
            count: company.count,
            logo: `https://logo.clearbit.com/${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
            alt: `${company.name} company logo`
          })));
        }

        // Set AI recommendation
        if (data.recommendation) {
          setAiRecommendation(data.recommendation);
        }
      }
    } catch (error) {
      console.error('Failed to load market insights:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-[#1E2640] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary dark:text-[#E8EAED] flex items-center space-x-2">
          <Icon name="BarChart3" size={24} />
          <span>Market Insights</span>
        </h2>
        <span className="text-xs text-text-secondary dark:text-[#8B92A3]">Updated daily</span>
      </div>
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {insights?.map((insight, index) => (
          <div key={index} className="p-4 bg-surface dark:bg-[#1A2139] rounded-lg border border-border dark:border-[#1E2640]">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${insight?.color}/10`}>
                <Icon name={insight?.icon} size={20} className={`text-${insight?.color}`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-secondary dark:text-[#8B92A3] mb-1">{insight?.title}</h3>
            <p className="text-2xl font-bold text-text-primary dark:text-[#E8EAED] mb-1">{insight?.value}</p>
            <p className="text-xs text-text-secondary dark:text-[#8B92A3] mb-2">{insight?.subtitle}</p>
            <div className={`text-xs font-medium text-${insight?.color}`}>{insight?.trend}</div>
          </div>
        ))}
      </div>
      {/* Top Companies Hiring */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary dark:text-[#E8EAED] mb-4">
          Top Companies Hiring for Your Skills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topCompaniesHiring?.map((company, index) => (
            <div
              key={index}
              className="p-4 bg-surface dark:bg-[#1A2139] rounded-lg border border-border dark:border-[#1E2640] hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-[#13182E] mb-3">
                  <img
                    src={company?.logo}
                    alt={company?.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-semibold text-text-primary dark:text-[#E8EAED] mb-1">{company?.name}</h4>
                <p className="text-xs text-text-secondary dark:text-[#8B92A3]">{company?.count} positions</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* AI Recommendation */}
      <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
        <div className="flex items-start space-x-3">
          <Icon name="Sparkles" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-text-primary dark:text-[#E8EAED] mb-1">AI Career Recommendation</h4>
            {loading ? (
              <p className="text-sm text-text-secondary dark:text-[#8B92A3] mb-2">Loading AI insights...</p>
            ) : (
              <>
                <p className="text-sm text-text-secondary dark:text-[#8B92A3] mb-2">
                  {aiRecommendation || 'Based on current market trends and your profile, consider focusing on cloud architecture roles. The demand has increased by 45% this quarter with salaries ranging $150k-$200k.'}
                </p>
                <button className="text-sm text-primary hover:text-primary-700 font-medium flex items-center space-x-1">
                  <span>Learn more about this career path</span>
                  <Icon name="ArrowRight" size={14} />
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
