import React, { useEffect, useState } from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import {
  SalesByCategoryChart,
  SalesByCategoryData,
} from "../../components/dashboard/SalesByCategoryChart";
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

export const Dashboard: React.FC<{ onTabChange: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<SalesByCategoryData[]>(
    []
  );
  const [activeCustomers, setActiveCustomers] = useState<number>(0);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Dashboard: Iniciando carregamento de dados...");

        const [statsData, ordersData, salesData, customersData, growthData] =
          await Promise.all([
            getDashboardStats(),
            getOrders(),
            getSalesByCategory(),
            getActiveCustomers(),
            getRevenueGrowth(),
          ]);

        console.log("Dashboard: Dados recebidos:");
        console.log("- Stats:", statsData);
        console.log("- Orders:", ordersData);
        console.log("- Sales by Category:", salesData);
        console.log("- Active Customers:", customersData);
        console.log("- Revenue Growth:", growthData);

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

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center text-gray-500">
          Carregando dados do dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
          <p className="font-bold">Ocorreu um erro:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600 text-sm md:text-base">
            Bem-vindo de volta! Aqui está o resumo do seu restaurante hoje.
          </p>
        </div>

        {/* Stats Cards - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
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

        {/* Main Content Area - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders on the left for larger screens */}
          <div className="lg:col-span-2">
            <RecentOrders
              orders={orders.slice(0, 5)}
              onViewAllClick={() => onTabChange("orders")}
            />
          </div>

          {/* Quick Stats and Sales by Category on the right */}
          <div className="space-y-6">
            <SalesByCategoryChart
              data={salesByCategory}
              isLoading={isLoading}
            />

            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Estatísticas Rápidas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                    className={`text-base md:text-lg font-bold ${
                      revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {revenueGrowth >= 0 ? "+" : ""}
                    {revenueGrowth.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Clientes Ativos
                      </p>
                      <p className="text-xs text-gray-500">últimos 30 dias</p>
                    </div>
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-900">
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
