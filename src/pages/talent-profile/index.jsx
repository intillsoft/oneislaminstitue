import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';

const TalentProfile = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [talent, setTalent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    hourly_rate: '',
    skills: [],
    experience_level: 'intermediate',
    languages: [],
    availability: 'available',
    response_time: 24,
  });

  useEffect(() => {
    if (id) {
      loadTalentProfile();
    } else if (user) {
      // No id provided, check if user has a profile or show create form
      checkExistingProfile();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  // Load profile data into form when editing
  useEffect(() => {
    if (talent && isEditing) {
      setFormData({
        title: talent.title || '',
        bio: talent.bio || '',
        hourly_rate: talent.hourly_rate || '',
        skills: talent.skills || [],
        experience_level: talent.experience_level || 'intermediate',
        languages: talent.languages || [],
        availability: talent.availability || 'available',
        response_time: talent.response_time || 24,
      });
    }
  }, [talent, isEditing]);

  const checkExistingProfile = async () => {
    try {
      setLoading(true);
      // Try to get current user's talent profile
      const profile = await talentService.getProfile(user.id);

      // If profile is null, it doesn't exist - show create form
      if (!profile) {
        setIsCreating(true);
        return;
      }

      // Handle different response structures
      const data = profile?.data || profile;
      if (data && (data.id || data.user_id)) {
        setTalent(data);
        setIsCreating(false);
      } else {
        // No profile exists, show create form
        setIsCreating(true);
      }
    } catch (error) {
      // Profile doesn't exist, show create form
      console.log('No existing profile, showing create form:', error.message);
      setIsCreating(true);
    } finally {
      setLoading(false);
    }
  };

  const loadTalentProfile = async () => {
    try {
      setLoading(true);
      const profile = await talentService.getProfile(id);

      // If profile is null, it doesn't exist
      if (!profile) {
        if (id === user?.id || !id) {
          // User is viewing their own profile, show create form
          setIsCreating(true);
        } else {
          showError('Talent profile not found');
          setTalent(null);
        }
        return;
      }

      // Handle different response structures
      const data = profile?.data || profile;
      if (data && (data.id || data.user_id)) {
        setTalent(data);
        setIsCreating(false);
      } else {
        showError('Talent profile not found');
        setTalent(null);
      }
    } catch (error) {
      console.error('Error loading talent profile:', error);
      // If it's a 404 or not found, profile doesn't exist
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        if (id === user?.id || !id) {
          // User is viewing their own profile, show create form
          setIsCreating(true);
        } else {
          showError('Talent profile not found');
          setTalent(null);
        }
      } else {
        showError('Failed to load talent profile. Please try again.');
        setTalent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e?.preventDefault();
    if (!formData.title || !formData.bio) {
      showError('Please fill in title and bio');
      return;
    }

    try {
      setLoading(true);
      const result = await talentService.createOrUpdateProfile(formData);

      // Always reload the profile after create/update to ensure we have the latest data
      if (user?.id) {
        const profile = await talentService.getProfile(user.id);
        if (profile && (profile.id || profile.user_id)) {
          setTalent(profile);
          setIsCreating(false);
          setIsEditing(false);
          success(isEditing ? 'Talent profile updated successfully!' : 'Talent profile created successfully!');
        } else {
          showError('Profile saved but could not be loaded. Please refresh the page.');
        }
      } else {
        // Fallback: use result directly if available
        if (result && (result.id || result.user_id)) {
          setTalent(result);
          setIsCreating(false);
          setIsEditing(false);
          success(isEditing ? 'Talent profile updated successfully!' : 'Talent profile created successfully!');
        }
      }
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      showError(`Failed to ${isEditing ? 'update' : 'create'} profile: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    // Reload profile to reset form
    if (user?.id) {
      checkExistingProfile();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show create/edit form
  if (isCreating || isEditing || (!talent && !id)) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-8">
              <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-6">
                {isEditing ? 'Edit Your Talent Profile' : 'Create Your Talent Profile'}
              </h1>
              <form onSubmit={handleCreateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Full Stack Developer"
                    className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself and your skills..."
                    rows={6}
                    className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="50"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Profile' : 'Create Profile')}
                  </button>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  ) : (
                    <Link to="/talent/dashboard" className="btn-secondary">
                      Cancel
                    </Link>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!talent && id) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-workflow-primary/10 dark:bg-workflow-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="UserX" className="w-10 h-10 text-workflow-primary" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">Talent Not Found</h2>
            <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-6">
              This talent profile doesn't exist or has been removed.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/talent/discover" className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors text-sm font-medium">
                Browse Talents
              </Link>
              <Link to="/" className="px-4 py-2 bg-surface-100 dark:bg-[#1A2139] text-text-primary dark:text-[#E8EAED] rounded-lg hover:bg-surface-200 dark:hover:bg-[#1E2640] transition-colors text-sm font-medium">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          {/* Cover Image */}
          <div className="relative h-64 rounded-lg overflow-hidden mb-6">
            {talent.cover_image_url ? (
              <img
                src={talent.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-workflow-primary to-workflow-primary-600"></div>
            )}
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#13182E] shadow-lg">
                {talent.profile_picture_url ? (
                  <img
                    src={talent.profile_picture_url}
                    alt={talent.user?.name || 'Talent'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-workflow-primary/10 flex items-center justify-center">
                    <Icon name="User" className="w-16 h-16 text-workflow-primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                    {talent.user?.name || 'Talent'}
                  </h1>
                  <p className="text-xl text-[#64748B] dark:text-[#8B92A3] mb-4">{talent.title}</p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      {renderStars(talent.rating || 0)}
                      <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                        {talent.rating?.toFixed(1) || '0.0'} ({talent.total_reviews || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
                      <Icon name="Clock" size={16} />
                      Responds in {talent.response_time || 24} hours
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
                      <Icon name="MapPin" size={16} />
                      {talent.availability || 'Available'}
                    </div>
                    {talent.is_verified && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                        <Icon name="CheckCircle" size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                {/* Edit button for profile owner */}
                {user?.id === talent.user_id && (
                  <button
                    onClick={handleEditProfile}
                    className="btn-secondary flex items-center gap-2 ml-4"
                  >
                    <Icon name="Edit" size={18} />
                    Edit Profile
                  </button>
                )}

                <div className="flex items-center gap-3">
                  {user?.id === talent.user_id ? (
                    <button
                      onClick={handleEditProfile}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Icon name="Edit" size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <Link
                        to={`/talent/messages?user=${talent.user_id}`}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Icon name="MessageSquare" size={18} />
                        Contact
                      </Link>
                      <Link
                        to={`/talent/gigs?talent=${id || talent.id}`}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Icon name="Briefcase" size={18} />
                        View Gigs
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4">
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                {talent.total_hours_worked || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4">
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                ${talent.total_earnings?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4">
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Hourly Rate</p>
              <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                ${talent.hourly_rate || '0'}/hr
              </p>
            </div>
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4">
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Member Since</p>
              <p className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                {talent.created_at ? formatDistanceToNow(new Date(talent.created_at), { addSuffix: true }) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#E2E8F0] dark:border-[#1E2640] mb-6">
            <nav className="flex space-x-8">
              {['overview', 'gigs', 'reviews', 'portfolio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Bio */}
                  <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">About</h2>
                    <p className="text-[#64748B] dark:text-[#8B92A3] leading-relaxed">
                      {talent.bio || 'No bio available.'}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills && talent.skills.length > 0 ? (
                        talent.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span
                              className="px-3 py-1.5 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                            {user?.id === talent.user_id && (
                              <Link
                                to={`/talent/verify-skill?skill=${encodeURIComponent(skill)}`}
                                title="Verify this skill with AI"
                                className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                              >
                                <Icon name="Shield" size={14} />
                              </Link>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-[#64748B] dark:text-[#8B92A3]">No skills listed</p>
                      )}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Experience</h2>
                    <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium capitalize">
                      {talent.experience_level || 'intermediate'}
                    </span>
                  </div>

                  {/* Languages */}
                  {talent.languages && talent.languages.length > 0 && (
                    <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                      <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Languages</h2>
                      <div className="flex flex-wrap gap-2">
                        {talent.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED] rounded-full text-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {talent.certifications && talent.certifications.length > 0 && (
                    <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                      <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Certifications</h2>
                      <div className="space-y-3">
                        {talent.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Icon name="Award" className="w-5 h-5 text-workflow-primary" />
                            <div>
                              <p className="font-medium text-[#0F172A] dark:text-[#E8EAED]">{cert.name || cert}</p>
                              {cert.issuer && (
                                <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">{cert.issuer}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gigs' && (
                <div className="space-y-4">
                  {talent.gigs && talent.gigs.length > 0 ? (
                    talent.gigs.map((gig) => (
                      <Link
                        key={gig.id}
                        to={`/talent/gigs/${gig.id}`}
                        className="block bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                              {gig.title}
                            </h3>
                            <p className="text-sm text-[#64748B] dark:text-[#8B92A3] line-clamp-2 mb-3">
                              {gig.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-[#64748B] dark:text-[#8B92A3]">
                              <span className="flex items-center gap-1">
                                <Icon name="Clock" size={14} />
                                {gig.delivery_time} days
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                                {gig.rating?.toFixed(1) || '0.0'} ({gig.total_orders || 0})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                              ${gig.price}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg">
                      <Icon name="Briefcase" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                      <p className="text-[#64748B] dark:text-[#8B92A3]">No gigs available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {talent.reviews && talent.reviews.length > 0 ? (
                    talent.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-workflow-primary/10 flex items-center justify-center flex-shrink-0">
                            {review.reviewer?.avatar_url ? (
                              <img
                                src={review.reviewer.avatar_url}
                                alt={review.reviewer.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Icon name="User" className="w-6 h-6 text-workflow-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                                  {review.reviewer?.name || 'Anonymous'}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            {review.review && (
                              <p className="text-[#64748B] dark:text-[#8B92A3] mt-2">{review.review}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg">
                      <Icon name="Star" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                      <p className="text-[#64748B] dark:text-[#8B92A3]">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-4">
                  {talent.portfolio_items && talent.portfolio_items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {talent.portfolio_items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title || 'Portfolio item'}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-1">
                              {item.title || 'Portfolio Item'}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-2">
                                {item.description}
                              </p>
                            )}
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-workflow-primary hover:text-workflow-primary-600"
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg">
                      <Icon name="Image" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                      <p className="text-[#64748B] dark:text-[#8B92A3]">No portfolio items</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Hire This Talent</h3>
                <div className="space-y-3">
                  <Link
                    to={`/talent/gigs?talent=${id}`}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Icon name="Briefcase" size={18} />
                    View All Gigs
                  </Link>
                  <Link
                    to={`/talent/messages?user=${talent.user_id}`}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Icon name="MessageSquare" size={18} />
                    Send Message
                  </Link>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Rating Breakdown</h3>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = talent.reviews?.filter(r => Math.floor(r.rating) === star).length || 0;
                  const percentage = talent.reviews?.length > 0 ? (count / talent.reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-[#64748B] dark:text-[#8B92A3] w-12">{star} star</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-[#1A2139] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#64748B] dark:text-[#8B92A3] w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
