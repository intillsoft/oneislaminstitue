import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, MessageCircle, Zap, TrendingUp, Users, Briefcase, BarChart2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import TypingIndicator from './TypingIndicator';
import AIMessage from './AIMessage';
import { useToast } from './Toast';

/**
 * Dashboard AI Assistant - Provides AI-powered insights and assistance for dashboards
 */
const DashboardAIAssistant = ({ 
  dashboardType, // 'admin', 'recruiter', 'job-seeker', 'talent'
  contextData = {}, // Dashboard-specific data for context
  onAction // Callback for AI-suggested actions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { success, error: showError } = useToast();

  const dashboardConfigs = {
    admin: {
      name: 'Admin AI Assistant',
      icon: <BarChart2 className="w-5 h-5" />,
      quickPrompts: [
        'Analyze platform performance',
        'Suggest moderation improvements',
        'Review user activity trends',
        'Optimize job crawler settings'
      ],
      systemMessage: 'You are Workflow AI, an intelligent assistant for platform administrators. Help with analytics, moderation, system optimization, and platform management.'
    },
    recruiter: {
      name: 'Recruiter AI Assistant',
      icon: <Briefcase className="w-5 h-5" />,
      quickPrompts: [
        'Analyze candidate pipeline',
        'Suggest job posting improvements',
        'Review application trends',
        'Optimize hiring strategy'
      ],
      systemMessage: 'You are Workflow AI, an intelligent assistant for recruiters. Help with candidate management, job posting optimization, hiring strategies, and recruitment analytics.'
    },
    'job-seeker': {
      name: 'Job Seeker AI Assistant',
      icon: <Users className="w-5 h-5" />,
      quickPrompts: [
        'Improve my application success rate',
        'Analyze my job search progress',
        'Suggest skills to develop',
        'Optimize my profile'
      ],
      systemMessage: 'You are Workflow AI, an intelligent assistant for job seekers. Help with job search strategies, application optimization, skill development, and career guidance.'
    },
    talent: {
      name: 'Talent AI Assistant',
      icon: <Zap className="w-5 h-5" />,
      quickPrompts: [
        'Improve my gig performance',
        'Suggest pricing strategies',
        'Analyze client feedback',
        'Optimize my profile'
      ],
      systemMessage: 'You are Workflow AI, an intelligent assistant for freelancers. Help with gig optimization, pricing strategies, client management, and profile improvement.'
    }
  };

  const config = dashboardConfigs[dashboardType] || dashboardConfigs['job-seeker'];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your ${config.name}. I can help you:\n\n• Analyze your dashboard data\n• Provide insights and recommendations\n• Answer questions about your metrics\n• Suggest optimizations\n\nWhat would you like to know?`,
        timestamp: new Date(),
        id: Date.now()
      }]);
    }
  }, [isOpen, config.name]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Build context from dashboard data
      const context = JSON.stringify(contextData, null, 2).substring(0, 2000);
      
      const prompt = `Dashboard Type: ${dashboardType}
Dashboard Context: ${context}

User Question: ${input}

Provide helpful, actionable insights and recommendations. Be specific and data-driven.`;

      const response = await aiService.generateCompletion(prompt, {
        systemMessage: config.systemMessage,
        max_tokens: 800,
        temperature: 0.7,
      });

      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        id: Date.now() + 1
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI assistant error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        id: Date.now() + 1
      }]);
      showError('Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-workflow-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#13182E] rounded-2xl shadow-2xl max-w-2xl w-full h-[600px] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center">
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-[#E8EAED]">{config.name}</h3>
                    <p className="text-xs text-text-secondary dark:text-[#8B92A3]">Powered by Workflow AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                </button>
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                  <p className="text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-3">Quick Questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {config.quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-left px-3 py-2 text-sm bg-surface-50 dark:bg-[#1A2139] hover:bg-surface-100 dark:hover:bg-[#1E2640] rounded-lg text-text-secondary dark:text-[#8B92A3] hover:text-workflow-primary transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <AIMessage
                    key={msg.id || msg.timestamp}
                    message={msg}
                    role={msg.role}
                    onEdit={(newContent) => {
                      setMessages(prev => prev.map(m => 
                        m.id === msg.id ? { ...m, content: newContent } : m
                      ));
                    }}
                  />
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-surface-100 dark:bg-[#1A2139] rounded-lg p-4">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Workflow AI..."
                    className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="px-6 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardAIAssistant;
