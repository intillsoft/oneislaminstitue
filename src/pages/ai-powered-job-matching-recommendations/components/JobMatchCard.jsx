import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import CompanyAvatar from '../../../components/ui/CompanyAvatar';

const JobMatchCard = ({ job, userSkills, onSelect, isSelected, onExplain }) => {
  const [imageError, setImageError] = useState(false);
  
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'text-workflow-primary bg-workflow-primary/10 border-workflow-primary/20';
    if (score >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10';
  };

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'very high': case 'high':
        return <Icon name="TrendingUp" size={14} className="text-emerald-500" />;
      case 'rising':
        return <Icon name="ArrowUp" size={14} className="text-workflow-primary" />;
      case 'stable':
        return <Icon name="Minus" size={14} className="text-amber-500" />;
      default:
        return <Icon name="TrendingDown" size={14} className="text-rose-500" />;
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={`glass-panel group relative overflow-hidden rounded-[2rem] border-2 transition-all duration-300 cursor-pointer ${isSelected
        ? 'border-workflow-primary ring-4 ring-workflow-primary/10 dark:bg-white/10'
        : 'border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:border-workflow-primary/30 hover:shadow-2xl'
        }`}
      onClick={() => onSelect(job)}
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-workflow-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Thumbnail Image Banner */}
      <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
        {!imageError && (job?.thumbnail || job?.image || job?.featured_image) ? (
          <img
            src={job?.thumbnail || job?.image || job?.featured_image}
            alt={job?.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-workflow-primary to-emerald-500 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Briefcase" size={32} className="text-white/30" />
            </div>
          </>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40" />
      </div>

      <div className="p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex items-start gap-6 flex-1">
            <CompanyAvatar
              name={job?.company}
              logo={job?.logo}
              size="16"
              className="rounded-2xl"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-[800] tracking-tight text-slate-900 dark:text-white mb-2 group-hover:text-workflow-primary transition-colors">
                {job?.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-4 flex items-center gap-2">
                {job?.company}
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-workflow-primary/80 uppercase tracking-widest text-[10px]">Premium Match</span>
              </p>

              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold">
                  <Icon name="MapPin" size={14} />
                  {job?.location}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold">
                  <Icon name="DollarSign" size={14} />
                  {job?.salary}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Icon name="Clock" size={14} />
                  {getTimeAgo(job?.postedDate)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Match Score Badge */}
          <div className="flex-shrink-0">
            <div className={`w-28 h-28 rounded-[2rem] border-4 flex flex-col items-center justify-center shadow-2xl transition-all group-hover:rotate-3 ${getMatchColor(job?.matchScore)}`}>
              <div className="text-4xl font-[950] tracking-tighter leading-none">{job?.matchScore}%</div>
              <div className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Neural Fit</div>
            </div>
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Matching Assets</h4>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {job?.matchedSkills?.length} Strengths
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job?.matchedSkills?.slice(0, 6)?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/10 flex items-center gap-1.5"
                >
                  <Icon name="CheckCircle" size={12} className="opacity-70" />
                  {skill}
                </span>
              ))}
              {job?.matchedSkills?.length > 6 && (
                <span className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-xs font-bold">
                  +{job?.matchedSkills?.length - 6} more
                </span>
              )}
            </div>
          </div>

          {job?.skillGaps?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Skill Acquisition</h4>
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Improve Probability
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job?.skillGaps?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-amber-500/5 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-500/10 flex items-center gap-1.5"
                  >
                    <Icon name="Zap" size={12} className="opacity-70" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Insight Bar */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-8">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              {getTrendIcon(job?.insights?.demandTrend)}
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Market Demand</span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white capitalize">{job?.insights?.demandTrend || 'High'}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon name="Target" size={14} className="text-workflow-primary" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Success Rate</span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white">{job?.applicationSuccess || '84'}%</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon name="Clock" size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Time to Hire</span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white">{job?.insights?.avgTimeToHire || '14 Days'}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-4">
          <Link
            to={`/jobs/detail?id=${job?.id}`}
            className="flex-1 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center hover:scale-[1.02] shadow-xl transition-all"
            onClick={(e) => e?.stopPropagation()}
          >
            Deploy Application
          </Link>

          <button
            onClick={(e) => { e?.stopPropagation(); onExplain && onExplain(job); }}
            className="px-6 h-14 rounded-2xl bg-workflow-primary/10 border border-workflow-primary/20 text-workflow-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-workflow-primary hover:text-white transition-all shadow-glow"
          >
            <Icon name="Sparkles" size={16} />
            Explain
          </button>

          <div className="flex gap-2">
            <button
              className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-workflow-primary hover:border-workflow-primary transition-all"
              onClick={(e) => { e?.stopPropagation(); }}
            >
              <Icon name="Bookmark" size={20} />
            </button>
            <button
              className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-workflow-primary hover:border-workflow-primary transition-all"
              onClick={(e) => { e?.stopPropagation(); }}
            >
              <Icon name="Share2" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchCard;