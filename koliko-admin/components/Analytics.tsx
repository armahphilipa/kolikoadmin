
import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { AnalyticsData } from '../types';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

const Analytics: React.FC = () => {
  const [salesCategory, setSalesCategory] = useState<AnalyticsData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<AnalyticsData[]>([]);
  const [topSelling, setTopSelling] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const cats = await api.analytics.getCategorySales();
      const pays = await api.analytics.getPaymentStats();
      const top = await api.analytics.getTopSellingProducts();
      setSalesCategory(cats);
      setPaymentMethods(pays);
      setTopSelling(top);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Advanced Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales by Category Pie */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Sales by Category</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px', 
                    border: '1px solid var(--chart-grid)', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                  itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                />
                <Legend formatter={(value) => <span style={{ color: 'var(--chart-text)' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Bar */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Payment Methods (%)</h3>
           <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethods} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: 'var(--chart-text)'}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px', 
                    border: '1px solid var(--chart-grid)', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                  itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Top 5 Best-Selling Products (Qty)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSelling} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--chart-text)'}} interval={0} height={50} tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--chart-text)'}} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ 
                  backgroundColor: 'var(--chart-tooltip-bg)', 
                  color: 'var(--chart-tooltip-text)',
                  borderRadius: '8px', 
                  border: '1px solid var(--chart-grid)', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
                itemStyle={{ color: 'var(--chart-tooltip-text)' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Inventory Health</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Real-time tracking of low stock items and turnover rates.</p>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 dark:bg-slate-900">
                 <tr className="text-gray-600 dark:text-gray-400">
                   <th className="p-3 font-semibold">Product Name</th>
                   <th className="p-3 font-semibold">Category</th>
                   <th className="p-3 font-semibold">Stock Level</th>
                   <th className="p-3 font-semibold">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                 <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-3 text-gray-900 dark:text-white">Urban Street Loafer</td>
                    <td className="p-3 text-gray-500 dark:text-gray-400">Casual</td>
                    <td className="p-3 text-orange-600 dark:text-orange-400 font-medium">12 (Low)</td>
                    <td className="p-3"><span className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full text-xs">Reorder Soon</span></td>
                 </tr>
                 <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-3 text-gray-900 dark:text-white">Velocity Trainer</td>
                    <td className="p-3 text-gray-500 dark:text-gray-400">Sports</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-medium">0 (Out)</td>
                    <td className="p-3"><span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full text-xs">Restock Urgent</span></td>
                 </tr>
               </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default Analytics;
