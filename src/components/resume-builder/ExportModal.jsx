/**
 * Export Modal Component
 * Provides export options for resume
 */

import React, { useState } from 'react';
import { Download, FileText, File, Printer } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { exportToHTML, exportToText, downloadFile } from '../../utils/resumeExport';

const ExportModal = ({ isOpen, onClose, resumeData, template }) => {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);

  // Transform resumeData format if needed
  const transformResumeData = (data) => {
    if (!data) return null;
    
    // If data has sections (from ResumeBuilder), transform to expected format
    if (data.sections) {
      const personalInfo = data.personalInfo || {};
      const workExperience = data.sections.filter(s => s.type === 'experience').map(s => ({
        title: extractText(s.content, 'title') || 'Position',
        company: extractText(s.content, 'company') || 'Company',
        dateRange: extractText(s.content, 'date') || '',
        description: extractText(s.content, 'description') || s.content,
      }));
      const education = data.sections.filter(s => s.type === 'education').map(s => ({
        degree: extractText(s.content, 'degree') || 'Degree',
        institution: extractText(s.content, 'institution') || 'Institution',
        year: extractText(s.content, 'year') || '',
      }));
      const skills = data.sections.filter(s => s.type === 'skills').flatMap(s => {
        const skillText = extractText(s.content);
        return skillText ? skillText.split(',').map(s => s.trim()) : [];
      });
      const professionalSummary = data.sections.find(s => s.type === 'summary')?.content || '';

      return {
        personalInfo: {
          fullName: personalInfo.fullName || personalInfo.name || 'Your Name',
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
          location: personalInfo.location || '',
        },
        professionalSummary: stripHtml(professionalSummary),
        workExperience,
        education,
        skills,
      };
    }
    
    // If already in expected format, return as is
    return data;
  };

  const extractText = (html, type) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleExport = async (format) => {
    setExporting(true);
    setExportFormat(format);
    try {
      const transformedData = transformResumeData(resumeData);
      
      if (!transformedData) {
        alert('No resume data available. Please create a resume first.');
        setExporting(false);
        return;
      }

      switch (format) {
        case 'html':
          const html = exportToHTML(transformedData, template || 'modern');
          downloadFile(html, `resume-${Date.now()}.html`, 'text/html');
          break;
        case 'text':
          const text = exportToText(transformedData);
          downloadFile(text, `resume-${Date.now()}.txt`, 'text/plain');
          break;
        case 'pdf':
          try {
            const { downloadPDF } = await import('../../utils/resumeExport');
            await downloadPDF(transformedData, `resume-${Date.now()}.pdf`);
          } catch (error) {
            console.error('PDF export error:', error);
            alert('PDF export failed. Please try exporting as HTML and printing to PDF.');
          }
          break;
        default:
          break;
      }
      setTimeout(() => {
        setExporting(false);
        setExportFormat(null);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export error:', error);
      setExporting(false);
      setExportFormat(null);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Resume"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
          Choose a format to export your resume
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ExportOption
            icon={FileText}
            title="HTML"
            description="Clean HTML format"
            onClick={() => handleExport('html')}
            disabled={exporting}
          />
          <ExportOption
            icon={File}
            title="Plain Text"
            description="Simple text format"
            onClick={() => handleExport('text')}
            disabled={exporting}
          />
          <ExportOption
            icon={Printer}
            title="PDF"
            description="Print-ready PDF"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
          <Button variant="secondary" onClick={onClose} disabled={exporting}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ExportOption = ({ icon: Icon, title, description, onClick, disabled, comingSoon, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || comingSoon || loading}
      className={`
        p-4 rounded-lg border-2 transition-all text-left
        ${comingSoon || disabled || loading
          ? 'border-[#E2E8F0] dark:border-[#1E2640] opacity-50 cursor-not-allowed'
          : 'border-[#E2E8F0] dark:border-[#1E2640] hover:border-workflow-primary hover:bg-workflow-primary-50 dark:hover:bg-workflow-primary-900/20'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${comingSoon ? 'bg-[#F8FAFC] dark:bg-[#1A2139]' : 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20'}`}>
          <Icon className={`w-5 h-5 ${comingSoon ? 'text-[#64748B] dark:text-[#8B92A3]' : 'text-workflow-primary'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">{title}</h4>
            {comingSoon && (
              <span className="text-xs px-2 py-0.5 bg-[#F8FAFC] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] rounded">
                Soon
              </span>
            )}
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-workflow-primary"></div>
            )}
          </div>
          <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default ExportModal;

