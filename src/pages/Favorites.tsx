import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  const { state } = useApp();

  if (state.favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seus favoritos estão vazios</h1>
          <p className="text-gray-600 mb-8">Adicione produtos aos seus favoritos para vê-los aqui</p>
          <Link
            to="/produtos"
            className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Explorar Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
            <p className="text-gray-600">Produtos que você salvou para depois</p>
          </div>
          <Link
            to="/produtos"
            className="text-pink-600 hover:text-pink-700 font-semibold flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar Comprando
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="font-medium text-gray-900">
                {state.favorites.length} {state.favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Total estimado: R$ {state.favorites.reduce((sum, product) => sum + Number(product.price), 0).toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <ShoppingBag className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pronto para comprar?</h2>
            <p className="text-gray-600 mb-6">
              Adicione seus produtos favoritos ao carrinho e finalize sua compra
            </p>
            <Link
              to="/carrinho"
              className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Ver Carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}