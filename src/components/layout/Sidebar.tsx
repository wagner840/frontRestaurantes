import React from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "menu", label: "Cardápio", icon: UtensilsCrossed },
  { id: "orders", label: "Pedidos", icon: ShoppingBag },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "analytics", label: "Relatórios", icon: BarChart3 },
  { id: "settings", label: "Configurações", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      ></div>

      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-40",
          "transition-transform duration-300 ease-in-out",
          "w-64 md:w-64 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                RestaurantePro
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      onClose(); // Close sidebar on tab change in mobile
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                      activeTab === item.id
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};
