import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { aiService } from "../../../services/aiService";

const ExplainJobModal = ({ job, onClose, userProfile }) => {
    const [explanation, setExplanation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generateExplanation();
    }, []);

    const generateExplanation = async () => {
        try {
            setLoading(true);
            const prompt = `Act as an elite academic advisor. Analyze the match between this scholar and course.
        
Scholar Profile:
- Subjects/Skills: ${Array.isArray(userProfile?.skills) ? userProfile.skills.join(', ') : 'N/A'}
- Experience: ${userProfile?.experience?.length || 0} academic roles
- Trajectory: ${userProfile?.desiredRole || 'Scholar'}

Course Details:
- Title: ${job.title}
- Curator Team: ${job.company}
- Syllabus Snippet: ${job.description ? job.description.substring(0, 200) : 'N/A'}
- Vital Prerequisites: ${Array.isArray(job.matchedSkills) ? job.matchedSkills.join(', ') : 'N/A'}

Provide a concise, professional explanation (max 150 words) covering:
1. Why this is a strong academic match.
2. Potential knowledge gaps or things to consider.
3. A strategic tip for enrolling.
            
Format as clear text paragraphs.`;

            const result = await aiService.generateCompletion(prompt, {
                temperature: 0.7,
                max_tokens: 300,
                systemMessage: "You are an expert AI academic advisor."
            });

            setExplanation(result);
        } catch (error) {
            console.error('Explanation failed:', error);
            setExplanation("Unable to generate analysis at this moment. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-workflow-primary/10 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-workflow-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Success Path analysis</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Why this Course?</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[200px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full py-8 space-y-4">
                                <Sparkles className="w-8 h-8 text-workflow-primary animate-pulse" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Running Neural Analysis...</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {explanation}
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <div className="flex-1 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Top Match Factor</p>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {job.matchedSkills?.[0] ? `Strong alignment with ${job.matchedSkills[0]}` : 'General profile alignment'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-white/5 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                        >
                            Start Enrollment
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ExplainJobModal;
