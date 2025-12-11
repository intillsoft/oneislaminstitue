import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';

const TalentSettings = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    title: '',
    bio: '',
    hourly_rate: '',
    skills: [],
    experience_level: 'intermediate',
    languages: [],
    availability: 'available',
    response_time: '24',
  });
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Get current user's talent profile
      const profile = await talentService.getProfile(user?.id);
      if (profile) {
        setProfileData({
          title: profile.title || '',
          bio: profile.bio || '',
          hourly_rate: profile.hourly_rate?.toString() || '',
          skills: profile.skills || [],
          experience_level: profile.experience_level || 'intermediate',
          languages: profile.languages || [],
          availability: profile.availability || 'available',
          response_time: profile.response_time?.toString() || '24',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await talentService.createOrUpdateProfile({
        ...profileData,
        hourly_rate: parseFloat(profileData.hourly_rate) || 0,
        response_time: parseInt(profileData.response_time) || 24,
      });
      success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !profileData.languages.includes(languageInput.trim())) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }));
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (lang) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Talent Settings
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Manage your profile and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#E2E8F0] dark:border-[#1E2640] mb-6">
            <nav className="flex space-x-8">
              {['profile', 'pricing', 'availability', 'notifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-workflow-primary text-workflow-primary'
                      : 'border-transparent text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Full Stack Developer"
                    className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={6}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Experience Level
                  </label>
                  <select
                    value={profileData.experience_level}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Languages
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                      placeholder="Add a language"
                      className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED] rounded-full text-sm flex items-center gap-2"
                      >
                        {lang}
                        <button
                          onClick={() => handleRemoveLanguage(lang)}
                          className="hover:text-red-500"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={profileData.hourly_rate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                  />
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Availability Status
                  </label>
                  <select
                    value={profileData.availability}
                    onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                  >
                    <option value="available">Available</option>
                    <option value="part-time">Part-time</option>
                    <option value="full-time">Full-time</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Response Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={profileData.response_time}
                    onChange={(e) => setProfileData(prev => ({ ...prev, response_time: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <p className="text-[#64748B] dark:text-[#8B92A3]">Notification settings coming soon...</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => navigate('/talent/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentSettings;









