import React, { useEffect, useState } from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getDashboardStats,
  getOrders,
  getSalesByCategory,
  getActiveCustomers,
  getRevenueGrowth,
} from "../../services/api";
import { Order, DashboardStats } from "../../types";

interface SalesByCategory {
  category: string;
  amount: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<SalesByCategory[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<number>(0);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsData, ordersData, salesData, customersData, growthData] =
          await Promise.all([
            getDashboardStats(),
            getOrders(),
            getSalesByCategory(),
            getActiveCustomers(),
            getRevenueGrowth(),
          ]);

        setStats(statsData);
        setOrders(ordersData);
        setSalesByCategory(salesData);
        setActiveCustomers(customersData);
        setRevenueGrowth(growthData);
      } catch (err: any) {
        console.error("Dashboard: Falha ao buscar dados:", err);
        setError(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSales = salesByCategory.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const categoryColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-red-500",
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="text-center text-gray-500">
          Carregando dados do dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="text-center text-red-500">
          <p className="font-bold">Ocorreu um erro:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta! Aqui está o resumo do seu restaurante hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pedidos Hoje"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingBag}
            color="bg-blue-500"
          />
          <StatsCard
            title="Receita Hoje"
            value={`R$ ${(stats?.revenue ?? 0).toFixed(2)}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatsCard
            title="Pedidos Ativos"
            value={stats?.activeOrders ?? 0}
            icon={Clock}
            color="bg-orange-500"
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${(
              ((stats?.completedOrders ?? 0) / (stats?.totalOrders ?? 1)) *
              100
            ).toFixed(0)}%`}
            icon={CheckCircle}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentOrders orders={orders.slice(0, 5)} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Vendas por Categoria
              </h3>
              <div className="space-y-4">
                {salesByCategory.length > 0 ? (
                  salesByCategory.map((item, index) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {item.category}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          R$ {item.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            categoryColors[index % categoryColors.length]
                          }`}
                          style={{
                            width: `${
                              (item.amount / (totalSales || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum dado de vendas por categoria disponível.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estatísticas Rápidas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Crescimento
                      </p>
                      <p className="text-xs text-gray-500">vs. 7 dias antes</p>
                    </div>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {revenueGrowth >= 0 ? "+" : ""}
                    {revenueGrowth.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Clientes Ativos
                      </p>
                      <p className="text-xs text-gray-500">últimos 30 dias</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {activeCustomers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
