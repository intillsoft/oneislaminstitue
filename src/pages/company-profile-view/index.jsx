/**
 * Company Profile View Page
 * Public view of company profile (read-only)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';

const CompanyProfileView = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  const loadCompany = async () => {
    try {
      setLoading(true);

      // Try to find company by ID first, then by name slug
      let query = supabase.from('companies').select('*');

      // If companyId looks like a UUID, search by ID
      if (companyId && companyId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        query = query.eq('id', companyId);
      } else {
        // Otherwise, search by name (slug)
        const nameFromSlug = companyId?.replace(/-/g, ' ');
        query = query.ilike('name', `%${nameFromSlug}%`);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCompany(data);
      } else {
        // Company not found
        setCompany(null);
      }
    } catch (error) {
      console.error('Error loading company:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-warning-500 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning-500 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-secondary-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-text-secondary dark:text-gray-400">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar
          isCollapsed={isSidebarCollapsed}
          onCollapseChange={setIsSidebarCollapsed}
        />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <Icon name="Building2" size={64} className="mx-auto mb-4 text-secondary-400 dark:text-gray-600" />
                <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-2">Company Not Found</h1>
                <p className="text-text-secondary dark:text-gray-400 mb-6">
                  The company profile you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/jobs" className="btn-primary">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isOwner = user && (profile?.role === 'admin' || profile?.role === 'recruiter');

  return (
    <div className="min-h-screen bg-bg">
      <UnifiedSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />

            {/* Header */}
            <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-gray-700 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-bg border border-border dark:border-white/5 flex items-center justify-center flex-shrink-0">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name || 'Company logo'}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Icon name="Building2" size={48} className="text-secondary-400 dark:text-gray-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
                        {company.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm">
                        {company.industry && (
                          <span className="flex items-center">
                            <Icon name="Briefcase" size={14} className="mr-1" />
                            {company.industry}
                          </span>
                        )}
                        {company.location && (
                          <span className="flex items-center">
                            <Icon name="MapPin" size={14} className="mr-1" />
                            {company.location}
                          </span>
                        )}
                        {company.size && (
                          <span className="flex items-center">
                            <Icon name="Users" size={14} className="mr-1" />
                            {company.size}
                          </span>
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <Link
                        to="/company-registration-profile-setup"
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Icon name="Edit" size={16} />
                        <span>Edit Profile</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Description */}
            {company.description && (
              <div className="bg-bg-elevated rounded-3xl shadow-xl border border-border dark:border-white/5 p-8 mb-6">
                <h2 className="text-xl font-semibold text-text-primary dark:text-white mb-4">About {company.name}</h2>
                <p className="text-text-secondary dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {company.description}
                </p>
              </div>
            )}

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {company.website && (
                <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="Globe" size={20} className="text-primary dark:text-primary-400" />
                    <h3 className="text-lg font-semibold text-text-primary dark:text-white">Website</h3>
                  </div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}

              {company.founded_year && (
                <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="Calendar" size={20} className="text-primary dark:text-primary-400" />
                    <h3 className="text-lg font-semibold text-text-primary dark:text-white">Founded</h3>
                  </div>
                  <p className="text-text-secondary dark:text-gray-400">{company.founded_year}</p>
                </div>
              )}
            </div>

            {/* View Jobs Button */}
            <div className="bg-background dark:bg-[#13182E] rounded-lg shadow-sm border border-border dark:border-gray-700 p-6">
              <Link
                to={`/jobs?company=${encodeURIComponent(company.name)}`}
                className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2"
              >
                <Icon name="Briefcase" size={16} />
                <span>View Jobs at {company.name}</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfileView;

