import React from "react";
import { Customer } from "../../types";
import {
  X,
  User,
  Phone,
  Mail,
  ShoppingCart,
  DollarSign,
  Calendar,
} from "lucide-react";

interface CustomerDetails {
  totalOrders: number;
  totalSpent: number;
  favoriteDays: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  details: CustomerDetails | null;
  isLoading: boolean;
}

export const CustomerDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customer,
  details,
  isLoading,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.name}
              </h2>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">Carregando detalhes...</div>
          ) : details ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informações de Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Contato
                </h3>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-700">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-700">{customer.whatsapp}</span>
                </div>
              </div>

              {/* Estatísticas de Compra */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Histórico de Compras
                </h3>
                <div className="flex items-center gap-3">
                  <ShoppingCart size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    {details.totalOrders} pedidos realizados
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    R$ {details.totalSpent.toFixed(2)} gastos no total
                  </span>
                </div>
              </div>

              {/* Hábitos de Compra */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Hábitos
                </h3>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-gray-700">Dias preferidos para pedir:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {details.favoriteDays.length > 0 ? (
                        details.favoriteDays.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize"
                          >
                            {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Não há dados suficientes.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-red-500">
              Falha ao carregar detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
