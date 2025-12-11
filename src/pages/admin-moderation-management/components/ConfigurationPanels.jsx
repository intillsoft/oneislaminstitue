// src/pages/admin-moderation-management/components/ConfigurationPanels.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { adminService } from '../../../services/adminService';
import { jobService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const ConfigurationPanels = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [activePanel, setActivePanel] = useState('coupons');
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    expiryDate: '',
    usageLimit: '',
    description: ''
  });
  const [existingCoupons, setExistingCoupons] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadConfigurations();
    } else {
      setLoading(false);
    }
  }, [user, profile, activePanel]);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const configs = await adminService.getConfigurations();
      setExistingCoupons(configs.coupons || []);
      
      // Load featured jobs (jobs with featured flag or high views)
      const jobsResult = await jobService.getAll({ pageSize: 100 });
      const allJobs = jobsResult.data || [];
      const featured = allJobs
        .filter(job => job.featured || job.status === 'active')
        .slice(0, 10)
        .map(job => ({
          id: job.id,
          title: job.title,
          company: job.company || 'Unknown',
          featuredUntil: job.expires_at || job.created_at,
          views: 0, // Would need view tracking
          applications: 0, // Would need to fetch
          status: job.status || 'active'
        }));
      setFeaturedJobs(featured);
    } catch (error) {
      console.error('Error loading configurations:', error);
      showError('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  const configPanels = [
    { id: 'coupons', label: 'Coupon Codes', icon: 'Tag' },
    { id: 'featured', label: 'Featured Jobs', icon: 'Star' },
    { id: 'payments', label: 'Payment Settings', icon: 'CreditCard' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'general', label: 'General Settings', icon: 'Settings' }
  ];

  const handleCouponSubmit = async (e) => {
    e?.preventDefault();
    try {
      await adminService.createCoupon(newCoupon);
      success('Coupon created successfully');
      setNewCoupon({
        code: '',
        discount: '',
        type: 'percentage',
        expiryDate: '',
        usageLimit: '',
        description: ''
      });
      loadConfigurations();
    } catch (error) {
      console.error('Error creating coupon:', error);
      showError('Failed to create coupon');
    }
  };

  const renderCouponsPanel = () => (
    <div className="space-y-6">
      {/* Create New Coupon */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Create New Coupon Code</h3>
          <form onSubmit={handleCouponSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Coupon Code</label>
                <input
                  type="text"
                  value={newCoupon?.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e?.target?.value?.toUpperCase()})}
                  placeholder="e.g., SAVE20"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Discount Value</label>
                <div className="flex">
                  <select
                    value={newCoupon?.type}
                    onChange={(e) => setNewCoupon({...newCoupon, type: e?.target?.value})}
                    className="input-field rounded-r-none w-24"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <input
                    type="number"
                    value={newCoupon?.discount}
                    onChange={(e) => setNewCoupon({...newCoupon, discount: e?.target?.value})}
                    placeholder={newCoupon?.type === 'percentage' ? '20' : '25'}
                    className="input-field rounded-l-none flex-1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={newCoupon?.expiryDate}
                  onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e?.target?.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Usage Limit</label>
                <input
                  type="number"
                  value={newCoupon?.usageLimit}
                  onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e?.target?.value})}
                  placeholder="100"
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
              <textarea
                value={newCoupon?.description}
                onChange={(e) => setNewCoupon({...newCoupon, description: e?.target?.value})}
                placeholder="Brief description of the coupon..."
                className="input-field"
                rows={3}
              />
            </div>
            <button type="submit" className="btn-primary">
              Create Coupon
            </button>
          </form>
        </div>
      </div>

      {/* Existing Coupons */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Existing Coupons</h3>
          {existingCoupons.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-gray-400">
              <Icon name="Tag" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No coupons created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Code</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Discount</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Usage</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Expires</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {existingCoupons?.map((coupon) => (
                    <tr key={coupon?.id} className="border-b border-border dark:border-gray-700 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="py-4">
                        <span className="font-mono bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded text-sm text-text-primary dark:text-white">{coupon?.code}</span>
                      </td>
                      <td className="py-4 text-sm text-text-primary dark:text-white">{coupon?.discount}</td>
                      <td className="py-4 text-sm text-text-primary dark:text-white">{coupon?.used}/{coupon?.limit}</td>
                      <td className="py-4 text-sm text-text-primary dark:text-white">{coupon?.expires}</td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          coupon?.status === 'active' 
                            ? 'text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400' 
                            : 'text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {coupon?.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFeaturedJobsPanel = () => (
    <div className="space-y-6">
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Featured Job Management</h3>
          {featuredJobs.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-gray-400">
              <Icon name="Star" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No featured jobs</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Job</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Featured Until</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Performance</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-text-secondary dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredJobs?.map((job) => (
                    <tr key={job?.id} className="border-b border-border dark:border-gray-700 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="py-4">
                        <div>
                          <div className="text-sm font-medium text-text-primary dark:text-white">{job?.title}</div>
                          <div className="text-sm text-text-secondary dark:text-gray-400">{job?.company}</div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-text-primary dark:text-white">{job?.featuredUntil ? new Date(job.featuredUntil).toLocaleDateString() : 'N/A'}</td>
                      <td className="py-4">
                        <div className="text-sm">
                          <div className="text-text-primary dark:text-white">{job?.views} views</div>
                          <div className="text-text-secondary dark:text-gray-400">{job?.applications} applications</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                          {job?.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">Extend</button>
                          <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPaymentSettingsPanel = () => (
    <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Payment Processing Settings</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Stripe Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Publishable Key</label>
                <input type="text" className="input-field" placeholder="pk_live_..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Secret Key</label>
                <input type="password" className="input-field" placeholder="sk_live_..." />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Pricing Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Basic Job Posting</label>
                <input type="number" className="input-field" placeholder="29.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Featured Job</label>
                <input type="number" className="input-field" placeholder="99.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Premium Listing</label>
                <input type="number" className="input-field" placeholder="199.99" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsPanel = () => (
    <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">Notification Template Customization</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Templates</label>
            <select className="input-field mb-4">
              <option>Welcome Email</option>
              <option>Job Application Confirmation</option>
              <option>Password Reset</option>
              <option>Payment Confirmation</option>
            </select>
            <textarea 
              className="input-field" 
              rows={8}
              placeholder="Email template content..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">SMS Settings</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Enable SMS notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Send application confirmations</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Send payment receipts</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettingsPanel = () => (
    <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-text-primary dark:text-white mb-4">General Platform Settings</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Site Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Site Name</label>
                <input type="text" className="input-field" defaultValue="JobBoard Pro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Support Email</label>
                <input type="email" className="input-field" defaultValue="support@jobboard.com" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Content Moderation</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Auto-moderate job postings</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Require company verification</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Manual approval for new users</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePanel) {
      case 'coupons': return renderCouponsPanel();
      case 'featured': return renderFeaturedJobsPanel();
      case 'payments': return renderPaymentSettingsPanel();
      case 'notifications': return renderNotificationsPanel();
      case 'general': return renderGeneralSettingsPanel();
      default: return renderCouponsPanel();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">Configuration Panels</h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Manage coupon codes, featured jobs, payment settings, and notification templates
        </p>
      </div>
      {/* Panel Navigation */}
      <div className="card bg-background dark:bg-[#13182E] border border-border dark:border-gray-700 overflow-hidden">
        <div className="border-b border-border dark:border-gray-700">
          <nav className="flex flex-wrap space-x-8 px-6 overflow-x-auto">
            {configPanels?.map((panel) => (
              <button
                key={panel?.id}
                onClick={() => setActivePanel(panel?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-smooth whitespace-nowrap ${
                  activePanel === panel?.id
                    ? 'border-primary text-primary dark:text-primary-400' 
                    : 'border-transparent text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white'
                }`}
              >
                <Icon name={panel?.icon} size={16} />
                <span className="text-sm font-medium">{panel?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Panel Content */}
      {renderContent()}
    </div>
  );
};

export default ConfigurationPanels;