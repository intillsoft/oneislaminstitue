import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TemplateGallery = ({ selectedTemplate, onSelectTemplate }) => {
  const [filterIndustry, setFilterIndustry] = useState('all');

  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
      alt: 'Modern professional resume template with clean design and blue accents',
      atsScore: 98,
      description: 'Clean, ATS-friendly design perfect for tech professionals',
      features: ['ATS Optimized', 'Modern Design', 'Single Page']
    },
    {
      id: 2,
      name: 'Executive Elite',
      category: 'business',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      alt: 'Executive elite resume template with sophisticated layout for senior positions',
      atsScore: 95,
      description: 'Sophisticated layout for senior-level positions',
      features: ['Professional', 'Two Column', 'Leadership Focus']
    },
    {
      id: 3,
      name: 'Creative Portfolio',
      category: 'creative',
      thumbnail: 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400',
      alt: 'Creative portfolio resume template with visual elements for designers',
      atsScore: 92,
      description: 'Eye-catching design for creative professionals',
      features: ['Visual Appeal', 'Portfolio Section', 'Unique Layout']
    },
    {
      id: 4,
      name: 'Minimalist Pro',
      category: 'all',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      alt: 'Minimalist professional resume template with simple elegant design',
      atsScore: 99,
      description: 'Simple, elegant design that works for any industry',
      features: ['Maximum ATS', 'Clean Lines', 'Universal Appeal']
    },
    {
      id: 5,
      name: 'Healthcare Specialist',
      category: 'healthcare',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      alt: 'Healthcare specialist resume template optimized for medical professionals',
      atsScore: 96,
      description: 'Optimized for medical and healthcare professionals',
      features: ['Industry Specific', 'Certifications Focus', 'Clean Format']
    },
    {
      id: 6,
      name: 'Sales Champion',
      category: 'sales',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      alt: 'Sales champion resume template highlighting achievements and metrics',
      atsScore: 94,
      description: 'Highlights achievements and metrics for sales roles',
      features: ['Results Driven', 'Metrics Display', 'Achievement Focus']
    }
  ];

  const industries = [
    { value: 'all', label: 'All Industries', icon: 'Grid' },
    { value: 'tech', label: 'Technology', icon: 'Code' },
    { value: 'business', label: 'Business', icon: 'Briefcase' },
    { value: 'creative', label: 'Creative', icon: 'Palette' },
    { value: 'healthcare', label: 'Healthcare', icon: 'Heart' },
    { value: 'sales', label: 'Sales', icon: 'TrendingUp' }
  ];

  const filteredTemplates = filterIndustry === 'all' 
    ? templates 
    : templates?.filter(t => t?.category === filterIndustry || t?.category === 'all');

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-background rounded-lg shadow-sm border border-border p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Filter by Industry</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {industries?.map(industry => (
            <button
              key={industry?.value}
              onClick={() => setFilterIndustry(industry?.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                filterIndustry === industry?.value
                  ? 'bg-primary text-white' :'bg-surface hover:bg-surface-100 text-text-primary'
              }`}
            >
              <Icon name={industry?.icon} size={16} />
              <span className="text-sm font-medium">{industry?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates?.map(template => (
          <div
            key={template?.id}
            className={`bg-background rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
              selectedTemplate?.id === template?.id
                ? 'border-primary ring-2 ring-primary/20' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {/* Template Preview */}
            <div className="relative aspect-[3/4] rounded-t-lg overflow-hidden bg-gray-100">
              <img
                src={template?.thumbnail}
                alt={template?.alt}
                className="w-full h-full object-cover"
              />
              {selectedTemplate?.id === template?.id && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-primary text-white p-3 rounded-full">
                    <Icon name="Check" size={24} />
                  </div>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-text-primary">{template?.name}</h3>
                <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full">
                  <Icon name="Award" size={14} />
                  <span className="text-xs font-semibold">{template?.atsScore}%</span>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary mb-3">{template?.description}</p>

              <div className="flex flex-wrap gap-2">
                {template?.features?.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-surface rounded-full text-text-secondary"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <button
                className="w-full mt-4 btn-primary text-sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onSelectTemplate(template);
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;