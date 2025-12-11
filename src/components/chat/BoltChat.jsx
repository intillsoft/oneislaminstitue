/**
 * Enhanced Bolt.new Style Chat Interface
 * Streaming AI chat component with bolt.new aesthetics and advanced features
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Send, X, Loader2, Sparkles, Copy, Check,
  Mic, MicOff, Square, RotateCcw, Maximize2, Minimize2,
  ThumbsUp, ThumbsDown, Edit2, Trash2, RefreshCw,
  Search, Briefcase, FileText, TrendingUp, Users, Zap, ArrowRight, Paperclip
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { supabase } from '../../lib/supabase';

const BoltChat = ({ onNewChat, searchHistory = [], onHistoryClick }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const abortControllerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  // Quick suggestions
  const quickSuggestions = useMemo(() => [
    'Find React developer jobs in San Francisco',
    'Remote full-time positions for senior engineers',
    'Part-time design jobs with flexible hours',
    'Entry-level marketing positions',
  ], []);

  // Feature cards
  const features = useMemo(() => [
    {
      icon: Briefcase,
      title: 'Smart Job Matching',
      description: 'AI-powered job recommendations based on your skills',
      color: 'from-blue-500 to-cyan-500',
      link: '/ai-powered-job-matching-recommendations'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create ATS-optimized resumes with AI assistance',
      color: 'from-purple-500 to-pink-500',
      link: '/resume-builder-ai-enhancement'
    },
    {
      icon: TrendingUp,
      title: 'Application Tracking',
      description: 'Track all your applications with real-time updates',
      color: 'from-green-500 to-emerald-500',
      link: '/workflow-application-tracking-analytics'
    },
    {
      icon: Users,
      title: 'Talent Marketplace',
      description: 'Hire freelancers or offer your services',
      color: 'from-indigo-500 to-purple-500',
      link: '/talent/marketplace'
    },
  ], []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
        inputRef.current?.focus();
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStream, isTyping]);

  // Load conversation history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Handle click outside search box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadHistory = async () => {
    try {
      const response = await apiService.get('/chat/history');
      if (response.data?.success && response.data?.data?.messages) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveHistory = async (updatedMessages) => {
    try {
      await apiService.post('/chat/history', { messages: updatedMessages });
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const startVoiceSearch = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const stopVoiceSearch = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const handleQuickSearch = useCallback((query) => {
    setInput(query);
    inputRef.current?.focus();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Max 5MB.');
      return;
    }

    setSelectedFile(file);

    // For simple text files, read immediately
    if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'application/json' || file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(file);
    } else {
      // For PDFs/DOCs, we'll upload to backend
      setFileContent(null); // Will be handled during send
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileContent(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (message = input) => {
    // Upload to backend for parsing
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        attachedContext = data.data.content;
      } else {
        console.error('File upload failed');
        // Continue without file context? Or error?
        // Let's add a note
        attachedContext = `[Error uploading file: ${selectedFile.name}]`;
      }
    } catch (err) {
      console.error('Upload error:', err);
      attachedContext = `[Error uploading file: ${selectedFile.name}]`;
    }


    const userMessage = {
      id: Date.now(),
      type: 'user',
      role: 'user',
      content: message.trim() + (selectedFile ? `\n[Attached: ${selectedFile.name}]` : ''),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setSelectedFile(null); // Clear file after sending
    setFileContent(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsStreaming(true);
    setCurrentStream('');
    setError(null);
    setIsTyping(true);
    setShowSuggestions(false);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role || (msg.type === 'user' ? 'user' : 'assistant'),
        content: msg.content || msg.text || '',
      }));

      // Get auth token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Not authenticated. Please sign in.');
      }

      // Stream response
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          conversation_history: conversationHistory,
          context: attachedContext || null,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'token') {
                fullResponse += data.content;
                setCurrentStream(fullResponse);
              } else if (data.type === 'done') {
                // Stream complete
                const aiMessage = {
                  id: Date.now() + 1,
                  type: 'assistant',
                  role: 'assistant',
                  content: fullResponse,
                  timestamp: new Date(),
                };

                const finalMessages = [...updatedMessages, aiMessage];
                setMessages(finalMessages);
                setCurrentStream('');
                saveHistory(finalMessages);
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Streaming error');
              }
            } catch (parseError) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      console.error('Chat error:', error);
      setError(error.message || 'Failed to get response');
      setIsTyping(false);

      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        isError: true,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } finally {
      setIsStreaming(false);
      setCurrentStream('');
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setCurrentStream('');
      setIsTyping(false);

      // Save partial message if exists
      if (currentStream) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          role: 'assistant',
          content: currentStream,
          timestamp: new Date(),
        };
        const finalMessages = [...messages, aiMessage];
        setMessages(finalMessages);
        saveHistory(finalMessages);
      }
    }
  };

  const handleNewChatClick = () => {
    setMessages([]);
    setInput('');
    setCurrentStream('');
    setError(null);
    if (onNewChat) onNewChat();
  };

  const handleCopy = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleRegenerate = async (messageId) => {
    // Find the user message before this assistant message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      // Remove the assistant message and regenerate
      const updatedMessages = messages.slice(0, messageIndex);
      setMessages(updatedMessages);
      await handleSend(userMessage.content);
    }
  };

  const isEmpty = messages.length === 0 && !isStreaming && !isTyping;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0E27]" ref={chatContainerRef}>
      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 ${isEmpty ? 'py-12' : 'py-6'} scrollbar-thin`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {isEmpty ? (
            /* Enhanced Empty State - Search Box in Middle */
            <div className="flex flex-col items-center justify-center min-h-[44vh]">
              {/* Beautiful Search Box - Centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl mx-auto mb-12"
                ref={searchBoxRef}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="relative"
                >
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="relative flex items-center gap-4 bg-white/90 dark:bg-[#13182E]/90 backdrop-blur-2xl rounded-full px-8 py-5 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-transparent hover:border-workflow-primary/30 dark:hover:border-purple-500/30 focus-within:border-workflow-primary/50 dark:focus-within:border-purple-500/50 focus-within:shadow-workflow-primary/20 dark:focus-within:shadow-purple-500/20"
                  >
                    <Search className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Describe the job you're looking for..."
                      rows={1}
                      className="flex-1 bg-transparent text-lg font-normal text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none overflow-hidden min-h-[32px]"
                      style={{
                        maxHeight: '200px',
                      }}
                    />
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {recognition && (
                        <button
                          type="button"
                          onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                          className={`p-2.5 rounded-full transition-all duration-200 ${isListening
                            ? 'bg-red-500 text-white animate-pulse shadow-lg'
                            : 'text-gray-400 hover:text-workflow-primary dark:hover:text-purple-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                            }`}
                          aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                        >
                          {isListening ? (
                            <MicOff className="w-5 h-5" />
                          ) : (
                            <Mic className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      {input && (
                        <button
                          type="button"
                          onClick={() => setInput('')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                          aria-label="Clear input"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!input.trim() || isStreaming}
                        className="p-3 bg-gradient-to-r from-workflow-primary to-purple-600 text-white rounded-full hover:from-workflow-primary-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl"
                        aria-label="Send message"
                      >
                        {isStreaming ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Send className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Search History Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && searchHistory.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-[#13182E]/95 backdrop-blur-xl rounded-2xl shadow-2xl max-h-[300px] overflow-auto z-50 border border-gray-200/50 dark:border-gray-800/50"
                      >
                        {searchHistory.slice(0, 5).map((item, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              handleQuickSearch(item.query);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center gap-3 px-5 py-4 border-b border-gray-100/50 dark:border-gray-800/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                          >
                            <Sparkles className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                              {item.query}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                  AI can make mistakes. Verify important information.
                </p>
              </motion.div>

              {/* Quick Suggestions/Tags - Below Search Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-full max-w-3xl mx-auto mb-12"
              >
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 text-center">Try asking:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      onClick={() => handleQuickSearch(suggestion)}
                      className="group p-4 text-left bg-white/60 dark:bg-[#13182E]/60 backdrop-blur-sm rounded-xl hover:bg-white/80 dark:hover:bg-[#13182E]/80 transition-all duration-300 border border-gray-200/50 dark:border-gray-800/50 hover:border-workflow-primary/50 dark:hover:border-purple-500/50 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-workflow-primary/10 dark:bg-purple-500/20 flex items-center justify-center group-hover:bg-workflow-primary/20 dark:group-hover:bg-purple-500/30 transition-colors">
                          <Zap className="w-4 h-4 text-workflow-primary dark:text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{suggestion}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Feature Cards - Below Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Link
                      key={index}
                      to={feature.link}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/60 dark:bg-[#13182E]/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/80 dark:hover:bg-[#13182E]/80 transition-all duration-300 border border-gray-200/50 dark:border-gray-800/50 hover:border-workflow-primary/50 dark:hover:border-purple-500/50 hover:shadow-xl h-full"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>
            </div>
          ) : (
            /* Chat Messages View */
            <>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 group ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-workflow-primary to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`flex-1 ${message.type === 'user' ? 'max-w-3xl flex justify-end' : 'max-w-4xl'}`}>
                    <div
                      className={`rounded-2xl p-4 relative ${message.type === 'user'
                        ? 'bg-workflow-primary text-white ml-auto'
                        : message.isError
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                          : 'bg-gray-100 dark:bg-[#13182E] text-gray-900 dark:text-white'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed flex-1">
                          {message.content}
                        </p>
                        {message.type === 'assistant' && (
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Copy message"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRegenerate(message.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Regenerate"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 px-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <span className="text-sm font-medium text-white">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && !currentStream && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-workflow-primary to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 max-w-4xl">
                    <div className="rounded-2xl p-4 bg-gray-100 dark:bg-[#13182E] text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-workflow-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-workflow-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-workflow-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Streaming Message */}
              {isStreaming && currentStream && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-workflow-primary to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 max-w-4xl">
                    <div className="rounded-2xl p-4 bg-gray-100 dark:bg-[#13182E] text-gray-900 dark:text-white">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {currentStream}
                        <span className="inline-block w-2 h-4 bg-workflow-primary dark:bg-purple-500 animate-pulse ml-1" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area - Only show when there are messages */}
      {!isEmpty && (
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between"
              >
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative"
            >
              {/* File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.md,.json,.csv,.pdf,.docx"
              />

              {/* Selected File Indicator */}
              {selectedFile && (
                <div className="absolute -top-12 left-0 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-1 bg-workflow-primary/10 rounded">
                    <FileText className="w-4 h-4 text-workflow-primary" />
                  </div>
                  <span className="text-sm truncate max-w-[200px] text-gray-700 dark:text-gray-300">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-3 bg-white dark:bg-[#2A2D3A] rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus-within:border-workflow-primary dark:focus-within:border-purple-500 transition-all shadow-lg hover:shadow-xl">
                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-workflow-primary dark:hover:text-purple-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full transition-all"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isListening ? "Listening..." : "Ask anything or attach a file..."}
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none overflow-hidden min-h-[24px] max-h-[200px] py-2"
                />

                <div className="flex items-center gap-2 flex-shrink-0">
                  {recognition && (
                    <button
                      type="button"
                      onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                      className={`p-2 rounded-full transition-all duration-200 relative ${isListening
                        ? 'bg-red-50 text-red-500'
                        : 'text-gray-400 hover:text-workflow-primary dark:hover:text-purple-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                        }`}
                      aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                    >
                      {isListening && (
                        <span className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></span>
                      )}
                      {isListening ? (
                        <MicOff className="w-5 h-5 relative z-10" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  {input && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      aria-label="Clear input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {isStreaming ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                      aria-label="Stop generation"
                    >
                      <Square className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={(!input.trim() && !selectedFile) || isStreaming}
                      className="p-2 bg-workflow-primary text-white rounded-full hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoltChat;
