/**
 * Complete AI-Powered Autopilot Dashboard
 * Advanced analytics, controls, and insights for job applications
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Pause, Settings, TrendingUp, Target, Zap, Brain,
    CheckCircle2, XCircle, Clock, BarChart3, PieChart as PieChartIcon, Activity,
    Sparkles, ArrowUpRight, ArrowDownRight, Calendar, Filter
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import AIAssistantSidebar from '../../components/ai/AIAssistantSidebar';
import AutoApplyStages from './components/AutoApplyStages';
import AutopilotLiveLogs from './components/AutopilotLiveLogs';
import { EliteCard, ElitePageHeader, EliteStatCard } from '../../components/ui/EliteCard';
import './AutopilotDashboard.css';

const AutopilotDashboard = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [settings, setSettings] = useState({});
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('week'); // week, month, all
    const [processStatus, setProcessStatus] = useState('idle'); // idle, running, completed
    const [currentStage, setCurrentStage] = useState(0);
    const [liveLogs, setLiveLogs] = useState([]);

    // Modal state
    const [selectedApply, setSelectedApply] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadDashboardData();
    }, [user, timeRange]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, settingsRes, activityRes] = await Promise.all([
                apiService.get('/autopilot/stats', { params: { timeRange } }),
                apiService.get('/autopilot/settings'),
                apiService.get('/autopilot/logs', { params: { limit: 10 } }),
            ]);

            setStats(statsRes.data.data || {});
            setSettings(settingsRes.data.data || {});
            setRecentActivity(activityRes.data.data?.logs || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmManualApply = async () => {
        if (!selectedApply) return;

        try {
            setIsApplying(true);
            // Record confirmation in backend
            await apiService.post(`/autopilot/logs/${selectedApply.id}/confirm`);

            // Open window
            window.open(selectedApply.jobs?.url || selectedApply.jobs?.application_url, '_blank');

            // Reload stats and activity
            await loadDashboardData();
            setSelectedApply(null);
        } catch (error) {
            console.error('Error confirming manual apply:', error);
        } finally {
            setIsApplying(false);
        }
    };

    const toggleAutopilot = async () => {
        try {
            await apiService.post('/autopilot/settings', {
                ...settings,
                enabled: !settings?.enabled,
            });
            await loadDashboardData();
        } catch (error) {
            console.error('Error toggling autopilot:', error);
        }
    };

    const runNow = async () => {
        try {
            setProcessStatus('running');
            setLiveLogs([
                { id: 1, timestamp: new Date(), type: 'info', caller: 'SYSTEM', message: 'Initializing autopilot process...' },
                { id: 2, timestamp: new Date(), type: 'info', caller: 'SEARCH', message: 'Scanning job boards for matches...' }
            ]);
            setCurrentStage(0);

            // Mocking stage progression for UI feedback
            setTimeout(() => {
                setCurrentStage(1);
                setLiveLogs(prev => [...prev, { id: 3, timestamp: new Date(), type: 'info', caller: 'AI_MATCH', message: 'Analyzing job-profile compatibility...' }]);
            }, 2000);

            setTimeout(() => {
                setCurrentStage(2);
                setLiveLogs(prev => [...prev, { id: 4, timestamp: new Date(), type: 'success', caller: 'APPLY', message: 'Submitting matches through AI Optimizer...' }]);
            }, 5000);

            const response = await apiService.autopilot.process();

            setProcessStatus('completed');
            setCurrentStage(3);
            setLiveLogs(prev => [...prev, { id: 5, timestamp: new Date(), type: 'success', caller: 'SYSTEM', message: 'Process completed successfully.' }]);

            await loadDashboardData();
        } catch (error) {
            console.error('Error running autopilot:', error);
            setProcessStatus('idle');
            setLiveLogs(prev => [...prev, { id: 6, timestamp: new Date(), type: 'error', caller: 'SYSTEM', message: `Execution failed: ${error.message}` }]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface dark:bg-[#0A0E27] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const successRate = stats?.total > 0 ? (((stats?.internalApplied || 0) + (stats?.externalApplied || 0)) / stats?.total * 100).toFixed(1) : 0;
    const avgMatchScore = stats?.avgMatchScore || 0;

    return (
        <div className="min-h-screen bg-private pb-12">
            <div className="max-w-[1600px] mx-auto transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <ElitePageHeader
                        title="Neural Autopilot"
                        description="Intelligent job application automation powered by advanced AI"
                        badge="Autonomous"
                    >
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={() => setIsAIOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest border border-white/5"
                            >
                                <Sparkles size={16} />
                                <span>AI Assistant</span>
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/autopilot/settings')}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest border border-white/5"
                            >
                                <Settings size={16} />
                                <span>Settings</span>
                            </button>
                        </div>
                    </ElitePageHeader>

                    {/* Control Panel */}
                    <div className="bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${settings?.enabled ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-slate-500/20 text-slate-400'}`}>
                                {settings?.enabled ? <Activity size={32} className="animate-pulse" /> : <Pause size={32} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${settings?.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        System {settings?.enabled ? 'Active' : 'Standby'}
                                    </span>
                                </div>
                                <p className="text-slate-200 font-bold">
                                    {settings?.enabled
                                        ? 'Neural engines actively scanning & matching'
                                        : 'Manual override engaged. Autopilot paused.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleAutopilot}
                                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${settings?.enabled ? 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10' : 'bg-workflow-primary text-white shadow-xl shadow-workflow-primary/20 hover:brightness-110'}`}
                            >
                                {settings?.enabled ? <Pause size={16} /> : <Play size={16} />}
                                {settings?.enabled ? 'Deactivate' : 'Activate Portal'}
                            </button>
                            <button
                                onClick={runNow}
                                disabled={!settings?.enabled}
                                className="px-8 py-4 rounded-2xl bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Zap size={16} className="text-workflow-primary" />
                                Sequence Now
                            </button>
                        </div>
                    </div>

                    {/* Automation Progress Section */}
                    {settings?.enabled && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-workflow-primary" />
                                Automation Pulse
                            </h3>
                            <AutoApplyStages status={processStatus} currentStage={currentStage} />

                            {processStatus !== 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mb-8"
                                >
                                    <AutopilotLiveLogs logs={liveLogs} />
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <EliteStatCard
                            title="Neural Auto-Applied"
                            value={stats?.internalApplied || '0'}
                            icon={Zap}
                            trend={{ value: `${stats?.todayCount || 0} total`, isPositive: true }}
                            variant="success"
                        />
                        <EliteStatCard
                            title="Strategic Manual-Applied"
                            value={stats?.externalApplied || '0'}
                            icon={CheckCircle2}
                            trend={{ value: `${stats?.pendingMatches || 0} matches`, isPositive: true }}
                            variant="warning"
                        />
                        <EliteStatCard
                            title="Neural Match Avg"
                            value={`${avgMatchScore}%`}
                            icon={Brain}
                            trend={{ value: 'AI Optimized', isPositive: true }}
                            variant="primary"
                        />
                        <EliteStatCard
                            title="Pending Delta"
                            value={stats?.pending || '0'}
                            icon={Clock}
                            trend={{ value: 'Real-time', isPositive: true }}
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <EliteCard variant="glass" className="p-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-workflow-primary" />
                                Growth Trajectory
                            </h3>
                            <div className="h-[250px] w-full">
                                {stats?.trends && stats.trends.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.trends}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            />
                                            <Bar dataKey="internal" name="Neural Auto" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                                            <Bar dataKey="external" name="Strategic Manual" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                                            <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                                        No trend data available yet
                                    </div>
                                )}
                            </div>
                        </EliteCard>

                        <EliteCard variant="glass" className="p-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                                <PieChartIcon className="w-4 h-4 text-workflow-primary" />
                                Distribution Matrix
                            </h3>
                            <div className="h-[250px] w-full">
                                {(stats?.internalApplied > 0 || stats?.externalApplied > 0 || stats?.failed > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Neural Auto', value: stats.internalApplied || 0, fill: '#10b981' },
                                                    { name: 'Strategic Manual', value: stats.externalApplied || 0, fill: '#f59e0b' },
                                                    { name: 'Failed', value: stats.failed || 0, fill: '#ef4444' },
                                                    { name: 'Match Pending', value: stats.pendingMatches || 0, fill: '#3b82f6' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {[
                                                    { name: 'Neural Auto', value: stats.internalApplied || 0, fill: '#10b981' },
                                                    { name: 'Strategic Manual', value: stats.externalApplied || 0, fill: '#f59e0b' },
                                                    { name: 'Failed', value: stats.failed || 0, fill: '#ef4444' },
                                                    { name: 'Match Pending', value: stats.pendingMatches || 0, fill: '#3b82f6' }
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                                        No data available
                                    </div>
                                )}
                            </div>
                        </EliteCard>
                    </div>

                    {/* Recent Activity Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Strategic Opportunities (Manual Apply) */}
                        <EliteCard variant="glass" className="lg:col-span-1 p-0 overflow-hidden border-amber-500/20 shadow-[0_10px_40px_rgba(245,158,11,0.05)]">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-amber-500/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 flex items-center gap-3">
                                    <Sparkles className="w-4 h-4" />
                                    Strategic Opps
                                </h3>
                                <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase">
                                    Action Required
                                </div>
                            </div>
                            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {recentActivity.filter(a => a.status === 'manual_apply').length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                        <Target className="w-8 h-8 text-slate-700 mb-3 opacity-20" />
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            No pending matches
                                        </p>
                                    </div>
                                ) : (
                                    recentActivity.filter(a => a.status === 'manual_apply').map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-5 hover:bg-white/[0.02] transition-colors relative group"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 pr-4">
                                                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                                                        {activity.job_title || activity.jobs?.title}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider line-clamp-1">
                                                        {activity.company || activity.jobs?.company}
                                                    </p>
                                                </div>
                                                <div className="px-2 py-1 bg-amber-500/10 rounded-lg text-amber-500 text-[10px] font-black">
                                                    {activity.match_score || activity.matchScore}%
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] text-slate-600 font-bold uppercase italic">
                                                    {activity.platform || activity.jobs?.source || 'external'}
                                                </span>
                                                <button
                                                    onClick={() => setSelectedApply(activity)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                                                >
                                                    Apply Now
                                                    <ArrowUpRight size={10} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </EliteCard>

                        {/* Transmission Protocol (Auto-applied) */}
                        <EliteCard variant="glass" className="lg:col-span-2 p-0 overflow-hidden border-indigo-500/20">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-indigo-500" />
                                    Transmission Protocol
                                </h3>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[8px] font-black text-slate-600 uppercase">Neural Auto</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <span className="text-[8px] font-black text-slate-600 uppercase">Strategic Manual</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span className="text-[8px] font-black text-slate-600 uppercase">Blocked</span>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {recentActivity.filter(a => a.status !== 'manual_apply').length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <Zap className="w-12 h-12 text-slate-800 mb-4 opacity-10" />
                                        <p className="text-slate-500 font-medium">Listening for portal activity...</p>
                                    </div>
                                ) : (
                                    recentActivity.filter(a => a.status !== 'manual_apply').map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 flex items-center gap-6 hover:bg-white/[0.01] transition-colors"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                                activity.status === 'manual_applied' ? 'bg-amber-500/10 text-amber-500' :
                                                    activity.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-slate-500/10 text-slate-500'
                                                }`}>
                                                {activity.status === 'success' ? <CheckCircle2 size={18} /> :
                                                    activity.status === 'manual_applied' ? <ArrowUpRight size={18} /> :
                                                        activity.status === 'failed' ? <XCircle size={18} /> :
                                                            <Clock size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-white mb-0.5">{activity.job_title || activity.jobs?.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{activity.company || activity.jobs?.company}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <div className="text-[11px] font-black text-white mb-0.5">{activity.match_score || activity.matchScore}% Quality</div>
                                                <div className="text-[9px] text-slate-600 font-bold uppercase mb-1">{new Date(activity.applied_at || activity.created_at).toLocaleDateString()}</div>

                                                {(activity.status === 'failed' || activity.status === 'skipped' || activity.status === 'processing') && (
                                                    <button
                                                        onClick={() => setSelectedApply(activity)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border border-white/10"
                                                    >
                                                        {activity.status === 'processing' ? 'Override' : 'Manual Apply'}
                                                        <ArrowUpRight size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </EliteCard>
                    </div>
                </div>
            </div>

            {/* Manual Apply Confirmation Modal */}
            {selectedApply && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-[#0A0E27]/90 backdrop-blur-xl"
                        onClick={() => !isApplying && setSelectedApply(null)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-md bg-[#13182E] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background atoms */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-workflow-primary/10 rounded-full blur-3xl" />

                        <div className="relative text-center">
                            <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-500/10">
                                <Sparkles className="w-10 h-10 text-amber-500" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Manual Action Required</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                This elite match at <span className="text-white font-bold">{selectedApply.jobs?.company}</span> requires a direct application through their strategic portal.
                                <br /><br />
                                <span className="text-amber-500 font-black uppercase text-[10px] tracking-widest">Neural Match Score: {selectedApply.match_score}%</span>
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={handleConfirmManualApply}
                                    disabled={isApplying}
                                    className="w-full py-5 bg-amber-500 text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isApplying ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Confirm & Open Portal
                                            <ArrowUpRight size={18} />
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={async () => {
                                        try {
                                            setIsApplying(true);
                                            await apiService.post(`/autopilot/logs/${selectedApply.id}/retry`);
                                            await loadDashboardData();
                                            setSelectedApply(null);
                                        } catch (e) {
                                            console.error(e);
                                        } finally {
                                            setIsApplying(false);
                                        }
                                    }}
                                    disabled={isApplying}
                                    className="w-full py-5 bg-indigo-500/20 text-indigo-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-500/30 hover:text-indigo-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Zap size={16} />
                                    Retry with AI Agent
                                </button>

                                <button
                                    onClick={() => setSelectedApply(null)}
                                    disabled={isApplying}
                                    className="w-full py-5 bg-white/5 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:text-white transition-all disabled:opacity-50"
                                >
                                    Abort Sequence
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* AI Assistant Sidebar */}
            <AIAssistantSidebar
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
                context={{ type: 'autopilot', stats, settings }}
                type="dashboard"
            />
        </div >
    );
};

export default AutopilotDashboard;
