import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';

const TalentRegistration = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    hourly_rate: '',
    skills: [],
    experience_level: 'intermediate',
    languages: [],
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    reason: '',
  });
  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.bio || !formData.reason) {
      showError('Please fill in all required fields');
      return;
    }

    if (!user) {
      showError('Please sign in first');
      navigate('/job-seeker-registration-login');
      return;
    }

    try {
      setLoading(true);
      await apiService.profile.requestRoleChange({
        requested_role: 'talent',
        reason: formData.reason,
        talent_data: {
          title: formData.title,
          bio: formData.bio,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          skills: formData.skills,
          experience_level: formData.experience_level,
          languages: formData.languages,
          portfolio_url: formData.portfolio_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
        },
      });
      success('Registration request submitted! An admin will review your request soon.');
      navigate('/job-seeker-dashboard');
    } catch (error) {
      console.error('Error submitting registration:', error);
      showError('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0046FF] via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-[#13182E] rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0046FF] to-purple-600 mb-4">
            <Icon name="User" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Become a Talent
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join our marketplace and start offering your services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Full Stack Developer, UI/UX Designer"
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              placeholder="Tell us about your skills and experience..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                placeholder="e.g., 50"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Experience Level
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#0046FF] text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-[#0046FF]/10 dark:bg-purple-500/20 text-[#0046FF] dark:text-purple-400 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/you"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/you"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Why do you want to become a Talent? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              placeholder="Tell us why you want to join as a talent..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This will be reviewed by our admin team
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A2139]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0046FF] to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TalentRegistration;

