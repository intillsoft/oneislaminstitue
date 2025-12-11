/**
 * Retry Utility with exponential backoff
 */

import logger from './logger.js';

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff(
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  context = 'operation'
) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const retryCount = attempt + 1;
      
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(
          `${context} failed (attempt ${retryCount}/${maxRetries}). Retrying in ${delay}ms...`,
          { error: error.message }
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        logger.error(
          `${context} failed after ${maxRetries} attempts`,
          { error: error.message, stack: error.stack }
        );
      }
    }
  }
  
  throw lastError;
}

/**
 * Retry with custom condition
 */
export async function retryUntil(
  fn,
  condition,
  maxRetries = 10,
  delay = 1000
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await fn();
    if (condition(result)) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error(`Condition not met after ${maxRetries} attempts`);
}

