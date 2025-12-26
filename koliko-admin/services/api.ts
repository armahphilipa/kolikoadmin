

import { MOCK_PRODUCTS, MOCK_ORDERS, REVENUE_DATA, SALES_BY_CATEGORY, PAYMENT_METHODS, TOP_SELLING_PRODUCTS, MOCK_CUSTOMERS, MOCK_REPAIRS, MOCK_TRANSACTIONS, MOCK_INVENTORY_LOGS, MOCK_PROMOTIONS } from '../constants';
import { Product, Order, OrderStatus, Customer, RepairRequest, RepairStatus, Transaction, InventoryLog, Promotion } from '../types';

/**
 * In a real application, this service would import the supabase client
 * and perform SQL queries. Here, we simulate async delays and data manipulation.
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(800);
      if (email === 'admin@koliko.com' && password === 'admin') {
        return { user: { email, role: 'admin', id: 'adm_123' }, session: 'mock_token' };
      }
      throw new Error('Invalid credentials');
    },
    logout: async () => {
      await delay(500);
      return true;
    }
  },

  products: {
    getAll: async (): Promise<Product[]> => {
      await delay(600);
      return [...MOCK_PRODUCTS];
    },
    update: async (product: Product): Promise<Product> => {
      await delay(400);
      // Simulate update logic
      return product;
    },
    create: async (product: Omit<Product, 'id'>): Promise<Product> => {
      await delay(400);
      return { ...product, id: Math.random().toString(36).substr(2, 9) };
    },
    delete: async (id: string): Promise<boolean> => {
      await delay(400);
      return true;
    }
  },

  orders: {
    getAll: async (): Promise<Order[]> => {
      await delay(600);
      return [...MOCK_ORDERS];
    },
    update: async (orderId: string, updates: Partial<Order>): Promise<Order | null> => {
      await delay(400);
      const order = MOCK_ORDERS.find(o => o.id === orderId);
      if (order) {
        Object.assign(order, updates);
        return { ...order };
      }
      return null;
    }
  },

  customers: {
    getAll: async (): Promise<Customer[]> => {
      await delay(600);
      return [...MOCK_CUSTOMERS];
    },
    updateStatus: async (customerId: string, status: 'active' | 'suspended'): Promise<Customer | null> => {
      await delay(300);
      const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
      if (customer) {
        return { ...customer, status };
      }
      return null;
    }
  },
  
  repairs: {
    getAll: async (): Promise<RepairRequest[]> => {
      await delay(500);
      return [...MOCK_REPAIRS];
    },
    update: async (id: string, updates: Partial<RepairRequest>): Promise<RepairRequest | null> => {
      await delay(300);
      const repair = MOCK_REPAIRS.find(r => r.id === id);
      if (repair) {
        return { ...repair, ...updates };
      }
      return null;
    },
    create: async (request: Omit<RepairRequest, 'id'>): Promise<RepairRequest> => {
      await delay(600);
      return {
        ...request,
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}` // Generate ID like REP-1234
      };
    }
  },

  analytics: {
    getRevenue: async () => {
      await delay(500);
      return REVENUE_DATA;
    },
    getCategorySales: async () => {
      await delay(500);
      return SALES_BY_CATEGORY;
    },
    getPaymentStats: async () => {
      await delay(500);
      return PAYMENT_METHODS;
    },
    getTopSellingProducts: async () => {
      await delay(500);
      return TOP_SELLING_PRODUCTS;
    }
  },

  finance: {
    getTransactions: async (): Promise<Transaction[]> => {
      await delay(700);
      return [...MOCK_TRANSACTIONS];
    },
    getSummary: async () => {
      await delay(500);
      // Calc mocks
      const income = MOCK_TRANSACTIONS.filter(t => t.type === 'Credit').reduce((acc, t) => acc + t.amount, 0);
      const expense = MOCK_TRANSACTIONS.filter(t => t.type === 'Debit').reduce((acc, t) => acc + t.amount, 0);
      return {
        totalIncome: income,
        totalExpenses: expense,
        netProfit: income - expense
      };
    }
  },

  inventory: {
    getLogs: async (): Promise<InventoryLog[]> => {
      await delay(600);
      return [...MOCK_INVENTORY_LOGS];
    },
    adjustStock: async (productId: string, adjustment: number, reason: InventoryLog['reason'], user: string): Promise<InventoryLog> => {
      await delay(400);
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      if (product) {
        product.stock += adjustment;
        // In a real app we'd create a new log in DB
        const newLog: InventoryLog = {
          id: `LOG-${Math.floor(Math.random() * 10000)}`,
          productId,
          productName: product.name,
          change: adjustment,
          currentStock: product.stock,
          reason,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user
        };
        MOCK_INVENTORY_LOGS.unshift(newLog);
        return newLog;
      }
      throw new Error("Product not found");
    }
  },

  promotions: {
    getAll: async (): Promise<Promotion[]> => {
      await delay(500);
      return [...MOCK_PROMOTIONS];
    },
    create: async (promo: Omit<Promotion, 'id' | 'usageCount' | 'status'>): Promise<Promotion> => {
      await delay(500);
      const newPromo: Promotion = {
        ...promo,
        id: `PRO-${Math.floor(Math.random() * 1000)}`,
        usageCount: 0,
        status: 'active'
      };
      MOCK_PROMOTIONS.unshift(newPromo);
      return newPromo;
    },
    delete: async (id: string): Promise<void> => {
      await delay(400);
      const idx = MOCK_PROMOTIONS.findIndex(p => p.id === id);
      if (idx > -1) MOCK_PROMOTIONS.splice(idx, 1);
    },
    toggleStatus: async (id: string): Promise<Promotion | null> => {
      await delay(300);
      const promo = MOCK_PROMOTIONS.find(p => p.id === id);
      if (promo) {
        promo.status = promo.status === 'active' ? 'expired' : 'active';
        return promo;
      }
      return null;
    }
  },
  
  settings: {
    updateProfile: async (data: any) => {
      await delay(800);
      return true;
    },
    updatePreferences: async (data: any) => {
      await delay(500);
      return true;
    }
  },

  storage: {
    upload: async (file: File): Promise<string> => {
      await delay(1500); // Simulate upload time
      // In a real Supabase app, you would use:
      // const { data, error } = await supabase.storage.from('products').upload(`public/${file.name}`, file);
      // return supabase.storage.from('products').getPublicUrl(data.path).data.publicUrl;
      
      // For mock, return a randomly chosen picsum image to simulate a hosted URL, 
      // or create a local object URL (though that won't persist across refresh really well, it's good for demo)
      return URL.createObjectURL(file);
    }
  }
};