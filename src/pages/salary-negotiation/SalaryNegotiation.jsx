import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, DollarSign, Send, RotateCcw, Shield, Award, TrendingUp, Loader2, ArrowLeft, ChevronRight, Zap, Briefcase, Calculator, UserCheck, Scale, Gavel } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { trainingService } from '../../services/trainingService';
import { useToast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import DojoLayout from '../../components/layout/DojoLayout';

const SalaryNegotiation = () => {
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const [messages, setMessages] = useState([
        {
            role: 'system',
            content: "Hi! I'm Sarah, the Hiring Manager. We're really impressed with your background. We'd like to extend an offer of $85,000 for this Senior Developer role. We think it's a great package."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');
    const [offer, setOffer] = useState({ base: 85000, bonus: 5000, equity: 10000 });
    const [coachTip, setCoachTip] = useState("Don't accept immediately. Ask if there's flexibility in the base salary.");

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const historyText = messages.slice(-6).map(m => `${m.role === 'user' ? 'Candidate' : 'Sarah (HR)'}: ${m.content}`).join('\n');
            const prompt = `
            Simulation: Salary Negotiation.
            Role: Sarah, HR Manager.
            Difficulty: ${difficulty}.
            Current Offer: $${offer.base} Base, $${offer.bonus} Bonus, $${offer.equity} Equity.
            Context: ${historyText}
            Candidate says: "${input}"
            Instructions: Respond as Sarah. Be firm but professional. Concede slightly if arguments are strong. Append [OFFER_UPDATE: {"base": X, "bonus": Y, "equity": Z}] if changes occur. Max 3 sentences.
            `;

            const response = await aiService.generateCompletion(prompt, { systemMessage: "Professional Negotiator Simulator.", temperature: 0.7 });

            let finalContent = response;
            const offerMatch = response.match(/\[OFFER_UPDATE:\s*(\{.*?\})\]/);

            if (offerMatch) {
                try {
                    const newOffer = JSON.parse(offerMatch[1]);
                    setOffer(prev => ({ ...prev, ...newOffer }));
                    finalContent = response.replace(offerMatch[0], '').trim();
                    success('Offer Terms Updated.');
                } catch (e) { }
            }

            setMessages(prev => [...prev, { role: 'system', content: finalContent }]);
            generateCoachTip(input, finalContent);

        } catch (err) {
            showError('Uplink Interrupted.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateCoachTip = async (lastUserMsg, lastAiMsg) => {
        try {
            const tipPrompt = `Analyze negotiation. User: "${lastUserMsg}", HR: "${lastAiMsg}". Give 1 short strategic tip (max 12 words).`;
            const tip = await aiService.generateCompletion(tipPrompt, { temperature: 0.5 });
            setCoachTip(tip.replace(/"/g, ''));
        } catch (e) { }
    };

    const handleSaveAndExit = async () => {
        try {
            await trainingService.saveSession({
                tool_type: 'negotiation',
                score: Math.min(100, ((offer.base - 85000) / 15000) * 100),
                title: `Negotiation Result: $${(totalComp / 1000).toFixed(1)}k`,
                metadata: { final_offer: offer, messages, difficulty }
            });
            success('Negotiation Logged.');
            navigate('/career-training');
        } catch (e) {
            showError('Log failed.');
        }
    };

    const totalComp = offer.base + offer.bonus + offer.equity;

    const NegotiationDojo = (
        <div className="h-full flex flex-col overflow-hidden bg-[#050608]">
            {/* Top Stats: The Stakes */}
            <div className="flex-none p-6 border-b border-amber-500/10 bg-amber-500/5 backdrop-blur-3xl">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-[20px] rounded-full animate-pulse" />
                            <div className="relative p-4 bg-amber-600 rounded-2xl shadow-[0_0_30px_rgba(217,119,6,0.3)]">
                                <DollarSign className="w-8 h-8 text-black font-bold" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.3em] mb-1">Total Valuation</p>
                            <h2 className="text-4xl font-black text-white tracking-tighter italic">
                                ${totalComp.toLocaleString()}
                            </h2>
                        </div>
                    </div>

                    <div className="flex gap-8 border-l border-white/5 pl-8">
                        {[
                            { label: 'Base Salary', val: offer.base, color: 'text-amber-400' },
                            { label: 'Sign-on Bonus', val: offer.bonus, color: 'text-emerald-400' },
                            { label: 'Equity Pack', val: offer.equity, color: 'text-purple-400' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className={`text-xl font-black ${stat.color} italic tracking-tight`}>${(stat.val / 1000).toFixed(0)}k</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSaveAndExit}
                        className="px-8 py-3 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-amber-500 transition-all active:scale-95 shadow-2xl"
                    >
                        Close Deal
                    </button>
                </div>
            </div>

            {/* Main Center Area: Chat & Coach */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Center: Negotiation Room */}
                <div className="lg:col-span-8 flex flex-col bg-[#050608] relative border-r border-white/5">
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-6 rounded-[2rem] text-xs font-bold leading-relaxed shadow-2xl ${msg.role === 'user'
                                                ? 'bg-amber-600 text-black rounded-tr-none italic'
                                                : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <div className="flex items-center gap-2 px-3">
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                                {msg.role === 'user' ? 'Lead Candidate' : 'Sarah • Executive HR'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] rounded-tl-none flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" />
                                        <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                        <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compensating Options...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-8 bg-[#080A0C] border-t border-white/5">
                        <div className="max-w-4xl mx-auto flex gap-4 items-end bg-black/40 p-2 rounded-2xl border border-white/5 focus-within:border-amber-500/50 transition-all group shadow-2xl">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                placeholder="State your counter-offer or reasoning..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-700 resize-none max-h-32 min-h-[56px] py-4 px-5 text-xs font-bold font-mono tracking-tight"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-4 bg-amber-600 text-black rounded-xl hover:bg-amber-500 transition-all disabled:opacity-20 shadow-lg active:scale-95"
                            >
                                <Send size={20} className="font-bold" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: The High-Stakes Coach */}
                <div className="lg:col-span-4 h-full bg-[#0A0C0E] flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Gavel className="w-5 h-5 text-amber-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategy Advisor</h3>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-amber-500/10 rounded-3xl blur opacity-75" />
                            <div className="relative p-8 bg-black border border-amber-500/20 rounded-[2.5rem] shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Tactical Audit</span>
                                </div>
                                <p className="text-sm font-black text-amber-50 italic leading-relaxed text-center">
                                    "{coachTip}"
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: <Shield size={16} />, t: "Firmness", v: difficulty },
                                { icon: <Scale size={16} />, t: "Leverage", v: "Calculated" },
                                { icon: <UserCheck size={16} />, t: "Persona", v: "Executive" },
                                { icon: <TrendingUp size={16} />, t: "Potential", v: "High" }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                    <div className="text-amber-500">{item.icon}</div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{item.t}</p>
                                        <p className="text-[10px] font-black text-white uppercase">{item.v}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1" />

                    <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Calculator size={60} className="text-amber-500" />
                        </div>
                        <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-3">Negotiation Tip</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase italic">
                            The highest stakes are not about the numbers, but the perceived value you bring to the matrix. Stay focused on impact.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <DojoLayout
            title="Salary Negotiation"
            subtitle="The Art of High-Stakes Negotiation"
            headerActions={
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase rounded-full">
                        Live Simulation
                    </div>
                </div>
            }
            backPath="/career-training"
        >
            {NegotiationDojo}
        </DojoLayout>
    );
};

export default SalaryNegotiation;
