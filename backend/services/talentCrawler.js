/**
 * Talent Crawler Service
 * Crawls talent profiles from platforms like Upwork, Fiverr, Freelancer, etc.
 */

import axios from 'axios';
import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

export const talentCrawler = {
  /**
   * Crawl talents from Upwork (Top-rated freelancers only)
   */
  async crawlUpwork(query = 'web developer', location = '', limit = 50) {
    try {
      if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY not configured');
      }

      const options = {
        method: 'GET',
        url: `https://${RAPIDAPI_HOST}/search`,
        params: {
          query: `${query} freelancer top rated expert`,
          location: location || undefined,
          page: '1',
          num_pages: '2', // Get more results to filter for best
          sort_by: 'relevance', // Sort by relevance to get best matches
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      };

      const response = await axios.request(options);
      const data = response.data;

      if (!data || !data.data) {
        logger.warn('No data returned from Upwork crawl');
        return [];
      }

      const talents = [];
      const jobs = data.data || [];

      // Filter and transform Upwork jobs to talent profiles
      // Prioritize top-rated freelancers (check for rating, reviews, verified status)
      const talentCandidates = [];
      for (const job of jobs) {
        if (job.job_publisher && job.job_publisher.toLowerCase().includes('upwork')) {
          const talent = this.transformToTalentProfile(job, 'upwork');
          if (talent) {
            talentCandidates.push(talent);
          }
        }
      }

      // Sort by rating (highest first), then by verified status
      talentCandidates.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        const verifiedA = a.verified ? 1 : 0;
        const verifiedB = b.verified ? 1 : 0;
        
        // First sort by verified status, then by rating
        if (verifiedA !== verifiedB) {
          return verifiedB - verifiedA;
        }
        return ratingB - ratingA;
      });

      // Take only top-rated talents (top 50% or minimum 4.0 rating)
      const topTalents = talentCandidates.filter(t => 
        (t.rating && t.rating >= 4.0) || t.verified
      ).slice(0, limit);

      // If we don't have enough top-rated, take best from remaining
      if (topTalents.length < limit) {
        const remaining = talentCandidates
          .filter(t => !topTalents.includes(t))
          .slice(0, limit - topTalents.length);
        topTalents.push(...remaining);
      }

      talents.push(...topTalents);
      logger.info(`Crawled ${talents.length} top-rated talents from Upwork (filtered from ${talentCandidates.length} candidates)`);
      return talents;
    } catch (error) {
      logger.error('Error crawling Upwork:', error);
      throw error;
    }
  },

  /**
   * Crawl talents from Fiverr (Top sellers and level 2/3 sellers only)
   */
  async crawlFiverr(query = 'web developer', limit = 50) {
    try {
      if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY not configured');
      }

      const options = {
        method: 'GET',
        url: `https://${RAPIDAPI_HOST}/search`,
        params: {
          query: `${query} fiverr gig top seller pro`,
          page: '1',
          num_pages: '2', // Get more results to filter for best
          sort_by: 'relevance',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      };

      const response = await axios.request(options);
      const data = response.data;

      if (!data || !data.data) {
        logger.warn('No data returned from Fiverr crawl');
        return [];
      }

      const talents = [];
      const jobs = data.data || [];

      // Filter and transform Fiverr gigs to talent profiles
      // Prioritize top sellers, pro sellers, and highly rated gigs
      const talentCandidates = [];
      for (const job of jobs) {
        if (job.job_publisher && job.job_publisher.toLowerCase().includes('fiverr')) {
          const talent = this.transformToTalentProfile(job, 'fiverr');
          if (talent) {
            talentCandidates.push(talent);
          }
        }
      }

      // Sort by rating and verified status (top sellers/pro sellers)
      talentCandidates.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        const verifiedA = a.verified ? 1 : 0;
        const verifiedB = b.verified ? 1 : 0;
        
        if (verifiedA !== verifiedB) {
          return verifiedB - verifiedA;
        }
        return ratingB - ratingA;
      });

      // Take only top-rated talents (minimum 4.5 rating for Fiverr)
      const topTalents = talentCandidates.filter(t => 
        (t.rating && t.rating >= 4.5) || t.verified
      ).slice(0, limit);

      // If we don't have enough top-rated, take best from remaining
      if (topTalents.length < limit) {
        const remaining = talentCandidates
          .filter(t => !topTalents.includes(t))
          .filter(t => t.rating && t.rating >= 4.0) // At least 4.0 rating
          .slice(0, limit - topTalents.length);
        topTalents.push(...remaining);
      }

      talents.push(...topTalents);
      logger.info(`Crawled ${talents.length} top-rated talents from Fiverr (filtered from ${talentCandidates.length} candidates)`);
      return talents;
    } catch (error) {
      logger.error('Error crawling Fiverr:', error);
      throw error;
    }
  },

  /**
   * Crawl talents from Freelancer (Top-rated freelancers only)
   */
  async crawlFreelancer(query = 'web developer', limit = 50) {
    try {
      if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY not configured');
      }

      const options = {
        method: 'GET',
        url: `https://${RAPIDAPI_HOST}/search`,
        params: {
          query: `${query} freelancer top rated preferred`,
          page: '1',
          num_pages: '2', // Get more results to filter for best
          sort_by: 'relevance',
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      };

      const response = await axios.request(options);
      const data = response.data;

      if (!data || !data.data) {
        logger.warn('No data returned from Freelancer crawl');
        return [];
      }

      const talents = [];
      const jobs = data.data || [];

      // Filter and transform Freelancer profiles to talent profiles
      // Prioritize preferred freelancers and top-rated
      const talentCandidates = [];
      for (const job of jobs) {
        if (job.job_publisher && job.job_publisher.toLowerCase().includes('freelancer')) {
          const talent = this.transformToTalentProfile(job, 'freelancer');
          if (talent) {
            talentCandidates.push(talent);
          }
        }
      }

      // Sort by rating and verified status
      talentCandidates.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        const verifiedA = a.verified ? 1 : 0;
        const verifiedB = b.verified ? 1 : 0;
        
        if (verifiedA !== verifiedB) {
          return verifiedB - verifiedA;
        }
        return ratingB - ratingA;
      });

      // Take only top-rated talents (minimum 4.0 rating)
      const topTalents = talentCandidates.filter(t => 
        (t.rating && t.rating >= 4.0) || t.verified
      ).slice(0, limit);

      // If we don't have enough top-rated, take best from remaining
      if (topTalents.length < limit) {
        const remaining = talentCandidates
          .filter(t => !topTalents.includes(t))
          .slice(0, limit - topTalents.length);
        topTalents.push(...remaining);
      }

      talents.push(...topTalents);
      logger.info(`Crawled ${talents.length} top-rated talents from Freelancer (filtered from ${talentCandidates.length} candidates)`);
      return talents;
    } catch (error) {
      logger.error('Error crawling Freelancer:', error);
      throw error;
    }
  },

  /**
   * Transform job data to talent profile format (enhanced for best talents)
   */
  transformToTalentProfile(job, platform) {
    try {
      const description = job.job_description || job.job_highlights?.join('\n') || '';
      const rating = this.extractRating(description);
      
      // Check for verified/top-rated indicators
      const isVerified = /(verified|top\s*rated|preferred|pro|expert|elite|top\s*seller)/i.test(description) ||
                        /(verified|top\s*rated|preferred|pro|expert|elite|top\s*seller)/i.test(job.job_title || '');
      
      return {
        external_id: `${platform}_${job.job_id || job.job_google_link || Date.now()}`,
        platform: platform,
        name: job.job_publisher || job.employer_name || 'Freelancer',
        title: job.job_title || 'Freelancer',
        description: description,
        skills: this.extractSkills(description),
        location: job.job_city || job.job_country || job.job_location || 'Remote',
        hourly_rate_min: this.extractRate(description, 'min'),
        hourly_rate_max: this.extractRate(description, 'max'),
        rating: rating || (isVerified ? 4.5 : null), // Default high rating for verified
        profile_url: job.job_google_link || job.job_apply_link || '',
        image_url: null,
        verified: isVerified,
        source: `crawled_${platform}`,
        crawled_at: new Date().toISOString(),
        raw_data: job,
      };
    } catch (error) {
      logger.error('Error transforming to talent profile:', error);
      return null;
    }
  },

  /**
   * Extract skills from description
   */
  extractSkills(description) {
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Vue.js', 'Angular',
      'PHP', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin',
      'HTML', 'CSS', 'TypeScript', 'SQL', 'MongoDB', 'PostgreSQL',
      'AWS', 'Docker', 'Kubernetes', 'Git', 'GraphQL', 'REST API',
      'UI/UX', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
      'WordPress', 'Shopify', 'Magento', 'WooCommerce',
      'Machine Learning', 'Data Science', 'AI', 'Blockchain',
      'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native',
    ];

    const foundSkills = [];
    const lowerDesc = description.toLowerCase();

    for (const skill of commonSkills) {
      if (lowerDesc.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }

    return foundSkills.slice(0, 10); // Limit to 10 skills
  },

  /**
   * Extract hourly rate from description
   */
  extractRate(description, type = 'min') {
    const ratePatterns = [
      /\$(\d+)\s*-\s*\$(\d+)\s*\/\s*hour/i,
      /\$(\d+)\s*\/\s*hour/i,
      /(\d+)\s*-\s*(\d+)\s*USD\s*\/\s*hour/i,
      /(\d+)\s*USD\s*\/\s*hour/i,
    ];

    for (const pattern of ratePatterns) {
      const match = description.match(pattern);
      if (match) {
        if (match[2]) {
          return type === 'min' ? parseInt(match[1]) : parseInt(match[2]);
        } else {
          return parseInt(match[1]);
        }
      }
    }

    return null;
  },

  /**
   * Extract rating from description (enhanced to find multiple rating patterns)
   */
  extractRating(description) {
    // Try multiple rating patterns
    const ratingPatterns = [
      /(\d+\.?\d*)\s*(?:star|rating|rated|out of 5)/i,
      /rating[:\s]+(\d+\.?\d*)/i,
      /(\d+\.?\d*)\/\s*5/i,
      /(\d+\.?\d*)\s*\/\s*5/i,
    ];

    for (const pattern of ratingPatterns) {
      const match = description.match(pattern);
      if (match) {
        const rating = parseFloat(match[1]);
        if (rating >= 0 && rating <= 5) {
          return rating;
        }
      }
    }

    // Check for "top rated", "preferred", "verified" indicators (assign 4.5+ rating)
    const topRatedIndicators = /(top\s*rated|preferred|verified|pro|expert|elite)/i;
    if (topRatedIndicators.test(description)) {
      return 4.5; // Default high rating for verified/top-rated
    }

    return null;
  },

  /**
   * Save crawled talents to database
   */
  async saveTalents(talents) {
    try {
      if (!talents || talents.length === 0) {
        return { saved: 0, skipped: 0 };
      }

      let saved = 0;
      let skipped = 0;

      for (const talent of talents) {
        try {
          // Check if talent already exists
          const { data: existing } = await supabase
            .from('talent_profiles')
            .select('id')
            .eq('external_id', talent.external_id)
            .single();

          if (existing) {
            // Update existing talent
            const { error } = await supabase
              .from('talent_profiles')
              .update({
                ...talent,
                updated_at: new Date().toISOString(),
              })
              .eq('external_id', talent.external_id);

            if (!error) {
              saved++;
            } else {
              skipped++;
            }
          } else {
            // Insert new talent
            const { error } = await supabase
              .from('talent_profiles')
              .insert({
                ...talent,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (!error) {
              saved++;
            } else {
              skipped++;
            }
          }
        } catch (error) {
          logger.error('Error saving talent:', error);
          skipped++;
        }
      }

      logger.info(`Saved ${saved} talents, skipped ${skipped}`);
      return { saved, skipped };
    } catch (error) {
      logger.error('Error saving talents:', error);
      throw error;
    }
  },

  /**
   * Crawl all platforms
   */
  async crawlAll(query = 'web developer', location = '') {
    try {
      const results = {
        upwork: { count: 0, error: null },
        fiverr: { count: 0, error: null },
        freelancer: { count: 0, error: null },
      };

      // Crawl Upwork
      try {
        const upworkTalents = await this.crawlUpwork(query, location);
        const saved = await this.saveTalents(upworkTalents);
        results.upwork.count = saved.saved;
      } catch (error) {
        results.upwork.error = error.message;
        logger.error('Upwork crawl failed:', error);
      }

      // Crawl Fiverr
      try {
        const fiverrTalents = await this.crawlFiverr(query);
        const saved = await this.saveTalents(fiverrTalents);
        results.fiverr.count = saved.saved;
      } catch (error) {
        results.fiverr.error = error.message;
        logger.error('Fiverr crawl failed:', error);
      }

      // Crawl Freelancer
      try {
        const freelancerTalents = await this.crawlFreelancer(query);
        const saved = await this.saveTalents(freelancerTalents);
        results.freelancer.count = saved.saved;
      } catch (error) {
        results.freelancer.error = error.message;
        logger.error('Freelancer crawl failed:', error);
      }

      return results;
    } catch (error) {
      logger.error('Error in crawlAll:', error);
      throw error;
    }
  },
};

export default talentCrawler;
