/**
 * AI Service (Multi-Provider Support)
 * Now supports OpenAI, Hugging Face, Anthropic, Google Gemini, and Cohere
 * Automatically falls back to free alternatives when needed
 */

// Import the new multi-provider service
import * as aiProviderService from './aiProviderService.js';
import logger from '../utils/logger.js';

// Re-export for backward compatibility
export const generateCompletion = aiProviderService.generateCompletion;
export const generateEmbedding = aiProviderService.generateEmbedding;
export const generateEmbeddings = aiProviderService.generateEmbeddings;
export const cosineSimilarity = aiProviderService.cosineSimilarity;

// Default export for backward compatibility
export default {
  generateCompletion: aiProviderService.generateCompletion,
  generateEmbedding: aiProviderService.generateEmbedding,
  generateEmbeddings: aiProviderService.generateEmbeddings,
  cosineSimilarity: aiProviderService.cosineSimilarity,
};

