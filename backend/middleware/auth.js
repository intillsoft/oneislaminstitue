/**
 * Authentication Middleware
 * Validates Supabase JWT tokens with local caching to reduce network calls
 */

import { supabase } from '../lib/supabase.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();


// In-memory token cache: token -> { user, expiresAt }
const tokenCache = new Map();
const pendingVerifications = new Map(); // NEW: Deduplicate concurrent requests
const CACHE_TTL_MS = 60_000; // Cache valid tokens for 60 seconds

function getCachedUser(token) {
  const entry = tokenCache.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    tokenCache.delete(token);
    return null;
  }
  return entry.user;
}

function setCachedUser(token, user) {
  if (tokenCache.size > 500) {
    const now = Date.now();
    for (const [key, entry] of tokenCache.entries()) {
      if (now > entry.expiresAt) tokenCache.delete(key);
    }
  }
  tokenCache.set(token, {
    user,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function decodeTokenLocally(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload) return null;

    const { sub, email, exp, user_metadata, app_metadata } = decoded.payload;
    if (!sub) return null;

    if (exp && Date.now() / 1000 > exp) {
      logger.warn('Local JWT decode: token is expired');
      return null;
    }

    return {
      id: sub,
      email: email || user_metadata?.email || '',
      user_metadata: user_metadata || {},
      app_metadata: app_metadata || {},
      role: app_metadata?.role || user_metadata?.role || 'authenticated',
    };
  } catch {
    return null;
  }
}

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);

    if (!supabase) {
      logger.error('Auth: Supabase client not initialized (missing credentials)');
      return res.status(503).json({ error: 'Authentication service unavailable' });
    }

    // 1. Check cache first (no network call needed)
    const cachedUser = getCachedUser(token);
    if (cachedUser) {
      req.user = cachedUser;
      req.supabase = supabase;
      return next();
    }

    // 2. Try Supabase verification (authoritative but needs network)
    try {
      // DEDUPLICATE CONCURRENT REQUESTS (Prevents 429 on initial dashboard load burst)
      let verifyPromise = pendingVerifications.get(token);
      if (!verifyPromise) {
        verifyPromise = supabase.auth.getUser(token).finally(() => {
          pendingVerifications.delete(token); // CLEANUP
        });
        pendingVerifications.set(token, verifyPromise);
      }

      const { data: { user }, error } = await verifyPromise;

      if (!error && user) {
        setCachedUser(token, user);
        req.user = user;
        req.supabase = supabase;
        return next();
      }

      if (error) {
        // Fallback to local if it's a network OR rate limit error
        const isNetworkError = error.message?.includes('fetch') ||
          error.message?.includes('timeout') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ConnectTimeout') ||
          error.message?.includes('UND_ERR') ||
          error.status === 429 || // RATE LIMIT (Too Many Requests)
          error.message?.includes('rate limit'); // Supabase custom error

        if (!isNetworkError) {
          logger.warn('Auth: Invalid token -', error.message);
          return res.status(401).json({ error: 'Invalid token' });
        }
        logger.warn('Auth: Supabase network/rate issue, falling back to local JWT decode:', error.message);
      }
    } catch (networkErr) {
      logger.warn('Auth: Network error reaching Supabase, trying local decode:', networkErr.message);
    }

    // 3. Fallback: local JWT decode (no network, no signature verification)
    const localUser = decodeTokenLocally(token);
    if (localUser) {
      logger.info(`Auth: Using local decode for user ${localUser.id} (Supabase rate limited/unreachable)`);
      tokenCache.set(token, { user: localUser, expiresAt: Date.now() + 30_000 });
      req.user = localUser;
      req.supabase = supabase;
      return next();
    }

    return res.status(401).json({ error: 'Authentication failed' });
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional authentication (doesn't fail if no token)
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Check cache first
      const cachedUser = getCachedUser(token);
      if (cachedUser) {
        req.user = cachedUser;
        req.supabase = supabase;
        return next();
      }

      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          setCachedUser(token, user);
          req.user = user;
          req.supabase = supabase;
        }
      } catch {
        // Try local decode as fallback
        const localUser = decodeTokenLocally(token);
        if (localUser) {
          req.user = localUser;
          req.supabase = supabase;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
