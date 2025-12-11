/**
 * AI Service
 * Service layer for all AI-powered features
 */

import { apiService } from '../lib/api';

export const aiService = {
  /**
   * Generate AI Resume
   */
  async generateResume(userInput) {
    try {
      // Convert camelCase to snake_case for backend API
      const response = await apiService.ai.generateResume({
        job_title: userInput.jobTitle || userInput.job_title,
        experience_level: userInput.experienceLevel || userInput.experience_level,
        industry: userInput.industry,
        skills: Array.isArray(userInput.skills) ? userInput.skills : (userInput.skills ? [userInput.skills] : []),
        achievements: Array.isArray(userInput.achievements) ? userInput.achievements : (userInput.achievements ? [userInput.achievements] : []),
        style: userInput.style || 'professional',
        job_description: userInput.jobDescription || userInput.job_description || null,
        include_ats: userInput.includeATS !== false,
        ai_provider: userInput.aiProvider || userInput.ai_provider || 'openai',
      });

      // Backend returns { success: true, data: {...} }
      // response.data is the axios response data, which contains { success: true, data: {...} }
      // So we need to return response.data.data (the actual resume data)
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      // Fallback: return response.data directly if structure is different
      return response.data;
    } catch (error) {
      // Better error handling for connection issues
      if (!error.response) {
        throw new Error('Cannot connect to backend server. Please make sure the backend is running on http://localhost:3001');
      }

      // Handle 400 Bad Request errors with more detail
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.required) {
          throw new Error(`Missing required fields: ${errorData.required.join(', ')}`);
        }
        throw new Error(errorData?.message || errorData?.error || 'Invalid request. Please check all fields are filled.');
      }

      throw new Error(error.response?.data?.message || error.message || 'AI resume generation failed');
    }
  },

  /**
   * Match Job with Resume (with throttling)
   */
  async matchJob(resumeId, jobId, aiProvider = null) {
    try {
      // Import throttler dynamically to avoid circular dependencies
      const { requestThrottler } = await import('../utils/requestThrottler');

      // Get saved AI provider preference or use default
      const savedProvider = aiProvider || localStorage.getItem('preferredAIProvider') || 'openai';

      // Use throttler to prevent rate limiting
      const response = await requestThrottler.add(() =>
        apiService.ai.matchJob(resumeId, jobId, savedProvider)
      );

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      // Better error handling for connection issues
      if (!error.response) {
        throw new Error('Cannot connect to backend server. Please make sure the backend is running on http://localhost:3001');
      }
      // Handle 429 rate limit errors gracefully
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(error.response?.data?.message || error.message || 'Job matching failed');
    }
  },

  /**
   * Generate Interview Questions
   */
  async generateInterviewQuestions(jobDescription, companyName = null, difficulty = 'medium') {
    try {
      const response = await apiService.ai.generateQuestions({
        job_description: jobDescription,
        company_name: companyName,
        difficulty,
      });

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate questions');
    }
  },

  /**
   * Analyze Interview Answer
   */
  async analyzeAnswer(question, answer, jobDescription) {
    try {
      const response = await apiService.ai.analyzeAnswer({
        question,
        answer,
        job_description: jobDescription,
      });

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Answer analysis failed');
    }
  },

  /**
   * Predict Salary
   */
  async predictSalary(jobTitle, location, experienceLevel, industry, skills = []) {
    try {
      const response = await apiService.ai.predictSalary({
        job_title: jobTitle,
        location,
        experience: experienceLevel,
        industry,
        skills,
      });

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Salary prediction failed');
    }
  },

  /**
   * Analyze Career
   */
  async analyzeCareer() {
    try {
      const response = await apiService.ai.analyzeCareer();

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Career analysis failed');
    }
  },

  /**
   * Chat with AI Career Advisor
   */
  async chatWithAdvisor(message, conversationHistory = []) {
    try {
      const response = await apiService.ai.chatWithAdvisor({
        message,
        conversation_history: conversationHistory,
      });

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Chat failed');
    }
  },

  /**
   * Get Market Insights
   */
  async getMarketInsights() {
    try {
      const response = await apiService.ai.getMarketInsights();

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get market insights');
    }
  },

  /**
   * Get Skill Analysis
   */
  async getSkillAnalysis() {
    try {
      const response = await apiService.ai.getSkillAnalysis();

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze skills');
    }
  },

  /**
   * Generate AI completion (for editing sections)
   */
  async generateCompletion(prompt, options = {}) {
    try {
      const response = await apiService.ai.generateCompletion({
        prompt,
        system_message: options.systemMessage || 'You are a helpful assistant.',
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
      });

      // Handle nested response structure
      const responseData = response.data;
      if (responseData?.success && responseData?.data) {
        return responseData.data.text || responseData.data.content || responseData.data || '';
      }
      return responseData?.text || responseData?.content || responseData || '';
    } catch (error) {
      if (!error.response) {
        throw new Error('Cannot connect to backend server. Please make sure the backend is running on http://localhost:3001');
      }

      if (error.response?.status === 404) {
        throw new Error('AI completion endpoint not found. Please check backend routes.');
      }

    }
  },

  /**
   * Validate Input
   */
  async validateInput(type, content, context = {}) {
    try {
      const response = await apiService.ai.validateInput({
        type,
        content,
        context,
      });

      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      // Fail open if validation service is down
      console.warn('Validation service unavailable:', error);
      return { isValid: true, issues: [], suggestions: [] };
    }
  },

  // ============================================================================
  // TALENT MARKETPLACE AI METHODS
  // ============================================================================

  /**
   * Gig Doctor (Optimize Gig)
   */
  async optimizeGig(title, description, category, tags) {
    try {
      const response = await apiService.ai.optimizeGig({
        title,
        description,
        category,
        tags
      });
      // Unwrap backend response structure
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gig optimization failed');
    }
  },

  /**
   * Rate Intelligence
   */
  async analyzeRates(title, skills, experienceLevel, currentRate, category) {
    try {
      const response = await apiService.ai.analyzeRates({
        title,
        skills,
        experience_level: experienceLevel,
        current_rate: currentRate,
        category
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Rate analysis failed');
    }
  },

  /**
   * Auto-Proposal Generator
   */
  async generateProposal(jobDetails, freelancerProfile, tone) {
    try {
      const response = await apiService.ai.generateProposal({
        job_details: jobDetails,
        freelancer_profile: freelancerProfile,
        tone
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Proposal generation failed');
    }
  },

  /**
   * Client Vibe Check
   */
  async analyzeClientVibe(messages, clientData) {
    try {
      const response = await apiService.ai.analyzeClientVibe({
        messages,
        client_data: clientData
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Vibe check failed');
    }
  },

  /**
   * Skill Verification
   */
  async verifySkill(skill, chatHistory) {
    try {
      const response = await apiService.ai.verifySkill({
        skill,
        chat_history: chatHistory
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Skill verification failed');
    }
  },

  /**
   * Smart Upsell
   */
  async suggestUpsell(chatContext, availableServices) {
    try {
      const response = await apiService.ai.suggestUpsell({
        chat_context: chatContext,
        available_services: availableServices
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upsell suggestion failed');
    }
  },

  /**
   * Earnings Forecast
   */
  async forecastEarnings(earningsHistory, activeGigsValue, pipelineCount) {
    try {
      const response = await apiService.ai.forecastEarnings({
        earnings_history: earningsHistory,
        active_gigs_value: activeGigsValue,
        pipeline_count: pipelineCount
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Forecasting failed');
    }
  },

};

export default aiService;