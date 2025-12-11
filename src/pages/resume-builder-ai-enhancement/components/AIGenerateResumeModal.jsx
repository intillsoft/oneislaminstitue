import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { aiService } from '../../../services/aiService';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AIGenerateResumeModal = ({ isOpen, onClose, onResumeGenerated }) => {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    jobTitle: '',
    experienceLevel: 'mid',
    industry: '',
    skills: [],
    achievements: [],
    style: 'professional',
    jobDescription: '',
    includeATS: true,
  });
  const [skillInput, setSkillInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.jobTitle || !formData.industry || formData.skills.length === 0) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateResume({
        ...formData,
      });
      
      if (result && result.resume) {
        success('Resume generated successfully!');
        // Don't close modal immediately - show result modal instead
        onResumeGenerated(result.resume);
        // Keep modal open to show result
      } else {
        showError('Failed to generate resume. Please try again.');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      showError(error.message || 'Failed to generate resume. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (achievement) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Resume Generator" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-workflow-primary-50 dark:bg-workflow-primary-900/20 border border-workflow-primary-200 dark:border-workflow-primary-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-workflow-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-workflow-primary-700 dark:text-workflow-primary-300 mb-1">
                AI-Powered Resume Generation
              </p>
              <p className="text-xs text-workflow-primary-600 dark:text-workflow-primary-400">
                Our AI will create a professional resume tailored to your experience and target role.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
            placeholder="e.g., Software Engineer, Product Manager"
            className="input-field w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Experience Level *
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
              className="input-field w-full"
              required
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Writing Style
            </label>
            <select
              value={formData.style}
              onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
              className="input-field w-full"
            >
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
            Industry *
          </label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            placeholder="e.g., Technology, Healthcare, Finance"
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
            Skills * (Add at least one)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Type skill and press Enter"
              className="input-field flex-1"
            />
            <Button type="button" onClick={addSkill} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-workflow-primary-50 dark:bg-workflow-primary-900/20 text-workflow-primary rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-workflow-primary-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
            Achievements (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              placeholder="e.g., Led team of 5, Increased revenue by 40%"
              className="input-field flex-1"
            />
            <Button type="button" onClick={addAchievement} variant="secondary">
              Add
            </Button>
          </div>
          <div className="space-y-1">
            {formData.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-[#F8FAFC] dark:bg-[#1A2139] rounded"
              >
                <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">{achievement}</span>
                <button
                  type="button"
                  onClick={() => removeAchievement(achievement)}
                  className="text-error hover:text-error-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
            Job Description (Optional - for ATS optimization)
          </label>
          <textarea
            value={formData.jobDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
            placeholder="Paste job description to optimize resume for ATS"
            rows={4}
            className="input-field w-full resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeATS"
              checked={formData.includeATS}
              onChange={(e) => setFormData(prev => ({ ...prev, includeATS: e.target.checked }))}
              className="h-4 w-4 text-workflow-primary"
            />
            <label htmlFor="includeATS" className="ml-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
              Optimize for ATS (Applicant Tracking Systems)
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading || !formData.jobTitle || !formData.industry || formData.skills.length === 0}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Resume
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AIGenerateResumeModal;