import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, X, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import AILoader from './AILoader';
import { useToast } from './Toast';

/**
 * AI Field Generator - Generates content for form fields using AI
 */
const AIFieldGenerator = ({ 
  fieldType, 
  fieldName, 
  jobTitle, 
  jobDescription, 
  userResume, 
  onGenerate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { success, error: showError } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() && !jobTitle) {
      showError('Please provide a prompt or ensure job details are available');
      return;
    }

    setIsGenerating(true);

    try {
      let aiPrompt = '';

      if (fieldType === 'coverLetter') {
        aiPrompt = `Generate a professional cover letter for the position of "${jobTitle}" at the company.

Job Description: ${jobDescription || 'Not provided'}

User's Request: ${prompt || 'Generate a compelling cover letter'}

User's Resume Summary: ${userResume || 'Not provided'}

Create a personalized, professional cover letter (300-500 words) that:
- Highlights relevant skills and experience
- Shows enthusiasm for the role
- Demonstrates understanding of the company/position
- Is ATS-friendly
- Is tailored to this specific job

Return only the cover letter text, no explanations.`;
      } else if (fieldType === 'answer') {
        aiPrompt = `Generate a professional answer to this application question for the position of "${jobTitle}".

Question: ${fieldName}

Job Description: ${jobDescription || 'Not provided'}

User's Request: ${prompt || 'Generate a compelling answer'}

User's Resume Summary: ${userResume || 'Not provided'}

Create a thoughtful, professional answer (150-300 words) that:
- Directly addresses the question
- Uses specific examples from experience
- Relates to the job requirements
- Shows professionalism and enthusiasm

Return only the answer text, no explanations.`;
      } else {
        aiPrompt = `${prompt || `Generate professional content for ${fieldName} related to the job: ${jobTitle}`}

Job Description: ${jobDescription || 'Not provided'}
User's Resume: ${userResume || 'Not provided'}

Generate professional, relevant content. Return only the content, no explanations.`;
      }

      const response = await aiService.generateCompletion(aiPrompt, {
        systemMessage: 'You are Workflow AI, a professional assistant helping users create job applications. Generate high-quality, professional content tailored to specific job requirements.',
        max_tokens: 800,
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

  const handleQuickGenerate = async () => {
    setIsGenerating(true);
    try {
      let aiPrompt = '';

      if (fieldType === 'coverLetter') {
        aiPrompt = `Generate a professional cover letter for "${jobTitle}".

Job: ${jobDescription || 'Not provided'}
Resume: ${userResume || 'Not provided'}

Create a compelling, personalized cover letter (300-500 words) that highlights relevant experience and shows enthusiasm. Return only the cover letter text.`;
      } else {
        aiPrompt = `Generate a professional answer for: ${fieldName}

Job: ${jobTitle}
Description: ${jobDescription || 'Not provided'}
Resume: ${userResume || 'Not provided'}

Create a thoughtful, professional answer (150-300 words). Return only the answer text.`;
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

  return (
    <>
      <div className="flex items-center gap-3 mt-3 p-3 bg-workflow-primary/5 dark:bg-workflow-primary/10 rounded-lg border border-workflow-primary/20">
        <button
          onClick={handleQuickGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate with Workflow AI
            </>
          )}
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-workflow-primary hover:text-workflow-primary-600 dark:hover:text-workflow-primary-400 font-medium transition-colors underline"
        >
          or use custom prompt
        </button>
        <div className="ml-auto text-xs text-text-secondary dark:text-[#8B92A3]">
          <Sparkles className="w-3 h-3 inline mr-1" />
          AI-powered
        </div>
      </div>

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
                    <p className="text-xs text-text-secondary dark:text-[#8B92A3]">Custom content generation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-[#1A2139] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-2">
                    What would you like me to generate?
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
                    onClick={handleGenerate}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFieldGenerator;
