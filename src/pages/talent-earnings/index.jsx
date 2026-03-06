import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';

const TalentEarnings = () => {
  const { user } = useAuthContext();
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    thisYear: 0,
    pending: 0,
  });
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadEarnings();
  }, [dateRange]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const orders = await talentService.getOrders('completed');
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      let filteredOrders = orders || [];
      
      if (dateRange === 'month') {
        filteredOrders = orders.filter(o => new Date(o.completed_date) >= startOfMonth);
      } else if (dateRange === 'year') {
        filteredOrders = orders.filter(o => new Date(o.completed_date) >= startOfYear);
      }

      setEarnings(filteredOrders);

      const total = orders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
      const thisMonth = orders
        .filter(o => new Date(o.completed_date) >= startOfMonth)
        .reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
      const thisYear = orders
        .filter(o => new Date(o.completed_date) >= startOfYear)
        .reduce((sum, o) => sum + parseFloat(o.price || 0), 0);

      // Get pending orders
      const pendingOrders = await talentService.getOrders('pending');
      const pending = pendingOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);

      setStats({
        totalEarnings: total,
        thisMonth,
        thisYear,
        pending,
      });
    } catch (error) {
      console.error('Error loading earnings:', error);
      showError('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-text-muted font-medium">Loading earnings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
      <UnifiedSidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-white mb-2 uppercase tracking-tight">
              Earnings
            </h1>
            <p className="text-text-muted dark:text-slate-400 font-medium">
              Track your earnings and financial performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2rem] p-6 shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Total Earnings</p>
              <p className="text-3xl font-black text-text-primary dark:text-white tracking-tighter">
                ${stats.totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2rem] p-6 shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">This Month</p>
              <p className="text-3xl font-black text-text-primary dark:text-white tracking-tighter">
                ${stats.thisMonth.toLocaleString()}
              </p>
            </div>
            <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2rem] p-6 shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">This Year</p>
              <p className="text-3xl font-black text-text-primary dark:text-white tracking-tighter">
                ${stats.thisYear.toLocaleString()}
              </p>
            </div>
            <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-[2rem] p-6 shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Pending</p>
              <p className="text-3xl font-black text-text-primary dark:text-white tracking-tighter">
                ${stats.pending.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-bg-elevated border border-border dark:border-white/5 rounded-2xl p-4 mb-8 shadow-lg">
            <div className="flex items-center gap-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Temporal Filter:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-6 py-2 border border-border dark:border-white/10 rounded-xl bg-bg text-text-primary dark:text-white text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-elevated/50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Gig</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Buyer</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-white/5">
                  {earnings.length > 0 ? (
                    earnings.map((earning) => (
                      <tr key={earning.id} className="hover:bg-workflow-primary/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-text-primary dark:text-white uppercase tracking-tighter">
                          #{earning.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-text-primary dark:text-white group-hover:text-workflow-primary transition-colors">
                          {earning.gig?.title || earning.title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-secondary dark:text-slate-400">
                          {earning.buyer?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-black text-emerald-500">
                          +${parseFloat(earning.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-text-muted">
                          {earning.completed_date
                            ? formatDistanceToNow(new Date(earning.completed_date), { addSuffix: true })
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Icon name="DollarSign" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                        <p className="text-[#64748B] dark:text-[#8B92A3]">No earnings yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentEarnings;










