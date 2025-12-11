
import express from 'express';
import talentAI from '../services/talentAI.js';
import { authenticate } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/talent/optimize-gig
 * Optimize gig title and description
 */
router.post('/optimize-gig', authenticate, async (req, res) => {
    try {
        const { title, description, category, tags } = req.body;
        const result = await talentAI.optimizeGig(title, description, category, tags);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error optimizing gig:', error);
        res.status(500).json({ error: 'Failed to optimize gig', message: error.message });
    }
});

/**
 * POST /api/talent/analyze-rates
 * Analyze freelance rates
 */
router.post('/analyze-rates', authenticate, async (req, res) => {
    try {
        const { title, skills, experienceLevel, currentRate, category } = req.body;
        const result = await talentAI.analyzeRates(title, skills, experienceLevel, currentRate, category);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error analyzing rates:', error);
        res.status(500).json({ error: 'Failed to analyze rates', message: error.message });
    }
});

/**
 * POST /api/talent/generate-proposal
 * Generate custom job proposal
 */
router.post('/generate-proposal', authenticate, async (req, res) => {
    try {
        const { jobDetails, freelancerProfile, tone } = req.body;
        const result = await talentAI.generateProposal(jobDetails, freelancerProfile, tone);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error generating proposal:', error);
        res.status(500).json({ error: 'Failed to generate proposal', message: error.message });
    }
});

/**
 * POST /api/talent/analyze-client
 * Analyze client messages for red flags
 */
router.post('/analyze-client', authenticate, async (req, res) => {
    try {
        const { messages, clientData } = req.body;
        const result = await talentAI.analyzeClientVibe(messages, clientData);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error analyzing client:', error);
        res.status(500).json({ error: 'Failed to analyze client', message: error.message });
    }
});

/**
 * POST /api/talent/verify-skill
 * Verify a specific skill
 */
router.post('/verify-skill', authenticate, async (req, res) => {
    try {
        const { skill, chatHistory } = req.body;
        const result = await talentAI.verifySkill(skill, chatHistory);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error verifying skill:', error);
        res.status(500).json({ error: 'Failed to verify skill', message: error.message });
    }
});

/**
 * POST /api/talent/suggest-upsell
 * Suggest upsell opportunities
 */
router.post('/suggest-upsell', authenticate, async (req, res) => {
    try {
        const { chatContext, availableServices } = req.body;
        const result = await talentAI.suggestUpsell(chatContext, availableServices);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error suggesting upsell:', error);
        res.status(500).json({ error: 'Failed to suggest upsell', message: error.message });
    }
});

/**
 * POST /api/talent/forecast-earnings
 * Predict future earnings
 */
router.post('/forecast-earnings', authenticate, async (req, res) => {
    try {
        const { earningsHistory, activeGigs, pipeline } = req.body;
        const result = await talentAI.forecastEarnings(earningsHistory, activeGigs, pipeline);
        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Error forecasting earnings:', error);
        res.status(500).json({ error: 'Failed to forecast earnings', message: error.message });
    }
});

export default router;
