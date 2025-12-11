import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { aiService } from '../../../services/aiService';

const SkillMapping = ({ userSkills, recommendedSkills }) => {
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSkills, setCurrentSkills] = useState(userSkills || []);
  const [recommended, setRecommended] = useState(recommendedSkills || []);

  useEffect(() => {
    loadSkillAnalysis();
  }, []);

  const loadSkillAnalysis = async () => {
    try {
      setLoading(true);
      const data = await aiService.getSkillAnalysis();
      
      if (data) {
        setSkillAnalysis(data);
        if (data.current_skills && Array.isArray(data.current_skills)) {
          setCurrentSkills(data.current_skills);
        }
        if (data.recommended_skills && Array.isArray(data.recommended_skills)) {
          // Extract skill names from recommended skills objects
          const skillNames = data.recommended_skills.map(skill => 
            typeof skill === 'string' ? skill : skill.skill
          );
          setRecommended(skillNames);
        }
      }
    } catch (error) {
      console.error('Failed to load skill analysis:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-[#1E2640] p-6">
      <h3 className="text-lg font-semibold text-text-primary dark:text-[#E8EAED] mb-4 flex items-center space-x-2">
        <Icon name="Award" size={20} />
        <span>Skill Analysis</span>
      </h3>

      {/* Current Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-3 flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>Your Skills</span>
        </h4>
        {loading ? (
          <p className="text-sm text-text-secondary dark:text-[#8B92A3]">Loading skill analysis...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentSkills?.length > 0 ? currentSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-success/10 text-success rounded-full text-xs font-medium"
              >
                {typeof skill === 'string' ? skill : skill.skill || skill}
              </span>
            )) : (
              <p className="text-sm text-text-secondary dark:text-[#8B92A3]">No skills found. Please update your resume.</p>
            )}
          </div>
        )}
      </div>

      {/* Recommended Skills to Learn */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-3 flex items-center space-x-1">
          <Icon name="Target" size={14} className="text-primary" />
          <span>Skills to Learn</span>
        </h4>
        {loading ? (
          <p className="text-sm text-text-secondary dark:text-[#8B92A3]">Loading recommendations...</p>
        ) : (
          <div className="space-y-2">
            {recommended?.length > 0 ? recommended.map((skill, index) => {
              const skillObj = skillAnalysis?.recommended_skills?.[index] || {};
              const skillName = typeof skill === 'string' ? skill : skill.skill || skill;
              const importance = skillObj.importance || 'medium';
              const reason = skillObj.reason || '';
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-surface dark:bg-[#1A2139] rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border border-border dark:border-[#1E2640]"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-text-primary dark:text-[#E8EAED]">{skillName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        importance === 'critical' ? 'bg-error/10 text-error' :
                        importance === 'high' ? 'bg-warning/10 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {importance}
                      </span>
                    </div>
                    {reason && (
                      <p className="text-xs text-text-secondary dark:text-[#8B92A3]">{reason}</p>
                    )}
                  </div>
                  <button className="text-xs text-primary hover:text-primary-700 font-medium ml-2">
                    Learn
                  </button>
                </div>
              );
            }) : (
              <p className="text-sm text-text-secondary dark:text-[#8B92A3]">No skill recommendations available.</p>
            )}
          </div>
        )}
      </div>

      {/* Skill Coverage Progress */}
      <div className="pt-4 border-t border-border dark:border-[#1E2640]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary dark:text-[#E8EAED]">Market Demand Coverage</span>
          <span className="text-sm font-semibold text-primary">78%</span>
        </div>
        <div className="w-full h-2 bg-surface dark:bg-[#1A2139] rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: '78%' }} />
        </div>
        <p className="text-xs text-text-secondary dark:text-[#8B92A3] mt-2">
          Learning recommended skills will boost your coverage to 95%
        </p>
      </div>
    </div>
  );
};
export default SkillMapping;
