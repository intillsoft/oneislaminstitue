import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { formatDistanceToNow } from 'date-fns';

const TalentOrders = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryFiles, setDeliveryFiles] = useState([]);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await talentService.getOrders(filter === 'all' ? null : filter);
      setOrders(data);
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
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      in_progress: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      completed: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      disputed: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <UnifiedSidebar />
        <div className="ml-0 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-[#64748B] dark:text-[#8B92A3]">Loading orders...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Orders Management
            </h1>
            <p className="text-[#64748B] dark:text-[#8B92A3]">
              Manage all your freelance orders
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'pending', 'in_progress', 'completed', 'cancelled', 'disputed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-workflow-primary text-white'
                      : 'bg-gray-100 dark:bg-[#1A2139] text-[#0F172A] dark:text-[#E8EAED] hover:bg-gray-200 dark:hover:bg-[#1E2640]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-[#13182E] border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#1A2139]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Gig
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] dark:text-[#8B92A3] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2640]">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#1A2139]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                            #{order.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {order.buyer?.avatar_url ? (
                              <img
                                src={order.buyer.avatar_url}
                                alt={order.buyer.name}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                                <Icon name="User" size={16} className="text-workflow-primary" />
                              </div>
                            )}
                            <span className="text-sm text-[#0F172A] dark:text-[#E8EAED]">
                              {order.buyer?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#0F172A] dark:text-[#E8EAED] line-clamp-1">
                            {order.gig?.title || order.title || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                            ${order.price}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] dark:text-[#8B92A3]">
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-workflow-primary hover:text-workflow-primary-600 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Icon name="Inbox" className="w-16 h-16 text-[#64748B] dark:text-[#8B92A3] mx-auto mb-4" />
                        <p className="text-[#64748B] dark:text-[#8B92A3]">No orders found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#13182E] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E2640]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0F172A] dark:text-[#E8EAED]">
                  Order Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setDeliveryFiles([]);
                  }}
                  className="text-[#64748B] dark:text-[#8B92A3] hover:text-[#0F172A] dark:hover:text-[#E8EAED]"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Order ID</p>
                  <p className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                    #{selectedOrder.id.slice(0, 8)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Buyer</p>
                  <div className="flex items-center gap-3">
                    {selectedOrder.buyer?.avatar_url ? (
                      <img
                        src={selectedOrder.buyer.avatar_url}
                        alt={selectedOrder.buyer.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-workflow-primary/10 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-workflow-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                        {selectedOrder.buyer?.name || 'Unknown'}
                      </p>
                      <Link
                        to={`/talent/messages?user=${selectedOrder.buyer_id}`}
                        className="text-xs text-workflow-primary hover:underline"
                      >
                        Send Message
                      </Link>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Gig</p>
                  <p className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED]">
                    {selectedOrder.gig?.title || selectedOrder.title || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Description</p>
                  <p className="text-sm text-[#0F172A] dark:text-[#E8EAED]">
                    {selectedOrder.description || 'No description'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Price</p>
                    <p className="text-lg font-bold text-[#0F172A] dark:text-[#E8EAED]">
                      ${selectedOrder.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3] mb-1">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {selectedOrder.status === 'in_progress' && (
                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                    <p className="text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-3">
                      Deliver Order
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setDeliveryFiles(Array.from(e.target.files))}
                      className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] mb-3"
                    />
                    <button
                      onClick={() => handleDeliverOrder(selectedOrder.id)}
                      className="w-full btn-primary"
                    >
                      Deliver Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentOrders;









