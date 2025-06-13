import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-lg text-gray-900">RestaurantePro</h1>
      </div>
      <button
        onClick={onMenuClick}
        className="text-gray-600 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};
