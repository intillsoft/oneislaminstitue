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
import { useAuthContext } from '../../../contexts/AuthContext';
import { apiService } from '../../../lib/api';
import AIAssistantSidebar from '../../../components/ai/AIAssistantSidebar';
import Header from '../../../components/ui/Header';
import Footer from '../../../components/ui/Footer';
import './AutopilotDashboard.css';

const AutopilotDashboard = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [settings, setSettings] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('week'); // week, month, all

    useEffect(() => {
        if (!user) {
            navigate('/job-seeker-registration-login');
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
            setRecentActivity(activityRes.data.data || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
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
            await apiService.post('/autopilot/run');
            await loadDashboardData();
        } catch (error) {
            console.error('Error running autopilot:', error);
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

    const successRate = stats?.total > 0 ? ((stats?.successful / stats?.total) * 100).toFixed(1) : 0;
    const avgMatchScore = stats?.avgMatchScore || 0;

    return (
        <>
            <Header />
            <div className="autopilot-dashboard min-h-screen bg-surface dark:bg-[#0A0E27] pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">
                                <Brain className="w-8 h-8" />
                                AI Autopilot Dashboard
                            </h1>
                            <p className="dashboard-subtitle">
                                Intelligent job application automation powered by advanced AI
                            </p>
                        </div>
                        <div className="dashboard-actions">
                            <button
                                onClick={() => setIsAIOpen(true)}
                                className="ai-assistant-button"
                            >
                                <Sparkles className="w-5 h-5" />
                                AI Assistant
                            </button>
                            <button
                                onClick={() => navigate('/autopilot/settings')}
                                className="settings-button"
                            >
                                <Settings className="w-5 h-5" />
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="control-panel">
                        <div className="control-status">
                            <div className={`status-indicator ${settings?.enabled ? 'active' : 'inactive'}`}>
                                <div className="status-dot" />
                                <span>{settings?.enabled ? 'Active' : 'Paused'}</span>
                            </div>
                            <p className="status-text">
                                {settings?.enabled
                                    ? 'Autopilot is actively searching and applying to matching jobs'
                                    : 'Autopilot is paused. Enable it to start applying automatically'}
                            </p>
                        </div>
                        <div className="control-buttons">
                            <button
                                onClick={toggleAutopilot}
                                className={`control-button ${settings?.enabled ? 'pause' : 'play'}`}
                            >
                                {settings?.enabled ? (
                                    <>
                                        <Pause className="w-5 h-5" />
                                        Pause Autopilot
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Start Autopilot
                                    </>
                                )}
                            </button>
                            <button
                                onClick={runNow}
                                className="control-button run"
                                disabled={!settings?.enabled}
                            >
                                <Zap className="w-5 h-5" />
                                Run Now
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="stat-card primary"
                        >
                            <div className="stat-icon">
                                <Target className="w-6 h-6" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Applications</p>
                                <p className="stat-value">{stats?.total || 0}</p>
                                <p className="stat-change positive">
                                    <ArrowUpRight className="w-4 h-4" />
                                    +{stats?.todayCount || 0} today
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="stat-card success"
                        >
                            <div className="stat-icon">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Success Rate</p>
                                <p className="stat-value">{successRate}%</p>
                                <p className="stat-change positive">
                                    <ArrowUpRight className="w-4 h-4" />
                                    {stats?.successful || 0} successful
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="stat-card warning"
                        >
                            <div className="stat-icon">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Avg Match Score</p>
                                <p className="stat-value">{avgMatchScore}%</p>
                                <p className="stat-change neutral">
                                    <Activity className="w-4 h-4" />
                                    AI-powered matching
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="stat-card info"
                        >
                            <div className="stat-icon">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Pending</p>
                                <p className="stat-value">{stats?.pending || 0}</p>
                                <p className="stat-change neutral">
                                    <Clock className="w-4 h-4" />
                                    In progress
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Charts Section */}
                    <div className="charts-section">
                        <div className="chart-card">
                            <h3 className="chart-title mb-4">
                                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                                Application Trends
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
                                            <Bar dataKey="successful" name="Success" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                                            <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                                        No trend data available yet
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3 className="chart-title mb-4">
                                <PieChartIcon className="w-5 h-5 flex-shrink-0" />
                                Success Distribution
                            </h3>
                            <div className="h-[250px] w-full">
                                {(stats?.successful > 0 || stats?.failed > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Successful', value: stats.successful || 0, fill: '#10b981' },
                                                    { name: 'Failed', value: stats.failed || 0, fill: '#ef4444' },
                                                    { name: 'Pending', value: stats.pending || 0, fill: '#3b82f6' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {[
                                                    { name: 'Successful', value: stats.successful || 0, fill: '#10b981' },
                                                    { name: 'Failed', value: stats.failed || 0, fill: '#ef4444' },
                                                    { name: 'Pending', value: stats.pending || 0, fill: '#3b82f6' }
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
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="activity-section">
                        <h3 className="section-title">
                            <Activity className="w-5 h-5" />
                            Recent Activity
                        </h3>
                        <div className="activity-list">
                            {recentActivity.length === 0 ? (
                                <p className="text-text-secondary text-center py-8">
                                    No recent activity. Enable autopilot to start applying!
                                </p>
                            ) : (
                                recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="activity-item"
                                    >
                                        <div className={`activity-icon ${activity.status}`}>
                                            {activity.status === 'success' ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : activity.status === 'failed' ? (
                                                <XCircle className="w-4 h-4" />
                                            ) : (
                                                <Clock className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="activity-content">
                                            <p className="activity-title">{activity.job_title}</p>
                                            <p className="activity-company">{activity.company}</p>
                                        </div>
                                        <div className="activity-meta">
                                            <span className="activity-score">{activity.match_score}% match</span>
                                            <span className="activity-time">{new Date(activity.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            <AIAssistantSidebar
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
                context={{ type: 'autopilot', stats, settings }}
                type="dashboard"
            />

            <Footer />
        </>
    );
};

export default AutopilotDashboard;
