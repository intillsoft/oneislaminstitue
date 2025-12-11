import { useState, useCallback } from 'react';
import aiService from '../services/aiService';
import { useToast } from '../components/ui/Toast';

export const useTalentAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { error: showError, success: showSuccess } = useToast();

    const optimizeGig = useCallback(async (title, description, category, tags = []) => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiService.optimizeGig(title, description, category, tags);
            showSuccess('Gig optimized successfully!');
            return result;
        } catch (err) {
            setError(err.message);
            showError(err.message || 'Failed to optimize gig');
            return null;
        } finally {
            setLoading(false);
        }
    }, [showError, showSuccess]);

    const analyzeRates = useCallback(async (title, skills, experienceLevel, currentRate, category) => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiService.analyzeRates(title, skills, experienceLevel, currentRate, category);
            return result;
        } catch (err) {
            setError(err.message);
            showError(err.message || 'Failed to analyze rates');
            return null;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const generateProposal = useCallback(async (jobDetails, freelancerProfile, tone = 'professional') => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiService.generateProposal(jobDetails, freelancerProfile, tone);
            return result;
        } catch (err) {
            setError(err.message);
            showError(err.message || 'Failed to generate proposal');
            return null;
        } finally {
            setLoading(false);
        }
    }, [showError]);

    const analyzeClientVibe = useCallback(async (messages, clientData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiService.analyzeClientVibe(messages, clientData);
            return result;
        } catch (err) {
            setError(err.message);
            console.warn('Vibe check failed (fail-open):', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const forecastEarnings = useCallback(async (earningsHistory, activeGigsValue, pipelineCount) => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiService.forecastEarnings(earningsHistory, activeGigsValue, pipelineCount);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        optimizeGig,
        analyzeRates,
        generateProposal,
        analyzeClientVibe,
        forecastEarnings
    };
};

export default useTalentAI;
