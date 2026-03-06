import React from 'react';
import Icon from 'components/AppIcon';

const FormSection = ({ title, icon, children, isExpanded, toggleExpanded }) => {
  return (
    <div className="mb-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden transition-all duration-500">
      <button
        type="button"
        onClick={toggleExpanded}
        className={`w-full px-8 py-5 flex items-center justify-between text-left transition-colors ${isExpanded ? 'bg-slate-100/50 dark:bg-white/5' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/20">
            <Icon name={icon} size={18} className="text-workflow-primary" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h3>
            {!isExpanded && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">Click to configure section</p>}
          </div>
        </div>
        <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
          <Icon name="ChevronDown" size={18} className="text-slate-400" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-8 pb-8 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;