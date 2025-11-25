import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Camera, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/pesquisa', icon: Search, label: 'Pesquisa' },
    { path: '/perfil', icon: User, label: 'Perfil' },
    { path: '/medpix', icon: Camera, label: 'MedPix' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-700">MedApp</h1>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/pesquisa"
              className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;