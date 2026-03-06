import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  FileText, 
  Save, 
  RefreshCcw,
  Layout,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { certificateService } from '../../../services/certificateService';
import { useToast } from '../../../components/ui/Toast';
import { EliteCard } from '../../../components/ui/EliteCard';
import Button from '../../../components/ui/Button';

const CertificateDesigner = ({ courseId, courseTitle }) => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [designData, setDesignData] = useState({
    primaryColor: "#065f46",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
    fontFamily: "Inter",
    layout: "scholarly", // centric, scholarly, modern, minimal
    borderStyle: "ornate", // none, simple, ornate, double
    showLogo: true,
    showSeal: true,
    signatureName: "One Islam Institute",
    signatureTitle: "Academic Director",
    customText: "This is to certify that you have successfully completed the rigorous requirements of this academic course."
  });

  useEffect(() => {
    if (courseId) loadTemplate();
  }, [courseId]);

  // Debounced Auto-save
  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      handleSave(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [designData]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const template = await certificateService.getTemplate(courseId);
      if (template?.design_data) {
        setDesignData(prev => ({ ...prev, ...template.design_data }));
      }
    } catch (err) {
      console.error('Failed to load certificate template', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isAuto = false) => {
    try {
      if (!isAuto) setSaving(true);
      await certificateService.updateTemplate(courseId, designData);
      setLastSaved(new Date());
      if (!isAuto) success('Certificate design finalized!');
    } catch (err) {
      if (!isAuto) showError('Failed to save certificate design');
      console.error(err);
    } finally {
      if (!isAuto) setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 animate-pulse">
        <Award className="w-12 h-12 text-emerald-500/20" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor Sidebar */}
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Design Palette</h3>
            {lastSaved && (
                <span className="text-[8px] font-medium text-slate-500 italic">Auto-saved {lastSaved.toLocaleTimeString()}</span>
            )}
        </div>

        <EliteCard title="Core Aesthetics" icon={Palette}>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Color Theory</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold text-text-muted uppercase tracking-tighter block">Primary</span>
                  <div className="relative group">
                    <div className="w-full h-10 rounded-xl border border-white/5 overflow-hidden shadow-inner">
                        <input 
                            type="color" 
                            value={designData.primaryColor}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            className="absolute inset-0 w-full h-full cursor-pointer scale-150"
                        />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-bold text-text-muted uppercase tracking-tighter block">Secondary</span>
                  <div className="relative group">
                    <div className="w-full h-10 rounded-xl border border-white/5 overflow-hidden shadow-inner">
                        <input 
                            type="color" 
                            value={designData.secondaryColor}
                            onChange={(e) => updateField('secondaryColor', e.target.value)}
                            className="absolute inset-0 w-full h-full cursor-pointer scale-150"
                        />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-bold text-text-muted uppercase tracking-tighter block">Accent</span>
                  <div className="relative group">
                    <div className="w-full h-10 rounded-xl border border-white/5 overflow-hidden shadow-inner">
                        <input 
                            type="color" 
                            value={designData.accentColor}
                            onChange={(e) => updateField('accentColor', e.target.value)}
                            className="absolute inset-0 w-full h-full cursor-pointer scale-150"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Layout & Structure</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                    { id: 'centric', label: 'Centric', desc: 'Focus on center' },
                    { id: 'scholarly', label: 'Scholarly', desc: 'Classic academic' },
                    { id: 'modern', label: 'Modern', desc: 'Clean & minimal' },
                    { id: 'minimal', label: 'Gallery', desc: 'Artistic focus' }
                ].map(l => (
                    <button 
                        key={l.id}
                        onClick={() => updateField('layout', l.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                            designData.layout === l.id 
                            ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-500' 
                            : 'bg-white/2 border-white/5 text-slate-500 hover:bg-white/5'
                        }`}
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{l.label}</p>
                        <p className="text-[8px] opacity-60">{l.desc}</p>
                    </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Typography Engine</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'Inter', label: 'Inter', desc: 'Universal Clarity' },
                  { id: 'Outfit', label: 'Outfit', desc: 'Modern Geometry' },
                  { id: 'Playfair Display', label: 'Playfair', desc: 'Classical Authority' },
                  { id: 'Cormorant Garamond', label: 'Cormorant', desc: 'Artisanal Script' }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => updateField('fontFamily', f.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        designData.fontFamily === f.id 
                        ? 'bg-white/5 border-emerald-500/30 text-white' 
                        : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/2'
                    }`}
                  >
                    <span style={{ fontFamily: f.id }} className="text-sm">{f.label}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </EliteCard>

        <EliteCard title="Content & Authority" icon={FileText}>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Achievement Statement</label>
              <textarea 
                value={designData.customText}
                onChange={(e) => updateField('customText', e.target.value)}
                rows={3}
                placeholder="Draft the certification text..."
                className="w-full bg-white/2 border border-white/5 rounded-2xl p-4 text-sm leading-relaxed text-white focus:outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Official Signatory</label>
                <input 
                  type="text" 
                  value={designData.signatureName}
                  onChange={(e) => updateField('signatureName', e.target.value)}
                  className="w-full h-11 bg-white/2 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Signatory Title</label>
                <input 
                  type="text" 
                  value={designData.signatureTitle}
                  onChange={(e) => updateField('signatureTitle', e.target.value)}
                  className="w-full h-11 bg-white/2 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => updateField('showLogo', !designData.showLogo)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    designData.showLogo ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-500' : 'bg-white/2 border-white/5 text-slate-500'
                  }`}
                >
                  <ImageIcon size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Logo</span>
                </button>
                <button 
                  onClick={() => updateField('showSeal', !designData.showSeal)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    designData.showSeal ? 'bg-amber-600/10 border-amber-500/30 text-amber-500' : 'bg-white/2 border-white/5 text-slate-500'
                  }`}
                >
                  <Sparkles size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Seal</span>
                </button>
            </div>
          </div>
        </EliteCard>

        <div className="flex items-center gap-4">
          <Button 
            className="flex-1" 
            variant="emerald" 
            icon={Save} 
            loading={saving}
            onClick={handleSave}
          >
            Finalize Achievement
          </Button>
          <Button 
            className="px-6" 
            variant="surface" 
            icon={RefreshCcw}
            onClick={loadTemplate}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Real-time Preview */}
      <div className="sticky top-8">
        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 block">Achievement Preview</label>
        
        <div className="aspect-[1.414/1] w-full bg-stone-50 rounded-[2rem] shadow-3xl overflow-hidden relative border border-slate-200" style={{ fontFamily: designData.fontFamily }}>
          {/* Ornate Layered Border */}
          <div className="absolute inset-4 border-[2px] border-stone-200" />
          <div className="absolute inset-6 border-[8px] border-double" style={{ borderColor: designData.primaryColor + '30' }} />
          <div className="absolute inset-10 border border-stone-200 shadow-inner bg-white/40" />
          
          {/* Decorative Corner Flourishes */}
          {[0, 1, 2, 3].map(i => (
             <div 
                key={i} 
                className={`absolute w-16 h-16 pointer-events-none ${
                    i === 0 ? 'top-6 left-6 border-t-2 border-l-2' :
                    i === 1 ? 'top-6 right-6 border-t-2 border-r-2' :
                    i === 2 ? 'bottom-6 left-6 border-b-2 border-l-2' :
                    'bottom-6 right-6 border-b-2 border-r-2'
                }`}
                style={{ borderColor: designData.primaryColor }}
             />
          ))}

          <div className={`absolute inset-0 p-12 flex flex-col items-center text-center ${
            designData.layout === 'centric' ? 'justify-center space-y-8' : 
            designData.layout === 'minimal' ? 'justify-between py-16' :
            'justify-between pb-12 pt-8'
          }`}>
            {/* Header section */}
            <div className={`space-y-4 ${designData.layout === 'minimal' ? 'w-full flex items-center justify-between px-8' : ''}`}>
              <div className={`flex items-center gap-3 ${designData.layout === 'minimal' ? '' : 'justify-center'}`}>
                 {designData.showLogo && (
                    <div className="w-12 h-12 rounded-full border-2 p-1 flex items-center justify-center transform rotate-12 bg-white shadow-sm" style={{ borderColor: designData.primaryColor }}>
                        <Award style={{ color: designData.primaryColor }} size={24} />
                    </div>
                 )}
                 <div className="text-left">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-900 leading-tight">One Islam Institute</p>
                    <p className="text-[6px] font-bold text-stone-500 uppercase tracking-widest -mt-1">Verified Academic Branch</p>
                 </div>
              </div>
              {designData.layout !== 'minimal' && (
                <div className="flex flex-col items-center">
                    <div className="h-px w-24 bg-stone-200 mb-3" />
                    <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-400">Certificate of Completion</h2>
                </div>
              )}
            </div>

            {/* Recipient Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                 <p className="text-[11px] font-medium italic text-stone-400">This official scroll is awarded to</p>
                 <h1 className="text-5xl font-black text-stone-900 tracking-tight leading-none drop-shadow-sm">John Scholar Doe</h1>
                 <div className="h-0.5 w-48 bg-stone-900/10 mx-auto mt-4" style={{ backgroundColor: designData.secondaryColor + '30' }} />
              </div>
              
              <div className="max-w-md mx-auto space-y-4">
                 <p className="text-[13px] font-medium text-stone-600 leading-relaxed italic max-w-sm mx-auto">
                   {designData.customText}
                 </p>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-stone-400">Successfully achieving the milestone of</p>
                    <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: designData.primaryColor }}>
                        {courseTitle || 'Mastering the Foundations'}
                    </h3>
                 </div>
              </div>
            </div>

            {/* Verification & Authentication */}
            <div className="w-full flex items-end justify-between px-4 mt-4">
               <div className="text-left space-y-1 min-w-[120px]">
                  <div className="w-24 h-px bg-stone-300 mb-2" />
                  <p className="text-[10px] font-black uppercase text-stone-900">{designData.signatureName}</p>
                  <p className="text-[7px] font-bold text-stone-400 uppercase tracking-widest">{designData.signatureTitle}</p>
               </div>

               {designData.showSeal && (
                 <div className="relative group scale-110">
                    <div className="w-20 h-20 rounded-full border-[1px] border-amber-600/30 flex items-center justify-center animate-spin-slow">
                        <svg className="w-16 h-16 fill-amber-600/10" viewBox="0 0 100 100">
                            <path d="M50 0L61.2 34.5H97.6L68.1 55.9L79.3 90.5L50 69.1L20.7 90.5L31.9 55.9L2.4 34.5H38.8L50 0Z" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400">
                             <CheckCircle2 className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 whitespace-nowrap left-1/2 -translate-x-1/2 text-[5px] font-black uppercase tracking-[0.2em] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Official Institute Seal</div>
                 </div>
               )}

               <div className="text-right space-y-1 min-w-[120px]">
                  <p className="text-[6px] font-black text-stone-400 uppercase tracking-widest">ID: OII-ACAD-2024</p>
                  <p className="text-[9px] font-mono font-black text-stone-900">VERIFIED #{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  <p className="text-[7px] font-bold text-stone-400 uppercase tracking-widest">Issued {new Date().toLocaleDateString()}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
          <Sparkles className="text-amber-500 shrink-0" size={18} />
          <p className="text-[10px] font-medium text-amber-800 dark:text-amber-400">
            Design dynamic: The student's name, course title, and completion date will be auto-injected during the awarding process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateDesigner;
