/**
 * API Key Authentication Middleware
 * Validates X-API-Key header against the database
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

if (!supabaseUrl || !supabaseKey) {
  logger.warn('❌ API Key Auth: SUPABASE CREDENTIALS MISSING!');
}

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Hash a plain text API key
 */
export function hashApiKey(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Middleware to authenticate requests via API Key
 */
export const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
        return res.status(401).json({ error: 'API Key is missing. Use X-API-Key header.' });
    }

    try {
        const hashedKey = hashApiKey(apiKey);

        // Look up the key in the database
        const { data: keyRecord, error } = await supabase
            .from('api_keys')
            .select('*, user:users(*)')
            .eq('key_hash', hashedKey)
            .eq('is_active', true)
            .single();

        if (error || !keyRecord) {
            logger.warn(`Invalid or inactive API Key attempt: ${apiKey.substring(0, 8)}...`);
            return res.status(403).json({ error: 'Invalid or inactive API Key' });
        }

        // Check expiration
        if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
            return res.status(403).json({ error: 'API Key has expired' });
        }

        // Attach user and scopes to request
        req.user = keyRecord.user;
        req.apiKeyId = keyRecord.id;
        req.scopes = keyRecord.scopes || [];

        // Update last used timestamp (fire and forget)
        supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', keyRecord.id).then();

        next();
    } catch (err) {
        logger.error('API Key Auth Error:', err);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

/**
 * Helper to check if the current API key has a specific scope
 */
export const checkScope = (scope) => {
    return (req, res, next) => {
        if (!req.scopes || !req.scopes.includes(scope)) {
            return res.status(403).json({
                error: `Insufficient permissions. This API Key requires the '${scope}' scope.`
            });
        }
        next();
    };
};
