import React, { useState, useEffect } from "react";
import { MenuItemCard } from "../../components/menu/MenuItemCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { getMenuItems } from "../../services/api";
import { MenuItem } from "../../types";

export const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menuItems = await getMenuItems();
        setItems(menuItems);

        const uniqueCategories = [
          ...new Set(menuItems.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        setError(null);
      } catch (err) {
        setError("Falha ao carregar o cardápio. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: MenuItem) => {
    // TODO: Implement edit functionality
    console.log("Edit item:", item);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality with API call
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111416] mb-2">Cardápio</h1>
          <p className="text-[#607589]">Gerencie os itens do seu cardápio</p>
        </div>
        <Button className="bg-[#0c7ff2] hover:bg-[#0c7ff2]/90">
          <Plus size={20} className="mr-2" />
          Adicionar Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#607589]"
          />
          <Input
            placeholder="Buscar itens do cardápio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-[#eff2f4]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-lg border border-[#e5e8ea] bg-white text-[#111416] focus:outline-none focus:ring-2 focus:ring-[#0c7ff2]"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Carregando cardápio...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Nenhum item encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
