import React from 'react';
import { Order } from '../../types';
import { Button } from '../ui/button';
import { Clock, CheckCircle, AlertCircle, User, Hash } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'preparing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ready':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'delivered':
      return 'bg-gray-100 text-gray-800 border-gray-200';
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

const getNextStatus = (status: Order['status']): Order['status'] | null => {
  switch (status) {
    case 'pending':
      return 'preparing';
    case 'preparing':
      return 'ready';
    case 'ready':
      return 'delivered';
    case 'delivered':
      return null;
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
  const nextStatus = getNextStatus(order.status);
  
  return (
    <div className="bg-white rounded-lg border border-[#e5e8ea] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-[#607589]" />
            <span className="font-bold text-[#111416]">{order.id}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#111416]">R$ {order.total.toFixed(2)}</p>
          <p className="text-sm text-[#607589]">
            {order.createdAt.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#607589]" />
          <span className="text-[#607589]">{order.customerName}</span>
        </div>
        {order.tableNumber && (
          <div className="flex items-center gap-2">
            <span className="text-[#607589]">Mesa {order.tableNumber}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-[#e5e8ea] last:border-b-0">
            <div>
              <span className="font-medium text-[#111416]">{item.quantity}x {item.menuItem.name}</span>
              {item.notes && (
                <p className="text-sm text-[#607589] mt-1">Obs: {item.notes}</p>
              )}
            </div>
            <span className="text-[#607589]">
              R$ {(item.menuItem.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      {nextStatus && (
        <Button
          onClick={() => onUpdateStatus(order.id, nextStatus)}
          className="w-full bg-[#0c7ff2] hover:bg-[#0c7ff2]/90"
        >
          Marcar como {getStatusText(nextStatus)}
        </Button>
      )}
    </div>
  );
};