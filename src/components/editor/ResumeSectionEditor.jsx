/**
 * Resume Section Editor
 * Wrapper for TipTap editor with resume-specific features
 */

import React, { useState } from 'react';
import TipTapEditor from './TipTapEditor';
import { Calendar, Award, Code, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const ResumeSectionEditor = ({
  sectionType = 'experience',
  initialContent = '',
  onSave,
  onCancel,
  sectionTitle = 'Edit Section',
}) => {
  const [content, setContent] = useState(initialContent);
  const [showCustomComponents, setShowCustomComponents] = useState(false);

  const handleChange = ({ html, text, json }) => {
    setContent({ html, text, json });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  // Insert custom components
  const insertDate = () => {
    // This would insert a date picker component
    // For now, insert placeholder text
    const dateText = '[Date: MM/YYYY - MM/YYYY]';
    // In a real implementation, this would use editor commands
    alert('Date picker would open here. Inserting placeholder.');
  };

  const insertSkill = () => {
    const skillText = '[Skill: Enter skill name]';
    alert('Skill component would open here.');
  };

  const insertAchievement = () => {
    const achievementText = '[Achievement: Enter achievement]';
    alert('Achievement component would open here.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">
          {sectionTitle}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomComponents(!showCustomComponents)}
          >
            <Code className="w-4 h-4 mr-2" />
            Components
          </Button>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Custom Components Panel */}
      <AnimatePresence>
        {showCustomComponents && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#1A2139] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640]">
              <p className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-3">
                Insert Custom Components
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={insertDate}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={insertSkill}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Skill
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={insertAchievement}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Achievement
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <TipTapEditor
        content={initialContent}
        onChange={handleChange}
        placeholder={`Start writing your ${sectionType}...`}
        autoSave={true}
        autoSaveInterval={30000}
        onSave={handleSave}
        showToolbar={true}
        minHeight="300px"
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" onClick={handleSave}>
          Save Section
        </Button>
      </div>
    </div>
  );
};

export default ResumeSectionEditor;

