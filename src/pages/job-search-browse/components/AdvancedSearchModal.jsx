import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AdvancedSearchModal = ({ isOpen, onClose, selectedFilters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(selectedFilters);

  if (!isOpen) return null;

  const handleLocalFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    Object.keys(localFilters)?.forEach(key => {
      onFilterChange(key, localFilters?.[key]);
    });
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      location: [],
      employmentType: [],
      salaryRange: '',
      companySize: '',
      postingDate: '',
      experienceLevel: '',
      remoteWork: false
    };
    setLocalFilters(resetFilters);
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Design',
    'Engineering',
    'Operations',
    'Human Resources'
  ];

  const skills = [
    'JavaScript',
    'React',
    'Python',
    'Node.js',
    'SQL',
    'AWS',
    'Docker',
    'Git',
    'TypeScript',
    'MongoDB'
  ];

  const benefits = [
    'Health Insurance',
    'Dental Insurance',
    'Vision Insurance',
    '401(k)',
    'Paid Time Off',
    'Flexible Schedule',
    'Work From Home',
    'Professional Development',
    'Stock Options',
    'Gym Membership'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black/50 dark:bg-black/70" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-[#13182E] shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Search</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Product Manager, UX Design"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Developer, Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft, Startup"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Industry
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white">
                  <option value="">Any industry</option>
                  {industries?.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 80000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Maximum Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 150000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:border-transparent bg-white dark:bg-[#1A2139] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Required Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skills?.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-workflow-primary border-gray-300 dark:border-gray-600 rounded focus:ring-workflow-primary bg-white dark:bg-[#1A2139]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Benefits & Perks
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {benefits?.map((benefit) => (
                  <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-workflow-primary border-gray-300 dark:border-gray-600 rounded focus:ring-workflow-primary bg-white dark:bg-[#1A2139]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters?.remoteWork}
                  onChange={(e) => handleLocalFilterChange('remoteWork', e?.target?.checked)}
                  className="w-4 h-4 text-workflow-primary border-gray-300 dark:border-gray-600 rounded focus:ring-workflow-primary bg-white dark:bg-[#1A2139]"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Remote work opportunities</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-workflow-primary border-gray-300 dark:border-gray-600 rounded focus:ring-workflow-primary bg-white dark:bg-[#1A2139]"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Include internships</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-workflow-primary border-gray-300 dark:border-gray-600 rounded focus:ring-workflow-primary bg-white dark:bg-[#1A2139]"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Exclude staffing agencies</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1A2139]">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
            >
              Reset All
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 text-sm font-medium bg-workflow-primary text-white hover:bg-workflow-primary-600 rounded-lg transition-smooth"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;