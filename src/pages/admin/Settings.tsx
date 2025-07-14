import React, { useState, useEffect } from 'react';
import { Save, Store, Phone, Mail, MapPin, DollarSign, Truck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StoreSettings {
  id?: string;
  store_name: string;
  store_address: string;
  store_phone: string;
  store_email: string;
  logo_url: string;
  base_delivery_fee: number;
  minimum_order_value: number;
  delivery_radius_km: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: 'Aura beach & fit',
    store_address: '',
    store_phone: '(62) 99684-2833',
    store_email: '',
    logo_url: '',
    base_delivery_fee: 5.00,
    minimum_order_value: 25.00,
    delivery_radius_km: 10.00
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Como não temos tabela store_settings ainda, vamos usar valores padrão
      // const { data, error } = await supabase
      //   .from('store_settings')
      //   .select('*')
      //   .single();

      // if (error && error.code !== 'PGRST116') {
      //   throw error;
      // }

      // if (data) {
      //   setSettings(data);
      // }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StoreSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Implementação temporária - salvar no localStorage
      localStorage.setItem('store_settings', JSON.stringify(settings));
      
      // TODO: Implementar tabela store_settings no banco
      // const settingsData = {
      //   store_name: settings.store_name,
      //   store_address: settings.store_address,
      //   store_phone: settings.store_phone,
      //   store_email: settings.store_email,
      //   logo_url: settings.logo_url,
      //   base_delivery_fee: settings.base_delivery_fee,
      //   minimum_order_value: settings.minimum_order_value,
      //   delivery_radius_km: settings.delivery_radius_km,
      //   updated_at: new Date().toISOString()
      // };

      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Configurações da Loja</h1>
        <p className="text-sm lg:text-base text-gray-600">Gerencie as informações e configurações da sua loja</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Store Information */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5" />
            Informações da Loja
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Loja
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="text"
                value={settings.store_phone}
                onChange={(e) => handleInputChange('store_phone', e.target.value)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                placeholder="(62) 99684-2833"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => handleInputChange('store_email', e.target.value)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                placeholder="contato@bellarosa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Logo
              </label>
              <input
                type="url"
                value={settings.logo_url}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                placeholder="https://exemplo.com/logo.png"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <textarea
                value={settings.store_address}
                onChange={(e) => handleInputChange('store_address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                placeholder="Rua, número, bairro, cidade, estado, CEP"
              />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Configurações de Entrega
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa Base de Entrega (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.base_delivery_fee}
                onChange={(e) => handleInputChange('base_delivery_fee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Mínimo do Pedido (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.minimum_order_value}
                onChange={(e) => handleInputChange('minimum_order_value', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raio de Entrega (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.delivery_radius_km}
                onChange={(e) => handleInputChange('delivery_radius_km', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Integration */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Integração WhatsApp
          </h2>
          
          <div className="bg-green-50 p-3 lg:p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Número Configurado</h3>
            <p className="text-green-700 mb-2 text-sm lg:text-base">
              <strong>Telefone:</strong> {settings.store_phone}
            </p>
            <p className="text-green-600 text-xs lg:text-sm">
              Este número será usado para receber mensagens dos clientes interessados nos produtos.
              Certifique-se de que o WhatsApp Business está ativo neste número.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm lg:text-base"
          >
            {saving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}