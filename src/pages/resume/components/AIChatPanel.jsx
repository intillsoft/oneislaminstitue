import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Sparkles, Bot, User, Wand2, Star, Target, TrendingUp, Search, FileText, Linkedin, MessageSquare, Award, ChevronDown, ChevronUp, Zap, Check, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { aiResumeService } from '../../../services/aiResumeService';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatPanel = forwardRef(({ onUpdateResume, currentResume, onThinking }, ref) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm your AI career assistant. How can I help you refine your resume or prepare for your next role today?" }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, thinking]);

    // Sync thinking state with parent (for Canvas Loading overlay)
    useEffect(() => {
        if (onThinking) onThinking(thinking);
    }, [thinking, onThinking]);

    useImperativeHandle(ref, () => ({
        triggerAction: (prompt) => {
            handleSend(prompt);
        }
    }));

    const handleSend = async (manualPrompt = null) => {
        const promptToUse = manualPrompt || input;
        if (!promptToUse?.trim()) return;
        if (!manualPrompt) setInput('');
        setMessages(prev => [...prev, { role: 'user', text: promptToUse }]);
        setThinking(true);

        try {
            // Removed the strict concise directive for a more consultative but professional tone
            const response = await aiResumeService.chat(promptToUse, currentResume);

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
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setThinking(false);
        }
    };

    const handleApplyChanges = (messageIndex, newData) => {
        onUpdateResume(newData);
        setMessages(prev => prev.map((msg, i) =>
            i === messageIndex ? { ...msg, applied: true, pendingData: null } : msg
        ));
    };

    const handleDiscardChanges = (messageIndex) => {
        setMessages(prev => prev.map((msg, i) =>
            i === messageIndex ? { ...msg, discarded: true, pendingData: null } : msg
        ));
    };

    const handleTool = async (toolName) => {
        setThinking(true);
        setMessages(prev => [...prev, { role: 'user', text: `Optimize: ${toolName}` }]);
        try {
            let result;
            let message = "Action completed successfully.";
            let newData = null;

            switch (toolName) {
                case 'Format Fixer':
                    result = await aiResumeService.fixFormatting(JSON.stringify(currentResume));
                    message = "I've optimized the formatting of your resume. Would you like to review the changes?";
                    if (result) newData = result;
                    break;
                case 'Buzzword Blast':
                    result = await aiResumeService.removeBuzzwords(JSON.stringify(currentResume.summary || currentResume.experience));
                    message = `I've refined the language to be more impactful:\n\n${result}`;
                    break;
                case 'Summary Gen':
                    result = await aiResumeService.generateSummary(JSON.stringify(currentResume), 'professional');
                    message = `Here's a new professional summary I've drafted for you:\n\n"${result}"`;
                    newData = { ...currentResume, summary: result };
                    break;
                default:
                    message = `${toolName} processed successfully.`;
            }

            if (newData) {
                setMessages(prev => [...prev, { role: 'assistant', text: message, pendingData: newData }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: message }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I couldn't complete that action right now." }]);
        } finally {
            setThinking(false);
        }
    };

    const QuickAction = ({ icon: Icon, label, color, tool }) => (
        <button
            onClick={() => handleTool(tool || label)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-workflow-primary hover:bg-workflow-primary/5 transition-all group"
        >
            <Icon size={12} className="text-slate-500 group-hover:text-workflow-primary" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-workflow-primary">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] overflow-hidden">
            {/* Header */}
            <div className="h-14 px-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-workflow-primary" />
                    <span className="text-sm font-bold text-slate-800 dark:text-white">AI Assistant</span>
                </div>
                <button
                    onClick={() => setShowTools(!showTools)}
                    className="text-[10px] font-bold tracking-tight text-slate-500 hover:text-workflow-primary transition-colors flex items-center gap-1"
                >
                    {showTools ? 'Hide Tools' : 'Show Tools'}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showTools ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Tools Area */}
            <AnimatePresence>
                {showTools && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]"
                    >
                        <div className="p-4 flex flex-wrap gap-2">
                            <QuickAction icon={Wand2} label="Fix Formatting" tool="Format Fixer" color="bg-indigo-500" />
                            <QuickAction icon={Target} label="Job Match" tool="Job Matcher" color="bg-emerald-500" />
                            <QuickAction icon={Search} label="Remove Buzzwords" tool="Buzzword Blast" color="bg-rose-500" />
                            <QuickAction icon={FileText} label="Generate Summary" tool="Summary Gen" color="bg-violet-500" />
                            <QuickAction icon={Bot} label="Cover Letter" tool="Cover Letter" color="bg-fuchsia-500" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-workflow-primary/10 text-workflow-primary'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <div className="w-5 h-5 bg-workflow-primary rounded-sm flex items-center justify-center"><Bot size={14} className="text-white" /></div>}
                        </div>
                        <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                                ? 'bg-workflow-primary text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/5'
                                }`}>
                                {msg.text}
                            </div>

                            {msg.pendingData && !msg.applied && !msg.discarded && (
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-4 mt-2 w-full shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={14} className="text-workflow-primary" />
                                        <span className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Proposed Changes</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApplyChanges(i, msg.pendingData)} className="flex-1 py-2 bg-workflow-primary text-white text-xs font-bold rounded-lg hover:bg-workflow-blue transition-all">Accept & Apply</button>
                                        <button onClick={() => handleDiscardChanges(i)} className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Discard</button>
                                    </div>
                                </div>
                            )}

                            {msg.applied && <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 mt-1"><Check size={14} /> Changes applied to resume</div>}
                        </div>
                    </div>
                ))}
                {thinking && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                            <div className="w-5 h-5 bg-workflow-primary rounded-sm flex items-center justify-center animate-pulse">
                                <Bot size={14} className="text-white" />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl rounded-tl-none flex items-center gap-1 h-10 border border-slate-200 dark:border-white/5">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-white/5">
                <div className="relative group max-w-3xl mx-auto">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Message AI Assistant..."
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 pr-16 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-workflow-primary/20 focus:border-workflow-primary transition-all resize-none min-h-[56px] max-h-32"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || thinking}
                        className="absolute right-3 bottom-3 p-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-blue transition-all disabled:opacity-30 shadow-md shadow-workflow-primary/20"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-3">AI can make mistakes. Check important info.</p>
            </div>
        </div>
    );
});

export default AIChatPanel;
