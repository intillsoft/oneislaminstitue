import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';
import { EliteCard, ElitePageHeader } from '../../components/ui/EliteCard';

const TalentOrders = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await talentService.getOrders(filter === 'all' ? null : filter);
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverOrder = async (orderId) => {
    if (!deliveryFiles.length) {
      showError('Please upload delivery files');
      return;
    }

    try {
      await talentService.deliverOrder(orderId, {
        files: deliveryFiles,
        message: 'Order delivered',
      });
      success('Order delivered successfully!');
      setSelectedOrder(null);
      setDeliveryFiles([]);
      loadOrders();
    } catch (error) {
      console.error('Error delivering order:', error);
      showError('Failed to deliver order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      disputed: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };
    return colors[status] || 'bg-slate-500/10 text-slate-500 border-white/10';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Accessing Orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'} min-h-screen`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />

          <ElitePageHeader
            title="Order Protocol"
            description="Manage your high-value freelance transactions"
            className="mb-12"
          />

          {/* Filters */}
          <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-xl border border-white/5 w-fit mb-8 overflow-x-auto no-scrollbar max-w-full">
            {['all', 'pending', 'in_progress', 'completed', 'cancelled', 'disputed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === status
                    ? 'bg-workflow-primary text-white shadow-lg shadow-workflow-primary/10'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                  }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <EliteCard className="overflow-hidden !p-0 border border-border dark:border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Node ID
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Buyer Entity
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Target Gig
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest text-right">
                      Value
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Initialized
                    </th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest text-right">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-white/[0.02]">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="text-xs font-black text-text-primary dark:text-white font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {order.buyer?.avatar_url ? (
                                <img
                                  src={order.buyer.avatar_url}
                                  alt={order.buyer.name}
                                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-white/5"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/20">
                                  <Icon name="User" size={14} className="text-workflow-primary" />
                                </div>
                              )}
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A1628] rounded-full"></div>
                            </div>
                            <span className="text-sm font-bold text-text-primary dark:text-white group-hover:text-workflow-primary transition-colors">
                              {order.buyer?.name || 'Unknown Entity'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-xs font-bold text-text-muted dark:text-slate-400 line-clamp-1 max-w-[200px]">
                            {order.gig?.title || order.title || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-right">
                          <span className="text-sm font-black text-text-primary dark:text-white tracking-tight">
                            ${order.price}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(order.status)} animate-pulse`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-text-muted">
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 bg-white/5 text-text-muted hover:text-white hover:bg-workflow-primary/80 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-workflow-primary/50 shadow-lg hover:shadow-workflow-primary/20"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-24 text-center">
                        <div className="w-16 h-16 bg-bg/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border dark:border-white/5">
                          <Icon name="Inbox" className="w-8 h-8 text-bg-elevated" />
                        </div>
                        <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">No Active Transactions Detected</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </EliteCard>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-bg/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <EliteCard className="max-w-xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setSelectedOrder(null);
                setDeliveryFiles([]);
              }}
              className="absolute top-6 right-6 p-2 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <Icon name="X" size={18} />
            </button>

            <div className="mb-8">
              <span className="text-[10px] font-black text-workflow-primary uppercase tracking-[0.2em] mb-3 block">Transaction Interface</span>
              <h2 className="text-2xl font-black text-text-primary dark:text-white tracking-tight uppercase">
                Order Protocol #{selectedOrder.id.slice(0, 8).toUpperCase()}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Buyer Entity</p>
                <div className="flex items-center gap-4">
                  {selectedOrder.buyer?.avatar_url ? (
                    <img
                      src={selectedOrder.buyer.avatar_url}
                      alt={selectedOrder.buyer.name}
                      className="w-12 h-12 rounded-2xl ring-2 ring-white/5"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/20">
                      <Icon name="User" size={24} className="text-workflow-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-black text-text-primary dark:text-white uppercase tracking-tight">
                      {selectedOrder.buyer?.name || 'Unknown Entity'}
                    </p>
                    <Link
                      to={`/talent/messages?user=${selectedOrder.buyer_id}`}
                      className="text-[10px] font-black text-workflow-primary hover:text-workflow-primary/80 uppercase tracking-widest mt-1 inline-block"
                    >
                      Establish Connection
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Active Gig</p>
                <div className="p-4 bg-bg-elevated rounded-2xl border border-border dark:border-white/5 text-sm font-bold text-text-primary dark:text-white">
                  {selectedOrder.gig?.title || selectedOrder.title || 'N/A'}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Protocol Objectives</p>
                <div className="p-4 bg-bg-elevated rounded-2xl border border-border dark:border-white/5 text-xs text-text-muted dark:text-slate-400 leading-relaxed font-medium">
                  {selectedOrder.description || 'No objectives specified.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-bg-elevated rounded-2xl border border-border dark:border-white/5 text-right">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Contract Value</p>
                  <p className="text-2xl font-black text-text-primary dark:text-white tracking-tighter">
                    ${selectedOrder.price}
                  </p>
                </div>
                <div className="p-4 bg-bg-elevated rounded-2xl border border-border dark:border-white/5">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Protocol Status</p>
                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(selectedOrder.status)} inline-block`}>
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedOrder.status === 'in_progress' && (
                <div className="pt-8 border-t border-border dark:border-white/5">
                  <p className="text-[10px] font-black text-text-primary dark:text-white uppercase tracking-[0.2em] mb-4">Delivery Protocol</p>
                  <div className="group relative">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setDeliveryFiles(Array.from(e.target.files))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-6 py-8 border-2 border-dashed border-border dark:border-white/10 group-hover:border-workflow-primary/50 rounded-2xl bg-bg-elevated transition-all text-center">
                      <Icon name="Upload" className="w-8 h-8 text-bg mx-auto mb-3 transition-colors group-hover:text-workflow-primary" />
                      <p className="text-[10px] font-black text-text-muted group-hover:text-text-primary uppercase tracking-widest">
                        {deliveryFiles.length > 0 ? `${deliveryFiles.length} Nodes Detected` : 'Inject Delivery Nodes'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeliverOrder(selectedOrder.id)}
                    className="w-full mt-4 py-4 bg-workflow-primary text-white hover:bg-workflow-primary/80 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-workflow-primary/20 active:scale-[0.98]"
                  >
                    Execute Final Delivery
                  </button>
                </div>
              )}
            </div>
          </EliteCard>
        </div>
      )}
    </div>
  );
};

export default TalentOrders;











