import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SmartFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMatchScoreChange = (value) => {
    onFilterChange({ ...filters, minMatch: parseInt(value) });
  };

  const handleRemoteChange = (value) => {
    onFilterChange({ ...filters, remote: value === 'all' ? null : value === 'remote' });
  };

  return (
    <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-[#1E2640] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-[#E8EAED] flex items-center space-x-2">
          <Icon name="SlidersHorizontal" size={20} />
          <span>Smart Filters</span>
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary dark:text-[#8B92A3] hover:text-text-primary dark:hover:text-[#E8EAED]"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </button>
      </div>
      {isExpanded && (
        <div className="space-y-6">
          {/* Match Score Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-3">
              Minimum Match Score: {filters?.minMatch}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={filters?.minMatch || 70}
              onChange={(e) => handleMatchScoreChange(e?.target?.value)}
              className="w-full h-2 bg-surface dark:bg-[#1A2139] rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-text-secondary dark:text-[#8B92A3] mt-1">
              <span>1%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Work Location */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-[#E8EAED] mb-3">
              Work Location
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="location"
                  value="all"
                  checked={filters?.remote === null}
                  onChange={(e) => handleRemoteChange(e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-primary dark:text-[#E8EAED]">All Locations</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="location"
                  value="remote"
                  checked={filters?.remote === true}
                  onChange={(e) => handleRemoteChange(e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-primary dark:text-[#E8EAED]">Remote Only</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="location"
                  value="onsite"
                  checked={filters?.remote === false}
                  onChange={(e) => handleRemoteChange(e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-primary dark:text-[#E8EAED]">On-site Only</span>
              </label>
            </div>
          </div>

          {/* Success Probability */}
          <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 dark:border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-semibold text-text-primary dark:text-[#E8EAED]">AI Insight</span>
            </div>
            <p className="text-xs text-text-secondary dark:text-[#8B92A3]">
              Jobs with 80%+ match score have a 92% higher application success rate for profiles like yours.
            </p>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => onFilterChange({ minMatch: 1, remote: null, salaryRange: null, industry: [] })}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <Icon name="RefreshCw" size={14} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartFilters;