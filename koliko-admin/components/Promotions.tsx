
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Promotion } from '../types';
import { Plus, Trash2, Calendar, Tag, Copy, Check, Power } from 'lucide-react';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minOrder, setMinOrder] = useState(0);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    const data = await api.promotions.getAll();
    setPromotions(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      await api.promotions.delete(id);
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleToggle = async (id: string) => {
    const updated = await api.promotions.toggleStatus(id);
    if (updated) {
      setPromotions(promotions.map(p => p.id === id ? updated : p));
    }
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo = await api.promotions.create({
      code: newCode.toUpperCase(),
      type: discountType,
      value: discountValue,
      startDate,
      endDate,
      minOrderAmount: minOrder || undefined
    });
    setPromotions([newPromo, ...promotions]);
    setIsModalOpen(false);
    // Reset form
    setNewCode('');
    setDiscountValue(0);
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Promotions & Discounts</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Promotion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div key={promo.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border ${promo.status === 'active' ? 'border-indigo-100 dark:border-indigo-900/30' : 'border-gray-200 dark:border-slate-700'} overflow-hidden relative group`}>
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Code</span>
                    <button 
                      onClick={() => handleCopy(promo.id, promo.code)}
                      className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center hover:text-indigo-700"
                    >
                      {promo.code}
                      {copiedId === promo.id ? <Check size={16} className="ml-2 text-green-500" /> : <Copy size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />}
                    </button>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    promo.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                  }`}>
                    {promo.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                   <Tag size={16} className="text-indigo-500" />
                   <span className="font-medium">
                     {promo.type === 'percentage' ? `${promo.value}% OFF` : `GH₵${promo.value} OFF`}
                   </span>
                   {promo.minOrderAmount && <span className="text-xs text-gray-500">(Min order: GH₵{promo.minOrderAmount})</span>}
                </div>

                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                   <Calendar size={16} />
                   <span>Valid: {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}</span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 mb-2">
                   <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(promo.usageCount, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{promo.usageCount} uses</p>
             </div>

             <div className="bg-gray-50 dark:bg-slate-900/50 p-3 flex justify-between items-center border-t border-gray-100 dark:border-slate-700">
                <button 
                  onClick={() => handleToggle(promo.id)}
                  className={`text-xs font-medium flex items-center space-x-1 ${promo.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                >
                  <Power size={14} />
                  <span>{promo.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                </button>
                <button 
                  onClick={() => handleDelete(promo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
             </div>
          </div>
        ))}
        
        {/* Empty State Create Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-all min-h-[250px]"
        >
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-full mb-3">
             <Plus size={32} />
          </div>
          <span className="font-medium">Create New Code</span>
        </button>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Create New Promotion</h2>
             <form onSubmit={handleCreate} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Promo Code</label>
                   <input 
                     type="text" required
                     placeholder="e.g. SUMMER24"
                     className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                     value={newCode}
                     onChange={(e) => setNewCode(e.target.value)}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                     <select 
                       className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                       value={discountType}
                       onChange={(e) => setDiscountType(e.target.value as any)}
                     >
                       <option value="percentage">Percentage (%)</option>
                       <option value="fixed">Fixed Amount (GH₵)</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                     <input 
                       type="number" required min="1"
                       className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                       value={discountValue || ''}
                       onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                     />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                     <input 
                       type="date" required
                       className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                       value={startDate}
                       onChange={(e) => setStartDate(e.target.value)}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                     <input 
                       type="date" required
                       className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                       value={endDate}
                       onChange={(e) => setEndDate(e.target.value)}
                     />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Order Amount (Optional)</label>
                   <input 
                     type="number" min="0"
                     placeholder="0.00"
                     className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                     value={minOrder || ''}
                     onChange={(e) => setMinOrder(parseFloat(e.target.value))}
                   />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Promotion
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
