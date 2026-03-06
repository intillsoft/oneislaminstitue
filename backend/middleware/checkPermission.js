/**
 * checkPermission Middleware
 * Enforces granular RBAC permissions based on the enterprise schema.
 */

import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * Middleware to check if a user has a specific permission
 * @param {string} permissionSlug - The slug of the permission to check (e.g., 'jobs:write')
 */
export const checkPermission = (permissionSlug) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized: No user found' });
            }

            // Admin always has all permissions
            if (user.role === 'admin') {
                return next();
            }

            // Check role_permissions mapping in Supabase
            const { data: permission, error } = await supabase
                .from('role_permissions')
                .select('permissions!inner(slug)')
                .eq('role', user.role)
                .eq('permissions.slug', permissionSlug)
                .maybeSingle();

            if (error) {
                logger.error(`checkPermission: Error checking permission ${permissionSlug} for role ${user.role}:`, error);
                return res.status(500).json({ error: 'Internal server error checking permissions' });
            }

            if (!permission) {
                logger.warn(`checkPermission: Access denied for user ${user.id} (role: ${user.role}) on ${permissionSlug}`);
                return res.status(403).json({
                    error: 'Forbidden: Insufficient permissions',
                    required_permission: permissionSlug
                });
            }

            // Permission granted
            next();
        } catch (err) {
            logger.error('checkPermission: Fatal error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
