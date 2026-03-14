import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { EliteCard, EliteProgressBar } from '../../../components/ui/EliteCard';

const ProfileCompletion = ({ completion }) => {
  const getSuggestions = () => {
    if (completion < 30) {
      return [
        { id: 1, text: 'Upload your resume', icon: 'FileUp', path: '/dashboard/resume-builder' },
        { id: 2, text: 'Add your work experience', icon: 'Briefcase', path: '/dashboard/profile' },
        { id: 3, text: 'Add your education', icon: 'GraduationCap', path: '/dashboard/profile' },
        { id: 4, text: 'Add your skills', icon: 'Code', path: '/dashboard/profile' }
      ];
    } else if (completion < 60) {
      return [
        { id: 1, text: 'Add your profile picture', icon: 'Image', path: '/dashboard/profile' },
        { id: 2, text: 'Complete your bio', icon: 'FileText', path: '/dashboard/profile' },
        { id: 3, text: 'Add your certifications', icon: 'Award', path: '/dashboard/profile' }
      ];
    } else if (completion < 90) {
      return [
        { id: 1, text: 'Add your portfolio links', icon: 'Link', path: '/dashboard/profile' },
        { id: 2, text: 'Set your job preferences', icon: 'Sliders', path: '/dashboard/profile' }
      ];
    } else {
      return [
        { id: 1, text: 'Review your profile', icon: 'CheckCircle', path: '/dashboard/profile' }
      ];
    }
  };

  const suggestions = getSuggestions();

  const getCompletionStatus = () => {
    if (completion < 30) return { text: 'Just Started', color: 'red' };
    if (completion < 60) return { text: 'Making Progress', color: 'amber' };
    if (completion < 90) return { text: 'Almost There', color: 'blue' };
    return { text: 'Well Done!', color: 'green' };
  };

  const status = getCompletionStatus();

  return (
    <EliteCard hover={false}>
      <div className="mb-6">
        <h3 className="text-xl font-black text-text-primary dark:text-white">Profile Completion</h3>
        <p className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mt-1">
          {status.text}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-text-secondary dark:text-slate-300">
            Your Progress
          </span>
          <span className="text-2xl font-black text-text-primary dark:text-white">
            {completion}%
          </span>
        </div>
        <EliteProgressBar
          label=""
          value={completion}
          max={100}
          color={status.color}
          showPercentage={false}
        />
      </div>

      {/* Suggestions */}
      <h4 className="text-sm font-bold text-text-primary dark:text-white mb-3">
        Next Steps:
      </h4>

      <ul className="space-y-2 mb-6">
        {suggestions?.map((suggestion) => (
          <li key={suggestion?.id}>
            <Link
              to={suggestion?.path}
              className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-all group border border-slate-200 dark:border-transparent hover:border-emerald-500/30 dark:hover:border-emerald-500/20"
            >
              <div className="w-9 h-9 rounded-lg bg-workflow-primary/10 dark:bg-workflow-primary/20 flex items-center justify-center mr-3 group-hover:bg-workflow-primary/20 dark:group-hover:bg-workflow-primary/30 transition-all flex-shrink-0">
                <Icon name={suggestion?.icon} size={16} className="text-workflow-primary" />
              </div>
              <span className="text-sm font-medium text-text-secondary dark:text-slate-300 group-hover:text-text-primary dark:group-hover:text-white transition-colors flex-1">
                {suggestion?.text}
              </span>
              <Icon
                name="ChevronRight"
                size={18}
                className="ml-2 text-text-muted dark:text-slate-400 group-hover:text-workflow-primary transition-colors flex-shrink-0"
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Edit Profile Button */}
      <Link
        to="/dashboard/profile"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-workflow-primary text-white hover:bg-workflow-primary/90 transition-all font-semibold text-sm shadow-lg hover:shadow-workflow-primary/20"
      >
        <Icon name="Edit" size={18} />
        <span>Edit Profile</span>
      </Link>
    </EliteCard>
  );
};

export default ProfileCompletion;
