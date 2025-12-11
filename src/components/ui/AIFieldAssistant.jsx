import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, X, Loader2, MessageCircle, HelpCircle, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';
import TypingIndicator from './TypingIndicator';
import { useToast } from './Toast';

/**
 * AI Field Assistant - Helps users fill form fields with AI
 * Can generate content or answer questions about the field
 */
const AIFieldAssistant = ({ 
  fieldName,
  fieldType = 'text', // 'text', 'textarea', 'url', 'email', 'tel'
  fieldValue,
  jobTitle,
  jobDescription,
  userResume,
  coverLetter,
  onGenerate,
  placeholder = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('generate'); // 'generate', 'ask', or 'autofill'
  const [prompt, setPrompt] = useState('');
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const { success, error: showError } = useToast();
  
  // Check if this is a LinkedIn or Portfolio field
  const isLinkedInOrPortfolio = fieldName?.toLowerCase().includes('linkedin') || 
                                 fieldName?.toLowerCase().includes('portfolio') ||
                                 fieldName?.toLowerCase().includes('website');

  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    try {
      // Combine resume and cover letter content to search
      const searchContent = `${userResume || ''} ${coverLetter || ''}`.toLowerCase();
      
      let foundUrl = null;
      
      if (fieldName?.toLowerCase().includes('linkedin')) {
        // Look for LinkedIn URLs in the content
        const linkedinPatterns = [
          /linkedin\.com\/in\/[\w-]+/gi,
          /linkedin\.com\/profile\/[\w-]+/gi,
          /www\.linkedin\.com\/in\/[\w-]+/gi,
          /https?:\/\/[^\s]*linkedin[^\s]*/gi
        ];
        
        for (const pattern of linkedinPatterns) {
          const match = searchContent.match(pattern);
          if (match && match[0]) {
            foundUrl = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
            break;
          }
        }
      } else if (fieldName?.toLowerCase().includes('portfolio') || fieldName?.toLowerCase().includes('website')) {
        // Look for portfolio/website URLs (excluding LinkedIn)
        const portfolioPatterns = [
          /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|net|org|io|dev|co|me|github\.io|vercel\.app|netlify\.app))[^\s]*/gi
        ];
        
        for (const pattern of portfolioPatterns) {
          const matches = searchContent.match(pattern);
          if (matches) {
            for (const match of matches) {
              // Exclude LinkedIn and common non-portfolio domains
              if (!match.includes('linkedin') && 
                  !match.includes('gmail') && 
                  !match.includes('yahoo') &&
                  !match.includes('outlook') &&
                  !match.includes('hotmail')) {
                foundUrl = match.startsWith('http') ? match : `https://${match}`;
                break;
              }
            }
            if (foundUrl) break;
          }
        }
      }
      
      if (foundUrl) {
        // URL found - auto-fill it
        if (onGenerate) {
          onGenerate(foundUrl);
          success('Auto-filled from your resume/cover letter!');
        }
      } else {
        // URL not found - use AI to suggest how to get one
        const fieldType = fieldName?.toLowerCase().includes('linkedin') ? 'LinkedIn profile' : 'portfolio website';
        
        // Show minimal, helpful message
        const fieldTypeName = fieldName?.toLowerCase().includes('linkedin') ? 'LinkedIn profile' : 'portfolio website';
        const quickTip = fieldName?.toLowerCase().includes('linkedin') 
          ? 'Create a LinkedIn profile at linkedin.com'
          : 'Create a portfolio using GitHub Pages, Vercel, or Netlify';
        
        setAiResponse(`No ${fieldTypeName} URL found.\n\n${quickTip}. You can skip this field for now.`);
        setIsOpen(true);
        setMode('ask');
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
      showError('Failed to auto-fill. Please try again.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleQuickGenerate = async () => {
    setIsGenerating(true);
    try {
      let aiPrompt = '';

      if (fieldType === 'coverLetter' || (fieldName?.toLowerCase().includes('cover'))) {
        aiPrompt = `Generate a professional cover letter for "${jobTitle}".

Job Description: ${jobDescription || 'Not provided'}
User's Resume: ${userResume || 'Not provided'}

Create a compelling, personalized cover letter (300-500 words) that highlights relevant experience and shows enthusiasm. Return only the cover letter text.`;
      } else if (fieldType === 'textarea' || fieldName?.toLowerCase().includes('answer') || fieldName?.toLowerCase().includes('question')) {
        aiPrompt = `Generate a professional answer for this application question: "${fieldName}"

Job: ${jobTitle}
Description: ${jobDescription || 'Not provided'}
Resume: ${userResume || 'Not provided'}

Create a thoughtful, professional answer (150-300 words). Return only the answer text.`;
      } else {
        aiPrompt = `Generate professional content for the field "${fieldName}" related to the job: "${jobTitle}".

Job Description: ${jobDescription || 'Not provided'}
User's Resume: ${userResume || 'Not provided'}

Generate relevant, professional content. Return only the content, no explanations.`;
      }

      const response = await aiService.generateCompletion(aiPrompt, {
        systemMessage: 'You are Workflow AI. Generate professional job application content.',
        max_tokens: 600,
        temperature: 0.7,
      });

      if (response && onGenerate) {
        onGenerate(response);
        success('Content generated successfully!');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      showError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsAsking(true);
    try {
      const prompt = `The user is filling out a job application for "${jobTitle}".

Field: ${fieldName}
Field Type: ${fieldType}
Current Value: ${fieldValue || 'Not filled yet'}
User's Question: ${question}

Job Description: ${jobDescription || 'Not provided'}
User's Resume: ${userResume || 'Not provided'}

Provide helpful, specific guidance to answer their question. Be concise and actionable.`;

      const response = await aiService.generateCompletion(prompt, {
        systemMessage: 'You are Workflow AI, a helpful assistant for job applications. Provide clear, actionable guidance.',
        max_tokens: 300,
        temperature: 0.7,
      });

      setAiResponse(response);
    } catch (error) {
      console.error('AI question error:', error);
      showError('Failed to get AI response. Please try again.');
      setAiResponse('I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  const handleCustomGenerate = async () => {
    if (!prompt.trim()) {
      showError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const aiPrompt = `${prompt}

Field: ${fieldName}
Job: ${jobTitle}
Description: ${jobDescription || 'Not provided'}
Resume: ${userResume || 'Not provided'}

Generate professional content. Return only the content, no explanations.`;

      const response = await aiService.generateCompletion(aiPrompt, {
        systemMessage: 'You are Workflow AI. Generate professional job application content.',
        max_tokens: 600,
        temperature: 0.7,
      });

      if (response && onGenerate) {
        onGenerate(response);
        success('Content generated successfully!');
        setIsOpen(false);
        setPrompt('');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      showError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* AI Assistant Button - Always Visible */}
      <div className="flex items-center gap-2 mt-2">
        {isLinkedInOrPortfolio ? (
          <>
            {/* For LinkedIn/Portfolio: Only Show Ask AI and Auto Fill */}
            <button
              onClick={handleAutoFill}
              disabled={isAutoFilling}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Auto-fill from resume/cover letter"
            >
              {isAutoFilling ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  Auto Fill
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsOpen(true);
                setMode('ask');
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-surface-100 dark:bg-[#1A2139] text-workflow-primary rounded-lg hover:bg-surface-200 dark:hover:bg-[#1E2640] font-medium transition-colors border border-workflow-primary/20"
              title="Ask AI a question"
            >
              <HelpCircle className="w-3 h-3" />
              Ask AI
            </button>
          </>
        ) : (
          <>
            {/* For other fields: Show Generate, Ask AI, and Custom */}
            <button
              onClick={handleQuickGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Generate content with AI"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-3 h-3" />
                  Generate
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsOpen(true);
                setMode('ask');
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-surface-100 dark:bg-[#1A2139] text-workflow-primary rounded-lg hover:bg-surface-200 dark:hover:bg-[#1E2640] font-medium transition-colors border border-workflow-primary/20"
              title="Ask AI a question"
            >
              <HelpCircle className="w-3 h-3" />
              Ask AI
            </button>
            <button
              onClick={() => {
                setIsOpen(true);
                setMode('generate');
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400 font-medium transition-colors"
              title="Custom prompt"
            >
              <MessageCircle className="w-3 h-3" />
              Custom
            </button>
          </>
        )}
      </div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#13182E] rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-[#E8EAED]">Workflow AI</h3>
                    <p className="text-xs text-text-secondary dark:text-[#8B92A3]">
                      {mode === 'generate' ? 'Generate content' : 'Ask a question'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode(mode === 'generate' ? 'ask' : 'generate')}
                    className="px-3 py-1.5 text-xs bg-surface-100 dark:bg-[#1A2139] text-text-primary dark:text-[#E8EAED] rounded-lg hover:bg-surface-200 dark:hover:bg-[#1E2640] transition-colors"
                  >
                    {mode === 'generate' ? 'Switch to Ask' : 'Switch to Generate'}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setPrompt('');
                      setQuestion('');
                      setAiResponse('');
                    }}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                  </button>
                </div>
              </div>

              {mode === 'generate' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-2">
                      What would you like me to generate for "{fieldName}"?
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Emphasize my leadership experience and technical skills..."
                      rows={4}
                      className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="flex-1 px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg text-text-primary dark:text-[#E8EAED] hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-2">
                      Ask Workflow AI about "{fieldName}"
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., What should I include in this field? How long should it be?"
                      rows={3}
                      className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none"
                    />
                  </div>

                  {aiResponse && !question && (
                    <div className="text-center py-2">
                      <div className="bg-surface-100 dark:bg-[#1A2139] rounded-lg p-5 mb-4">
                        <p className="text-sm text-text-primary dark:text-[#E8EAED] whitespace-pre-wrap leading-relaxed">
                          {aiResponse}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setAiResponse('');
                        }}
                        className="w-full px-4 py-2.5 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors text-sm font-medium"
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  )}
                  
                  {aiResponse && question && (
                    <div className="bg-surface-100 dark:bg-[#1A2139] rounded-lg p-4">
                      <p className="text-sm text-text-primary dark:text-[#E8EAED] whitespace-pre-wrap">{aiResponse}</p>
                    </div>
                  )}

                  {isAsking && (
                    <div className="bg-surface-100 dark:bg-[#1A2139] rounded-lg p-4">
                      <TypingIndicator />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleAskQuestion}
                      disabled={isAsking || !question.trim()}
                      className="flex-1 px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isAsking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Asking...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          Ask
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg text-text-primary dark:text-[#E8EAED] hover:bg-surface-100 dark:hover:bg-[#1A2139] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFieldAssistant;
