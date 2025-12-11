import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, X, Loader2, HelpCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import TypingIndicator from './TypingIndicator';
import { useToast } from './Toast';

/**
 * Component AI Assistant - Embedded AI features for dashboard components
 * Provides AI insights and assistance directly within components
 */
const ComponentAIAssistant = ({ 
  componentName,
  componentData = {},
  onAction,
  position = 'top-right' // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const { success, error: showError } = useToast();

  const handleAskAI = async (customQuestion = null) => {
    const query = customQuestion || question;
    if (!query.trim() || isAsking) return;

    setIsAsking(true);
    setQuestion('');
    
    try {
      const context = JSON.stringify(componentData, null, 2).substring(0, 2000);
      
      const prompt = `Component: ${componentName}
Component Data: ${context}

User Question: ${query}

Provide helpful, actionable insights specific to this component. Be concise and data-driven.`;

      const response = await aiService.generateCompletion(prompt, {
        systemMessage: `You are Workflow AI, an intelligent assistant. Provide specific, actionable insights for the ${componentName} component.`,
        max_tokens: 500,
        temperature: 0.7,
      });

      setAiResponse(response);
      if (customQuestion) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('AI assistant error:', error);
      setAiResponse('I apologize, but I encountered an error. Please try again.');
      showError('Failed to get AI response. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  const quickQuestions = [
    'What does this data mean?',
    'How can I improve this?',
    'What are the key insights?',
    'Suggest optimizations'
  ];

  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'inline': 'relative'
  };

  if (position === 'inline') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-workflow-primary/10 hover:bg-workflow-primary/20 text-workflow-primary rounded-lg transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          Ask AI
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#13182E] rounded-xl shadow-2xl border-2 border-workflow-primary/20 dark:border-workflow-primary/30 p-5 z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-workflow-primary" />
                  <span className="text-sm font-semibold text-text-primary dark:text-[#E8EAED]">Workflow AI</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAI(q)}
                    className="w-full text-left px-3 py-2 text-xs bg-surface-50 dark:bg-[#1A2139] hover:bg-surface-100 dark:hover:bg-[#1E2640] rounded text-text-secondary dark:text-[#8B92A3] hover:text-workflow-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Ask a question..."
                  className="flex-1 px-2 py-1.5 text-xs border border-[#E2E8F0] dark:border-[#1E2640] rounded bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] focus:outline-none focus:ring-1 focus:ring-workflow-primary"
                />
                <button
                  onClick={() => handleAskAI()}
                  disabled={isAsking || !question.trim()}
                  className="px-3 py-1.5 bg-workflow-primary text-white rounded hover:bg-workflow-primary-600 disabled:opacity-50 text-xs"
                >
                  {isAsking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                </button>
              </div>

              {aiResponse && (
                <div className="mt-3 p-3 bg-surface-100 dark:bg-[#1A2139] rounded text-xs text-text-primary dark:text-[#E8EAED]">
                  {aiResponse}
                </div>
              )}

              {isAsking && (
                <div className="mt-3 p-3 bg-surface-100 dark:bg-[#1A2139] rounded">
                  <TypingIndicator size="small" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-50`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-gradient-to-br from-workflow-primary to-workflow-primary-600 hover:from-workflow-primary-600 hover:to-workflow-primary text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center min-w-[40px] min-h-[40px]"
        title="Ask Workflow AI about this component"
      >
        <Sparkles className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#13182E] rounded-xl shadow-2xl border-2 border-workflow-primary/20 dark:border-workflow-primary/30 p-5 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-workflow-primary" />
                <span className="text-sm font-semibold text-text-primary dark:text-[#E8EAED]">Workflow AI</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 mb-3">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  className="w-full text-left px-3 py-2 text-xs bg-surface-50 dark:bg-[#1A2139] hover:bg-surface-100 dark:hover:bg-[#1E2640] rounded text-text-secondary dark:text-[#8B92A3] hover:text-workflow-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask a question..."
                className="flex-1 px-2 py-1.5 text-xs border border-[#E2E8F0] dark:border-[#1E2640] rounded bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] focus:outline-none focus:ring-1 focus:ring-workflow-primary"
              />
              <button
                onClick={() => handleAskAI()}
                disabled={isAsking || !question.trim()}
                className="px-3 py-1.5 bg-workflow-primary text-white rounded hover:bg-workflow-primary-600 disabled:opacity-50 text-xs"
              >
                {isAsking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              </button>
            </div>

            {aiResponse && (
              <div className="mt-3 p-3 bg-surface-100 dark:bg-[#1A2139] rounded text-xs text-text-primary dark:text-[#E8EAED] whitespace-pre-wrap">
                {aiResponse}
              </div>
            )}

            {isAsking && (
              <div className="mt-3 p-3 bg-surface-100 dark:bg-[#1A2139] rounded">
                <TypingIndicator size="small" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentAIAssistant;
