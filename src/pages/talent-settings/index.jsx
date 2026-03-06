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
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Loading configuration nodes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg transition-smooth">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-white mb-2 uppercase tracking-tight">
              Talent Settings
            </h1>
            <p className="text-text-muted dark:text-slate-400 font-medium">
              Calibrate your professional identity and node preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-border dark:border-white/5 mb-8">
            <nav className="flex space-x-10">
              {['profile', 'pricing', 'availability', 'notifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-5 px-2 border-b-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'border-workflow-primary text-workflow-primary'
                      : 'border-transparent text-text-muted hover:text-text-primary'
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
              <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Full Stack Developer"
                    className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={6}
                    placeholder="Tell us about yourself..."
                    className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Technical Arsenal
                  </label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Add a competence"
                      className="flex-1 px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-8 py-4 bg-workflow-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-workflow-primary/80 transition-all shadow-lg shadow-workflow-primary/20"
                    >
                      Inject
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 bg-bg rounded-[1.5rem] border border-border dark:border-white/5">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-workflow-primary/10 border border-workflow-primary/20 text-workflow-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Seniority Level
                  </label>
                  <select
                    value={profileData.experience_level}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all appearance-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Communication Nodes (Languages)
                  </label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                      placeholder="Add a language"
                      className="flex-1 px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="px-8 py-4 bg-workflow-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-workflow-primary/80 transition-all shadow-lg shadow-workflow-primary/20"
                    >
                      Inject
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 bg-bg rounded-[1.5rem] border border-border dark:border-white/5">
                    {profileData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-bg-elevated border border-border dark:border-white/10 text-text-primary dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        {lang}
                        <button
                          onClick={() => handleRemoveLanguage(lang)}
                          className="hover:text-red-500 transition-colors"
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
              <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Hourly Exchange Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={profileData.hourly_rate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                    className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Node Availability Status
                  </label>
                  <select
                    value={profileData.availability}
                    onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all appearance-none"
                  >
                    <option value="available">Available (Instant Connect)</option>
                    <option value="part-time">Part-time Operations</option>
                    <option value="full-time">Full-time Commitment</option>
                    <option value="unavailable">Offline Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-1">
                    Latency Threshold (Response Time hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={profileData.response_time}
                    onChange={(e) => setProfileData(prev => ({ ...prev, response_time: e.target.value }))}
                    className="w-full px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-primary dark:text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2.5rem] p-20 text-center shadow-2xl">
                <Icon name="Bell" className="w-16 h-16 text-bg mx-auto mb-6" />
                <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Transmission Alerts Coming Soon...</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-8">
              <button
                onClick={() => navigate('/talent/dashboard')}
                className="px-8 py-4 border border-border dark:border-white/10 rounded-2xl text-text-muted font-black uppercase tracking-widest text-[11px] hover:bg-bg-elevated transition-all"
              >
                Cancel Protocol
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 bg-workflow-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-workflow-primary/20 disabled:opacity-50"
              >
                {saving ? 'Transmitting...' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentSettings;










