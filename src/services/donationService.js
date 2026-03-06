import { supabase } from '../lib/supabase';

/**
 * Donation Service
 * Handles processing of one-time and recurring donations.
 * agnostic of the underlying payment provider (Stripe, PayPal, etc.)
 */
export const donationService = {
  
  /**
   * Process a donation
   * @param {Object} donationData - { amount, type, currency, paymentMethodId, metadata, title }
   */
  processDonation: async (donationData) => {
    console.log('[DonationService] Processing:', donationData);
    
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Logic for real payment gateway (Stripe/PayPal) would go here
    // For now, we simulate a successful payment and record it in Supabase
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        user_id: user?.id || null,
        amount: donationData.amount,
        type: donationData.type,
        currency: donationData.currency || 'USD',
        title: donationData.title || 'General Support',
        status: 'completed',
        reference: `txn_${Math.random().toString(36).substr(2, 9)}`
      }])
      .select()
      .single();

    if (error) {
      console.error('[DonationService] DB Error:', error);
      throw new Error(error.message);
    }

    return {
      success: true,
      transactionId: data.reference,
      receiptUrl: '#',
      message: 'Donation processed successfully'
    };
  },

  /**
   * Get user's donation history
   */
  getDonationHistory: async (userId) => {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[DonationService] History Error:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      date: new Date(item.created_at).toLocaleDateString(),
      status: item.status || 'completed'
    }));
  },

  /**
   * Generate an intent for Stripe Elements (Future)
   */
  createPaymentIntent: async (amount) => {
    // This would call your backend to get a client_secret
    return { clientSecret: 'mock_secret' };
  }
};
