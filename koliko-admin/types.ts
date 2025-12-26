
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export type RepairStatus = 'Pending' | 'In Progress' | 'Waiting for Parts' | 'Completed' | 'Rejected';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string; // Main display image
  images: string[]; // Gallery images
  status: 'active' | 'inactive';
  description?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
  paymentMethod: 'Mobile Money' | 'Visa' | 'Google Pay';
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended';
  joinDate: string;
  lastActive: string;
  avatarUrl?: string;
}

export interface AnalyticsData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface Notification {
  id: string;
  type: 'order' | 'stock' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface RepairRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  issueDescription: string;
  status: RepairStatus;
  date: string;
  estimatedCost: number;
  imageUrl?: string;
  estimatedCompletionDate?: string;
}

export interface Transaction {
  id: string;
  date: string;
  reference: string;
  type: 'Credit' | 'Debit';
  category: 'Order' | 'Refund' | 'Expense' | 'Salary' | 'Inventory';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  change: number;
  currentStock: number;
  reason: 'Restock' | 'Order' | 'Adjustment' | 'Damage' | 'Return';
  date: string;
  user: string;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  status: 'active' | 'expired' | 'scheduled';
  minOrderAmount?: number;
}