import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ResumeBuilder from '../../components/resume-builder/ResumeBuilder';
import ExportModal from '../../components/resume-builder/ExportModal';
import { resumeService } from '../../services/resumeService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ResumeBuilderAIEnhancement = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load saved resume from database
  useEffect(() => {
    if (user) {
      loadResume();
    } else {
      // Load from localStorage as fallback
      const saved = localStorage.getItem('resume-draft');
      if (saved) {
        try {
          setResumeData(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved resume:', error);
        }
      }
      setLoading(false);
    }
  }, [user, searchParams, location]);

  const loadResume = async () => {
    try {
      setLoading(true);
      
      // Check if a specific resume ID is provided in URL
      const resumeId = searchParams.get('resumeId');
      
      if (resumeId) {
        // Load specific resume by ID
        try {
          // Try multiple times in case the database hasn't fully saved yet
          let resume = null;
          let attempts = 0;
          const maxAttempts = 3;
          
          while (attempts < maxAttempts && !resume) {
            try {
              resume = await resumeService.getById(resumeId);
              if (resume && resume.content_json) {
                break;
              }
            } catch (err) {
              console.warn(`Attempt ${attempts + 1} failed to load resume:`, err.message);
            }
            
            if (!resume || !resume.content_json) {
              attempts++;
              if (attempts < maxAttempts) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          if (resume && resume.content_json) {
            const convertedData = convertResumeToBuilderFormat(resume);
            setResumeData(convertedData);
            console.log('Loaded resume data:', convertedData); // Debug log
            return;
          } else {
            console.warn('Resume not found or content_json is missing after retries');
            showError('Resume not found. Loading your most recent resume...');
          }
        } catch (error) {
          console.error('Error loading resume by ID:', error);
          showError('Failed to load resume. Loading your most recent resume...');
        }
      }
      
      // Otherwise, load all resumes and get default or most recent
      const resumes = await resumeService.getAll();
      if (resumes && resumes.length > 0) {
        // Load default resume or most recent
        const defaultResume = resumes.find(r => r.is_default) || resumes[0];
        if (defaultResume) {
          setResumeData(convertResumeToBuilderFormat(defaultResume));
        }
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('resume-draft');
      if (saved) {
        try {
          setResumeData(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading from localStorage:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Convert resume from database format to builder format
  const convertResumeToBuilderFormat = (resume) => {
    const content = resume.content_json || {};
    
    // If resume already has sections (builder format), use it directly
    if (content.sections && Array.isArray(content.sections)) {
      return {
        sections: content.sections,
        template: content.template || 'modern',
        id: resume.id,
        title: resume.title,
      };
    }
    
    // Otherwise, convert AI-generated format to builder format
    const sections = [];
    
    // Summary section
    if (content.summary) {
      sections.push({
        id: `section-${resume.id}-summary`,
        type: 'summary',
        content: `<p>${content.summary}</p>`,
        order: 0,
      });
    }
    
    // Experience section
    if (content.experience && Array.isArray(content.experience)) {
      const experienceContent = content.experience.map((exp, idx) => {
        const bullets = exp.bullets ? exp.bullets.map(b => `<li>${b}</li>`).join('') : '';
        return `
          <div class="experience-item">
            <h3>${exp.title || 'Position'} - ${exp.company || 'Company'}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${exp.duration || ''}</p>
            ${bullets ? `<ul>${bullets}</ul>` : ''}
          </div>
        `;
      }).join('');
      
      sections.push({
        id: `section-${resume.id}-experience`,
        type: 'experience',
        content: experienceContent,
        order: 1,
      });
    }
    
    // Skills section
    if (content.skills) {
      let skillsContent = '';
      if (typeof content.skills === 'object' && !Array.isArray(content.skills)) {
        // Handle skills object with categories
        skillsContent = Object.entries(content.skills).map(([category, skills]) => {
          const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;
          return `<h3>${category}</h3><p>${skillsList}</p>`;
        }).join('');
      } else if (Array.isArray(content.skills)) {
        skillsContent = `<p>${content.skills.join(', ')}</p>`;
      } else {
        skillsContent = `<p>${content.skills}</p>`;
      }
      
      sections.push({
        id: `section-${resume.id}-skills`,
        type: 'skills',
        content: skillsContent,
        order: 2,
      });
    }
    
    // Education section
    if (content.education && Array.isArray(content.education)) {
      const educationContent = content.education.map(edu => 
        `<div class="education-item">
          <h3>${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">${edu.year || ''}</p>
        </div>`
      ).join('');
      
      sections.push({
        id: `section-${resume.id}-education`,
        type: 'education',
        content: educationContent,
        order: 3,
      });
    }
    
    return {
      sections,
      template: content.template || content.style || 'modern',
      id: resume.id,
      title: resume.title,
    };
  };

  const handleSave = async (data) => {
    if (!user) {
      showError('Please sign in to save your resume');
      navigate('/login');
      return;
    }

    try {
      if (resumeData?.id) {
        // Update existing resume
        await resumeService.update(resumeData.id, {
          title: data.title || 'My Resume',
          content_json: data,
        });
        success('Resume updated successfully');
      } else {
        // Create new resume
        const newResume = await resumeService.create({
          title: data.title || 'My Resume',
          content: data,
          isDefault: true,
        });
        setResumeData({ ...data, id: newResume.id });
        success('Resume saved successfully');
      }
      
      // Also save to localStorage as backup
      localStorage.setItem('resume-draft', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving resume:', error);
      showError('Failed to save resume. Please try again.');
      // Fallback to localStorage
      localStorage.setItem('resume-draft', JSON.stringify(data));
    }
  };

  const handleExport = async (data) => {
    // Set the resume data for export
    if (data) {
      setResumeData(prev => ({ ...prev, ...data }));
    }
    setShowExportModal(true);
  };

  const handleAIGenerated = async (aiResume) => {
    try {
      // Convert AI-generated resume to builder format
      const sections = [];
      
      if (aiResume.summary) {
        sections.push({
          id: `section-${Date.now()}-summary`,
          type: 'summary',
          content: `<p>${aiResume.summary}</p>`,
          order: 0,
        });
      }

      if (aiResume.experience && aiResume.experience.length > 0) {
        const experienceContent = aiResume.experience.map(exp => 
          `<h3>${exp.title} - ${exp.company}</h3><p>${exp.description || ''}</p>`
        ).join('');
        sections.push({
          id: `section-${Date.now()}-experience`,
          type: 'experience',
          content: experienceContent,
          order: 1,
        });
      }

      if (aiResume.skills) {
        const skillsContent = Object.entries(aiResume.skills).map(([category, skills]) =>
          `<h3>${category}</h3><p>${Array.isArray(skills) ? skills.join(', ') : skills}</p>`
        ).join('');
        sections.push({
          id: `section-${Date.now()}-skills`,
          type: 'skills',
          content: skillsContent,
          order: 2,
        });
      }

      if (aiResume.education && aiResume.education.length > 0) {
        const educationContent = aiResume.education.map(edu =>
          `<h3>${edu.degree} - ${edu.institution}</h3><p>${edu.year || ''}</p>`
        ).join('');
        sections.push({
          id: `section-${Date.now()}-education`,
          type: 'education',
          content: educationContent,
          order: 3,
        });
      }

      const newResumeData = {
        sections,
        template: 'modern',
      };

      setResumeData(newResumeData);
      // Save the resume
      if (user) {
        await handleSave(newResumeData);
        success('AI resume generated and saved! Review and edit as needed.');
      } else {
        // Save to localStorage if not logged in
        localStorage.setItem('resume-draft', JSON.stringify(newResumeData));
        success('AI resume generated! Sign in to save to the cloud.');
      }
    } catch (error) {
      console.error('Error processing AI resume:', error);
      showError('Failed to process AI-generated resume');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0A0E27] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Resume Builder - Workflow</title>
        <meta name="description" content="Create professional resumes with drag-and-drop builder and AI-powered optimization." />
      </Helmet>
      <div className="bg-white dark:bg-[#0A0E27] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb />
          {!user && (
            <div className="mb-4 bg-workflow-primary-50 dark:bg-workflow-primary-900/20 border border-workflow-primary-200 dark:border-workflow-primary-800 rounded-lg p-4">
              <p className="text-sm text-workflow-primary-700 dark:text-workflow-primary-300">
                Sign in to save your resume to the cloud and access it from anywhere.
              </p>
            </div>
          )}
          
          {/* AI Generate Button */}
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => navigate('/resume-generator-ai')}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Icon name="Sparkles" size={18} />
              Generate with AI
            </Button>
          </div>

          <ResumeBuilder
            initialData={resumeData}
            onSave={handleSave}
            onExport={handleExport}
          />

          {/* Export Modal */}
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            resumeData={resumeData}
            template={resumeData?.template || 'modern'}
          />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilderAIEnhancement;