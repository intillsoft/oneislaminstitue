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
      navigate('/login');
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
      navigate('/dashboard/student');
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
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-workflow-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-workflow-accent/10 rounded-full blur-[100px]"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-bg-elevated border border-border dark:border-white/5 rounded-[2.5rem] shadow-2xl p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-workflow-primary/10 border border-workflow-primary/20 mb-6 shadow-xl shadow-workflow-primary/10">
            <Icon name="User" className="w-10 h-10 text-workflow-primary" />
          </div>
          <h1 className="text-4xl font-black text-text-primary dark:text-white mb-3 uppercase tracking-tight">
            Become a Scholar
          </h1>
          <p className="text-text-muted dark:text-slate-400 font-medium">
            Join our elite academic circle and start contributing to sacred knowledge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
              Academic Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Scholar of Tafsir, Researcher in Islamic History"
              className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
              Intellectual Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              placeholder="Outline your scholarly background and areas of expertise..."
              className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight shadow-sm resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                Consultation Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                placeholder="e.g., 50 (if applicable)"
                className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                Experience Tier
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight shadow-sm appearance-none"
              >
                <option value="beginner">Foundational</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Senior Scholar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
              Scholarly Toolkit (Competencies)
            </label>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a competence and press Enter"
                className="flex-1 px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-8 py-4 bg-workflow-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-workflow-primary/80 transition-all shadow-lg shadow-workflow-primary/20"
              >
                Append
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-bg rounded-2xl border border-border dark:border-white/5">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-workflow-primary/10 border border-workflow-primary/20 text-workflow-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 transition-colors"
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
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                Academic Profile
              </label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                placeholder="https://yourprofile.com"
                className="w-full px-4 py-3 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/you"
                className="w-full px-4 py-3 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                Research URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://researchgate.net/you"
                className="w-full px-4 py-3 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
              Purpose Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              placeholder="Why do you wish to contribute to our academic circle?"
              className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight shadow-sm resize-none"
              required
            />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2 px-1">
              This proposal will be reviewed by the board of trustees
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-8 py-4 border border-border dark:border-white/10 rounded-2xl text-text-muted dark:text-slate-400 font-black uppercase tracking-widest text-[11px] hover:bg-bg/50 transition-all"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-8 py-4 bg-workflow-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-xl shadow-workflow-primary/20 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Transmitting Proposal...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TalentRegistration;
