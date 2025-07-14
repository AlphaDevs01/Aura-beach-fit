import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, Calendar, User, Package, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

interface WhatsAppInteraction {
  id: string;
  product_id: string;
  product_name: string;
  created_at: string;
  user_agent: string | null;
  ip_address: string | null;
}

export default function Orders() {
  const { state, dispatch } = useApp();
  const [whatsappInteractions, setWhatsappInteractions] = useState<WhatsAppInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'whatsapp'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Simular alguns pedidos para demonstração
  useEffect(() => {
    if (state.orders.length === 0) {
      // Adicionar pedidos de exemplo
      const sampleOrders = [
        {
          id: 'order_001',
          customer_name: 'Maria Silva',
          customer_phone: '(62) 99999-9999',
          customer_email: 'maria@email.com',
          delivery_address: 'Rua das Flores, 123 - Goiânia/GO',
          total_amount: 299.80,
          delivery_fee: 0,
          status: 'pending' as const,
          order_items: [],
          created_at: new Date().toISOString()
        },
        {
          id: 'order_002',
          customer_name: 'Ana Costa',
          customer_phone: '(62) 98888-8888',
          customer_email: 'ana@email.com',
          delivery_address: 'Av. Principal, 456 - Aparecida/GO',
          total_amount: 189.90,
          delivery_fee: 0,
          status: 'confirmed' as const,
          order_items: [],
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
        }
      ];
      
      dispatch({ type: 'SET_ORDERS', payload: sampleOrders });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar interações WhatsApp
      const { data: whatsappData, error: whatsappError } = await supabase
        .from('whatsapp_interactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (whatsappError) throw whatsappError;

      setWhatsappInteractions(whatsappData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      dispatch({ 
        type: 'UPDATE_ORDER_STATUS', 
        payload: { orderId, status: newStatus } 
      });
      console.log(`Status do pedido ${orderId} atualizado para ${newStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const sendWhatsAppMessage = (phone: string, customerName: string, orderId: string) => {
    const message = `Olá ${customerName}! 👋

Seu pedido #${orderId.slice(-8)} foi atualizado.

Qualquer dúvida, estamos aqui para ajudar!

Atenciosamente,
Equipe Aura beach & fit💕`;

    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendProductWhatsApp = (productName: string) => {
    const message = `Olá! 👋

Vi que você demonstrou interesse no produto: *${productName}*

Gostaria de saber mais informações? Estou aqui para ajudar! 😊

Atenciosamente,
Equipe Aura beach & fit 💕`;

    const whatsappUrl = `https://wa.me/5562996842833?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Pedidos e Mensagens</h1>
        <p className="text-sm lg:text-base text-gray-600">Gerencie pedidos e interações com clientes</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Pedidos ({state.orders.length})
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 px-1 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            WhatsApp ({whatsappInteractions.length})
          </button>
        </nav>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {state.orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-sm lg:text-base text-gray-600">Os pedidos aparecerão aqui quando forem realizados</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block lg:hidden">
                {state.orders.map((order) => (
                  <div key={order.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">#{order.id.slice(-8)}</h3>
                        <p className="text-xs text-gray-600">{order.customer_name}</p>
                        <p className="text-xs text-gray-600">{order.customer_phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-pink-600 text-sm">
                          R$ {order.total_amount.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </button>
                      <button
                        onClick={() => sendWhatsAppMessage(order.customer_phone, order.customer_name, order.id)}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Pedido</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {state.orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-medium text-gray-900">#{order.id.slice(-8)}</span>
                          <div className="text-sm text-gray-600">
                            {order.order_items?.length || 0} item(s)
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-600">{order.customer_phone}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          R$ {order.total_amount.toFixed(2).replace('.', ',')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pendente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                          <button
                            onClick={() => sendWhatsAppMessage(order.customer_phone, order.customer_name, order.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      )}

      {/* WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {whatsappInteractions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Nenhuma interação encontrada</h3>
              <p className="text-sm lg:text-base text-gray-600">As interações via WhatsApp aparecerão aqui</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block lg:hidden">
                {whatsappInteractions.map((interaction) => (
                  <div key={interaction.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">{interaction.product_name}</h3>
                          <p className="text-xs text-gray-600">Interesse via WhatsApp</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(interaction.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => sendProductWhatsApp(interaction.product_name)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors text-xs flex-shrink-0"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Enviar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Produto</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Data/Hora</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {whatsappInteractions.map((interaction) => (
                    <tr key={interaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{interaction.product_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(interaction.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => sendProductWhatsApp(interaction.product_name)}
                          className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Enviar Mensagem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  Pedido #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 lg:space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informações do Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome</label>
                      <p className="text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Telefone</label>
                      <p className="text-gray-900">{selectedOrder.customer_phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">E-mail</label>
                      <p className="text-gray-900">{selectedOrder.customer_email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Endereço de Entrega</label>
                      <p className="text-gray-900">{selectedOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Itens do Pedido
                  </h3>
                  <div className="space-y-3">
                    {(selectedOrder.order_items || []).map((item, index) => (
                      <div key={item.id || index} className="flex items-center gap-4 p-3 border rounded-lg">
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product?.name || 'Produto'}</h4>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          {item.size && <p className="text-sm text-gray-600">Tamanho: {item.size}</p>}
                          {item.color && <p className="text-sm text-gray-600">Cor: {item.color}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            R$ {(item.total_price || 0).toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-sm text-gray-600">
                            R$ {(item.unit_price || 0).toFixed(2).replace('.', ',')} cada
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {(selectedOrder.total_amount - (selectedOrder.delivery_fee || 0)).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Entrega:</span>
                      <span>R$ {(selectedOrder.delivery_fee || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>R$ {(selectedOrder.total_amount || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => sendWhatsAppMessage(selectedOrder.customer_phone, selectedOrder.customer_name, selectedOrder.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar WhatsApp
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}