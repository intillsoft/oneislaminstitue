import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { EliteCard, EliteProgressBar } from '../../../components/ui/EliteCard';
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
    if (completion < 30) return { text: 'Just Started', color: 'red' };
    if (completion < 60) return { text: 'Making Progress', color: 'amber' };
    if (completion < 90) return { text: 'Almost There', color: 'blue' };
    return { text: 'Well Done!', color: 'green' };
  };

  const status = getCompletionStatus();

  return (
    <div className="p-8 bg-[#0C1236]/30 backdrop-blur-xl border border-white/[0.04] rounded-3xl relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] blur-3xl rounded-full -z-10" />

      <div>
        <div className="mb-6">
          <h3 className="text-xl font-black text-white">Profile Completion</h3>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">
            {status.text}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Your Progress
            </span>
            <span className="text-2xl font-black text-white">
              {completion}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.03] border border-white/[0.04] overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            />
          </div>
        </div>

        {/* Suggestions */}
        <h4 className="text-xs font-black text-white/40 uppercase tracking-wider mb-3">
          Next Steps:
        </h4>

        <ul className="space-y-2 mb-6">
          {suggestions?.map((suggestion) => (
            <li key={suggestion?.id}>
              <Link
                to={suggestion?.path}
                className="flex items-center p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] hover:border-emerald-500/20 shadow-sm transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0 border border-emerald-500/10">
                  <Icon name={suggestion?.icon} size={16} className="text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors flex-1">
                  {suggestion?.text}
                </span>
                <Icon
                  name="ChevronRight"
                  size={16}
                  className="ml-2 text-white/30 group-hover:text-emerald-400 transition-colors flex-shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Profile Button */}
      <Link
        to="/dashboard/profile"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
      >
        <Icon name="Edit" size={16} />
        <span>Edit Profile</span>
      </Link>
    </div>
  );
};

export default ProfileCompletion;
