/**
 * Rate Limiter Utility
 * Implements random delays between requests to avoid detection
 */

export class RateLimiter {
  constructor(minDelay = 2000, maxDelay = 5000) {
    this.minDelay = parseInt(process.env.RATE_LIMIT_DELAY_MIN) || minDelay;
    this.maxDelay = parseInt(process.env.RATE_LIMIT_DELAY_MAX) || maxDelay;
  }

  /**
   * Get a random delay between min and max
   */
  getRandomDelay() {
    return Math.floor(
      Math.random() * (this.maxDelay - this.minDelay + 1) + this.minDelay
    );
  }

  /**
   * Wait for a random amount of time
   */
  async wait() {
    const delay = this.getRandomDelay();
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Wait with exponential backoff on retries
   */
  async waitWithBackoff(retryCount, baseDelay = 1000) {
    const delay = baseDelay * Math.pow(2, retryCount);
    const jitter = Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay + jitter));
  }
}

export default new RateLimiter();

