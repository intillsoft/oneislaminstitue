import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { auth } from '../../lib/supabase';
import { apiService } from '../../lib/api';
import { defaultAvatars, getAvatarUrl } from '../../utils/defaultAvatars';
import { EliteCard, ElitePageHeader, EliteStatCard } from '../../components/ui/EliteCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import progressService from '../../services/progressService';
import { certificateService } from '../../services/certificateService';
import { Award, Flame, TrendingUp, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user, profile, updateProfile, signOut } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Student Stats State
  const [studentStats, setStudentStats] = useState({
    certificates: 0,
    streak: 0,
    avgScore: 0
  });
  const [scholarLevel, setScholarLevel] = useState('Rising Star');

  useEffect(() => {
    if (user) {
        const fetchStats = async () => {
            try {
                const [certStats, streakData] = await Promise.all([
                    certificateService.getStats().catch(() => ({ totalCertificates: 0, avgScore: 0 })),
                    progressService.getStreakData().catch(() => ({ currentStreak: 0 }))
                ]);
                
                setStudentStats({
                    certificates: certStats.totalCertificates || 0,
                    streak: streakData.currentStreak || 0,
                    avgScore: certStats.avgScore || 0
                });

                // Calculate Level
                const count = certStats.totalCertificates || 0;
                setScholarLevel(
                    count >= 10 ? 'Legacy Seeker' :
                    count >= 5 ? 'Advanced Learner' :
                    count >= 3 ? 'Dedicated Student' : 'Rising Star'
                );
            } catch (e) {
                console.error("Failed to fetch profile stats", e);
            }
        };
        fetchStats();
    }
  }, [user]);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: '',
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Settings state
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: localStorage.getItem('theme') || 'light',
    emailNotifications: true,
    inAppNotifications: true,
    pushNotifications: false,
    profileVisibility: 'public',
    dataSharing: false,
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });

      // Sync settings from profile preferences if they exist
      if (profile.preferences) {
        setSettings(prev => ({
          ...prev,
          ...profile.preferences,
          // Ensure theme syncs correctly with localStorage if it exists there
          theme: profile.preferences.theme || localStorage.getItem('theme') || 'light'
        }));
      }
    }
  }, [profile, user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      success('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Diagnostic: List buckets to confirm visibility
    const checkStorage = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        console.log('🔍 Debug: Available Buckets:', data?.map(b => b.name), error);
      } catch (err) {
        console.error('🔍 Debug: Storage Check Failed:', err);
      }
    };
    checkStorage();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      // Upload to user folder to satisfy RLS foldername check and avoid collisions
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update user profile
      await updateProfile({ avatar_url: avatarUrl });
      success('Avatar updated successfully');

      // Refresh profile data
      setProfileData(prev => ({ ...prev, avatar_url: avatarUrl }));
    } catch (error) {
      console.error('Avatar upload error:', error);
      showError(`Failed to upload avatar: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDefaultAvatar = async (imageUrl) => {
    setIsLoading(true);
    try {
      await updateProfile({ avatar_url: imageUrl });
      success('Avatar updated successfully');
      setProfileData(prev => ({ ...prev, avatar_url: imageUrl }));
      setShowAvatarSelector(false);
    } catch (error) {
      console.error('Avatar update error:', error);
      showError('Failed to update avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Verify current password by attempting to sign in
      await auth.signIn(user.email, passwordData.currentPassword);

      // Update password
      await auth.updatePassword(passwordData.newPassword);
      success('Password changed successfully');
      setShowChangePasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showError(error.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Soft delete - update user profile
      await supabase
        .from('users')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', user.id);

      // Sign out
      await signOut();
      success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      showError('Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleSettingsUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ preferences: settings });

      // Update email preferences via API
      try {
        await apiService.email.updatePreference('welcome', settings.emailNotifications);
        await apiService.email.updatePreference('job_recommendations', settings.emailNotifications);
        await apiService.email.updatePreference('application_updates', settings.emailNotifications);
        await apiService.email.updatePreference('interview_reminders', settings.emailNotifications);
      } catch (emailError) {
        console.error('Email preferences update error:', emailError);
        // Don't fail the whole update if email prefs fail
      }

      // Update theme in localStorage
      if (settings.theme) {
        localStorage.setItem('theme', settings.theme);
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      }
      success('Settings updated successfully');
    } catch (error) {
      showError('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Fetch all user data
      const [resumes, applications, savedJobs] = await Promise.all([
        supabase.from('resumes').select('*').eq('user_id', user.id),
        supabase.from('applications').select('*').eq('user_id', user.id),
        supabase.from('saved_jobs').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        profile: profile,
        resumes: resumes.data || [],
        enrollments: applications.data || [],
        savedCourses: savedJobs.data || [],
        exportedAt: new Date().toISOString(),
      };

      // Create download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `academic-identity-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      success('Data exported successfully');
    } catch (error) {
      showError('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/user-profile', isLast: true }
  ];

  return (
    <>
      <Helmet>
        <title>Academic Identity Registry - One Islam Institute</title>
      </Helmet>
      <div className="pb-20">
        <div className="mx-auto pt-6">
            <ElitePageHeader
              title="Academic Identity"
              description="Managing your scholarly presence and cryptographic credentials within the One Islam Institute."
              badge="Scholar Profile"
            />

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-4">
                <EliteCard className="p-10 sticky top-24 border-border/50 dark:border-emerald-500/10 shadow-3xl bg-surface-elevated/50 backdrop-blur-xl rounded-[40px]">
                  <div className="relative mb-8 flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/5 p-1 bg-bg group-hover:border-emerald-500/30 transition-all duration-700 shadow-2xl relative z-10">
                        <Image
                          src={getAvatarUrl(user, profile)}
                          alt={profileData.name || 'User'}
                          className="w-full h-full rounded-2xl object-cover"
                          fallback={getAvatarUrl(user, profile)}
                        />
                      </div>
                      
                      <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="absolute -bottom-2 -right-2 flex gap-3 z-50">
                        <button 
                          onClick={() => setShowAvatarSelector(true)}
                          className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center"
                          title="Select Scholarly Avatar"
                        >
                          <Icon name="UserCircle" size={16} />
                        </button>
                        <label 
                          className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all active:scale-95 flex items-center justify-center" 
                          title="Upload Custom Identity"
                        >
                          <Icon name="Camera" size={16} />
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {profileData.name || 'Scholar'}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5 opacity-40">
                         Academic Identity
                      </p>
                      
                      <div className="flex justify-center gap-2 mt-4">
                        <div className="px-3 py-1 bg-white/5 border border-white/5 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-lg">
                            {scholarLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <nav className="space-y-3">
                    {[
                      { id: 'profile', label: 'Identity Overview', icon: 'User' },
                      { id: 'settings', label: 'Environment', icon: 'Settings' },
                      { id: 'security', label: 'Security Protocols', icon: 'Shield' },
                      { id: 'privacy', label: 'Data Governance', icon: 'Lock' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-5 px-6 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 group ${activeTab === tab.id
                          ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 translate-x-1'
                          : 'text-text-muted hover:bg-emerald-500/5 hover:text-emerald-500'
                          }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-white/20' : 'bg-surface group-hover:bg-emerald-500/10'}`}>
                            <Icon name={tab.icon} size={16} />
                        </div>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </EliteCard>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-8">
                {activeTab === 'profile' && (
                  <EliteCard className="p-10 border-border dark:border-emerald-500/10 shadow-3xl bg-surface-elevated/50 backdrop-blur-xl rounded-[40px]">
                    <div className="flex items-center gap-5 mb-12 pb-8 border-b border-border/50">
                      <div className="w-1.5 h-10 bg-emerald-600 rounded-full shadow-glow-emerald" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Identity Registry</h2>
                    </div>

                    {/* Academic Snapshot */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-emerald-500/20 transition-all">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scholar Level</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{scholarLevel}</h4>
                        </div>
                        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-emerald-500/20 transition-all">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Certificates</p>
                            <h4 className="text-xl font-black text-white">{studentStats?.certificates || 0}</h4>
                        </div>
                        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-emerald-500/20 transition-all">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Study Streak</p>
                            <h4 className="text-xl font-black text-white">{studentStats?.streak || 0}d</h4>
                        </div>
                        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-emerald-500/20 transition-all">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Avg Score</p>
                            <h4 className="text-xl font-black text-white">{studentStats?.avgScore || 0}%</h4>
                        </div>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Legal Designation</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-slate-900 dark:text-white text-sm font-medium tracking-tight focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none placeholder:text-slate-300 dark:placeholder:text-white/10"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Access Link</label>
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 rounded-2xl text-slate-400 dark:text-slate-500 text-sm font-medium tracking-tight cursor-not-allowed outline-none"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tele-Comm Channel</label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-slate-900 dark:text-white text-sm font-medium tracking-tight focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none"
                            placeholder="+0 (000) 000-0000"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Geospatial Marker</label>
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-slate-900 dark:text-white text-sm font-medium tracking-tight focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none"
                            placeholder="City, Nation"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Narrative</label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="w-full px-5 py-5 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl text-slate-900 dark:text-white text-sm font-medium tracking-tight focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all outline-none min-h-[160px] resize-none"
                            placeholder="Detail your academic expertise and scholar trajectory..."
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end pt-8">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-10 py-4 bg-emerald-600 text-white rounded-[20px] hover:bg-emerald-500 active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 disabled:opacity-50 flex items-center gap-3"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Icon name="Save" size={16} />
                            )}
                            Commit Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </EliteCard>
                )}

                {activeTab === 'settings' && (
                  <EliteCard className="p-10 border-border dark:border-emerald-500/10 shadow-3xl bg-surface-elevated/50 backdrop-blur-xl rounded-[40px]">
                    <div className="flex items-center gap-5 mb-12 pb-8 border-b border-border/50">
                      <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-glow-blue" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Environmental Control</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Linguistic Matrix</label>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none appearance-none"
                          >
                            <option value="en" className="bg-bg-elevated">English (Standard)</option>
                            <option value="ar" className="bg-bg-elevated">Arabic (Classical)</option>
                            <option value="ur" className="bg-bg-elevated">Urdu (Academic)</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Geospatial Chronology</label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none appearance-none"
                          >
                            <option value="America/New_York" className="bg-bg-elevated">UTC -5 (Eastern)</option>
                            <option value="Europe/London" className="bg-bg-elevated">UTC +0 (GMT)</option>
                            <option value="Asia/Riyadh" className="bg-bg-elevated">UTC +3 (AST)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Interface Aesthetic</label>
                          <select
                            value={settings.theme}
                            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                            className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none appearance-none"
                          >
                            <option value="dark" className="bg-bg-elevated">Emerald Night (Premium)</option>
                            <option value="light" className="bg-bg-elevated">Academic Light</option>
                            <option value="system" className="bg-bg-elevated">System Logic</option>
                          </select>
                        </div>

                        <div className="space-y-6 bg-surface/30 p-8 rounded-[32px] border border-border/50">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Telemetry & Alerts</label>
                          <div className="space-y-5">
                            {[
                                { key: 'emailNotifications', label: 'Scholarly Insights via Email' },
                                { key: 'inAppNotifications', label: 'Platform Synchronization' },
                                { key: 'pushNotifications', label: 'Real-time Authority Alerts' },
                            ].map((notif) => (
                              <label key={notif.key} className="flex items-center justify-between cursor-pointer group">
                                <span className="text-[11px] font-bold text-text-muted group-hover:text-white transition-colors uppercase tracking-wide">{notif.label}</span>
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={settings[notif.key]}
                                    onChange={(e) => setSettings({ ...settings, [notif.key]: e.target.checked })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-12 h-6 bg-border/50 rounded-full peer peer-checked:bg-emerald-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 shadow-inner"></div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-12 pt-10 border-t border-border/50">
                      <button
                        onClick={handleSettingsUpdate}
                        disabled={isLoading}
                        className="px-10 py-4 bg-emerald-600 text-white rounded-[20px] hover:bg-emerald-500 active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20"
                      >
                        Synchronize Environment
                      </button>
                    </div>
                  </EliteCard>
                )}

                {activeTab === 'security' && (
                  <EliteCard className="p-10 border-border dark:border-emerald-500/10 shadow-3xl bg-surface-elevated/50 backdrop-blur-xl rounded-[40px]">
                    <div className="flex items-center gap-5 mb-12 pb-8 border-b border-border/50">
                      <div className="w-1.5 h-10 bg-amber-600 rounded-full shadow-glow-amber" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Security Protocols</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <div className="bg-surface/30 p-8 rounded-[32px] border border-border/50 group hover:border-emerald-500/30 transition-all shadow-xl">
                          <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                              <Icon name="Key" size={24} />
                            </div>
                            <div>
                              <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">Access Credentials</h3>
                              <p className="text-[9px] text-text-muted mt-1 uppercase tracking-widest font-black opacity-60">Authentication Layer Key</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowChangePasswordModal(true)}
                            className="w-full py-4 bg-surface rounded-2xl hover:bg-surface-elevated transition-all font-black uppercase tracking-widest text-[9px] border border-border/50 text-white shadow-xl shadow-black/20 active:scale-95"
                          >
                            Update Master Key
                          </button>
                        </div>

                        <div className="bg-surface/30 p-8 rounded-[32px] border border-border/50 shadow-xl">
                          <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                              <Icon name="Globe" size={24} />
                            </div>
                            <div>
                              <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">Connected Matrix</h3>
                              <p className="text-[9px] text-text-muted mt-1 uppercase tracking-widest font-black opacity-60">Verified Gateways</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-glow-emerald" />
                              Primary Scholarly Identity
                            </span>
                            <Icon name="Check" size={14} className="text-emerald-500 stroke-[3px]" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-surface/30 p-8 rounded-[32px] border border-border/50 group hover:border-amber-500/30 transition-all shadow-xl h-full flex flex-col">
                          <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                              <Icon name="Download" size={24} />
                            </div>
                            <div>
                              <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">Data Sovereignty</h3>
                              <p className="text-[9px] text-text-muted mt-1 uppercase tracking-widest font-black opacity-60">GDPR Compliance Archive</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-text-muted mb-auto leading-relaxed font-bold opacity-70">
                            Download a comprehensive cryptographic archive of your scholarly records, assets, and operational telemetry.
                          </p>
                          <button
                            onClick={handleExportData}
                            disabled={isLoading}
                            className="w-full mt-8 py-4 bg-amber-600 text-white rounded-2xl hover:bg-amber-500 transition-all font-black uppercase tracking-widest text-[9px] shadow-xl shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-3"
                          >
                            <Icon name="Database" size={14} />
                            Initiate Archive Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </EliteCard>
                )}

                {activeTab === 'privacy' && (
                  <EliteCard className="p-10 border-border dark:border-emerald-500/10 shadow-3xl bg-surface-elevated/50 backdrop-blur-xl rounded-[40px]">
                    <div className="flex items-center gap-5 mb-12 pb-8 border-b border-border/50">
                      <div className="w-1.5 h-10 bg-purple-600 rounded-full shadow-glow-purple" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Data Governance</h2>
                    </div>

                    <div className="space-y-12">
                      <div className="max-w-md space-y-4">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Network Visibility Protocols</label>
                        <select
                          value={settings.profileVisibility}
                          onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                          className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all outline-none appearance-none"
                        >
                          <option value="public" className="bg-bg-elevated">Public (Academic Registry)</option>
                          <option value="private" className="bg-bg-elevated">Private (Encrypted Node)</option>
                          <option value="connections" className="bg-bg-elevated">Verified Circles Only</option>
                        </select>
                      </div>

                      <label className="flex items-center justify-between p-8 bg-surface/30 border border-border/50 rounded-[32px] cursor-pointer group hover:bg-surface-elevated/50 transition-all shadow-xl">
                        <div className="flex-1 pr-10">
                          <span className="block text-[11px] font-black text-white uppercase tracking-widest">Analytics Telemetry</span>
                          <span className="block text-[9px] text-text-muted mt-2 uppercase tracking-widest font-black opacity-60">Allow usage data sharing for platform evolution</span>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings.dataSharing}
                            onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-border/50 rounded-full peer peer-checked:bg-purple-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 shadow-inner"></div>
                        </div>
                      </label>

                      <div className="pt-12 border-t border-border/50 mt-12">
                        <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-rose-500/5 border border-rose-500/10 rounded-[40px] gap-10 shadow-2xl shadow-rose-500/5">
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-rose-500 uppercase tracking-tight">Identity Dissolution</h3>
                            <p className="text-[10px] text-text-muted mt-3 uppercase tracking-widest leading-relaxed font-bold opacity-70 max-w-sm">
                              Permanently expunge your scholarly identity and all associated operational metadata from our distributed matrix. This action is terminal and irreversible.
                            </p>
                          </div>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-10 py-5 bg-rose-600 text-white rounded-[20px] hover:bg-rose-500 transition-all font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-rose-600/20 active:scale-95 whitespace-nowrap"
                          >
                            Execute Purge
                          </button>
                        </div>
                      </div>
                    </div>
                  </EliteCard>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
          title="Security Update: Password"
          className="bg-surface-elevated/90 backdrop-blur-2xl border-emerald-500/20"
        >
          <form onSubmit={handleChangePassword} className="space-y-6 p-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                Current Access Secret
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                New Verification Key
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                Confirm New Key
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-6 py-4 bg-surface border border-border/50 rounded-[20px] text-white font-bold tracking-tight focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none"
                required
                minLength={8}
              />
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={() => setShowChangePasswordModal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">
                Abort
              </button>
              <button type="submit" disabled={isLoading} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 active:scale-95">
                {isLoading ? 'Encrypting...' : 'Update Key'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Terminal Action: Purge"
          className="bg-surface-elevated/90 backdrop-blur-2xl border-rose-500/20"
        >
          <div className="space-y-6 p-2">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <p className="text-xs font-bold text-rose-500 leading-relaxed text-center">
                  WARNING: This procedure is terminal. All cryptographic records, scholarly progress, and identity metadata will be permanently expunged from the distributed matrix.
                </p>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">
                Cancel Purge
              </button>
              <button onClick={handleDeleteAccount} disabled={isLoading} className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/20 active:scale-95">
                {isLoading ? 'Executing...' : 'Confirm Purge'}
              </button>
            </div>
          </div>
        </Modal>

        {/* Default Avatar Selector Modal */}
        {showAvatarSelector && (
          <Modal
            isOpen={showAvatarSelector}
            onClose={() => setShowAvatarSelector(false)}
            title="Registry: Avatar Selection"
            size="lg"
            className="bg-surface-elevated/90 backdrop-blur-2xl border-emerald-500/20"
          >
            <div className="space-y-6 p-2">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">
                Select a pre-verified scholarly identifier
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 p-2 max-h-96 overflow-y-auto custom-emerald-scrollbar">
                {defaultAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleSelectDefaultAvatar(avatar.url)}
                    className="relative group rounded-[24px] overflow-hidden border-2 border-transparent hover:border-emerald-500/50 transition-all aspect-square p-1 bg-surface shadow-xl"
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-full object-cover rounded-[18px]"
                    />
                    <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icon name="Check" size={24} className="text-white" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-6 border-t border-border/50">
                <button onClick={() => setShowAvatarSelector(false)} className="px-8 py-3 bg-surface text-text-muted hover:text-white border border-border/50 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                  Close Registry
                </button>
              </div>
            </div>
          </Modal>
        )}
    </>
  );
};

export default UserProfile;

