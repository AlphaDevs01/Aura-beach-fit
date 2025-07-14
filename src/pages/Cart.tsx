import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCartWhatsAppLink } from '../utils/whatsapp';

export default function Cart() {
  const { state, dispatch } = useApp();

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      const item = state.cart.find(item => item.product.id === productId);
      if (item) {
        dispatch({
          type: 'UPDATE_CART_QUANTITY',
          payload: {
            productId,
            size: item.size,
            color: item.color,
            quantity: newQuantity
          }
        });
      }
    }
  };

  const updateQuantityWithDetails = (productId: string, size: string | undefined, color: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ 
        type: 'REMOVE_FROM_CART', 
        payload: { productId, size, color }
      });
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { productId, size, color, quantity: newQuantity }
      });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const total = state.cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

  const handleWhatsAppOrder = () => {
    if (state.cart.length === 0) return;
    
    const whatsappUrl = generateCartWhatsAppLink(state.cart);
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppEduarda = () => {
    if (state.cart.length === 0) return;
    
    const whatsappUrl = generateCartWhatsAppLink(state.cart, '5562986371021');
    window.open(whatsappUrl, '_blank');
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">Adicione alguns produtos incríveis ao seu carrinho</p>
          <Link
            to="/produtos"
            className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Limpar Carrinho
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.cart.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <Link to={`/produto/${item.product.id}`}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <Link to={`/produto/${item.product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-pink-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.size && <p>Tamanho: {item.size}</p>}
                      {item.color && <p>Cor: {item.color}</p>}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantityWithDetails(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantityWithDetails(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-pink-600">
                          R$ {(Number(item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => dispatch({ 
                            type: 'REMOVE_FROM_CART', 
                            payload: { productId: item.product.id, size: item.size, color: item.color }
                          })}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({state.cart.length} itens)</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsAppEduarda}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                Finalizar com Eduarda
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                Finalizar com Vanessa
              </button>

              <Link
                to="/produtos"
                className="w-full border border-pink-500 text-pink-600 hover:bg-pink-50 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                Continuar Comprando
              </Link>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium text-sm">✓ Frete grátis para todo o Brasil</p>
                <p className="text-green-600 text-sm">✓ Troca grátis em até 30 dias</p>
                <p className="text-green-600 text-sm">✓ Compra 100% segura</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}