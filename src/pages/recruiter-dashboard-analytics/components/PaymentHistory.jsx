import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const PaymentHistory = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [viewMode, setViewMode] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadPayments();
    } else {
      setLoading(false);
    }
  }, [user, profile, viewMode]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      // Fetch from subscriptions table if it exists
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Transform subscription data to payment format
      const paymentList = (data || []).map((sub, index) => ({
        id: sub.id || `INV-${new Date(sub.created_at).getFullYear()}-${String(index + 1).padStart(4, '0')}`,
        date: sub.created_at || new Date().toISOString(),
        amount: sub.amount || 0,
        status: sub.status || 'paid',
        description: `${sub.tier || 'Premium'} Plan - ${sub.billing_period || 'Monthly'} Subscription`,
        paymentMethod: sub.payment_method || 'Credit Card',
      }));

      // Filter by view mode
      const filtered = viewMode === 'all' 
        ? paymentList 
        : paymentList.filter(p => p.status === viewMode);

      setPayments(filtered);
    } catch (error) {
      console.error('Error loading payments:', error);
      // If subscriptions table doesn't exist, show empty state
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400',
      active: 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400',
      pending: 'bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400',
      failed: 'bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400',
      cancelled: 'bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400',
    };
    return statusStyles[status] || 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400';
  };

  if (loading) {
    return (
      <div className="card overflow-hidden bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-32 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden bg-background dark:bg-[#13182E] border border-border dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-6 pt-6">
        <h3 className="text-lg font-medium text-text-primary dark:text-white mb-3 sm:mb-0">Payment History</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 text-sm rounded-md transition-smooth ${
              viewMode === 'all' 
                ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                : 'text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400'
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setViewMode('paid')}
            className={`px-3 py-1.5 text-sm rounded-md transition-smooth ${
              viewMode === 'paid' 
                ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                : 'text-text-secondary hover:bg-surface-100 dark:hover:bg-surface-700 dark:text-gray-400'
            }`}
          >
            Paid
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-gray-700">
          <thead className="bg-surface-100 dark:bg-surface-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Invoice ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background dark:bg-[#13182E] divide-y divide-border dark:divide-gray-700">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-secondary-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium text-text-primary dark:text-white mb-1">No payment history</h3>
                  <p className="text-text-secondary dark:text-gray-400">Payment records will appear here once available</p>
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-smooth">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary dark:text-white">{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary dark:text-gray-400">{formatDate(payment.date)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary dark:text-white">{payment.description}</div>
                    <div className="text-xs text-text-secondary dark:text-gray-400 mt-1">{payment.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary dark:text-white">
                      ${payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth">
                        <Icon name="FileText" size={16} />
                      </button>
                      <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth">
                        <Icon name="Download" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {payments.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-border dark:border-gray-700">
          <div className="text-sm text-text-secondary dark:text-gray-400">
            Showing <span className="font-medium">{payments.length}</span> payment{payments.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
