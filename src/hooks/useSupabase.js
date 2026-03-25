/**
 * React Hooks for Supabase
 * Custom hooks for common Supabase operations
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, auth } from '../lib/supabase';
import { handleSupabaseError } from '../lib/supabase';

/**
 * Hook for fetching data from Supabase
 */
export function useSupabaseQuery(table, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    select = '*',
    filters = [],
    orderBy = null,
    limit = null,
    single = false,
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select(select);

      // Apply filters
      filters.forEach(({ column, operator, value }) => {
        if (operator === 'eq') {
          query = query.eq(column, value);
        } else if (operator === 'neq') {
          query = query.neq(column, value);
        } else if (operator === 'gt') {
          query = query.gt(column, value);
        } else if (operator === 'lt') {
          query = query.lt(column, value);
        } else if (operator === 'gte') {
          query = query.gte(column, value);
        } else if (operator === 'lte') {
          query = query.lte(column, value);
        } else if (operator === 'like') {
          query = query.like(column, value);
        } else if (operator === 'ilike') {
          query = query.ilike(column, value);
        } else if (operator === 'in') {
          query = query.in(column, value);
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending !== false });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: queryError } = single
        ? await query.single()
        : await query;

      if (queryError) throw queryError;

      setData(result);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, select, JSON.stringify(filters), orderBy, limit, single]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for real-time subscriptions
 */
export function useSupabaseRealtime(table, filters = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    const fetchInitial = async () => {
      try {
        let query = supabase.from(table).select('*');

        filters.forEach(({ column, operator, value }) => {
          if (operator === 'eq') {
            query = query.eq(column, value);
          }
        });

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        setData(result || []);
        setLoading(false);
      } catch (err) {
        setError(handleSupabaseError(err));
        setLoading(false);
      }
    };

    fetchInitial();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, JSON.stringify(filters)]);

  return { data, loading, error };
}

/**
 * Hook for authentication state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    auth.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to get session:', err);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    signInWithOAuth: auth.signInWithOAuth,
  };
}

/**
 * Hook for protected routes
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAuthorized(!!user);
      if (!user) {
        window.location.href = '/login';
      }
    }
  }, [user, loading]);

  return { user, loading, isAuthorized };
}

export default {
  useSupabaseQuery,
  useSupabaseRealtime,
  useAuth,
  useRequireAuth,
};

