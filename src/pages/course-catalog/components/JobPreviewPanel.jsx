import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Heart, Star,
  X, Calendar, Building2, TrendingUp, Users,
  Share2, Flag, CheckCircle2, Globe, Wifi,
  ArrowUpRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'components/AppImage';
import { formatRequirements } from '../../../utils/jobDataFormatter';
import CourseCurriculum from '../../course-detail/components/CourseCurriculum';

const JobPreviewPanel = ({ job, onClose, isSaved, onSave }) => {
  const formatTimeAgo = (date) => {
    if (!date) return 'recently';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  if (!job) return null;
  const requirements = formatRequirements(job?.requirements);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel rounded-3xl overflow-hidden border-white/10 shadow-2xl sticky top-24"
    >
      {/* Header Section */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            <Image
              src={job?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job?.company || 'C')}&background=0046FF&color=fff`}
              alt={job?.company}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className={`p-2.5 rounded-xl transition-all ${isSaved
                  ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                  : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'
                }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white border border-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
          {job?.title}
        </h3>
        <p className="text-workflow-primary font-bold flex items-center gap-2 mb-6">
          <Building2 className="w-4 h-4" />
          {job?.company}
        </p>

        {job?.featured && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Star className="w-3 h-3 fill-amber-500" />
            Elite Opportunity
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <MapPin className="w-4 h-4 text-slate-600" />
            {job?.location || 'Remote'}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Clock className="w-4 h-4 text-slate-600" />
            {job?.employmentType || 'Full-time'}
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            {job?.salaryRange || 'Competitive'}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Calendar className="w-4 h-4 text-slate-600" />
            {formatTimeAgo(job?.postedDate)}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-8 max-h-[400px] overflow-y-auto custom-scrollbar">
        <section>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Briefing</h4>
          <div className="text-sm text-slate-400 leading-relaxed space-y-4">
            {job?.description ? (
              job.description.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="italic text-slate-600">No mission details provided.</p>
            )}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Required Arsenal</h4>
          <div className="space-y-3">
            {requirements.length > 0 ? requirements.map((req, i) => (
              <div key={i} className="flex gap-3 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-workflow-primary flex-shrink-0 mt-0.5" />
                <span>{typeof req === 'string' ? req : 'Specialized Skill'}</span>
              </div>
            )) : <p className="text-sm text-slate-600 italic">Open requirements.</p>}
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span>{job?.companySize || '10-50'} members</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <span>{job?.experienceLevel || 'Mid'} Level</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-white/[0.01] border-t border-white/5 space-y-3">
        <Link
          to={`/jobs/detail/${job?.id}`}
          className="w-full bg-workflow-primary text-white py-4 rounded-2xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-2"
        >
          Initialize Application
          <ArrowUpRight className="w-4 h-4" />
        </Link>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Share2 className="w-3.5 h-3.5" />
            Signal Team
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Flag className="w-3.5 h-3.5" />
            Report Issue
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobPreviewPanel;
