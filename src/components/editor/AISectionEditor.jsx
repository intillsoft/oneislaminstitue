/**
 * AI Section Editor
 * Allows users to edit resume sections using natural language prompts
 */

import React, { useState } from 'react';
import { Sparkles, Loader2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/aiService';
import { useToast } from '../ui/Toast';
import Button from '../ui/Button';
import AILoader from '../ui/AILoader';

const AISectionEditor = ({
  sectionType,
  currentContent,
  onSave,
  onClose,
  sectionTitle = 'Edit with AI',
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const { success, error: showError } = useToast();

  const handleAIEdit = async () => {
    if (!prompt.trim()) {
      showError('Please enter a prompt to edit this section');
      return;
    }

    try {
      setIsGenerating(true);
      setPreview(null);

      // Extract text content from HTML for AI processing
      const textContent = currentContent?.html 
        ? currentContent.html.replace(/<[^>]*>/g, '').trim()
        : (typeof currentContent === 'string' 
          ? currentContent.replace(/<[^>]*>/g, '').trim()
          : '');

      // Create AI prompt based on section type
      const sectionContext = {
        summary: 'professional summary',
        experience: 'work experience section',
        education: 'education section',
        skills: 'skills section',
        achievements: 'achievements section',
        projects: 'projects section',
      }[sectionType] || 'section';

      const aiPrompt = `You are an expert resume writer. Edit the following ${sectionContext} based on the user's request.

Current ${sectionContext}:
${textContent || 'No content yet'}

User's request: ${prompt}

Please provide the edited content in HTML format. Make it professional, ATS-friendly, and well-formatted. Return only the HTML content, no explanations.`;

      // Call AI service to generate/edit content
      const response = await aiService.generateCompletion(aiPrompt, {
        systemMessage: `You are a professional resume editor. Edit resume sections based on user instructions. Always return clean, professional HTML content.`,
        max_tokens: 1000,
      });

      // Handle response - it might be a string or an object
      let responseText = '';
      if (typeof response === 'string') {
        responseText = response;
      } else if (response && typeof response === 'object') {
        responseText = response.text || response.content || response.data || JSON.stringify(response);
      } else {
        responseText = String(response || '');
      }

      // Clean up the response (remove markdown code blocks if present)
      let editedContent = responseText.trim();
      if (editedContent.includes('```html')) {
        editedContent = editedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
      } else if (editedContent.includes('```')) {
        editedContent = editedContent.replace(/```\n?/g, '').trim();
      }

      setPreview(editedContent);
      success('AI edit completed! Review and save if you like the changes.');
    } catch (error) {
      console.error('AI edit error:', error);
      showError(`Failed to edit with AI: ${error.message || 'Please try again'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (preview) {
      onSave({ html: preview, text: preview.replace(/<[^>]*>/g, ''), json: {} });
      success('Section updated successfully!');
      onClose();
    }
  };

  const handleReplace = () => {
    setPrompt('');
    setPreview(null);
  };

  return (
    <div className="bg-white dark:bg-[#13182E] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-workflow-primary" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-[#E8EAED]">
            {sectionTitle}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-[#1E2640] transition-colors"
        >
          <X className="w-5 h-5 text-text-secondary dark:text-[#8B92A3]" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Content Preview */}
        {currentContent && (
          <div className="p-4 bg-surface-50 dark:bg-[#1A2139] rounded-lg border border-border dark:border-[#1E2640]">
            <p className="text-sm font-medium text-text-secondary dark:text-[#8B92A3] mb-2">
              Current Content:
            </p>
            <div 
              className="prose prose-sm max-w-none text-text-secondary dark:text-[#B4B9C4]"
              dangerouslySetInnerHTML={{ 
                __html: currentContent?.html || (typeof currentContent === 'string' ? currentContent : '') 
              }}
            />
          </div>
        )}

        {/* AI Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-2">
            What would you like to change? (e.g., "Make it more professional", "Add more technical skills", "Emphasize leadership experience")
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to edit this section..."
            className="w-full px-4 py-3 border border-border dark:border-[#1E2640] rounded-lg bg-background dark:bg-[#0A0E27] text-text-primary dark:text-[#E8EAED] placeholder:text-text-secondary dark:placeholder:text-[#8B92A3] focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleAIEdit}
          disabled={isGenerating || !prompt.trim()}
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Edit
            </>
          )}
        </Button>

        {/* AI Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center py-8">
            <AILoader variant="sparkles" />
          </div>
        )}

        {/* Preview of AI-Generated Content */}
        <AnimatePresence>
          {preview && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 bg-workflow-primary-50 dark:bg-workflow-primary-900/20 rounded-lg border border-workflow-primary-200 dark:border-workflow-primary-800">
                <p className="text-sm font-medium text-workflow-primary-700 dark:text-workflow-primary-300 mb-3">
                  AI-Generated Preview:
                </p>
                <div 
                  className="prose prose-sm max-w-none text-text-primary dark:text-[#E8EAED]"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleReplace}
                  variant="secondary"
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AISectionEditor;
