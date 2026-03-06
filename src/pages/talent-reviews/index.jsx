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
        className={i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-bg dark:text-gray-600'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Loading reviews...</p>
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
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-white mb-2 uppercase tracking-tight">
              Reviews
            </h1>
            <p className="text-text-muted dark:text-slate-400 font-medium">
              Manage and respond to feedback from buyer entities
            </p>
          </div>

          {/* Filters */}
          <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Filter by Rating</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2.5 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 appearance-none font-bold"
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
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Protocol Order</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 appearance-none font-bold"
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
                  className="bg-bg-elevated border border-border dark:border-white/5 rounded-3xl p-8 shadow-xl hover:border-workflow-primary/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-workflow-primary/10 flex items-center justify-center flex-shrink-0 border border-workflow-primary/20">
                      {review.reviewer?.avatar_url ? (
                        <img
                          src={review.reviewer.avatar_url}
                          alt={review.reviewer.name}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <Icon name="User" className="w-8 h-8 text-workflow-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-black text-text-primary dark:text-white uppercase tracking-tight">
                            {review.reviewer?.name || 'Anonymous Entity'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {review.review && (
                        <p className="text-text-muted dark:text-slate-400 mt-4 leading-relaxed font-medium">{review.review}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-bg-elevated border border-border dark:border-white/5 rounded-[3rem] shadow-xl">
                <Icon name="Star" className="w-16 h-16 text-bg mx-auto mb-6" />
                <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">No Feedback Sequences Detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentReviews;










