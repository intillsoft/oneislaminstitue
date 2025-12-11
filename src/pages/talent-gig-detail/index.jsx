import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [gig, setGig] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    title: '',
    description: '',
  });
  
  // Initialize orderData when gig loads
  useEffect(() => {
    if (gig) {
      setOrderData(prev => ({
        title: gig.title || prev.title,
        description: prev.description,
      }));
    }
  }, [gig]);

  useEffect(() => {
    if (id) {
      loadGig();
    }
  }, [id]);

  const loadGig = async () => {
    try {
      setLoading(true);
      const data = await talentService.getGig(id);
      setGig(data);
      setOrderData({
        title: data.title,
        description: '',
      });
    } catch (error) {
      console.error('Error loading gig:', error);
      showError('Failed to load gig details');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!user) {
      showError('Please sign in to place an order');
      navigate('/job-seeker-registration-login');
      return;
    }

    try {
      await talentService.createOrder({
        gig_id: id,
        title: orderData.title,
        description: orderData.description,
        price: gig.price,
      });
      success('Order placed successfully!');
      setOrderModalOpen(false);
      navigate('/talent/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading gig details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Icon name="FileX" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Gig not found</h2>
            <Link to="/talent/marketplace" className="btn-primary inline-flex items-center">
              Browse Gigs
            </Link>
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
        size={14}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gig Images */}
              {gig.images && gig.images.length > 0 && (
                <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 gap-2">
                    {gig.images.slice(0, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${gig.title} ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Gig Title */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-4">
                  {gig.title}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="px-3 py-1 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary rounded-full text-sm font-medium">
                    {gig.category}
                  </span>
                  {gig.rating > 0 && (
                    <div className="flex items-center gap-2">
                      {renderStars(gig.rating)}
                      <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                        {gig.rating.toFixed(1)} ({gig.total_orders} orders)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Description</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-[#64748B] dark:text-[#8B92A3] whitespace-pre-line">
                    {gig.description}
                  </p>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">What's Included</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[#64748B] dark:text-[#8B92A3]">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    Delivery in {gig.delivery_time} days
                  </li>
                  <li className="flex items-center gap-2 text-[#64748B] dark:text-[#8B92A3]">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    {gig.revisions} revision{gig.revisions !== 1 ? 's' : ''} included
                  </li>
                  <li className="flex items-center gap-2 text-[#64748B] dark:text-[#8B92A3]">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    Source files included
                  </li>
                </ul>
              </div>

              {/* Tags */}
              {gig.tags && gig.tags.length > 0 && (
                <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {gig.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {gig.reviews && gig.reviews.length > 0 && (
                <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {gig.reviews.map((review, index) => (
                      <div key={index} className="border-b border-[#E2E8F0] dark:border-[#1E2640] pb-4 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-workflow-primary/10 flex items-center justify-center flex-shrink-0">
                            {review.buyer?.avatar_url ? (
                              <img
                                src={review.buyer.avatar_url}
                                alt={review.buyer.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Icon name="User" className="w-5 h-5 text-workflow-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                                {review.buyer?.name || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-1">
                                {renderStars(review.buyer_rating)}
                              </div>
                            </div>
                            {review.buyer_review && (
                              <p className="text-[#64748B] dark:text-[#8B92A3] mb-2">
                                {review.buyer_review}
                              </p>
                            )}
                            <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">
                              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Card */}
              <div className="bg-white dark:bg-[#13182E] border-2 border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6 sticky top-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-2">Starting at</p>
                  <p className="text-4xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                    ${gig.price}
                  </p>
                </div>

                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="w-full btn-primary mb-4"
                >
                  Order Now
                </button>

                <div className="space-y-3 text-sm text-[#64748B] dark:text-[#8B92A3]">
                  <div className="flex items-center justify-between">
                    <span>Delivery Time</span>
                    <span className="font-medium text-[#0F172A] dark:text-[#E8EAED]">
                      {gig.delivery_time} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Revisions</span>
                    <span className="font-medium text-[#0F172A] dark:text-[#E8EAED]">
                      {gig.revisions}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                  <button className="w-full btn-secondary mb-3">
                    <Icon name="MessageSquare" size={18} className="mr-2" />
                    Contact Talent
                  </button>
                  <button className="w-full btn-secondary">
                    <Icon name="Bookmark" size={18} className="mr-2" />
                    Save Gig
                  </button>
                </div>
              </div>

              {/* Talent Info */}
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <Link
                  to={`/talent/profile/${gig.talent?.id}`}
                  className="flex items-center gap-4 mb-4"
                >
                  {gig.talent?.user?.avatar_url ? (
                    <img
                      src={gig.talent.user.avatar_url}
                      alt={gig.talent.user.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                      <Icon name="User" className="w-8 h-8 text-workflow-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                      {gig.talent?.user?.name || gig.talent?.title || 'Talent'}
                    </p>
                    {gig.talent?.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(gig.talent.rating)}
                        <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                          {gig.talent.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={14} />
                    Responds in {gig.talent?.response_time || 24} hours
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} />
                    {gig.talent?.total_reviews || 0} completed orders
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#13182E] rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED]">Place Order</h2>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED]"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                  Order Title
                </label>
                <input
                  type="text"
                  value={orderData.title}
                  onChange={(e) => setOrderData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                  Requirements (Optional)
                </label>
                <textarea
                  value={orderData.description}
                  onChange={(e) => setOrderData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe what you need..."
                  className="w-full px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                />
              </div>

              <div className="bg-gray-50 dark:bg-[#1A2139] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">Total</span>
                  <span className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                    ${gig.price}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrder}
                  className="flex-1 btn-primary"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetail;
