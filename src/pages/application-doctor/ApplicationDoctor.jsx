import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, FileText, CheckCircle, AlertCircle, TrendingUp, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import { useAIValidator } from '../../hooks/useAIValidator';
import { ValidationFeedback } from '../../components/ai/ValidationFeedback';

const ApplicationDoctor = () => {
    const [activeTab, setActiveTab] = useState('input'); // 'input' or 'report'
    const [formData, setFormData] = useState({
        jobDescription: '',
        resumeText: '',
        coverLetter: ''
    });
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError, success } = useToast();
    const { validate, isValidating, validationResult, resetValidation } = useAIValidator();

    const handleAnalyze = async () => {
        if (!formData.jobDescription || !formData.resumeText) {
            showError('Please provide at least the Job Description and Resume content.');
            return;
        }

        // --- AI GUARD: Validate Input ---
        const validation = await validate('application_data',
            `Job Desc: ${formData.jobDescription.substring(0, 500)}... \nResume: ${formData.resumeText.substring(0, 500)}...`
        );

        if (!validation.isValid) {
            // If invalid but we want to show feedback, we just return here
            // The feedback component will automatically show the issues
            return;
        }
        // --------------------------------

        setIsLoading(true);
        setAnalysis(null);

        const prompt = `
      You are an expert ATS (Applicant Tracking System) and Hiring Manager simulator. 
      Analyze the following job application package and provide a detailed "Health Check" report.
      
      JOB DESCRIPTION:
      ${formData.jobDescription}

      RESUME CONTENT:
      ${formData.resumeText}

      COVER LETTER CONTENT (Optional):
      ${formData.coverLetter || "Not provided"}

      Please provide:
      1. A "Success Probability" score (0-100%).
      2. "Critical Diagnosis": 3 major red flags or missing keywords.
      3. "Prescription": 3 actionable tweaks to improve the score immediately.
      4. "Strength Assessment": What is working well.
      
      Format the output in clear Markdown using headings like ## Score, ## Diagnosis, etc.
    `;

        try {
            const result = await aiService.generateCompletion(prompt, {
                systemMessage: "You are 'Application Doctor', a critical but helpful AI career strategist.",
                temperature: 0.7
            });

            setAnalysis(result);
            setActiveTab('report');
            success('Application analysis complete!');
        } catch (err) {
            console.error('Analysis failed:', err);
            showError('Failed to analyze application. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] p-6 pt-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0, rotate: 15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="inline-flex p-5 rounded-3xl bg-white dark:bg-white/10 shadow-xl shadow-red-500/10 border border-red-100 dark:border-red-500/20 backdrop-blur-sm relative"
                    >
                        <Stethoscope className="w-16 h-16 text-red-500 dark:text-red-400" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            AI POWERED
                        </div>
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Application <span className="text-red-500">Doctor</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                            Get a critical "health check" for your job application before you hit send.
                            Identify <span className="text-red-500 font-bold">risks</span>, fix <span className="text-amber-500 font-bold">gaps</span>, and boost acceptance.
                        </p>
                    </div>
                </div>

                {/* Main Interface */}
                <div className="bg-white/80 dark:bg-[#13182E]/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/50 dark:border-slate-700/50">

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTab('input')}
                            className={`flex-1 py-5 text-sm font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'input'
                                ? 'bg-white/50 dark:bg-[#1E2640]/50 text-blue-600 dark:text-blue-400 border-b-4 border-blue-600 dark:border-blue-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A2139]'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${activeTab === 'input' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-transparent'}`}>
                                <FileText className="w-5 h-5" />
                            </div>
                            Patient Chart (Data)
                        </button>
                        <button
                            onClick={() => analysis && setActiveTab('report')}
                            disabled={!analysis}
                            className={`flex-1 py-5 text-sm font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'report'
                                ? 'bg-white/50 dark:bg-[#1E2640]/50 text-emerald-600 dark:text-emerald-400 border-b-4 border-emerald-600 dark:border-emerald-400'
                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${activeTab === 'report' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-transparent'}`}>
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            Diagnosis Report
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 lg:p-12 relative min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'input' ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >

                                    <ValidationFeedback
                                        result={validationResult}
                                        onDismiss={resetValidation}
                                        onApplyFix={(fix) => {
                                            // Simple heuristic to decide where to apply fix based on content length match or context
                                            // For now, since we validate combined, we might just alert user to manually copy
                                            // Or better, we only validate the "Resume" if that's what was flagged
                                            // Let's improve this: The Validator is generic.
                                            // Optimization: We could split validation.
                                        }}
                                    />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                        <div className="space-y-3 flex flex-col">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                    Job Description (JD)
                                                </label>
                                                <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Required</span>
                                            </div>
                                            <textarea
                                                value={formData.jobDescription}
                                                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                                placeholder="Paste the full job description here..."
                                                className="flex-1 min-h-[300px] w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F1325] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none shadow-inner transition-all"
                                            />
                                        </div>

                                        <div className="space-y-6 flex flex-col">
                                            <div className="flex-1 flex flex-col space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        Your Resume
                                                    </label>
                                                    <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Required</span>
                                                </div>
                                                <textarea
                                                    value={formData.resumeText}
                                                    onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                                                    placeholder="Paste your resume content here..."
                                                    className="flex-1 w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F1325] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none shadow-inner transition-all"
                                                />
                                            </div>

                                            <div className="h-1/3 flex flex-col space-y-3">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                    Cover Letter (Optional)
                                                </label>
                                                <textarea
                                                    value={formData.coverLetter}
                                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                                    placeholder="Paste cover letter text..."
                                                    className="flex-1 w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F1325] text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none shadow-inner transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isLoading || isValidating || !formData.jobDescription || !formData.resumeText}
                                            className="group relative px-10 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl font-bold text-white shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            <div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="relative flex items-center gap-3 text-lg">
                                                {isLoading || isValidating ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                        {isValidating ? 'Checking Quality...' : 'Running Diagnosis...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Stethoscope className="w-6 h-6" />
                                                        Run Application Health Check
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="report"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="space-y-8"
                                >
                                    {/* Prescription Header */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="p-4 bg-white dark:bg-emerald-900 rounded-2xl shadow-lg z-10">
                                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <div className="z-10">
                                            <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">Diagnosis Report Ready</h3>
                                            <p className="text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                                                We've analyzed your probability of success and identified key improvements.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
                                        <div className="bg-white dark:bg-[#1A2139] p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed whitespace-pre-line">
                                            {analysis}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => setActiveTab('input')}
                                            className="px-6 py-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors flex items-center gap-2"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                            Update Data & Re-Scan
                                        </button>
                                        <button className="px-8 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-200 text-white dark:text-slate-900 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Save Full Report
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDoctor;
