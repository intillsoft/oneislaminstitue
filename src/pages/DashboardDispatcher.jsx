import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext, normalizeRole } from '../contexts/AuthContext';
import Icon from '../components/AppIcon';
import AILoader from '../components/ui/AILoader';

const DashboardDispatcher = () => {
  const { user, profile, loading, loadingProfile, userRole } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !loadingProfile) {
      if (!user) {
        navigate('/login');
        return;
      }

      const role = userRole;
      
      console.log('DashboardDispatcher: user role identified as', role);

      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'instructor':
          navigate('/instructor/dashboard', { replace: true });
          break;
        case 'student':
        default:
          navigate('/dashboard/student', { replace: true });
          break;
      }
    }
  }, [user, profile, loading, loadingProfile, navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-32">
      <AILoader variant="neural" text="Syncing Academic Profile..." />
    </div>
  );
};

export default DashboardDispatcher;
