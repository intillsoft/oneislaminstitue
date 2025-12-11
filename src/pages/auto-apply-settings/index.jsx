import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Zap, Settings, Bell, X, Plus, BarChart3, FileText, TrendingUp, Calendar, Users, Briefcase, CheckCircle, XCircle, Clock, Eye, RefreshCw } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import Breadcrumb from '../../components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import TypingIndicator from '../../components/ui/TypingIndicator';

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
    location: '',
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
    min_match_score: 60,
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newSkill, setNewSkill] = useState('');
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
          location: data.location || '',
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
          min_match_score: data.min_match_score || 60,
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
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <TypingIndicator />
            <p className="mt-4 text-[#64748B] dark:text-[#8B92A3]">Loading settings...</p>
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
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Autopilot Settings
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Automatically apply to jobs that match your criteria
            </p>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#13182E] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-1">
                    Enable Autopilot
                  </h2>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                    Automatically apply to matching jobs
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
            </motion.div>

            {settings.enabled && (
              <>
                {/* Job Criteria */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#13182E] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] p-6"
                >
                  <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Job Search Criteria
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

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.location}
                        onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., New York, Remote"
                        className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                      />
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

                    {/* Check Interval (Enhanced Autopilot) */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Check Interval (How often to check for new jobs)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={settings.check_interval_minutes || 15}
                          onChange={(e) => setSettings(prev => ({ ...prev, check_interval_minutes: Math.max(5, parseInt(e.target.value) || 15) }))}
                          min="5"
                          max="1440"
                          className="w-32 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        />
                        <select
                          value={settings.check_interval_unit || 'minutes'}
                          onChange={(e) => {
                            const unit = e.target.value;
                            const currentMinutes = settings.check_interval_minutes || 15;
                            const newMinutes = unit === 'hours' ? currentMinutes * 60 : currentMinutes;
                            setSettings(prev => ({ 
                              ...prev, 
                              check_interval_minutes: Math.max(5, newMinutes),
                              check_interval_unit: unit
                            }));
                          }}
                          className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-1">
                        Autopilot will check for new jobs every {settings.check_interval_minutes || 15} {settings.check_interval_unit || 'minutes'}. 
                        Default: 15 minutes (continuous checking)
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Blacklist */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#13182E] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] p-6"
                >
                  <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">
                    Exclusions
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
                </motion.div>

                {/* Notification Preferences */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#13182E] rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] p-6"
                >
                  <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
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
                </motion.div>
              </>
            )}

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end gap-4"
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <TypingIndicator size="small" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoApplySettings;