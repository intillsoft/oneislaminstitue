import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';

const GigEdit = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingGig, setLoadingGig] = useState(true);
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

  useEffect(() => {
    if (id) {
      loadGig();
    }
  }, [id]);

  const loadGig = async () => {
    try {
      setLoadingGig(true);
      const gig = await talentService.getGig(id);
      
      // Handle different response structures
      const gigData = gig?.data || gig;
      
      if (!gigData || !gigData.id) {
        showError('Gig not found');
        navigate('/talent/dashboard');
        return;
      }
      
      // Verify ownership - check if user owns this gig
      if (user) {
        // Get user's talent profile
        const userTalent = await talentService.getProfile(user.id);
        const talentData = userTalent?.data || userTalent;
        
        if (!talentData || talentData.id !== gigData.talent_id) {
          showError('You can only edit your own gigs');
          navigate('/talent/dashboard');
          return;
        }
      }
      
      setFormData({
        title: gigData.title || '',
        description: gigData.description || '',
        category: gigData.category || '',
        subcategory: gigData.subcategory || '',
        price: gigData.price?.toString() || '',
        delivery_time: gigData.delivery_time?.toString() || '7',
        revisions: gigData.revisions?.toString() || '1',
        images: gigData.images || [],
        tags: gigData.tags || [],
      });
    } catch (error) {
      console.error('Error loading gig:', error);
      showError(`Failed to load gig: ${error.message || 'Unknown error'}`);
      navigate('/talent/dashboard');
    } finally {
      setLoadingGig(false);
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
      await talentService.updateGig(id, {
        ...formData,
        price: parseFloat(formData.price),
        delivery_time: parseInt(formData.delivery_time),
        revisions: parseInt(formData.revisions),
      });
      success('Gig updated successfully!');
      navigate('/talent/dashboard');
    } catch (error) {
      console.error('Error updating gig:', error);
      showError('Failed to update gig');
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

  if (loadingGig) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading gig...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
        <div className="text-center">
          <Icon name="Lock" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Sign in required</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Edit Gig
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Update your service offering
            </p>
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
                <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="5"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
                  required
                />
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
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
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
                {loading ? 'Updating...' : 'Update Gig'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigEdit;
