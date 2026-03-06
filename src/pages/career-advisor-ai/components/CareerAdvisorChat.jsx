import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, RefreshCw, Sparkles, Loader2, Zap, Orbit, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { apiService } from '../../../lib/api';

const CareerAdvisorChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await apiService.post('/career/chat', {
                message: userMessage,
                conversation_history: messages
            });

            const data = response.data;
            if (data?.data?.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
            } else if (data?.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Uplink stable, but transmission clarity is low. Please repeat." }]);
            }

        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Celestial interference detected. Neural link lost. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050714] overflow-hidden">
            {/* Minimal Header */}
            <div className="px-6 py-4 border-b border-purple-500/10 flex items-center justify-between bg-purple-500/5 backdrop-blur-3xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        <Compass className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Strategy Consultant</h3>
                        <p className="text-[9px] font-bold text-purple-400/60 uppercase tracking-widest">Astra Link Active</p>
                    </div>
                </div>
                <button onClick={() => setMessages([])} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-600 hover:text-white">
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
                            <div className="relative w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-3 italic">Consultation Required</h4>
                        <p className="text-[10px] text-slate-500 font-bold max-w-[200px] leading-relaxed uppercase tracking-widest">
                            Outline your career trajectory to begin neural mapping
                        </p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/5 border border-white/10 text-purple-400'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                <div className={`flex-1 max-w-[85%] rounded-[1.5rem] p-5 shadow-2xl ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-tr-none'
                                    : 'bg-white/5 backdrop-blur-xl border border-white/5 text-slate-200 rounded-tl-none'
                                    }`}>
                                    <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : 'prose-purple'} max-w-none text-xs leading-relaxed font-medium`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-purple-500">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-[#0A0E12] border-t border-purple-500/10">
                <div className="flex gap-4 items-end bg-black/40 p-2 rounded-2xl border border-white/5 focus-within:border-purple-500/50 transition-all group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Consult the advisor..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-700 resize-none max-h-32 min-h-[48px] py-3 px-4 text-xs font-bold font-mono tracking-tight"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`p-3.5 rounded-xl transition-all ${!input.trim() || isLoading
                            ? 'bg-white/5 text-slate-700 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.2)] active:scale-95'
                            }`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerAdvisorChat;
