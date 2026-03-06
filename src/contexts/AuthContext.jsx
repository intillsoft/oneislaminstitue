import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};

/**
 * Standardizes role names across the application.
 * Normalizes legacy roles ('job-seeker', 'recruiter') to canonical ones ('student', 'instructor').
 */
export const normalizeRole = (role) => {
  if (!role) return 'student';
  const r = role.toLowerCase().trim();
  // Final normalization check
  if (r.includes('admin') || r === 'owner' || r === 'superadmin') return 'admin';
  
  // GOD MODE FAIL-SAFE: Hardcode admin role for the owner's email
  // Only applies if the user object is available (checked during resolution)
  
  if (r === 'instructor' || r === 'recruiter' || r === 'curator team' || r === 'teacher' || r === 'mentor') return 'instructor';
  if (r === 'student' || r === 'job-seeker' || r === 'jobseeker' || r === 'scholar' || r === 'user') return 'student';
  return r;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeRole, setActiveRoleState] = useState(null);

  // Hierarchy validation
  const isRoleAllowed = (base, target) => {
    const normalizedBase = normalizeRole(base);
    const normalizedTarget = normalizeRole(target);
    
    if (normalizedBase === 'admin') return ['admin', 'instructor', 'student'].includes(normalizedTarget);
    if (normalizedBase === 'instructor') return ['instructor', 'student'].includes(normalizedTarget);
    return normalizedTarget === 'student';
  };

  const switchActiveRole = (newRole) => {
    if (!profile) return false;
    const normalizedNewRole = normalizeRole(newRole);
    if (isRoleAllowed(profile.role, normalizedNewRole)) {
      setActiveRoleState(normalizedNewRole);
      localStorage.setItem(`activeRole_${auth.user.id}`, normalizedNewRole);
      success(`Switched to ${normalizedNewRole.charAt(0).toUpperCase() + normalizedNewRole.slice(1)} view`);
      return true;
    }
    showError('Unauthorized role switch');
    return false;
  };

  const fetchProfile = async () => {
    if (!auth.user) {
      setProfile(null);
      setActiveRoleState(null);
      setLoadingProfile(false);
      return;
    }

    try {
      setLoadingProfile(true);
      
      const ownerEmail = 'yussifabduljalil602@gmail.com';
      const userEmail = auth.user?.email?.toLowerCase();
      const isOwner = userEmail === ownerEmail.toLowerCase();

      // 1. Try to fetch the profile from the database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', auth.user.id)
        .single();

      let resolvedProfile = null;

      if (error) {
        // 2. If profile is missing (PGRST116), it means the DB trigger failed or hasn't run yet.
        if (error.code === 'PGRST116') {
          console.warn('🛡️ Profile missing in DB. Attempting recovery...');
          
          const metadataRole = isOwner ? 'admin' : (auth.user.user_metadata?.role || 'student');
          const recoveryData = {
            id: auth.user.id,
            email: auth.user.email,
            name: auth.user.user_metadata?.name || auth.user.user_metadata?.full_name || auth.user.email?.split('@')[0] || 'User',
            role: normalizeRole(metadataRole),
            avatar_url: auth.user.user_metadata?.avatar_url || null,
          };

          const { data: recovered, error: upsertError } = await supabase
            .from('users')
            .upsert(recoveryData)
            .select()
            .single();

          if (upsertError) {
            console.error('❌ Recovery Failed (RLS?):', upsertError);
            resolvedProfile = { ...recoveryData, role: normalizeRole(metadataRole) };
          } else {
            console.log('✅ Recovery Successful');
            resolvedProfile = { ...recovered, role: normalizeRole(recovered.role) };
          }
        } else {
          console.error('⚠️ DB Error:', error.message);
          resolvedProfile = { id: auth.user.id, role: isOwner ? 'admin' : normalizeRole(auth.user.user_metadata?.role), name: 'User' };
        }
      } else {
        // Force Admin for Owner even if DB says otherwise
        const finalRole = isOwner ? 'admin' : normalizeRole(data.role);
        resolvedProfile = { ...data, role: finalRole };
      }

      setProfile(resolvedProfile);

      // Initialize Active Role from LocalStorage or Profile
      const savedActiveRole = localStorage.getItem(`activeRole_${auth.user.id}`);
      if (savedActiveRole && isRoleAllowed(resolvedProfile.role, savedActiveRole)) {
        setActiveRoleState(normalizeRole(savedActiveRole));
      } else {
        setActiveRoleState(resolvedProfile.role);
      }

    } catch (err) {
      console.error('Auth Fatal:', err);
      const fallbackRole = 'student';
      setProfile({ id: auth.user.id, role: fallbackRole, name: 'User' });
      setActiveRoleState(fallbackRole);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    console.log('🔐 Auth State Changed:', {
      userId: auth.user?.id,
      email: auth.user?.email,
      metadataRole: auth.user?.user_metadata?.role
    });
    fetchProfile();
    
    if (auth.user) {
      const channel = supabase
        .channel(`profile-updates-${auth.user.id}`)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${auth.user.id}` },
          (payload) => {
            console.log('🔄 PROFILE SYNC: Database update detected', payload.new.role);
            const normalizedNewRole = normalizeRole(payload.new.role);
            setProfile(prev => ({ ...prev, ...payload.new, role: normalizedNewRole }));
            
            // If base role changed and active role is no longer allowed, reset it
            setActiveRoleState(prevActive => {
              if (!isRoleAllowed(normalizedNewRole, prevActive)) {
                localStorage.setItem(`activeRole_${auth.user.id}`, normalizedNewRole);
                return normalizedNewRole;
              }
              return prevActive;
            });
          }
        )
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [auth.user?.id]);

  const updateProfile = async (updates) => {
    if (!auth.user) throw new Error('No user logged in');
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', auth.user.id)
        .select()
        .single();

      if (error) throw error;
      const normalizedRole = normalizeRole(data.role);
      setProfile(prev => ({ ...prev, ...data, role: normalizedRole }));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    ...auth,
    profile,
    loadingProfile,
    userRole: activeRole || profile?.role || normalizeRole(auth.user?.user_metadata?.role),
    baseRole: profile?.role || normalizeRole(auth.user?.user_metadata?.role),
    activeRole,
    switchActiveRole,
    fetchProfile,
    updateProfile,
    normalizeRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
