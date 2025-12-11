import React from 'react';

const SearchFilters = ({ selectedFilters, onFilterChange, onClearAll, activeFiltersCount, onClose, filters }) => {
  // Use filters prop if provided, otherwise use selectedFilters
  const currentFilters = filters || selectedFilters;
  
  // Global locations by continent/country
  const locations = {
    'North America': [
      'United States',
      'Canada',
      'Mexico',
      'San Francisco, CA, USA',
      'New York, NY, USA',
      'Los Angeles, CA, USA',
      'Chicago, IL, USA',
      'Austin, TX, USA',
      'Seattle, WA, USA',
      'Boston, MA, USA',
      'Miami, FL, USA',
      'Toronto, ON, Canada',
      'Vancouver, BC, Canada',
      'Montreal, QC, Canada',
      'Mexico City, Mexico',
    ],
    'Europe': [
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Netherlands',
      'Sweden',
      'Switzerland',
      'London, UK',
      'Berlin, Germany',
      'Paris, France',
      'Amsterdam, Netherlands',
      'Barcelona, Spain',
      'Rome, Italy',
      'Stockholm, Sweden',
      'Zurich, Switzerland',
    ],
    'Asia': [
      'India',
      'China',
      'Japan',
      'Singapore',
      'South Korea',
      'United Arab Emirates',
      'Bangalore, India',
      'Mumbai, India',
      'Delhi, India',
      'Shanghai, China',
      'Beijing, China',
      'Tokyo, Japan',
      'Seoul, South Korea',
      'Dubai, UAE',
      'Hong Kong',
    ],
    'Australia & Oceania': [
      'Australia',
      'New Zealand',
      'Sydney, Australia',
      'Melbourne, Australia',
      'Auckland, New Zealand',
    ],
    'South America': [
      'Brazil',
      'Argentina',
      'Chile',
      'São Paulo, Brazil',
      'Buenos Aires, Argentina',
      'Santiago, Chile',
    ],
    'Africa': [
      'South Africa',
      'Nigeria',
      'Kenya',
      'Cairo, Egypt',
      'Johannesburg, South Africa',
      'Lagos, Nigeria',
      'Nairobi, Kenya',
    ],
  };

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship'
  ];

  const experienceLevels = [
    'Entry-level',
    'Mid-level',
    'Senior',
    'Executive'
  ];

  const companySizes = [
    '1-10',
    '10-50',
    '50-100',
    '100-200',
    '200-500',
    '500+'
  ];

  const salaryRanges = [
    '$40,000 - $60,000',
    '$60,000 - $80,000',
    '$80,000 - $100,000',
    '$100,000 - $120,000',
    '$120,000 - $150,000',
    '$150,000+',
    '€30,000 - €50,000',
    '€50,000 - €70,000',
    '€70,000 - €90,000',
    '€90,000+',
    '₹5,00,000 - ₹10,00,000',
    '₹10,00,000 - ₹20,00,000',
    '₹20,00,000+',
  ];

  const postingDates = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '3d', label: 'Last 3 days' },
    { value: '7d', label: 'Last week' },
    { value: '30d', label: 'Last month' }
  ];

  const handleLocationChange = (location) => {
    const currentLocations = currentFilters?.location || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location];
    onFilterChange('location', newLocations);
  };

  const handleEmploymentTypeChange = (type) => {
    const currentTypes = currentFilters?.employmentType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange('employmentType', newTypes);
  };

  return (
    <div className="bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-soft overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary dark:text-white">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium"
          >
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>
      <div className="space-y-6">
        {/* Location Filter - Global */}
        <div>
          <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">Location</h4>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {Object.entries(locations).map(([continent, cities]) => (
              <div key={continent}>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  {continent}
                </p>
                <div className="space-y-2 pl-2">
                  {cities.map((location) => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(currentFilters?.location || []).includes(location)}
                        onChange={() => handleLocationChange(location)}
                        className="w-4 h-4 text-primary-600 dark:text-primary-400 border-border dark:border-gray-600 rounded focus:ring-primary-500 dark:bg-[#13182E]"
                      />
                      <span className="text-sm text-text-secondary dark:text-gray-400">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">Employment Type</h4>
          <div className="space-y-2">
            {employmentTypes?.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(currentFilters?.employmentType || []).includes(type)}
                  onChange={() => handleEmploymentTypeChange(type)}
                  className="w-4 h-4 text-primary-600 dark:text-primary-400 border-border dark:border-gray-600 rounded focus:ring-primary-500 dark:bg-[#13182E]"
                />
                <span className="text-sm text-text-secondary dark:text-gray-400">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">Experience Level</h4>
          <select
            value={currentFilters?.experienceLevel || ''}
            onChange={(e) => onFilterChange('experienceLevel', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background dark:bg-[#13182E] text-text-primary dark:text-white"
          >
            <option value="">Any level</option>
            {experienceLevels?.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Salary Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">Salary Range</h4>
          <select
            value={currentFilters?.salaryRange || ''}
            onChange={(e) => onFilterChange('salaryRange', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background dark:bg-[#13182E] text-text-primary dark:text-white"
          >
            <option value="">Any salary</option>
            {salaryRanges?.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Company Size Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">Company Size</h4>
          <select
            value={currentFilters?.companySize || ''}
            onChange={(e) => onFilterChange('companySize', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background dark:bg-[#13182E] text-text-primary dark:text-white"
          >
            <option value="">Any size</option>
            {companySizes?.map((size) => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
        </div>

        {/* Posting Date Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary dark:text-white mb-3">Posted</h4>
          <div className="space-y-2">
            {postingDates?.map((date) => (
              <label key={date?.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="postingDate"
                  value={date?.value}
                  checked={(currentFilters?.postingDate || '') === date?.value}
                  onChange={(e) => onFilterChange('postingDate', e?.target?.value)}
                  className="w-4 h-4 text-primary-600 dark:text-primary-400 border-border dark:border-gray-600 focus:ring-primary-500 dark:bg-[#13182E]"
                />
                <span className="text-sm text-text-secondary dark:text-gray-400">{date?.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Remote Work Filter */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters?.remoteWork || false}
              onChange={(e) => onFilterChange('remoteWork', e?.target?.checked)}
              className="w-4 h-4 text-primary-600 dark:text-primary-400 border-border dark:border-gray-600 rounded focus:ring-primary-500 dark:bg-[#13182E]"
            />
            <span className="text-sm font-medium text-text-primary dark:text-white">Remote work only</span>
          </label>
        </div>
      </div>
      {onClose && (
        <div className="mt-6 pt-6 border-t border-border dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
