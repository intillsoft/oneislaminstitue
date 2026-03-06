import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { EliteCard } from '../../../components/ui/EliteCard';
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
      paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      cancelled: 'bg-text-muted/10 text-text-muted border-text-muted/20',
    };
    return statusStyles[status] || 'bg-text-muted/10 text-text-muted border-text-muted/20';
  };

  if (loading) {
    return (
      <div className="card overflow-hidden bg-bg-elevated border border-border dark:border-white/5">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/5 rounded w-1/4"></div>
            <div className="h-32 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Subscription Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EliteCard className="lg:col-span-2 p-8 border-white/5 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-8 group">
          <div className="w-20 h-20 rounded-3xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Icon name="Crown" size={40} className="text-workflow-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Pro Recruiter Plan</h3>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20">Active</span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-4">Your subscription renews on <span className="text-white font-bold">Feb 24, 2026</span></p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button className="px-6 py-2.5 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-workflow-primary/20">
                Manage Plan
              </button>
              <button className="px-6 py-2.5 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] border border-white/10">
                View Perks
              </button>
            </div>
          </div>
        </EliteCard>

        <EliteCard className="p-8 border-white/5 bg-white/[0.02] flex flex-col justify-center text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Managed Spend</p>
          <h3 className="text-4xl font-black text-white mb-1 tracking-tight">$2,450.00</h3>
          <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest">+12% from last quarter</p>
        </EliteCard>
      </div>

      <EliteCard className="overflow-hidden border-white/5 bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 border-b border-white/5">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Billing Ledger</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Comprehensive Transaction History</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'all'
                  ? 'bg-white/10 text-text-primary'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setViewMode('paid')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                }`}
            >
              Settled
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border dark:divide-white/5">
            <thead>
              <tr className="border-b border-white/5">
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Reference ID
                </th>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Timestamp
                </th>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Details
                </th>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Value
                </th>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th scope="col" className="px-8 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-bg dark:bg-bg-elevated divide-y divide-border dark:divide-white/5">
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
                  <tr key={payment.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-xs font-black text-text-primary dark:text-white font-mono tracking-tighter">{payment.id}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-xs font-black text-text-muted dark:text-slate-400 uppercase tracking-widest">{formatDate(payment.date)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-black text-white uppercase tracking-tight">{payment.description}</div>
                      <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-black text-text-primary dark:text-white">
                        ${payment.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5 hover:bg-white/10">
                          <Icon name="FileText" size={14} />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5 hover:bg-white/10">
                          <Icon name="Download" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </EliteCard>
    </div>
  );
};

export default PaymentHistory;
