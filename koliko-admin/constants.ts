

import { Product, Order, OrderStatus, MonthlyRevenue, AnalyticsData, Customer, Notification, RepairRequest, Transaction, InventoryLog, Promotion } from './types';

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Koliko Runner V1',
    price: 89.99,
    category: 'Sneakers',
    stock: 45,
    imageUrl: 'https://image2url.com/images/1765484875219-fc943c6f-ebe5-4986-a8cd-ba5980bd0a74.jpg',
    images: ['https://image2url.com/images/1765487016376-deae2ae9-fd83-4e8f-9b39-2c8150f27bbe.jpg', 'https://image2url.com/images/1765484350766-60230db3-bac5-4e73-b940-035f87b25d8a.jpg'],
    status: 'active',
    description: 'High performance running shoes.'
  },
  {
    id: '2',
    name: 'Urban Street Loafer',
    price: 120.00,
    category: 'Casual',
    stock: 12,
    imageUrl: 'https://image2url.com/images/1765484875219-fc943c6f-ebe5-4986-a8cd-ba5980bd0a74.jpg',
    images: ['https://image2url.com/images/1765487016376-deae2ae9-fd83-4e8f-9b39-2c8150f27bbe.jpg', 'https://image2url.com/images/1765484875219-fc943c6f-ebe5-4986-a8cd-ba5980bd0a74.jpg'],
    status: 'active',
    description: 'Stylish leather loafers.'
  },
  {
    id: '3',
    name: 'Velocity Trainer',
    price: 95.50,
    category: 'Sports',
    stock: 0,
    imageUrl: 'https://image2url.com/images/1765484251376-58a439e5-d73c-4bc0-a0bb-8f9260031019.jpg',
    images: ['https://image2url.com/images/1765484251376-58a439e5-d73c-4bc0-a0bb-8f9260031019.jpg'],
    status: 'inactive',
    description: 'Lightweight training shoes.'
  },
  {
    id: '4',
    name: 'Summer Breeze Sandal',
    price: 45.00,
    category: 'Sandals',
    stock: 100,
    imageUrl: 'https://image2url.com/images/1765485101583-079f8357-8949-40f0-9181-13da4e927f90.jpg',
    images: ['https://image2url.com/images/1765485101583-079f8357-8949-40f0-9181-13da4e927f90.jpg'],
    status: 'active',
    description: 'Comfortable summer wear.'
  },
  {
    id: '5',
    name: 'Classic High Top',
    price: 75.00,
    category: 'Sneakers',
    stock: 23,
    imageUrl: 'https://image2url.com/images/1765486903823-9ddf4dce-f1cd-4bbe-8e7f-940f2941cfb2.jpg',
    images: ['https://image2url.com/images/1765486903823-9ddf4dce-f1cd-4bbe-8e7f-940f2941cfb2.jpg'],
    status: 'active',
    description: 'Old school cool.'
  }
];

// Mock Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7721',
    customerId: 'CUST-001',
    customerName: 'John Doe',
    total: 179.98,
    status: OrderStatus.DELIVERED,
    date: '2023-10-25',
    paymentMethod: 'Visa',
    trackingNumber: 'TRK-123456',
    items: [
      { productId: '1', productName: 'Koliko Runner V1', quantity: 2, price: 89.99 }
    ]
  },
  {
    id: 'ORD-7722',
    customerId: 'CUST-002',
    customerName: 'Jane Smith',
    total: 120.00,
    status: OrderStatus.PROCESSING,
    date: '2023-10-26',
    paymentMethod: 'Mobile Money',
    items: [
      { productId: '2', productName: 'Urban Street Loafer', quantity: 1, price: 120.00 }
    ]
  },
  {
    id: 'ORD-7723',
    customerId: 'CUST-003',
    customerName: 'Michael Brown',
    total: 45.00,
    status: OrderStatus.PENDING,
    date: '2023-10-27',
    paymentMethod: 'Google Pay',
    items: [
      { productId: '4', productName: 'Summer Breeze Sandal', quantity: 1, price: 45.00 }
    ]
  },
  {
    id: 'ORD-7724',
    customerId: 'CUST-004',
    customerName: 'Sarah Connor',
    total: 225.00,
    status: OrderStatus.SHIPPED,
    date: '2023-10-27',
    paymentMethod: 'Visa',
    trackingNumber: 'DHL-998877',
    estimatedDeliveryDate: '2023-10-31',
    items: [
      { productId: '5', productName: 'Classic High Top', quantity: 3, price: 75.00 }
    ]
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+233 20 123 4567',
    totalOrders: 15,
    totalSpent: 1250.50,
    status: 'active',
    joinDate: '2023-01-15',
    lastActive: '2023-10-25',
    avatarUrl: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 'CUST-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+233 24 987 6543',
    totalOrders: 8,
    totalSpent: 850.00,
    status: 'active',
    joinDate: '2023-03-22',
    lastActive: '2023-10-26',
    avatarUrl: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 'CUST-003',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '+233 50 555 1234',
    totalOrders: 3,
    totalSpent: 135.00,
    status: 'suspended',
    joinDate: '2023-06-10',
    lastActive: '2023-09-15',
    avatarUrl: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: 'CUST-004',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    phone: '+233 27 444 9999',
    totalOrders: 22,
    totalSpent: 3450.75,
    status: 'active',
    joinDate: '2022-11-05',
    lastActive: '2023-10-27',
    avatarUrl: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: 'CUST-005',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+233 26 111 2222',
    totalOrders: 1,
    totalSpent: 45.00,
    status: 'active',
    joinDate: '2023-09-01',
    lastActive: '2023-09-05',
    avatarUrl: 'https://i.pravatar.cc/150?u=5'
  }
];

export const MOCK_REPAIRS: RepairRequest[] = [
  {
    id: 'REP-1001',
    customerName: 'Kofi Mensah',
    email: 'kofi.m@example.com',
    phone: '+233 54 111 2233',
    productName: 'Koliko Runner V1',
    issueDescription: 'Sole separation on the left shoe after 6 months of use.',
    status: 'Pending',
    date: '2023-10-28',
    estimatedCost: 0,
    imageUrl: 'https://picsum.photos/300/200?random=10'
  },
  {
    id: 'REP-1002',
    customerName: 'Ama Serwaa',
    email: 'ama.s@example.com',
    phone: '+233 20 999 8877',
    productName: 'Leather Loafers',
    issueDescription: 'Deep scratch on the toe box, needs polishing and restoration.',
    status: 'In Progress',
    date: '2023-10-25',
    estimatedCost: 85.00,
    imageUrl: 'https://picsum.photos/300/200?random=11',
    estimatedCompletionDate: '2023-11-05'
  },
  {
    id: 'REP-1003',
    customerName: 'Yaw Boateng',
    email: 'yaw.b@example.com',
    phone: '+233 24 555 6666',
    productName: 'Velocity Trainer',
    issueDescription: 'Lace eyelet ripped out.',
    status: 'Completed',
    date: '2023-10-20',
    estimatedCost: 40.00,
    imageUrl: 'https://picsum.photos/300/200?random=12',
    estimatedCompletionDate: '2023-10-22'
  },
  {
    id: 'REP-1004',
    customerName: 'Esi Aidoo',
    email: 'esi.a@example.com',
    phone: '+233 27 777 1111',
    productName: 'Casual Sandals',
    issueDescription: 'Strap broke completely.',
    status: 'Waiting for Parts',
    date: '2023-10-26',
    estimatedCost: 55.00,
    estimatedCompletionDate: '2023-11-10'
  }
];

export const REVENUE_DATA: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 4000, orders: 24 },
  { month: 'Feb', revenue: 3000, orders: 18 },
  { month: 'Mar', revenue: 2000, orders: 12 },
  { month: 'Apr', revenue: 2780, orders: 20 },
  { month: 'May', revenue: 1890, orders: 15 },
  { month: 'Jun', revenue: 2390, orders: 19 },
  { month: 'Jul', revenue: 3490, orders: 28 },
  { month: 'Aug', revenue: 4200, orders: 35 },
  { month: 'Sep', revenue: 5100, orders: 42 },
  { month: 'Oct', revenue: 6000, orders: 50 },
];

export const SALES_BY_CATEGORY: AnalyticsData[] = [
  { name: 'Sneakers', value: 400 },
  { name: 'Casual', value: 300 },
  { name: 'Sports', value: 300 },
  { name: 'Sandals', value: 200 },
];

export const PAYMENT_METHODS: AnalyticsData[] = [
  { name: 'Visa', value: 60 },
  { name: 'Mobile Money', value: 30 },
  { name: 'Google Pay', value: 10 },
];

export const TOP_SELLING_PRODUCTS: AnalyticsData[] = [
  { name: 'Koliko Runner V1', value: 145 },
  { name: 'Urban Street Loafer', value: 120 },
  { name: 'Summer Breeze Sandal', value: 98 },
  { name: 'Classic High Top', value: 75 },
  { name: 'Velocity Trainer', value: 50 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Urban Street Loafer is running low (12 items left).',
    timestamp: '10 min ago',
    isRead: false
  },
  {
    id: 'n2',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-7725 from Michael Brown (GH₵45.00).',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: 'n3',
    type: 'order',
    title: 'Order Delivered',
    message: 'Order #ORD-7721 has been successfully delivered.',
    timestamp: '2 hours ago',
    isRead: true
  },
  {
    id: 'n4',
    type: 'system',
    title: 'System Update',
    message: 'Platform maintenance scheduled for tonight at 2 AM.',
    timestamp: '5 hours ago',
    isRead: true
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-9001', date: '2023-10-27', reference: 'ORD-7724', type: 'Credit', category: 'Order', amount: 225.00, status: 'Completed', description: 'Payment for order #ORD-7724' },
  { id: 'TRX-9002', date: '2023-10-27', reference: 'EXP-101', type: 'Debit', category: 'Expense', amount: 150.00, status: 'Completed', description: 'Office Supplies' },
  { id: 'TRX-9003', date: '2023-10-26', reference: 'ORD-7722', type: 'Credit', category: 'Order', amount: 120.00, status: 'Completed', description: 'Payment for order #ORD-7722' },
  { id: 'TRX-9004', date: '2023-10-25', reference: 'REF-001', type: 'Debit', category: 'Refund', amount: 89.99, status: 'Completed', description: 'Refund for return #RET-202' },
  { id: 'TRX-9005', date: '2023-10-25', reference: 'ORD-7721', type: 'Credit', category: 'Order', amount: 179.98, status: 'Completed', description: 'Payment for order #ORD-7721' },
  { id: 'TRX-9006', date: '2023-10-24', reference: 'SAL-001', type: 'Debit', category: 'Salary', amount: 2500.00, status: 'Completed', description: 'Staff Salaries - October' },
];

export const MOCK_INVENTORY_LOGS: InventoryLog[] = [
  { id: 'LOG-001', productId: '1', productName: 'Koliko Runner V1', change: 10, currentStock: 45, reason: 'Restock', date: '2023-10-27 14:30', user: 'Admin' },
  { id: 'LOG-002', productId: '2', productName: 'Urban Street Loafer', change: -1, currentStock: 12, reason: 'Order', date: '2023-10-26 10:15', user: 'System' },
  { id: 'LOG-003', productId: '3', productName: 'Velocity Trainer', change: -5, currentStock: 0, reason: 'Damage', date: '2023-10-25 09:00', user: 'Admin' },
  { id: 'LOG-004', productId: '4', productName: 'Summer Breeze Sandal', change: 50, currentStock: 100, reason: 'Restock', date: '2023-10-24 16:45', user: 'Manager' },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: 'PRO-1', code: 'WELCOME10', type: 'percentage', value: 10, startDate: '2023-01-01', endDate: '2023-12-31', usageCount: 154, status: 'active', minOrderAmount: 50 },
  { id: 'PRO-2', code: 'FLASH50', type: 'fixed', value: 50, startDate: '2023-10-25', endDate: '2023-10-31', usageCount: 42, status: 'active', minOrderAmount: 200 },
  { id: 'PRO-3', code: 'SUMMER23', type: 'percentage', value: 20, startDate: '2023-06-01', endDate: '2023-08-31', usageCount: 890, status: 'expired' },
];