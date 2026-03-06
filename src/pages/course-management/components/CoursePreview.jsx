import React from 'react';
import Icon from 'components/AppIcon';
import { motion } from 'framer-motion';

const CoursePreview = ({ formValues }) => {
  const formatLocation = () => {
    const { location } = formValues;
    if (typeof location === 'string') return location;
    return 'Online Protocol';
  };
  
  const formatPedagogy = () => {
    const types = {
      'online-self-paced': 'Self-Paced Navigation',
      'online-live': 'Synchronous Live Learning',
      'onsite': 'Traditional Presence',
      'hybrid': 'Blended Methodology',
      'intensive': 'Structural Intensive',
      'workshop': 'Practical Application'
    };
    return types[formValues?.employmentType] || 'Standard Curriculum';
  };
  
  const formatAcademicDomain = () => {
    const departments = {
      'theology': 'Theology (Aqeedah)',
      'jurisprudence': 'Jurisprudence (Fiqh)',
      'hadith': 'Prophetic Traditions (Hadith)',
      'quranic-studies': 'Quranic Studies (Tafsir)',
      'history': 'Islamic History (Seerah)',
      'language': 'Arabic Language',
      'finance': 'Islamic Finance',
      'ethics': 'Ethics & Spirituality (Tazkiyah)',
      'contemporary': 'Contemporary Issues'
    };
    return departments[formValues?.department] || 'Sacred Knowledge';
  };

  const formatRigour = () => {
    const depths = {
      'foundational': 'Foundational',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced Scholar',
      'specialist': 'Specialist',
      'research': 'Research'
    };
    return depths[formValues?.experienceLevel] || 'General';
  };
  
  return (
    <div className="group relative bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="p-8">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 block">
          Academic Manifest
        </label>
        
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black text-text-primary tracking-tighter leading-none uppercase italic group-hover:text-emerald-500 transition-colors">
              {formValues?.title || 'Draft Curriculum'}
            </h2>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted">
              <Icon name="BookOpen" size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Domain</span>
              <span className="text-[11px] font-bold text-white truncate block">{formatAcademicDomain()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Rigour</span>
              <span className="text-[11px] font-bold text-emerald-500 truncate block">{formatRigour()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-text-secondary">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Icon name="Zap" size={14} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold">{formatPedagogy()}</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Icon name="MapPin" size={14} />
              </div>
              <span className="text-xs font-bold">{formatLocation()}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
             <div className="prose prose-invert max-w-none">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Curriculum Synopsis</label>
              <p className="text-xs text-text-muted leading-relaxed line-clamp-4 font-medium italic">
                {formValues?.description || "Initialise the scholarly synopsis to observe the architectural layout of this curriculum."}
              </p>
            </div>
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all shadow-xl disabled:opacity-50" disabled>
            Simulate Enrollment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
