import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { aiService } from '../../../services/aiService';
import { motion } from 'framer-motion';

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
          const skillNames = data.recommended_skills.map(skill =>
            typeof skill === 'string' ? skill : skill.skill
          );
          setRecommended(skillNames);
        }
      }
    } catch (error) {
      console.error('Failed to load skill analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
        <div className="p-2 rounded-lg bg-workflow-primary/10 text-workflow-primary">
          <Icon name="Award" size={20} />
        </div>
        <span>Skill Analysis</span>
      </h3>

      {/* Current Skills */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Icon name="CheckCircle" size={14} className="text-emerald-500" />
          <span>Your Skills</span>
        </h4>
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 dark:bg-white/5 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-white/5 animate-pulse rounded w-1/2" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentSkills?.length > 0 ? currentSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/10 transition-all hover:bg-emerald-500/20"
              >
                {typeof skill === 'string' ? skill : skill.skill || skill}
              </span>
            )) : (
              <p className="text-sm text-slate-500 font-medium italic">No skills cataloged. Update your architecture.</p>
            )}
          </div>
        )}
      </div>

      {/* Recommended Skills to Learn */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Icon name="Target" size={14} className="text-workflow-primary" />
          <span>Expansion Path</span>
        </h4>
        {loading ? (
          <div className="space-y-4">
            <div className="h-12 bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />
            <div className="h-12 bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {recommended?.length > 0 ? recommended.map((skill, index) => {
              const skillObj = skillAnalysis?.recommended_skills?.[index] || {};
              const skillName = typeof skill === 'string' ? skill : skill.skill || skill;
              const importance = skillObj.importance || 'medium';
              const reason = skillObj.reason || '';

              return (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-workflow-primary/30 transition-all hover:scale-[1.02]"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-slate-900 dark:text-white truncate">{skillName}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${importance === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                          importance === 'high' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-indigo-500/10 text-indigo-500'
                        }`}>
                        {importance}
                      </span>
                    </div>
                    {reason && (
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{reason}</p>
                    )}
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-tighter text-workflow-primary hover:text-workflow-accent transition-colors">
                    Enroll
                  </button>
                </div>
              );
            }) : (
              <p className="text-sm text-slate-500 font-medium italic">No expansion paths identified.</p>
            )}
          </div>
        )}
      </div>

      {/* Skill Coverage Progress */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Market Coverage</span>
          <span className="text-lg font-black text-workflow-primary">78%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '78%' }}
            className="h-full bg-gradient-to-r from-workflow-primary to-workflow-accent rounded-full"
          />
        </div>
        <p className="text-[10px] text-slate-500 font-bold mt-3 leading-relaxed">
          Mastering expansion path skills will achieve <span className="text-workflow-primary">95% Market Visibility</span>.
        </p>
      </div>
    </div>
  );
};

export default SkillMapping;
