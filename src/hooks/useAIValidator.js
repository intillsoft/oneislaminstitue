
import { useState } from 'react';
import { aiService } from '../services/aiService';

export const useAIValidator = () => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

    const validate = async (type, content, context = {}) => {
        setIsValidating(true);
        setValidationResult(null);
        try {
            const result = await aiService.validateInput(type, content, context);
            setValidationResult(result);
            return result;
        } catch (error) {
            console.error('Validation failed:', error);
            return { isValid: true }; // Fail open
        } finally {
            setIsValidating(false);
        }
    };

    return {
        validate,
        isValidating,
        validationResult,
        resetValidation: () => setValidationResult(null),
    };
};
