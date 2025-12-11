/**
 * Anti-Bot Detection Utilities
 * Helps avoid detection by mimicking human behavior
 */

import UserAgent from 'user-agents';

const userAgentGenerator = new UserAgent();

/**
 * Get a random user agent
 */
export function getRandomUserAgent() {
  return userAgentGenerator.toString();
}

/**
 * Configure Puppeteer with anti-bot measures
 */
export function getAntiBotConfig() {
  return {
    headless: process.env.HEADLESS !== 'false',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
    ],
    ignoreHTTPSErrors: true,
  };
}

/**
 * Add human-like delays and mouse movements
 */
export async function humanizePage(page) {
  // Set random viewport
  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 1080 + Math.floor(Math.random() * 100),
  });

  // Set random user agent
  await page.setUserAgent(getRandomUserAgent());

  // Override webdriver property
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  // Override plugins
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
  });

  // Override languages
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });

  // Override permissions
  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  });
}

/**
 * Simulate human mouse movement
 */
export async function simulateMouseMovement(page) {
  await page.mouse.move(
    Math.random() * 1000,
    Math.random() * 1000,
    { steps: 10 }
  );
}

/**
 * Random delay between actions
 */
export async function randomDelay(min = 500, max = 2000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

