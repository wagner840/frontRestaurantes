export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  total: number;
  createdAt: Date;
  tableNumber?: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeOrders: number;
  completedOrders: number;
}