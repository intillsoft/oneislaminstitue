/**
 * Proxy Rotator Utility
 * Manages proxy rotation for requests
 */

export class ProxyRotator {
  constructor() {
    this.proxies = this.loadProxies();
    this.currentIndex = 0;
    this.useProxy = process.env.USE_PROXY === 'true';
  }

  /**
   * Load proxies from environment variable
   */
  loadProxies() {
    const proxyList = process.env.PROXY_LIST || '';
    if (!proxyList) return [];
    
    return proxyList.split(',').map(proxy => proxy.trim()).filter(Boolean);
  }

  /**
   * Get next proxy in rotation
   */
  getNextProxy() {
    if (!this.useProxy || this.proxies.length === 0) {
      return null;
    }

    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return proxy;
  }

  /**
   * Get current proxy
   */
  getCurrentProxy() {
    if (!this.useProxy || this.proxies.length === 0) {
      return null;
    }
    return this.proxies[this.currentIndex];
  }

  /**
   * Configure Puppeteer browser with proxy
   */
  async configureBrowser(browserOptions = {}) {
    const proxy = this.getNextProxy();
    
    if (!proxy) {
      return browserOptions;
    }

    const [host, port] = proxy.replace('http://', '').split(':');
    
    return {
      ...browserOptions,
      args: [
        ...(browserOptions.args || []),
        `--proxy-server=http://${host}:${port}`
      ]
    };
  }
}

export default new ProxyRotator();

