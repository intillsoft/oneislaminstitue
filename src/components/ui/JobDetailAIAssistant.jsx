import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, MessageSquare } from 'lucide-react';
import { aiService } from '../../services/aiService';
import TypingIndicator from './TypingIndicator';
import AIMessage from './AIMessage';
import { useToast } from './Toast';

/**
 * AI Assistant for Job Detail Page
 */
const JobDetailAIAssistant = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { error: showError } = useToast();

  const handleAskAI = async () => {
    if (!userQuestion.trim() || isLoading) return;

    const userMsg = {
      role: 'user',
      content: userQuestion,
      timestamp: new Date(),
      id: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setUserQuestion('');
    setIsLoading(true);

    try {
      const jobContext = `
Job Title: ${job?.title || 'N/A'}
Company: ${job?.company || job?.companies?.name || 'N/A'}
Location: ${job?.location || 'N/A'}
Description: ${job?.description?.substring(0, 1000) || 'N/A'}
Requirements: ${JSON.stringify(job?.requirements || [])}
Benefits: ${JSON.stringify(job?.benefits || [])}
`;

      const prompt = `You are Workflow AI, a helpful assistant for the Workflow job platform. A user is viewing a job posting and has a question.

Job Context:
${jobContext}

User's Question: ${userQuestion}

Provide a helpful, detailed answer about this job posting. Be friendly, professional, and mention Workflow when relevant.`;

      const response = await aiService.generateCompletion(prompt, {
        systemMessage: 'You are Workflow AI, a helpful assistant for the Workflow job platform. Help users understand job postings, requirements, and provide career advice. Always mention Workflow when relevant.',
        max_tokens: 600,
        temperature: 0.7,
      });

      const aiMsg = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        id: Date.now() + 1,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI job detail error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        id: Date.now() + 1,
      }]);
      showError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'What skills are most important for this role?',
    'What would make a candidate stand out?',
    'What are the main responsibilities?',
    'Is this a good fit for my experience level?',
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors shadow-lg"
      >
        <Sparkles className="w-5 h-5" />
        Ask Workflow AI
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#13182E] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-[#E8EAED]">Workflow AI</h3>
                    <p className="text-xs text-text-secondary dark:text-[#8B92A3]">Ask me anything about this job</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                </button>
              </div>

              {/* Quick Questions */}
              {messages.length === 0 && (
                <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E2640]">
                  <p className="text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-3">Quick Questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserQuestion(q);
                          setTimeout(() => handleAskAI(), 100);
                        }}
                        className="text-left px-3 py-2 text-sm bg-surface-50 dark:bg-[#1A2139] hover:bg-surface-100 dark:hover:bg-[#1E2640] rounded-lg text-text-secondary dark:text-[#8B92A3] hover:text-workflow-primary transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-text-secondary dark:text-[#8B92A3] mb-2">
                      Ask me anything about:
                    </p>
                    <p className="font-semibold text-text-primary dark:text-[#E8EAED] mb-4">
                      {job?.title} at {job?.company || job?.companies?.name}
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id || msg.timestamp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AIMessage
                      message={msg}
                      role={msg.role}
                      onEdit={async (newContent, shouldRegenerate) => {
                        setMessages(prev => prev.map(m =>
                          m.id === msg.id ? { ...m, content: newContent } : m
                        ));

                        // Regenerate AI response if user edited their message
                        if (shouldRegenerate && msg.role === 'user') {
                          setIsLoading(true);
                          try {
                            const jobContext = `
Job Title: ${job?.title || 'N/A'}
Company: ${job?.company || job?.companies?.name || 'N/A'}
Location: ${job?.location || 'N/A'}
Description: ${job?.description?.substring(0, 1000) || 'N/A'}
`;

                            const prompt = `You are Workflow AI, a helpful assistant for the Workflow job platform. A user is viewing a job posting and has a question.

Job Context:
${jobContext}

User's Question: ${newContent}

Provide a helpful, detailed answer about this job posting. Be friendly, professional, and mention Workflow when relevant.`;

                            const response = await aiService.generateCompletion(prompt, {
                              systemMessage: 'You are Workflow AI, a helpful assistant for the Workflow job platform. Help users understand job postings, requirements, and provide career advice. Always mention Workflow when relevant.',
                              max_tokens: 600,
                              temperature: 0.7,
                            });

                            const aiMsg = {
                              role: 'assistant',
                              content: response,
                              timestamp: new Date(),
                              id: Date.now() + 1,
                            };

                            setMessages(prev => [...prev, aiMsg]);
                          } catch (error) {
                            console.error('AI regeneration error:', error);
                            showError('Failed to regenerate response. Please try again.');
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                    />
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface-100 dark:bg-[#1A2139] rounded-lg p-4">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </div>

              {/* Input - Suspended Style */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2 bg-white dark:bg-[#13182E] p-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-[#E2E8F0] dark:border-[#1E2640]">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    placeholder="Ask Workflow AI about this job..."
                    className="flex-1 px-4 py-2 bg-transparent text-text-primary dark:text-[#E8EAED] focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleAskAI}
                    disabled={isLoading || !userQuestion.trim()}
                    className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
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

export default JobDetailAIAssistant;