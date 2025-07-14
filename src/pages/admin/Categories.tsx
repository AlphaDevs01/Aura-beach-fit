import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Image, Grid3X3 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { supabase, isAuthenticated } from '../../lib/supabase';

interface CategoryForm {
  id?: string;
  name: string;
  slug: string;
  image: string;
}

export default function Categories() {
  const { categories, loading, refetch } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryForm | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    slug: '',
    image: ''
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: keyof CategoryForm, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from name
      if (field === 'name') {
        updated.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
      
      return updated;
    });
  };

  const openForm = (category?: any) => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image
      });
      setEditingCategory(category);
    } else {
      setFormData({ name: '', slug: '', image: '' });
      setEditingCategory(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', image: '' });
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
      if (!formData.name || !formData.slug || !formData.image) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        setSaving(false);
        return;
      }

      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        image: formData.image,
        updated_at: new Date().toISOString()
      };

      console.log('Saving category data:', categoryData);
      console.log('Edit mode:', !!editingCategory, 'Category ID:', formData.id);

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', formData.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Categoria atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Categoria criada com sucesso');
      }

      await refetch();
      closeForm();
      alert(editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert(`Erro ao salvar categoria: ${error?.message || 'Tente novamente.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) return;

    try {
      // Check authentication
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        alert('Você precisa estar logado para realizar esta operação.');
        return;
      }

      // Verificar se há produtos vinculados
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);

      if (count && count > 0) {
        alert(`Não é possível excluir esta categoria pois há ${count} produto(s) vinculado(s) a ela.`);
        return;
      }

      console.log('Excluindo categoria:', id);
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Categoria excluída com sucesso');
      await refetch();
      alert('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert(`Erro ao excluir categoria: ${error?.message || 'Verifique se não há produtos vinculados.'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-sm lg:text-base text-gray-600">Gerencie as categorias dos produtos</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg flex items-center gap-2 transition-colors text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Categoria</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-3 lg:p-4">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base truncate">{category.name}</h3>
              <p className="text-xs lg:text-sm text-gray-600 mb-2 truncate">/{category.slug}</p>
              <p className="text-sm text-gray-500 mb-4">
                {category.productCount || 0} produtos
              </p>
              
              <div className="flex gap-1 lg:gap-2">
                <button
                  onClick={() => openForm(category)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-2 lg:px-3 lg:py-2 rounded-lg flex items-center justify-center gap-1 lg:gap-2 transition-colors text-xs lg:text-sm"
                >
                  <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-2 lg:px-3 lg:py-2 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid3X3 className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-6">Crie sua primeira categoria para organizar os produtos</p>
          <button
            onClick={() => openForm()}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base"
          >
            Criar Primeira Categoria
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    placeholder="Ex: Vestidos"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    placeholder="vestidos"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /categoria/{formData.slug}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </div>

                {formData.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview da Imagem
                    </label>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

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
                        {editingCategory ? 'Atualizar' : 'Criar'}
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