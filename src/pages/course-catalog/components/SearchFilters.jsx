import React from 'react';
import {
  Sliders, BookOpen, GraduationCap,
  Clock, Zap, Sparkles, ChevronDown
} from 'lucide-react';

const SearchFilters = ({ selectedFilters, onFilterChange, onClearAll, activeFiltersCount, onClose, filters }) => {
  const [showMoreCategories, setShowMoreCategories] = React.useState(false);
  // Use filters prop if provided, otherwise use selectedFilters
  const currentFilters = filters || selectedFilters;

  // Islamic course categories
  const courseCategories = [
    'Quran & Tajweed',
    'Islamic Studies',
    'Hadith',
    'Islamic History',
    'Fiqh (Islamic Law)',
    'Islamic Theology',
    'Arabic Language',
    'Prophets Biography',
    'Islamic Finance',
    'Islamic Ethics',
    'Quranic Tafsir',
    'Islamic Jurisprudence'
  ];

  const visibleCategories = showMoreCategories ? courseCategories : courseCategories.slice(0, 5);

  const studyModes = ['Live Classes', 'Recorded', 'Self-Paced', 'Hybrid'];
  const academicDepths = ['Beginner', 'Intermediate', 'Advanced'];
  const languages = ['English', 'Arabic', 'Urdu', 'French', 'Spanish', 'Turkish'];
  
  const handleCategoryChange = (val) => {
    const current = currentFilters?.location || [];
    const updated = current.includes(val)
      ? current.filter(l => l !== val)
      : [...current, val];
    onFilterChange('location', updated);
  };

  const handleStudyModeChange = (mode) => {
    const currentTypes = currentFilters?.employmentType || [];
    const newTypes = currentTypes.includes(mode)
      ? currentTypes.filter(t => t !== mode)
      : [...currentTypes, mode];
    onFilterChange('employmentType', newTypes);
  };

  return (
    <div className="bg-white dark:bg-[#0f1429] p-5 rounded-[2rem] space-y-7 border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-workflow-primary" />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Refine Search</h3>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[9px] text-workflow-primary hover:text-emerald-500 font-black uppercase tracking-widest transition-all"
          >
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Course Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            Subject Area
          </div>
          <div className="space-y-1.5">
            {visibleCategories.map((category) => (
              <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(currentFilters?.location || []).includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-3.5 h-3.5 rounded-md border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-workflow-primary focus:ring-emerald-500/20 transition-all cursor-pointer"
                />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 transition-colors">{category}</span>
              </label>
            ))}
            <button 
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="text-[9px] font-black text-workflow-primary uppercase tracking-widest mt-1 hover:underline flex items-center gap-1"
            >
              {showMoreCategories ? 'Show Less' : `+ ${courseCategories.length - 5} More`}
              <ChevronDown className={`w-3 h-3 transition-transform ${showMoreCategories ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Learning Format */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Learning Format
          </div>
          <div className="space-y-1.5">
            {studyModes.map((mode) => (
              <label key={mode} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(currentFilters?.employmentType || []).includes(mode)}
                  onChange={() => handleStudyModeChange(mode)}
                  className="w-3.5 h-3.5 rounded-md border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-workflow-primary focus:ring-emerald-500/20 transition-all cursor-pointer"
                />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 transition-colors">{mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Language & Level Grid */}
        <div className="grid grid-cols-1 gap-4">
           <div className="space-y-2">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Language</div>
              <select
                value={currentFilters?.companySize || ''}
                onChange={(e) => onFilterChange('companySize', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-emerald-500/30 cursor-pointer transition-all appearance-none"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
              </select>
           </div>
           
           <div className="space-y-2">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Depth</div>
              <select
                value={currentFilters?.experienceLevel || ''}
                onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-emerald-500/30 cursor-pointer transition-all appearance-none"
              >
                <option value="">All Levels</option>
                {academicDepths.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
           </div>
        </div>

        {/* Remote Toggle */}
        <div className="pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Self-Paced Only</span>
            <input
              type="checkbox"
              checked={currentFilters?.remoteWork || false}
              onChange={(e) => onFilterChange('remoteWork', e.target.checked)}
              className="w-8 h-4 rounded-full bg-slate-100 dark:bg-white/5 border-none text-emerald-600 focus:ring-0 appearance-none relative before:content-[''] before:absolute before:w-3 before:h-3 before:bg-slate-400 before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4.5 checked:before:bg-emerald-500 transition-all duration-300 cursor-pointer"
            />
        </div>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          Update Search
        </button>
      )}
    </div>
  );
};

export default SearchFilters;
