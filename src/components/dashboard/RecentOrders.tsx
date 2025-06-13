import React from 'react';
import { Order } from '../../types';
import { Clock, CheckCircle, AlertCircle, User, Hash } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <AlertCircle size={16} className="text-amber-500" />;
    case 'preparing':
      return <Clock size={16} className="text-blue-500" />;
    case 'ready':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'delivered':
      return <CheckCircle size={16} className="text-gray-500" />;
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'preparing':
      return 'Preparando';
    case 'ready':
      return 'Pronto';
    case 'delivered':
      return 'Entregue';
  }
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'preparing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ready':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'delivered':
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          Ver todos
        </button>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-gray-400" />
                <span className="font-mono text-sm font-medium text-gray-700">{order.id}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="font-medium text-gray-900">{order.customerName}</span>
              </div>
              
              {order.tableNumber && (
                <span className="text-sm text-gray-500">Mesa {order.tableNumber}</span>
              )}
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                {order.createdAt.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};