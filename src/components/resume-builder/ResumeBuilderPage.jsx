/**
 * Complete Resume Builder Page
 * Integrates TipTap editor and drag-and-drop builder
 */

import React, { useState, useEffect } from 'react';
import ResumeBuilder from './ResumeBuilder';
import ExportModal from './ExportModal';
import { Save } from 'lucide-react';
import { useToast } from '../ui/Toast';

const ResumeBuilderPage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { success } = useToast();

  // Load saved resume
  useEffect(() => {
    const saved = localStorage.getItem('resume-builder-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setResumeData(data);
        setLastSaved(new Date(data.savedAt || Date.now()));
      } catch (error) {
        console.error('Error loading saved resume:', error);
      }
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!resumeData) return;

    const interval = setInterval(() => {
      handleAutoSave(resumeData);
    }, 30000);

    return () => clearInterval(interval);
  }, [resumeData]);

  const handleSave = (data) => {
    setResumeData(data);
    handleAutoSave(data);
    success('Resume saved successfully');
  };

  const handleAutoSave = (data) => {
    const dataToSave = {
      ...data,
      savedAt: Date.now(),
    };
    localStorage.setItem('resume-builder-data', JSON.stringify(dataToSave));
    setLastSaved(new Date());
  };

  const handleExport = (data) => {
    setShowExportModal(true);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Save Indicator */}
      {lastSaved && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl shadow-lg backdrop-blur-md">
          <Save className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        </div>
      )}

      <ResumeBuilder
        initialData={resumeData}
        onSave={handleSave}
        onExport={handleExport}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        resumeData={resumeData}
        template={resumeData?.template || 'modern'}
      />
    </div>
  );
};

export default ResumeBuilderPage;

