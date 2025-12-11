import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../contexts/AuthContext';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import CareerAdvisorChat from './components/CareerAdvisorChat';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import AILoader from '../../components/ui/AILoader';

const CareerAdvisorAI = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [marketInsights, setMarketInsights] = useState(null);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      loadInsights();
    }
  }, [user]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const [insights, skills] = await Promise.all([
        aiService.getMarketInsights().catch(() => null),
        aiService.getSkillAnalysis().catch(() => null),
      ]);
      setMarketInsights(insights);
      setSkillAnalysis(skills);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const userProfile = {
    name: user?.email?.split('@')[0] || 'User',
  };

  return (
    <>
      <Helmet>
        <title>AI Career Advisor - Workflows</title>
      </Helmet>
      
      <div className="min-h-screen bg-background dark:bg-[#0A0E27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-primary dark:text-[#E8EAED] mb-2">
              AI Career Advisor
            </h1>
            <p className="text-text-secondary dark:text-[#8B92A3]">
              Get personalized career guidance and advice from AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Information Panels */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Insights */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-[#1E2640] p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="BarChart3" size={24} className="text-workflow-primary" />
                  <h2 className="text-xl font-semibold text-text-primary dark:text-[#E8EAED]">
                    Market Insights
                  </h2>
                </div>
                {loading ? (
                  <AILoader size="small" text="Loading insights..." variant="pulse" />
                ) : marketInsights ? (
                  <div className="space-y-4">
                    {marketInsights.market_trends?.map((trend, index) => (
                      <div key={index} className="p-4 bg-surface dark:bg-[#1A2139] rounded-lg">
                        <h3 className="font-semibold text-text-primary dark:text-[#E8EAED] mb-2">
                          {trend.title}
                        </h3>
                        <p className="text-sm text-text-secondary dark:text-[#8B92A3]">
                          {trend.description || trend.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary dark:text-[#8B92A3]">
                    No market insights available at the moment.
                  </p>
                )}
              </div>

              {/* Skill Analysis */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-[#1E2640] p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Target" size={24} className="text-workflow-primary" />
                  <h2 className="text-xl font-semibold text-text-primary dark:text-[#E8EAED]">
                    Skill Analysis
                  </h2>
                </div>
                {loading ? (
                  <AILoader size="small" text="Analyzing skills..." variant="pulse" />
                ) : skillAnalysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-surface dark:bg-[#1A2139] rounded-lg">
                      <h3 className="font-semibold text-text-primary dark:text-[#E8EAED] mb-2">
                        Current Skills Coverage: {skillAnalysis.skill_coverage_percent || 0}%
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(skillAnalysis.current_skills || []).slice(0, 10).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {skillAnalysis.skill_gaps?.length > 0 && (
                      <div className="p-4 bg-surface dark:bg-[#1A2139] rounded-lg">
                        <h3 className="font-semibold text-text-primary dark:text-[#E8EAED] mb-2">
                          Recommended Skills to Learn
                        </h3>
                        <div className="space-y-2">
                          {skillAnalysis.skill_gaps.slice(0, 5).map((gap, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-text-primary dark:text-[#E8EAED]">
                                {gap.skill || gap}
                              </span>
                              {gap.importance && (
                                <span className="ml-2 text-xs text-text-secondary dark:text-[#8B92A3]">
                                  ({gap.importance} priority)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-text-secondary dark:text-[#8B92A3]">
                    No skill analysis available at the moment.
                  </p>
                )}
              </div>
            </div>

            {/* Right Side - Chatbot */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-[#1E2640] h-[600px] relative overflow-hidden">
                <CareerAdvisorChat userProfile={userProfile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerAdvisorAI;