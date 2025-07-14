import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, MessageCircle, Share2 } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useApp } from '../context/AppContext';
import { generateWhatsAppLink } from '../utils/whatsapp';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id!);
  const { state, dispatch } = useApp();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Produto não encontrado'}
          </h1>
          <Link to="/produtos" className="text-pink-600 hover:text-pink-700">
            Voltar aos produtos
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = state.favorites.some(fav => fav.id === product.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
    }
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      }
    });
  };

  const handleWhatsApp = () => {
    const whatsappUrl = generateWhatsAppLink(product);
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-pink-600">Início</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-pink-600">Produtos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/produtos"
          className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos produtos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] mb-4 overflow-hidden rounded-xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.is_new && (
                <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full">
                  Novo
                </span>
              )}
              {product.is_best_seller && (
                <span className="bg-purple-500 text-white text-sm px-3 py-1 rounded-full">
                  Mais Vendido
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-pink-600">
                R$ {Number(product.price).toFixed(2).replace('.', ',')}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-500 line-through">
                  R$ {Number(product.original_price).toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tamanho</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Cor</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Adicionar ao Carrinho
                </button>
                
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Quero esse produto (WhatsApp)
              </button>

              <button
                onClick={handleShare}
                className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
            </div>

            {/* Stock Status */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium">
                {product.in_stock ? '✓ Produto em estoque' : '✗ Produto fora de estoque'}
              </p>
              <p className="text-green-600 text-sm">Envio em até 2 dias úteis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}