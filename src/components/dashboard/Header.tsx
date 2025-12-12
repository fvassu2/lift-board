import React from 'react';
import { User, Bell, Menu } from 'lucide-react';
import type { Operator } from '../../types';

interface HeaderProps {
  operator: Operator;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ operator, onMenuClick }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors touch-manipulation"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold">Lift Board</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="relative p-2 hover:bg-blue-500 rounded-lg transition-colors touch-manipulation">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3 bg-blue-500 px-4 py-2 rounded-lg">
            <User size={24} />
            <div className="text-left">
              <div className="font-semibold">{operator.name}</div>
              <div className="text-xs text-blue-200">ID: {operator.id}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
