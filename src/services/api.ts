import { supabase } from "../lib/supabaseClient";
import { Order, OrderItemJson } from "../types";

const normalizeString = (str: string) => {
  if (typeof str !== "string") return "";
  // Remove parenteses e seu conteúdo, depois trim e lowercase
  return str
    .replace(/\(.*\)/, "")
    .trim()
    .toLowerCase();
};

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customer:customers ( name ),
      address:addresses ( street, number, city )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
  return data || [];
};

export const getDashboardStats = async () => {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("status, total_amount");

  if (ordersError) {
    console.error("Error fetching stats:", ordersError);
    throw ordersError;
  }

  if (!orders) {
    return { totalOrders: 0, revenue: 0, activeOrders: 0, completedOrders: 0 };
  }

  const totalOrders = orders.length;
  const revenue = orders.reduce(
    (sum, order) => sum + (order.total_amount || 0),
    0
  );
  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "preparing", "out_for_delivery"].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) =>
    ["completed", "delivered"].includes(o.status)
  ).length;

  return {
    totalOrders,
    revenue,
    activeOrders,
    completedOrders,
  };
};

export const getMenuItems = async () => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category, name");

  if (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
  return data;
};

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
  return data;
};

export const getSalesByCategory = async () => {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("order_items")
    .in("status", ["completed"]);

  if (ordersError) {
    throw ordersError;
  }
  if (!orders) return [];

  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("name, category");

  if (menuError) {
    throw menuError;
  }
  if (!menuItems) return [];

  const categoryMap = new Map<string, string>();
  menuItems.forEach((item) => {
    // A chave do mapa é o nome normalizado
    categoryMap.set(normalizeString(item.name), item.category);
  });

  const sales = orders.reduce((acc, order) => {
    let items: OrderItemJson[] = [];
    if (typeof order.order_items === "string") {
      try {
        items = JSON.parse(order.order_items);
      } catch (e) {
        console.error("Failed to parse order_items from string:", e);
      }
    } else if (Array.isArray(order.order_items)) {
      items = order.order_items;
    }

    items.forEach((item) => {
      const itemName = (item as any).item_name;
      if (!itemName) return;

      const normalizedItemName = normalizeString(itemName);
      const category = categoryMap.get(normalizedItemName);

      if (category) {
        const saleAmount = item.price * item.quantity;
        acc[category] = (acc[category] || 0) + saleAmount;
      } else {
        const saleAmount = item.price * item.quantity;
        acc["Outros"] = (acc["Outros"] || 0) + saleAmount;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(sales)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getActiveCustomers = async (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const aMonthAgo = date.toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("customer_id")
    .gte("created_at", aMonthAgo)
    .not("customer_id", "is", null);

  if (error) {
    console.error("Error fetching active customers:", error);
    throw error;
  }

  if (!data) return 0;

  const uniqueCustomers = new Set(data.map((order) => order.customer_id));
  return uniqueCustomers.size;
};

export const getRevenueGrowth = async () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const last7DaysStart = new Date(today);
  last7DaysStart.setDate(today.getDate() - 6);

  const previous7DaysStart = new Date(last7DaysStart);
  previous7DaysStart.setDate(last7DaysStart.getDate() - 7);
  const previous7DaysEnd = new Date(last7DaysStart);
  previous7DaysEnd.setDate(last7DaysStart.getDate() - 1);

  const fetchRevenue = async (startDate: Date, endDate: Date) => {
    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .in("status", ["completed", "delivered"])
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) throw error;
    return (
      data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    );
  };

  try {
    const currentWeekRevenue = await fetchRevenue(last7DaysStart, now);
    const previousWeekRevenue = await fetchRevenue(
      previous7DaysStart,
      previous7DaysEnd
    );

    if (previousWeekRevenue === 0) {
      return currentWeekRevenue > 0 ? 100 : 0;
    }

    const growth =
      ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;
    return growth;
  } catch (error) {
    console.error("Error fetching revenue growth:", error);
    throw error;
  }
};

export const getCustomerDetails = async (customerId: string) => {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("customer_id", customerId);

  if (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }

  if (!orders) {
    return {
      totalOrders: 0,
      totalSpent: 0,
      favoriteDays: [],
    };
  }

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.total_amount || 0),
    0
  );

  const dayFrequency = orders.reduce((acc, order) => {
    const day = new Date(order.created_at).toLocaleDateString("pt-BR", {
      weekday: "long",
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoriteDays = Object.entries(dayFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3) // Pega os 3 dias mais frequentes
    .map((entry) => entry[0]);

  return {
    totalOrders: orders.length,
    totalSpent,
    favoriteDays,
  };
};
