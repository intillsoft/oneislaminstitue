// src/pages/admin-moderation-management/components/ConfigurationPanels.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { adminService } from '../../../services/adminService';
import { jobService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

import { EliteCard } from '../../../components/ui/EliteCard';

const ConfigurationPanels = () => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  const [activePanel, setActivePanel] = useState('coupons');
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percentage', expiryDate: '', usageLimit: '', description: '' });
  const [existingCoupons, setExistingCoupons] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadConfigurations();
    } else {
      setLoading(false);
    }
  }, [user, profile, activePanel]);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const configs = await adminService.getConfigurations();
      setExistingCoupons(configs.coupons || []);
      const jobsResult = await jobService.getAll({ pageSize: 100 });
      const featured = (jobsResult.data || []).filter(job => job.featured || job.status === 'active').slice(0, 10).map(job => ({ id: job.id, title: job.title, company: job.company || 'Unknown', featuredUntil: job.expires_at || job.created_at, views: 0, applications: 0, status: job.status || 'active' }));
      setFeaturedJobs(featured);
    } catch (error) {
      showError('Failed to sync system parameters');
    } finally {
      setLoading(false);
    }
  };

  const configPanels = [
    { id: 'coupons', label: 'VOUCHERS', icon: 'Tag' },
    { id: 'featured', label: 'PRIORITY', icon: 'Star' },
    { id: 'payments', label: 'FINANCE', icon: 'CreditCard' },
    { id: 'notifications', label: 'SIGNALS', icon: 'Bell' },
    { id: 'general', label: 'CORE', icon: 'Settings' }
  ];

  const handleCouponSubmit = async (e) => {
    e?.preventDefault();
    try {
      await adminService.createCoupon(newCoupon);
      success('Protocol generated successfully');
      setNewCoupon({ code: '', discount: '', type: 'percentage', expiryDate: '', usageLimit: '', description: '' });
      loadConfigurations();
    } catch (error) {
      showError('Failed to register protocol');
    }
  };

  const renderCouponsPanel = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-4">
        <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Protocol Generation</h3>
          <form onSubmit={handleCouponSubmit} className="space-y-6">
            <div className="space-y-1.5 focus-within:translate-x-1 transition-all">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">VOUCHER CODE</label>
              <input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="SAVE20_INT" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50" required />
            </div>
            <div className="space-y-1.5 focus-within:translate-x-1 transition-all">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">YIELD ADJUSTMENT</label>
              <div className="flex gap-2">
                <select value={newCoupon.type} onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black uppercase text-white focus:outline-none">
                  <option value="percentage">%</option>
                  <option value="fixed">$</option>
                </select>
                <input type="number" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black text-white focus:outline-none" required />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">AUTHORIZE PROTOCOL</button>
          </form>
        </EliteCard>
      </div>
      <div className="xl:col-span-8">
        <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Active Vouchers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-600">IDENTIFIER</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-600">YIELD</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-600">USAGE</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-600">EXPIRY</th>
                  <th className="pb-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-600">HUB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {existingCoupons.map((coupon) => (
                  <tr key={coupon.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="py-5 pr-4">
                      <span className="text-[11px] font-black text-white uppercase tracking-wider">{coupon.code}</span>
                    </td>
                    <td className="py-5 pr-4 text-[10px] font-black text-blue-500">{coupon.discount}</td>
                    <td className="py-5 pr-4 text-[10px] font-black text-slate-400">{coupon.used}/{coupon.limit}</td>
                    <td className="py-5 pr-4 text-[10px] font-black text-slate-600 uppercase">{coupon.expires}</td>
                    <td className="py-5 text-right">
                      <button className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">DECOMMISSION</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EliteCard>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 px-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Configuration Hub</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Platform Parameter Control Matrix</p>
        </div>
      </div>

      <EliteCard className="p-2 border-white/5 bg-white/[0.02] rounded-[1.5rem] overflow-hidden">
        <div className="flex flex-wrap gap-2">
          {configPanels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePanel === panel.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon name={panel.icon} size={14} />
              {panel.label}
            </button>
          ))}
        </div>
      </EliteCard>

      <div className="transition-all duration-500">
        {activePanel === 'coupons' && renderCouponsPanel()}
        {activePanel !== 'coupons' && (
          <EliteCard className="p-20 border-white/5 bg-white/[0.01] text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/20 flex items-center justify-center mx-auto mb-6">
              <Icon name="Lock" size={32} className="text-slate-700" />
            </div>
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Module Secured</h3>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">{activePanel} configurations are encrypted. Verify clearance to proceed.</p>
          </EliteCard>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanels;
