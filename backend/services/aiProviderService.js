/**
 * Multi-Provider AI Service
 * Supports OpenAI, Hugging Face, Anthropic Claude, Google Gemini, and more
 * Automatically falls back to free alternatives when OpenAI credits are exhausted
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Get AI provider from environment (default: openai)
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

// Standard 429 handling helper
const handleRateLimitError = (provider, error) => {
  const message = error.message || String(error);
  if (message.includes('429') || message.toLowerCase().includes('rate limit')) {
    logger.error(`[AI Service] ${provider} 429 Rate Limit reached. Please wait before retrying.`);
  }
  return error;
};

/**
 * Initialize AI client based on provider
 */
function getAIClient(providerOverride = null) {
  const provider = (providerOverride || AI_PROVIDER || 'openai').toLowerCase();

  switch (provider) {
    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        logger.warn('OpenAI API key not found, falling back to huggingface');
        return getAIClient('huggingface');
      }
      return {
        type: 'openai',
        client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      };

      return {
        type: 'huggingface',
        apiKey: process.env.HUGGINGFACE_API_KEY,
        baseURL: 'https://api-inference.huggingface.co/models',
      };

      // ... (in generateHuggingFaceCompletion, URL is built from baseURL so it should auto-update if we change it here, but let's check generateHuggingFaceCompletion implementation below)

      /* ... skipping to generateCohereCompletion implementation ... */

      /**
       * Cohere Completion
       */
      async function generateCohereCompletion(client, prompt, options) {
        const { CohereClient } = await import('cohere-ai');
        const cohere = new CohereClient({ token: client.apiKey });

        const response = await cohere.chat({
          model: options.model,
          message: prompt,
          temperature: options.temperature,
          // maxTokens is not directly supported in chat the same way as generate, 
          // but usually handled by the model. We can pass it if supported or omit.
          // Checking docs: chat accepts maxTokens
          maxTokens: options.max_tokens,
        });

        return response.text;
      }

    case 'anthropic':
    case 'claude':
      if (!process.env.ANTHROPIC_API_KEY) {
        logger.warn('Anthropic API key not found, falling back to huggingface');
        return getAIClient('huggingface');
      }
      return {
        type: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
      };

    case 'gemini':
    case 'google':
      if (!process.env.GOOGLE_API_KEY) {
        logger.warn('Google API key not found, falling back to huggingface');
        return getAIClient('huggingface');
      }
      return {
        type: 'gemini',
        apiKey: process.env.GOOGLE_API_KEY,
      };

    case 'cohere':
      if (!process.env.COHERE_API_KEY) {
        logger.warn('Cohere API key not found, falling back to huggingface');
        return getAIClient('huggingface');
      }
      return {
        type: 'cohere',
        apiKey: process.env.COHERE_API_KEY,
      };

    default:
      logger.warn(`Unknown AI provider: ${provider}, falling back to huggingface`);
      return getAIClient('huggingface');
  }
}

const PROVIDER_PRIORITY = ['openai', 'gemini', 'anthropic', 'cohere', 'huggingface'];

/**
 * Generate text completion with robust fallback chain
 */
export async function generateCompletion(prompt, options = {}) {
  // Handle case where options are passed as first argument or part of first argument
  let actualPrompt = prompt;
  let actualOptions = options;

  if (typeof prompt === 'object' && prompt.prompt) {
    actualPrompt = prompt.prompt;
    actualOptions = { ...prompt, ...options };
  } else if (typeof prompt === 'object') {
    // Fallback if the whole object is passed as first argument but without 'prompt' key
    // This handles some edge cases in older calling patterns
    actualOptions = { ...prompt, ...options };
    actualPrompt = actualOptions.prompt || '';
  }

  const {
    model,
    temperature = 0.7,
    max_tokens = 2000,
    systemMessage,
    aiProvider, // Allow override
  } = actualOptions;

  // Determine starting provider
  let currentProvider = aiProvider || process.env.AI_PROVIDER || 'openai';

  // If explicitly requested provider fails, we might still want to fallback?
  // User said: "fallback to another ai and so on"

  // Create a list of providers to try, starting with the preferred one
  // Remove duplicates and filter by available keys
  const providersToTry = [
    currentProvider,
    ...PROVIDER_PRIORITY
  ].filter((p, index, self) => {
    // Unique check
    if (self.indexOf(p) !== index) return false;

    // Key check
    if (p === 'openai' && !process.env.OPENAI_API_KEY) return false;
    if (p === 'anthropic' && !process.env.ANTHROPIC_API_KEY) return false;
    if (p === 'gemini' && !process.env.GOOGLE_API_KEY) return false;
    if (p === 'cohere' && !process.env.COHERE_API_KEY) return false;
    // HuggingFace is always available (public fallback)
    return true;
  });

  let lastError;

  for (const provider of providersToTry) {
    try {
      const aiClient = getAIClient(provider);
      logger.info(`Attempting AI generation with provider: ${provider}`);

      switch (aiClient.type) {
        case 'openai':
          return await generateOpenAICompletion(aiClient.client, prompt, {
            model: model || 'gpt-4-turbo-preview',
            temperature,
            max_tokens,
            systemMessage,
          });

        case 'huggingface':
          return await generateHuggingFaceCompletion(aiClient, prompt, {
            model: 'mistralai/Mistral-7B-Instruct-v0.2', // Use standard model for fallback
            temperature,
            max_tokens,
          });

        case 'anthropic':
          return await generateAnthropicCompletion(aiClient, prompt, {
            model: model || 'claude-3-opus-20240229',
            temperature,
            max_tokens,
            systemMessage,
          });

        case 'gemini':
          return await generateGeminiCompletion(aiClient, prompt, {
            model: model || 'gemini-1.5-flash',
            temperature,
            max_tokens,
          });

        case 'cohere':
          return await generateCohereCompletion(aiClient, prompt, {
            model: model || 'command-r-08-2024',
            temperature,
            max_tokens,
          });

        default:
          throw new Error(`Unsupported AI provider type: ${aiClient.type}`);
      }
    } catch (error) {
      lastError = error;
      const msg = error.message || String(error);

      if (msg.includes('429') || msg.toLowerCase().includes('rate limit')) {
        logger.error(`AI provider ${provider} blocked: Rate Limit Reached (429)`);
      } else {
        logger.warn(`AI provider ${provider} failed: ${msg}`);
      }

      if (!msg.includes('429')) {
        console.warn(`[AI Service] ${provider} failed. Stack:`, error.stack);
        if (error.response) {
          console.warn(`[AI Service] Provider response:`, JSON.stringify(error.response.data || error.response));
        }
      }
    }
  }

  // If all failed
  logger.error('All AI providers failed');
  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
}

/**
 * OpenAI Completion
 */
async function generateOpenAICompletion(client, prompt, options) {
  const messages = [];

  if (options.systemMessage) {
    messages.push({
      role: 'system',
      content: options.systemMessage,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  const response = await client.chat.completions.create({
    model: options.model,
    messages,
    temperature: options.temperature,
    max_tokens: options.max_tokens,
  });

  return response.choices[0].message.content;
}

/**
 * Hugging Face Completion (FREE alternative)
 */
const generateHuggingFaceCompletion = async (aiClient, prompt, options = {}) => {
  const model = options.model || 'mistralai/Mistral-7B-Instruct-v0.2';
  // Use the Hugging Face Inference API router for better reliability and model access
  // Standard Hugging Face Inference API URL construction
  const url = `${aiClient.baseURL.endsWith('/') ? aiClient.baseURL : aiClient.baseURL + '/'}${model}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiClient.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        temperature: options.temperature,
        max_new_tokens: options.max_tokens,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const data = await response.json();

  // Handle array response
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }

  if (data.generated_text) {
    return data.generated_text;
  }

  return JSON.stringify(data);
};

/**
 * Anthropic Claude Completion
 */
async function generateAnthropicCompletion(client, prompt, options) {
  const { Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: client.apiKey });

  const messages = [{
    role: 'user',
    content: prompt,
  }];

  if (options.systemMessage) {
    messages.unshift({
      role: 'system',
      content: options.systemMessage,
    });
  }

  const response = await anthropic.messages.create({
    model: options.model,
    max_tokens: options.max_tokens,
    temperature: options.temperature,
    messages,
  });

  return response.content[0].text;
}

/**
 * Google Gemini Completion
 */
const generateGeminiCompletion = async (aiClient, prompt, options = {}) => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(aiClient.apiKey);
  // Default to gemini-1.5-flash which is more widely available/reliable than gemini-pro
  const model = genAI.getGenerativeModel({ model: options.model || 'gemini-1.5-flash' });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature,
      maxOutputTokens: options.max_tokens,
    },
  });

  return result.response.text();
}

/**
 * Cohere Completion
 */
async function generateCohereCompletion(client, prompt, options) {
  const { CohereClient } = await import('cohere-ai');
  const cohere = new CohereClient({ token: client.apiKey });

  const response = await cohere.chat({
    model: options.model,
    message: prompt,
    temperature: options.temperature,
    maxTokens: options.max_tokens,
  });

  return response.text;
}

/**
 * Generate embeddings for text
 */
export async function generateEmbedding(text) {
  const aiClient = getAIClient();

  try {
    switch (aiClient.type) {
      case 'openai':
        if (aiClient.client) {
          const response = await aiClient.client.embeddings.create({
            model: 'text-embedding-3-small', // Using small for efficiency and consistency
            input: text,
            dimensions: 1536, // Explicitly set dimensions
          });
          return response.data[0].embedding;
        }
        break;

      case 'huggingface':
        return await generateHuggingFaceEmbedding(aiClient, text);

      case 'cohere':
        return await generateCohereEmbedding(aiClient, text);

      default:
        // Fallback to Hugging Face embeddings
        const hfClient = getAIClient('huggingface');
        return await generateHuggingFaceEmbedding(hfClient, text);
    }
  } catch (error) {
    logger.error(`Embedding generation error (${aiClient.type}):`, error);

    // Fallback to Hugging Face
    if (aiClient.type !== 'huggingface') {
      try {
        const hfClient = getAIClient('huggingface');
        if (hfClient) {
          return await generateHuggingFaceEmbedding(hfClient, text);
        }
      } catch (fallbackError) {
        throw new Error(`Embedding generation failed: ${error.message}`);
      }
    }

    throw error;
  }
}

/**
 * Hugging Face Embeddings (FREE)
 */
async function generateHuggingFaceEmbedding(client, text) {
  const url = `${client.baseURL}/sentence-transformers/all-MiniLM-L6-v2`;

  // Truncate text for Hugging Face to avoid "too long" errors (max ~512 tokens)
  const truncatedText = text.substring(0, 2000);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${client.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: truncatedText }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face embedding error: ${response.statusText}`);
  }

  const data = await response.json();

  // Robust parsing: HF sometimes returns [{embedding: [...]}] or [[...]] or [...]
  if (Array.isArray(data)) {
    // If it's [[...]], return the first element
    if (Array.isArray(data[0])) return data[0].filter(n => typeof n === 'number');
    // If it's [...numbers], return it as is
    if (typeof data[0] === 'number') return data;
    // If it's [{embedding: ...}], check for that
    if (data[0].embedding) return data[0].embedding;
  }

  if (data.error && data.error.includes('loading')) {
    logger.warn(`HF Model loading, returning empty embedding: ${data.error}`);
    return new Array(384).fill(0);
  }

  throw new Error(`Invalid embedding response from HF: ${JSON.stringify(data).substring(0, 100)}`);
}

/**
 * Cohere Embeddings
 */
async function generateCohereEmbedding(client, text) {
  const { CohereClient } = await import('cohere-ai');
  const cohere = new CohereClient({ token: client.apiKey });

  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
  });

  return response.embeddings[0];
}

/**
 * Generate multiple embeddings in batch
 */
export async function generateEmbeddings(texts) {
  const embeddings = await Promise.all(
    texts.map(text => generateEmbedding(text))
  );
  return embeddings;
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(embedding1, embedding2) {
  // Ensure we have numeric arrays
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2)) {
    logger.error('Invalid embedding type for similarity:', {
      type1: typeof embedding1,
      isArr1: Array.isArray(embedding1),
      type2: typeof embedding2,
      isArr2: Array.isArray(embedding2)
    });
    return 0;
  }

  // Filter non-numeric values just in case
  const vec1 = embedding1.filter(n => typeof n === 'number');
  const vec2 = embedding2.filter(n => typeof n === 'number');

  if (vec1.length === 0 || vec2.length === 0) return 0;

  if (vec1.length !== vec2.length) {
    logger.warn(`Embedding length mismatch: ${vec1.length} vs ${vec2.length}. Truncating.`);
    const minLength = Math.min(vec1.length, vec2.length);
    const v1 = vec1.slice(0, minLength);
    const v2 = vec2.slice(0, minLength);
    return calculateActualSimilarity(v1, v2);
  }

  return calculateActualSimilarity(vec1, vec2);
}

function calculateActualSimilarity(v1, v2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    norm1 += v1[i] * v1[i];
    norm2 += v2[i] * v2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

export default {
  generateCompletion,
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
  getAIClient,
};

