import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import TalentAIHub from '../../components/talent/TalentAIHub';
import { Sparkles } from 'lucide-react';

const TalentMarketplace = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    deliveryTime: '',
    rating: '',
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGigs, setTotalGigs] = useState(0);
  const [showAIHub, setShowAIHub] = useState(false);

  useEffect(() => {
    loadGigs();
  }, [searchQuery, filters, sortBy, currentPage]);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery || undefined,
        category: filters.category || undefined,
        min_price: filters.minPrice || undefined,
        max_price: filters.maxPrice || undefined,
        page: currentPage,
        pageSize: 20,
      };

      const result = await talentService.getGigs(params);
      // Handle different response structures
      if (result && typeof result === 'object') {
        if (Array.isArray(result)) {
          setGigs(result);
          setTotalGigs(result.length);
        } else {
          setGigs(result.data || []);
          setTotalGigs(result.pagination?.total || result.total || 0);
        }
      } else {
        setGigs([]);
        setTotalGigs(0);
      }
    } catch (error) {
      console.error('Error loading gigs:', error);
      showError('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                Talent Marketplace
              </h1>
              <p className="text-[#64748B] dark:text-[#8B92A3]">
                Discover freelance services and hire talented professionals
              </p>
            </div>
            <button
              onClick={() => setShowAIHub(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Freelance Suite</span>
            </button>
          </div>

          {showAIHub && <TalentAIHub onClose={() => setShowAIHub(false)} />}

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search for services, skills, or talents..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E2640] bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.category}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, category: e.target.value }));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, minPrice: e.target.value }));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
              />

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED]"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
              {totalGigs} gigs found
            </p>
          </div>

          {/* Gigs Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
              <p className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">No gigs found</p>
              <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/talent/gigs/${gig.id}`}
                  className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Gig Image */}
                  <div className="w-full h-48 bg-gray-200 dark:bg-[#1A2139] relative overflow-hidden">
                    {gig.images && gig.images.length > 0 ? (
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Image" className="w-12 h-12 text-[#64748B] dark:text-[#8B92A3]" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // TODO: Implement save gig
                        }}
                        className="p-2 bg-white dark:bg-[#13182E] rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-[#1A2139]"
                      >
                        <Icon name="Bookmark" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Gig Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#0F172A] dark:text-[#E8EAED] line-clamp-2 flex-1">
                        {gig.title}
                      </h3>
                    </div>

                    {/* Talent Info */}
                    <div className="flex items-center gap-2 mb-3">
                      {gig.talent?.user?.avatar_url ? (
                        <img
                          src={gig.talent.user.avatar_url}
                          alt={gig.talent.user.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                          <Icon name="User" size={12} className="text-workflow-primary" />
                        </div>
                      )}
                      <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                        {gig.talent?.user?.name || gig.talent?.title || 'Unknown'}
                      </span>
                      {gig.talent?.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={12} className="text-yellow-500 fill-current" />
                          <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">
                            {gig.talent.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Gig Details */}
                    <div className="flex items-center justify-between text-sm text-[#64748B] dark:text-[#8B92A3] mb-3">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {gig.delivery_time} days
                      </span>
                      {gig.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                          {gig.rating.toFixed(1)} ({gig.total_orders})
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                      <div>
                        <span className="text-xs text-[#64748B] dark:text-[#8B92A3]">Starting at</span>
                        <p className="text-lg font-bold text-[#0F172A] dark:text-[#E8EAED]">
                          ${gig.price}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-workflow-primary text-white rounded-lg hover:bg-workflow-primary-600 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalGigs > 20 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                Page {currentPage} of {Math.ceil(totalGigs / 20)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(totalGigs / 20)}
                className="px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default TalentMarketplace;
