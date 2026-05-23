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
                text: `You are the Hope Dawah Institute's intelligent Assistant. Respond comprehensively and politely, formatting output in beautiful Markdown.\n\n${fullPrompt}`
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
            initial={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            exit={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (isMobile && (offset.y > 120 || velocity.y > 400)) {
                closePanel();
              }
            }}
            style={{ 
              width: isMobile ? '100%' : (isExpanded ? '100vw' : panelWidth),
              height: isMobile ? '88dvh' : '100dvh' 
            }}
            className={`fixed ${isMobile ? 'bottom-0 left-0 right-0' : 'top-0 bottom-0 right-0'} bg-white dark:bg-[var(--color-bg-dark)] z-[9999] shadow-[-1px_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[-5px_-20px_60px_rgba(0,0,0,0.4)] flex flex-col border-[var(--color-border-primary)] ${isMobile ? 'border-t rounded-t-[2.5rem]' : 'border-l rounded-l-[2.5rem]'} overflow-hidden ${
              !isResizing && !isExpanded && 'transition-all duration-300'
            }`}
          >
            {/* Pull Handle for Mobile */}
            {isMobile && (
              <div className="flex justify-center p-3 cursor-grab flex-shrink-0 border-b border-border/20">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20 dark:bg-muted-foreground/30" />
              </div>
            )}

            {/* Resizer Handle */}
            {!isMobile && !isExpanded && (
              <div 
                className="absolute top-0 left-0 w-2 h-full cursor-ew-resize hover:bg-primary/20 active:bg-primary/40 transition-colors z-[10000]"
                onMouseDown={startResizing}
              />
            )}
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] dark:bg-[var(--color-bg-sidebar)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/20">
                  <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground leading-tight">Academic Assistant</h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-tight">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:flex p-2 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors"
                  title={isExpanded ? "Collapse panel" : "Expand panel"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={closePanel}
                  className="p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-destructive transition-colors"
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
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg shadow-primary/20 relative">
                    <div className="absolute inset-0 rounded-2xl border border-white/15"></div>
                    <Sparkles className="w-8 h-8 text-white drop-shadow-sm" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">How can I help you today?</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed font-light">
                    Ask any question about courses, curriculum, or structured Islamic learning paths.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-2">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className="shrink-0 mt-1">
                        {msg.role === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-soft border border-border overflow-hidden">
                            {profile?.avatar_url ? (
                              <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-foreground/75" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm shadow-primary/20 relative">
                            <div className="absolute inset-0 rounded-xl border border-white/15"></div>
                            <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                          </div>
                        )}
                      </div>

                      <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                          {msg.role === 'user' ? 'You' : 'Assistant'}
                        </span>
                        
                        <div className={`p-4 rounded-2xl shadow-soft ${
                          msg.role === 'user' 
                            ? 'bg-[var(--color-primary)] text-white rounded-tr-sm font-medium' 
                            : 'bg-[var(--color-bg-secondary)] dark:bg-[#1a2236] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] prose prose-sm dark:prose-invert prose-p:leading-relaxed max-w-none rounded-tl-sm'
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
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 hover:bg-secondary border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm shadow-primary/20 mt-1 shrink-0 relative">
                        <div className="absolute inset-0 rounded-xl border border-white/15"></div>
                        <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                      </div>
                      <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] dark:bg-[#1a2236] border border-[var(--color-border-primary)] px-5 py-4 rounded-2xl rounded-tl-sm shadow-soft">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              )}
            </div>

            {/* Input Overlay */}
            <div className="p-5 bg-[var(--color-bg-secondary)] dark:bg-[var(--color-bg-sidebar)] border-t border-[var(--color-border-primary)] relative flex-shrink-0">
              {showScrollDown && (
                <button
                  onClick={() => scrollToBottom()}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full p-1.5 bg-card/90 backdrop-blur shadow-soft border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
              
              <div className="relative flex items-end w-full px-3 py-2 bg-white dark:bg-[var(--color-bg-dark)] rounded-2xl border border-[var(--color-border-primary)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all shadow-soft focus-within:shadow-md">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask the Academic Assistant..."
                  className="m-0 w-full resize-none border-0 bg-transparent py-3 pr-12 pl-2 focus:ring-0 focus-visible:ring-0 max-h-[150px] overflow-y-auto text-[15px] text-foreground placeholder-muted-foreground/60"
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
                      ? 'bg-primary text-primary-foreground hover:bg-accent shadow-soft hover:scale-105 active:scale-95' 
                      : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
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
