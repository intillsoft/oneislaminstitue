import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight, BookOpen, Layers, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const SkillGapBridge = () => {
    const [formData, setFormData] = useState({
        currentSkills: '',
        targetRole: ''
    });
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError } = useToast();

    const handleAnalyze = async () => {
        if (!formData.targetRole || !formData.currentSkills) {
            showError('Please enter both your current skills and target role.');
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

            // Parse JSON
            let data;
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("No JSON found");
                }
            } catch (e) {
                console.warn("Parsing failed", e);
                // Fallback
                data = {
                    matchScore: 0,
                    missingSkills: [],
                    existingStrengths: [],
                    learningPlan: "Could not generate structured plan. Please try again with more detailed inputs."
                };
            }

            setAnalysis(data);
        } catch (err) {
            console.error('Analysis error:', err);
            showError('Failed to analyze skills.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] p-6 pt-24 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 rounded-3xl bg-indigo-100 dark:bg-indigo-900/30"
                    >
                        <Layers className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Skill Gap <span className="text-indigo-600 dark:text-indigo-400">Bridge</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        Don't just see the gap—build the bridge. Identify missing links and get a concrete plan to cross them.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Pillar: Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="bg-white dark:bg-[#13182E] p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-6 h-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-sm">1</span>
                                Define the Gap
                            </h3>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Role / Goal</label>
                                    <textarea
                                        value={formData.targetRole}
                                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                        placeholder="e.g. Senior Frontend Engineer at big tech..."
                                        className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-medium transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white dark:bg-[#13182E] px-2 text-xs text-slate-400 font-bold uppercase tracking-widest">VS</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Skills / Resume</label>
                                    <textarea
                                        value={formData.currentSkills}
                                        onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                                        placeholder="Paste your current skills, experience, or resume text..."
                                        className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !formData.targetRole || !formData.currentSkills}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Constructing Bridge...
                                    </>
                                ) : (
                                    <>
                                        <Target className="w-5 h-5" /> Analyze & Bridge
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Pillar: Learning Plan (The Bridge) */}
                    <motion.div
                        className="lg:col-span-7"
                        layout
                    >
                        <AnimatePresence mode="wait">
                            {analysis ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* The Bridge Header */}
                                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div>
                                                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-1">Bridge Compatibility</p>
                                                <h2 className="text-5xl font-black tracking-tight">{analysis.matchScore}%</h2>
                                            </div>
                                            <div className="flex -space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-500 border-4 border-indigo-700 flex items-center justify-center font-bold text-xs opacity-50">YOU</div>
                                                <div className="w-12 h-12 rounded-full bg-white text-indigo-900 border-4 border-indigo-700 flex items-center justify-center font-bold z-10">
                                                    <ArrowRight className="w-6 h-6" />
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-indigo-900 border-4 border-indigo-700 flex items-center justify-center font-bold text-xs">GOAL</div>
                                            </div>
                                        </div>
                                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
                                    </div>

                                    {/* Missing Links (Planks) */}
                                    <div className="bg-white dark:bg-[#13182E] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1A2139]/50">
                                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5 text-amber-500" /> Missing Links
                                            </h3>
                                        </div>
                                        <div className="p-2">
                                            {analysis.missingSkills.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-2 h-12 rounded-full ${item.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 dark:text-white">{item.skill}</h4>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${item.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                                    }`}>
                                                                    {item.priority} Priority
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0A0E27] px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-colors">
                                                            <BookOpen className="w-4 h-4 text-indigo-500" />
                                                            {item.action}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Plan */}
                                    <div className="bg-slate-900 dark:bg-black rounded-3xl p-8 text-slate-300 shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10 space-y-4">
                                            <h3 className="text-white font-bold flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-500" /> Action Plan
                                            </h3>
                                            <p className="whitespace-pre-wrap leading-relaxed border-l-2 border-indigo-500 pl-4">
                                                {analysis.learningPlan}
                                            </p>
                                        </div>
                                    </div>

                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[500px] bg-slate-50 dark:bg-[#13182E]/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12 space-y-6"
                                >
                                    <div className="w-24 h-24 bg-white dark:bg-[#1E2640] rounded-full flex items-center justify-center shadow-sm animate-float">
                                        <Target className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <div className="max-w-xs">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bridge the Gap</h3>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Input your current skills and target role to generate a personalized bridging strategy.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default SkillGapBridge;
