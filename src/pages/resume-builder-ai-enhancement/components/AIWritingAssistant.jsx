import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AIWritingAssistant = ({ onClose, currentSection, onApplySuggestion }) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [inputText, setInputText] = useState('');

  const suggestions = {
    'Professional Summary': [
      {
        title: 'Achievement-Focused Summary',
        content: 'Results-driven professional with 5+ years of experience delivering innovative solutions and exceeding performance targets. Proven track record of leading cross-functional teams and driving measurable business impact through strategic initiatives.',
        tags: ['ATS Optimized', 'Action Verbs']
      },
      {
        title: 'Skills-Highlighted Summary',
        content: 'Versatile professional specializing in project management, data analysis, and team leadership. Skilled in leveraging cutting-edge technologies to optimize workflows and enhance organizational efficiency.',
        tags: ['Keyword Rich', 'Concise']
      }
    ],
    'Experience': [
      {
        title: 'Bullet Point Template',
        content: '• Spearheaded [project/initiative] that resulted in [quantifiable outcome]\n• Collaborated with [team size] cross-functional team to deliver [specific result]\n• Implemented [solution/process] leading to [X%] improvement in [metric]',
        tags: ['Action Verbs', 'Quantified']
      },
      {
        title: 'Achievement Format',
        content: '• Increased revenue by 35% through strategic customer engagement initiatives\n• Reduced operational costs by $50K annually by streamlining processes\n• Managed portfolio of 15+ high-value clients with 98% retention rate',
        tags: ['Results-Driven', 'Numbers']
      }
    ]
  };

  const keywords = [
    'Strategic Planning', 'Project Management', 'Data Analysis',
    'Team Leadership', 'Process Optimization', 'Stakeholder Management',
    'Budget Management', 'Cross-functional Collaboration', 'Change Management'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Sparkles" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">AI Writing Assistant</h2>
              <p className="text-sm text-text-secondary">Get intelligent suggestions for {currentSection}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'suggestions' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Suggestions
          </button>
          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'optimize' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Optimize Text
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'keywords' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Keywords
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {suggestions?.[currentSection]?.map((suggestion, index) => (
                <div key={index} className="bg-surface rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text-primary">{suggestion?.title}</h3>
                    <button
                      onClick={() => onApplySuggestion(suggestion?.content)}
                      className="btn-primary text-sm flex items-center space-x-1"
                    >
                      <Icon name="Copy" size={14} />
                      <span>Use This</span>
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary whitespace-pre-line mb-3">
                    {suggestion?.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestion?.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No suggestions available for this section</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'optimize' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Paste your text to optimize
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  rows={8}
                  placeholder="Paste your existing content here, and AI will help you improve it..."
                  value={inputText}
                  onChange={(e) => setInputText(e?.target?.value)}
                />
              </div>

              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <Icon name="Sparkles" size={16} />
                <span>Optimize with AI</span>
              </button>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center space-x-2">
                  <Icon name="Lightbulb" size={16} />
                  <span>AI will help you:</span>
                </h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Improve clarity and conciseness</li>
                  <li>• Add action verbs and power words</li>
                  <li>• Optimize for ATS systems</li>
                  <li>• Enhance professional tone</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-text-primary mb-2">Recommended Keywords</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Include these industry-relevant keywords to improve ATS compatibility
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {keywords?.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigator.clipboard?.writeText(keyword);
                    }}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center space-x-2"
                  >
                    <span>{keyword}</span>
                    <Icon name="Copy" size={12} className="text-text-muted" />
                  </button>
                ))}
              </div>

              <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-success text-sm mb-1">Pro Tip</h4>
                    <p className="text-xs text-text-secondary">
                      Use keywords naturally in your content. Avoid keyword stuffing as it may hurt readability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Zap" size={16} />
            <span>Powered by AI</span>
          </div>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIWritingAssistant;