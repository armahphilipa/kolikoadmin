import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { Eye, Download, Search, RefreshCw, X, Calendar, User, CreditCard, Package, Loader2 } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalStatus, setModalStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [modalDeliveryDate, setModalDeliveryDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await api.orders.getAll();
    setOrders(data);
    setLoading(false);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300';
    }
  };

  const handleTableStatusChange = async (order: Order, newStatus: OrderStatus) => {
     // If changing to SHIPPED from table, open modal to allow setting date
     if (newStatus === OrderStatus.SHIPPED && order.status !== OrderStatus.SHIPPED) {
         handleViewOrder(order);
         setModalStatus(OrderStatus.SHIPPED); // Pre-set the dropdown in modal
         return;
     }

     const updated = await api.orders.update(order.id, { status: newStatus });
     if (updated) {
        setOrders(orders.map(o => o.id === updated.id ? updated : o));
     }
  };

  const handleViewOrder = (order: Order) => {
      setSelectedOrder(order);
      setModalStatus(order.status);
      setModalDeliveryDate(order.estimatedDeliveryDate || '');
      setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
      if (!selectedOrder) return;
      setIsSaving(true);
      
      const updates: Partial<Order> = {
          status: modalStatus,
          estimatedDeliveryDate: modalDeliveryDate || undefined
      };

      const updated = await api.orders.update(selectedOrder.id, updates);
      if (updated) {
          setOrders(orders.map(o => o.id === updated.id ? updated : o));
          setIsModalOpen(false);
      }
      setIsSaving(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Management</h1>
        <button 
          onClick={fetchOrders}
          className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg w-full text-sm outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" />
          </div>
          <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading orders...</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {order.customerId}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                        <div>{order.date}</div>
                        {order.estimatedDeliveryDate && (
                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                Est: {order.estimatedDeliveryDate}
                            </div>
                        )}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{order.paymentMethod}</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">GH₵{order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleTableStatusChange(order, e.target.value as OrderStatus)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-none outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                         {Object.values(OrderStatus).map((status) => (
                           <option key={status} value={status}>{status}</option>
                         ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
             <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                <div>
                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">Order Details</h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400">#{selectedOrder.id}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                   <X size={24} />
                </button>
             </div>

             <div className="p-6">
                 {/* Status & Delivery Section */}
                 <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6 border border-indigo-100 dark:border-indigo-900/50">
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 uppercase tracking-wide flex items-center">
                        <Package size={16} className="mr-2" />
                        Update Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">Order Status</label>
                            <select 
                              value={modalStatus}
                              onChange={(e) => setModalStatus(e.target.value as OrderStatus)}
                              className="w-full p-2 border border-indigo-200 dark:border-indigo-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm"
                            >
                                {Object.values(OrderStatus).map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        
                        {(modalStatus === OrderStatus.SHIPPED || modalDeliveryDate) && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">Estimated Delivery Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-indigo-400" size={16} />
                                    <input 
                                        type="date"
                                        value={modalDeliveryDate}
                                        onChange={(e) => setModalDeliveryDate(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-indigo-200 dark:border-indigo-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Customer Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            <User size={16} className="mr-2 text-gray-400" />
                            Customer Information
                        </h3>
                        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg space-y-2 text-sm text-gray-900 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                                <span className="font-medium">{selectedOrder.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Customer ID:</span>
                                <span className="font-medium">{selectedOrder.customerId}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                <span className="font-medium">customer@example.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            <CreditCard size={16} className="mr-2 text-gray-400" />
                            Payment Details
                        </h3>
                        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg space-y-2 text-sm text-gray-900 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Method:</span>
                                <span className="font-medium">{selectedOrder.paymentMethod}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                                <span className="font-medium">{selectedOrder.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                                <span className="font-bold text-green-600 dark:text-green-400">GH₵{selectedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Order Items */}
                 <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Order Items</h3>
                    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-3">Product</th>
                                    <th className="p-3 text-center">Qty</th>
                                    <th className="p-3 text-right">Price</th>
                                    <th className="p-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {selectedOrder.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{item.productName}</td>
                                        <td className="p-3 text-center text-gray-600 dark:text-gray-300">{item.quantity}</td>
                                        <td className="p-3 text-right text-gray-600 dark:text-gray-300">GH₵{item.price.toFixed(2)}</td>
                                        <td className="p-3 text-right font-medium text-gray-900 dark:text-white">GH₵{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
             </div>

             <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end space-x-3 bg-gray-50 dark:bg-slate-800/50 rounded-b-xl">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-gray-200 dark:hover:border-slate-600 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-sm disabled:opacity-70"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
                  Save Changes
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;