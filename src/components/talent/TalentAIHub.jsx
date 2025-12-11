import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, DollarSign, PenTool, ShieldCheck, TrendingUp, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiService } from '../../lib/api';

const TalentAIHub = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('gig-doctor');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Form States
    const [gigForm, setGigForm] = useState({ title: '', description: '', category: '', tags: '' });
    const [rateForm, setRateForm] = useState({ title: '', skills: '', experience: 'Intermediate', currentRate: '', category: '' });
    const [proposalForm, setProposalForm] = useState({ jobTitle: '', jobDesc: '', budget: '', myTitle: '', mySkills: '', tone: 'professional' });
    const [clientForm, setClientForm] = useState({ clientName: '', messages: '' });

    const tabs = [
        { id: 'gig-doctor', label: 'Listing Optimizer', icon: Sparkles, color: 'text-purple-500' },
        { id: 'rate-intel', label: 'Rate Intelligence', icon: DollarSign, color: 'text-green-500' },
        { id: 'proposal-gen', label: 'Proposal Assistant', icon: PenTool, color: 'text-blue-500' },
        { id: 'client-check', label: 'Client Assurance', icon: ShieldCheck, color: 'text-red-500' }
    ];

    const handleGigOptimize = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await apiService.post('/talent-ai/optimize-gig', {
                ...gigForm,
                tags: gigForm.tags.split(',').map(t => t.trim())
            });
            setResult({ type: 'gig', data: res.data });
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    const handleRateAnalysis = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await apiService.post('/talent-ai/analyze-rates', {
                ...rateForm,
                skills: rateForm.skills.split(',').map(s => s.trim())
            });
            setResult({ type: 'rate', data: res.data });
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    const handleProposalGen = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await apiService.post('/talent-ai/generate-proposal', {
                jobDetails: { title: proposalForm.jobTitle, description: proposalForm.jobDesc, budget: proposalForm.budget },
                freelancerProfile: { title: proposalForm.myTitle, skills: proposalForm.mySkills.split(','), portfolio: [] },
                tone: proposalForm.tone
            });
            setResult({ type: 'proposal', data: res.data });
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    const handleClientCheck = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const msgs = clientForm.messages.split('\n').map(m => ({ role: 'client', content: m }));
            const res = await apiService.post('/talent-ai/analyze-client', {
                messages: msgs,
                clientData: { name: clientForm.clientName }
            });
            setResult({ type: 'client', data: res.data });
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#1A1D24] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden border border-gray-200 dark:border-gray-700"
            >
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 dark:bg-[#222530] p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles className="w-6 h-6 text-workflow-primary" />
                        <h2 className="text-xl font-bold dark:text-white">AI Toolkit</h2>
                    </div>
                    <div className="space-y-2 flex-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-white dark:bg-[#2A2D3A] shadow-md text-workflow-primary dark:text-white font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D3A]/50'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold dark:text-white">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {/* FORMS */}
                    {!result && (
                        <div className="space-y-6">
                            {activeTab === 'gig-doctor' && (
                                <>
                                    <input value={gigForm.title} onChange={e => setGigForm({ ...gigForm, title: e.target.value })} placeholder="Gig Title" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />
                                    <textarea value={gigForm.description} onChange={e => setGigForm({ ...gigForm, description: e.target.value })} placeholder="Gig Description" rows={6} className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input value={gigForm.category} onChange={e => setGigForm({ ...gigForm, category: e.target.value })} placeholder="Category (e.g. Graphic Design)" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />
                                        <input value={gigForm.tags} onChange={e => setGigForm({ ...gigForm, tags: e.target.value })} placeholder="Current Tags (comma separated)" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />
                                    </div>
                                    <button onClick={handleGigOptimize} disabled={loading} className="w-full py-3 bg-workflow-primary hover:bg-workflow-primary-600 text-white rounded-xl font-medium transition-all flex justify-center items-center gap-2">
                                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Optimize Gig
                                    </button>
                                </>
                            )}

                            {activeTab === 'rate-intel' && (
                                <>
                                    <input value={rateForm.title} onChange={e => setRateForm({ ...rateForm, title: e.target.value })} placeholder="Role Title (e.g. React Developer)" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select value={rateForm.experience} onChange={e => setRateForm({ ...rateForm, experience: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none">
                                            <option>Entry Level</option>
                                            <option>Intermediate</option>
                                            <option>Expert</option>
                                        </select>
                                        <input value={rateForm.currentRate} onChange={e => setRateForm({ ...rateForm, currentRate: e.target.value })} placeholder="Hourly Rate ($)" type="number" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />
                                    </div>
                                    <input value={rateForm.skills} onChange={e => setRateForm({ ...rateForm, skills: e.target.value })} placeholder="Skills (comma separated)" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />
                                    <button onClick={handleRateAnalysis} disabled={loading} className="w-full py-3 bg-workflow-primary hover:bg-workflow-primary-600 text-white rounded-xl font-medium transition-all flex justify-center items-center gap-2">
                                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Analyze Rate
                                    </button>
                                </>
                            )}

                            {activeTab === 'proposal-gen' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input value={proposalForm.jobTitle} onChange={e => setProposalForm({ ...proposalForm, jobTitle: e.target.value })} placeholder="Job Title" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />
                                        <input value={proposalForm.budget} onChange={e => setProposalForm({ ...proposalForm, budget: e.target.value })} placeholder="Client Budget" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />
                                    </div>
                                    <textarea value={proposalForm.jobDesc} onChange={e => setProposalForm({ ...proposalForm, jobDesc: e.target.value })} placeholder="Paste Job Description..." rows={4} className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input value={proposalForm.myTitle} onChange={e => setProposalForm({ ...proposalForm, myTitle: e.target.value })} placeholder="Your Title" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />
                                        <select value={proposalForm.tone} onChange={e => setProposalForm({ ...proposalForm, tone: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none">
                                            <option value="professional">Professional</option>
                                            <option value="enthusiastic">Enthusiastic</option>
                                            <option value="direct">Direct</option>
                                        </select>
                                    </div>
                                    <input value={proposalForm.mySkills} onChange={e => setProposalForm({ ...proposalForm, mySkills: e.target.value })} placeholder="Your Matching Skills (comma separated)" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none" />

                                    <button onClick={handleProposalGen} disabled={loading} className="w-full py-3 bg-workflow-primary hover:bg-workflow-primary-600 text-white rounded-xl font-medium transition-all flex justify-center items-center gap-2">
                                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Generate Proposal
                                    </button>
                                </>
                            )}

                            {activeTab === 'client-check' && (
                                <>
                                    <input value={clientForm.clientName} onChange={e => setClientForm({ ...clientForm, clientName: e.target.value })} placeholder="Client Name" className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />
                                    <textarea value={clientForm.messages} onChange={e => setClientForm({ ...clientForm, messages: e.target.value })} placeholder="Paste recent messages from client (one per line)..." rows={6} className="w-full p-3 bg-gray-50 dark:bg-[#2A2D3A] rounded-xl border-none focus:ring-2 focus:ring-workflow-primary" />
                                    <button onClick={handleClientCheck} disabled={loading} className="w-full py-3 bg-workflow-primary hover:bg-workflow-primary-600 text-white rounded-xl font-medium transition-all flex justify-center items-center gap-2">
                                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Check Vibe
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* RESULTS */}
                    {result && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Analysis Complete
                                </h4>

                                {result.type === 'gig' && (
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-sm text-gray-500 font-medium">Optimized Title</span>
                                            <p className="text-lg font-bold dark:text-white mt-1">{result.data.optimizedTitle}</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-[#222530] rounded-lg">
                                            <span className="text-sm text-gray-500 font-medium block mb-2">Optimized Description</span>
                                            <div className="prose dark:prose-invert text-sm">{result.data.optimizedDescription}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 font-medium">Suggested Tags</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {result.data.suggestedTags?.map((tag, i) => (
                                                    <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {result.type === 'rate' && (
                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-xl ${result.data.status === 'underpriced' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                            result.data.status === 'optimal' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                                            }`}>
                                            <p className="font-bold text-lg capitalize">{result.data.status}</p>
                                            <p className="text-sm opacity-80">{result.data.reasoning}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-white dark:bg-[#222530] rounded-lg text-center">
                                                <span className="block text-sm text-gray-500">Market Range</span>
                                                <p className="font-bold">${result.data.marketRange?.low} - ${result.data.marketRange?.high}/hr</p>
                                            </div>
                                            <div className="p-3 bg-white dark:bg-[#222530] rounded-lg text-center border-2 border-green-500">
                                                <span className="block text-sm text-gray-500">Suggested Rate</span>
                                                <p className="font-bold text-green-600 text-xl">${result.data.suggestedRate}/hr</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                                            Potential Annual Increase: <span className="font-bold text-green-600">{result.data.potentialRevenueIncrease}</span>
                                        </p>
                                    </div>
                                )}

                                {result.type === 'proposal' && (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white dark:bg-[#222530] rounded-lg">
                                            <span className="text-sm text-gray-500 font-medium block mb-1">Subject Line</span>
                                            <p className="font-bold">{result.data.subjectLine}</p>
                                        </div>
                                        <div className="p-4 bg-white dark:bg-[#222530] rounded-lg border-l-4 border-blue-500">
                                            <p className="whitespace-pre-wrap dark:text-gray-300">{result.data.proposalBody}</p>
                                        </div>
                                        <button onClick={() => navigator.clipboard.writeText(result.data.proposalBody)} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                                            Copy to Clipboard
                                        </button>
                                    </div>
                                )}

                                {result.type === 'client' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`text-3xl font-bold ${result.data.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                                {result.data.riskScore}/100
                                            </div>
                                            <div>
                                                <p className="font-bold">Risk Level: {result.data.riskLevel}</p>
                                                <p className="text-sm text-gray-500">Vibe Check Score</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {result.data.redFlags?.length > 0 && (
                                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                    <span className="font-bold text-red-600 text-sm block mb-1">Red Flags</span>
                                                    <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                                                        {result.data.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <span className="font-bold text-blue-600 text-sm block mb-1">Advisor Advice</span>
                                                <p className="text-sm text-blue-800 dark:text-blue-200">{result.data.advice}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setResult(null)} className="w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                Start New Analysis
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default TalentAIHub;
