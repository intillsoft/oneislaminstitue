import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { format } from 'date-fns';
import ProtectedRoute from '../../components/ProtectedRoute';
import AILoader from '../../components/ui/AILoader';

const Billing = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');

  const tiers = {
    free: { name: 'Free', price: 0 },
    basic: { name: 'Basic', price: 4.99 },
    premium: { name: 'Premium', price: 9.99 },
    pro: { name: 'Pro', price: 19.99 },
  };

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await apiService.subscriptions.getCurrent();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
      // If no subscription, set to free
      setSubscription({ tier: 'free', status: 'active' });
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setLoading(true);
      const response = await apiService.subscriptions.createPortal();
      if (response.url) {
        window.location.href = response.url;
      } else {
        showError('Failed to open billing portal');
      }
    } catch (error) {
      console.error('Portal error:', error);
      showError('Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const response = await apiService.subscriptions.createCheckout(selectedTier);
      if (response.url) {
        window.location.href = response.url;
      } else {
        showError('Failed to start checkout');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      showError('Failed to upgrade subscription');
    } finally {
      setLoading(false);
      setShowUpgradeModal(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await apiService.subscriptions.cancel();
      success('Subscription cancelled. You\'ll continue to have access until the end of your billing period.');
      setShowCancelModal(false);
      loadSubscription();
    } catch (error) {
      console.error('Cancel error:', error);
      showError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Billing', path: '/billing', isLast: true },
  ];

  if (loading && !subscription) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
        <AILoader variant="pulse" text="Fetching billing data..." />
      </div>
    );
  }

  const currentTier = subscription?.tier || 'free';
  const currentTierInfo = tiers[currentTier];

  return (
    <>
      <Helmet>
        <title>Billing & Subscription - One Islam Institute</title>
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb customItems={breadcrumbItems} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Current Plan</h2>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mt-1">
                      {subscription?.status === 'active' ? 'Active subscription' : 'No active subscription'}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${
                    subscription?.status === 'active' 
                      ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                      : 'bg-[#F8FAFC] dark:bg-[#1A2139] text-[#64748B] dark:text-[#8B92A3]'
                  }`}>
                    <span className="text-sm font-medium capitalize">{subscription?.status || 'inactive'}</span>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] dark:border-[#1E2640] pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                        {currentTierInfo.name} Plan
                      </h3>
                      <p className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED] mt-2">
                        ${currentTierInfo.price}
                        {currentTierInfo.price > 0 && <span className="text-lg text-[#64748B] dark:text-[#8B92A3]">/month</span>}
                      </p>
                    </div>
                    {currentTier === 'free' ? (
                      <Link to="/pricing">
                        <Button variant="primary">Upgrade Plan</Button>
                      </Link>
                    ) : (
                      <div className="flex gap-3">
                        <Button onClick={() => setShowUpgradeModal(true)} variant="outline">
                          Change Plan
                        </Button>
                        <Button onClick={handleManageBilling} variant="outline">
                          Manage Billing
                        </Button>
                      </div>
                    )}
                  </div>

                  {subscription?.current_period_end && (
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                      <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                        {subscription?.cancel_at_period_end 
                          ? `Subscription will cancel on ${format(new Date(subscription.current_period_end * 1000), 'MMM d, yyyy')}`
                          : `Next billing date: ${format(new Date(subscription.current_period_end * 1000), 'MMM d, yyyy')}`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              {currentTier !== 'free' && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Payment Methods</h2>
                    <Button onClick={handleManageBilling} variant="outline" size="sm">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                    Manage your payment methods in the billing portal
                  </p>
                </div>
              )}

              {/* Invoice History */}
              {currentTier !== 'free' && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                  <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-4">Invoice History</h2>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-4">
                    View and download your past invoices in the billing portal
                  </p>
                  <Button onClick={handleManageBilling} variant="outline">
                    View Invoices
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/pricing" className="block">
                    <Button variant="primary" className="w-full">
                      <Icon name="ArrowUp" size={16} className="mr-2" />
                      Upgrade Plan
                    </Button>
                  </Link>
                  {currentTier !== 'free' && (
                    <>
                      <Button onClick={handleManageBilling} variant="outline" className="w-full">
                        <Icon name="CreditCard" size={16} className="mr-2" />
                        Manage Billing
                      </Button>
                      <Button onClick={() => setShowCancelModal(true)} variant="danger" className="w-full">
                        <Icon name="X" size={16} className="mr-2" />
                        Cancel Subscription
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Plan Features */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Your Plan Includes</h3>
                <ul className="space-y-2 text-sm">
                  {currentTier === 'free' && (
                    <>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        1 Academic Profile
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        10 Enrollments/month
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        Basic Progress Tracking
                      </li>
                    </>
                  )}
                  {currentTier === 'basic' && (
                    <>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        3 Academic Profiles
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        50 Enrollments/month
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        AI Course Matching
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        Academic Alerts
                      </li>
                    </>
                  )}
                  {currentTier === 'premium' && (
                    <>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        Unlimited Academic Profiles
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        Unlimited Enrollments/month
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        Advanced Academic Research
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-emerald-600" />
                        Priority Scholar Support
                      </li>
                    </>
                  )}
                  {currentTier === 'pro' && (
                    <>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-workflow-primary" />
                        Unlimited Everything
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-workflow-primary" />
                        API Access
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-workflow-primary" />
                        Priority Support
                      </li>
                      <li className="flex items-center text-[#0F172A] dark:text-[#E8EAED]">
                        <Icon name="Check" size={16} className="mr-2 text-workflow-primary" />
                        All Features
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
            Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.
          </p>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowCancelModal(false)} variant="outline">
              Keep Subscription
            </Button>
            <Button onClick={handleCancel} disabled={loading} variant="danger">
              {loading ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Change Plan"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-4">
            Select a new plan:
          </p>
          <div className="space-y-2">
            {Object.entries(tiers).filter(([key]) => key !== currentTier && key !== 'free').map(([key, tier]) => (
              <button
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedTier === key
                    ? 'border-workflow-primary bg-workflow-primary-50 dark:bg-workflow-primary-900/20'
                    : 'border-[#E2E8F0] dark:border-[#1E2640] hover:border-workflow-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">{tier.name}</p>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">${tier.price}/month</p>
                  </div>
                  {selectedTier === key && (
                    <Icon name="Check" size={20} className="text-workflow-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button onClick={() => setShowUpgradeModal(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpgrade} disabled={!selectedTier || loading} variant="primary">
              {loading ? 'Processing...' : 'Change Plan'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Billing;

