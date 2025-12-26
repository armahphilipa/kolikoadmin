
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product, InventoryLog } from '../types';
import { Search, RefreshCw, AlertTriangle, PlusCircle, MinusCircle, History } from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<InventoryLog['reason']>('Restock');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [prodData, logData] = await Promise.all([
      api.products.getAll(),
      api.inventory.getLogs()
    ]);
    setProducts(prodData);
    setLogs(logData);
    setLoading(false);
  };

  const handleStockAdjustment = async (productId: string, amount: number, reason: InventoryLog['reason'] = 'Restock') => {
    if (amount === 0) return;
    try {
      await api.inventory.adjustStock(productId, amount, reason, 'Admin');
      // Optimistic update
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: p.stock + amount } : p
      ));
      // Refresh logs
      const updatedLogs = await api.inventory.getLogs();
      setLogs(updatedLogs);
      setAdjustingId(null);
      setAdjustmentValue(0);
    } catch (e) {
      alert('Failed to update stock');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Stock Table */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory Management</h1>
          <button 
            onClick={fetchData} 
            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
               <input
                 type="text"
                 placeholder="Search products..."
                 className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {product.name}
                      <span className="block text-xs text-gray-500 font-normal">{product.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        product.stock === 0 ? 'text-red-600 dark:text-red-400' : 
                        product.stock < 10 ? 'text-orange-600 dark:text-orange-400' : 
                        'text-gray-800 dark:text-gray-200'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.stock === 0 ? (
                        <span className="flex items-center text-red-600 text-xs font-medium"><AlertTriangle size={12} className="mr-1"/> Out of Stock</span>
                      ) : product.stock < 10 ? (
                        <span className="text-orange-600 text-xs font-medium">Low Stock</span>
                      ) : (
                        <span className="text-green-600 text-xs font-medium">In Stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {adjustingId === product.id ? (
                        <div className="flex items-center justify-end space-x-2 animate-in fade-in">
                          <input 
                            type="number" 
                            className="w-16 p-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                            autoFocus
                            placeholder="Qty"
                            value={adjustmentValue || ''}
                            onChange={(e) => setAdjustmentValue(parseInt(e.target.value) || 0)}
                          />
                           <select 
                            className="text-xs p-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                            value={adjustmentReason}
                            onChange={(e) => setAdjustmentReason(e.target.value as any)}
                           >
                             <option value="Restock">Restock</option>
                             <option value="Adjustment">Adjustment</option>
                             <option value="Damage">Damage</option>
                           </select>
                           <button 
                             onClick={() => handleStockAdjustment(product.id, adjustmentValue, adjustmentReason)}
                             className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700"
                           >
                             Save
                           </button>
                           <button 
                             onClick={() => { setAdjustingId(null); setAdjustmentValue(0); }}
                             className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                           >
                             ✕
                           </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                           <button 
                             onClick={() => handleStockAdjustment(product.id, 10, 'Restock')}
                             className="flex items-center text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded hover:bg-green-100 dark:hover:bg-green-900/40"
                           >
                             <PlusCircle size={14} className="mr-1" /> +10
                           </button>
                           <button 
                             onClick={() => { setAdjustingId(product.id); setAdjustmentValue(0); }}
                             className="text-xs border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-slate-700"
                           >
                             Adjust
                           </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* History Log Sidebar */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <History size={20} className="mr-2" />
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 h-[calc(100vh-140px)] overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent history.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4 py-1 relative">
                  <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${
                    log.change > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{log.productName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {log.change > 0 ? 'Added' : 'Removed'} <span className={log.change > 0 ? 'text-green-600' : 'text-red-600'}>{Math.abs(log.change)}</span> units
                    {' • '} {log.reason}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                     <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{log.user}</span>
                     <span className="text-[10px] text-gray-400">{log.date.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
