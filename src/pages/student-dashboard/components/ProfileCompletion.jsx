import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { motion } from 'framer-motion';

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
    if (completion < 30) return { text: 'Just Started', color: 'var(--color-error)' };
    if (completion < 60) return { text: 'Making Progress', color: 'var(--color-warning)' };
    if (completion < 90) return { text: 'Almost There', color: 'var(--color-primary)' };
    return { text: 'Well Done!', color: 'var(--color-success)' };
  };

  const status = getCompletionStatus();

  return (
    <div className="p-8 bg-white border border-[var(--color-card-border)] rounded-xl h-full flex flex-col justify-between" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Profile Completion</h3>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: status.color }}>
            {status.text}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Your Progress
            </span>
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">
              {completion}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-card-border)] overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Suggestions */}
        <h4 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
          Next Steps:
        </h4>

        <ul className="space-y-2 mb-6">
          {suggestions?.map((suggestion) => (
            <li key={suggestion?.id}>
              <Link
                to={suggestion?.path}
                className="flex items-center p-3 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary-light)] border border-[var(--color-card-border)] hover:border-[var(--color-border-secondary)] transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center mr-3 group-hover:scale-105 transition-transform flex-shrink-0 border border-[var(--color-border-secondary)]">
                  <Icon name={suggestion?.icon} size={16} className="text-[var(--color-primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors flex-1">
                  {suggestion?.text}
                </span>
                <Icon
                  name="ChevronRight"
                  size={16}
                  className="ml-2 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Profile Button */}
      <Link
        to="/dashboard/profile"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm transition-all"
      >
        <Icon name="Edit" size={16} />
        <span>Edit Profile</span>
      </Link>
    </div>
  );
};

export default ProfileCompletion;
