import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { EliteCard } from '../../components/ui/EliteCard';
import { ElitePageHeader } from '../../components/ui/EliteCard';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
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
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[280px]'} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-workflow-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-workflow-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs animate-pulse">Initializing Profile Engine</p>
          </div>
        </div>
      </div>
    );
  }

  // Show create/edit form
  if (isCreating || isEditing || (!talent && !id)) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[280px]'} min-h-screen`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ElitePageHeader
              title={isEditing ? 'Management Engine' : 'Creation Portal'}
              description={isEditing ? 'Refining your professional identity' : 'Establishing your presence in the network'}
            />

            <EliteCard className="p-10 border-white/5 mt-8">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-workflow-primary/10 flex items-center justify-center">
                  <Icon name={isEditing ? 'ShieldCheck' : 'Target'} className="w-6 h-6 text-workflow-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {isEditing ? 'Operational Parameters' : 'Initial Configuration'}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Required Data for Talent Indexing
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                      Professional Designation
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., QUANTUM SYSTEMS ARCHITECT"
                      className="w-full px-6 py-4 bg-bg-elevated border border-border dark:border-white/5 rounded-2xl text-text-primary dark:text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                      Resource Rate ($/HR)
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black">$</div>
                      <input
                        type="number"
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                        placeholder="120"
                        min="0"
                        step="0.01"
                        className="w-full px-12 py-4 bg-bg-elevated border border-border dark:border-white/5 rounded-2xl text-text-primary dark:text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-bold tracking-tight"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Biographic Data Stream
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Provide a comprehensive overview of your professional capabilities and historical impacts..."
                    rows={6}
                    className="w-full px-6 py-4 bg-bg-elevated border border-border dark:border-white/5 rounded-2xl text-text-primary dark:text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all font-medium leading-relaxed resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Expertise Classification
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['beginner', 'intermediate', 'expert'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, experience_level: level })}
                        className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] border transition-all ${formData.experience_level === level
                          ? 'bg-workflow-primary border-workflow-primary text-white shadow-lg shadow-workflow-primary/20'
                          : 'bg-bg-elevated border-border dark:border-white/5 text-text-muted hover:text-text-primary'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-5 bg-workflow-primary text-white rounded-2xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-workflow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Icon name="Save" size={18} />
                    )}
                    {isEditing ? 'Commit Profile Updates' : 'Initialize Profile'}
                  </button>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-10 py-5 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all font-black uppercase tracking-[0.2em] text-xs border border-white/10"
                    >
                      Abort
                    </button>
                  ) : (
                    <Link
                      to="/talent/dashboard"
                      className="px-10 py-5 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all font-black uppercase tracking-[0.2em] text-xs border border-white/10 flex items-center justify-center"
                    >
                      Exit
                    </Link>
                  )}
                </div>
              </form>
            </EliteCard>
          </div>
        </div>
      </div>
    );
  }

  if (!talent && id) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[280px]'} min-h-screen flex items-center justify-center p-4`}>
          <EliteCard className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
              <Icon name="UserX" className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">Talent Not Found</h2>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">
              The profile you are looking for has either been moved or doesn't exist in our systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/talent/discover" className="px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-workflow-primary/20">
                Browse Talents
              </Link>
              <Link to="/" className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs border border-white/10">
                Go Home
              </Link>
            </div>
          </EliteCard>
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
    <div className="min-h-screen bg-[#0A1628]">
      <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[280px]'} min-h-screen`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ElitePageHeader
            title={talent.user?.name || 'Talent Profile'}
            description={talent.title}
          />

          {/* Cover Image */}
          <div className="relative h-72 rounded-3xl overflow-hidden mb-8 group">
            {talent.cover_image_url ? (
              <img
                src={talent.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-80"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-60"></div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-10 -mt-20 relative z-10 px-6">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-bg shadow-2xl bg-bg-elevated">
                {talent.profile_picture_url ? (
                  <img
                    src={talent.profile_picture_url}
                    alt={talent.user?.name || 'Talent'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-workflow-primary/10 flex items-center justify-center">
                    <Icon name="User" className="w-20 h-20 text-workflow-primary/30" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 mt-6 md:mt-10">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                      {talent.user?.name || 'Talent'}
                    </h1>
                    {talent.is_verified && (
                      <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 shadow-sm" title="Verified Expert">
                        <Icon name="CheckCircle" size={16} />
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-slate-400 font-medium mb-4">{talent.title}</p>

                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1">
                        {renderStars(talent.rating || 0)}
                      </div>
                      <span className="text-sm font-black text-white ml-1">
                        {talent.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        ({talent.total_reviews || 0} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <Icon name="Clock" size={14} className="text-blue-500" />
                      <span>{talent.response_time || 24}H Response</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <Icon name="MapPin" size={14} className="text-rose-500" />
                      <span>{talent.availability || 'Available'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user?.id === talent.user_id ? (
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg shadow-workflow-primary/20 group"
                    >
                      <Icon name="Edit" size={18} className="transition-transform group-hover:scale-110" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/talent/messages?user=${talent.user_id}`}
                        className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 border border-white/10 group"
                      >
                        <Icon name="MessageSquare" size={18} className="transition-transform group-hover:scale-110 text-blue-500" />
                        Message
                      </Link>
                      <Link
                        to={`/talent/gigs?talent=${id || talent.id}`}
                        className="px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg shadow-workflow-primary/20 group"
                      >
                        <Icon name="Briefcase" size={18} className="transition-transform group-hover:scale-110" />
                        Explore Gigs
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <EliteCard className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-default bg-white/5 border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Hours</span>
              <div className="flex items-end gap-2 text-white">
                <span className="text-2xl font-black">{talent.total_hours_worked || 0}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Hrs</span>
              </div>
            </EliteCard>
            <EliteCard className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-default bg-white/5 border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Earnings</span>
              <div className="flex items-end gap-2 text-white">
                <span className="text-2xl font-black">${talent.total_earnings?.toLocaleString() || '0'}</span>
                {talent.total_earnings > 0 && <Icon name="TrendingUp" size={14} className="text-emerald-500 mb-1.5" />}
              </div>
            </EliteCard>
            <EliteCard className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-default bg-white/5 border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Hourly Rate</span>
              <div className="flex items-end gap-2 text-white">
                <span className="text-2xl font-black">${talent.hourly_rate || '0'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">/ hr</span>
              </div>
            </EliteCard>
            <EliteCard className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-default bg-white/5 border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Member Since</span>
              <div className="text-lg font-black text-white truncate">
                {talent.created_at ? formatDistanceToNow(new Date(talent.created_at), { addSuffix: true }) : 'N/A'}
              </div>
            </EliteCard>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Bio */}
                  <EliteCard className="p-8">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      About
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-lg">
                      {talent.bio || 'No bio available at this time.'}
                    </p>
                  </EliteCard>

                  {/* Skills */}
                  <EliteCard className="p-8">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Professional Skills
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {talent.skills && talent.skills.length > 0 ? (
                        talent.skills.map((skill, index) => (
                          <div key={index} className="group relative">
                            <div className="px-4 py-2 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:border-blue-500/30 hover:bg-blue-500/5 cursor-default">
                              {skill}
                              {user?.id === talent.user_id && (
                                <Link
                                  to={`/talent/verify-skill?skill=${encodeURIComponent(skill)}`}
                                  title="Verify this skill with AI"
                                  className="text-slate-600 hover:text-purple-500 transition-colors"
                                >
                                  <Icon name="Shield" size={12} />
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 italic text-sm">No specific skills highlighted yet.</p>
                      )}
                    </div>
                  </EliteCard>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Experience Level */}
                    <EliteCard className="p-8">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Expertise
                      </h2>
                      <span className="inline-block px-4 py-2 bg-workflow-primary/10 text-workflow-primary border border-workflow-primary/20 rounded-xl text-xs font-black uppercase tracking-widest">
                        {talent.experience_level || 'intermediate'}
                      </span>
                    </EliteCard>

                    {/* Languages */}
                    {talent.languages && talent.languages.length > 0 && (
                      <EliteCard className="p-8">
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Languages
                        </h2>
                        <div className="flex flex-wrap gap-2 text-white">
                          <span className="text-slate-300 font-bold">{talent.languages.join(', ')}</span>
                        </div>
                      </EliteCard>
                    )}
                  </div>

                  {/* Certifications */}
                  {talent.certifications && talent.certifications.length > 0 && (
                    <EliteCard className="p-8">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Certifications
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {talent.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border dark:border-white/5 flex items-center justify-center group-hover:bg-workflow-primary/10 transition-colors">
                              <Icon name="Award" className="w-6 h-6 text-workflow-primary" />
                            </div>
                            <div>
                              <p className="font-black text-sm text-white uppercase tracking-tight">{cert.name || cert}</p>
                              {cert.issuer && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cert.issuer}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </EliteCard>
                  )}
                </div>
              )}

              {activeTab === 'gigs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {talent.gigs && talent.gigs.length > 0 ? (
                    talent.gigs.map((gig) => (
                      <Link
                        key={gig.id}
                        to={`/talent/gigs/${gig.id}`}
                        className="group"
                      >
                        <EliteCard className="p-6 h-full border-border dark:border-white/5 hover:border-workflow-primary/30 transition-all duration-300">
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-black text-text-primary dark:text-white uppercase tracking-tight group-hover:text-workflow-primary transition-colors">
                                {gig.title}
                              </h3>
                              <div className="text-xl font-black text-text-primary dark:text-white bg-workflow-primary/10 px-3 py-1 rounded-xl border border-workflow-primary/20">
                                ${gig.price}
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                              {gig.description}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span className="flex items-center gap-1.5">
                                  <Icon name="Clock" size={14} className="text-workflow-primary" />
                                  {gig.delivery_time} Days
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                                  {gig.rating?.toFixed(1) || '0.0'} ({gig.total_orders || 0})
                                </span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center group-hover:bg-workflow-primary transition-all">
                                <Icon name="ArrowRight" size={14} className="text-text-primary dark:text-white" />
                              </div>
                            </div>
                          </div>
                        </EliteCard>
                      </Link>
                    ))
                  ) : (
                    <div className="md:col-span-2">
                      <EliteCard className="text-center py-20 border-white/5">
                        <Icon name="Briefcase" className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Active Gigs Found</p>
                      </EliteCard>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {talent.reviews && talent.reviews.length > 0 ? (
                    talent.reviews.map((review) => (
                      <EliteCard
                        key={review.id}
                        className="p-8 border-white/5"
                      >
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xl">
                            {review.reviewer?.avatar_url ? (
                              <img
                                src={review.reviewer.avatar_url}
                                alt={review.reviewer.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon name="User" className="w-8 h-8 text-slate-700" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-lg font-black text-white tracking-tight uppercase">
                                  {review.reviewer?.name || 'Anonymous User'}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            {review.review && (
                              <p className="text-slate-400 text-lg leading-relaxed">{review.review}</p>
                            )}
                          </div>
                        </div>
                      </EliteCard>
                    ))
                  ) : (
                    <EliteCard className="text-center py-20 border-white/5">
                      <Icon name="Star" className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                      <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Client Testimonials Yet</p>
                    </EliteCard>
                  )}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  {talent.portfolio_items && talent.portfolio_items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                      {talent.portfolio_items.map((item, index) => (
                        <EliteCard
                          key={index}
                          className="overflow-hidden border-border dark:border-white/5 hover:border-workflow-primary/30 transition-all duration-500 group"
                        >
                          {item.image && (
                            <div className="h-56 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title || 'Portfolio work'}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">
                              {item.title || 'Portfolio Masterpiece'}
                            </h3>
                            {item.description && (
                              <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                                {item.description}
                              </p>
                            )}
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-workflow-primary hover:text-workflow-primary/80 transition-colors"
                              >
                                Execute View Project
                                <Icon name="ExternalLink" size={12} />
                              </a>
                            )}
                          </div>
                        </EliteCard>
                      ))}
                    </div>
                  ) : (
                    <EliteCard className="text-center py-20 border-white/5">
                      <Icon name="Image" className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                      <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Portfolio Showcase Available</p>
                    </EliteCard>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <EliteCard className="p-8">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Expert Engagement</h3>
                <div className="space-y-3">
                  <Link
                    to={`/talent/gigs?talent=${id}`}
                    className="w-full py-4 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg shadow-workflow-primary/20"
                  >
                    <Icon name="Briefcase" size={16} />
                    View Service Gigs
                  </Link>
                  <Link
                    to={`/talent/messages?user=${talent.user_id}`}
                    className="w-full py-4 bg-bg-elevated text-text-primary dark:text-white rounded-xl hover:bg-workflow-primary/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-border dark:border-white/10"
                  >
                    <Icon name="MessageSquare" size={16} className="text-workflow-primary" />
                    Initiate Contact
                  </Link>
                </div>
              </EliteCard>

              {/* Rating Breakdown */}
              <EliteCard className="p-8">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Reputation Analytics</h3>
                <div className="space-y-5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = talent.reviews?.filter(r => Math.floor(r.rating) === star).length || 0;
                    const percentage = talent.reviews?.length > 0 ? (count / talent.reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-slate-400">{star}</span>
                            <Icon name="Star" size={10} className="text-yellow-500 fill-current" />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {count} Reviews
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${star === 5 ? 'bg-emerald-500' :
                              star === 4 ? 'bg-workflow-primary' :
                                star === 3 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted block mb-1">Total Impact Score</span>
                  <span className="text-3xl font-black text-text-primary dark:text-white">{talent.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </EliteCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
