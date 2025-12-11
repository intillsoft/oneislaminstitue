import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const JobMatchCard = ({ job, userSkills, onSelect, isSelected }) => {
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-success bg-success/10 border-success/20';
    if (score >= 80) return 'text-primary bg-primary/10 border-primary/20';
    if (score >= 70) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-text-muted bg-surface border-border';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'very high': case'high':
        return <Icon name="TrendingUp" size={14} className="text-success" />;
      case 'rising':
        return <Icon name="ArrowUp" size={14} className="text-primary" />;
      case 'stable':
        return <Icon name="Minus" size={14} className="text-warning" />;
      default:
        return <Icon name="TrendingDown" size={14} className="text-error" />;
    }
  };

  return (
    <div
      className={`bg-background dark:bg-[#13182E] rounded-lg shadow-sm border-2 transition-all hover:shadow-md cursor-pointer ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border dark:border-[#1E2640]'
      }`}
      onClick={() => onSelect(job)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface dark:bg-[#1A2139] flex-shrink-0">
              <img
                src={job?.logo}
                alt={job?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary dark:text-[#E8EAED] mb-1 hover:text-primary transition-colors">
                {job?.title}
              </h3>
              <p className="text-sm text-text-secondary dark:text-[#8B92A3]">{job?.company}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-text-secondary dark:text-[#8B92A3]">
                <span className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{job?.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="DollarSign" size={12} />
                  <span>{job?.salary}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span>{new Date(job.postedDate)?.toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className={`flex-shrink-0 px-4 py-2 rounded-lg border ${getMatchColor(job?.matchScore)}`}>
            <div className="text-center">
              <div className="text-2xl font-bold">{job?.matchScore}%</div>
              <div className="text-xs font-medium">Match</div>
            </div>
          </div>
        </div>

        {/* Skills Match Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-text-primary dark:text-[#E8EAED]">Your Matching Skills</h4>
            <span className="text-xs text-success font-medium">
              {job?.matchedSkills?.length} of {job?.matchedSkills?.length + job?.skillGaps?.length} required
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {job?.matchedSkills?.slice(0, 5)?.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium flex items-center space-x-1"
              >
                <Icon name="CheckCircle" size={12} />
                <span>{skill}</span>
              </span>
            ))}
            {job?.matchedSkills?.length > 5 && (
              <span className="px-2 py-1 bg-surface dark:bg-[#1A2139] text-text-secondary dark:text-[#8B92A3] rounded-full text-xs font-medium">
                +{job?.matchedSkills?.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Skill Gaps */}
        {job?.skillGaps?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary dark:text-[#E8EAED] mb-2 flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>Skills to Learn</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {job?.skillGaps?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 dark:border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              {getTrendIcon(job?.insights?.demandTrend)}
              <span className="text-xs font-medium text-text-secondary dark:text-[#8B92A3]">Demand</span>
            </div>
            <p className="text-xs text-text-primary dark:text-[#E8EAED] font-semibold capitalize">{job?.insights?.demandTrend}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Target" size={14} className="text-primary" />
              <span className="text-xs font-medium text-text-secondary dark:text-[#8B92A3]">Success</span>
            </div>
            <p className="text-xs text-text-primary dark:text-[#E8EAED] font-semibold">{job?.applicationSuccess}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Clock" size={14} className="text-text-secondary dark:text-[#8B92A3]" />
              <span className="text-xs font-medium text-text-secondary dark:text-[#8B92A3]">Time to Hire</span>
            </div>
            <p className="text-xs text-text-primary dark:text-[#E8EAED] font-semibold">{job?.insights?.avgTimeToHire}</p>
          </div>
        </div>

        {/* Career Path Preview */}
        <div className="mt-3 p-3 bg-surface dark:bg-[#1A2139] rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="TrendingUp" size={14} className="text-accent" />
            <span className="text-xs font-semibold text-text-primary dark:text-[#E8EAED]">Career Growth Path</span>
          </div>
          <p className="text-xs text-text-secondary dark:text-[#8B92A3]">{job?.insights?.careerGrowth}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Link
            to={`/job-detail-application?id=${job?.id}`}
            className="flex-1 btn-primary text-sm text-center"
            onClick={(e) => e?.stopPropagation()}
          >
            Apply Now
          </Link>
          <button
            className="btn-secondary text-sm flex items-center space-x-1"
            onClick={(e) => {
              e?.stopPropagation();
              alert('Job saved!');
            }}
          >
            <Icon name="Bookmark" size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            className="btn-secondary text-sm flex items-center space-x-1"
            onClick={(e) => {
              e?.stopPropagation();
              alert('Sharing job...');
            }}
          >
            <Icon name="Share2" size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobMatchCard;