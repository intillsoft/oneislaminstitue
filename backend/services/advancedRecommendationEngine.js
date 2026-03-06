import * as aiProviderService from './aiProviderService.js';
import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * Advanced AI-Powered Recommendation Engine
 * Features:
 * - Collaborative filtering
 * - Content-based filtering
 * - Hybrid recommendation approach
 * - Real-time personalization
 * - Multi-factor scoring
 */

class AdvancedRecommendationEngine {
    /**
     * Generate personalized job recommendations for a user
     * @param {string} userId - User ID
     * @param {Object} options - Recommendation options
     * @returns {Promise<Array>} Recommended jobs with scores
     */
    async getPersonalizedJobRecommendations(userId, options = {}) {
        try {
            const {
                limit = 20,
                minScore = 60,
                includeExplanations = true,
                useAI = true,
            } = options;

            logger.info(`Generating recommendations for user ${userId}`);

            // 1. Get user profile and preferences
            const userProfile = await this.getUserProfile(userId);
            if (!userProfile) {
                logger.warn(`No profile found for user ${userId}`);
                return [];
            }

            // 2. Get jobs from the unified jobs table
            const { data: jobs, error: jobsError } = await supabase
                .from('jobs')
                .select(`
                  *,
                  companies(id, name, logo, industry)
                `)
                .or('status.eq.active,status.eq.published,status.is.null')
                .order('created_at', { ascending: false })
                .limit(200);

            if (jobsError) {
                logger.error('Error fetching jobs for recommendations:', jobsError);
            }

            if (!jobs || jobs.length === 0) {
                logger.warn('No jobs available for recommendations');
                return [];
            }

            // 3. PHASE 1: Heuristic Scoring (Heuristic methods only)
            const heuristicScoredJobs = jobs.map((job) => {
                const contentScore = this.calculateContentScore(job, userProfile);
                const collaborativeScore = this.calculateCollaborativeScoreSync(job, userId); // Use sync version or simple mock
                const recencyScore = this.calculateRecencyScore(job);

                // Base score (heuristic weighted: 70% of potential total)
                const baseScore = Math.round(
                    contentScore * 0.5 +
                    collaborativeScore * 0.3 +
                    recencyScore * 0.2
                );

                return {
                    ...job,
                    baseScore,
                    contentScore,
                    collaborativeScore,
                    recencyScore
                };
            });

            // 4. PICK TOP CANDIDATES for expensive AI scoring (optimization to avoid 429s)
            const topCandidates = heuristicScoredJobs
                .sort((a, b) => b.baseScore - a.baseScore)
                .slice(0, 40); // Only process top 40 with AI

            // 5. PHASE 2: Batched AI Scoring
            const finalScoredJobs = [];
            const BATCH_SIZE = 5;

            for (let i = 0; i < topCandidates.length; i += BATCH_SIZE) {
                const batch = topCandidates.slice(i, i + BATCH_SIZE);
                logger.info(`Processing AI score batch ${Math.floor(i / BATCH_SIZE) + 1} for ${batch.length} jobs`);

                const batchResults = await Promise.all(
                    batch.map(async (job) => {
                        try {
                            let aiScore = 0;
                            if (useAI && userProfile.resumeId) {
                                aiScore = await this.calculateAIScore(job, userProfile.resumeId);
                            }

                            const finalScore = Math.round(job.baseScore * 0.7 + aiScore * 0.3);
                            const normalizedScore = isNaN(finalScore) ? Math.round(job.baseScore) : Math.min(100, Math.max(0, finalScore));

                            return {
                                ...job,
                                matchScore: normalizedScore,
                                scoreBreakdown: {
                                    content: Math.round(job.contentScore),
                                    collaborative: Math.round(job.collaborativeScore),
                                    recency: Math.round(job.recencyScore),
                                    ai: isNaN(aiScore) ? 0 : Math.round(aiScore),
                                },
                                explanation: includeExplanations
                                    ? this.generateExplanation(job, userProfile, normalizedScore)
                                    : null,
                            };
                        } catch (jobError) {
                            logger.warn(`Error AI scoring job ${job.id}:`, jobError.message);
                            return {
                                ...job,
                                matchScore: job.baseScore,
                                scoreBreakdown: {
                                    content: Math.round(job.contentScore),
                                    collaborative: Math.round(job.collaborativeScore),
                                    recency: Math.round(job.recencyScore),
                                    ai: 0,
                                },
                            };
                        }
                    })
                );
                finalScoredJobs.push(...batchResults);

                // Slight delay between batches to further respect rate limits
                if (i + BATCH_SIZE < topCandidates.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // 6. Combine with non-top candidates (optional, usually unnecessary for Top-N results)
            const unscoredJobs = heuristicScoredJobs
                .filter(job => !topCandidates.find(tc => tc.id === job.id))
                .map(job => ({
                    ...job,
                    matchScore: job.baseScore,
                    scoreBreakdown: {
                        content: Math.round(job.contentScore),
                        collaborative: Math.round(job.collaborativeScore),
                        recency: Math.round(job.recencyScore),
                        ai: 0,
                    }
                }));

            const allScoredJobs = [...finalScoredJobs, ...unscoredJobs];

            // 4. Filter and sort
            let recommendations = allScoredJobs
                .filter(job => job.matchScore >= minScore)
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);

            // AUTO-RELAXATION: If no recommendations meet the high bar, lower it
            if (recommendations.length === 0 && minScore > 30) {
                const lowerThreshold = 40;
                logger.info(`No matches found at score ${minScore}, relaxing to ${lowerThreshold}`);
                recommendations = allScoredJobs
                    .filter(job => job.matchScore >= lowerThreshold)
                    .sort((a, b) => b.matchScore - a.matchScore)
                    .slice(0, limit);
            }

            const maxScore = allScoredJobs.length > 0 ? Math.max(...allScoredJobs.map(j => j.matchScore)) : 0;
            logger.info(`Generated ${recommendations.length} recommendations for user ${userId} (Max score: ${maxScore})`);
            return recommendations;

        } catch (error) {
            logger.error('Error in getPersonalizedJobRecommendations:', error);
            return [];
        }
    }

    /**
     * Get comprehensive user profile
     */
    async getUserProfile(userId) {
        try {
            const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            const { data: resume } = await supabase
                .from('resumes')
                .select('*')
                .eq('user_id', userId)
                .eq('is_default', true)
                .single();

            const { data: applications } = await supabase
                .from('applications')
                .select('job_id, jobs(title, industry, description)')
                .eq('user_id', userId)
                .limit(50);

            const resumeContent = resume?.content_json || {};

            return {
                userId,
                resumeId: resume?.id,
                skills: this.extractSkills(resumeContent),
                experience: this.extractExperience(resumeContent),
                education: this.extractEducation(resumeContent),
                jobTitle: resumeContent.job_title || '',
                industry: resumeContent.industry || '',
                location: user?.location || '',
                appliedJobs: applications?.map(a => a.job_id) || [],
                preferences: {
                    remote: user?.remote_preference || false,
                    salary_min: user?.salary_min || null,
                    job_type: user?.job_type_preference || [],
                },
            };
        } catch (error) {
            logger.error('Error getting user profile:', error);
            return null;
        }
    }

    /**
     * Content-based scoring (skills, title, industry match)
     */
    calculateContentScore(job, userProfile) {
        let score = 50; // Base score

        const jobText = `${job.title} ${job.description || ''}`.toLowerCase();
        const userSkills = userProfile.skills.map(s => s.toLowerCase());

        // Skill matching (up to 30 points)
        const matchedSkills = userSkills.filter(skill =>
            skill.length > 2 && jobText.includes(skill)
        );
        score += Math.min(30, matchedSkills.length * 5);

        // Title matching (up to 20 points)
        if (userProfile.jobTitle) {
            const titleWords = userProfile.jobTitle.toLowerCase().split(/\s+/);
            const titleMatches = titleWords.filter(word =>
                word.length > 3 && job.title.toLowerCase().includes(word)
            );
            score += Math.min(20, titleMatches.length * 10);
        }

        // Industry matching (up to 15 points)
        if (userProfile.industry && job.companies?.industry) {
            if (job.companies.industry.toLowerCase().includes(userProfile.industry.toLowerCase())) {
                score += 15;
            }
        }

        // Location matching (up to 10 points)
        if (userProfile.location && job.location) {
            if (job.location.toLowerCase().includes(userProfile.location.toLowerCase())) {
                score += 10;
            }
        }

        // Remote preference (up to 5 points)
        if (userProfile.preferences.remote && job.location?.toLowerCase().includes('remote')) {
            score += 5;
        }

        return Math.min(100, score);
    }

    /**
     * Collaborative filtering score (Sync version for pre-filtering)
     */
    calculateCollaborativeScoreSync(job, userId) {
        // Simple heuristic: jobs with many applicants are "hot"
        // This can be enhanced by caching popularity data
        return 50;
    }

    /**
     * Collaborative filtering score (based on similar users)
     */
    async calculateCollaborativeScore(job, userId) {
        try {
            // Find users who applied to similar jobs
            const { data: similarUsers } = await supabase
                .from('applications')
                .select('user_id, job_id')
                .eq('job_id', job.id)
                .limit(100);

            if (!similarUsers || similarUsers.length === 0) {
                return 50; // Neutral score for new jobs
            }

            // Jobs are more valuable if many users applied
            const popularityScore = Math.min(30, similarUsers.length * 2);

            return 50 + popularityScore;
        } catch (error) {
            logger.warn('Error calculating collaborative score:', error.message);
            return 50;
        }
    }

    /**
     * Recency score (newer jobs get boost)
     */
    calculateRecencyScore(job) {
        const now = new Date();
        const jobDate = new Date(job.created_at);
        const daysDiff = (now - jobDate) / (1000 * 60 * 60 * 24);

        if (daysDiff < 1) return 100;
        if (daysDiff < 3) return 90;
        if (daysDiff < 7) return 80;
        if (daysDiff < 14) return 70;
        if (daysDiff < 30) return 60;
        return 50;
    }

    /**
     * AI-enhanced scoring using job matching service
     */
    async calculateAIScore(job, resumeId) {
        try {
            // Use existing job matching service - skip recommendations to save tokens
            const { calculateJobMatch } = await import('./jobMatching.js');
            const matchResult = await calculateJobMatch(resumeId, job.id, { skipRecommendations: true });

            return matchResult.match_score || 50;
        } catch (error) {
            logger.warn('AI scoring failed, using fallback:', error.message);
            return 50;
        }
    }

    /**
     * Generate human-readable explanation
     */
    generateExplanation(job, userProfile, score) {
        const reasons = [];

        const jobText = `${job.title} ${job.description || ''}`.toLowerCase();
        const matchedSkills = userProfile.skills.filter(skill =>
            skill.length > 2 && jobText.includes(skill.toLowerCase())
        );

        if (matchedSkills.length > 0) {
            reasons.push(`Matches ${matchedSkills.length} of your skills: ${matchedSkills.slice(0, 3).join(', ')}`);
        }

        if (userProfile.jobTitle && job.title.toLowerCase().includes(userProfile.jobTitle.toLowerCase())) {
            reasons.push(`Similar to your current role: ${userProfile.jobTitle}`);
        }

        if (userProfile.industry && job.companies?.industry?.toLowerCase().includes(userProfile.industry.toLowerCase())) {
            reasons.push(`In your preferred industry: ${userProfile.industry}`);
        }

        if (score >= 80) {
            reasons.unshift('Excellent match for your profile');
        } else if (score >= 70) {
            reasons.unshift('Strong match for your background');
        } else if (score >= 60) {
            reasons.unshift('Good fit based on your skills');
        }

        return reasons.join('. ');
    }

    /**
     * Extract skills from resume
     */
    extractSkills(resumeContent) {
        const skills = [];

        if (resumeContent.skills) {
            if (Array.isArray(resumeContent.skills)) {
                skills.push(...resumeContent.skills);
            } else if (resumeContent.skills.technical) {
                skills.push(...resumeContent.skills.technical);
            }
            if (resumeContent.skills.soft) {
                skills.push(...resumeContent.skills.soft);
            }
        }

        if (resumeContent.sections) {
            const skillsSection = resumeContent.sections.find(s => s.type === 'skills');
            if (skillsSection?.content) {
                const text = skillsSection.content.replace(/<[^>]*>/g, '');
                skills.push(...text.split(',').map(s => s.trim()).filter(Boolean));
            }
        }

        return [...new Set(skills)].filter(s => s.length > 2);
    }

    /**
     * Extract experience from resume
     */
    extractExperience(resumeContent) {
        if (resumeContent.experience) {
            return resumeContent.experience;
        }

        const expSection = resumeContent.sections?.find(s => s.type === 'experience');
        return expSection?.content || '';
    }

    /**
     * Extract education from resume
     */
    extractEducation(resumeContent) {
        if (resumeContent.education) {
            return resumeContent.education;
        }

        const eduSection = resumeContent.sections?.find(s => s.type === 'education');
        return eduSection?.content || '';
    }
}

// Export singleton instance
const recommendationEngine = new AdvancedRecommendationEngine();
export default recommendationEngine;
