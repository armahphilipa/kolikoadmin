import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import { MonthlyRevenue } from '../types';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-500 flex items-center font-medium">
        <TrendingUp size={16} className="mr-1" />
        {change}
      </span>
      <span className="text-gray-400 dark:text-gray-500 ml-2">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.analytics.getRevenue();
      setRevenueData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-indigo-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <div className="flex space-x-2">
           <select className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
             <option>Last 7 Days</option>
             <option>Last 30 Days</option>
             <option>This Year</option>
           </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="GH₵54,230" 
          change="+12.5%" 
          icon={DollarSign} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Total Orders" 
          value="1,250" 
          change="+8.2%" 
          icon={ShoppingCart} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="New Customers" 
          value="340" 
          change="+2.4%" 
          icon={Users} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Products Sold" 
          value="890" 
          change="+18.7%" 
          icon={Package} 
          color="bg-purple-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 transition-colors">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Revenue Analytics</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--chart-text)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--chart-text)'}} tickFormatter={(value) => `GH₵${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px', 
                    border: '1px solid var(--chart-grid)', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                  itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                  formatter={(value: number) => [`GH₵${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 transition-colors">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Orders Overview</h2>
          <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--chart-text)'}} />
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
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;