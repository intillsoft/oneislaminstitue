import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, MapPin, Briefcase, Award, Loader2, BarChart2, PieChart } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell
} from 'recharts';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const SalaryIntelligence = () => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        location: '',
        experienceLevel: 'Mid-Level',
        industry: 'Technology',
        skills: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError } = useToast();

    const handlePredict = async () => {
        if (!formData.jobTitle || !formData.location) {
            showError('Please fill in Job Title and Location');
            return;
        }

        setIsLoading(true);
        setPrediction(null);

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

            const result = await aiService.predictSalary(
                formData.jobTitle,
                formData.location,
                formData.experienceLevel,
                formData.industry,
                skillsArray
            );

            // Sanitize and format data for chart if needed
            // Ensure result.salary_range.percentiles exists
            if (result && !result.salary_range.percentiles) {
                // Fallback if API response structure varies
                result.salary_range.percentiles = {
                    p25: result.salary_range.min + (result.salary_range.median - result.salary_range.min) * 0.5,
                    p75: result.salary_range.median + (result.salary_range.max - result.salary_range.median) * 0.5,
                    p90: result.salary_range.max * 0.95
                };
            }

            setPrediction(result);
        } catch (err) {
            console.error('Salary prediction error:', err);
            showError('Failed to predict salary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Chart Data Preparation
    const getChartData = () => {
        if (!prediction) return [];
        const { min, median, max, percentiles } = prediction.salary_range;
        return [
            { name: 'Min', value: min, fill: '#94a3b8' },
            { name: '25th', value: percentiles.p25, fill: '#60a5fa' },
            { name: 'Median', value: median, fill: '#2563eb' },
            { name: '75th', value: percentiles.p75, fill: '#60a5fa' },
            { name: '90th', value: percentiles.p90, fill: '#3b82f6' },
            { name: 'Max', value: max, fill: '#94a3b8' },
        ];
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 mb-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl shadow-green-500/30 mb-4"
                >
                    <DollarSign className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    Salary <span className="text-emerald-500">Intelligence</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    Unlock your earning potential with AI-powered compensation analysis.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 dark:bg-[#13182E]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-white/5 space-y-6"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-500" /> Career Profile
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g. Senior Product Designer"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. San Francisco, CA"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Experience</label>
                                <select
                                    value={formData.experienceLevel}
                                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                >
                                    <option>Entry Level</option>
                                    <option>Mid-Level</option>
                                    <option>Senior</option>
                                    <option>Lead/Manager</option>
                                    <option>Executive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Skills (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    placeholder="React, Node.js..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handlePredict}
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-emerald-500/25"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Analysis"}
                        </button>
                    </motion.div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {prediction ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Main Salary Card */}
                                <div className="bg-white dark:bg-[#13182E] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <div className="p-8 pb-0">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                                                    {formatCurrency(prediction.salary_range.median)}
                                                </h2>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium">Estimated Median Base Salary</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" /> High Demand
                                                </div>
                                                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-700 dark:text-blue-300 font-bold text-sm">
                                                    {Math.round(prediction.confidence_score)}% Confidence
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chart */}
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(Val) => `$${Val / 1000}k`} />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                                                        formatter={(value) => [formatCurrency(value), 'Salary']}
                                                    />
                                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                        {getChartData().map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-[#0A0E27]/30">
                                        <div className="p-6 text-center">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bottom 10%</p>
                                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatCurrency(prediction.salary_range.min)}</p>
                                        </div>
                                        <div className="p-6 text-center">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Median</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(prediction.salary_range.median)}</p>
                                        </div>
                                        <div className="p-6 text-center">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Top 10%</p>
                                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatCurrency(prediction.salary_range.max)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Negotiation Tips */}
                                {prediction.negotiation_tips && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-[#13182E] p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                <Award className="w-5 h-5 text-purple-500" /> Negotiation Strategy
                                            </h3>
                                            <ul className="space-y-3">
                                                {prediction.negotiation_tips.slice(0, 4).map((tip, idx) => (
                                                    <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                                            <h3 className="font-bold text-white mb-2 text-lg">Market Insight</h3>
                                            <p className="text-indigo-100 leading-relaxed mb-6">
                                                {prediction.market_trends?.outlook || "The market for this role is currently stable with positive growth indicators."}
                                            </p>
                                            <div className="flex gap-3">
                                                <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                                                    YoY Growth: {prediction.market_trends?.yoy_growth || "+5%"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[500px] flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-[#0A0E27]/30"
                            >
                                <div className="w-24 h-24 bg-white dark:bg-[#13182E] rounded-full shadow-xl flex items-center justify-center mb-6">
                                    <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Analyze</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                                    Enter your job details to unlock comprehensive salary data, market trends, and negotiation power.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SalaryIntelligence;
