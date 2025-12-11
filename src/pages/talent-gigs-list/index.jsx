import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';

const TalentGigsList = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [gigs, setGigs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadGigs();
  }, [filter]);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const data = await talentService.getGigs({ is_active: filter === 'all' ? null : filter === 'active' });
      setGigs(data || []);
    } catch (error) {
      console.error('Error loading gigs:', error);
      showError('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;

    try {
      await talentService.deleteGig(gigId);
      success('Gig deleted successfully!');
      loadGigs();
    } catch (error) {
      console.error('Error deleting gig:', error);
      showError('Failed to delete gig');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading gigs...</p>
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

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                My Gigs
              </h1>
              <p className="text-[#64748B] dark:text-[#8B92A3]">
                Manage your service offerings
              </p>
            </div>
            <Link
              to="/talent/gigs/create"
              className="btn-primary flex items-center gap-2"
            >
              <Icon name="Plus" size={18} />
              Create New Gig
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              {['all', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-workflow-primary text-white'
                      : 'bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED] hover:bg-gray-200 dark:hover:bg-[#1E2640]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Gigs Grid */}
          {gigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <div
                  key={gig.id}
                  className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {gig.images && gig.images.length > 0 && (
                    <img
                      src={gig.images[0]}
                      alt={gig.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] line-clamp-2">
                        {gig.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        gig.is_active
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-[#1A2139] text-gray-700 dark:text-gray-300'
                      }`}>
                        {gig.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] line-clamp-2 mb-4">
                      {gig.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[#64748B] dark:text-[#8B92A3]">
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {gig.delivery_time} days
                        </span>
                        {gig.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                            {gig.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <span className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED]">
                        ${gig.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/talent/gigs/${gig.id}/edit`}
                        className="flex-1 btn-secondary text-center text-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/talent/gigs/${gig.id}`}
                        className="flex-1 btn-primary text-center text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteGig(gig.id)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 text-sm"
                      >
                        <Icon name="Trash" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg">
              <Icon name="Briefcase" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">No gigs yet</h3>
              <p className="text-[#64748B] dark:text-[#8B92A3] mb-4">Create your first gig to start earning</p>
              <Link to="/talent/gigs/create" className="btn-primary inline-flex items-center gap-2">
                <Icon name="Plus" size={18} />
                Create Your First Gig
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentGigsList;









