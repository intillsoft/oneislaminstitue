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
            // Simulate API call for now or use real one
            // const result = await aiResumeService.analyze(resumeData);

            // Mock data for immediate "Premium" feel while backend connects
            setTimeout(() => {
                setAnalysis({
                    score: calculateLocalScore(resumeData),
                    breakdown: {
                        contact: 10,
                        summary: resumeData.summary?.length > 50 ? 15 : 5,
                        experience: (resumeData.experience?.length || 0) * 5,
                        skills: (resumeData.skills?.length || 0) * 2,
                        education: 10
                    },
                    suggestions: [
                        { type: 'critical', text: 'Add quantifiable results to your experience (e.g., "Increased sales by 20%")' },
                        { type: 'warning', text: 'Summary is too short. Aim for 3-4 lines.' },
                        { type: 'info', text: 'Consider adding a LinkedIn profile link.' }
                    ],
                    keywords: ['Leadership', 'Project Management', 'Communication']
                });
                setAnalyzing(false);
            }, 1500);
        } catch (error) {
            console.error('Analysis failed:', error);
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

    const improveSection = async (section) => {
        // Call AI to rewrite section
        console.log('Improving', section);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-30 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-workflow-primary">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="font-bold">AI Assistant</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-workflow-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-sm text-gray-500 animate-pulse">Analyzing your resume...</p>
                    </div>
                ) : analysis ? (
                    <>
                        {/* Score Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
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
                            <ScoreItem label="Content Impact" score={analysis.breakdown.experience} max={25} />
                            <ScoreItem label="Keywords" score={analysis.breakdown.skills} max={20} />
                            <ScoreItem label="Formatting" score={10} max={10} />
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Suggestions
                            </h3>
                            {analysis.suggestions.map((item, idx) => (
                                <div key={idx} className={`p-3 rounded-lg text-sm flex gap-3 ${item.type === 'critical' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                                        item.type === 'warning' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' :
                                            'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                    }`}>
                                    {item.type === 'critical' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> :
                                        item.type === 'warning' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> :
                                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Improvements</h3>
                            <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => improveSection('summary')}>
                                <Sparkles className="w-3 h-3 text-workflow-primary" /> Rewrite Professional Summary
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => improveSection('experience')}>
                                <Sparkles className="w-3 h-3 text-workflow-primary" /> Enhance Bullet Points
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
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <Button onClick={analyzeResume} variant="ghost" className="w-full gap-2 text-gray-500">
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
