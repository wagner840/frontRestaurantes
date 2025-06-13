import React, { useState } from "react";
import { BarChart3, Settings } from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header"; // Importa o Header
import { Dashboard } from "../Dashboard/Dashboard";
import { Menu } from "../Menu/Menu";
import { Orders } from "../Orders/Orders";
import { Customers } from "../Customers/Customers";
import { useAuth } from "../../hooks/useAuth";

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Estado para a sidebar
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "menu":
        return <Menu />;
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      case "analytics":
        return (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Relatórios
              </h1>
              <p className="text-gray-600 mb-8">
                Análise detalhada do desempenho do seu restaurante
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Em desenvolvimento
                </h3>
                <p className="text-gray-500">
                  Relatórios avançados estarão disponíveis em breve.
                </p>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Configurações
              </h1>
              <p className="text-gray-600 mb-8">
                Personalize as configurações do seu restaurante
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Em desenvolvimento
                </h3>
                <p className="text-gray-500">
                  Painel de configurações estará disponível em breve.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};
