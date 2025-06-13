import React, { useState, useEffect } from "react";
import { getCustomers, getCustomerDetails } from "../../services/api";
import { Customer, CustomerDetails } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { CustomerDetailModal } from "../../components/customers/CustomerDetailModal";

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        // @ts-ignore
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar os clientes. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleRowClick = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
    setDetailsLoading(true);
    try {
      const details = await getCustomerDetails(customer.customer_id);
      setCustomerDetails(details);
    } catch (error) {
      console.error("Failed to fetch customer details", error);
      setCustomerDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111416] mb-2">Clientes</h1>
            <p className="text-[#607589]">
              Gerencie seus clientes e histórico de pedidos
            </p>
          </div>
          <Button className="bg-[#0c7ff2] hover:bg-[#0c7ff2]/90">
            <Plus size={20} className="mr-2" />
            Adicionar Cliente
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#607589]"
            />
            <Input
              placeholder="Buscar clientes por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-[#eff2f4]"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e8ea] overflow-hidden">
          <table className="min-w-full divide-y divide-[#e5e8ea]">
            <thead className="bg-[#f7f9fa]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#607589] uppercase tracking-wider"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#607589] uppercase tracking-wider"
                >
                  E-mail
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#607589] uppercase tracking-wider"
                >
                  WhatsApp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#607589] uppercase tracking-wider"
                >
                  Data de Cadastro
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e8ea]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <p className="text-[#607589] text-lg">
                      Carregando clientes...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-red-600">
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <p className="text-[#607589] text-lg">
                      Nenhum cliente encontrado
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    onClick={() => handleRowClick(customer)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111416]">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#607589]">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#607589]">
                      {customer.whatsapp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#607589]">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CustomerDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        details={customerDetails}
        isLoading={detailsLoading}
      />
    </>
  );
};
