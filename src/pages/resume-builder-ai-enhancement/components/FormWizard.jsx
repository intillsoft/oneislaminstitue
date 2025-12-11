import React from 'react';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';


const FormWizard = ({ currentStep, resumeData, onDataUpdate, onStepChange, steps }) => {
  const handleNext = () => {
    if (currentStep < steps?.length) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 2: // Personal Info
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Personal Information</h2>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={resumeData?.personalInfo?.fullName || ''}
              onChange={(e) => onDataUpdate('personalInfo', { ...resumeData?.personalInfo, fullName: e?.target?.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
              value={resumeData?.personalInfo?.email || ''}
              onChange={(e) => onDataUpdate('personalInfo', { ...resumeData?.personalInfo, email: e?.target?.value })}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={resumeData?.personalInfo?.phone || ''}
              onChange={(e) => onDataUpdate('personalInfo', { ...resumeData?.personalInfo, phone: e?.target?.value })}
            />
            <Input
              label="Location"
              placeholder="San Francisco, CA"
              value={resumeData?.personalInfo?.location || ''}
              onChange={(e) => onDataUpdate('personalInfo', { ...resumeData?.personalInfo, location: e?.target?.value })}
            />
            <Input
              label="LinkedIn URL"
              placeholder="linkedin.com/in/johndoe"
              value={resumeData?.personalInfo?.linkedIn || ''}
              onChange={(e) => onDataUpdate('personalInfo', { ...resumeData?.personalInfo, linkedIn: e?.target?.value })}
            />
            <Input
              label="Portfolio URL"
              placeholder="johndoe.com"
              value={resumeData?.personalInfo?.portfolio || ''}
              onChange={(e) => onDataUpdate('personalInfo', { ...resumeData?.personalInfo, portfolio: e?.target?.value })}
            />
          </div>
        );

      case 3: // Professional Summary
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Professional Summary</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Summary
              </label>
              <textarea
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                rows={6}
                placeholder="Write a compelling summary that highlights your key qualifications and career objectives..."
                value={resumeData?.professionalSummary || ''}
                onChange={(e) => onDataUpdate('professionalSummary', e?.target?.value)}
              />
              <p className="text-xs text-text-secondary mt-2">
                Tip: Keep it concise (3-4 sentences) and focus on your unique value proposition
              </p>
            </div>
          </div>
        );

      case 4: // Work Experience
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Work Experience</h2>
              <button
                onClick={() => {
                  const newExperience = {
                    title: '',
                    company: '',
                    duration: '',
                    description: ''
                  };
                  onDataUpdate('workExperience', [...(resumeData?.workExperience || []), newExperience]);
                }}
                className="btn-secondary text-sm flex items-center space-x-1"
              >
                <Icon name="Plus" size={16} />
                <span>Add Experience</span>
              </button>
            </div>
            {resumeData?.workExperience?.length > 0 ? (
              <div className="space-y-6">
                {resumeData?.workExperience?.map((exp, index) => (
                  <div key={index} className="p-4 bg-surface rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-text-primary">Position {index + 1}</span>
                      <button
                        onClick={() => {
                          const updated = resumeData?.workExperience?.filter((_, i) => i !== index);
                          onDataUpdate('workExperience', updated);
                        }}
                        className="text-error hover:text-error-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        label="Job Title"
                        placeholder="Senior Software Engineer"
                        value={exp?.title || ''}
                        onChange={(e) => {
                          const updated = [...resumeData?.workExperience];
                          updated[index] = { ...updated?.[index], title: e?.target?.value };
                          onDataUpdate('workExperience', updated);
                        }}
                      />
                      <Input
                        label="Company"
                        placeholder="Tech Corp Inc."
                        value={exp?.company || ''}
                        onChange={(e) => {
                          const updated = [...resumeData?.workExperience];
                          updated[index] = { ...updated?.[index], company: e?.target?.value };
                          onDataUpdate('workExperience', updated);
                        }}
                      />
                      <Input
                        label="Duration"
                        placeholder="Jan 2020 - Present"
                        value={exp?.duration || ''}
                        onChange={(e) => {
                          const updated = [...resumeData?.workExperience];
                          updated[index] = { ...updated?.[index], duration: e?.target?.value };
                          onDataUpdate('workExperience', updated);
                        }}
                      />
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                        <textarea
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                          rows={3}
                          placeholder="Describe your responsibilities and achievements..."
                          value={exp?.description || ''}
                          onChange={(e) => {
                            const updated = [...resumeData?.workExperience];
                            updated[index] = { ...updated?.[index], description: e?.target?.value };
                            onDataUpdate('workExperience', updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="Briefcase" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No work experience added yet</p>
              </div>
            )}
          </div>
        );

      case 5: // Education
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Education</h2>
              <button
                onClick={() => {
                  const newEducation = {
                    degree: '',
                    institution: '',
                    year: ''
                  };
                  onDataUpdate('education', [...(resumeData?.education || []), newEducation]);
                }}
                className="btn-secondary text-sm flex items-center space-x-1"
              >
                <Icon name="Plus" size={16} />
                <span>Add Education</span>
              </button>
            </div>
            {resumeData?.education?.length > 0 ? (
              <div className="space-y-4">
                {resumeData?.education?.map((edu, index) => (
                  <div key={index} className="p-4 bg-surface rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-text-primary">Education {index + 1}</span>
                      <button
                        onClick={() => {
                          const updated = resumeData?.education?.filter((_, i) => i !== index);
                          onDataUpdate('education', updated);
                        }}
                        className="text-error hover:text-error-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        label="Degree"
                        placeholder="Bachelor of Science in Computer Science"
                        value={edu?.degree || ''}
                        onChange={(e) => {
                          const updated = [...resumeData?.education];
                          updated[index] = { ...updated?.[index], degree: e?.target?.value };
                          onDataUpdate('education', updated);
                        }}
                      />
                      <Input
                        label="Institution"
                        placeholder="Stanford University"
                        value={edu?.institution || ''}
                        onChange={(e) => {
                          const updated = [...resumeData?.education];
                          updated[index] = { ...updated?.[index], institution: e?.target?.value };
                          onDataUpdate('education', updated);
                        }}
                      />
                      <Input
                        label="Year"
                        placeholder="2018 - 2022"
                        value={edu?.year || ''}
                        onChange={(e) => {
                          const updated = [...resumeData?.education];
                          updated[index] = { ...updated?.[index], year: e?.target?.value };
                          onDataUpdate('education', updated);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="GraduationCap" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No education added yet</p>
              </div>
            )}
          </div>
        );

      case 6: // Skills
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Skills & Competencies</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Add Skills
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  id="skillInput"
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., JavaScript, React, Node.js"
                  onKeyPress={(e) => {
                    if (e?.key === 'Enter') {
                      const skill = e?.target?.value?.trim();
                      if (skill) {
                        onDataUpdate('skills', [...(resumeData?.skills || []), skill]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('skillInput');
                    const skill = input?.value?.trim();
                    if (skill) {
                      onDataUpdate('skills', [...(resumeData?.skills || []), skill]);
                      input.value = '';
                    }
                  }}
                  className="btn-primary"
                >
                  <Icon name="Plus" size={16} />
                </button>
              </div>
              
              {resumeData?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resumeData?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => {
                          const updated = resumeData?.skills?.filter((_, i) => i !== index);
                          onDataUpdate('skills', updated);
                        }}
                        className="hover:text-primary-700"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 7: // Review
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Review Your Resume</h2>
            
            <div className="bg-success/10 border border-success/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                <div>
                  <h3 className="font-semibold text-success mb-1">Resume Complete!</h3>
                  <p className="text-sm text-text-secondary">
                    Your resume is ready to export. Review the preview on the right and make any final adjustments.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-border">
                <h3 className="font-semibold text-text-primary mb-2">Completeness Check</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name={resumeData?.personalInfo?.fullName ? "CheckCircle" : "Circle"} size={16} className={resumeData?.personalInfo?.fullName ? "text-success" : "text-text-muted"} />
                    <span className="text-sm text-text-secondary">Personal Information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name={resumeData?.professionalSummary ? "CheckCircle" : "Circle"} size={16} className={resumeData?.professionalSummary ? "text-success" : "text-text-muted"} />
                    <span className="text-sm text-text-secondary">Professional Summary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name={resumeData?.workExperience?.length > 0 ? "CheckCircle" : "Circle"} size={16} className={resumeData?.workExperience?.length > 0 ? "text-success" : "text-text-muted"} />
                    <span className="text-sm text-text-secondary">Work Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name={resumeData?.education?.length > 0 ? "CheckCircle" : "Circle"} size={16} className={resumeData?.education?.length > 0 ? "text-success" : "text-text-muted"} />
                    <span className="text-sm text-text-secondary">Education</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name={resumeData?.skills?.length > 0 ? "CheckCircle" : "Circle"} size={16} className={resumeData?.skills?.length > 0 ? "text-success" : "text-text-muted"} />
                    <span className="text-sm text-text-secondary">Skills</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-text-primary mb-2 flex items-center space-x-2">
                  <Icon name="Lightbulb" size={16} />
                  <span>Pro Tips</span>
                </h3>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Keep your resume to 1-2 pages</li>
                  <li>• Use action verbs and quantify achievements</li>
                  <li>• Tailor your resume for each job application</li>
                  <li>• Proofread for grammar and spelling errors</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border border-border p-6">
      {renderStepContent()}
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="ChevronLeft" size={16} />
          <span>Previous</span>
        </button>

        <span className="text-sm text-text-secondary">
          Step {currentStep} of {steps?.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentStep === steps?.length}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>
    </div>
  );
};

export default FormWizard;