/**
 * Job Crawler Service
 * Crawls jobs from external platforms (LinkedIn, Glassdoor, Indeed)
 * Supports both API and scraping methods
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import axios from 'axios';
import jobCrawlerJSearch from './jobCrawlerJSearch.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('❌ jobCrawler: SUPABASE CREDENTIALS MISSING!');
}

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// API Keys (set in environment variables)
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
const INDEED_API_KEY = process.env.INDEED_API_KEY;

/**
 * Crawl jobs from LinkedIn using RapidAPI or direct API
 */
async function crawlLinkedInJobs(keywords = 'software engineer', location = 'United States', limit = 50) {
  try {
    logger.info(`Crawling LinkedIn jobs: ${keywords} in ${location}`);

    const jobs = [];

    // Option 1: Use RapidAPI LinkedIn Jobs API
    if (RAPIDAPI_KEY) {
      try {
        const response = await axios.get('https://linkedin-jobs-search.p.rapidapi.com/', {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
          },
          params: {
            keywords: keywords,
            location: location,
            page: 1,
            limit: limit
          },
          timeout: 30000
        });

        if (response.data && response.data.jobs) {
          response.data.jobs.forEach(job => {
            jobs.push({
              title: job.title || job.jobTitle,
              company: job.company || job.companyName,
              location: job.location || location,
              description: job.description || job.summary || '',
              source: 'linkedin',
              url: job.url || job.jobUrl || `https://www.linkedin.com/jobs/view/${job.jobId || Date.now()}`,
              salary: job.salary || null,
              salary_min: job.salaryMin || null,
              salary_max: job.salaryMax || null,
              job_type: mapJobType(job.jobType || job.employmentType),
              experience_level: mapExperienceLevel(job.experienceLevel),
              remote: mapRemoteType(job.remoteType || job.workType),
              scraped_at: new Date().toISOString(),
            });
          });
        }
      } catch (apiError) {
        logger.warn('RapidAPI LinkedIn failed, trying alternative:', apiError.message);
        if (isForbiddenError(apiError)) {
          logger.info('403 detected for LinkedIn, triggering JSearch fallback');
          const fallbackJobs = await fallbackToJSearch('LinkedIn', keywords, location, limit);
          if (fallbackJobs.length > 0) return fallbackJobs;
        }
      }
    }

    // Option 2: Use LinkedIn Official API (if available)
    if (LINKEDIN_API_KEY && jobs.length === 0) {
      try {
        const response = await axios.get('https://api.linkedin.com/v2/jobSearch', {
          headers: {
            'Authorization': `Bearer ${LINKEDIN_API_KEY}`,
            'Content-Type': 'application/json'
          },
          params: {
            keywords: keywords,
            locationName: location,
            count: limit
          },
          timeout: 30000
        });

        if (response.data && response.data.elements) {
          response.data.elements.forEach(job => {
            jobs.push({
              title: job.title?.text || '',
              company: job.companyDetails?.company || '',
              location: job.formattedLocation || location,
              description: job.description?.text || '',
              source: 'linkedin',
              url: job.url || `https://www.linkedin.com/jobs/view/${job.entityUrn?.split(':').pop()}`,
              salary: job.salaryRange?.text || null,
              job_type: mapJobType(job.jobType),
              experience_level: mapExperienceLevel(job.experienceLevel),
              remote: mapRemoteType(job.workplaceTypes?.[0]),
              scraped_at: new Date().toISOString(),
            });
          });
        }
      } catch (apiError) {
        logger.warn('LinkedIn Official API failed:', apiError.message);
      }
    }

    // Fallback: Return empty array if no API available
    if (jobs.length === 0) {
      logger.warn('No LinkedIn API configured, returning empty results');
    }

    return jobs;
  } catch (error) {
    logger.error('LinkedIn crawling error:', error);
    throw error;
  }
}

/**
 * Crawl jobs from Glassdoor using RapidAPI
 */
async function crawlGlassdoorJobs(keywords = 'software engineer', location = 'United States', limit = 50) {
  try {
    logger.info(`Crawling Glassdoor jobs: ${keywords} in ${location}`);

    const jobs = [];

    if (RAPIDAPI_KEY) {
      try {
        const response = await axios.get('https://glassdoor-api.p.rapidapi.com/jobs', {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'glassdoor-api.p.rapidapi.com'
          },
          params: {
            keyword: keywords,
            location: location,
            page: 1,
            limit: limit
          },
          timeout: 30000
        });

        if (response.data && response.data.jobs) {
          response.data.jobs.forEach(job => {
            jobs.push({
              title: job.jobTitle || job.title,
              company: job.employerName || job.company,
              location: job.location || location,
              description: job.jobDescription || job.description || '',
              source: 'glassdoor',
              url: job.jobUrl || job.url || `https://www.glassdoor.com/job-listing/${job.jobId || Date.now()}`,
              salary: job.salary || job.salaryText || null,
              salary_min: parseSalary(job.salary, 'min'),
              salary_max: parseSalary(job.salary, 'max'),
              job_type: mapJobType(job.jobType),
              experience_level: mapExperienceLevel(job.experienceLevel),
              remote: mapRemoteType(job.workplaceType),
              scraped_at: new Date().toISOString(),
            });
          });
        }
      } catch (apiError) {
        logger.warn('Glassdoor API failed:', apiError.message);
        if (isForbiddenError(apiError)) {
          logger.info('403 detected for Glassdoor, triggering JSearch fallback');
          const fallbackJobs = await fallbackToJSearch('Glassdoor', keywords, location, limit);
          if (fallbackJobs.length > 0) return fallbackJobs;
        }
      }
    }

    return jobs;
  } catch (error) {
    logger.error('Glassdoor crawling error:', error);
    throw error;
  }
}

/**
 * Crawl jobs from Indeed using RapidAPI or Indeed API
 */
async function crawlIndeedJobs(keywords = 'software engineer', location = 'United States', limit = 50) {
  try {
    logger.info(`Crawling Indeed jobs: ${keywords} in ${location}`);

    const jobs = [];

    // Option 1: Use RapidAPI Indeed API
    if (RAPIDAPI_KEY) {
      try {
        const response = await axios.get('https://indeed11.p.rapidapi.com/', {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'indeed11.p.rapidapi.com'
          },
          params: {
            query: keywords,
            location: location,
            page: 1,
            limit: limit
          },
          timeout: 30000
        });

        if (response.data && response.data.results) {
          response.data.results.forEach(job => {
            jobs.push({
              title: job.jobtitle || job.title,
              company: job.company || job.companyName,
              location: job.formattedLocation || job.location || location,
              description: job.snippet || job.summary || '',
              source: 'indeed',
              url: job.url || job.jobkey ? `https://www.indeed.com/viewjob?jk=${job.jobkey}` : `https://www.indeed.com/jobs?q=${encodeURIComponent(keywords)}`,
              salary: job.salary || null,
              salary_min: parseSalary(job.salary, 'min'),
              salary_max: parseSalary(job.salary, 'max'),
              job_type: mapJobType(job.jobType),
              experience_level: mapExperienceLevel(job.experienceLevel),
              remote: job.remote ? 'remote' : 'on-site',
              scraped_at: new Date().toISOString(),
            });
          });
        }
      } catch (apiError) {
        logger.warn('RapidAPI Indeed failed:', apiError.message);
        if (isForbiddenError(apiError)) {
          logger.info('403 detected for Indeed, triggering JSearch fallback');
          const fallbackJobs = await fallbackToJSearch('Indeed', keywords, location, limit);
          if (fallbackJobs.length > 0) return fallbackJobs;
        }
      }
    }

    // Option 2: Use Indeed Publisher API (if available)
    if (INDEED_API_KEY && jobs.length === 0) {
      try {
        const response = await axios.get('https://api.indeed.com/ads/apisearch', {
          params: {
            publisher: INDEED_API_KEY,
            q: keywords,
            l: location,
            limit: limit,
            format: 'json',
            v: '2'
          },
          timeout: 30000
        });

        if (response.data && response.data.results) {
          response.data.results.forEach(job => {
            jobs.push({
              title: job.jobtitle,
              company: job.company,
              location: job.formattedLocation || job.location,
              description: job.snippet || '',
              source: 'indeed',
              url: job.url || `https://www.indeed.com/viewjob?jk=${job.jobkey}`,
              salary: job.salary || null,
              job_type: mapJobType(job.jobtype),
              experience_level: mapExperienceLevel(job.experienceLevel),
              remote: job.remote ? 'remote' : 'on-site',
              scraped_at: new Date().toISOString(),
            });
          });
        }
      } catch (apiError) {
        logger.warn('Indeed Publisher API failed:', apiError.message);
      }
    }

    return jobs;
  } catch (error) {
    logger.error('Indeed crawling error:', error);
    throw error;
  }
}

/**
 * Helper: Map job type to standard format
 */
function mapJobType(type) {
  if (!type) return 'full-time';
  const lower = type.toLowerCase();
  if (lower.includes('full') || lower === 'fulltime') return 'full-time';
  if (lower.includes('part') || lower === 'parttime') return 'part-time';
  if (lower.includes('contract')) return 'contract';
  if (lower.includes('freelance')) return 'freelance';
  if (lower.includes('intern')) return 'internship';
  return 'full-time';
}

/**
 * Helper: Map experience level
 */
function mapExperienceLevel(level) {
  if (!level) return 'mid';
  const lower = level.toLowerCase();
  if (lower.includes('entry') || lower.includes('junior') || lower.includes('associate')) return 'entry';
  if (lower.includes('senior') || lower.includes('lead') || lower.includes('principal')) return 'senior';
  if (lower.includes('exec') || lower.includes('director') || lower.includes('vp')) return 'executive';
  return 'mid';
}

/**
 * Helper: Map remote type
 */
function mapRemoteType(type) {
  if (!type) return 'on-site';
  const lower = String(type).toLowerCase();
  if (lower.includes('remote') || lower === 'remote') return 'remote';
  if (lower.includes('hybrid')) return 'hybrid';
  return 'on-site';
}

/**
 * Helper: Parse salary string to min/max
 */
function parseSalary(salary, type = 'min') {
  if (!salary) return null;
  const str = String(salary).replace(/[^0-9-]/g, '');
  const parts = str.split('-');
  if (parts.length === 2) {
    return type === 'min' ? parseFloat(parts[0]) : parseFloat(parts[1]);
  }
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

/**
 * Improved deduplication: Check by URL, title+company, or title+location
 */
async function findDuplicateJob(job) {
  try {
    // Check by URL (most reliable)
    if (job.url) {
      const { data: byUrl } = await supabase
        .from('jobs')
        .select('id, url')
        .eq('url', job.url)
        .limit(1)
        .single();

      if (byUrl) return byUrl.id;
    }

    // Check by title + company (fuzzy match)
    if (job.title && job.company) {
      const { data: byTitleCompany } = await supabase
        .from('jobs')
        .select('id, title, company')
        .ilike('title', `%${job.title.substring(0, 50)}%`)
        .ilike('company', `%${job.company.substring(0, 50)}%`)
        .limit(1)
        .single();

      if (byTitleCompany) {
        // Calculate similarity
        const titleSimilarity = calculateSimilarity(
          job.title.toLowerCase(),
          byTitleCompany.title.toLowerCase()
        );
        const companySimilarity = calculateSimilarity(
          job.company.toLowerCase(),
          byTitleCompany.company.toLowerCase()
        );

        // If both are > 80% similar, consider it a duplicate
        if (titleSimilarity > 0.8 && companySimilarity > 0.8) {
          return byTitleCompany.id;
        }
      }
    }

    return null;
  } catch (error) {
    logger.error('Error finding duplicate job:', error);
    return null;
  }
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

/**
 * Save jobs to database with improved deduplication
 */
async function saveJobs(jobs) {
  try {
    let inserted = 0;
    let skipped = 0;
    let updated = 0;

    for (const job of jobs) {
      try {
        // Check for duplicates
        const duplicateId = await findDuplicateJob(job);

        if (duplicateId) {
          // Update existing job if it's from a different source or newer
          const { data: existing } = await supabase
            .from('jobs')
            .select('source, scraped_at')
            .eq('id', duplicateId)
            .single();

          if (existing && (
            existing.source !== job.source ||
            (existing.scraped_at && new Date(job.scraped_at) > new Date(existing.scraped_at))
          )) {
            // Update the job
            const { error: updateError } = await supabase
              .from('jobs')
              .update({
                description: job.description || existing.description,
                salary: job.salary || existing.salary,
                salary_min: job.salary_min || existing.salary_min,
                salary_max: job.salary_max || existing.salary_max,
                scraped_at: job.scraped_at,
                updated_at: new Date().toISOString(),
              })
              .eq('id', duplicateId);

            if (!updateError) {
              updated++;
            }
          } else {
            skipped++;
          }
          continue;
        }

        // Insert new job
        const jobData = {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          source: job.source,
          url: job.url,
          salary: job.salary,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          job_type: job.job_type || 'full-time',
          experience_level: job.experience_level || 'mid',
          remote: job.remote || 'on-site',
          scraped_at: job.scraped_at,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('jobs')
          .insert(jobData)
          .select()
          .single();

        if (error) {
          logger.error(`Error inserting job ${job.title}:`, error);
          skipped++;
        } else {
          inserted++;
        }
      } catch (jobError) {
        logger.error(`Error processing job ${job.title}:`, jobError);
        skipped++;
      }
    }

    logger.info(`Job save complete: ${inserted} inserted, ${updated} updated, ${skipped} skipped`);
    return { inserted, updated, skipped };
  } catch (error) {
    logger.error('Error saving jobs:', error);
    throw error;
  }
}

/**
 * Main crawl function - crawls from all sources
 */
export async function crawlJobs(options = {}) {
  const {
    keywords = 'software engineer',
    location = 'United States',
    sources = ['jsearch', 'linkedin', 'glassdoor', 'indeed'],
    limit = 50,
  } = options;

  try {
    logger.info(`Starting job crawl: ${keywords} in ${location} from ${sources.join(', ')}`);

    const allJobs = [];

    // Crawl from each source
    for (const source of sources) {
      try {
        let jobs = [];
        try {
          switch (source.toLowerCase()) {
            case 'jsearch':
              jobs = await jobCrawlerJSearch.searchJobs(keywords, { location, limit });
              break;
            case 'linkedin':
              jobs = await crawlLinkedInJobs(keywords, location, limit);
              break;
            case 'glassdoor':
              jobs = await crawlGlassdoorJobs(keywords, location, limit);
              break;
            case 'indeed':
              jobs = await crawlIndeedJobs(keywords, location, limit);
              break;
            case 'monster':
            case 'ziprecruiter':
            case 'simplyhired':
            case 'dice':
            case 'careerbuilder':
              // Use JSearch fallback for these new platforms
              jobs = await fallbackToJSearch(source, keywords, location, limit);
              break;
            default:
              logger.warn(`Unknown source: ${source}`);
          }
        } catch (sourceError) {
          // PROACTIVE FALLBACK: If LinkedIn/Indeed/Glassdoor 403s/429s, try JSearch
          const isErrorRequiringFallback = isForbiddenError(sourceError) ||
            sourceError.message?.includes('429') ||
            sourceError.message?.includes('Too Many Requests');

          if (isErrorRequiringFallback && source.toLowerCase() !== 'jsearch') {
            logger.info(`Source ${source} failed with error mapping to fallback. Using JSearch for "${keywords}" in "${location}"...`);
            jobs = await fallbackToJSearch(source, keywords, location, limit);
          } else {
            throw sourceError;
          }
        }
        allJobs.push(...jobs);

        // Increased rate limiting between sources (from 2s to 5s)
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        logger.error(`Error crawling from ${source}:`, error);
      }
    }

    // Save all jobs with improved deduplication
    const result = await saveJobs(allJobs);

    return {
      success: true,
      totalFound: allJobs.length,
      inserted: result.inserted,
      updated: result.updated,
      skipped: result.skipped,
      sources: sources,
    };
  } catch (error) {
    logger.error('Job crawling error:', error);
    throw error;
  }
}

/**
 * Schedule periodic job crawling
 */
export async function scheduleJobCrawl() {
  const commonKeywords = [
    'software engineer', 'full stack developer', 'frontend engineer', 'backend developer',
    'data scientist', 'machine learning', 'artificial intelligence', 'data analyst',
    'product manager', 'project manager', 'business analyst',
    'ui/ux designer', 'product designer', 'graphic designer',
    'marketing manager', 'digital marketing', 'content writer', 'social media',
    'sales manager', 'account executive', 'customer success',
    'teacher', 'education technology', 'curriculum designer', 'tutor',
    'human resources', 'recruiter', 'operations manager',
    'financial analyst', 'accountant', 'legal counsel',
    'civil engineer', 'mechanical engineer', 'electrician',
    'customer service', 'receptionist', 'administrative assistant',
    'nurse', 'healthcare assistant', 'physician',
    'construction manager', 'logistics coordinator', 'warehouse associate'
  ];

  const locations = [
    'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
    'Australia', 'India', 'Singapore', 'Japan', 'Remote',
    'Netherlands', 'Sweden', 'United Arab Emirates', 'Brazil',
    'Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Egypt',
    'Mexico', 'Spain', 'Italy', 'Switzerland', 'Norway'
  ];

  // Helper to shuffle array
  const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

  try {
    let totalInserted = 0;
    let totalSkipped = 0;

    // Pick 8 random keywords and 5 random locations for variety in each run
    const randomKeywords = shuffle(commonKeywords).slice(0, 8);
    const randomLocations = shuffle(locations).slice(0, 5);

    logger.info(`Starting randomized scheduled crawl with keywords: [${randomKeywords.join(', ')}] across [${randomLocations.join(', ')}]`);

    for (const keyword of randomKeywords) {
      for (const location of randomLocations) {
        try {
          logger.info(`Crawling for "${keyword}" in "${location}"...`);
          const result = await crawlJobs({
            keywords: keyword,
            location: location,
            sources: ['jsearch', 'linkedin', 'glassdoor', 'indeed'], // Added jsearch as primary
            limit: 20,
          });

          totalInserted += result.inserted || 0;
          totalSkipped += result.skipped || 0;

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
          logger.error(`Error crawling ${keyword} in ${location}:`, error);
        }
      }
    }

    logger.info(`Scheduled job crawl completed: ${totalInserted} inserted, ${totalSkipped} skipped`);
    return { inserted: totalInserted, skipped: totalSkipped };
  } catch (error) {
    logger.error('Scheduled job crawl error:', error);
    throw error;
  }
}

/**
 * Helper: Detect if an error is a 403 Forbidden (common for scraper APIs)
 */
function isForbiddenError(error) {
  if (!error) return false;
  const status = error.response?.status;
  const message = (error.message || '').toLowerCase();
  return status === 403 || message.includes('403') || message.includes('forbidden');
}

/**
 * Helper: Run a platform-specific search through JSearch as a fallback
 */
async function fallbackToJSearch(platform, keywords, location, limit) {
  logger.info(`Attempting JSearch fallback for ${platform}: ${keywords} in ${location}`);
  try {
    // We add the platform to the query to help JSearch focus
    const query = `${keywords} on ${platform}`;
    const jobs = await jobCrawlerJSearch.searchJobs(query, { location, limit });

    // Tag these jobs as coming from the original platform (via JSearch) for UI consistency
    return jobs.map(j => ({ ...j, source: platform || j.source || 'External Site' }));
  } catch (error) {
    logger.error(`JSearch fallback failed for ${platform}:`, error.message);
    return [];
  }
}

export default {
  crawlJobs,
  scheduleJobCrawl,
  crawlLinkedInJobs,
  crawlGlassdoorJobs,
  crawlIndeedJobs,
};
