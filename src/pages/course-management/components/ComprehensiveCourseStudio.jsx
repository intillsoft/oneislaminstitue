import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { EliteCard } from '../../../components/ui/EliteCard';

/**
 * Comprehensive Course Studio - The advanced toolkit for One Islam Institute
 * Handles the full lifecycle of course creation with depth and premium aesthetics.
 */
const ComprehensiveCourseStudio = ({
  control,
  errors,
  setValue,
  handleSubmit,
  onSubmit,
  formMode,
  isDirty,
  isValid,
  reset,
  watch
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  const formValues = watch();

  const steps = [
    { id: 'foundation', label: 'Basic Info', icon: 'BookOpen', desc: 'Core academic details' },
    { id: 'narrative', label: 'Syllabus', icon: 'FileText', desc: 'Syllabus & description' },
    { id: 'outcomes', label: 'Settings', icon: 'Target', desc: 'Rewards & goals' },
    { id: 'visuals', label: 'Media', icon: 'Image', desc: 'Course media integration' }
  ];

  // Auto-save logic for both create and edit modes
  useEffect(() => {
    // Check if form is dirty, valid, and NOT currently being submitted manually
    if (isDirty && isValid && !control._formState.isSubmitting) {
      const timer = setTimeout(async () => {
        setSaveStatus('saving');
        try {
          await handleSubmit((data) => onSubmit(data, true))();
          setSaveStatus('saved');
        } catch (e) {
          console.error("Auto-save failed:", e);
          setSaveStatus('idle');
        } finally {
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      }, 5000); // 5 second debounce for smoother typing
      return () => clearTimeout(timer);
    }
  }, [isDirty, isValid, formValues, control._formState.isSubmitting]);

  const departments = [
    { value: 'theology', label: 'Theology (Aqeedah)' },
    { value: 'jurisprudence', label: 'Jurisprudence (Fiqh)' },
    { value: 'hadith', label: 'Prophetic Traditions (Hadith)' },
    { value: 'quranic-studies', label: 'Quranic Studies (Tafsir)' },
    { value: 'history', label: 'Islamic History (Seerah)' },
    { value: 'language', label: 'Arabic Language' },
    { value: 'ethics', label: 'Ethics & Spirituality (Tazkiyah)' },
    { value: 'contemporary', label: 'Contemporary Issues' }
  ];

  const academicDepths = [
    { value: 'foundational', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'specialist', label: 'Expert' }
  ];

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const InputLabel = ({ children, required }) => (
    <label className="text-xs font-semibold tracking-wide text-slate-500 mb-2 block">
      {children} {required && <span className="text-emerald-500">*</span>}
    </label>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar pb-4 gap-4 border-b border-border dark:border-white/5">
      {steps.map((step, idx) => (
        <button
          key={step.id}
          type="button"
          onClick={() => setActiveStep(idx)}
          className="flex items-center gap-3 group min-w-max pb-3 relative"
        >
          <div className={`
            w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 text-[10px] font-black
            ${activeStep === idx 
              ? 'bg-emerald-600 text-white' 
              : idx < activeStep 
              ? 'bg-emerald-600/10 text-emerald-500'
              : 'bg-white/5 text-slate-500 hover:text-slate-400'}
          `}>
            {idx < activeStep ? <Icon name="Check" size={12} /> : idx + 1}
          </div>
          <div className="text-left hidden sm:block">
            <h4 className={`text-[10px] font-black uppercase tracking-widest ${activeStep === idx ? 'text-white' : 'text-slate-500'}`}>{step.label}</h4>
          </div>
          {activeStep === idx && (
             <motion.div layoutId="stepIndicator" className="absolute -bottom-px left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>
      ))}
    </div>
  );

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0: // FOUNDATION
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-5 bg-white/2 border border-white/5 rounded-2xl space-y-5">
                <div>
                  <InputLabel required>Course Title</InputLabel>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Titling is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-base font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-text-muted"
                        placeholder="e.g. Masterclass in Web Development"
                      />
                    )}
                  />
                  {errors.title && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <InputLabel required>Category / Topic</InputLabel>
                    <Controller
                      name="department"
                      control={control}
                      rules={{ required: 'Category is required' }}
                      render={({ field }) => (
                        <select {...field} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all appearance-none">
                          <option value="">Select Category</option>
                          {departments.map(d => <option key={d.value} value={d.value} className="bg-slate-900">{d.label}</option>)}
                        </select>
                      )}
                    />
                  </div>
                  <div>
                    <InputLabel required>Difficulty Level</InputLabel>
                    <Controller
                      name="experienceLevel"
                      control={control}
                      rules={{ required: 'Difficulty is required' }}
                      render={({ field }) => (
                        <select {...field} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all appearance-none">
                          <option value="">Select Level</option>
                          {academicDepths.map(d => <option key={d.value} value={d.value} className="bg-slate-900">{d.label}</option>)}
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <InputLabel>Language</InputLabel>
                    <Controller
                      name="language"
                      control={control}
                      render={({ field }) => (
                        <input {...field} className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-base font-semibold text-text-primary focus:outline-none placeholder:text-text-muted" placeholder="e.g. English" />
                      )}
                    />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <InputLabel>Min Donation ($)</InputLabel>
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                         <Controller
                           name="salary_min"
                           control={control}
                           render={({ field }) => (
                             <input type="number" min="0" step="0.01" {...field} className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg pl-8 pr-3 py-3 text-lg font-bold text-emerald-600 focus:outline-none" placeholder="5" />
                           )}
                         />
                       </div>
                     </div>
                     <div>
                       <InputLabel>Max Donation ($)</InputLabel>
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                         <Controller
                           name="salary_max"
                           control={control}
                           render={({ field }) => (
                             <input type="number" min="0" step="0.01" {...field} className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg pl-8 pr-3 py-3 text-lg font-bold text-emerald-600 focus:outline-none" placeholder="Any" />
                           )}
                         />
                       </div>
                     </div>
                   </div>
                </div>
            </div>
          </motion.div>
        );
      case 1: // NARRATIVE
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
             <div className="p-6 bg-surface-elevated dark:bg-white/[0.02] border border-border dark:border-white/5 rounded-xl space-y-6">
                <div>
                  <InputLabel required>Course Description</InputLabel>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={8}
                        className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-base font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none leading-relaxed"
                        placeholder="Provide a compelling description of what this course offers..."
                      />
                    )}
                  />
                </div>
                <div>
                  <InputLabel>Instructor Bio</InputLabel>
                  <Controller
                    name="instructor_bio"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={4}
                        className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-base font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none"
                        placeholder="Tell students about your background and expertise..."
                      />
                    )}
                  />
                </div>
             </div>
          </motion.div>
        );
      case 2: // OUTCOMES
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-6 bg-surface-elevated dark:bg-white/[0.02] border border-border dark:border-white/5 rounded-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <InputLabel>Key Learning Outcomes</InputLabel>
                    <p className="text-[11px] text-text-muted mb-2">Each line represents a significant milestone.</p>
                    <textarea
                      value={Array.isArray(formValues.learning_outcomes) 
                        ? formValues.learning_outcomes.join('\n') 
                        : (typeof formValues.learning_outcomes === 'string' ? formValues.learning_outcomes : '')}
                      onChange={(e) => setValue('learning_outcomes', e.target.value.split('\n').filter(s => s.trim()), { shouldDirty: true })}
                      rows={6}
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-base font-medium text-text-primary focus:outline-none placeholder:text-text-muted resize-none"
                      placeholder="e.g. Master React Hooks constraint..."
                    />
                  </div>
                  <div>
                    <InputLabel>Target Audience</InputLabel>
                     <p className="text-[11px] text-text-muted mb-2">Who is this course for?</p>
                    <textarea
                      value={Array.isArray(formValues.target_audience) 
                        ? formValues.target_audience.join('\n') 
                        : (typeof formValues.target_audience === 'string' ? formValues.target_audience : '')}
                      onChange={(e) => setValue('target_audience', e.target.value.split('\n').filter(s => s.trim()), { shouldDirty: true })}
                      rows={6}
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-base font-medium text-text-primary focus:outline-none placeholder:text-text-muted resize-none"
                      placeholder="e.g. Beginner Developers..."
                    />
                  </div>
                </div>

                <div className="space-y-6 md:border-l border-border dark:border-white/5 md:pl-8">
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-600/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="Target" className="text-emerald-500" size={18} />
                      <h4 className="text-sm font-bold text-text-primary dark:text-white">Rewards & Gamification</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <InputLabel>Estimated Duration (Hours)</InputLabel>
                        <Controller
                          name="estimated_duration_hours"
                          control={control}
                          render={({ field }) => (
                            <input type="number" {...field} className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-4 text-lg font-bold text-text-primary focus:outline-none" />
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-border dark:border-white/5 space-y-2 flex flex-col justify-center">
                           <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Scholarly XP (1-5)</p>
                           <Controller
                             name="difficulty_rating"
                             control={control}
                             render={({ field }) => (
                               <input type="number" step="0.1" max="5" min="0" {...field} className="w-full bg-transparent text-2xl font-black text-emerald-600 focus:outline-none" />
                             )}
                           />
                        </div>
                        <div className="p-3 bg-white dark:bg-white/5 rounded-lg border border-border dark:border-white/5 space-y-1 flex flex-col justify-center">
                           <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">XP Multiplier</p>
                           <p className="text-lg font-bold text-emerald-500">x1.2</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3: // VISUALS
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-6 bg-surface-elevated dark:bg-white/[0.02] border border-border dark:border-white/5 rounded-xl space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-[1fr,240px] gap-8">
                  <div className="space-y-6">
                    <div>
                      <InputLabel>Thumbnail Image URL</InputLabel>
                      <Controller
                        name="thumbnail_url"
                        control={control}
                        render={({ field }) => (
                          <input {...field} className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none placeholder:text-text-muted" placeholder="https://..." />
                        )}
                      />
                    </div>
                    <div>
                      <InputLabel>Preview Video URL</InputLabel>
                      <Controller
                        name="preview_video_url"
                        control={control}
                        render={({ field }) => (
                          <input {...field} className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none placeholder:text-text-muted" placeholder="https://youtube.com/..." />
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <InputLabel>Preview Visualization</InputLabel>
                    <div className="aspect-[4/3] rounded-xl bg-bg border border-border dark:border-white/10 overflow-hidden relative group">
                        {formValues.thumbnail_url ? (
                          <img src={formValues.thumbnail_url} className="w-full h-full object-cover" alt="Course Preview" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                            <Icon name="Image" size={32} />
                            <span className="text-xs mt-2 font-medium">No cover image</span>
                          </div>
                        )}
                        {formValues.title && (
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                              <h5 className="text-xs font-bold text-white truncate">{formValues.title}</h5>
                          </div>
                        )}
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-full mx-auto px-4 sm:px-0">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            {formMode === 'create' ? 'Create Course' : 'Edit Course'}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Build the foundation for your new course here.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <AnimatePresence>
            {saveStatus !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg border border-border"
              >
                <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-xs font-semibold text-text-secondary">
                  {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
                </span>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </div>

      <StepIndicator />

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border dark:border-white/5">
         <button
            type="button"
            onClick={() => {
              if (confirm('Discard all unsaved progress?')) reset();
            }}
            className="text-sm font-semibold text-text-muted hover:text-red-500 transition-colors py-2 px-4"
         >
            Discard
         </button>

         <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
                type="button"
                onClick={prevStep}
                disabled={activeStep === 0}
                className="flex-1 sm:flex-none px-5 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg text-sm font-semibold hover:bg-surface disabled:opacity-50 transition-all"
            >
                Back
            </button>
            {activeStep < steps.length - 1 ? (
                <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 sm:flex-none px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold active:scale-[0.98] transition-all"
                >
                    Continue
                </button>
            ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setValue('status', 'draft', { shouldDirty: true });
                            setValue('publishSettings.status', 'draft', { shouldDirty: true });
                            handleSubmit((data) => onSubmit(data, false))();
                        }}
                        disabled={!isValid || saveStatus === 'saving'}
                        className="flex-1 sm:flex-none px-5 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg text-sm font-bold shadow-sm hover:bg-surface disabled:opacity-50 transition-all"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setValue('status', 'published', { shouldDirty: true });
                            setValue('publishSettings.status', 'published', { shouldDirty: true });
                            handleSubmit((data) => onSubmit(data, false))();
                        }}
                        disabled={!isValid || saveStatus === 'saving'}
                        className="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all"
                    >
                        {formMode === 'create' ? 'Publish & Open Modules' : 'Publish Changes'}
                    </button>
                </div>
            )}
         </div>
      </div>
    </form>
  );
};

export default ComprehensiveCourseStudio;
