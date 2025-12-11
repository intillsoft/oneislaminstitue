/**
 * Salary Intelligence Service
 * Aggregates salary data and provides ML-based predictions
 */

import { generateCompletion } from './openaiService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Predict salary range
 */
export async function predictSalary(jobTitle, location, experience, industry, skills = []) {
  try {
    // Aggregate data from multiple sources
    const aggregatedData = await aggregateSalaryData(jobTitle, location, experience, industry);

    // Apply ML-based adjustments
    const predictions = await generateMLPrediction({
      jobTitle,
      location,
      experience,
      industry,
      skills,
      baseData: aggregatedData,
    });

    // Generate confidence score
    const confidence = calculateConfidence(aggregatedData, predictions);

    return {
      job_title: jobTitle,
      location,
      experience_level: experience,
      industry,
      salary_range: {
        min: predictions.min,
        max: predictions.max,
        median: predictions.median,
        percentiles: {
          p25: predictions.p25,
          p75: predictions.p75,
          p90: predictions.p90,
        },
      },
      confidence_score: confidence,
      market_trends: await getMarketTrends(jobTitle, location),
      negotiation_tips: await generateNegotiationTips(predictions, location, experience),
      data_sources: aggregatedData.sources,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Salary prediction error:', error);
    throw error;
  }
}

/**
 * Aggregate salary data from multiple sources
 */
async function aggregateSalaryData(jobTitle, location, experience, industry) {
  // Check database cache first
  const cacheKey = `${jobTitle}_${location}_${experience}_${industry}`.toLowerCase();

  const { data: cached } = await supabase
    .from('salary_cache')
    .select('*')
    .eq('cache_key', cacheKey)
    .single();

  if (cached && isCacheValid(cached.created_at)) {
    return cached.data;
  }

  // Aggregate from multiple sources (simulated - in production, call real APIs)
  const sources = {
    glassdoor: await getGlassdoorData(jobTitle, location),
    payscale: await getPayscaleData(jobTitle, location, experience),
    indeed: await getIndeedData(jobTitle, location, industry),
    user_reports: await getUserReports(jobTitle, location),
  };

  const aggregated = {
    sources: Object.keys(sources),
    data_points: Object.values(sources).reduce((sum, s) => sum + (s.count || 0), 0),
    raw_data: sources,
    aggregated_range: calculateAggregatedRange(sources),
  };

  // Cache result
  await supabase
    .from('salary_cache')
    .upsert({
      cache_key: cacheKey,
      data: aggregated,
      created_at: new Date().toISOString(),
    }, {
      onConflict: 'cache_key',
    });

  return aggregated;
}

/**
 * Generate ML-based salary prediction
 */
async function generateMLPrediction(factors) {
  const prompt = `Predict salary range for:
Job Title: ${factors.jobTitle}
Location: ${factors.location}
Experience: ${factors.experience} years
Industry: ${factors.industry}
Skills: ${factors.skills.join(', ')}

Base Data Available: ${factors.baseData.data_points} data points

Consider:
- Location cost of living
- Experience level impact
- Industry premiums
- Skill premiums
- Market demand

Return as JSON with: min, max, median, p25, p75, p90 (all in USD)`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a compensation analyst with expertise in salary prediction. Use market data and ML models to predict accurate salary ranges.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('ML prediction failed, using base data');
  }

  // Fallback: use base data with adjustments
  const base = factors.baseData.aggregated_range;
  return {
    min: base.min,
    max: base.max,
    median: base.median,
    p25: base.min + (base.median - base.min) * 0.5,
    p75: base.median + (base.max - base.median) * 0.5,
    p90: base.max * 0.95,
  };
}

/**
 * Get market trends
 */
async function getMarketTrends(jobTitle, location) {
  const prompt = `Analyze salary trends for ${jobTitle} in ${location}:
- Year-over-year growth
- Market demand trends
- Future outlook (6-12 months)

Return as JSON with: yoy_growth, demand_trend (increasing/stable/decreasing), outlook, factors`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a labor market analyst. Provide insights on salary trends and job market conditions.',
      max_tokens: 300,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn('Trend analysis failed');
  }

  return {
    yoy_growth: '3-5%',
    demand_trend: 'stable',
    outlook: 'positive',
    factors: ['Market demand', 'Skill requirements'],
  };
}

/**
 * Generate negotiation tips
 */
async function generateNegotiationTips(salaryRange, location, experience) {
  const prompt = `Provide salary negotiation tips for:
Salary Range: $${salaryRange.min} - $${salaryRange.max}
Location: ${location}
Experience: ${experience} years

Give 5-7 actionable tips for negotiating within this range.`;

  try {
    const response = await generateCompletion(prompt, {
      systemMessage: 'You are a career negotiation expert. Provide practical, actionable salary negotiation advice.',
      max_tokens: 400,
    });

    return response.split('\n')
      .filter(line => line.trim() && line.match(/^\d+\.|^[-•]/))
      .map(line => line.replace(/^\d+\.\s*|^[-•]\s*/, '').trim())
      .filter(Boolean);
  } catch (error) {
    return [
      'Research market rates thoroughly',
      'Highlight your unique value',
      'Consider total compensation package',
      'Be prepared to walk away if needed',
    ];
  }
}

/**
 * Generate market report
 */
export async function generateMarketReport(jobTitle, location, industry) {
  try {
    const salaryData = await predictSalary(jobTitle, location, 5, industry);
    const trends = await getMarketTrends(jobTitle, location);
    const competitors = await getCompetitorData(jobTitle, location);

    return {
      job_title: jobTitle,
      location,
      industry,
      salary_analysis: salaryData,
      market_trends: trends,
      competitor_analysis: competitors,
      recommendations: await generateMarketRecommendations(salaryData, trends),
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Market report generation error:', error);
    throw error;
  }
}

/**
 * Helper functions
 */
async function getInternalJobData(jobTitle, location, sourceName) {
  // Query Supabase for real jobs
  let query = supabase
    .from('jobs')
    .select('salary_min, salary_max, salary')
    .ilike('title', `%${jobTitle}%`)
    .not('salary_min', 'is', null); // Only valid numeric salaries

  // Optional location filter (loose match)
  if (location && location.toLowerCase() !== 'remote') {
    query = query.ilike('location', `%${location}%`);
  }

  // Filter by source if needed, or get all
  if (sourceName && sourceName !== 'internal') {
    query = query.eq('source', sourceName);
  }

  const { data, error } = await query.limit(100);

  if (error || !data || data.length === 0) {
    return {
      source: sourceName || 'internal',
      count: 0,
    };
  }

  // Calculate statistics
  const salads = [];
  data.forEach(job => {
    if (job.salary_min) salads.push(job.salary_min);
    if (job.salary_max) salads.push(job.salary_max);
  });

  if (salads.length === 0) return { source: sourceName || 'internal', count: 0 };

  const median = calculateMedian(salads);
  const min = Math.min(...salads);
  const max = Math.max(...salads);

  return {
    source: sourceName || 'internal',
    count: data.length,
    median: Math.round(median),
    min: Math.round(min),
    max: Math.round(max),
  };
}

// Replaces individual source getters that were simulated
async function getGlassdoorData(jobTitle, location) {
  return await getInternalJobData(jobTitle, location, 'glassdoor');
}

async function getPayscaleData(jobTitle, location) {
  // Payscale isn't a source we crawl, so efficient fallback or generic internal data
  return await getInternalJobData(jobTitle, location, null);
}

async function getIndeedData(jobTitle, location) {
  return await getInternalJobData(jobTitle, location, 'indeed');
}

async function getUserReports(jobTitle, location) {
  // Real user reports from DB
  const { data } = await supabase
    .from('salary_reports')
    .select('salary')
    .ilike('job_title', `%${jobTitle}%`)
    .ilike('location', `%${location}%`)
    .limit(50);

  if (!data || data.length === 0) {
    return { source: 'user_reports', count: 0 };
  }

  const salaries = data.map(d => d.salary).filter(Boolean);
  return {
    source: 'user_reports',
    count: salaries.length,
    median: calculateMedian(salaries),
    min: Math.min(...salaries),
    max: Math.max(...salaries),
  };
}

function calculateAggregatedRange(sources) {
  const allMedians = Object.values(sources)
    .filter(s => s.median)
    .map(s => s.median);

  const allMins = Object.values(sources)
    .filter(s => s.min)
    .map(s => s.min);

  const allMaxs = Object.values(sources)
    .filter(s => s.max)
    .map(s => s.max);

  return {
    min: Math.min(...allMins),
    max: Math.max(...allMaxs),
    median: calculateMedian(allMedians),
  };
}

function calculateMedian(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function calculateConfidence(baseData, predictions) {
  let confidence = 50; // Base confidence

  // More data points = higher confidence
  if (baseData.data_points > 100) confidence += 20;
  else if (baseData.data_points > 50) confidence += 10;

  // Multiple sources = higher confidence
  if (baseData.sources.length >= 3) confidence += 15;
  else if (baseData.sources.length >= 2) confidence += 10;

  // Reasonable range = higher confidence
  const range = predictions.max - predictions.min;
  const median = predictions.median;
  if (range < median * 0.5) confidence += 15; // Tight range

  return Math.min(confidence, 95);
}

function isCacheValid(createdAt) {
  const cacheAge = Date.now() - new Date(createdAt).getTime();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  return cacheAge < maxAge;
}

async function getCompetitorData(jobTitle, location) {
  // Simulated competitor analysis
  return {
    top_companies: ['Company A', 'Company B', 'Company C'],
    average_by_company_size: {
      startup: 85000,
      mid: 95000,
      large: 110000,
    },
  };
}

async function generateMarketRecommendations(salaryData, trends) {
  return [
    `Target salary: $${salaryData.salary_range.median} - $${salaryData.salary_range.p75}`,
    `Market trend: ${trends.demand_trend}`,
    'Consider total compensation package',
    'Research company-specific ranges',
  ];
}

export default {
  predictSalary,
  generateMarketReport,
};

