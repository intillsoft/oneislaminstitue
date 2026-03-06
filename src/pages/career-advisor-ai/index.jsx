import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../contexts/AuthContext';
import CareerAdvisorChat from './components/CareerAdvisorChat';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import DojoLayout from '../../components/layout/DojoLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Target, Sparkles, Zap, Orbit, Compass, Stars, Ship } from 'lucide-react';

const CareerAdvisorAI = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [marketInsights, setMarketInsights] = useState(null);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const StrategyBoard = (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden gap-0">
      {/* Left: Strategy Board (8 cols) */}
      <div className="lg:col-span-8 h-full overflow-y-auto custom-scrollbar p-8 space-y-8 bg-[#050714] relative">
        {/* Celestial Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                Strategic Analysis • Node 04
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full bg-purple-500/50" />
                ))}
              </div>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
              Career <br /><span className="text-purple-600">Trajectory</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Market Intelligence */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Market Intelligence</h3>
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="h-32 bg-white/5 border border-white/5 rounded-3xl" />
                  ))}
                </div>
              ) : marketInsights?.market_trends ? (
                <div className="space-y-4">
                  {marketInsights.market_trends.map((trend, idx) => (
                    <div key={idx} className="p-6 bg-[#0A0E12] border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all cursor-default">
                      <h4 className="text-white font-black text-xs uppercase mb-3 tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                        {trend.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">
                        {trend.description || trend.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Awaiting Segment Data</p>
                </div>
              )}
            </div>

            {/* Skill Overlays */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Skill Overlays</h3>
              </div>

              {loading ? (
                <div className="h-64 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
              ) : skillAnalysis ? (
                <div className="space-y-6">
                  <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                      <Orbit size={100} className="text-white animate-spin-slow" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Current Sync Rate</p>
                      <div className="text-6xl font-black text-white tracking-tighter mb-4">{skillAnalysis.skill_coverage_percent || 0}%</div>
                      <div className="flex flex-wrap gap-1.5">
                        {(skillAnalysis.current_skills || []).slice(0, 6).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {skillAnalysis.skill_gaps?.length > 0 && (
                    <div className="p-6 bg-[#0A0E12] border border-white/5 rounded-3xl">
                      <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={12} /> Optimization Nodes
                      </p>
                      <div className="space-y-3">
                        {skillAnalysis.skill_gaps.slice(0, 4).map((gap, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black text-white uppercase">{gap.skill || gap}</span>
                            <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">{gap.importance || 'High'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Neuro-profile Incomplete</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Consultation Chat (4 cols) */}
      <div className="lg:col-span-4 h-full border-l border-white/5 relative z-20">
        <CareerAdvisorChat />
      </div>
    </div>
  );

  return (
    <DojoLayout
      title="Career Advisor AI"
      subtitle="Celestial Strategy • Neural Trajectory Mapping"
      headerActions={
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase flex items-center gap-2">
            <Stars size={12} />
            Systems Operational
          </div>
        </div>
      }
      backPath="/career-training"
    >
      <Helmet>
        <title>Career Advisor | Salary Dojo</title>
      </Helmet>
      {StrategyBoard}
    </DojoLayout>
  );
};

export default CareerAdvisorAI;