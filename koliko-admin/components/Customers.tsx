import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Customer } from '../types';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag,
  Ban,
  CheckCircle,
  Eye,
  User
} from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const fetchCustomers = async () => {
    setLoading(true);
    const data = await api.customers.getAll();
    setCustomers(data);
    setLoading(false);
  };

  const filterCustomers = () => {
    let result = [...customers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    setFilteredCustomers(result);
  };

  const toggleCustomerStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this customer?`)) {
      await api.customers.updateStatus(id, newStatus);
      // Optimistic update
      setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer({ ...selectedCustomer, status: newStatus });
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{customers.length} total registered users</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Orders</th>
                <th className="p-4 font-semibold">Total Spent</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading customers...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                          {customer.avatarUrl ? (
                            <img src={customer.avatarUrl} alt={customer.name} className="h-full w-full object-cover" />
                          ) : (
                            <User size={20} className="text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs">
                          <Mail size={12} className="mr-1.5" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs">
                          <Phone size={12} className="mr-1.5" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <ShoppingBag size={14} className="mr-1.5 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      GH₵{customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {customer.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => toggleCustomerStatus(customer.id, customer.status)}
                          className={`p-1.5 rounded transition-colors ${
                            customer.status === 'active' 
                              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30' 
                              : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30'
                          }`}
                          title={customer.status === 'active' ? "Suspend Account" : "Activate Account"}
                        >
                          {customer.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transition-colors">
            <div className="bg-slate-900 dark:bg-slate-950 p-6 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                 <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 p-1">
                   <img 
                     src={selectedCustomer.avatarUrl || `https://ui-avatars.com/api/?name=${selectedCustomer.name}`} 
                     alt={selectedCustomer.name} 
                     className="h-full w-full rounded-full object-cover" 
                   />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-white">{selectedCustomer.name}</h2>
                   <div className="flex items-center space-x-2 mt-1">
                     <span className="text-gray-300 text-sm">{selectedCustomer.id}</span>
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                       selectedCustomer.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                     }`}>
                       {selectedCustomer.status}
                     </span>
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</h3>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Mail size={18} className="text-indigo-500" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Phone size={18} className="text-indigo-500" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</h3>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Calendar size={18} className="text-indigo-500" />
                    <span>Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <ShoppingBag size={18} className="text-indigo-500" />
                    <span>Last Active: {new Date(selectedCustomer.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-white">Overview Stats</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{selectedCustomer.totalOrders}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Total Orders</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">GH₵{selectedCustomer.totalSpent.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Total Spent</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">GH₵{(selectedCustomer.totalSpent / (selectedCustomer.totalOrders || 1)).toFixed(2)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Avg. Order</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                 <button 
                  onClick={() => toggleCustomerStatus(selectedCustomer.id, selectedCustomer.status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCustomer.status === 'active' 
                      ? 'border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border border-green-200 dark:border-green-900 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  {selectedCustomer.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                </button>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                  onClick={() => window.alert('Reset Password email sent!')}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;