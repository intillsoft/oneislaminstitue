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
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { defaultAvatars, getAvatarUrl } from '../../utils/defaultAvatars';

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
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      // Upload directly to avatars bucket root (no subfolder to avoid RLS issues)
      const filePath = fileName;

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
        applications: applications.data || [],
        savedJobs: savedJobs.data || [],
        exportedAt: new Date().toISOString(),
      };

      // Create download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-data-${Date.now()}.json`;
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
        <title>User Profile - Workflow</title>
      </Helmet>
      <div className="bg-white dark:bg-[#0A0E27] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb customItems={breadcrumbItems} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="relative inline-block group">
                    <Image
                      src={getAvatarUrl(user, profile)}
                      alt={profileData.name || 'User'}
                      className="w-24 h-24 rounded-full object-cover border-4 border-workflow-primary"
                      fallback={getAvatarUrl(user, profile)}
                    />
                    <label className="absolute bottom-0 right-0 bg-workflow-primary text-white rounded-full p-2 cursor-pointer hover:bg-workflow-primary-600 transition-colors shadow-lg">
                      <Icon name="Camera" size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setShowAvatarSelector(true)}
                      className="absolute top-0 right-0 bg-gray-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-gray-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      title="Choose default avatar"
                    >
                      <Icon name="Image" size={14} />
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                    {profileData.name || 'User'}
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                    {profileData.email}
                  </p>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'profile', label: 'Profile', icon: 'User' },
                    { id: 'settings', label: 'Settings', icon: 'Settings' },
                    { id: 'security', label: 'Security', icon: 'Shield' },
                    { id: 'privacy', label: 'Privacy', icon: 'Lock' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                        activeTab === tab.id
                          ? 'bg-workflow-primary text-white'
                          : 'text-[#64748B] dark:text-[#8B92A3] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2139]'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-6">Edit Profile</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="input-field opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="input-field"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="input-field"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading} variant="primary">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Account Settings</h2>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                          className="input-field"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                          className="input-field"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                          Theme
                        </label>
                        <select
                          value={settings.theme}
                          onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                          className="input-field"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications' },
                        { key: 'inAppNotifications', label: 'In-App Notifications' },
                        { key: 'pushNotifications', label: 'Push Notifications' },
                      ].map((notif) => (
                        <label key={notif.key} className="flex items-center justify-between">
                          <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">{notif.label}</span>
                          <input
                            type="checkbox"
                            checked={settings[notif.key]}
                            onChange={(e) => setSettings({ ...settings, [notif.key]: e.target.checked })}
                            className="h-4 w-4 text-workflow-primary focus:ring-workflow-primary border-[#E2E8F0] dark:border-[#1E2640] rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSettingsUpdate} disabled={isLoading} variant="primary">
                      Save Settings
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Security</h2>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Password</h3>
                    <Button onClick={() => setShowChangePasswordModal(true)} variant="outline">
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Connected Accounts</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon name="Mail" size={20} />
                          <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">Email/Password</span>
                        </div>
                        <span className="text-xs text-workflow-primary">Active</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Data Export</h3>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-4">
                      Download all your data in JSON format (GDPR compliant)
                    </p>
                    <Button onClick={handleExportData} disabled={isLoading} variant="outline">
                      <Icon name="Download" size={16} className="mr-2" />
                      Export My Data
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Privacy Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                      className="input-field"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="connections">Connections Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">Allow Data Sharing for Analytics</span>
                      <input
                        type="checkbox"
                        checked={settings.dataSharing}
                        onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
                        className="h-4 w-4 text-workflow-primary focus:ring-workflow-primary border-[#E2E8F0] dark:border-[#1E2640] rounded"
                      />
                    </label>
                  </div>

                  <div className="pt-6 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                    <h3 className="text-lg font-semibold text-error-600 dark:text-error-400 mb-4">Danger Zone</h3>
                    <Button onClick={() => setShowDeleteModal(true)} variant="danger">
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Delete Account
                    </Button>
                    <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-2">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="input-field"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="input-field"
              required
              minLength={8}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={() => setShowChangePasswordModal(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
          </p>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowDeleteModal(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} disabled={isLoading} variant="danger">
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Default Avatar Selector Modal */}
      {showAvatarSelector && (
        <Modal
          isOpen={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          title="Choose Default Avatar"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
              Select a default avatar from the options below
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-4 max-h-96 overflow-y-auto">
              {defaultAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectDefaultAvatar(avatar.url)}
                  className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-workflow-primary transition-all aspect-square"
                >
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <Icon name="Check" size={24} className="text-white opacity-0 group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={() => setShowAvatarSelector(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserProfile;

