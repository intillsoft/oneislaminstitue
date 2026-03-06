import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = ({ onClose, userProfile }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userProfile?.name || 'there'}! I'm your Neural Career Architect. I can optimize your path with:\n\n• Market Vector Analysis\n• Node Application Strategy\n• Interview Protocol Simulation\n• Architecture (Resume) Refinement\n• Skill Expansion Algorithms\n\nWhat vector shall we analyze?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { icon: 'Briefcase', text: 'Optimize application yield?' },
    { icon: 'TrendingUp', text: 'Identify high-value skill nodes' },
    { icon: 'Target', text: 'Salary negotiation protocols' },
    { icon: 'FileText', text: 'Resume architecture review' }
  ];

  const handleSend = async (message = input) => {
    if (!message?.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Use real AI career advisor chat
      const { aiService } = await import('../../../services/aiService');

      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await aiService.chatWithAdvisor(message, conversationHistory);

      const aiResponse = {
        role: 'assistant',
        content: result?.response || result?.data?.response || 'I apologize, but my neural link encountered an anomaly. Please re-initiate.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI advisor error:', error);
      // Fallback to helpful error message
      const aiResponse = {
        role: 'assistant',
        content: `Neural uplink unstable. ${error.message || 'Retrying connection sequence...'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0A0E27] rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-2xl h-[700px] flex flex-col border border-slate-200 dark:border-white/10 relative"
      >
        {/* Elite Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-workflow-primary/10 rounded-2xl border border-workflow-primary/20 shadow-glow">
              <Icon name="Bot" size={24} className="text-workflow-primary" />
            </div>
            <div>
              <h3 className="text-lg font-[900] text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Neural Career Advisor
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 uppercase tracking-wider font-bold">Online</span>
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Connected to Job Market Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Messages Architecture */}
        <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message?.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl p-5 shadow-sm text-sm leading-relaxed whitespace-pre-line ${message?.role === 'user'
                      ? 'bg-workflow-primary text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-tl-none'
                    }`}
                >
                  {message?.content}
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2 px-1">
                  {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl rounded-tl-none p-5 flex items-center gap-2">
                <div className="w-2 h-2 bg-workflow-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-workflow-primary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-workflow-primary rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Input Zone */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0A0E27] dark:via-[#0A0E27] dark:to-transparent pt-12">

          {messages?.length <= 1 && (
            <div className="mb-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-3">
                {quickPrompts?.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt?.text)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/5 transition-all text-xs font-bold text-slate-600 dark:text-slate-300 group whitespace-nowrap"
                  >
                    <Icon name={prompt?.icon} size={14} className="text-workflow-primary" />
                    <span>{prompt?.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && handleSend()}
              placeholder="Query neural network..."
              className="w-full pl-5 pr-14 py-4 bg-white dark:bg-[#0f1429] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-workflow-primary/50 transition-all font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input?.trim()}
              className="absolute right-2 top-2 p-2 rounded-xl bg-workflow-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Icon name="Send" size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default AIChatbot;
