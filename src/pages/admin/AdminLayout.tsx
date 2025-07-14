import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Grid3X3, 
  ShoppingCart, 
  Settings, 
  LogOut,
  User,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Produtos', path: '/admin/produtos' },
    { icon: Grid3X3, label: 'Categorias', path: '/admin/categorias' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/mensagens' },
    { icon: Users, label: 'Admins', path: '/admin/usuarios' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
  ];

  const handleLogout = async () => {
    // Fazer logout do Supabase
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/admin/login');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const currentPage = menuItems.find(item => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.jpg" 
              alt="Aura beach & fit" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Admin
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src="/logo.jpg" 
              alt="Aura beach & fit" 
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {state.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {state.user?.email || 'admin@aurafitness.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                  {currentPage?.label || 'Admin'}
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                  Painel administrativo
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="text-pink-600 hover:text-pink-700 font-medium text-sm lg:text-base"
            >
              Ver Site
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}