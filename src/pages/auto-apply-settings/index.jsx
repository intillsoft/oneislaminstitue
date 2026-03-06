import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Zap, Settings, Bell, X, Plus, BarChart3, FileText, TrendingUp, Calendar, Users, Briefcase, CheckCircle, XCircle, Clock, Eye, RefreshCw } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import TypingIndicator from '../../components/ui/TypingIndicator';
import { EliteCard, ElitePageHeader } from '../../components/ui/EliteCard';

const AutoApplySettings = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    job_title_keywords: [],
    skills_required: [],
    salary_min: '',
    salary_max: '',
    location: [], // Now array for multiple locations
    remote_only: false,
    job_type: [],
    experience_level: [],
    company_size: [],
    industry: [],
    excluded_companies: [],
    excluded_titles: [],
    frequency: 'continuous',
    check_interval_minutes: 15,
    max_applications_per_day: 10,
    notification_platform: true,
    notification_email: true,
    notification_sms: false,
    use_ai_matching: true,
    generate_cover_letter: true,
    min_match_score: 50,
    allowed_platforms: ['internal', 'linkedin', 'glassdoor', 'indeed'],
    best_resume_matching: true,
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newExcludedCompany, setNewExcludedCompany] = useState('');
  const [newExcludedTitle, setNewExcludedTitle] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('settings');
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    successfulApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    todayApplications: 0,
    weeklyApplications: 0,
    monthlyApplications: 0,
    averageResponseTime: 0,
    topSkills: [],
    applicationTrends: [],
  });
  const [logsLoading, setLogsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/autopilot/settings');
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        setSettings({
          enabled: data.enabled || false,
          job_title_keywords: data.job_title_keywords || [],
          skills_required: data.skills_required || [],
          salary_min: data.salary_min || '',
          salary_max: data.salary_max || '',
          location: Array.isArray(data.location) ? data.location : (data.location ? [data.location] : []),
          remote_only: data.remote_only || false,
          job_type: data.job_type || [],
          experience_level: data.experience_level || [],
          company_size: data.company_size || [],
          industry: data.industry || [],
          excluded_companies: data.excluded_companies || [],
          excluded_titles: data.excluded_titles || [],
          frequency: data.frequency || 'continuous',
          check_interval_minutes: data.check_interval_minutes || 15,
          max_applications_per_day: data.max_applications_per_day || 10,
          notification_platform: data.notification_platform ?? true,
          notification_email: data.notification_email ?? true,
          notification_sms: data.notification_sms ?? false,
          use_ai_matching: data.use_ai_matching ?? true,
          generate_cover_letter: data.generate_cover_letter ?? true,
          min_match_score: data.min_match_score || 50,
          allowed_platforms: data.allowed_platforms || ['internal', 'linkedin', 'glassdoor', 'indeed'],
          best_resume_matching: data.best_resume_matching ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiService.autopilot.saveSettings(settings);
      if (response.data?.success) {
        success('Autopilot settings saved successfully!');
      } else {
        showError('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showError(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const loadLogs = async (params = {}) => {
    try {
      setLogsLoading(true);
      const response = await apiService.autopilot.getLogs(params);
      if (response.data?.success) {
        setLogs(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      showError('Failed to load application logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const response = await apiService.statistics.getOverview();
      if (response.data?.success) {
        setStatistics(response.data.data || statistics);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      showError('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setSettings(prev => ({
        ...prev,
        job_title_keywords: [...prev.job_title_keywords, newKeyword.trim()],
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setSettings(prev => ({
      ...prev,
      job_title_keywords: prev.job_title_keywords.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSettings(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSettings(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter((_, i) => i !== index),
    }));
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      setSettings(prev => ({
        ...prev,
        location: [...(prev.location || []), newLocation.trim()],
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (index) => {
    setSettings(prev => ({
      ...prev,
      location: Array.isArray(prev.location) ? prev.location.filter((_, i) => i !== index) : [],
    }));
  };

  const addExcludedCompany = () => {
    if (newExcludedCompany.trim()) {
      setSettings(prev => ({
        ...prev,
        excluded_companies: [...prev.excluded_companies, newExcludedCompany.trim()],
      }));
      setNewExcludedCompany('');
    }
  };

  const removeExcludedCompany = (index) => {
    setSettings(prev => ({
      ...prev,
      excluded_companies: prev.excluded_companies.filter((_, i) => i !== index),
    }));
  };

  const addExcludedTitle = () => {
    if (newExcludedTitle.trim()) {
      setSettings(prev => ({
        ...prev,
        excluded_titles: [...prev.excluded_titles, newExcludedTitle.trim()],
      }));
      setNewExcludedTitle('');
    }
  };

  const removeExcludedTitle = (index) => {
    setSettings(prev => ({
      ...prev,
      excluded_titles: prev.excluded_titles.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-private flex items-center justify-center">
        <div className="text-center">
          <TypingIndicator />
          <p className="mt-4 text-slate-500 font-black text-[10px] uppercase tracking-widest">Synchronizing Neural Config...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-private pb-12">
      <div className="max-w-[1600px] mx-auto transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ElitePageHeader
            title="Protocol Configuration"
            description="Configure autonomous submission logic and neural filters"
            badge="Advanced"
          />

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    System Activation
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">
                    Authorize autonomous submission engine
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-workflow-primary/20 dark:peer-focus:ring-workflow-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-workflow-primary"></div>
                </label>
              </div>
            </div>

            {settings.enabled && (
              <>
                {/* Job Criteria */}
                <div className="bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                    <Settings className="w-4 h-4 text-workflow-primary" />
                    Target Matrix Parameters
                  </h2>

                  <div className="space-y-4">
                    {/* Job Title Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Job Title Keywords
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                          placeholder="e.g., Software Engineer"
                          className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                        <button
                          onClick={addKeyword}
                          className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {settings.job_title_keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-workflow-primary/10 text-workflow-primary rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(index)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Required Skills
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          placeholder="e.g., React, Node.js"
                          className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                        <button
                          onClick={addSkill}
                          className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {settings.skills_required.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-workflow-primary/10 text-workflow-primary rounded-full text-sm"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(index)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Salary Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Min Salary ($)
                        </label>
                        <input
                          type="number"
                          value={settings.salary_min}
                          onChange={(e) => setSettings(prev => ({ ...prev, salary_min: e.target.value }))}
                          placeholder="50000"
                          className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Max Salary ($)
                        </label>
                        <input
                          type="number"
                          value={settings.salary_max}
                          onChange={(e) => setSettings(prev => ({ ...prev, salary_max: e.target.value }))}
                          placeholder="150000"
                          className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Locations
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                          placeholder="e.g., New York, Remote"
                          className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                        <button
                          onClick={addLocation}
                          className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {settings.location && settings.location.map((loc, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-workflow-primary/10 text-workflow-primary rounded-full text-sm"
                          >
                            {loc}
                            <button
                              onClick={() => removeLocation(index)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={settings.remote_only}
                          onChange={(e) => setSettings(prev => ({ ...prev, remote_only: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Remote only</span>
                      </label>
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Job Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['full-time', 'part-time', 'contract', 'freelance'].map(type => (
                          <label key={type} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={settings.job_type.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSettings(prev => ({ ...prev, job_type: [...prev.job_type, type] }));
                                } else {
                                  setSettings(prev => ({ ...prev, job_type: prev.job_type.filter(t => t !== type) }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-[#64748B] dark:text-[#8B92A3] capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Experience Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['entry', 'mid', 'senior'].map(level => (
                          <label key={level} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={settings.experience_level.includes(level)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSettings(prev => ({ ...prev, experience_level: [...prev.experience_level, level] }));
                                } else {
                                  setSettings(prev => ({ ...prev, experience_level: prev.experience_level.filter(l => l !== level) }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-[#64748B] dark:text-[#8B92A3] capitalize">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Max Applications Per Day */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Max Applications Per Day
                      </label>
                      <input
                        type="number"
                        value={settings.max_applications_per_day}
                        onChange={(e) => setSettings(prev => ({ ...prev, max_applications_per_day: parseInt(e.target.value) || 10 }))}
                        min="1"
                        max="50"
                        className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                      />
                    </div>

                    {/* Autopilot Intelligence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.best_resume_matching}
                            onChange={(e) => setSettings(prev => ({ ...prev, best_resume_matching: e.target.checked }))}
                            className="mt-1 rounded border-white/20 bg-white/5 text-workflow-primary focus:ring-workflow-primary"
                          />
                          <div>
                            <span className="text-sm font-bold text-white block mb-0.5">Neural Resume Selection</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              AI will score ALL your resumes and pick the absolute best match for each job.
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.use_ai_matching}
                            onChange={(e) => setSettings(prev => ({ ...prev, use_ai_matching: e.target.checked }))}
                            className="mt-1 rounded border-white/20 bg-white/5 text-workflow-primary focus:ring-workflow-primary"
                          />
                          <div>
                            <span className="text-sm font-bold text-white block mb-0.5">AI Barrier Filter</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              Only apply if match score exceeds {settings.min_match_score}%.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Platform Targeting */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                        Authorized Environments (Platforms)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['internal', 'linkedin', 'glassdoor', 'indeed', 'monster', 'ziprecruiter'].map(platform => (
                          <label
                            key={platform}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${settings.allowed_platforms?.includes(platform)
                              ? 'bg-workflow-primary/10 border-workflow-primary/30 text-workflow-primary'
                              : 'bg-white/[0.03] border-white/5 text-slate-500 hover:bg-white/[0.05]'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={settings.allowed_platforms?.includes(platform)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSettings(prev => ({
                                  ...prev,
                                  allowed_platforms: checked
                                    ? [...(prev.allowed_platforms || []), platform]
                                    : (prev.allowed_platforms || []).filter(p => p !== platform)
                                }));
                              }}
                              className="sr-only"
                            />
                            <div className="text-[10px] font-black uppercase tracking-widest">{platform}</div>
                            <div className={`w-1 h-1 rounded-full mt-2 ${settings.allowed_platforms?.includes(platform) ? 'bg-workflow-primary' : 'bg-transparent'}`} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blacklist */}
                <div className="bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
                    Exclusion Protocol
                  </h2>

                  <div className="space-y-4">
                    {/* Excluded Companies */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Excluded Companies
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newExcludedCompany}
                          onChange={(e) => setNewExcludedCompany(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addExcludedCompany()}
                          placeholder="Company name"
                          className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                        <button
                          onClick={addExcludedCompany}
                          className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {settings.excluded_companies.map((company, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm"
                          >
                            {company}
                            <button
                              onClick={() => removeExcludedCompany(index)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Excluded Titles */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Excluded Job Titles
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newExcludedTitle}
                          onChange={(e) => setNewExcludedTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addExcludedTitle()}
                          placeholder="Job title"
                          className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                        <button
                          onClick={addExcludedTitle}
                          className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {settings.excluded_titles.map((title, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm"
                          >
                            {title}
                            <button
                              onClick={() => removeExcludedTitle(index)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-[#13182E]/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                    <Bell className="w-4 h-4 text-workflow-primary" />
                    Alert Routing
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.notification_platform}
                        onChange={(e) => setSettings(prev => ({ ...prev, notification_platform: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">Platform notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.notification_email}
                        onChange={(e) => setSettings(prev => ({ ...prev, notification_email: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.notification_sms}
                        onChange={(e) => setSettings(prev => ({ ...prev, notification_sms: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">SMS notifications</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 bg-workflow-primary text-white rounded-2xl hover:brightness-110 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-workflow-primary/20 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <TypingIndicator size="small" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Commit Protocols
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoApplySettings;