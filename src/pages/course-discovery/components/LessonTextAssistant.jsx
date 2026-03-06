import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Copy, Check, Info, Minimize2, Maximize2, GripVertical } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';

const LessonTextAssistant = ({ courseId, lessonId, activeLesson, onClose }) => {
  const { user, profile } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [copied, setCopied] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize or load chat
  useEffect(() => {
    const loadOrCreateChat = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Look for an existing text chat for this lesson
        const { data: existingChat, error: findErr } = await supabase
          .from('lesson_chats')
          .select('id')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .eq('type', 'text')
          .maybeSingle();

        if (findErr) throw findErr;

        if (existingChat) {
          setChatId(existingChat.id);
          // Load messages
          const { data: prevMsgs, error: msgErr } = await supabase
            .from('lesson_chat_messages')
            .select('*')
            .eq('chat_id', existingChat.id)
            .order('created_at', { ascending: true });
          
          if (msgErr) throw msgErr;
          setMessages(prevMsgs || []);
        } else {
          // Create new chat
          const { data: newChat, error: createErr } = await supabase
            .from('lesson_chats')
            .insert({
              user_id: user.id,
              course_id: courseId,
              lesson_id: lessonId,
              type: 'text'
            })
            .select()
            .single();
            
          if (createErr) throw createErr;
          setChatId(newChat.id);
          
          // Introduce itself
          const welcomeMsg = `Hello! I'm your interactive assistant for the lesson **${activeLesson.title}**. What would you like to know?`;
          setMessages([{ role: 'assistant', content: welcomeMsg }]);
          
          await supabase.from('lesson_chat_messages').insert({
            chat_id: newChat.id,
            role: 'assistant',
            content: welcomeMsg
          });
        }
      } catch (err) {
        console.error('Failed to init text chat:', err);
      } finally {
        setLoading(false);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    };
    loadOrCreateChat();
  }, [lessonId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !chatId || loading) return;
    const userText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMessage = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // 1. Save user msg to DB
      await supabase.from('lesson_chat_messages').insert({
        chat_id: chatId,
        role: 'user',
        content: userText
      });

      // 2. Prepare Context from lesson
      const lessonContextBlocks = (activeLesson.content_blocks || []).map(b => b.content).join('\n\n');
      const systemPrompt = `You are a helpful, expert tutor embedded directly into a lesson page. You MUST base your answers on the provided Lesson Context. Be concise but extremely clear.
      
[LESSON CONTEXT START]
Title: ${activeLesson.title}
Description: ${activeLesson.description}
Content:
${lessonContextBlocks}
[LESSON CONTEXT END]

Answer the user's question directly, strictly using the lesson context where applicable. Provide markdown formatting to be readable and elegant.`;

      // 3. Prepare full conversation history for OpenAI or Gemini
      const recentHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
      const finalPrompt = `${systemPrompt}\n\nRecent History:\n${recentHistory}\n\nUser: ${userText}`;

      // In the absence of an OpenAI proxy endpoint, we will use the existing Gemini Integration that is in use across the platform.
      // (The instructions said to use OpenAI for Voice, so we'll use Gemini for text here, and OpenAI later for voice)
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalPrompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
          })
        }
      );

      if (!response.ok) throw new Error('Failed to fetch from Gemini');
      const data = await response.json();
      const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I got confused. Can you rephrase?';

      // 4. Save Assistant msg to DB
      await supabase.from('lesson_chat_messages').insert({
        chat_id: chatId,
        role: 'assistant',
        content: assistantText
      });

      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Something went wrong connecting to the brain. Please try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(content);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      drag={isMinimized}
      dragMomentum={false}
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{ 
        y: isMinimized ? 0 : 0, 
        opacity: 1, 
        scale: 1, 
        height: isMinimized ? '80px' : '650px',
        width: isMinimized ? '320px' : 'calc(100vw - 48px)'
      }}
      exit={{ y: 50, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`fixed ${isMinimized ? 'bottom-24 right-6' : 'bottom-24 right-6'} max-w-[420px] max-h-[calc(100dvh-120px)] bg-white/95 dark:bg-[#0B1221]/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-200/50 dark:border-white/10 flex flex-col z-[9995] overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/50 dark:border-white/5 bg-transparent shrink-0">
        <div className="flex items-center gap-3">
          {isMinimized && <GripVertical className="text-slate-400 cursor-grab active:cursor-grabbing mr-1" size={16} />}
          <div className="w-10 h-10 flex items-center justify-center rounded-[1rem] bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shadow-emerald-500/20">
            <Bot className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          {!isMinimized && (
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Lesson Assistant</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-tight flex items-center gap-1">
                <Info size={10} /> Has Lesson Context
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area - Hide when minimized */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth space-y-5">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="shrink-0 mt-1">
                {msg.role === 'user' ? (
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-[1rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/20">
                    <Bot className="w-4 h-4 text-white drop-shadow-sm" />
                  </div>
                )}
              </div>

              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-4 rounded-[1.5rem] shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 prose prose-sm dark:prose-invert prose-p:leading-relaxed max-w-none rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  )}
                </div>

                {msg.role === 'assistant' && !msg.content.startsWith('❌') && (
                  <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyMessage(msg.content)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
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
              <div className="w-8 h-8 rounded-[1rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 mt-1 shrink-0">
                <Bot className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-white/5 px-5 py-4 rounded-[1.5rem] rounded-tl-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_0ms]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_150ms]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_300ms]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      )}

      {/* Input Area */}
      <div className={`p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-100/50 dark:border-white/5 shrink-0 ${isMinimized ? 'p-1 border-t-0 bg-transparent' : ''}`}>
        <div className={`relative flex items-end w-full bg-slate-50 dark:bg-slate-800/80 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/50 focus-within:border-emerald-500/50 dark:focus-within:border-emerald-500/50 transition-all shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-emerald-500/10 ${isMinimized ? 'px-3 py-1 rounded-full' : 'px-4 py-3'}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isMinimized ? "Ask..." : "Ask a question about this lesson..."}
            className={`m-0 w-full resize-none border-0 bg-transparent py-2.5 pr-10 pl-1 focus:ring-0 focus-visible:ring-0 overflow-y-auto text-sm text-slate-900 dark:text-white placeholder-slate-400 ${isMinimized ? 'py-1 text-xs' : 'max-h-[120px]'}`}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all flex items-center justify-center ${
              input.trim() && !loading
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-700 cursor-not-allowed'
            } ${isMinimized ? 'p-1.5 bottom-1' : ''}`}
          >
            <Send className={isMinimized ? "w-3 h-3" : "w-4 h-4"} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonTextAssistant;
