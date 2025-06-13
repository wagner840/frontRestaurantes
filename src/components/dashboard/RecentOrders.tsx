import React from "react";
import { Order } from "../../types";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Hash,
  Truck,
  Check,
} from "lucide-react";

interface RecentOrdersProps {
  orders: Order[];
}

const getStatusInfo = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return {
        icon: <AlertCircle size={16} className="text-amber-500" />,
        text: "Pendente",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      };
    case "confirmed":
      return {
        icon: <Check size={16} className="text-blue-500" />,
        text: "Confirmado",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "preparing":
      return {
        icon: <Clock size={16} className="text-indigo-500" />,
        text: "Preparando",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      };
    case "out_for_delivery":
      return {
        icon: <Truck size={16} className="text-cyan-500" />,
        text: "Em Entrega",
        color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      };
    case "delivered":
      return {
        icon: <CheckCircle size={16} className="text-green-500" />,
        text: "Entregue",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    case "completed":
      return {
        icon: <CheckCircle size={16} className="text-gray-500" />,
        text: "Concluído",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
    case "cancelled":
      return {
        icon: <AlertCircle size={16} className="text-red-500" />,
        text: "Cancelado",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    default:
      return {
        icon: <AlertCircle size={16} className="text-gray-500" />,
        text: "Desconhecido",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
  }
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Pedidos Recentes
        </h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          Ver todos
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <div
              key={order.order_id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-gray-400" />
                  <span className="font-mono text-sm font-medium text-gray-700">
                    {order.order_id.substring(0, 8)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {order.customer?.name || "Cliente não identificado"}
                  </span>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                >
                  {statusInfo.text}
                </span>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">
                  R$ {order.total_amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
