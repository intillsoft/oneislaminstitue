/**
 * AI Assistant Sidebar Component
 * Beautiful right-side panel for AI assistance in job details and dashboard
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Sparkles, Loader2, Copy, Check, RotateCcw,
    MessageCircle, Lightbulb, FileText, TrendingUp
} from 'lucide-react';
import { apiService } from '../../lib/api';
import './AIAssistantSidebar.css';

const AIAssistantSidebar = ({ isOpen, onClose, context = {}, type = 'job' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Quick suggestions based on context type
    const suggestions = type === 'job' ? [
        'How does this job match my skills?',
        'What should I highlight in my cover letter?',
        'What are the key requirements?',
        'How can I prepare for this interview?',
    ] : [
        'Analyze my application success rate',
        'What skills should I improve?',
        'Show me trending opportunities',
        'Give me career advice',
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Initialize with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = {
                id: Date.now(),
                role: 'assistant',
                content: type === 'job'
                    ? `Hi! I'm your AI assistant. I can help you understand this job opportunity, prepare your application, and answer any questions you have about it.`
                    : `Hi! I'm your AI assistant. I can help you analyze your dashboard data, provide career insights, and answer any questions about your job search.`,
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, type]);

    const handleSend = async (message = input) => {
        if (!message.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: message.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await apiService.post('/chat/stream', {
                message: message.trim(),
                context: context,
                type: type,
                conversation_history: messages.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response.data.message || 'I apologize, but I encountered an error. Please try again.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Assistant error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.',
                isError: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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

    const handleReset = () => {
        setMessages([]);
        setInput('');
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
                        onClick={onClose}
                        className="ai-sidebar-backdrop"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="ai-sidebar-panel"
                    >
                        {/* Header */}
                        <div className="ai-sidebar-header">
                            <div className="flex items-center gap-3">
                                <div className="ai-icon-wrapper">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="ai-sidebar-title">AI Assistant</h2>
                                    <p className="ai-sidebar-subtitle">Powered by advanced AI</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleReset}
                                    className="ai-icon-button"
                                    title="New conversation"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="ai-icon-button"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="ai-sidebar-messages">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`ai-message ${message.role}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="ai-message-avatar">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div className="ai-message-content">
                                        <p className="ai-message-text">{message.content}</p>

                                        {message.role === 'assistant' && !message.isError && (
                                            <button
                                                onClick={() => handleCopy(message.content, message.id)}
                                                className="ai-copy-button"
                                                title="Copy"
                                            >
                                                {copiedId === message.id ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="ai-message-avatar user">
                                            <MessageCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="ai-message assistant"
                                >
                                    <div className="ai-message-avatar">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="ai-message-content">
                                        <div className="ai-typing-indicator">
                                            <div className="ai-typing-dot" />
                                            <div className="ai-typing-dot" />
                                            <div className="ai-typing-dot" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length <= 1 && (
                            <div className="ai-suggestions">
                                <p className="ai-suggestions-title">Quick questions:</p>
                                <div className="ai-suggestions-grid">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(suggestion)}
                                            className="ai-suggestion-button"
                                            disabled={isLoading}
                                        >
                                            <Lightbulb className="w-4 h-4" />
                                            <span>{suggestion}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="ai-sidebar-input-wrapper">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="ai-sidebar-input-form"
                            >
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask me anything..."
                                    rows={1}
                                    className="ai-sidebar-textarea"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="ai-send-button"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </form>
                            <p className="ai-disclaimer">AI can make mistakes. Verify important information.</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AIAssistantSidebar;
