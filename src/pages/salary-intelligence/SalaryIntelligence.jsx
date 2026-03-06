import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, MapPin, Briefcase, Award, Loader2, BarChart2, PieChart, Target, Info, Sparkles, Activity } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell
} from 'recharts';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import { EliteCard } from '../../components/ui/EliteCard';
import DojoLayout from '../../components/layout/DojoLayout';

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
    const { error: showError, success } = useToast();

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

            if (result && !result.salary_range.percentiles) {
                result.salary_range.percentiles = {
                    p25: result.salary_range.min + (result.salary_range.median - result.salary_range.min) * 0.5,
                    p75: result.salary_range.median + (result.salary_range.max - result.salary_range.median) * 0.5,
                    p90: result.salary_range.max * 0.95
                };
            }

            setPrediction(result);
            success("Intelligence report generated.");
        } catch (err) {
            showError('Failed to predict salary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getChartData = () => {
        if (!prediction) return [];
        const { min, median, max, percentiles } = prediction.salary_range;
        return [
            { name: 'Min', value: min, fill: '#312e81' },
            { name: '25th', value: percentiles.p25, fill: '#4338ca' },
            { name: 'Median', value: median, fill: '#6366f1' },
            { name: '75th', value: percentiles.p75, fill: '#818cf8' },
            { name: '90th', value: percentiles.p90, fill: '#a5b4fc' },
            { name: 'Max', value: max, fill: '#c7d2fe' },
        ];
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const sidebar = (
        <div className="space-y-6">
            <EliteCard className="p-6 bg-[#0A0E27]/80 border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-indigo-500 animate-pulse" />
                    Target Parameter
                </h3>

                <div className="space-y-5">
                    <div className="group/field">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 group-focus-within/field:text-indigo-400 transition-colors">Job Designation</label>
                        <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            placeholder="e.g. Lead System Architect"
                            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800 text-sm font-medium"
                        />
                    </div>

                    <div className="group/field">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 group-focus-within/field:text-indigo-400 transition-colors">Geographic Zone</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Zurich, Switzerland"
                            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800 text-sm font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="group/field">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 group-focus-within/field:text-indigo-400 transition-colors">Seniority</label>
                            <select
                                value={formData.experienceLevel}
                                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                className="w-full px-3 py-3 rounded-xl border border-white/5 bg-black/40 text-white focus:border-indigo-500/50 outline-none transition-all text-xs font-bold appearance-none cursor-pointer hover:bg-black/60"
                            >
                                <option>Entry Level</option>
                                <option>Mid-Level</option>
                                <option>Senior</option>
                                <option>Lead/Manager</option>
                                <option>Executive</option>
                            </select>
                        </div>

                        <div className="group/field">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 group-focus-within/field:text-indigo-400 transition-colors">Industry</label>
                            <select
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                className="w-full px-3 py-3 rounded-xl border border-white/5 bg-black/40 text-white focus:border-indigo-500/50 outline-none transition-all text-xs font-bold appearance-none cursor-pointer hover:bg-black/60"
                            >
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Healthcare</option>
                                <option>Manufacturing</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Scan Market Pulse</>}
                </button>
            </EliteCard>

            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Neural Tip</p>
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed font-medium">
                    The electric blue bars represent the core volatility zones. Aim for the "90th" percentile by mastering Niche Skills.
                </p>
            </div>
        </div>
    );

    const main = (
        <AnimatePresence mode="wait">
            {prediction ? (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 pb-12"
                >
                    {/* Main Intel Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#0A0E27] border border-white/5 p-10 shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                            <DollarSign size={200} className="text-indigo-500" />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-3 ml-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    Median Projection
                                </p>
                                <h2 className="text-7xl font-black text-white tracking-tighter">
                                    {formatCurrency(prediction.salary_range.median)}
                                </h2>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="px-6 py-2 bg-indigo-500/10 rounded-full text-indigo-400 font-black text-[10px] uppercase tracking-widest border border-indigo-500/20 shadow-inner">
                                    Mapping Fidelity: {Math.round(prediction.confidence_score)}%
                                </div>
                                <div className="px-6 py-2 bg-emerald-500/10 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                                    <TrendingUp size={12} /> Positive Trend
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-[400px] w-full mb-10 relative group">
                            <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getChartData()} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                                        contentStyle={{ backgroundColor: '#050714', borderColor: 'rgba(99, 102, 241, 0.2)', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)' }}
                                        formatter={(value) => [formatCurrency(value), '']}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                                        {getChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-500 hover:opacity-80" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Technical Breakdown */}
                        <div className="grid grid-cols-3 border-t border-white/5 divide-x divide-white/5 -mx-10 -mb-10 bg-black/40">
                            <div className="p-8 text-center hover:bg-white/5 transition-colors group">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2 group-hover:text-slate-400 transition-colors">Floor Intel</p>
                                <p className="text-2xl font-black text-slate-400">{formatCurrency(prediction.salary_range.min)}</p>
                            </div>
                            <div className="p-8 text-center bg-indigo-500/[0.02] group">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/50 mb-2 group-hover:text-indigo-400 transition-colors">Neural Sync</p>
                                <p className="text-2xl font-black text-white">{formatCurrency(prediction.salary_range.median)}</p>
                            </div>
                            <div className="p-8 text-center hover:bg-white/5 transition-colors group">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2 group-hover:text-slate-400 transition-colors">Ceiling Limit</p>
                                <p className="text-2xl font-black text-slate-400">{formatCurrency(prediction.salary_range.max)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Intel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <EliteCard className="p-8 bg-transparent border-white/5 relative overflow-hidden">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3">
                                <Target className="w-4 h-4 text-indigo-500" />
                                Strategic Offense
                            </h3>
                            <div className="space-y-5">
                                {prediction.negotiation_tips?.slice(0, 3).map((tip, idx) => (
                                    <div key={idx} className="flex gap-5 group">
                                        <span className="text-indigo-500 font-black text-xs pt-1 opacity-50">0{idx + 1}</span>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
                                            {tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </EliteCard>

                        <div className="bg-gradient-to-br from-[#0A0E27] to-[#1e1b4b] p-8 rounded-3xl border border-indigo-500/20 flex flex-col justify-center relative group overflow-hidden">
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-6 flex items-center gap-2">
                                <Activity size={14} /> Global Outlook
                            </h3>
                            <p className="text-xl font-bold text-white leading-tight mb-8">
                                {prediction.market_trends?.outlook || "The market for this role is currently stable with positive growth indicators."}
                            </p>
                            <div className="flex gap-3">
                                <div className="px-4 py-2 bg-black/40 rounded-full text-[9px] font-black text-indigo-300 uppercase tracking-widest border border-white/5">
                                    Volatility: Low
                                </div>
                                <div className="px-4 py-2 bg-black/40 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest border border-white/5">
                                    Growth: {prediction.market_trends?.yoy_growth || "+4.8%"}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-12 space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[80px]" />
                        <div className="w-24 h-24 bg-indigo-950/40 rounded-full flex items-center justify-center relative border border-indigo-500/20 animate-pulse">
                            <TrendingUp className="w-8 h-8 text-indigo-500" />
                        </div>
                    </div>
                    <div className="max-w-xs space-y-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">Engine Standby</h3>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] leading-relaxed">
                            Awaiting market parameters to initialize neural mapping
                        </p>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <DojoLayout
            title="Compensation Intel"
            subtitle="Electric market intelligence"
            headerActions={
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
                    </div>
                </div>
            }
            backPath="/career-training"
            sidebarContent={sidebar}
            mainContent={main}
        />
    );
};

export default SalaryIntelligence;
