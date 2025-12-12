import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { BackButton } from './NavigationButtons';

const Breadcrumb = ({ customItems = null, showBackButton = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMappings = {
    '/': 'Home',
    '/jobs': 'Browse Jobs',
    '/job-detail-application': 'Job Details',
    '/dashboard': 'Dashboard',
    '/job-seeker-registration-login': 'Sign In',
    '/company-registration-profile-setup': 'Company Setup',
    '/job-posting-creation-management': 'Post Job',
    '/recruiter-dashboard-analytics': 'Dashboard',
    '/admin-moderation-management': 'Admin Panel'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathMappings?.[currentPath] || segment?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());

      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location?.pathname === '/' || breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-3 mb-6" aria-label="Breadcrumb">
      {showBackButton && (
        <BackButton
          onClick={() => navigate(-1)}
          className="mr-2"
        />
      )}
      <ol className="flex items-center space-x-2 text-sm text-[#64748B] dark:text-[#8B92A3]">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center">
            {index > 0 && (
              <Icon
                name="ChevronRight"
                size={16}
                className="mx-2 text-[#CBD5E1] dark:text-[#2A3142]"
                aria-hidden="true"
              />
            )}
            {crumb?.isLast || index === breadcrumbs?.length - 1 ? (
              <span
                className="text-[#0F172A] dark:text-[#E8EAED] font-semibold truncate max-w-xs sm:max-w-sm"
                aria-current="page"
              >
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="hover:text-workflow-primary dark:hover:text-workflow-primary-400 transition-colors truncate max-w-xs sm:max-w-sm"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;