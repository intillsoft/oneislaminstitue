import React from 'react';
import Icon from 'components/AppIcon';

const ResumePreview = ({ template, data, onChangeTemplate }) => {
  return (
    <div className="bg-background rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="Eye" size={20} />
          <span>Live Preview</span>
        </h3>
        <button
          onClick={onChangeTemplate}
          className="text-sm text-primary hover:text-primary-700 flex items-center space-x-1"
        >
          <Icon name="RefreshCw" size={14} />
          <span>Change Template</span>
        </button>
      </div>
      {/* Resume Preview Content */}
      <div className="bg-white border border-border rounded-lg p-8 min-h-[800px] shadow-sm">
        {template ? (
          <div className="space-y-6">
            {/* Header Section */}
            {data?.personalInfo?.fullName && (
              <div className="text-center pb-4 border-b-2 border-primary">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {data?.personalInfo?.fullName}
                </h1>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-text-secondary">
                  {data?.personalInfo?.email && (
                    <span className="flex items-center space-x-1">
                      <Icon name="Mail" size={14} />
                      <span>{data?.personalInfo?.email}</span>
                    </span>
                  )}
                  {data?.personalInfo?.phone && (
                    <span className="flex items-center space-x-1">
                      <Icon name="Phone" size={14} />
                      <span>{data?.personalInfo?.phone}</span>
                    </span>
                  )}
                  {data?.personalInfo?.location && (
                    <span className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{data?.personalInfo?.location}</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Professional Summary */}
            {data?.professionalSummary && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2 flex items-center space-x-2">
                  <Icon name="FileText" size={18} />
                  <span>Professional Summary</span>
                </h2>
                <p className="text-text-secondary leading-relaxed">{data?.professionalSummary}</p>
              </div>
            )}

            {/* Work Experience */}
            {data?.workExperience?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center space-x-2">
                  <Icon name="Briefcase" size={18} />
                  <span>Work Experience</span>
                </h2>
                <div className="space-y-4">
                  {data?.workExperience?.map((exp, index) => (
                    <div key={index} className="pl-4 border-l-2 border-primary">
                      <h3 className="font-semibold text-text-primary">{exp?.title}</h3>
                      <p className="text-sm text-text-secondary">{exp?.company} • {exp?.duration}</p>
                      <p className="text-sm text-text-secondary mt-2">{exp?.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data?.education?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center space-x-2">
                  <Icon name="GraduationCap" size={18} />
                  <span>Education</span>
                </h2>
                <div className="space-y-3">
                  {data?.education?.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-text-primary">{edu?.degree}</h3>
                      <p className="text-sm text-text-secondary">{edu?.institution} • {edu?.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {data?.skills?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center space-x-2">
                  <Icon name="Award" size={18} />
                  <span>Skills</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name="FileText" size={48} className="text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Template Selected</h3>
            <p className="text-text-secondary">Choose a template to start building your resume</p>
          </div>
        )}
      </div>
      {/* Template Info */}
      {template && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">{template?.name}</p>
              <p className="text-xs text-text-secondary">ATS Score: {template?.atsScore}%</p>
            </div>
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">ATS Optimized</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;