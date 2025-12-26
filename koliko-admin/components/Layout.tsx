import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  CreditCard, 
  Tags, 
  Box, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  AlertTriangle,
  Info,
  Check,
  Wrench,
  Sun,
  Moon
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
      active 
        ? 'bg-indigo-600 text-white border-r-4 border-indigo-300' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children, onLogout, isDarkMode, toggleTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Overview' },
    { path: '/products', icon: ShoppingBag, label: 'Products' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/repairs', icon: Wrench, label: 'Repairs' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/finance', icon: CreditCard, label: 'Finance' },
    { path: '/promotions', icon: Tags, label: 'Promotions' },
    { path: '/inventory', icon: Box, label: 'Inventory' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 text-white transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-800">
          <span className="text-xl font-bold tracking-wider text-white">
            KOLIKO<span className="text-indigo-400">ADMIN</span>
          </span>
          <button onClick={closeSidebar} className="lg:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={closeSidebar}
            />
          ))}
          
          <div className="mt-auto mb-6 pt-6 border-t border-gray-800">
             <button
              onClick={onLogout}
              className="flex w-full items-center space-x-3 px-6 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm z-10 transition-colors duration-200">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none mr-4"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 border text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
             {/* Theme Toggle */}
             <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-colors ${
                  showNotifications 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
              </button>

              {/* Backdrop for closing */}
              {showNotifications && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
              )}

              {/* Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                  <div className="p-4 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                      >
                        <Check size={12} className="mr-1" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-4 border-b border-gray-50 dark:border-slate-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                            !notification.isRead ? 'bg-indigo-50/40 dark:bg-indigo-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${
                              notification.type === 'stock' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                              notification.type === 'order' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
                            }`}>
                              {notification.type === 'stock' && <AlertTriangle size={16} />} 
                              {notification.type === 'order' && <ShoppingCart size={16} />} 
                              {notification.type === 'system' && <Info size={16} />} 
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-medium truncate ${!notification.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 block">{notification.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/80 text-center border-t border-gray-100 dark:border-slate-700">
                     <button 
                       onClick={() => setShowNotifications(false)}
                       className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                     >
                       Close Notifications
                     </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;