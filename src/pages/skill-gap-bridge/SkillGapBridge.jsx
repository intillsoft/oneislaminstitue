import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight, BookOpen, Layers, CheckCircle, AlertTriangle, Loader2, Sparkles, AlertCircle, Cpu, ShieldCheck, Zap, Network } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import DojoLayout from '../../components/layout/DojoLayout';

const SkillGapBridge = () => {
    const [formData, setFormData] = useState({
        currentSkills: '',
        targetRole: ''
    });
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError, success } = useToast();

    const handleAnalyze = async () => {
        if (!formData.targetRole || !formData.currentSkills) {
            showError('Incomplete Data Packets.');
            return;
        }

        setIsLoading(true);
        setAnalysis(null);

        const prompt = `
      Perform a Skill Gap Analysis.
      
      Current Skills/Resume: ${formData.currentSkills}
      Target Role/JD: ${formData.targetRole}
      
      Output strictly a JSON object with this structure:
      {
         "matchScore": 65,
         "missingSkills": [
            { "skill": "React", "priority": "High", "action": "Build a portfolio project" },
            { "skill": "AWS", "priority": "Medium", "action": "Take a certification course" }
         ],
         "existingStrengths": ["JavaScript", "CSS"],
         "learningPlan": "Week 1-2: Focus on React hooks..."
      }
    `;

        try {
            const response = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a career development expert. Output strictly JSON.",
                temperature: 0.6
            });

            let data;
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("No JSON found");
                }
            } catch (e) {
                data = {
                    matchScore: 0,
                    missingSkills: [],
                    existingStrengths: [],
                    learningPlan: "Neural Link Error: Data Corrupted."
                };
            }

            setAnalysis(data);
            success("Matrix Synced: Path Materialized.");
        } catch (err) {
            showError('Uplink Failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const MatrixBridge = (
        <div className="h-full flex flex-col p-8 space-y-8 overflow-hidden">
            {!analysis ? (
                <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                    <Cpu className="text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Skill Gap Bridge</h2>
                            </div>

                            <div className="space-y-4 bg-[#0A0E12] p-8 border border-emerald-500/10 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Network size={80} className="text-emerald-500" />
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50 mb-3">Origin (Your Skills)</label>
                                        <textarea
                                            value={formData.currentSkills}
                                            onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                                            placeholder="Enter current tech stack..."
                                            className="w-full h-32 bg-black/50 border border-white/5 p-4 rounded-xl text-emerald-50 font-mono text-xs focus:border-emerald-500/50 outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50 mb-3">Destination (Target Role)</label>
                                        <textarea
                                            value={formData.targetRole}
                                            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                            placeholder="Enter goal position..."
                                            className="w-full h-32 bg-black/50 border border-white/5 p-4 rounded-xl text-emerald-50 font-mono text-xs focus:border-emerald-500/50 outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isLoading || !formData.targetRole || !formData.currentSkills}
                                        className="w-full py-5 bg-emerald-600 text-black font-black text-[12px] uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : <><Zap size={16} /> Materialize Path</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-8 p-8 border-l border-white/5">
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-500" /> Protocol
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">
                                    The Bridge calculates the exact requirements to transition from your current matrix state to a higher tier role.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { t: "Neural Match", v: "Cross-references 10k+ data points" },
                                    { t: "Priority Routing", v: "Identifies critical path blockers" },
                                    { t: "Sync Rate", v: "98.4% Accuracy in career mapping" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <div>
                                            <p className="text-[9px] font-black text-white uppercase tracking-widest">{item.t}</p>
                                            <p className="text-[9px] text-emerald-500/50 font-bold uppercase">{item.v}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    {/* Column 1: Origin */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-[#0A0E12] border border-white/5 rounded-[2rem] p-8 flex flex-col space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Origin Profile</h3>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase rounded-full">Steady</div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Verified Strengths</p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.existingStrengths.map((s, i) => (
                                    <div key={i} className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 text-white text-[10px] font-bold uppercase tracking-tight rounded-xl">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => setAnalysis(null)} className="w-full py-3 border border-white/10 text-slate-600 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all">Re-Calibrate</button>
                    </motion.div>

                    {/* Column 2: The Bridge */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-emerald-600 border-4 border-white rounded-[2rem] p-8 flex flex-col space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em]">The Sequence</h3>
                            <div className="px-3 py-1 bg-white text-emerald-600 text-[8px] font-black uppercase rounded-full">Gap: {100 - analysis.matchScore}%</div>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                            {analysis.missingSkills.map((item, i) => (
                                <div key={i} className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/10 group cursor-default">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-black text-sm uppercase italic">{item.skill}</h4>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded ${item.priority === 'High' ? 'bg-black text-white' : 'bg-emerald-400 text-emerald-900'}`}>{item.priority}</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-50 font-medium leading-relaxed uppercase opacity-80">{item.action}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-white/20">
                            <div className="text-[9px] font-black text-white uppercase mb-2 tracking-widest flex items-center gap-2 font-mono">
                                <Sparkles size={10} /> Syncing...
                            </div>
                            <div className="h-2 w-full bg-emerald-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysis.matchScore}%` }}
                                    className="h-full bg-white shadow-[0_0_20px_white]"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Column 3: Destination */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-[#0A0E12] border border-white/5 rounded-[2rem] p-8 flex flex-col space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Target Node</h3>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase rounded-full">Unlocked</div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div>
                                <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-4">Role Manifest</p>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{formData.targetRole}</h4>
                                <div className="text-7xl font-black text-white/10 tracking-tighter leading-none italic">{analysis.matchScore}<span className="text-xl">%</span></div>
                            </div>
                            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Neural Learning Plan</p>
                                <div className="text-[11px] text-slate-400 font-medium leading-relaxed italic prose prose-invert max-h-48 overflow-y-auto custom-scrollbar">
                                    {analysis.learningPlan}
                                </div>
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.4em] text-center italic">
                            Constructed via Matrix-01
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );

    return (
        <DojoLayout
            title="Skill Gap Bridge"
            subtitle="Matrix Mapping • 3-Column Synergy"
            headerActions={
                <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-2">
                        <Activity size={12} className="animate-pulse" />
                        Bridging Active
                    </div>
                </div>
            }
            backPath="/career-training"
        >
            {MatrixBridge}
        </DojoLayout>
    );
};

const Activity = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default SkillGapBridge;
