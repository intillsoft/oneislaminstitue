/**
 * Protected Route Component
 * Wraps routes that require authentication and optionally specific roles
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({
  children,
  requireSubscription = false,
  requiredTier = null,
  requiredRole = null,
  allowedRoles = null
}) => {
  const { user, loading, profile, loadingProfile } = useAuthContext();
  const location = useLocation();

  // Show loading while checking auth or profile
  if (loading || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
      </div>
    );
  }

  // Require authentication
  if (!user) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  const userRole = profile?.role || 'job-seeker';

  if (requiredRole && userRole !== requiredRole) {
    // User doesn't have the required role
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // User role not in allowed list
    return <Navigate to="/dashboard" replace />;
  }

  // Check subscription requirements
  if (requireSubscription) {
    const subscriptionTier = profile?.subscription_tier || 'free';
    const tierHierarchy = { free: 0, basic: 1, premium: 2, pro: 3 };

    if (requiredTier && tierHierarchy[subscriptionTier] < tierHierarchy[requiredTier]) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

