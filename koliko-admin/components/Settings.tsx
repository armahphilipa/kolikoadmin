
import React, { useState } from 'react';
import { api } from '../services/api';
import { User, Bell, Globe, Save, Lock, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'system'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@koliko.com',
    currentPassword: '',
    newPassword: ''
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    lowStock: true,
    newOrders: true,
    weeklyReports: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await api.settings.updateProfile(profile);
    setLoading(false);
    alert('Settings saved successfully!');
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
        activeTab === id 
        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <TabButton id="profile" label="Profile & Security" icon={User} />
          <TabButton id="notifications" label="Notifications" icon={Bell} />
          <TabButton id="system" label="System Preferences" icon={Globe} />
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSave}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div className="flex items-center space-x-4 mb-8">
                    <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      AD
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Account</h3>
                      <button type="button" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Change Avatar</button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        value={profile.email}
                        disabled
                      />
                    </div>
                 </div>

                 <div className="border-t border-gray-100 dark:border-slate-700 pt-6 mt-6">
                    <h4 className="text-md font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Lock size={18} className="mr-2 text-gray-400" />
                      Change Password
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'newOrders', label: 'New Order Alerts', desc: 'Get notified when a customer places an order.' },
                    { key: 'lowStock', label: 'Low Stock Warnings', desc: 'Receive alerts when product stock falls below 10.' },
                    { key: 'weeklyReports', label: 'Weekly Performance Reports', desc: 'Summary of sales and revenue sent every Monday.' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* System Tab */}
             {activeTab === 'system' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                        <select className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                          <option value="GHS">Ghana Cedis (GH₵)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                         <select className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                          <option value="GMT">Greenwich Mean Time (GMT)</option>
                          <option value="EST">Eastern Standard Time (EST)</option>
                        </select>
                     </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                     <h4 className="text-red-700 dark:text-red-400 font-bold flex items-center mb-2">
                       <Shield size={18} className="mr-2" />
                       Danger Zone
                     </h4>
                     <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                       Irreversible actions regarding your data.
                     </p>
                     <button type="button" className="bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-900 px-4 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium">
                       Clear Cache & Restart
                     </button>
                  </div>
               </div>
             )}

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-md transition-transform active:scale-95"
              >
                <Save size={18} className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
