import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Sparkles, Bot, User, Wand2, Star, Target, TrendingUp, Search, FileText, Linkedin, MessageSquare, Award, ChevronDown, ChevronUp, Zap, Check, X, ArrowRight } from 'lucide-react';
import { aiResumeService } from '../../../services/aiResumeService';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatPanel = forwardRef(({ onUpdateResume, currentResume }, ref) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "AI Pilot Online. Ready for command." }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [showTools, setShowTools] = useState(true);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, thinking]);

    // Expose trigger method
    useImperativeHandle(ref, () => ({
        triggerAction: (prompt) => {
            handleSend(prompt);
        }
    }));

    const handleSend = async (manualPrompt = null) => {
        const promptToUse = manualPrompt || input;
        if (!promptToUse?.trim()) return;

        if (!manualPrompt) setInput('');

        // Add User Message
        setMessages(prev => [...prev, { role: 'user', text: promptToUse }]);
        setThinking(true);

        try {
            // INJECT "DIRECT" INSTRUCTION
            const systemDirective = " [CRITICAL: Be extremely concise. No conversational fluff. Give direct actionable responses or code only.]";
            const finalPrompt = promptToUse + systemDirective;

            const response = await aiResumeService.chat(finalPrompt, currentResume);

            // Structure the message with potential actionable data
            if (response.suggestedChanges && response.newData) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: response.message,
                    pendingData: response.newData // This triggers the Action Card
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: response.message }]);
            }

        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Command failed. Retry?" }]);
        } finally {
            setThinking(false);
        }
    };

    const handleApplyChanges = (messageIndex, newData) => {
        onUpdateResume(newData);
        setMessages(prev => prev.map((msg, i) =>
            i === messageIndex
                ? { ...msg, applied: true, pendingData: null }
                : msg
        ));
    };

    const handleDiscardChanges = (messageIndex) => {
        setMessages(prev => prev.map((msg, i) =>
            i === messageIndex
                ? { ...msg, discarded: true, pendingData: null }
                : msg
        ));
    };

    const handleTool = async (toolName) => {
        setThinking(true);
        setMessages(prev => [...prev, { role: 'user', text: `Execute: ${toolName}` }]);

        try {
            let result;
            let message = "Execution complete.";
            let newData = null;

            switch (toolName) {
                case 'Format Fixer':
                    result = await aiResumeService.fixFormatting(JSON.stringify(currentResume));
                    message = "Formatting standardized. Apply changes?";
                    if (result) newData = JSON.parse(result);
                    break;
                case 'Buzzword Blast':
                    result = await aiResumeService.removeBuzzwords(JSON.stringify(currentResume.summary || currentResume.experience));
                    message = `Clichés removed:\n\n${result}`;
                    break;
                case 'Job Matcher':
                    message = "Paste Target Job Description.";
                    break;
                case 'Skill Gap':
                    result = await aiResumeService.analyzeSkillGap(JSON.stringify(currentResume.skills), "Target Role");
                    message = result;
                    break;
                case 'Metric Master':
                    result = await aiResumeService.suggestMetricsDeep(JSON.stringify(currentResume.experience));
                    message = result;
                    break;
                case 'Summary Gen':
                    result = await aiResumeService.generateSummary(JSON.stringify(currentResume), 'professional');
                    message = `Draft Summary:\n"${result}"`;
                    newData = { ...currentResume, summary: result };
                    break;
                case 'Cover Letter':
                    result = await aiResumeService.generateCoverLetter(JSON.stringify(currentResume), "Standard Job");
                    message = result;
                    break;
                case 'LinkedIn Opt':
                    result = await aiResumeService.optimizeLinkedIn(JSON.stringify(currentResume));
                    message = result;
                    break;
                default:
                    message = `Tool ${toolName} finished.`;
            }

            if (newData) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: message,
                    pendingData: newData
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: message }]);
            }

        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Error executing tool." }]);
        } finally {
            setThinking(false);
        }
    };

    const QuickAction = ({ icon: Icon, label, color, tool }) => (
        <button
            onClick={() => handleTool(tool || label)}
            className="group flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all active:scale-95"
        >
            <div className={`p-1.5 rounded-lg bg-opacity-10 ${color} text-current group-hover:scale-110 transition-transform`}>
                <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white/60 dark:bg-[#0B1121]/90 backdrop-blur-xl border-l border-white/20 dark:border-white/5">

            {/* 1. Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-transparent">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-white">AI Command</span>
                </div>
                <button
                    onClick={() => setShowTools(!showTools)}
                    className="p-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                >
                    {showTools ? 'Hide Tools' : 'Show Tools'}
                    <ChevronDown className={`w-3 h-3 transition-transform ${showTools ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* 2. Power Suite */}
            <AnimatePresence>
                {showTools && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50 dark:bg-black/20 border-b border-slate-200/60 dark:border-white/5"
                    >
                        <div className="p-4 grid grid-cols-4 gap-2">
                            <QuickAction icon={Wand2} label="Fix Fmt" tool="Format Fixer" color="bg-indigo-500" />
                            <QuickAction icon={Target} label="JD Match" tool="Job Matcher" color="bg-emerald-500" />
                            <QuickAction icon={Star} label="Skills" tool="Skill Gap" color="bg-amber-500" />
                            <QuickAction icon={TrendingUp} label="Metrics" tool="Metric Master" color="bg-cyan-500" />

                            <QuickAction icon={Search} label="Debuzz" tool="Buzzword Blast" color="bg-rose-500" />
                            <QuickAction icon={FileText} label="Summary" tool="Summary Gen" color="bg-violet-500" />
                            <QuickAction icon={Linkedin} label="LinkedIn" tool="LinkedIn Opt" color="bg-blue-600" />
                            <QuickAction icon={Bot} label="Cover Ltr" tool="Cover Letter" color="bg-fuchsia-500" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Chat Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`group flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user'
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`flex flex-col gap-2 max-w-[85%]`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-tr-none'
                                    : 'bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none'
                                }`
                            }>
                                {msg.text}
                            </div>

                            {/* --- ACTION CARD (Review/Apply) --- */}
                            {msg.pendingData && !msg.applied && !msg.discarded && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/10 p-4 mt-2"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-pulse" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Auto-Optimization Ready</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApplyChanges(i, msg.pendingData)}
                                                className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wide shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-3 h-3" /> Apply Now
                                            </button>
                                            <button
                                                onClick={() => handleDiscardChanges(i)}
                                                className="px-4 py-2 rounded-lg bg-transparent border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase transition-colors"
                                            >
                                                Discard
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {msg.applied && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs font-bold text-emerald-500 mt-1">
                                    <div className="p-1 rounded-full bg-emerald-500/10"><Check className="w-3 h-3" /></div>
                                    Changes Applied to Resume
                                </motion.div>
                            )}
                            {msg.discarded && (
                                <div className="text-xs text-slate-400 mt-1">Suggestion ignored.</div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {thinking && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-1.5 h-12">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Input */}
            <div className="p-4 bg-white/60 dark:bg-[#0B1121]/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition opacity blur" />
                    <div className="relative flex items-center bg-white dark:bg-[#1E293B] rounded-xl overflow-hidden shadow-sm">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Type a command or ask for advice..."
                            className="flex-1 p-3 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 resize-none h-[48px] py-3.5"
                        />
                        <button
                            onClick={() => handleSend(null)}
                            disabled={!input.trim() || thinking}
                            className="mr-1 p-2 rounded-lg bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AIChatPanel;
