import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Send, Bot, Copy, Check, User, ArrowDown, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAIPanel } from '../../contexts/AIPanelContext';
import { useAuthContext } from '../../contexts/AuthContext';

const GlobalAIPanel = () => {
  const { isOpen, closePanel, initialQuery } = useAIPanel();
  const { profile } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [panelWidth, setPanelWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      let newWidth = window.innerWidth - e.clientX;
      if (newWidth < 350) newWidth = 350; // min width
      if (newWidth > window.innerWidth * 0.9) newWidth = window.innerWidth * 0.9; // max 90%
      setPanelWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Focus input when opened or when initial query is passed
  useEffect(() => {
    if (isOpen) {
      if (initialQuery && messages.length === 0) {
        handleSendMessage(initialQuery);
      } else {
        setTimeout(() => textareaRef.current?.focus(), 300);
      }
    }
  }, [isOpen, initialQuery]);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key not configured.');

      // Format previous history for context
      const historyContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
      const fullPrompt = `${historyContext ? `Previous Conversation Context:\n${historyContext}\n\n` : ''}User Question: ${messageText}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are the One Islam Institute's intelligent Assistant. Respond comprehensively and politely, formatting output in beautiful Markdown.\n\n${fullPrompt}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          })
        }
      );

      if (!response.ok) throw new Error('Failed to fetch from Gemini API');
      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.',
        timestamp: new Date().toISOString()
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { role: 'assistant', content: `❌ Error: ${error.message}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        handleSendMessage(input.trim());
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(content);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[9998]"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%', y: 0, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ x: '100%', y: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            style={{ width: isMobile ? '100%' : (isExpanded ? '100vw' : panelWidth) }}
            className={`fixed top-0 bottom-0 right-0 h-dvh bg-white dark:bg-[#0A0E27] backdrop-blur-3xl z-[9999] shadow-[-10px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_80px_rgba(0,0,0,0.5)] flex flex-col border-l border-gray-100 dark:border-white/5 rounded-l-[2rem] md:rounded-l-[2.5rem] overflow-hidden ${
              !isResizing && !isExpanded && 'transition-all duration-300'
            }`}
          >
            {/* Resizer Handle */}
            {!isMobile && !isExpanded && (
              <div 
                className="absolute top-0 left-0 w-2 h-full cursor-ew-resize hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors z-[10000]"
                onMouseDown={startResizing}
              />
            )}
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-transparent flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shadow-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Academic Assistant</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest leading-tight">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                  title={isExpanded ? "Collapse panel" : "Expand panel"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={closePanel}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors"
                  title="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-6 relative"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 relative">
                    <div className="absolute inset-0 rounded-2xl border border-white/20"></div>
                    <Sparkles className="w-8 h-8 text-white drop-shadow-sm" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">How can I help you today?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] leading-relaxed">
                    Ask any question about courses, curriculum, or structured Islamic learning paths.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-2">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className="shrink-0 mt-1">
                        {msg.role === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {profile?.avatar_url ? (
                              <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 relative">
                            <div className="absolute inset-0 rounded-xl border border-white/20"></div>
                            <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                          </div>
                        )}
                      </div>

                      <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                          {msg.role === 'user' ? 'You' : 'Assistant'}
                        </span>
                        
                        <div className={`p-4 rounded-2xl shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-emerald-600 text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert prose-p:leading-relaxed max-w-none rounded-tl-sm'
                        }`}>
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap break-words overflow-hidden text-sm" style={{ wordBreak: 'break-word' }}>
                              {msg.content}
                            </p>
                          ) : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          )}
                        </div>

                        {msg.role === 'assistant' && !msg.content.startsWith('❌') && (
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <button
                              onClick={() => handleCopyMessage(msg.content)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-100 dark:border-white/5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                              {copied === msg.content ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 mt-1 shrink-0 relative">
                        <div className="absolute inset-0 rounded-xl border border-white/20"></div>
                        <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-gray-100 dark:border-white/5 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              )}
            </div>

            {/* Input Overlay */}
            <div className="p-5 bg-transparent border-t border-gray-100/80 dark:border-white/5 relative flex-shrink-0">
              {showScrollDown && (
                <button
                  onClick={() => scrollToBottom()}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full p-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
              
              <div className="relative flex items-end w-full px-3 py-2 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 focus-within:border-emerald-500/50 dark:focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all shadow-sm focus-within:shadow-md">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask the Academic Assistant..."
                  className="m-0 w-full resize-none border-0 bg-transparent py-3 pr-12 pl-2 focus:ring-0 focus-visible:ring-0 max-h-[150px] overflow-y-auto text-[15px] text-gray-900 dark:text-white placeholder-gray-400"
                  rows={1}
                />
                <button
                  onClick={() => {
                    if (input.trim() && !loading) {
                      handleSendMessage(input.trim());
                      setInput('');
                      if (textareaRef.current) textareaRef.current.style.height = 'auto';
                    }
                  }}
                  disabled={loading || !input.trim()}
                  className={`absolute right-2 bottom-2.5 p-2 rounded-xl transition-all flex items-center justify-center ${
                    input.trim() && !loading
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:scale-105 active:scale-95' 
                      : 'bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center text-[10px] text-gray-400 mt-2">
                AI can make mistakes. Verify important information.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalAIPanel;
