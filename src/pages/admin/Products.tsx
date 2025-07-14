import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Image, Eye, EyeOff, Package } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { supabase, isAuthenticated } from '../../lib/supabase';

interface ProductForm {
  id?: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_id: string;
  sizes: string[];
  colors: string[];
  images: string[];
  is_new: boolean;
  is_best_seller: boolean;
  in_stock: boolean;
}

export default function Products() {
  const { products, loading, refetch } = useProducts();
  const { categories } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    original_price: undefined,
    category_id: '',
    sizes: [],
    colors: [],
    images: [''],
    is_new: false,
    is_best_seller: false,
    in_stock: true
  });
  const [saving, setSaving] = useState(false);

  const availableSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
  const availableColors = ['Branco', 'Preto', 'Rosa', 'Azul', 'Verde', 'Amarelo', 'Vermelho', 'Cinza', 'Bege', 'Marrom'];

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'sizes' | 'colors', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const openForm = (product?: any) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        category_id: product.category_id,
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [''],
        is_new: product.is_new,
        is_best_seller: product.is_best_seller,
        in_stock: product.in_stock
      });
      setEditingProduct(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        original_price: undefined,
        category_id: '',
        sizes: [],
        colors: [],
        images: [''],
        is_new: false,
        is_best_seller: false,
        in_stock: true
      });
      setEditingProduct(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Check authentication
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        alert('Você precisa estar logado para realizar esta operação.');
        setSaving(false);
        return;
      }

      // Validar dados obrigatórios
      if (!formData.name || !formData.category_id || !formData.price) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        setSaving(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        original_price: formData.original_price || null,
        category_id: formData.category_id,
        sizes: formData.sizes,
        colors: formData.colors,
        images: formData.images.filter(img => img.trim() !== ''),
        is_new: formData.is_new,
        is_best_seller: formData.is_best_seller,
        in_stock: formData.in_stock,
        updated_at: new Date().toISOString()
      };

      console.log('Saving product data:', productData);
      console.log('Edit mode:', !!editingProduct, 'Product ID:', formData.id);

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', formData.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Produto atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Produto criado com sucesso');
      }

      await refetch();
      closeForm();
      alert(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(`Erro ao salvar produto: ${error?.message || 'Tente novamente.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) return;

    try {
      // Check authentication
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        alert('Você precisa estar logado para realizar esta operação.');
        return;
      }

      console.log('Excluindo produto:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Produto excluído com sucesso');
      await refetch();
      alert('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert(`Erro ao excluir produto: ${error?.message || 'Tente novamente.'}`);
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Check authentication
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        alert('Você precisa estar logado para realizar esta operação.');
        return;
      }

      console.log('Alterando status do produto:', id, 'para:', !currentStatus);
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Status update error:', error);
        throw error;
      }
      console.log('Status alterado com sucesso');
      await refetch();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert(`Erro ao alterar status: ${error?.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm lg:text-base text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg flex items-center gap-2 transition-colors text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Produto</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          {products.map((product) => (
            <div key={product.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-gray-600 truncate">
                        {categories.find(cat => cat.id === product.category_id)?.name || 'Sem categoria'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleProductStatus(product.id, product.in_stock)}
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                        product.in_stock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.in_stock ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.original_price && (
                        <div className="text-xs text-gray-500 line-through">
                          R$ {product.original_price.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openForm(product)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    {product.is_new && (
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Novo</span>
                    )}
                    {product.is_best_seller && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Best Seller</span>
                    )}
                  </div>
                </div>
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Categoria</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Preço</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="flex gap-1 mt-1">
                          {product.is_new && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Novo</span>
                          )}
                          {product.is_best_seller && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Best Seller</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {categories.find(cat => cat.id === product.category_id)?.name || 'Sem categoria'}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-semibold text-gray-900">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.original_price && (
                        <div className="text-sm text-gray-500 line-through">
                          R$ {product.original_price.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleProductStatus(product.id, product.in_stock)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        product.in_stock
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {product.in_stock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {product.in_stock ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openForm(product)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-6">Adicione seu primeiro produto ao catálogo</p>
            <button
              onClick={() => openForm()}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base"
            >
              Adicionar Primeiro Produto
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    min="0"
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                    min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Original (R$) - Opcional
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.original_price || ''}
                      onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value) || undefined)}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanhos Disponíveis
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleArrayChange('sizes', size)}
                        className={`px-2 py-1 lg:px-3 lg:py-1 rounded-lg border transition-colors text-sm ${
                          formData.sizes.includes(size)
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cores Disponíveis
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleArrayChange('colors', color)}
                        className={`px-2 py-1 lg:px-3 lg:py-1 rounded-lg border transition-colors text-sm ${
                          formData.colors.includes(color)
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens do Produto
                  </label>
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-2 lg:px-3 lg:py-2 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm lg:text-base"
                    >
                      + Adicionar mais uma imagem
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => handleInputChange('is_new', e.target.checked)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Produto Novo</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_best_seller}
                      onChange={(e) => handleInputChange('is_best_seller', e.target.checked)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mais Vendido</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Em Estoque</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 lg:px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-2 px-3 lg:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base"
                  >
                    {saving ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingProduct ? 'Atualizar' : 'Criar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}