import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { state, dispatch } = useApp();

  const isFavorite = state.favorites.some(fav => fav.id === product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        quantity: 1
      }
    });
  };

  return (
    <div className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.is_new && (
          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Novo
          </span>
        )}
        {product.is_best_seller && (
          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Mais Vendido
          </span>
        )}
        {product.original_price && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Promoção
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-all duration-200"
      >
        <Heart 
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
        />
      </button>

      <Link to={`/produto/${product.id}`}>
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-pink-600">
              R$ {Number(product.price).toFixed(2).replace('.', ',')}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">
                R$ {Number(product.original_price).toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          {/* Sizes */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(product.sizes || []).slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md"
              >
                {size}
              </span>
            ))}
            {(product.sizes || []).length > 4 && (
              <span className="text-xs text-gray-500">+{(product.sizes || []).length - 4}</span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </Link>
    </div>
  );
}