/**
 * Audit Service
 * Centralized logging for enterprise compliance and security tracking.
 */

import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

class AuditService {
    /**
     * Log a security or enterprise event
     * @param {Object} params
     * @param {string} params.userId - User performing the action
     * @param {string} params.action - Action name (e.g., 'API_KEY_GENERATED')
     * @param {string} params.resourceType - Type of resource (e.g., 'API_KEY')
     * @param {string} params.resourceId - ID of the resource
     * @param {Object} params.payload - Additional context
     * @param {Object} params.req - Express request object for IP/Agent extraction
     */
    async log({ userId, action, resourceType, resourceId, payload = {}, req = null }) {
        try {
            const auditData = {
                user_id: userId,
                action,
                resource_type: resourceType,
                resource_id: resourceId,
                payload,
                ip_address: req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null,
                user_agent: req ? req.headers['user-agent'] : null
            };

            const { error } = await supabase
                .from('audit_logs')
                .insert([auditData]);

            if (error) {
                logger.error('AuditService: Failed to store audit log:', error);
            }

            // Also log to application logs for real-time monitoring
            logger.info(`AUDIT [${action}]: User ${userId} on ${resourceType} ${resourceId}`, payload);
        } catch (err) {
            logger.error('AuditService: Fatal error:', err);
        }
    }
}

export const auditService = new AuditService();
