import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, DollarSign, Send, RotateCcw, Shield, Award, TrendingUp, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import { useAIValidator } from '../../hooks/useAIValidator';
import { ValidationFeedback } from '../../components/ai/ValidationFeedback';

const SalaryNegotiation = () => {
    const [messages, setMessages] = useState([
        {
            role: 'system',
            content: 'I am Sarah, the HR Manager. We get along well, but I have a strict budget. I am offering you $85,000 for this role. How does that sound?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
    const messagesEndRef = useRef(null);
    const { error: showError } = useToast();
    const { validate, isValidating, validationResult, resetValidation } = useAIValidator();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };

        // --- AI GUARD ---
        // Only validate if message is substantial (longer than 5 chars) to avoid flagging short "No", "Yes", "Okay"
        if (input.length > 5) {
            const validation = await validate('negotiation_message', input, { difficulty });
            if (!validation.isValid) {
                // For chat, we might want to just let it slide if it's borderline, or show a toast?
                // Let's show the feedback component IN THE CHAT stream as a system warning?
                // For now, simpler: just block and show toast, but we need the feedback UI.
                // Actually, let's just use the toast for failure to keep chat flow, or append a warning message from "Coach".
                setMessages(prev => [...prev, userMsg, {
                    role: 'system',
                    content: `⚠️ Coach's Alert: ${validation.issues[0]} Tip: ${validation.suggestions[0]}`
                }]);
                setInput('');
                setLoading(false); // Oops, need to handle loading state carefully if we abort
                return;
            }
        }
        // ----------------

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Build prompt with history
        const historyText = messages.slice(1).map(m => `${m.role === 'user' ? 'Candidate' : 'HR Manager'}: ${m.content}`).join('\n');
        const prompt = `
      Simulation Context: Salary Negotiation.
      Your Role: HR Manager (Name: Sarah).
      My Role: Job Candidate.
      
      Difficulty: ${difficulty}. 
      (Easy: Friendly, flexible. Medium: Professional, firm but reasonable. Hard: Strict, uses pressure tactics).
      
      Original Offer: $85,000.
      Budget Cap: $100,000 (Do not reveal this).
      
      Conversation History:
      ${historyText}
      Candidate: ${input}
      
      Respond as Sarah. Keep it realistic, conversational, and concise (under 3 sentences). 
      If I make a good point, concede slightly. If I am rude or unreasonable, be firm.
    `;

        try {
            const response = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a roleplay simulators.",
                temperature: 0.7
            });

            setMessages(prev => [...prev, { role: 'system', content: response }]);
        } catch (err) {
            console.error('Chat error:', err);
            showError('Failed to get response.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetSimulation = () => {
        setMessages([{
            role: 'system',
            content: `I am Sarah, the HR Manager. We're excited about you. Based on your level, we are offering $85,000. What are your thoughts?`
        }]);
        setInput('');
    };

    // State for offer visualization
    const [currentOffer, setCurrentOffer] = useState({ base: 85000, bonus: 5000, equity: 0 });

    // Parse offer updates from AI (simulation logic would go here in a real app)
    // For now, we'll just simulate offer bumps based on message count for visual effect
    useEffect(() => {
        if (messages.length > 2 && currentOffer.base === 85000) {
            setCurrentOffer(prev => ({ ...prev, base: 88000 }));
        }
        if (messages.length > 5 && currentOffer.base === 88000) {
            setCurrentOffer(prev => ({ ...prev, base: 92000, bonus: 10000 }));
        }
    }, [messages]);

    const totalComp = currentOffer.base + currentOffer.bonus + currentOffer.equity;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] p-6 pt-24 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">

                {/* Left Column: Dashboard & Stats */}
                <div className="lg:col-span-4 space-y-6 flex flex-col h-full">

                    {/* Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#13182E] p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                                <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Negotiation Sim</h1>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">High Stakes Practice</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-[#1A2139] rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Current Offer Total</p>
                                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    ${totalComp.toLocaleString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 bg-slate-50 dark:bg-[#1A2139] rounded-xl text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Base</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">${(currentOffer.base / 1000).toFixed(0)}k</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-[#1A2139] rounded-xl text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bonus</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">${(currentOffer.bonus / 1000).toFixed(0)}k</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-[#1A2139] rounded-xl text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Equity</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">${(currentOffer.equity / 1000).toFixed(0)}k</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tactics & Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 bg-white dark:bg-[#13182E] p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col"
                    >
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-indigo-500" /> Negotiation Strategy
                        </h3>

                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Simulation Difficulty</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['easy', 'medium', 'hard'].map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDifficulty(d)}
                                            className={`py-2 rounded-lg text-xs font-bold capitalize transition-all border-2 ${difficulty === d
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-500'
                                                : 'bg-white dark:bg-[#1A2139] text-slate-500 border-transparent hover:border-slate-200'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">Coach's Tip</p>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300/80 leading-relaxed">
                                            "Don't say 'yes' immediately. Even if the offer is good, ask for time to review it. Silence is a powerful tool—use it to make them fill the gap."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={resetSimulation}
                            className="w-full py-3 mt-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 hover:dark:bg-red-900/20 hover:dark:text-red-400 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <RotateCcw className="w-4 h-4" /> Restart Negotiation
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Chat Interface */}
                <div className="lg:col-span-8 h-full">
                    <div className="h-full flex flex-col bg-white dark:bg-[#13182E] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">

                        {/* Chat Header */}
                        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1A2139]/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-0.5 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-[#1A2139] flex items-center justify-center">
                                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-rose-500">HR</span>
                                        </div>
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#1A2139] rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Sarah Jenkins</h3>
                                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        Head of Talent Acquisition • <span className="text-emerald-500">Active Now</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-[#0A0E27] scroll-smooth">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : 'items-start'}`}>
                                        <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20'
                                            : 'bg-white dark:bg-[#1E2640] text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase px-1">
                                            {msg.role === 'user' ? 'You' : 'Sarah • HR'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-[#1E2640] p-4 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-[#13182E] border-t border-slate-100 dark:border-slate-800">
                            <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-[#0A0E27] p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Type your response... (Use Shift+Enter for new line)"
                                    className="flex-1 max-h-32 min-h-[50px] p-3 bg-transparent border-none focus:ring-0 outline-none text-slate-900 dark:text-white text-sm resize-none"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || isValidating || !input.trim()}
                                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 mb-[1px]"
                                >
                                    {isValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalaryNegotiation;
