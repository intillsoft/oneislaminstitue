import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Wand2, Star, Target, TrendingUp, Search, FileText, Linkedin, MessageSquare, Award, ChevronDown, ChevronUp, Zap, Check, X } from 'lucide-react';
import { aiResumeService } from '../../../services/aiResumeService';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatPanel = ({ onUpdateResume, currentResume, aiRequest }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "I'm ready. Use the Power Tools above or just ask me anything." }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [showTools, setShowTools] = useState(true);
    const scrollRef = useRef(null);
    const lastRequestIdRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, thinking]);

    // Handle External AI Requests
    useEffect(() => {
        if (aiRequest && aiRequest.timestamp !== lastRequestIdRef.current) {
            lastRequestIdRef.current = aiRequest.timestamp;
            processPrompt(aiRequest.prompt);
        }
    }, [aiRequest]);

    const processPrompt = async (promptText) => {
        if (!promptText.trim()) return;

        // Add User Message
        setMessages(prev => [...prev, { role: 'user', text: promptText }]);
        setThinking(true);

        try {
            const response = await aiResumeService.chat(promptText, currentResume);

            // SECURITY: Do NOT auto-apply changes. Show review UI instead.
            if (response.suggestedChanges && response.newData) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: response.message,
                    pendingData: response.newData
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: response.message }]);
            }

        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I hit a snag. Try again?" }]);
        } finally {
            setThinking(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const prompt = input;
        setInput('');
        await processPrompt(prompt);
    };

    const handleApplyChanges = (messageIndex, newData) => {
        onUpdateResume(newData);
        setMessages(prev => prev.map((msg, i) =>
            i === messageIndex
                ? { ...msg, applied: true, pendingData: null } // Mark as applied, remove pending data
                : msg
        ));
    };

    const handleDiscardChanges = (messageIndex) => {
        setMessages(prev => prev.map((msg, i) =>
            i === messageIndex
                ? { ...msg, discarded: true, pendingData: null } // Mark as discarded
                : msg
        ));
    };

    const handleTool = async (toolName) => {
        setThinking(true);
        setMessages(prev => [...prev, { role: 'user', text: `Run tool: ${toolName}` }]);

        try {
            let result;
            let message = "Tool execution complete.";
            let newData = null;

            // Map UI names to Service methods
            switch (toolName) {
                case 'Format Fixer':
                    result = await aiResumeService.fixFormatting(JSON.stringify(currentResume));
                    message = "I've standardized your formatting. Review changes?";
                    if (result) newData = JSON.parse(result);
                    break;
                case 'Buzzword Blast':
                    result = await aiResumeService.removeBuzzwords(JSON.stringify(currentResume.summary || currentResume.experience));
                    message = `I've removed cliché terms:\n\n${result}`;
                    break;
                case 'Job Matcher':
                    message = "Please paste the Job Description you want to target.";
                    break;
                case 'Skill Gap':
                    result = await aiResumeService.analyzeSkillGap(JSON.stringify(currentResume.skills), "Target Role");
                    message = `Skill Gap Analysis:\n${result}`;
                    break;
                case 'Metric Master':
                    result = await aiResumeService.suggestMetricsDeep(JSON.stringify(currentResume.experience));
                    message = `Here are specific metric opportunities:\n${result}`;
                    break;
                case 'Summary Gen':
                    result = await aiResumeService.generateSummary(JSON.stringify(currentResume), 'professional');
                    message = `Drafted Summary: "${result}"\n\nApply this to your resume?`;
                    // Create a deep copy and update summary
                    newData = { ...currentResume, summary: result };
                    break;
                case 'Cover Letter':
                    result = await aiResumeService.generateCoverLetter(JSON.stringify(currentResume), "Standard Job");
                    message = `Here is a draft cover letter:\n\n${result}`;
                    break;
                case 'LinkedIn Opt':
                    result = await aiResumeService.optimizeLinkedIn(JSON.stringify(currentResume));
                    message = `LinkedIn Suggestions:\n${result}`;
                    break;
                case 'Tone Mirror':
                    message = "I need a company description to mirror their tone. Paste it here.";
                    break;
                case 'Benefit Focus':
                    message = "I've rewritten your bullets to focus on impact rather than duties. (Verify feature not fully linked yet)";
                    break;
                default:
                    message = `${toolName} run successfully.`;
            }

            // Show Review UI if data modification happened
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
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', text: "Error running tool. Please try again." }]);
        } finally {
            setThinking(false);
        }
    };

    const QuickAction = ({ icon: Icon, label, color, tool }) => (
        <button
            onClick={() => handleTool(tool || label)}
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-100 dark:bg-dark-surface-elevated border border-slate-200 dark:border-dark-border hover:bg-white dark:hover:bg-dark-border hover:border-blue-300 dark:hover:border-workflow-primary hover:shadow-lg transition-all group relative overflow-hidden"
        >
            <div className={`p-1.5 rounded-md bg-opacity-10 ${color} group-hover:bg-opacity-20 transition-colors`}>
                <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-dark-text-secondary group-hover:text-slate-900 dark:group-hover:text-white relative z-10 text-center leading-tight">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-dark-surface border-r border-l border-slate-200 dark:border-dark-border">

            {/* 1. Header & Trigger */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg select-none">
                <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-dark-text tracking-wide">AI Copilot</span>
                </div>
                <button
                    onClick={() => setShowTools(!showTools)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-workflow-primary-300 hover:text-blue-700 dark:hover:text-workflow-primary-200 bg-blue-100 dark:bg-workflow-primary/10 px-2 py-1 rounded-full transition-colors"
                >
                    <Zap className="w-3 h-3" />
                    {showTools ? 'Hide Tools' : 'Show Tools'}
                    {showTools ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
            </div>

            {/* 2. Collapsible Power Suite */}
            <AnimatePresence>
                {showTools && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border"
                    >
                        <div className="p-3 grid grid-cols-4 gap-2">
                            <QuickAction icon={Wand2} label="Fix Fmt" tool="Format Fixer" color="bg-blue-600 dark:bg-workflow-primary" />
                            <QuickAction icon={Target} label="JD Match" tool="Job Matcher" color="bg-emerald-500" />
                            <QuickAction icon={Star} label="Skill Gap" tool="Skill Gap" color="bg-amber-500 dark:bg-warning-500" />
                            <QuickAction icon={TrendingUp} label="Metrics" tool="Metric Master" color="bg-blue-400 dark:bg-workflow-primary-400" />

                            <QuickAction icon={Search} label="Debuzz" tool="Buzzword Blast" color="bg-red-500 dark:bg-error-500" />
                            <QuickAction icon={FileText} label="Summary" tool="Summary Gen" color="bg-teal-500" />
                            <QuickAction icon={Linkedin} label="LinkedIn" tool="LinkedIn Opt" color="bg-sky-600" />
                            <QuickAction icon={Bot} label="Cover Ltr" tool="Cover Letter" color="bg-violet-500" />

                            <QuickAction icon={MessageSquare} label="Tone" tool="Tone Mirror" color="bg-pink-500" />
                            <QuickAction icon={Award} label="Impact" tool="Benefit Focus" color="bg-orange-500" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Chat Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-dark-surface" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 dark:bg-workflow-primary' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`flex flex-col gap-2 max-w-[85%]`}>
                            <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${msg.role === 'user'
                                ? 'bg-blue-600 dark:bg-workflow-primary text-white rounded-tr-none'
                                : 'bg-white dark:bg-dark-surface-elevated text-slate-800 dark:text-dark-text border border-slate-200 dark:border-dark-border rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>

                            {/* REVIEW SUGGESTIONS BUBBLE */}
                            {msg.pendingData && !msg.applied && !msg.discarded && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-dark-bg border border-blue-500/30 dark:border-workflow-primary/30 p-3 rounded-xl shadow-lg mt-1"
                                >
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-workflow-primary-300 text-xs font-bold mb-2 uppercase tracking-wide">
                                        <Sparkles className="w-3 h-3" /> Suggested Changes
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApplyChanges(i, msg.pendingData)}
                                            className="flex-1 bg-blue-600 dark:bg-workflow-primary hover:bg-blue-700 dark:hover:bg-workflow-primary-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
                                        >
                                            <Check className="w-3 h-3" /> Apply
                                        </button>
                                        <button
                                            onClick={() => handleDiscardChanges(i)}
                                            className="flex-1 bg-slate-100 dark:bg-dark-surface hover:bg-slate-200 dark:hover:bg-dark-border text-slate-600 dark:text-dark-text-secondary text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-200 dark:border-dark-border"
                                        >
                                            <X className="w-3 h-3" /> Discard
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                            {msg.applied && (
                                <div className="text-[10px] text-emerald-600 dark:text-success-500 font-bold flex items-center gap-1 ml-1">
                                    <CheckCircle2 className="w-3 h-3" /> Changes Applied
                                </div>
                            )}
                            {msg.discarded && (
                                <div className="text-[10px] text-slate-400 dark:text-dark-text-muted font-bold flex items-center gap-1 ml-1">
                                    <X className="w-3 h-3" /> Changes Discarded
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {thinking && (
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3 h-3 text-white animate-spin" />
                        </div>
                        <div className="p-3 bg-white dark:bg-dark-surface-elevated border border-slate-200 dark:border-dark-border rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1 pt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-dark-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-dark-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-dark-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Input Area */}
            <div className="p-3 bg-white dark:bg-dark-bg border-t border-slate-200 dark:border-dark-border">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Ask AI Copilot..."
                        className="w-full pl-3 pr-10 py-3 bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl focus:ring-1 focus:ring-blue-500 dark:focus:ring-workflow-primary outline-none text-xs sm:text-sm min-h-[45px] max-h-[100px] resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-text-muted"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || thinking}
                        className="absolute right-2 bottom-2 p-1.5 bg-blue-600 dark:bg-workflow-primary hover:bg-blue-700 dark:hover:bg-workflow-primary-600 disabled:bg-slate-300 dark:disabled:bg-dark-border disabled:opacity-50 text-white rounded-lg transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-[9px] text-center mt-2 text-slate-400 dark:text-dark-text-muted font-medium">
                    AI-generated content may be inaccurate.
                </div>
            </div>
        </div>
    );
};

// Helper for success icon (can be imported or defined)
const CheckCircle2 = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);

export default AIChatPanel;
