import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';

const TalentReviews = () => {
  const { user } = useAuthContext();
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadReviews();
  }, [filter, sortBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const profile = await talentService.getProfile(user?.id);
      if (profile && profile.reviews) {
        let filtered = [...profile.reviews];

        if (filter !== 'all') {
          const rating = parseInt(filter);
          filtered = filtered.filter(r => Math.floor(r.rating) === rating);
        }

        if (sortBy === 'recent') {
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'oldest') {
          filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortBy === 'highest') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'lowest') {
          filtered.sort((a, b) => a.rating - b.rating);
        }

        setReviews(filtered);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      showError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Reviews
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Manage and respond to reviews from buyers
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">Filter by Rating</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
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
        </div>
      </div>
    </div>
  );
};

export default TalentReviews;









