import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Sparkles, Globe, Zap, Settings2
} from 'lucide-react';

const AdvancedSearchModal = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    location: [],
    employmentType: [],
    salaryRange: '',
    experienceLevel: '',
    remoteWork: false,
    keywords: '',
    instructor: '',
    content_type: '',
    time_commitment: ''
  });

  if (!isOpen) return null;

  const handleApply = () => { onApplyFilters(localFilters); onClose(); };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0A1120] border border-slate-200 dark:border-white/5 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-7 border-b border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-emerald-600/10 text-emerald-600"><Settings2 className="w-5 h-5" /></div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Advanced Filter</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Discovery Parameters</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all text-slate-400"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-7 space-y-6 overflow-y-auto max-h-[60vh] scroll-native">
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course Keywords</label>
                  <input
                    type="text"
                    value={localFilters.keywords || ''}
                    onChange={(e) => setLocalFilters({...localFilters, keywords: e.target.value})}
                    placeholder="e.g. Fiqh, Arabic, Modern Ethics"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Instructor Name</label>
                    <input
                      type="text"
                      value={localFilters.instructor || ''}
                      onChange={(e) => setLocalFilters({...localFilters, instructor: e.target.value})}
                      placeholder="Search Scholars"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Complexity Level</label>
                    <select
                      value={localFilters.experienceLevel || ''}
                      onChange={(e) => setLocalFilters({...localFilters, experienceLevel: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Any Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
               </div>

               <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase">Self-Paced Format</h4>
                    <p className="text-[9px] font-medium text-slate-400">Exclude scheduled live classes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localFilters.remoteWork}
                    onChange={(e) => setLocalFilters({...localFilters, remoteWork: e.target.checked})}
                    className="w-10 h-5 rounded-full bg-slate-200 dark:bg-white/10 border-none text-emerald-600 focus:ring-0 appearance-none relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-slate-400 before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5.5 checked:before:bg-emerald-500 transition-all duration-300 cursor-pointer"
                  />
               </div>
            </div>
          </div>

          <div className="p-7 border-t border-slate-50 dark:border-white/5 flex items-center gap-4">
             <button onClick={() => setLocalFilters({location:[],employmentType:[],salaryRange:'',experienceLevel:'',remoteWork:false,keywords:'',instructor:'',content_type:'',time_commitment:''})} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Reset All</button>
             <button onClick={handleApply} className="flex-1 bg-emerald-600 text-white py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Apply Discovery Filters</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdvancedSearchModal;
