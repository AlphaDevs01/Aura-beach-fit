import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state, dispatch } = useApp();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleAdminToggle = () => {
    dispatch({ type: 'TOGGLE_ADMIN_MODE' });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (isAdminRoute) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Aura beach & fit" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent hidden sm:block">
              Aura beach & fit
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent sm:hidden">
              Aura beach & fit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Início
            </Link>
            <Link 
              to="/produtos" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Produtos
            </Link>
            <Link 
              to="/categorias" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Categorias
            </Link>
            <Link 
              to="/contato" 
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex p-2 hover:bg-pink-50 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Favorites */}
            <Link 
              to="/favoritos" 
              className="p-2 hover:bg-pink-50 rounded-full transition-colors relative"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5 text-gray-600" />
              {state.favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {state.favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/carrinho" 
              className="p-2 hover:bg-pink-50 rounded-full transition-colors relative"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {state.cart.length}
                </span>
              )}
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-pink-50 rounded-full transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="py-4 border-t bg-white">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium px-2 py-1"
                  onClick={closeMenu}
                >
                  Início
                </Link>
                <Link 
                  to="/produtos" 
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium px-2 py-1"
                  onClick={closeMenu}
                >
                  Produtos
                </Link>
                <Link 
                  to="/categorias" 
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium px-2 py-1"
                  onClick={closeMenu}
                >
                  Categorias
                </Link>
                
                {/* Mobile-only actions */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}