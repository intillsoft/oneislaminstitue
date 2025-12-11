import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, Plus, X } from 'lucide-react';
import { resumeService } from '../../../services/resumeService';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AIResumeResultModal = ({ isOpen, onClose, resumeData, onResumeAdded }) => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !resumeData) return null;

  const handleAddToResumes = async () => {
    try {
      setLoading(true);
      // Transform AI-generated resume to resume builder format
      const resumeSections = [];
      
      if (resumeData.summary) {
        resumeSections.push({
          type: 'summary',
          content: `<p>${resumeData.summary}</p>`,
          order: 0
        });
      }
      
      if (resumeData.experience && Array.isArray(resumeData.experience)) {
        resumeData.experience.forEach((exp, idx) => {
          resumeSections.push({
            type: 'experience',
            content: `<div>
              <h3>${exp.title || 'Position'}</h3>
              <p><strong>${exp.company || 'Company'}</strong> - ${exp.duration || 'Duration'}</p>
              <ul>
                ${exp.bullets?.map(b => `<li>${b}</li>`).join('') || ''}
              </ul>
            </div>`,
            order: 1 + idx
          });
        });
      }
      
      if (resumeData.skills) {
        const skillsContent = typeof resumeData.skills === 'object' 
          ? Object.entries(resumeData.skills).map(([cat, items]) => 
              `<div><strong>${cat}:</strong> ${Array.isArray(items) ? items.join(', ') : items}</div>`
            ).join('')
          : resumeData.skills;
        resumeSections.push({
          type: 'skills',
          content: `<div>${skillsContent}</div>`,
          order: 100
        });
      }
      
      if (resumeData.education && Array.isArray(resumeData.education)) {
        resumeData.education.forEach((edu, idx) => {
          resumeSections.push({
            type: 'education',
            content: `<div>
              <h3>${edu.degree || 'Degree'}</h3>
              <p>${edu.institution || 'Institution'} - ${edu.year || 'Year'}</p>
            </div>`,
            order: 200 + idx
          });
        });
      }

      const resumePayload = {
        title: 'AI Generated Resume',
        content_json: {
          sections: resumeSections
        },
        is_default: false
      };

      await resumeService.create(resumePayload);
      success('Resume added to your collection!');
      if (onResumeAdded) {
        onResumeAdded();
      }
      onClose();
    } catch (error) {
      console.error('Error adding resume:', error);
      showError('Failed to add resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    let text = '';
    
    if (resumeData.summary) {
      text += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
    }
    
    if (resumeData.experience && Array.isArray(resumeData.experience)) {
      text += 'EXPERIENCE\n';
      resumeData.experience.forEach(exp => {
        text += `${exp.title || 'Position'} at ${exp.company || 'Company'}\n`;
        if (exp.bullets) {
          exp.bullets.forEach(b => text += `• ${b}\n`);
        }
        text += '\n';
      });
    }
    
    if (resumeData.skills) {
      text += 'SKILLS\n';
      if (typeof resumeData.skills === 'object') {
        Object.entries(resumeData.skills).forEach(([cat, items]) => {
          text += `${cat}: ${Array.isArray(items) ? items.join(', ') : items}\n`;
        });
      } else {
        text += resumeData.skills + '\n';
      }
      text += '\n';
    }
    
    if (resumeData.education && Array.isArray(resumeData.education)) {
      text += 'EDUCATION\n';
      resumeData.education.forEach(edu => {
        text += `${edu.degree || 'Degree'} - ${edu.institution || 'Institution'} (${edu.year || 'Year'})\n`;
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      success('Resume text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      showError('Failed to copy text');
    });
  };

  const handleDownloadPDF = () => {
    // Create a simple HTML document
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #0046FF; }
            h2 { color: #333; border-bottom: 2px solid #0046FF; padding-bottom: 5px; }
            .section { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          ${resumeData.summary ? `<div class="section"><h2>Professional Summary</h2><p>${resumeData.summary}</p></div>` : ''}
          ${resumeData.experience && Array.isArray(resumeData.experience) ? `
            <div class="section">
              <h2>Experience</h2>
              ${resumeData.experience.map(exp => `
                <div style="margin-bottom: 20px;">
                  <h3>${exp.title || 'Position'}</h3>
                  <p><strong>${exp.company || 'Company'}</strong> - ${exp.duration || 'Duration'}</p>
                  <ul>
                    ${exp.bullets?.map(b => `<li>${b}</li>`).join('') || ''}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${resumeData.skills ? `
            <div class="section">
              <h2>Skills</h2>
              ${typeof resumeData.skills === 'object' 
                ? Object.entries(resumeData.skills).map(([cat, items]) => 
                    `<p><strong>${cat}:</strong> ${Array.isArray(items) ? items.join(', ') : items}</p>`
                  ).join('')
                : `<p>${resumeData.skills}</p>`
              }
            </div>
          ` : ''}
          ${resumeData.education && Array.isArray(resumeData.education) ? `
            <div class="section">
              <h2>Education</h2>
              ${resumeData.education.map(edu => `
                <p><strong>${edu.degree || 'Degree'}</strong> - ${edu.institution || 'Institution'} (${edu.year || 'Year'})</p>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.html';
    a.click();
    URL.revokeObjectURL(url);
    success('Resume downloaded!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Generated Resume" size="xl">
      <div className="space-y-6">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                Resume Generated Successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your AI-generated resume is ready. You can add it to your collection, download it, or copy the text.
              </p>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-h-96 overflow-y-auto">
          {resumeData.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Professional Summary</h3>
              <p className="text-gray-700 dark:text-gray-300">{resumeData.summary}</p>
            </div>
          )}

          {resumeData.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Experience</h3>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{exp.title || 'Position'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>{exp.company || 'Company'}</strong> - {exp.duration || 'Duration'}
                  </p>
                  {exp.bullets && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-workflow-primary mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {resumeData.skills && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Skills</h3>
              {typeof resumeData.skills === 'object' ? (
                <div className="space-y-2">
                  {Object.entries(resumeData.skills).map(([category, items], idx) => (
                    <div key={idx}>
                      <span className="font-medium text-gray-900 dark:text-white">{category}:</span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">
                        {Array.isArray(items) ? items.join(', ') : items}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{resumeData.skills}</p>
              )}
            </div>
          )}

          {resumeData.education && Array.isArray(resumeData.education) && resumeData.education.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Education</h3>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>{edu.degree || 'Degree'}</strong> - {edu.institution || 'Institution'} ({edu.year || 'Year'})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleAddToResumes}
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to My Resumes
              </>
            )}
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="secondary"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleCopyText}
            variant="secondary"
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIResumeResultModal;









