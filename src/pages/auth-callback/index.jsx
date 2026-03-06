import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';
import Icon from 'components/AppIcon';
import AILoader from '../../components/ui/AILoader';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: showError } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from URL (Supabase OAuth returns hash, not query params)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          showError(errorDescription || 'Authentication failed');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (accessToken) {
          // Set the session
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token'),
          });

          if (sessionError) throw sessionError;

          // Check if user exists in users table, create if not
          if (data.user) {
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('id', data.user.id)
              .single();

            if (!existingUser) {
              // Create user profile
              await supabase.from('users').insert({
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0],
                avatar_url: data.user.user_metadata?.avatar_url,
                created_at: new Date().toISOString(),
              });
            }
          }

          success('Successfully signed in!');
          setTimeout(() => {
            navigate('/dashboard/student');
          }, 1000);
        } else {
          // Check for error in query params (for password reset)
          const errorParam = searchParams.get('error');
          if (errorParam) {
            showError('Authentication error occurred');
            setTimeout(() => navigate('/login'), 2000);
          } else {
            // No token, redirect to login
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        showError('Failed to complete authentication');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, success, showError]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
      <AILoader variant="pulse" text="Completing authentication..." />
    </div>
  );
};

export default AuthCallback;

