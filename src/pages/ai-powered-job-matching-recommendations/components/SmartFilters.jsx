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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 underline decoration-workflow-primary decoration-4 underline-offset-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Icon name="SlidersHorizontal" size={20} />
          </div>
          <span>Precision Filters</span>
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={18} />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Match Score Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                Neural Threshold
              </label>
              <span className="text-sm font-black text-workflow-primary bg-workflow-primary/10 px-2 py-0.5 rounded-md">
                {filters?.minMatch}%
              </span>
            </div>
            <div className="relative h-6 flex items-center">
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={filters?.minMatch || 70}
                onChange={(e) => handleMatchScoreChange(e?.target?.value)}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-workflow-primary"
              />
            </div>
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <span>Broad Match</span>
              <span>Elite Only</span>
            </div>
          </div>

          {/* Location Cluster */}
          <FilterSection label="Location Architecture" icon="MapPin">
            <div className="space-y-2">
              <FilterCheckbox label="North America" count="1.2k" />
              <div className="pl-4 space-y-1">
                <FilterCheckbox label="United States" count="842" />
                <FilterCheckbox label="San Francisco" count="124" />
                <FilterCheckbox label="New York" count="98" />
              </div>
              <FilterCheckbox label="Europe" count="940" />
              <div className="pl-4 space-y-1">
                <FilterCheckbox label="London" count="56" />
                <FilterCheckbox label="Berlin" count="42" />
              </div>
            </div>
          </FilterSection>

          {/* Deployment Type */}
          <FilterSection label="Deployment Cycle" icon="Briefcase">
            <div className="grid grid-cols-1 gap-2">
              <FilterRadio
                label="Full-time Synthesis"
                value="all"
                checked={true}
                onChange={() => { }}
              />
              <FilterRadio
                label="Contract / Gig"
                value="contract"
                onChange={() => { }}
              />
              <FilterRadio
                label="Internship Node"
                value="intern"
                onChange={() => { }}
              />
            </div>
          </FilterSection>

          {/* Work Location */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Icon name="Globe" size={14} />
              Deployment Vector
            </label>
            <div className="flex flex-col gap-2">
              <FilterRadio
                label="Global Presence (Hybrid)"
                value="all"
                checked={filters?.remote === null}
                onChange={handleRemoteChange}
              />
              <FilterRadio
                label="Remote Synthesis"
                value="remote"
                checked={filters?.remote === true}
                onChange={handleRemoteChange}
              />
              <FilterRadio
                label="Local Physical Node"
                value="onsite"
                checked={filters?.remote === false}
                onChange={handleRemoteChange}
              />
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => onFilterChange({ minMatch: 1, remote: null, salaryRange: null, industry: [] })}
            className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <Icon name="RefreshCw" size={16} />
            Reset Matrix
          </button>
        </div>
      )}
    </div>
  );
};

const FilterSection = ({ label, icon, children }) => (
  <div className="space-y-4">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
      <Icon name={icon} size={14} />
      {label}
    </label>
    {children}
  </div>
);

const FilterCheckbox = ({ label, count }) => (
  <label className="flex items-center justify-between group cursor-pointer py-1">
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-700 group-hover:border-workflow-primary transition-colors flex items-center justify-center">
        {/* Checkmark icon could go here if checked */}
      </div>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
    {count && (
      <span className="text-[10px] font-black text-slate-400 group-hover:text-workflow-primary transition-colors">
        {count}
      </span>
    )}
    <input type="checkbox" className="hidden" />
  </label>
);

const FilterRadio = ({ label, value, checked, onChange }) => (
  <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${checked
    ? 'border-workflow-primary bg-workflow-primary/5 text-slate-900 dark:text-white'
    : 'border-slate-200 dark:border-white/5 bg-white/30 dark:bg-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/10'
    }`}>
    <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${checked ? 'border-workflow-primary' : 'border-slate-300 dark:border-slate-700'}`}>
      {checked && <div className="w-2 h-2 rounded-full bg-workflow-primary animate-in fade-in zoom-in duration-300" />}
    </div>
    <input
      type="radio"
      name="location"
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="hidden"
    />
  </label>
);

export default SmartFilters;
