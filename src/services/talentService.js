/**
 * Talent Marketplace Service
 * Service layer for talent marketplace operations
 */

import { apiService } from '../lib/api.js';
import { handleSupabaseError } from '../lib/supabase.js';

export const talentService = {
  /**
   * Get talent profile
   */
  async getProfile(talentId) {
    try {
      const response = await apiService.talent.getProfile(talentId);
      // Backend returns: { success: true, data: {...} } or { success: true, data: null } if not found
      if (response.data?.success) {
        // If data is null, profile doesn't exist - return null instead of throwing error
        if (response.data.data === null || response.data.data === undefined) {
          return null;
        }
        return response.data.data;
      }
      // Fallback for different response structures
      const data = response.data?.data || response.data || response;
      // If data is null/undefined, return null (profile doesn't exist)
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        return null;
      }
      return data;
    } catch (error) {
      // If it's a 404, profile doesn't exist - return null instead of throwing
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return null;
      }
      console.error('Error in getProfile:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create or update talent profile
   */
  async createOrUpdateProfile(profileData) {
    try {
      const response = await apiService.talent.createOrUpdateProfile(profileData);
      // Handle different response structures
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data?.data || response.data || response;
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get gigs
   */
  async getGigs(filters = {}) {
    try {
      const params = {};
      if (filters.is_active !== null && filters.is_active !== undefined) {
        params.is_active = filters.is_active;
      }
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      
      const response = await apiService.talent.getGigs(params);
      // Backend returns: { success: true, data: [...], pagination: {...} }
      if (response.data?.success) {
        return {
          data: response.data.data || [],
          pagination: response.data.pagination || {},
        };
      }
      return {
        data: response.data?.data || response.data || [],
        pagination: response.data?.pagination || {},
      };
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get gig by ID
   */
  async getGig(gigId) {
    try {
      const response = await apiService.talent.getGig(gigId);
      // Backend returns: { success: true, data: {...} }
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data?.data || response.data || response;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create gig
   */
  async createGig(gigData) {
    try {
      const response = await apiService.talent.createGig(gigData);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update gig
   */
  async updateGig(gigId, gigData) {
    try {
      const response = await apiService.talent.updateGig(gigId, gigData);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete gig
   */
  async deleteGig(gigId) {
    try {
      const response = await apiService.talent.deleteGig(gigId);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get orders
   */
  async getOrders(role = 'buyer', filters = {}) {
    try {
      const response = await apiService.talent.getOrders({ role, ...filters });
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create order
   */
  async createOrder(orderData) {
    try {
      const response = await apiService.talent.createOrder(orderData);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update order
   */
  async updateOrder(orderId, orderData) {
    try {
      const response = await apiService.talent.updateOrder(orderId, orderData);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get messages
   */
  async getMessages(conversationWith = null) {
    try {
      const response = await apiService.talent.getMessages({ conversation_with: conversationWith });
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Send message
   */
  async sendMessage(receiverId, message) {
    try {
      const response = await apiService.talent.sendMessage({ receiver_id: receiverId, message });
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Discover talents
   */
  async discoverTalents(filters = {}) {
    try {
      const response = await apiService.talent.discoverTalents(filters);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get dashboard data
   */
  async getDashboard() {
    try {
      const response = await apiService.talent.getDashboard();
      // Handle different response structures
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }
      return response.data?.data || response.data || {};
    } catch (error) {
      console.error('Error in getDashboard:', error);
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    try {
      const response = await apiService.talent.getDashboardStats();
      return response.data.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get conversations
   */
  async getConversations() {
    try {
      const response = await apiService.talent.getConversations();
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Deliver order
   */
  async deliverOrder(orderId, data) {
    try {
      const response = await apiService.talent.deliverOrder(orderId, data);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get orders (fixed signature)
   */
  async getOrders(status = null) {
    try {
      const params = status ? { status } : {};
      const response = await apiService.talent.getOrders(params);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get messages (fixed signature)
   */
  async getMessages(userId) {
    try {
      const response = await apiService.talent.getMessages({ conversation_with: userId });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Send message (fixed signature)
   */
  async sendMessage(data) {
    try {
      const response = await apiService.talent.sendMessage(data);
      return response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Discover talents (fixed signature)
   */
  async discoverTalents(filters) {
    try {
      const response = await apiService.talent.discoverTalents(filters);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },
};
