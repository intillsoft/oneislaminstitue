import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import { apiService } from '../../lib/api';

const TalentDiscover = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [talents, setTalents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    hourlyRateMin: '',
    hourlyRateMax: '',
    rating: '',
    availability: '',
    experienceLevel: '',
    language: '',
    skills: '',
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    loadTalents();
  }, [filters, sortBy, searchQuery]);

  const loadTalents = async () => {
    try {
      setLoading(true);
      const data = await talentService.discoverTalents({
        search: searchQuery,
        ...filters,
        sort: sortBy,
      });
      setTalents(data?.data || data || []);
    } catch (error) {
      console.error('Error loading talents:', error);
      showError('Failed to load talents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTalents();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
      />
    ));
  };

  const handleMessageTalent = async (talentUserId) => {
    try {
      const response = await apiService.messages.getConversation(talentUserId);
      if (response.data?.code === 'TABLE_NOT_FOUND') {
        showError('Messaging system is not initialized. Please contact support.');
        return;
      }
      if (response.data?.success) {
        window.location.href = `/messages?conversation=${response.data.data.id}`;
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      showError('Failed to start conversation');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-bg font-sans text-text-primary dark:text-dark-text transition-colors duration-300">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden bg-workflow-primary-600 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-workflow-primary-500 to-workflow-primary-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb className="text-white/80 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in tracking-tight">
            Discover Top Talent
          </h1>
          <p className="text-xl text-workflow-primary-100 max-w-2xl animate-slide-up animation-delay-100">
            Connect with world-class freelancers and experts ready to bring your vision to life.
          </p>

          {/* Search Bar - Floating Glass Card */}
          <div className="mt-8 max-w-3xl animate-slide-up animation-delay-200">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white dark:bg-surface-800 rounded-xl p-2 shadow-xl">
                <Icon name="Search" className="ml-4 w-6 h-6 text-workflow-primary-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skills, or category..."
                  className="w-full px-4 py-3 bg-transparent border-none text-text-primary dark:text-dark-text focus:ring-0 placeholder-gray-400 text-lg"
                />
                <button type="submit" className="bg-workflow-primary-600 hover:bg-workflow-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-workflow-primary/30">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Filters Sidebar - Modern Card */}
          <div className="lg:col-span-1 space-y-6 animate-slide-right delay-200">
            <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-glass sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="Filter" className="w-5 h-5 text-workflow-primary-500" />
                  Filters
                </h2>
                <button
                  onClick={() => {
                    setFilters({ hourlyRateMin: '', hourlyRateMax: '', rating: '', availability: '', experienceLevel: '', language: '', skills: '' });
                    setSearchQuery('');
                  }}
                  className="text-xs font-medium text-workflow-primary-500 hover:text-workflow-primary-600 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Minimalist Filter Groups */}
              <div className="space-y-6">
                {/* Hourly Rate */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 block">Hourly Rate</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.hourlyRateMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMin: e.target.value }))}
                      className="w-1/2 px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-border dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-workflow-primary-500/20 outline-none transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.hourlyRateMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMax: e.target.value }))}
                      className="w-1/2 px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-border dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-workflow-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 block">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-border dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-workflow-primary-500/20 outline-none transition-all"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 block">Skills</label>
                  <div className="relative">
                    <Icon name="Codesandbox" className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. React"
                      value={filters.skills}
                      onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 bg-surface-50 dark:bg-surface-900 border border-border dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-workflow-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Talents Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 animate-fade-in delay-300">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing <span className="text-text-primary dark:text-dark-text font-bold">{talents.length}</span> professionals
              </p>
              <div className="flex items-center gap-2">
                <Icon name="ListFilter" className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium focus:ring-0 text-text-primary dark:text-dark-text cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_low">Price: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white dark:bg-surface-800 rounded-2xl h-80 animate-pulse"></div>
                ))}
              </div>
            ) : talents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talents.map((talent, index) => (
                  <div
                    key={talent.id}
                    className="bg-white dark:bg-surface-800 rounded-2xl border border-border dark:border-dark-border overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group flex flex-col animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-2 flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <Link to={`/talent/profile/${talent.user_id || talent.id}`} className="relative">
                          {talent.profile_picture_url ? (
                            <img
                              src={talent.profile_picture_url}
                              alt={talent.user?.name}
                              className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-workflow-primary-600 dark:text-workflow-primary-400 font-bold text-xl shadow-inner">
                              {talent.user?.name?.charAt(0) || 'T'}
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-surface-800 rounded-full ${talent.availability === 'available' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </Link>
                        <div className="bg-workflow-primary-50 dark:bg-workflow-primary-900/20 px-3 py-1 rounded-full">
                          <p className="text-workflow-primary-700 dark:text-workflow-primary-300 font-bold text-sm">
                            ${talent.hourly_rate}<span className="text-xs font-normal opacity-70">/hr</span>
                          </p>
                        </div>
                      </div>

                      <Link to={`/talent/profile/${talent.user_id || talent.id}`} className="block mb-1">
                        <h3 className="text-lg font-bold text-text-primary dark:text-dark-text group-hover:text-workflow-primary-600 transition-colors">
                          {talent.user?.name || 'Talent'}
                        </h3>
                      </Link>
                      <p className="text-sm font-medium text-workflow-primary-500 dark:text-workflow-primary-400 mb-3 truncate">
                        {talent.title || 'Freelancer'}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400 text-xs">
                          {renderStars(talent.rating || 0)}
                        </div>
                        <span className="text-xs font-medium text-gray-500">({talent.total_reviews || 0} reviews)</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {talent.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-surface-100 dark:bg-surface-700 text-text-secondary dark:text-gray-300 text-xs rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                        {talent.skills?.length > 3 && (
                          <span className="px-2.5 py-1 bg-surface-50 dark:bg-surface-900 text-text-muted text-xs rounded-md font-medium">
                            +{talent.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-surface-50 dark:bg-surface-900/50 border-t border-border dark:border-dark-border grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleMessageTalent(talent.user_id || talent.id)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-surface-800 hover:bg-gray-50 dark:hover:bg-surface-700 text-sm font-medium transition-colors"
                      >
                        <Icon name="MessageSquare" size={16} />
                        Chat
                      </button>
                      <Link
                        to={`/talent/profile/${talent.user_id || talent.id}`}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-workflow-primary-600 hover:bg-workflow-primary-700 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg hover:shadow-workflow-primary/20"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-surface-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Search" className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No talents found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDiscover;