/**
 * Protected Route Component
 * Wraps routes that require authentication and optionally specific roles
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext, normalizeRole } from '../contexts/AuthContext';
import AILoader from './ui/AILoader';

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
      <div className="flex items-center justify-center min-vh-screen min-h-screen bg-bg">
        <AILoader variant="pulse" text="Securing access..." />
      </div>
    );
  }

  // Require authentication - only redirect after loading is complete
  if (!user) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  // Use the canonical role from profile, or check metadata if profile isn't fully ready
  const role = normalizeRole(profile?.role || user?.user_metadata?.role);

  if (requiredRole) {
    if (requiredRole === 'admin' && role !== 'admin') {
       return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'instructor' && role !== 'instructor' && role !== 'admin') {
       return <Navigate to="/dashboard" replace />;
    }
    if (role !== requiredRole && role !== 'admin') {
       return <Navigate to="/dashboard" replace />;
    }
  }

  if (allowedRoles) {
    const isAllowed = allowedRoles.some(r => {
      const normalizedR = normalizeRole(r);
      return role === normalizedR || role === 'admin'; // Admins always allowed
    });
    
    if (!isAllowed) {
      return <Navigate to="/dashboard" replace />;
    }
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

