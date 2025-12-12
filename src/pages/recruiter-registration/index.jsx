import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { apiService } from '../../lib/api';
import { companyService } from '../../services/companyService';

const RecruiterRegistration = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    company_size: '',
    industry: '',
    location: '',
    linkedin_url: '',
    reason: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company_name || !formData.reason) {
      showError('Please fill in all required fields');
      return;
    }

    if (!user) {
      showError('Please sign in first');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // First, create the company
      const companyData = {
        name: formData.company_name,
        website: formData.company_website,
        size: formData.company_size,
        industry: formData.industry,
        location: formData.location,
        linkedin_url: formData.linkedin_url,
      };

      const company = await companyService.create(companyData);

      // Then request role change with company reference
      await apiService.profile.requestRoleChange({
        requested_role: 'recruiter',
        reason: formData.reason,
        company_id: company.id || company.data?.id,
        recruiter_data: {
          company_name: formData.company_name,
          company_website: formData.company_website,
          company_size: formData.company_size,
          industry: formData.industry,
          location: formData.location,
          linkedin_url: formData.linkedin_url,
        },
      });

      success('Company created and registration request submitted! An admin will review your request soon.');
      navigate('/recruiter-dashboard-analytics');
    } catch (error) {
      console.error('Error submitting registration:', error);
      showError(`Failed to submit registration: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0046FF] via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-[#13182E] rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0046FF] to-purple-600 mb-4">
            <Icon name="Building2" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Become a Recruiter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Post jobs and find the best talent for your company
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              placeholder="e.g., TechCorp Inc."
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.company_website}
                onChange={(e) => setFormData(prev => ({ ...prev, company_website: e.target.value }))}
                placeholder="https://company.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Company Size
              </label>
              <select
                value={formData.company_size}
                onChange={(e) => setFormData(prev => ({ ...prev, company_size: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., Technology, Finance"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Why do you want to become a Recruiter? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              placeholder="Tell us why you want to join as a recruiter..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This will be reviewed by our admin team
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-[#1E2640] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A2139]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0046FF] to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RecruiterRegistration;