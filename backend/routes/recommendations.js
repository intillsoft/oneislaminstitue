import express from 'express';
import { authenticate } from '../middleware/auth.js';
import recommendationEngine from '../services/advancedRecommendationEngine.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/recommendations/jobs
 * Get personalized job recommendations for the authenticated user
 */
router.get('/jobs', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            limit = 20,
            minScore = 60,
            includeExplanations = 'true',
            useAI = 'true',
        } = req.query;

        const recommendations = await recommendationEngine.getPersonalizedJobRecommendations(
            userId,
            {
                limit: parseInt(limit),
                minScore: parseInt(minScore),
                includeExplanations: includeExplanations === 'true',
                useAI: useAI === 'true',
            }
        );

        res.json({
            success: true,
            data: {
                recommendations,
                count: recommendations.length,
                algorithm: 'hybrid',
            },
        });
    } catch (error) {
        logger.error('Error getting job recommendations:', error);
        res.status(500).json({
            error: 'Failed to get recommendations',
            message: error.message,
        });
    }
});

export default router;
