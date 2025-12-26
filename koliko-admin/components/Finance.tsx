
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Transaction } from '../types';
import { Download, TrendingUp, TrendingDown, DollarSign, Filter, Search } from 'lucide-react';

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [trxData, summaryData] = await Promise.all([
      api.finance.getTransactions(),
      api.finance.getSummary()
    ]);
    setTransactions(trxData);
    setSummary(summaryData);
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Finance Overview</h1>
        <button className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">GH₵{summary.totalIncome.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-4 flex items-center">
            <TrendingUp size={12} className="mr-1" /> +12% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">GH₵{summary.totalExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-4 flex items-center">
            <TrendingUp size={12} className="mr-1" /> +5% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">GH₵{summary.netProfit.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-4 font-medium">
            Healthy profit margin
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reference or description..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="All">All Transactions</option>
              <option value="Credit">Income (Credit)</option>
              <option value="Debit">Expenses (Debit)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Reference</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading transactions...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">No transactions found.</td></tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{trx.reference}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{trx.date}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{trx.description}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">{trx.category}</span>
                    </td>
                    <td className={`p-4 text-right font-medium ${
                      trx.type === 'Credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {trx.type === 'Credit' ? '+' : '-'}GH₵{trx.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        trx.status === 'Completed' ? 'bg-green-500' : trx.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-gray-600 dark:text-gray-300 text-xs">{trx.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
