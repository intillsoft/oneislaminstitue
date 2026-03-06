import AdvancedRecommendationEngine from '../services/advancedRecommendationEngine.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function testRecommendationOptimization() {
    console.log('Testing Recommendation Engine Optimization...');

    const engine = AdvancedRecommendationEngine;

    // Mock user profile and jobs
    const userId = '0a0434fb-5318-4fc9-9644-93f632b6484c'; // Real user ID from logs
    const options = {
        limit: 10,
        minScore: 0,
        useAI: true,
        includeExplanations: false
    };

    try {
        console.log('Running getPersonalizedJobRecommendations...');
        const startTime = Date.now();
        const results = await engine.getPersonalizedJobRecommendations(userId, options);
        const duration = Date.now() - startTime;

        console.log(`Generated ${results.length} recommendations in ${duration}ms`);

        if (results.length > 0) {
            const firstResult = results[0];
            console.log('Sample Result:', {
                title: firstResult.title,
                matchScore: firstResult.matchScore,
                breakdown: firstResult.scoreBreakdown
            });

            if (firstResult.scoreBreakdown && 'ai' in firstResult.scoreBreakdown) {
                console.log('PASSED: AI score is present in breakdown.');
            } else {
                console.error('FAILED: AI score missing from breakdown.');
            }
        }
    } catch (error) {
        console.error('FAILED: Recommendation engine crashed:', error.message);
        console.error(error.stack);
    }
}

testRecommendationOptimization();
