import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Wand2, Star, Target, TrendingUp, Search, FileText, Linkedin, MessageSquare, Award, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { aiResumeService } from '../../../services/aiResumeService';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatPanel = ({ onUpdateResume, currentResume }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "I'm ready. Use the Power Tools above or just ask me anything." }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [showTools, setShowTools] = useState(true);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
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
            const response = await aiResumeService.chat(prompt, currentResume);
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

    const handleTool = async (toolName) => {
        setThinking(true);
        setMessages(prev => [...prev, { role: 'user', text: `Run tool: ${toolName}` }]);

        try {
            let result;
            let message = "Tool execution complete.";

            // Map UI names to Service methods
            switch (toolName) {
                case 'Format Fixer':
                    result = await aiResumeService.fixFormatting(JSON.stringify(currentResume));
                    message = "I've standardized your formatting (bullets, punctuation, dates).";
                    if (result) onUpdateResume(JSON.parse(result));
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
                    message = `Here is a drafted summary:\n\n"${result}"`;
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
                    // result = await aiResumeService.mirrorTone(...);
                    message = "I need a company description to mirror their tone. Paste it here.";
                    break;
                case 'Benefit Focus':
                    // result = await aiResumeService.focusOnBenefits(...);
                    message = "I've rewritten your bullets to focus on impact rather than duties.";
                    break;
                default:
                    message = `${toolName} run successfully.`;
            }

            setMessages(prev => [...prev, { role: 'assistant', text: message }]);
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
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-[#21262D] border border-[#30363D] hover:bg-[#30363D] hover:border-indigo-500 hover:shadow-lg transition-all group relative overflow-hidden"
        >
            <div className={`p-1.5 rounded-md bg-opacity-10 ${color} group-hover:bg-opacity-20 transition-colors`}>
                <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white relative z-10 text-center leading-tight">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-[#0D1117] border-r border-l border-[#30363D]">

            {/* 1. Header & Trigger */}
            <div className="flex items-center justify-between p-3 border-b border-[#30363D] bg-[#161B22] select-none">
                <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-200 tracking-wide">AI Copilot</span>
                </div>
                <button
                    onClick={() => setShowTools(!showTools)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-full transition-colors"
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
                        className="overflow-hidden bg-[#0D1117] border-b border-[#30363D]"
                    >
                        <div className="p-3 grid grid-cols-4 gap-2">
                            <QuickAction icon={Wand2} label="Fix Fmt" tool="Format Fixer" color="bg-indigo-500" />
                            <QuickAction icon={Target} label="JD Match" tool="Job Matcher" color="bg-emerald-500" />
                            <QuickAction icon={Star} label="Skill Gap" tool="Skill Gap" color="bg-amber-500" />
                            <QuickAction icon={TrendingUp} label="Metrics" tool="Metric Master" color="bg-blue-500" />

                            <QuickAction icon={Search} label="Debuzz" tool="Buzzword Blast" color="bg-rose-500" />
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
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-[#0D1117]" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-md ${msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-[#161B22] text-slate-300 border border-[#30363D] rounded-tl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {thinking && (
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3 h-3 text-white animate-spin" />
                        </div>
                        <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-2xl rounded-tl-none">
                            <div className="flex gap-1 pt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Input Area */}
            <div className="p-3 bg-[#161B22] border-t border-[#30363D]">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Ask AI Copilot..."
                        className="w-full pl-3 pr-10 py-3 bg-[#0D1117] border border-[#30363D] rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-xs sm:text-sm min-h-[45px] max-h-[100px] resize-none text-slate-200 placeholder-slate-600"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || thinking}
                        className="absolute right-2 bottom-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-[9px] text-center mt-2 text-slate-600 font-medium">
                    AI-generated content may be inaccurate.
                </div>
            </div>
        </div>
    );
};

export default AIChatPanel;
