import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, AlertTriangle, CheckCircle, BarChart2, Lightbulb, RefreshCw } from 'lucide-react';
import { aiResumeService } from '../../../services/aiResumeService';
import Button from '../../../components/ui/Button';

const AIAssistantSidebar = ({ resumeData, onUpdate, onClose }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('score'); // score, suggestions, improvements

    useEffect(() => {
        // Auto-analyze on mount (or debounce changes in real app)
        analyzeResume();
    }, []);

    const analyzeResume = async () => {
        try {
            setAnalyzing(true);
            const result = await aiResumeService.analyze(resumeData);
            setAnalysis({
                score: result.score || calculateLocalScore(resumeData),
                breakdown: result.breakdown || {
                    contact: 10,
                    summary: 10,
                    experience: 0,
                    skills: 0,
                    education: 0
                },
                suggestions: result.suggestions || [],
                keywords: result.keywords || []
            });
        } catch (error) {
            console.error('Analysis failed:', error);
            // Fallback to local scoring if API fails
            setAnalysis({
                score: calculateLocalScore(resumeData),
                breakdown: { contact: 10, summary: 10, experience: 20, skills: 20, education: 10 },
                suggestions: [{ type: 'warning', text: 'AI service unavailable. Using local checks.' }],
                keywords: []
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const calculateLocalScore = (data) => {
        let score = 0;
        if (data.personalInfo?.email) score += 10;
        if (data.summary?.length > 30) score += 15;
        if (data.experience?.length > 0) score += 25;
        if (data.education?.length > 0) score += 10;
        if (data.skills?.length > 3) score += 15;
        return Math.min(100, score);
    };

    const improveSection = async (sectionKey) => {
        try {
            setAnalyzing(true);
            let prompt = '';
            let currentContent = '';

            if (sectionKey === 'summary') {
                prompt = "Rewrite the following professional summary to be more impactful, concise, and action-oriented. Use strong verbs. Return ONLY the new summary text.";
                currentContent = resumeData.summary || '';
            } else if (sectionKey === 'experience') {
                // Enhance first experience item for demo, or handle selection
                prompt = "Improve the bullet points for this role. Make them quantifiable and results-driven. Return ONLY the improved JSON array of strings.";
                const exp = resumeData.experience?.[0];
                if (!exp) throw new Error("No experience to improve");
                currentContent = JSON.stringify(exp.bullets || []);
            }

            if (!currentContent) {
                // Generate from scratch if empty
                prompt = `Generate a professional ${sectionKey} for a resume.`;
            }

            const result = await aiResumeService.generateContent(prompt, currentContent);

            // Update parent state
            const newData = { ...resumeData };
            if (sectionKey === 'summary') {
                newData.summary = result.text;
            } else if (sectionKey === 'experience') {
                // Update first experience item bullets
                if (newData.experience?.[0]) {
                    // Try to parse if it's JSON, else treat as text
                    try {
                        const parsed = JSON.parse(result.text);
                        if (Array.isArray(parsed)) newData.experience[0].bullets = parsed;
                    } catch (e) {
                        // Fallback: split by newlines or bullets
                        newData.experience[0].bullets = result.text.split('\n').map(l => l.replace(/^[•-]\s*/, '')).filter(Boolean);
                    }
                }
            }

            onUpdate(newData);
            analyzeResume(); // Re-analyze after change

        } catch (error) {
            console.error('Improvement failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    // Add New Section Feature
    const addAISection = async (sectionType) => {
        // Logic to generate a new section (e.g. Projects)
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-30 flex flex-col h-full overflow-hidden" // Ensure h-full and overflow handling
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
                <div className="flex items-center gap-2 text-workflow-primary">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="font-bold">AI Assistant</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-workflow-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-sm text-gray-500 animate-pulse">AI is working its magic...</p>
                    </div>
                ) : analysis ? (
                    <>
                        {/* Score Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden shadow-lg">
                            <div className="relative z-10">
                                <div className="text-5xl font-bold mb-1">{analysis.score}</div>
                                <div className="text-sm opacity-90 uppercase tracking-widest font-medium">ATS Score</div>
                            </div>
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart2 className="w-4 h-4" /> Score Breakdown
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
                                <ScoreItem label="Content" score={analysis.breakdown.experience || 0} max={25} />
                                <ScoreItem label="Keywords" score={analysis.breakdown.skills || 0} max={20} />
                                <ScoreItem label="Impact" score={analysis.breakdown.summary || 0} max={15} />
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Smart Suggestions
                            </h3>
                            {analysis.suggestions.length > 0 ? analysis.suggestions.map((item, idx) => (
                                <div key={idx} className={`p-3 rounded-lg text-xs md:text-sm flex gap-3 shadow-sm border ${item.type === 'critical' ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/20' :
                                    item.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/10 dark:text-amber-300 dark:border-amber-900/20' :
                                        'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-900/20'
                                    }`}>
                                    {item.type === 'critical' || item.type === 'warning' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> :
                                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                                    <span>{item.text}</span>
                                </div>
                            )) : (
                                <div className="text-sm text-gray-500 italic">No suggestions available. Good job!</div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Improvements</h3>
                            <Button variant="outline" className="w-full justify-start gap-2 text-sm h-auto py-2" onClick={() => improveSection('summary')}>
                                <Sparkles className="w-3 h-3 text-workflow-primary" /> Rewrite Summary
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2 text-sm h-auto py-2" onClick={() => improveSection('experience')}>
                                <Sparkles className="w-3 h-3 text-workflow-primary" /> Enhance Experience Bullets
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <Button onClick={analyzeResume} className="gap-2">
                            <BarChart2 className="w-4 h-4" /> Analyze Now
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer */}
            {!analyzing && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <Button onClick={analyzeResume} variant="ghost" className="w-full gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                        <RefreshCw className="w-4 h-4" /> Re-analyze Resume
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

const ScoreItem = ({ label, score, max }) => (
    <div className="flex items-center gap-3 text-sm">
        <span className="w-24 shrink-0 text-gray-600 dark:text-gray-400">{label}</span>
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
                className="h-full bg-workflow-primary rounded-full transition-all duration-1000"
                style={{ width: `${(score / max) * 100}%` }}
            />
        </div>
        <span className="w-8 text-right font-medium text-gray-900 dark:text-white">{Math.round((score / max) * 100)}%</span>
    </div>
);

export default AIAssistantSidebar;
