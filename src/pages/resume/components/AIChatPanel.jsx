import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, RefreshCw, Wand2, Star, Globe, Zap, RotateCcw, Target, TrendingUp, Search } from 'lucide-react';
import { aiResumeService } from '../../../services/aiResumeService';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatPanel = ({ onUpdateResume, currentResume, isGenerating }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "I'm ready. Tell me to 'Make it one page' or 'Tailor for Google'." }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, thinking]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const prompt = input;
        setInput('');

        // Add User Message
        setMessages(prev => [...prev, { role: 'user', text: prompt }]);
        setThinking(true);

        try {
            // Mock AI Response & Action for demo
            // In real app, we'd send 'currentResume' + 'prompt' to backend
            const response = await aiResumeService.chat(prompt, currentResume);

            // Apply changes if AI returns data
            if (response.suggestedChanges) {
                onUpdateResume(response.newData);
            }

            setMessages(prev => [...prev, { role: 'assistant', text: response.message }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I hit a snag. Try again?" }]);
        } finally {
            setThinking(false);
        }
    };

    const handleTool = async (toolName, params = {}) => {
        setThinking(true);
        // Mock UI response immediately
        setMessages(prev => [...prev, { role: 'user', text: `Run tool: ${toolName}` }]);

        try {
            let result;
            let message = "Tool execution complete.";

            switch (toolName) {
                case 'Buzzword Blaster':
                    result = await aiResumeService.removeBuzzwords(JSON.stringify(currentResume.summary));
                    message = `I've removed buzzwords: \n\n${result}`;
                    break;
                case 'Job Matcher':
                    message = "Paste the Job Description to match against.";
                    // In a real implementation this would open a modal
                    break;
                case 'Format Fixer':
                    result = await aiResumeService.fixFormatting(JSON.stringify(currentResume));
                    message = "I've fixed formatting issues.";
                    // onUpdateResume(JSON.parse(result)); // If result returns full JSON
                    break;
                case 'Suggest Metrics':
                    result = await aiResumeService.suggestMetricsDeep(JSON.stringify(currentResume.experience));
                    message = `Here are metric suggestions:\n${result}`;
                    break;
                default:
                    message = "Tool selected.";
            }

            setMessages(prev => [...prev, { role: 'assistant', text: message }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Error running tool." }]);
        } finally {
            setThinking(false);
        }
    };

    const QuickAction = ({ icon: Icon, label, color, tool }) => (
        <button
            onClick={() => handleTool(tool || label)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-indigo-500 hover:shadow-md transition-all group relative overflow-hidden"
        >
            <div className={`p-2 rounded-lg bg-opacity-10 ${color} group-hover:bg-opacity-20 transition-colors`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white relative z-10">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-[#0D1117] border-r border-[#30363D]">

            {/* 1. Power Action Grid */}
            <div className="p-4 border-b border-[#30363D]">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-400" /> Power Suite
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    <QuickAction icon={Wand2} label="Polish" tool="Format Fixer" color="bg-indigo-500" />
                    <QuickAction icon={Target} label="JD Match" tool="Job Matcher" color="bg-emerald-500" />
                    <QuickAction icon={Star} label="Skill Gap" tool="Skill Gap Analyzer" color="bg-amber-500" />
                    <QuickAction icon={TrendingUp} label="Metrics" tool="Suggest Metrics" color="bg-blue-500" />
                    <QuickAction icon={Search} label="Debuzz" tool="Buzzword Blaster" color="bg-rose-500" />
                    <QuickAction icon={Bot} label="Cover Ltr" tool="Cover Letter Gen" color="bg-purple-500" />
                </div>
            </div>

            {/* 2. Chat Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'user'
                            ? 'bg-indigo-500 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {thinking && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white animate-spin" />
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                            <div className="flex gap-1.5 pt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Input Area */}
            <div className="p-4 bg-white dark:bg-[#161B22] border-t border-[#30363D]">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Ask AI to improve, rewrite, or format..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[50px] max-h-[120px] resize-none text-slate-700 dark:text-white"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || thinking}
                        className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white rounded-lg transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-[10px] text-center mt-2 text-slate-400">
                    AI can make mistakes. Review generated content.
                </div>
            </div>
        </div>
    );
};

export default AIChatPanel;
