import React, { useState } from 'react';
import { OrderCard } from '../../components/orders/OrderCard';
import { orders as initialOrders } from '../../data/mockData';
import { Order } from '../../types';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111416] mb-2">Pedidos</h1>
        <p className="text-[#607589]">Gerencie todos os pedidos do restaurante</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Todos', color: 'bg-gray-100 text-gray-800' },
          { key: 'pending', label: 'Pendentes', color: 'bg-yellow-100 text-yellow-800' },
          { key: 'preparing', label: 'Preparando', color: 'bg-blue-100 text-blue-800' },
          { key: 'ready', label: 'Prontos', color: 'bg-green-100 text-green-800' },
          { key: 'delivered', label: 'Entregues', color: 'bg-gray-100 text-gray-800' },
        ].map(status => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === status.key
                ? 'bg-[#0c7ff2] text-white'
                : `${status.color} hover:opacity-80`
            }`}
          >
            {status.label} ({statusCounts[status.key as keyof typeof statusCounts]})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
};