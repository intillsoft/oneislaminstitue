import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import TypingIndicator from './TypingIndicator';
import AIMessage from './AIMessage';

/**
 * AI Assistant for FAQ explanations
 */
const FAQAIAssistant = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

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
      const prompt = `Context: ${question} - ${answer}\n\nUser's question: ${userQuestion}\n\nProvide a detailed, helpful explanation about Workflow platform's pricing and features. Be friendly and professional.`;

      const response = await aiService.generateCompletion(prompt, {
        systemMessage: 'You are Workflow AI, a helpful assistant for the Workflow job platform. Provide clear, detailed explanations about pricing, features, and services. Always mention Workflow when relevant.',
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiMsg = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        id: Date.now() + 1,
      };

      setMessages(prev => [...prev, aiMsg]);
      setAiResponse(response);
    } catch (error) {
      console.error('AI FAQ error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        id: Date.now() + 1,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 text-sm text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400 font-medium flex items-center gap-2 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Ask Workflow AI for more details
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
                    <p className="text-xs text-text-secondary dark:text-[#8B92A3]">Ask me anything about this FAQ</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-text-secondary dark:text-[#8B92A3] mb-2">
                      Ask me anything about:
                    </p>
                    <p className="font-semibold text-text-primary dark:text-[#E8EAED] mb-4">
                      {question}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-[#8B92A3]">
                      {answer}
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
                            const prompt = `Context: ${question} - ${answer}\n\nUser's question: ${newContent}\n\nProvide a detailed, helpful explanation about Workflow platform's pricing and features. Be friendly and professional.`;

                            const response = await aiService.generateCompletion(prompt, {
                              systemMessage: 'You are Workflow AI, a helpful assistant for the Workflow job platform. Provide clear, detailed explanations about pricing, features, and services. Always mention Workflow when relevant.',
                              max_tokens: 500,
                              temperature: 0.7,
                            });

                            const aiMsg = {
                              role: 'assistant',
                              content: response,
                              timestamp: new Date(),
                              id: Date.now() + 1,
                            };

                            setMessages(prev => [...prev, aiMsg]);
                            setAiResponse(response);
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

              {/* Input */}
              <div className="p-6 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    placeholder="Ask Workflow AI..."
                    className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleAskAI}
                    disabled={isLoading || !userQuestion.trim()}
                    className="px-6 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default FAQAIAssistant;
