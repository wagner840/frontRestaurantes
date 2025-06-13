// Mantido para referência, mas não será mais usado diretamente nos pedidos
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

// Tipo para os itens dentro do campo JSONB 'order_items'
export interface OrderItemJson {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  order_id: string;
  created_at: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "completed";
  total_amount: number;
  order_type: "delivery" | "pickup";
  order_items: OrderItemJson[];

  // Campos das tabelas relacionadas
  customer: {
    name: string;
  } | null;

  address: {
    street: string;
    number: string;
    city: string;
  } | null;

  // Campos que não estão no schema mas podem ser úteis no frontend
  // Mapeado de `customer.name` para compatibilidade com componentes existentes
  customerName?: string;
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

export interface Customer {
  customer_id: string;
  name: string;
  whatsapp: string;
  email: string;
  birthday: string | null;
  created_at: string;
}

export interface CustomerDetails {
  totalOrders: number;
  totalSpent: number;
  favoriteDays: string[];
}
