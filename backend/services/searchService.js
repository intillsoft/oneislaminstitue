import axios from 'axios';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

export const searchService = {
    /**
     * Search the web for the given query
     * @param {string} query 
     * @returns {Promise<string>} Formatted search results
     */
    async search(query) {
        try {
            if (TAVILY_API_KEY) {
                return await this.searchTavily(query);
            } else if (SERPER_API_KEY) {
                return await this.searchSerper(query);
            } else {
                logger.warn('No Search API Key found. Web search disabled.');
                return null;
            }
        } catch (error) {
            logger.error('Search service error:', error);
            return null;
        }
    },

    async searchTavily(query) {
        try {
            const response = await axios.post('https://api.tavily.com/search', {
                api_key: TAVILY_API_KEY,
                query: query,
                search_depth: "basic",
                include_answer: true,
                max_results: 5
            });

            const results = response.data;
            let context = `Web Search Results for: "${query}"\n\n`;

            if (results.answer) {
                context += `Summary: ${results.answer}\n\n`;
            }

            if (results.results && results.results.length > 0) {
                context += "Sources:\n";
                results.results.forEach((res, i) => {
                    context += `${i + 1}. [${res.title}](${res.url}): ${res.content.substring(0, 150)}...\n`;
                });
            }

            return context;
        } catch (error) {
            logger.error('Tavily search error:', error);
            throw error;
        }
    },

    async searchSerper(query) {
        try {
            const response = await axios.post('https://google.serper.dev/search', {
                q: query,
                num: 5
            }, {
                headers: {
                    'X-API-KEY': SERPER_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            const results = response.data;
            let context = `Web Search Results for: "${query}"\n\n`;

            if (results.organic && results.organic.length > 0) {
                results.organic.forEach((res, i) => {
                    context += `${i + 1}. [${res.title}](${res.link}): ${res.snippet}\n`;
                });
            }

            return context;
        } catch (error) {
            logger.error('Serper search error:', error);
            throw error;
        }
    }
};
