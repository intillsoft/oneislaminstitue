/**
 * Authentication Context
 * Global auth state management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useSupabase';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile when user changes - Memoize to prevent unnecessary re-renders
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      // Prevent refetch if profile already exists and user hasn't changed
      if (profile && profile.id === auth.user.id) {
        return;
      }

      try {
        setLoadingProfile(true);
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', auth.user.id)
          .single();

        // If profile doesn't exist, create it
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          // Get role from user metadata (set during registration)
          const userRole = auth.user.user_metadata?.role || 'job-seeker';
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: auth.user.id,
              email: auth.user.email,
              name: auth.user.user_metadata?.name || auth.user.user_metadata?.full_name || auth.user.email?.split('@')[0] || 'User',
              avatar_url: auth.user.user_metadata?.avatar_url,
              role: userRole, // Set role immediately
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setProfile(null);
          } else {
            setProfile(newProfile);
          }
        } else if (error) {
          console.error('Error fetching profile:', error);
          // Don't throw - just log and set profile to null
          // This allows the app to continue working even if profile fetch fails
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Set a default profile with job-seeker role if fetch fails
        // This ensures the app doesn't break if profile fetch fails
        setProfile({
          id: auth.user.id,
          email: auth.user.email,
          role: 'job-seeker', // Default role
          name: auth.user.user_metadata?.name || auth.user.email?.split('@')[0] || 'User',
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [auth.user?.id]); // Only depend on user ID, not entire user object

  const value = {
    ...auth,
    profile,
    loadingProfile,
    updateProfile: async (updates) => {
      try {
        if (!auth.user) {
          throw new Error('User not authenticated');
        }

        // Remove undefined values to avoid update errors
        const cleanUpdates = Object.fromEntries(
          Object.entries(updates).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(cleanUpdates).length === 0) {
          console.warn('No valid updates provided');
          return profile;
        }

        const { data, error } = await supabase
          .from('users')
          .update(cleanUpdates)
          .eq('id', auth.user.id)
          .select()
          .single();

        if (error) {
          console.error('Profile update error:', error);
          throw new Error(error.message || 'Failed to update profile');
        }

        if (!data) {
          throw new Error('No data returned from update');
        }

        setProfile(data);
        success('Profile updated successfully');
        return data;
      } catch (err) {
        console.error('Profile update failed:', err);
        const errorMessage = err.message || 'Failed to update profile';
        showError(errorMessage);
        throw err;
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthProvider;

