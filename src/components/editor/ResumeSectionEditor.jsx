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
        <h3 className="text-sm font-black text-text-primary uppercase tracking-tight">
          {sectionTitle}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomComponents(!showCustomComponents)}
            className="text-[10px] font-black uppercase tracking-widest"
          >
            <Code className="w-4 h-4 mr-2" />
            Add Elements
          </Button>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2 rounded-xl"
            >
              <X className="w-4 h-4 text-text-muted" />
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
            <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">
                Global Components Injection
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={insertDate}
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Temporal Unit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={insertSkill}
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Competency
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={insertAchievement}
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Milestone
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
          <Button variant="secondary" onClick={onCancel} className="h-11 rounded-xl text-[10px] font-black uppercase tracking-widest">
            Abort
          </Button>
        )}
        <Button variant="primary" onClick={handleSave} className="h-11 rounded-xl text-[10px] font-black uppercase tracking-widest min-w-[140px]">
          Commit Section
        </Button>
      </div>
    </div>
  );
};

export default ResumeSectionEditor;

