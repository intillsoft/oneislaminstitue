import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportOptions = ({ onClose, resumeData, template }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const formats = [
    {
      id: 'pdf',
      name: 'PDF',
      icon: 'FileText',
      description: 'Best for job applications',
      recommended: true
    },
    {
      id: 'word',
      name: 'Word Document',
      icon: 'FileEdit',
      description: 'Editable format for further customization',
      recommended: false
    },
    {
      id: 'ats',
      name: 'ATS-Optimized',
      icon: 'FileCheck',
      description: 'Plain text format for ATS systems',
      recommended: false
    }
  ];

  const handleExport = () => {
    // In a real app, this would generate and download the file
    console.log('Exporting resume as:', selectedFormat);
    alert(`Resume exported as ${selectedFormat?.toUpperCase()} successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Export Resume</h2>
            <p className="text-sm text-text-secondary mt-1">Choose your preferred format</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            {formats?.map((format) => (
              <div
                key={format?.id}
                onClick={() => setSelectedFormat(format?.id)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFormat === format?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    selectedFormat === format?.id ? 'bg-primary text-white' : 'bg-surface text-text-primary'
                  }`}>
                    <Icon name={format?.icon} size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-text-primary">{format?.name}</h3>
                      {format?.recommended && (
                        <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">{format?.description}</p>
                  </div>
                  {selectedFormat === format?.id && (
                    <Icon name="CheckCircle" size={20} className="text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Resume Info */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
              <Icon name="Info" size={16} />
              <span>Resume Details</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Template:</span>
                <span className="text-text-primary font-medium">{template?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">ATS Score:</span>
                <span className="text-success font-medium">{template?.atsScore || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Completion:</span>
                <span className="text-text-primary font-medium">100%</span>
              </div>
            </div>
          </div>

          {/* Export Tips */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-text-primary mb-2 flex items-center space-x-2">
              <Icon name="Lightbulb" size={16} />
              <span>Export Tips</span>
            </h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• PDF format is universally accepted and preserves formatting</li>
              <li>• Word format allows for further editing and customization</li>
              <li>• ATS-optimized format ensures maximum compatibility with applicant tracking systems</li>
              <li>• Always review your resume before submitting to potential employers</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center space-x-2"
          >
            <Icon name="Download" size={16} />
            <span>Export as {formats?.find(f => f?.id === selectedFormat)?.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;