import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { useTalentAI } from '../../hooks/useTalentAI';

const GigCreate = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    optimizeGig,
    analyzeRates,
    loading: aiLoading
  } = useTalentAI();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    delivery_time: '7',
    revisions: '1',
    images: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [rateAnalysis, setRateAnalysis] = useState(null);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Business',
    'Data Science',
    'Other',
  ];

  const handleOptimize = async () => {
    if (!formData.title && !formData.description) {
      showError('Please enter a title or description to optimize');
      return;
    }

    const result = await optimizeGig(
      formData.title,
      formData.description,
      formData.category || 'General',
      formData.tags
    );

    if (result) {
      setFormData(prev => ({
        ...prev,
        title: result.optimizedTitle || prev.title,
        description: result.optimizedDescription || prev.description,
        tags: result.suggestedTags || prev.tags
      }));
    }
  };

  const handleAnalyzeRate = async () => {
    if (!formData.price || !formData.category) {
      showError('Please enter a price and category first');
      return;
    }

    const result = await analyzeRates(
      formData.title,
      formData.tags,
      'Intermediate', // Default for now, could add field
      formData.price,
      formData.category
    );

    if (result) {
      setRateAnalysis(result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await talentService.createGig({
        ...formData,
        price: parseFloat(formData.price),
        delivery_time: parseInt(formData.delivery_time),
        revisions: parseInt(formData.revisions),
      });
      success('Gig created successfully!');
      navigate('/talent/dashboard');
    } catch (error) {
      console.error('Error creating gig:', error);
      showError('Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
        <div className="text-center">
          <Icon name="Lock" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Sign in required</h2>
          <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Please sign in to create a gig</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Create New Gig
              </h1>
              <p className="text-[#64748B] dark:text-[#8B92A3]">
                Create a service offering to start earning as a freelancer
              </p>
            </div>
            <button
              onClick={handleOptimize}
              disabled={aiLoading}
              className="btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none shadow-lg shadow-purple-500/30 flex items-center gap-2"
            >
              {aiLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon name="Sparkles" size={18} />
              )}
              AI Gig Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Gig Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., I will design a modern website for your business"
                className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                required
              />
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={8}
                placeholder="Describe your service in detail..."
                className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                required
              />
              <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-2">
                {formData.description.length} characters
              </p>
            </div>

            {/* Price & Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAnalyzeRate}
                    className="text-xs text-workflow-primary hover:underline flex items-center gap-1"
                  >
                    <Icon name="BarChart2" size={12} />
                    Check Market Rate
                  </button>
                </div>
                <input
                  type="number"
                  min="5"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                  required
                />
                {rateAnalysis && (
                  <div className={`mt-2 text-xs p-2 rounded ${rateAnalysis.status === 'underpriced' ? 'bg-yellow-50 text-yellow-700' :
                      rateAnalysis.status === 'overpriced' ? 'bg-red-50 text-red-700' :
                        'bg-green-50 text-green-700'
                    }`}>
                    <strong>Verdict: {rateAnalysis.status}</strong>. {rateAnalysis.reasoning}
                    <br />
                    Suggested: ${rateAnalysis.suggestedRate}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                  Delivery Time (days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.delivery_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                  required
                />
              </div>

              <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                  Revisions
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.revisions}
                  onChange={(e) => setFormData(prev => ({ ...prev, revisions: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Gig Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
              />
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-workflow-primary/10 dark:bg-workflow-primary/20 text-workflow-primary rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/talent/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Create Gig'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigCreate;










