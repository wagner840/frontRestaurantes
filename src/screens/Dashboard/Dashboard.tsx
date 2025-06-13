import React from 'react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { ShoppingBag, DollarSign, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { dashboardStats, orders } from '../../data/mockData';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta! Aqui está o resumo do seu restaurante hoje.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pedidos Hoje"
            value={dashboardStats.totalOrders}
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
            color="bg-blue-500"
          />
          <StatsCard
            title="Receita Hoje"
            value={`R$ ${dashboardStats.revenue.toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            color="bg-green-500"
          />
          <StatsCard
            title="Pedidos Ativos"
            value={dashboardStats.activeOrders}
            icon={Clock}
            color="bg-orange-500"
          />
          <StatsCard
            title="Taxa de Conclusão"
            value="94%"
            icon={CheckCircle}
            trend={{ value: 2, isPositive: true }}
            color="bg-purple-500"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentOrders orders={orders} />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vendas por Categoria</h3>
              <div className="space-y-4">
                {[
                  { category: 'Pratos Principais', value: 45, amount: 'R$ 1.250,00', color: 'bg-blue-500' },
                  { category: 'Entradas', value: 25, amount: 'R$ 680,00', color: 'bg-green-500' },
                  { category: 'Sobremesas', value: 20, amount: 'R$ 420,00', color: 'bg-orange-500' },
                  { category: 'Bebidas', value: 10, amount: 'R$ 290,00', color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Crescimento</p>
                      <p className="text-xs text-gray-500">vs. semana passada</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">+15%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clientes Ativos</p>
                      <p className="text-xs text-gray-500">este mês</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">248</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};