import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot, Target, Brain, Sparkles, Sliders, Search, Zap,
    ChevronRight, Plus, CheckCircle, Pause, Play,
    Edit3, Trash2, FileText, Mail, TrendingUp, Users,
    Send, ArrowLeft, Settings, Activity, Shield, Terminal,
    MessageSquare, Cpu, Globe, Database, Command, Fingerprint,
    X, MoreVertical, RefreshCw, BarChart3, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import { EliteCard, ElitePageHeader, EliteStatCard } from '../../components/ui/EliteCard';

const AIAgentBuilder = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const [agents, setAgents] = useState([]);
    const [activeView, setActiveView] = useState('list'); // 'list', 'create', 'edit'
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Agent Config Blueprint
    const initialConfig = {
        name: '',
        description: '',
        goal: 'find_jobs',
        status: 'active',
        schedule: { enabled: true, frequency: 'daily' },
        job_criteria: { keywords: [], locations: [], experience: 'mid' },
        actions: { auto_apply: false, email_notif: true }
    };

    const [agentConfig, setAgentConfig] = useState(initialConfig);

    useEffect(() => {
        if (user) loadAgents();
    }, [user]);

    const loadAgents = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/ai-agents');
            setAgents(response.data?.data || []);
        } catch (error) {
            console.error('Error loading agents:', error);
            setAgents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgent = async (e) => {
        if (e) e.preventDefault();
        try {
            setIsSubmitting(true);
            await apiService.post('/ai-agents', agentConfig);
            success('Neural agent deployed successfully.');
            setActiveView('list');
            loadAgents();
            setAgentConfig(initialConfig);
        } catch (err) {
            showError('Deployment failure. Recalibrate and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateAgent = async (e) => {
        if (e) e.preventDefault();
        try {
            setIsSubmitting(true);
            await apiService.put(`/ai-agents/${selectedAgent.id}`, agentConfig);
            success('Intelligence configuration updated.');
            setActiveView('list');
            loadAgents();
        } catch (err) {
            showError('Sync failure. Configuration not saved.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAgent = async (id) => {
        if (!window.confirm('Are you sure you want to terminate this agent? This action is irreversible.')) return;
        try {
            await apiService.delete(`/ai-agents/${id}`);
            success('Agent decommissioned.');
            loadAgents();
        } catch (err) {
            showError('Error decommissioning agent.');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await apiService.put(`/ai-agents/${id}/toggle`);
            success('Agent status synchronized.');
            loadAgents();
        } catch (err) {
            showError('Neuro-link failed. Status unchanged.');
        }
    };

    const handleRunAgent = async (id) => {
        try {
            success('Initializing manual execution sequence...');
            await apiService.post(`/ai-agents/${id}/run`);
            success('Agent execution completed successfully.');
            loadAgents();
        } catch (err) {
            showError('Execution failed. Link timeout.');
        }
    };

    const startEdit = (agent) => {
        setSelectedAgent(agent);
        setAgentConfig({
            name: agent.name,
            description: agent.description,
            goal: agent.goal || 'find_jobs',
            status: agent.status,
            schedule: agent.schedule || { enabled: true, frequency: 'daily' },
            job_criteria: agent.job_criteria || { keywords: [], locations: [], experience: 'mid' },
            actions: agent.actions || { auto_apply: false, email_notif: true }
        });
        setActiveView('edit');
    };

    return (
        <div className="min-h-screen bg-[#0F172A] pb-24 font-sans text-slate-200">
            {/* --- Elite Header --- */}
            <div className="max-w-7xl mx-auto px-6 pt-24">
                <AnimatePresence mode="wait">
                    {activeView === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-workflow-primary/20 flex items-center justify-center">
                                            <Bot className="text-workflow-primary" size={24} />
                                        </div>
                                        <h1 className="text-4xl font-black tracking-tight text-white uppercase">AI Agents</h1>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Neural Career Automation & Intelligence Hub</p>
                                </div>
                                <button
                                    onClick={() => { setAgentConfig(initialConfig); setActiveView('create'); }}
                                    className="flex items-center gap-3 px-8 py-4 bg-workflow-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-2xl shadow-workflow-primary/30 group"
                                >
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                    New Intel Agent
                                </button>
                            </div>

                            {/* --- Stats Grid --- */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                                <EliteStatCard
                                    title="Active Agents"
                                    value={agents.filter(a => a.status === 'active').length}
                                    trend="Syncing"
                                    icon={Bot}
                                    color="#3B82F6"
                                />
                                <EliteStatCard
                                    title="Total Runs"
                                    value={agents.reduce((acc, curr) => acc + (curr.runs_count || 0), 0)}
                                    trend="Live"
                                    icon={Zap}
                                    color="#F59E0B"
                                />
                                <EliteStatCard
                                    title="Insights Found"
                                    value="482"
                                    trend="+24%"
                                    icon={Brain}
                                    color="#8B5CF6"
                                />
                                <EliteStatCard
                                    title="Success Rate"
                                    value="99.4"
                                    unit="%"
                                    trend="Elite"
                                    icon={CheckCircle}
                                    color="#10B981"
                                />
                            </div>

                            {/* --- Agent Grid --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-72 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
                                    ))
                                ) : agents.length === 0 ? (
                                    <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                                        <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto mb-8 border border-white/5">
                                            <Bot size={48} className="text-slate-700" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">No Intelligence Agents Found</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 text-sm">Deploy your first AI agent to start automonous market research and job hunting.</p>
                                        <button
                                            onClick={() => setActiveView('create')}
                                            className="px-8 py-3 border border-workflow-primary/30 text-workflow-primary rounded-xl font-black uppercase tracking-widest hover:bg-workflow-primary/10 transition-all"
                                        >
                                            Initialize Deployment
                                        </button>
                                    </div>
                                ) : (
                                    agents.map(agent => (
                                        <AgentCard
                                            key={agent.id}
                                            agent={agent}
                                            onEdit={() => startEdit(agent)}
                                            onDelete={() => handleDeleteAgent(agent.id)}
                                            onToggle={() => handleToggleStatus(agent.id)}
                                            onRun={() => handleRunAgent(agent.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        /* --- CREATE / EDIT VIEW --- */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="mb-12 flex items-center justify-between">
                                <div>
                                    <button
                                        onClick={() => setActiveView('list')}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-workflow-primary flex items-center gap-2 mb-4 group transition-colors"
                                    >
                                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        Back to Control Panel
                                    </button>
                                    <h1 className="text-4xl font-black tracking-tight text-white uppercase">
                                        {activeView === 'create' ? 'Deploy New Agent' : 'Recalibrate Intelligence'}
                                    </h1>
                                </div>
                            </div>

                            <form onSubmit={activeView === 'create' ? handleCreateAgent : handleUpdateAgent} className="space-y-8">
                                <EliteCard title="Primary Identity" icon={Fingerprint}>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Agent Designation</label>
                                            <input
                                                type="text"
                                                required
                                                value={agentConfig.name}
                                                onChange={(e) => setAgentConfig({ ...agentConfig, name: e.target.value })}
                                                placeholder="e.g. Senior Software Architect Envoy"
                                                className="w-full px-5 py-4 rounded-xl bg-white/[0.04] border border-white/5 focus:ring-4 focus:ring-workflow-primary/10 focus:border-workflow-primary/40 outline-none transition-all text-white font-bold"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Brief</label>
                                            <textarea
                                                required
                                                value={agentConfig.description}
                                                onChange={(e) => setAgentConfig({ ...agentConfig, description: e.target.value })}
                                                placeholder="Describe the agent's core mission and protocols..."
                                                className="w-full px-5 py-4 rounded-xl bg-white/[0.04] border border-white/5 focus:ring-4 focus:ring-workflow-primary/10 focus:border-workflow-primary/40 outline-none transition-all h-32 text-white font-medium italic"
                                            />
                                        </div>
                                    </div>
                                </EliteCard>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <EliteCard title="Strategic Objective" icon={Target}>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'find_jobs', label: 'Job Acquisition', desc: 'Find and analyze target opportunities.' },
                                                { id: 'leads', label: 'Lead Generation', desc: 'Identify high-value business leads.' },
                                                { id: 'research', label: 'Market Intel', desc: 'Monitor industry trends and shifts.' }
                                            ].map(goal => (
                                                <div
                                                    key={goal.id}
                                                    onClick={() => setAgentConfig({ ...agentConfig, goal: goal.id })}
                                                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${agentConfig.goal === goal.id ? 'bg-workflow-primary/10 border-workflow-primary/40' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[11px] font-black uppercase tracking-tight text-white">{goal.label}</span>
                                                        {agentConfig.goal === goal.id && <CheckCircle size={14} className="text-workflow-primary" />}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{goal.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </EliteCard>

                                    <EliteCard title="Sync Frequency" icon={RefreshCw}>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'realtime', label: 'Real-Time Sync', desc: 'Continuous monitoring & alerts.' },
                                                { id: 'daily', label: 'Daily Intelligence', desc: 'Standard 24h summary cycle.' },
                                                { id: 'weekly', label: 'Weekly Overview', desc: 'Aggregated strategic insights.' }
                                            ].map(freq => (
                                                <div
                                                    key={freq.id}
                                                    onClick={() => setAgentConfig({ ...agentConfig, schedule: { ...agentConfig.schedule, frequency: freq.id } })}
                                                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${agentConfig.schedule.frequency === freq.id ? 'bg-workflow-primary/10 border-workflow-primary/40' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[11px] font-black uppercase tracking-tight text-white">{freq.label}</span>
                                                        {agentConfig.schedule.frequency === freq.id && <CheckCircle size={14} className="text-workflow-primary" />}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{freq.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </EliteCard>
                                </div>

                                <div className="pt-12 border-t border-white/5 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveView('list')}
                                        className="flex-1 py-4 bg-white/[0.04] border border-white/5 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 bg-workflow-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-2xl shadow-workflow-primary/30 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw className="animate-spin" size={20} />
                                                Synchronizing...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={20} />
                                                {activeView === 'create' ? 'Deploy Intel Agent' : 'Save Recalibration'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const AgentCard = ({ agent, onEdit, onDelete, onToggle, onRun }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] hover:border-workflow-primary/40 transition-all group shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                    <Settings size={18} />
                </button>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-workflow-primary/20 group-hover:text-workflow-primary transition-all shadow-inner">
                    <Bot size={28} />
                </div>
                <div
                    onClick={onToggle}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}
                >
                    {agent.status === 'active' ? 'Operational' : 'Paused'}
                </div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-white truncate group-hover:text-workflow-primary transition-colors">{agent.name}</h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-10 leading-relaxed italic">
                {agent.description || 'No operational brief provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 block mb-1">Total Cycles</span>
                    <span className="text-sm font-black text-white">{agent.runs_count || 0}</span>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 block mb-1">Sync Goal</span>
                    <span className="text-[9px] font-black text-white uppercase truncate">{agent.goal?.replace('_', ' ') || 'FIND JOBS'}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5 gap-3">
                <button
                    onClick={onRun}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-workflow-primary/20 transition-all border border-white/5"
                >
                    <Zap size={14} /> Run Cycle
                </button>
                <button
                    onClick={onDelete}
                    className="p-2.5 rounded-xl bg-white/[0.04] text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default AIAgentBuilder;
