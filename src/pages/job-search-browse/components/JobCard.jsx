import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { formatRequirements } from '../../../utils/jobDataFormatter';
import MessageButton from '../../../components/ui/MessageButton';

const JobCard = ({ job, isSaved, onSave, onSelect, isSelected }) => {
  const formatTimeAgo = (date) => {
    if (!date) return 'recently';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const requirements = formatRequirements(job?.requirements);

  return (
    <div
      className={`group relative bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${isSelected
          ? 'border-workflow-primary dark:border-workflow-primary-400 ring-1 ring-workflow-primary-100 dark:ring-workflow-primary-900/20'
          : 'hover:border-workflow-primary-300 dark:hover:border-workflow-primary-500'
        } ${job?.featured ? 'ring-1 ring-accent-500 dark:ring-accent-400 border-accent-500 dark:border-accent-400' : ''}`}
      onClick={onSelect}
    >
      {/* Featured Badge */}
      {job?.featured && (
        <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-2.5 py-1 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-full z-10">
          <Icon name="Star" size={14} className="text-accent-600 dark:text-accent-400" />
          <span className="text-xs font-semibold text-accent-700 dark:text-accent-400 uppercase tracking-wide">Featured</span>
        </div>
      )}

      {/* Save Button - Top Right */}
      <button
        onClick={(e) => {
          e?.stopPropagation();
          onSave();
        }}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${isSaved
            ? 'text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/20 hover:bg-error-100 dark:hover:bg-error-900/30'
            : 'text-[#64748B] dark:text-[#8B92A3] bg-white dark:bg-[#1A2139] hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-600 dark:hover:text-error-400 border border-[#E2E8F0] dark:border-[#1E2640]'
          }`}
        aria-label={isSaved ? 'Unsave job' : 'Save job'}
      >
        <Icon name="Heart" size={20} fill={isSaved ? "currentColor" : "none"} />
      </button>

      {/* Match Score Badge - Top Right */}
      {job?.matchScore !== undefined && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary text-xs font-bold rounded-md border border-workflow-primary/20">
          {job.matchScore}% Match
        </div>
      )}

      {/* Company Logo & Info */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8FAFC] dark:bg-[#1A2139] border border-[#E2E8F0] dark:border-[#1E2640] flex items-center justify-center">
          <Image
            src={job?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job?.company || 'Company')}&background=0046FF&color=fff&size=128`}
            alt={`${job?.company} logo`}
            className="w-full h-full object-cover"
            fallback={`https://ui-avatars.com/api/?name=${encodeURIComponent(job?.company || 'Company')}&background=0046FF&color=fff&size=128`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-1 group-hover:text-workflow-primary dark:group-hover:text-workflow-primary-400 transition-colors line-clamp-2">
            {job?.title || 'Job Title'}
          </h3>
          <p className="text-sm font-medium text-[#475569] dark:text-[#B4B9C4] mb-1">{job?.company || 'Company Name'}</p>
        </div>
      </div>

      {/* Job Details - Compact */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <div className="flex items-center space-x-1 text-[#64748B] dark:text-[#8B92A3]">
          <Icon name="MapPin" size={12} />
          <span>{job?.location || 'Remote'}</span>
        </div>
        <span className="text-[#E2E8F0] dark:text-[#1E2640]">•</span>
        <div className="flex items-center space-x-1 text-[#64748B] dark:text-[#8B92A3]">
          <Icon name="Clock" size={12} />
          <span>{job?.employmentType || job?.job_type || 'Full-time'}</span>
        </div>
        {job?.salaryRange && (
          <>
            <span className="text-[#E2E8F0] dark:text-[#1E2640]">•</span>
            <div className="flex items-center space-x-1 text-[#64748B] dark:text-[#8B92A3]">
              <Icon name="DollarSign" size={12} />
              <span>{job.salaryRange}</span>
            </div>
          </>
        )}
      </div>

      {/* Skills/Requirements Tags - Compact */}
      {requirements.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {requirements.slice(0, 2).map((requirement, index) => {
            const reqText = typeof requirement === 'string' ? requirement : JSON.stringify(requirement);
            return (
              <span
                key={index}
                className="px-2 py-0.5 bg-[#F1F5F9] dark:bg-[#1A2139] text-[#475569] dark:text-[#B4B9C4] text-xs rounded border border-[#E2E8F0] dark:border-[#1E2640]"
              >
                {reqText.length > 20 ? reqText.substring(0, 20) + '...' : reqText}
              </span>
            );
          })}
          {requirements.length > 2 && (
            <span className="px-2 py-0.5 bg-[#F1F5F9] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3] text-xs rounded border border-[#E2E8F0] dark:border-[#1E2640]">
              +{requirements.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer - Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#1E2640]">
        {job?.created_by && (
          <MessageButton
            userId={job.created_by}
            userName={job.company}
            variant="icon"
            className="flex-shrink-0"
          />
        )}
        <Link
          to={`/jobs/detail/${job?.id}`}
          onClick={(e) => e?.stopPropagation()}
          className="flex-1 px-3 py-2 text-xs font-medium text-workflow-primary hover:text-workflow-primary-700 dark:hover:text-workflow-primary-300 border border-workflow-primary hover:bg-workflow-primary-50 dark:hover:bg-workflow-primary-900/20 rounded transition-all text-center"
        >
          View
        </Link>
        <Link
          to={`/jobs/detail/${job?.id}`}
          onClick={(e) => e?.stopPropagation()}
          className="flex-1 px-3 py-2 text-xs font-semibold bg-workflow-primary text-white hover:bg-workflow-primary-600 dark:hover:bg-workflow-primary-500 rounded transition-all text-center"
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

export default JobCard;