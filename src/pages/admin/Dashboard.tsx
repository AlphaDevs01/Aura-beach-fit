import React from 'react';
import { useState, useEffect } from 'react';
import { Package, Grid3X3, MessageSquare, TrendingUp, Users, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    whatsappInteractions: 0,
    todayViews: 0
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas
      const [productsCount, categoriesCount, interactionsCount, recentProductsData, recentInteractions] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('whatsapp_interactions').select('id', { count: 'exact' }),
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('whatsapp_interactions').select('*').order('created_at', { ascending: false }).limit(4)
      ]);

      // Get categories for recent products
      const { data: categoriesData } = await supabase.from('categories').select('*');
      const categoriesMap = new Map(categoriesData?.map(cat => [cat.id, cat]) || []);
      
      const productsWithCategories = (recentProductsData.data || []).map(product => ({
        ...product,
        category: product.category_id ? categoriesMap.get(product.category_id) : null
      }));
      setStats({
        products: productsCount.count || 0,
        categories: categoriesCount.count || 0,
        whatsappInteractions: interactionsCount.count || 0,
        todayViews: Math.floor(Math.random() * 1000) + 500 // Simulado
      });

      setRecentProducts(productsWithCategories);
      setRecentMessages(recentInteractions.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      title: 'Produtos',
      value: stats.products.toString(),
      change: '+12',
      changeType: 'increase',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Categorias',
      value: stats.categories.toString(),
      change: '+2',
      changeType: 'increase',
      icon: Grid3X3,
      color: 'bg-green-500'
    },
    {
      title: 'WhatsApp',
      value: stats.whatsappInteractions.toString(),
      change: '+8',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statsConfig.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs lg:text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500 ml-1 hidden sm:inline">este mês</span>
                </div>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Products */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Produtos Recentes</h2>
            <a href="/admin/produtos" className="text-pink-600 hover:text-pink-700 font-medium text-sm lg:text-base">
              Ver Todos
            </a>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-2 lg:py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm lg:text-base truncate">{product.name}</h3>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">{product.category?.name || 'Sem categoria'}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-semibold text-gray-900 text-sm lg:text-base">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {product.in_stock ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent WhatsApp Messages */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Mensagens Recentes</h2>
            <a href="/admin/mensagens" className="text-pink-600 hover:text-pink-700 font-medium text-sm lg:text-base">
              Ver Todas
            </a>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between py-2 lg:py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm lg:text-base truncate">{message.product_name}</h3>
                    <p className="text-xs lg:text-sm text-gray-600">Interesse via WhatsApp</p>
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-gray-500 flex-shrink-0 ml-4">
                  {new Date(message.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}